import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

import { AccountDataPanel } from "@/components/routinelle/account/account-data-panel";
import { PrivacyConsentPanel } from "@/components/routinelle/account/privacy-consent-panel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { hasEnvVars } from "@/lib/utils";

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountLoading />}>
      <AccountContent />
    </Suspense>
  );
}

function AccountLoading() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-[#f7f4ef] px-4 py-8 text-[#1f2a24] sm:px-6"
    >
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-xl items-center">
        <Card className="w-full rounded-lg border-[#d8d0c3] bg-white/85 shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl">Loading account</CardTitle>
            <CardDescription>
              Checking whether this account area is ready.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
}

async function AccountContent() {
  await connection();

  if (!hasEnvVars) {
    return (
      <main
        id="main-content"
        className="min-h-screen bg-[#f7f4ef] px-4 py-8 text-[#1f2a24] sm:px-6"
      >
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-xl items-center">
          <Card className="w-full rounded-lg border-[#d8d0c3] bg-white/85 shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl">Account setup needed</CardTitle>
              <CardDescription className="leading-6">
                Routinelle can show the public preview without Supabase, but
                account saving and tracking need Supabase environment variables.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-[#53685d]">
                Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> to{" "}
                <code>.env.local</code> before testing login, signup, and saved
                routines.
              </p>
              <Button
                asChild
                className="rounded-lg bg-[#31463a] text-white hover:bg-[#26372e]"
              >
                <Link href="/">Back to public preview</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (error || !user) {
    redirect("/auth/login?next=/account");
  }

  return (
    <main
      id="main-content"
      className="min-h-screen bg-[#f7f4ef] px-4 py-6 text-[#1f2a24] sm:px-6"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <nav
          aria-label="Account navigation"
          className="flex items-center justify-between gap-4 text-sm"
        >
          <Link href="/" className="font-semibold">
            Routinelle
          </Link>
          <Button asChild variant="outline" className="rounded-lg">
            <Link href="/">Public preview</Link>
          </Button>
        </nav>

        <Card className="rounded-lg border-[#d8d0c3] bg-white/85 shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl">Your Routinelle account</CardTitle>
            <CardDescription className="leading-6">
              Signed in as {user.email}. Routine saving and tracking will be
              added here after the recommendation flow is implemented.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-[#d8d0c3] bg-[#fbfaf7] p-4">
              <p className="text-sm font-semibold">What this account will do</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-[#53685d]">
                <li>Save your generated AM/PM routine when you choose.</li>
                <li>Support future check-ins and routine updates.</li>
                <li>Keep public preview access separate from account storage.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <PrivacyConsentPanel />

        <AccountDataPanel />
      </div>
    </main>
  );
}
