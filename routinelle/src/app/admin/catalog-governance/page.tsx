import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

import { CatalogGovernanceAdmin } from "@/components/routinelle/admin/catalog-governance-admin";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isCatalogAdmin } from "@/lib/supabase/catalog-admin";
import {
  listApprovedCopyBlocks,
  listCatalogTags,
} from "@/lib/supabase/catalog-governance";
import { createClient } from "@/lib/supabase/server";
import { hasEnvVars } from "@/lib/utils";

export default function CatalogGovernancePage() {
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
          <CardTitle>Loading governance tools</CardTitle>
          <CardDescription>Checking catalog admin access.</CardDescription>
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
            <CardTitle>Catalog governance setup needed</CardTitle>
            <CardDescription>
              Supabase must be configured before governance tools are available.
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
    redirect("/auth/login?next=/admin/catalog-governance");
  }

  if (!(await isCatalogAdmin(supabase, userId))) {
    return (
      <main className="min-h-screen bg-[#f7f4ef] px-4 py-8 text-[#1f2a24]">
        <Card className="mx-auto max-w-3xl rounded-lg border-[#d8d0c3] bg-white/85 shadow-none">
          <CardHeader>
            <CardTitle>Catalog admin access required</CardTitle>
            <CardDescription>
              Your account is not authorized to manage catalog governance.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  const [tags, copyBlocks] = await Promise.all([
    listCatalogTags(supabase),
    listApprovedCopyBlocks(supabase),
  ]);

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-4 py-6 text-[#1f2a24] sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <nav
          aria-label="Admin navigation"
          className="flex items-center justify-between gap-4 text-sm"
        >
          <Link href="/" className="font-semibold">
            Routinelle
          </Link>
          <Button asChild variant="outline" className="rounded-lg">
            <Link href="/admin/catalog-products">Products</Link>
          </Button>
        </nav>

        <CatalogGovernanceAdmin
          initialTags={tags}
          initialCopyBlocks={copyBlocks}
        />
      </div>
    </main>
  );
}
