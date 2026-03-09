"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SectionCard from "@/components/section-card";
import DataTable from "@/components/data-table";
import { listCompanies, listPlacements, savePlacement } from "@/lib/admin-api";
import { formatDate, statusLabel } from "@/lib/format";
import type { FeaturedPlacementRow } from "@/lib/types";

const EMPTY_PLACEMENT: Partial<FeaturedPlacementRow> = {
  company_id: "",
  placement_key: "home_featured",
  priority: 0,
  is_sponsored: false,
  status: "draft",
  starts_at: "",
  ends_at: "",
};

export default function PlacementsPage() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Partial<FeaturedPlacementRow>>(EMPTY_PLACEMENT);

  const placements = useQuery({
    queryKey: ["admin", "placements"],
    queryFn: listPlacements,
  });
  const companies = useQuery({
    queryKey: ["admin", "companies", "for-placement"],
    queryFn: listCompanies,
  });

  const saveMutation = useMutation({
    mutationFn: savePlacement,
    onSuccess: async () => {
      setDraft(EMPTY_PLACEMENT);
      await queryClient.invalidateQueries({ queryKey: ["admin", "placements"] });
    },
  });

  return (
    <div className="splitGrid">
      <SectionCard
        title="Featured / sponsored placements"
        description="Ana ekran ve kategori yüzeylerindeki editoryal ya da sponsorlu görünürlükleri yönet."
      >
        <DataTable
          rows={placements.data || []}
          columns={[
            { key: "company", header: "Firma", render: (row) => row.company?.name || row.company_id },
            { key: "key", header: "Placement", render: (row) => row.placement_key },
            { key: "priority", header: "Öncelik", render: (row) => row.priority },
            { key: "sponsored", header: "Sponsorlu", render: (row) => (row.is_sponsored ? "Evet" : "Hayır") },
            { key: "status", header: "Durum", render: (row) => statusLabel(row.status) },
            { key: "ends", header: "Bitiş", render: (row) => formatDate(row.ends_at) },
          ]}
        />
      </SectionCard>

      <SectionCard
        title={draft.id ? "Placement düzenle" : "Yeni placement"}
        description="Kampanya tarihleri ve priority ile görünürlüğü planla."
      >
        <form
          className="formGrid"
          onSubmit={(event) => {
            event.preventDefault();
            saveMutation.mutate(draft);
          }}
        >
          <div className="field">
            <label>Firma</label>
            <select
              value={draft.company_id || ""}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, company_id: event.target.value }))
              }
              required
            >
              <option value="">Seçiniz</option>
              {(companies.data || []).map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Placement key</label>
            <input
              value={draft.placement_key || ""}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, placement_key: event.target.value }))
              }
              required
            />
          </div>
          <div className="field">
            <label>Öncelik</label>
            <input
              type="number"
              value={draft.priority ?? 0}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, priority: Number(event.target.value) }))
              }
            />
          </div>
          <div className="field">
            <label>Durum</label>
            <select
              value={draft.status || "draft"}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  status: event.target.value as FeaturedPlacementRow["status"],
                }))
              }
            >
              <option value="draft">Taslak</option>
              <option value="approved">Onaylandı</option>
              <option value="published">Yayında</option>
              <option value="archived">Arşivde</option>
            </select>
          </div>
          <div className="field">
            <label>Başlangıç</label>
            <input
              type="datetime-local"
              value={draft.starts_at || ""}
              onChange={(event) => setDraft((prev) => ({ ...prev, starts_at: event.target.value }))}
            />
          </div>
          <div className="field">
            <label>Bitiş</label>
            <input
              type="datetime-local"
              value={draft.ends_at || ""}
              onChange={(event) => setDraft((prev) => ({ ...prev, ends_at: event.target.value }))}
            />
          </div>
          <div className="field">
            <label>Sponsorlu</label>
            <select
              value={draft.is_sponsored ? "yes" : "no"}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, is_sponsored: event.target.value === "yes" }))
              }
            >
              <option value="no">Hayır</option>
              <option value="yes">Evet</option>
            </select>
          </div>
          <div className="fieldFull buttonRow">
            <button className="primaryButton" type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
            </button>
            <button
              className="ghostButton"
              type="button"
              onClick={() => setDraft(EMPTY_PLACEMENT)}
            >
              Temizle
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}
