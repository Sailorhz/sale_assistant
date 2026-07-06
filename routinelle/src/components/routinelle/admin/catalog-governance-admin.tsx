"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ApiResult } from "@/lib/api/result";
import type {
  ApprovedCopyBlock,
  CatalogTag,
} from "@/lib/domain/catalog-governance";

type Props = {
  initialTags: CatalogTag[];
  initialCopyBlocks: ApprovedCopyBlock[];
};

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function CatalogGovernanceAdmin({
  initialTags,
  initialCopyBlocks,
}: Props) {
  const [tags, setTags] = useState(initialTags);
  const [copyBlocks, setCopyBlocks] = useState(initialCopyBlocks);
  const [tagForm, setTagForm] = useState({
    tagType: "function",
    slug: "",
    label: "",
    description: "",
    status: "active",
    versionKey: "",
  });
  const [copyForm, setCopyForm] = useState({
    copyKey: "",
    copyType: "routine_explanation",
    title: "",
    body: "",
    allowedContexts: "",
    claimScope: "cosmetic",
    status: "draft",
    versionKey: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function saveTag() {
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/catalog-governance/tags", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tagForm),
      });
      const result = (await response.json()) as ApiResult<{ tag: CatalogTag }>;

      if (!result.ok) {
        setError(result.error.message);
        return;
      }

      setTags((current) => [result.data.tag, ...current]);
      setMessage("Tag saved.");
      setTagForm((current) => ({ ...current, slug: "", label: "" }));
    } catch {
      setError("Tag could not be saved right now.");
    }
  }

  async function saveCopyBlock() {
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(
        "/api/admin/catalog-governance/copy-blocks",
        {
          method: "POST",
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...copyForm,
            allowedContexts: splitList(copyForm.allowedContexts),
          }),
        },
      );
      const result = (await response.json()) as ApiResult<{
        copyBlock: ApprovedCopyBlock;
      }>;

      if (!result.ok) {
        setError(result.error.message);
        return;
      }

      setCopyBlocks((current) => [result.data.copyBlock, ...current]);
      setMessage("Approved copy block saved.");
      setCopyForm((current) => ({
        ...current,
        copyKey: "",
        title: "",
        body: "",
      }));
    } catch {
      setError("Approved copy block could not be saved right now.");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="space-y-5" aria-labelledby="tag-management-title">
        <div className="space-y-2">
          <h1 id="tag-management-title" className="text-2xl font-semibold">
            Recommendation tags
          </h1>
          <p className="text-sm leading-6 text-[#53685d]">
            Tags become controlled rule inputs for products and routines.
          </p>
        </div>

        {message ? (
          <p className="rounded-lg border border-[#c8d2c7] bg-[#eef4ed] p-3 text-sm">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="rounded-lg border border-[#d6c48d] bg-[#fff8e6] p-3 text-sm">
            {error}
          </p>
        ) : null}

        <div className="grid gap-3">
          <select
            value={tagForm.tagType}
            onChange={(event) =>
              setTagForm((current) => ({
                ...current,
                tagType: event.target.value,
              }))
            }
            className="min-h-11 rounded-md border border-input bg-white px-3 py-2"
          >
            {["function", "caution", "routine_step"].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <Input
            placeholder="slug"
            value={tagForm.slug}
            onChange={(event) =>
              setTagForm((current) => ({
                ...current,
                slug: event.target.value,
              }))
            }
          />
          <Input
            placeholder="label"
            value={tagForm.label}
            onChange={(event) =>
              setTagForm((current) => ({
                ...current,
                label: event.target.value,
              }))
            }
          />
          <Input
            placeholder="description"
            value={tagForm.description}
            onChange={(event) =>
              setTagForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
          />
          <Button
            type="button"
            onClick={saveTag}
            className="rounded-lg bg-[#31463a] text-white hover:bg-[#26372e]"
          >
            Save tag
          </Button>
        </div>

        <div className="grid gap-3">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="rounded-lg border border-[#d8d0c3] bg-white p-3 text-sm"
            >
              <p className="font-semibold">{tag.label}</p>
              <p className="mt-1 text-[#53685d]">
                {tag.tagType} · {tag.slug} · {tag.status}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5" aria-labelledby="copy-management-title">
        <div className="space-y-2">
          <h2 id="copy-management-title" className="text-2xl font-semibold">
            Approved copy
          </h2>
          <p className="text-sm leading-6 text-[#53685d]">
            User-facing explanation text is managed separately from free-form
            product claims.
          </p>
        </div>

        <div className="grid gap-3">
          <Input
            placeholder="copy-key"
            value={copyForm.copyKey}
            onChange={(event) =>
              setCopyForm((current) => ({
                ...current,
                copyKey: event.target.value,
              }))
            }
          />
          <Input
            placeholder="title"
            value={copyForm.title}
            onChange={(event) =>
              setCopyForm((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
          />
          <textarea
            placeholder="approved copy body"
            value={copyForm.body}
            onChange={(event) =>
              setCopyForm((current) => ({
                ...current,
                body: event.target.value,
              }))
            }
            className="min-h-28 rounded-md border border-input bg-white px-3 py-2 text-sm"
          />
          <Input
            placeholder="allowed contexts"
            value={copyForm.allowedContexts}
            onChange={(event) =>
              setCopyForm((current) => ({
                ...current,
                allowedContexts: event.target.value,
              }))
            }
          />
          <Button
            type="button"
            onClick={saveCopyBlock}
            className="rounded-lg bg-[#31463a] text-white hover:bg-[#26372e]"
          >
            Save approved copy
          </Button>
        </div>

        <div className="grid gap-3">
          {copyBlocks.map((copyBlock) => (
            <div
              key={copyBlock.id}
              className="rounded-lg border border-[#d8d0c3] bg-white p-3 text-sm"
            >
              <p className="font-semibold">{copyBlock.title}</p>
              <p className="mt-1 text-[#53685d]">
                {copyBlock.copyKey} · {copyBlock.copyType} · {copyBlock.status}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
