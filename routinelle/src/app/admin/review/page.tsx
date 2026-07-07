import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isCatalogAdmin } from "@/lib/supabase/catalog-admin";
import { createClient } from "@/lib/supabase/server";
import { hasEnvVars } from "@/lib/utils";

type CountRow = { count: number };

export default function AdminReviewPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Content />
    </Suspense>
  );
}

function Loading() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] px-4 py-8 text-[#1f2a24]">
      <Card className="mx-auto max-w-3xl rounded-lg border-[#d8d0c3] bg-white/85 shadow-none">
        <CardHeader>
          <CardTitle>Loading review</CardTitle>
          <CardDescription>Checking internal review access.</CardDescription>
        </CardHeader>
      </Card>
    </main>
  );
}

async function Content() {
  await connection();

  if (!hasEnvVars) {
    return (
      <main className="min-h-screen bg-[#f7f4ef] px-4 py-8 text-[#1f2a24]">
        <Card className="mx-auto max-w-3xl rounded-lg border-[#d8d0c3] bg-white/85 shadow-none">
          <CardHeader>
            <CardTitle>Review setup needed</CardTitle>
            <CardDescription>
              Supabase must be configured before analytics and safety review is
              available.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || !userId) {
    redirect("/auth/login?next=/admin/review");
  }

  if (!(await isCatalogAdmin(supabase, userId))) {
    return (
      <main className="min-h-screen bg-[#f7f4ef] px-4 py-8 text-[#1f2a24]">
        <Card className="mx-auto max-w-3xl rounded-lg border-[#d8d0c3] bg-white/85 shadow-none">
          <CardHeader>
            <CardTitle>Internal access required</CardTitle>
            <CardDescription>
              This view is restricted to authorized operators.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  const [analytics, safety] = await Promise.all([
    supabase.from("analytics_events").select("*", { count: "exact", head: true }),
    supabase.from("safety_events").select("*", { count: "exact", head: true }),
  ]);

  if (analytics.error) throw analytics.error;
  if (safety.error) throw safety.error;

  const counts: CountRow[] = [
    { count: analytics.count ?? 0 },
    { count: safety.count ?? 0 },
  ];

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-4 py-6 text-[#1f2a24] sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <nav className="flex items-center justify-between text-sm">
          <Link href="/" className="font-semibold">
            Routinelle
          </Link>
          <Button asChild variant="outline" className="rounded-lg">
            <Link href="/admin/catalog-coverage">Coverage</Link>
          </Button>
        </nav>
        <Card className="rounded-lg border-[#d8d0c3] bg-white/85 shadow-none">
          <CardHeader>
            <CardTitle>Safety and analytics review</CardTitle>
            <CardDescription>
              Aggregated operational signals only. No dashboard control changes
              personalized ranking.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-[#d8d0c3] bg-[#fbfaf7] p-4">
              <p className="text-sm font-semibold">Analytics events</p>
              <p className="mt-2 text-3xl font-semibold">{counts[0].count}</p>
            </div>
            <div className="rounded-lg border border-[#d8d0c3] bg-[#fbfaf7] p-4">
              <p className="text-sm font-semibold">Safety events</p>
              <p className="mt-2 text-3xl font-semibold">{counts[1].count}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
