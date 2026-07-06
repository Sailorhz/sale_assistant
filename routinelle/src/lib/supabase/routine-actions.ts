import type { SupabaseClient } from "@supabase/supabase-js";

import type { AnalyticsEvent } from "@/lib/analytics/events";
import type { RoutineCheckInInput } from "@/lib/domain/check-in";
import { summarizeCheckInOutcome } from "@/lib/domain/check-in";

export async function trackAnalyticsEvent(
  supabase: SupabaseClient,
  userId: string | null,
  event: AnalyticsEvent,
) {
  const { error } = await supabase.from("analytics_events").insert({
    user_id: userId,
    event_name: event.eventName,
    payload: event.payload,
  });

  if (error) throw error;
}

export async function trackProductClick(
  supabase: SupabaseClient,
  input: {
    userId: string | null;
    routineId: string | null;
    productId: string | null;
    linkStatus: "available" | "stale" | "unavailable" | "unknown";
  },
) {
  const { error } = await supabase.from("product_action_events").insert({
    user_id: input.userId,
    routine_id: input.routineId,
    product_id: input.productId,
    action_type: "product_click",
    link_status: input.linkStatus,
  });

  if (error) throw error;
}

export async function submitRoutineCheckIn(
  supabase: SupabaseClient,
  userId: string,
  input: RoutineCheckInInput,
) {
  const summary = summarizeCheckInOutcome(input);
  const { data, error } = await supabase
    .from("routine_check_ins")
    .insert({
      user_id: userId,
      routine_id: input.routineId,
      adherence: input.adherenceByStep,
      outcomes: input,
      outcome_summary: summary,
    })
    .select("id,created_at")
    .single<{ id: string; created_at: string }>();

  if (error) throw error;

  return { id: data.id, createdAt: data.created_at, summary };
}

export async function logSafetyEvent(
  supabase: SupabaseClient,
  input: {
    userId: string | null;
    routineId: string | null;
    productId: string | null;
    category: string;
    severity: "low" | "medium" | "high";
    context: Record<string, string | number | boolean | null>;
  },
) {
  const { error } = await supabase.from("safety_events").insert({
    user_id: input.userId,
    routine_id: input.routineId,
    product_id: input.productId,
    category: input.category,
    severity: input.severity,
    context: input.context,
  });

  if (error) throw error;
}
