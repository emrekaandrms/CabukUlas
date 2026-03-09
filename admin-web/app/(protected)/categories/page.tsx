"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SectionCard from "@/components/section-card";
import DataTable from "@/components/data-table";
import { listCategories, saveCategory } from "@/lib/admin-api";
import { statusLabel } from "@/lib/format";
import type { CategoryRow } from "@/lib/types";

const EMPTY_CATEGORY: Partial<CategoryRow> = {
  id: "",
  name: "",
  icon: "",
  sort_order: 0,
  status: "published",
};

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Partial<CategoryRow>>(EMPTY_CATEGORY);

  const categories = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: listCategories,
  });

  const saveMutation = useMutation({
    mutationFn: saveCategory,
    onSuccess: async () => {
      setDraft(EMPTY_CATEGORY);
      await queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });

  return (
    <div className="splitGrid">
      <SectionCard
        title="Kategori yönetimi"
        description="Kategori kapsamını, sıralamayı ve public görünürlüğü kontrol edin."
      >
        <DataTable
          rows={categories.data || []}
          columns={[
            {
              key: "name",
              header: "Kategori",
              render: (row) => (
                <button className="ghostButton" onClick={() => setDraft(row)}>
                  {row.name}
                </button>
              ),
            },
            { key: "icon", header: "İkon", render: (row) => row.icon || "-" },
            { key: "sort", header: "Sıra", render: (row) => row.sort_order },
            {
              key: "status",
              header: "Durum",
              render: (row) => statusLabel(row.status || "published"),
            },
          ]}
        />
      </SectionCard>

      <SectionCard
        title={draft.id ? "Kategori düzenle" : "Yeni kategori"}
        description="İkon, sıra ve yayın durumunu tek panelden yönet."
      >
        <form
          className="formGrid"
          onSubmit={(event) => {
            event.preventDefault();
            saveMutation.mutate(draft);
          }}
        >
          <div className="field">
            <label>Kategori adı</label>
            <input
              value={draft.name || ""}
              onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
          </div>
          <div className="field">
            <label>İkon anahtarı</label>
            <input
              value={draft.icon || ""}
              onChange={(event) => setDraft((prev) => ({ ...prev, icon: event.target.value }))}
            />
          </div>
          <div className="field">
            <label>Sıra</label>
            <input
              type="number"
              value={draft.sort_order ?? 0}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, sort_order: Number(event.target.value) }))
              }
            />
          </div>
          <div className="field">
            <label>Durum</label>
            <select
              value={draft.status || "published"}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, status: event.target.value as CategoryRow["status"] }))
              }
            >
              <option value="draft">Taslak</option>
              <option value="published">Yayında</option>
              <option value="archived">Arşivde</option>
            </select>
          </div>
          <div className="fieldFull buttonRow">
            <button className="primaryButton" type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
            </button>
            <button
              className="ghostButton"
              type="button"
              onClick={() => setDraft(EMPTY_CATEGORY)}
            >
              Temizle
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}
