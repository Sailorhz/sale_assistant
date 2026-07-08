import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

import { CheckInForm } from "@/components/routinelle/check-in/check-in-form";
import { RoutineView } from "@/components/routinelle/routine/routine-view";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { emptyOnboardingAnswers } from "@/lib/domain/skin-profile";
import { buildRoutineExplanationBundle } from "@/lib/explanations/rationale-builder";
import { getGeneratedRoutine } from "@/lib/supabase/generated-routines";
import { createClient } from "@/lib/supabase/server";
import { hasEnvVars } from "@/lib/utils";

export default function RoutineDetailPage({
  params,
}: {
  params: Promise<{ routineId: string }>;
}) {
  return (
    <Suspense fallback={<Loading />}>
      <Content params={params} />
    </Suspense>
  );
}

function Loading() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] px-4 py-8 text-[#1f2a24]">
      <Card className="mx-auto max-w-3xl rounded-lg border-[#d8d0c3] bg-white/85 shadow-none">
        <CardHeader>
          <CardTitle>Loading routine</CardTitle>
          <CardDescription>Checking saved routine details.</CardDescription>
        </CardHeader>
      </Card>
    </main>
  );
}

async function Content({
  params,
}: {
  params: Promise<{ routineId: string }>;
}) {
  await connection();
  const { routineId } = await params;

  if (!hasEnvVars) {
    return (
      <main className="min-h-screen bg-[#f7f4ef] px-4 py-8 text-[#1f2a24]">
        <Card className="mx-auto max-w-3xl rounded-lg border-[#d8d0c3] bg-white/85 shadow-none">
          <CardHeader>
            <CardTitle>Routine account setup needed</CardTitle>
            <CardDescription>
              Supabase must be configured before saved routines can be viewed.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect(`/auth/login?next=/routines/${routineId}`);
  }

  let routine;
  try {
    routine = await getGeneratedRoutine(supabase, routineId);
  } catch {
    return (
      <main className="min-h-screen bg-[#f7f4ef] px-4 py-8 text-[#1f2a24]">
        <Card className="mx-auto max-w-3xl rounded-lg border-[#d8d0c3] bg-white/85 shadow-none">
          <CardHeader>
            <CardTitle>Routine not found</CardTitle>
            <CardDescription>
              This routine does not exist, or is not available on your
              account. <Link href="/account" className="underline underline-offset-4">Go to your account</Link> to
              view your saved routines.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  const explanations = buildRoutineExplanationBundle(
    routine,
    routine.profileSnapshot ?? emptyOnboardingAnswers,
  );

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-4 py-6 text-[#1f2a24] sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <nav className="flex items-center justify-between text-sm">
          <Link href="/" className="font-semibold">
            Routinelle
          </Link>
          <Link href="/account">Account</Link>
        </nav>
        <RoutineView routine={routine} explanations={explanations} />
        <p className="rounded-lg border border-[#d8d0c3] bg-white p-4 text-sm text-[#53685d]">
          Product links can become stale. Regenerate recommendations when your
          profile, budget, market, or product availability changes.
        </p>
        <CheckInForm
          routineId={routine.id}
          stepIds={routine.sections.flatMap((section) =>
            section.steps.map((step) => step.id),
          )}
        />
      </div>
    </main>
  );
}
