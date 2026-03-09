"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SectionCard from "@/components/section-card";
import DataTable from "@/components/data-table";
import { archiveCompany, listCategories, listCompanies, saveCompany } from "@/lib/admin-api";
import { formatDate, statusLabel } from "@/lib/format";
import type { CompanyRow } from "@/lib/types";

const EMPTY_COMPANY: Partial<CompanyRow> = {
  name: "",
  slug: "",
  category_id: null,
  description: "",
  website_url: "",
  has_cargo_tracking: false,
  cargo_tracking_url: "",
  status: "draft",
  verification_status: "needs_verification",
  is_featured: false,
  is_sponsored: false,
  search_boost: 0,
};

export default function CompaniesPage() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Partial<CompanyRow>>(EMPTY_COMPANY);

  const companies = useQuery({
    queryKey: ["admin", "companies"],
    queryFn: listCompanies,
  });
  const categories = useQuery({
    queryKey: ["admin", "categories", "all"],
    queryFn: listCategories,
  });

  const saveMutation = useMutation({
    mutationFn: saveCompany,
    onSuccess: async () => {
      setDraft(EMPTY_COMPANY);
      await queryClient.invalidateQueries({ queryKey: ["admin", "companies"] });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: archiveCompany,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "companies"] });
    },
  });

  const rows = useMemo(() => companies.data || [], [companies.data]);

  return (
    <div className="splitGrid">
      <SectionCard
        title="Firma yönetimi"
        description="Arama, kategori, verification ve publish akışını tek satırdan yönetin."
      >
        <DataTable
          rows={rows}
          columns={[
            {
              key: "name",
              header: "Firma",
              render: (row) => (
                <button className="ghostButton" onClick={() => setDraft(row)}>
                  {row.name}
                </button>
              ),
            },
            {
              key: "category",
              header: "Kategori",
              render: (row) => row.category?.name || "-",
            },
            {
              key: "status",
              header: "Durum",
              render: (row) => <span className="badge">{statusLabel(row.status)}</span>,
            },
            {
              key: "verification",
              header: "Doğrulama",
              render: (row) => statusLabel(row.verification_status),
            },
            {
              key: "updated",
              header: "Güncellendi",
              render: (row) => formatDate(row.updated_at),
            },
            {
              key: "actions",
              header: "Aksiyon",
              render: (row) => (
                <div className="buttonRow">
                  <button className="secondaryButton" onClick={() => setDraft(row)}>
                    Düzenle
                  </button>
                  <button
                    className="dangerButton"
                    onClick={() => archiveMutation.mutate(row.id)}
                    disabled={archiveMutation.isPending}
                  >
                    Arşivle
                  </button>
                </div>
              ),
            },
          ]}
        />
      </SectionCard>

      <SectionCard
        title={draft.id ? "Firma düzenle" : "Yeni firma"}
        description="Taslak oluştur, review queue’ya gönder veya yayın durumunu güncelle."
      >
        <form
          className="formGrid"
          onSubmit={(event) => {
            event.preventDefault();
            saveMutation.mutate(draft);
          }}
        >
          <div className="field">
            <label>Firma adı</label>
            <input
              value={draft.name || ""}
              onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
          </div>
          <div className="field">
            <label>Slug</label>
            <input
              value={draft.slug || ""}
              onChange={(event) => setDraft((prev) => ({ ...prev, slug: event.target.value }))}
              required
            />
          </div>
          <div className="field">
            <label>Kategori</label>
            <select
              value={draft.category_id || ""}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, category_id: event.target.value || null }))
              }
            >
              <option value="">Seçiniz</option>
              {(categories.data || []).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Durum</label>
            <select
              value={draft.status || "draft"}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, status: event.target.value as CompanyRow["status"] }))
              }
            >
              <option value="draft">Taslak</option>
              <option value="in_review">İncelemede</option>
              <option value="approved">Onaylandı</option>
              <option value="published">Yayında</option>
              <option value="rejected">Reddedildi</option>
            </select>
          </div>
          <div className="field">
            <label>Website</label>
            <input
              value={draft.website_url || ""}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, website_url: event.target.value }))
              }
            />
          </div>
          <div className="field">
            <label>Verification</label>
            <select
              value={draft.verification_status || "needs_verification"}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  verification_status: event.target.value as CompanyRow["verification_status"],
                }))
              }
            >
              <option value="needs_verification">Doğrulama gerekli</option>
              <option value="verified">Doğrulandı</option>
              <option value="unverified">Doğrulanmadı</option>
              <option value="needs_review">İnceleme gerekli</option>
            </select>
          </div>
          <div className="field">
            <label>Arama boost</label>
            <input
              type="number"
              value={draft.search_boost ?? 0}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, search_boost: Number(event.target.value) }))
              }
            />
          </div>
          <div className="field">
            <label>Kargo takibi var mı?</label>
            <select
              value={draft.has_cargo_tracking ? "yes" : "no"}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  has_cargo_tracking: event.target.value === "yes",
                }))
              }
            >
              <option value="no">Hayır</option>
              <option value="yes">Evet</option>
            </select>
          </div>
          <div className="field">
            <label>Kargo takip URL</label>
            <input
              value={draft.cargo_tracking_url || ""}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, cargo_tracking_url: event.target.value }))
              }
            />
          </div>
          <div className="fieldFull">
            <label>Açıklama</label>
            <textarea
              value={draft.description || ""}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, description: event.target.value }))
              }
            />
          </div>
          <div className="fieldFull buttonRow">
            <button className="primaryButton" type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
            </button>
            <button
              className="ghostButton"
              type="button"
              onClick={() => setDraft(EMPTY_COMPANY)}
            >
              Temizle
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}
