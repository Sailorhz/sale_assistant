import { apiError, apiOk } from "@/lib/api/response";
import { buildAnalyticsEvent } from "@/lib/analytics/events";
import { trackAnalyticsEvent } from "@/lib/supabase/routine-actions";
import { trackProductClick } from "@/lib/supabase/routine-actions";
import { createClient } from "@/lib/supabase/server";
import { hasEnvVars } from "@/lib/utils";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const allowedLinkStatuses = new Set(["available", "stale", "unavailable", "unknown"]);

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return apiError("validation", "Request body must be valid JSON.", 400);
  }

  if (!hasEnvVars) {
    return apiOk({
      tracked: false,
      message: "Product link is external. Tracking is unavailable without account services.",
    });
  }

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const userId = data?.claims?.sub ?? null;
    const productId = typeof body.productId === "string" ? body.productId : null;
    const routineId = typeof body.routineId === "string" ? body.routineId : null;
    const linkStatus =
      typeof body.linkStatus === "string" && allowedLinkStatuses.has(body.linkStatus)
        ? (body.linkStatus as "available" | "stale" | "unavailable" | "unknown")
        : "unknown";

    if (!productId || !uuidPattern.test(productId)) {
      return apiError("validation", "A valid product ID is required.", 400);
    }

    const trackableRoutineId = routineId && uuidPattern.test(routineId) ? routineId : null;

    await trackProductClick(supabase, {
      userId,
      productId,
      routineId: trackableRoutineId,
      linkStatus,
    });
    await trackAnalyticsEvent(
      supabase,
      userId,
      buildAnalyticsEvent("product.clicked", {
        productId,
        routineId: trackableRoutineId,
        linkStatus,
      }),
    ).catch(() => undefined);

    return apiOk({ tracked: true });
  } catch {
    return apiOk({ tracked: false });
  }
}
