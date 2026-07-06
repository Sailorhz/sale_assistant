"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ApiResult } from "@/lib/api/result";
import {
  catalogProductToInput,
  type CatalogProductInput,
} from "@/lib/catalog/catalog-product-input";
import type { CatalogEligibilityResult } from "@/lib/catalog/catalog-product-validation";
import type { CatalogProduct } from "@/lib/domain/catalog-product";

type CatalogProductsAdminProps = {
  initialProducts: CatalogProduct[];
};

type SavePayload = {
  product: CatalogProduct;
  eligibility: CatalogEligibilityResult;
};

type FieldName = keyof CatalogProductInput;

const defaultInput: CatalogProductInput = {
  brandName: "",
  productName: "",
  productCategory: "moisturizer",
  routineStep: "hydrate",
  inciList: [],
  keyIngredients: [],
  functionTags: [],
  cautionTags: [],
  verifiedClaims: [],
  priceAmountMinor: null,
  priceCurrency: "EUR",
  priceBand: "moderate",
  sizeValue: null,
  sizeUnit: "ml",
  costPerUnitAmountMinor: null,
  costPerUnitUnit: "ml",
  market: "france",
  availabilityStatus: "available",
  retailerName: null,
  productUrl: null,
  sourceUrl: null,
  lastVerifiedAt: new Date().toISOString(),
  nextReviewAt: null,
  formulaStatus: "stable",
  formulaChangedAt: null,
  dataFreshnessStatus: "current",
  dataFreshnessNotes: null,
  publicationStatus: "draft",
  reviewReason: null,
};

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinList(value: string[]) {
  return value.join(", ");
}

function parseNumberValue(value: string) {
  if (value.trim().length === 0) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function buildVerifiedClaim(claim: string, sourceUrl: string) {
  const trimmedClaim = claim.trim();

  return trimmedClaim
    ? [
        {
          claim: trimmedClaim,
          sourceUrl: sourceUrl.trim() || undefined,
          verifiedAt: new Date().toISOString(),
        },
      ]
    : [];
}

export function CatalogProductsAdmin({
  initialProducts,
}: CatalogProductsAdminProps) {
  const [products, setProducts] = useState(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CatalogProductInput>(defaultInput);
  const [claimText, setClaimText] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [issues, setIssues] = useState<unknown>(null);
  const [isSaving, setIsSaving] = useState(false);

  function updateField<TField extends FieldName>(
    field: TField,
    value: CatalogProductInput[TField],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function editProduct(product: CatalogProduct) {
    setEditingId(product.id);
    setForm(catalogProductToInput(product));
    setClaimText(product.verifiedClaims[0]?.claim ?? "");
    setStatus(null);
    setError(null);
    setIssues(null);
  }

  function resetForm() {
    setEditingId(null);
    setForm(defaultInput);
    setClaimText("");
    setStatus(null);
    setError(null);
    setIssues(null);
  }

  async function saveProduct() {
    setIsSaving(true);
    setStatus(null);
    setError(null);
    setIssues(null);

    const payload = {
      ...form,
      verifiedClaims: buildVerifiedClaim(claimText, form.sourceUrl ?? ""),
    };
    const endpoint = editingId
      ? `/api/admin/catalog-products/${editingId}`
      : "/api/admin/catalog-products";

    try {
      const response = await fetch(endpoint, {
        method: editingId ? "PUT" : "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as ApiResult<SavePayload>;

      if (!result.ok) {
        setError(result.error.message);
        setIssues(result.error.issues ?? null);
        return;
      }

      setProducts((current) => {
        const withoutUpdated = current.filter(
          (product) => product.id !== result.data.product.id,
        );
        return [result.data.product, ...withoutUpdated];
      });
      setStatus(
        result.data.eligibility.status === "eligible"
          ? "Product saved and eligible."
          : "Product saved with validation notes.",
      );
      setEditingId(result.data.product.id);
    } catch {
      setError("Catalog product could not be saved right now.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <section className="space-y-5" aria-labelledby="catalog-form-title">
        <div className="space-y-2">
          <h1 id="catalog-form-title" className="text-2xl font-semibold">
            Catalog product editor
          </h1>
          <p className="text-sm leading-6 text-[#53685d]">
            Structured product facts are validated before they can be used for
            recommendations.
          </p>
        </div>

        {status ? (
          <p className="rounded-lg border border-[#c8d2c7] bg-[#eef4ed] p-3 text-sm text-[#31463a]">
            {status}
          </p>
        ) : null}
        {error ? (
          <div className="rounded-lg border border-[#d6c48d] bg-[#fff8e6] p-3 text-sm text-[#53685d]">
            <p className="font-semibold text-[#1f2a24]">{error}</p>
            {issues ? (
              <pre className="mt-2 overflow-auto text-xs">
                {JSON.stringify(issues, null, 2)}
              </pre>
            ) : null}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold">
            Brand
            <Input
              value={form.brandName}
              onChange={(event) => updateField("brandName", event.target.value)}
            />
          </label>
          <label className="space-y-2 text-sm font-semibold">
            Product
            <Input
              value={form.productName}
              onChange={(event) =>
                updateField("productName", event.target.value)
              }
            />
          </label>
          <label className="space-y-2 text-sm font-semibold">
            Category
            <select
              value={form.productCategory}
              onChange={(event) =>
                updateField(
                  "productCategory",
                  event.target.value as CatalogProductInput["productCategory"],
                )
              }
              className="min-h-11 w-full rounded-md border border-input bg-white px-3 py-2"
            >
              {[
                "cleanser",
                "moisturizer",
                "sunscreen",
                "serum",
                "active",
                "exfoliant",
                "toner",
                "mask",
                "other",
              ].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm font-semibold">
            Routine step
            <select
              value={form.routineStep}
              onChange={(event) =>
                updateField(
                  "routineStep",
                  event.target.value as CatalogProductInput["routineStep"],
                )
              }
              className="min-h-11 w-full rounded-md border border-input bg-white px-3 py-2"
            >
              {["cleanse", "hydrate", "protect", "support", "optional"].map(
                (value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ),
              )}
            </select>
          </label>
          <label className="space-y-2 text-sm font-semibold sm:col-span-2">
            INCI list
            <textarea
              value={joinList(form.inciList)}
              onChange={(event) =>
                updateField("inciList", splitList(event.target.value))
              }
              className="min-h-24 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
            />
          </label>
          <label className="space-y-2 text-sm font-semibold">
            Function tags
            <Input
              value={joinList(form.functionTags)}
              onChange={(event) =>
                updateField("functionTags", splitList(event.target.value))
              }
            />
          </label>
          <label className="space-y-2 text-sm font-semibold">
            Caution tags
            <Input
              value={joinList(form.cautionTags)}
              onChange={(event) =>
                updateField("cautionTags", splitList(event.target.value))
              }
            />
          </label>
          <label className="space-y-2 text-sm font-semibold">
            Key ingredients
            <Input
              value={joinList(form.keyIngredients)}
              onChange={(event) =>
                updateField("keyIngredients", splitList(event.target.value))
              }
            />
          </label>
          <label className="space-y-2 text-sm font-semibold">
            Verified claim
            <Input
              value={claimText}
              onChange={(event) => setClaimText(event.target.value)}
            />
          </label>
          <label className="space-y-2 text-sm font-semibold">
            Price minor units
            <Input
              inputMode="numeric"
              value={form.priceAmountMinor ?? ""}
              onChange={(event) =>
                updateField(
                  "priceAmountMinor",
                  parseNumberValue(event.target.value),
                )
              }
            />
          </label>
          <label className="space-y-2 text-sm font-semibold">
            Price band
            <select
              value={form.priceBand}
              onChange={(event) =>
                updateField(
                  "priceBand",
                  event.target.value as CatalogProductInput["priceBand"],
                )
              }
              className="min-h-11 w-full rounded-md border border-input bg-white px-3 py-2"
            >
              {["low", "moderate", "premium", "unknown"].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm font-semibold">
            Size
            <Input
              inputMode="decimal"
              value={form.sizeValue ?? ""}
              onChange={(event) =>
                updateField("sizeValue", parseNumberValue(event.target.value))
              }
            />
          </label>
          <label className="space-y-2 text-sm font-semibold">
            Market
            <select
              value={form.market}
              onChange={(event) =>
                updateField(
                  "market",
                  event.target.value as CatalogProductInput["market"],
                )
              }
              className="min-h-11 w-full rounded-md border border-input bg-white px-3 py-2"
            >
              {["france", "eu", "uk", "us", "other"].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm font-semibold">
            Source URL
            <Input
              value={form.sourceUrl ?? ""}
              onChange={(event) => updateField("sourceUrl", event.target.value)}
            />
          </label>
          <label className="space-y-2 text-sm font-semibold">
            Publication status
            <select
              value={form.publicationStatus}
              onChange={(event) =>
                updateField(
                  "publicationStatus",
                  event.target
                    .value as CatalogProductInput["publicationStatus"],
                )
              }
              className="min-h-11 w-full rounded-md border border-input bg-white px-3 py-2"
            >
              {["draft", "published", "unpublished", "review"].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm font-semibold">
            Formula status
            <select
              value={form.formulaStatus}
              onChange={(event) =>
                updateField(
                  "formulaStatus",
                  event.target.value as CatalogProductInput["formulaStatus"],
                )
              }
              className="min-h-11 w-full rounded-md border border-input bg-white px-3 py-2"
            >
              {["stable", "changed", "suspected_change", "unknown"].map(
                (value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ),
              )}
            </select>
          </label>
          <label className="space-y-2 text-sm font-semibold">
            Data freshness
            <select
              value={form.dataFreshnessStatus}
              onChange={(event) =>
                updateField(
                  "dataFreshnessStatus",
                  event.target
                    .value as CatalogProductInput["dataFreshnessStatus"],
                )
              }
              className="min-h-11 w-full rounded-md border border-input bg-white px-3 py-2"
            >
              {["current", "review_due", "stale", "needs_review"].map(
                (value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ),
              )}
            </select>
          </label>
          <label className="space-y-2 text-sm font-semibold">
            Review reason
            <Input
              value={form.reviewReason ?? ""}
              onChange={(event) =>
                updateField("reviewReason", event.target.value)
              }
            />
          </label>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            onClick={saveProduct}
            disabled={isSaving}
            className="rounded-lg bg-[#31463a] text-white hover:bg-[#26372e]"
          >
            {isSaving ? "Saving" : editingId ? "Update product" : "Create product"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            className="rounded-lg"
          >
            New product
          </Button>
        </div>
      </section>

      <aside className="space-y-3" aria-labelledby="catalog-products-title">
        <h2 id="catalog-products-title" className="text-lg font-semibold">
          Products
        </h2>
        {products.length === 0 ? (
          <p className="text-sm leading-6 text-[#53685d]">
            No catalog products yet.
          </p>
        ) : null}
        <div className="grid gap-3">
          {products.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => editProduct(product)}
              className="rounded-lg border border-[#d8d0c3] bg-white p-3 text-left text-sm hover:bg-[#fbfaf7]"
            >
              <span className="block font-semibold">{product.productName}</span>
              <span className="mt-1 block text-[#53685d]">
                {product.brandName} · {product.market} · {product.routineStep}
              </span>
              <span className="mt-2 block text-xs font-semibold uppercase text-[#7a6846]">
                {product.publicationStatus} · {product.dataFreshnessStatus}
              </span>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
