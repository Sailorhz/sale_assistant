import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

import { CatalogProductsAdmin } from "@/components/routinelle/admin/catalog-products-admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isCatalogAdmin } from "@/lib/supabase/catalog-admin";
import { listCatalogProducts } from "@/lib/supabase/catalog-products";
import { createClient } from "@/lib/supabase/server";
import { hasEnvVars } from "@/lib/utils";

export default function CatalogProductsAdminPage() {
  return (
    <Suspense fallback={<AdminCatalogLoading />}>
      <AdminCatalogContent />
    </Suspense>
  );
}

function AdminCatalogLoading() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-[#f7f4ef] px-4 py-8 text-[#1f2a24] sm:px-6"
    >
      <div className="mx-auto w-full max-w-5xl">
        <Card className="rounded-lg border-[#d8d0c3] bg-white/85 shadow-none">
          <CardHeader>
            <CardTitle>Loading catalog admin</CardTitle>
            <CardDescription>Checking catalog access.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
}

async function AdminCatalogContent() {
  await connection();

  if (!hasEnvVars) {
    return (
      <main
        id="main-content"
        className="min-h-screen bg-[#f7f4ef] px-4 py-8 text-[#1f2a24] sm:px-6"
      >
        <div className="mx-auto w-full max-w-2xl">
          <Card className="rounded-lg border-[#d8d0c3] bg-white/85 shadow-none">
            <CardHeader>
              <CardTitle>Catalog admin setup needed</CardTitle>
              <CardDescription className="leading-6">
                Supabase environment variables are required before catalog
                admin tools can be used.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="rounded-lg">
                <Link href="/">Back to Routinelle</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || !userId) {
    redirect("/auth/login?next=/admin/catalog-products");
  }

  const isAdmin = await isCatalogAdmin(supabase, userId);
  if (!isAdmin) {
    return (
      <main
        id="main-content"
        className="min-h-screen bg-[#f7f4ef] px-4 py-8 text-[#1f2a24] sm:px-6"
      >
        <div className="mx-auto w-full max-w-2xl">
          <Card className="rounded-lg border-[#d8d0c3] bg-white/85 shadow-none">
            <CardHeader>
              <CardTitle>Catalog admin access required</CardTitle>
              <CardDescription className="leading-6">
                Your account is signed in but is not authorized to maintain
                catalog product records.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    );
  }

  const products = await listCatalogProducts(supabase);

  return (
    <main
      id="main-content"
      className="min-h-screen bg-[#f7f4ef] px-4 py-6 text-[#1f2a24] sm:px-6"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <nav
          aria-label="Admin navigation"
          className="flex items-center justify-between gap-4 text-sm"
        >
          <Link href="/" className="font-semibold">
            Routinelle
          </Link>
          <Button asChild variant="outline" className="rounded-lg">
            <Link href="/account">Account</Link>
          </Button>
        </nav>

        <CatalogProductsAdmin initialProducts={products} />
      </div>
    </main>
  );
}
