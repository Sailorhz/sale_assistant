import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

import { CatalogCoverageView } from "@/components/routinelle/admin/catalog-coverage-view";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildCatalogCoverageReport } from "@/lib/catalog/catalog-coverage";
import { isCatalogAdmin } from "@/lib/supabase/catalog-admin";
import { listCatalogProducts } from "@/lib/supabase/catalog-products";
import { createClient } from "@/lib/supabase/server";
import { hasEnvVars } from "@/lib/utils";

export default function CatalogCoveragePage() {
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
          <CardTitle>Loading catalog coverage</CardTitle>
          <CardDescription>Checking eligible product coverage.</CardDescription>
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
            <CardTitle>Catalog coverage setup needed</CardTitle>
            <CardDescription>
              Supabase must be configured before coverage can be calculated.
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
    redirect("/auth/login?next=/admin/catalog-coverage");
  }

  if (!(await isCatalogAdmin(supabase, userId))) {
    return (
      <main className="min-h-screen bg-[#f7f4ef] px-4 py-8 text-[#1f2a24]">
        <Card className="mx-auto max-w-3xl rounded-lg border-[#d8d0c3] bg-white/85 shadow-none">
          <CardHeader>
            <CardTitle>Catalog admin access required</CardTitle>
            <CardDescription>
              Your account is not authorized to view catalog coverage.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  const coverage = buildCatalogCoverageReport(await listCatalogProducts(supabase));

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

        <CatalogCoverageView coverage={coverage} />
      </div>
    </main>
  );
}
