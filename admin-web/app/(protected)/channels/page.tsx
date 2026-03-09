"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SectionCard from "@/components/section-card";
import DataTable from "@/components/data-table";
import {
  archiveChannel,
  listChannels,
  listCompanies,
  saveChannel,
} from "@/lib/admin-api";
import { formatDate, statusLabel } from "@/lib/format";
import type { ContactChannelRow } from "@/lib/types";

const EMPTY_CHANNEL: Partial<ContactChannelRow> = {
  company_id: "",
  channel_type: "phone",
  value: "",
  label: "",
  is_fastest: false,
  official_source_url: "",
  sort_order: 0,
  status: "draft",
  verification_status: "needs_verification",
};

export default function ChannelsPage() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Partial<ContactChannelRow>>(EMPTY_CHANNEL);

  const channels = useQuery({
    queryKey: ["admin", "channels"],
    queryFn: listChannels,
  });
  const companies = useQuery({
    queryKey: ["admin", "companies", "select"],
    queryFn: listCompanies,
  });

  const saveMutation = useMutation({
    mutationFn: saveChannel,
    onSuccess: async () => {
      setDraft(EMPTY_CHANNEL);
      await queryClient.invalidateQueries({ queryKey: ["admin", "channels"] });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: archiveChannel,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "channels"] });
    },
  });

  return (
    <div className="splitGrid">
      <SectionCard
        title="Contact channel yönetimi"
        description="Fastest kuralını ve resmi kaynak bağlarını kontrol ederek kanal listesini yönetin."
      >
        <DataTable
          rows={channels.data || []}
          columns={[
            {
              key: "company",
              header: "Firma",
              render: (row) => row.company?.name || row.company_id,
            },
            { key: "type", header: "Kanal", render: (row) => row.channel_type },
            { key: "value", header: "Değer", render: (row) => row.value },
            {
              key: "fastest",
              header: "Fastest",
              render: (row) => (row.is_fastest ? "Evet" : "Hayır"),
            },
            {
              key: "status",
              header: "Durum",
              render: (row) => statusLabel(row.status),
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
        title={draft.id ? "Kanal düzenle" : "Yeni kanal"}
        description="Tek firma için yalnızca bir fastest kanal kuralını koruyarak veri girin."
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
            <label>Kanal tipi</label>
            <select
              value={draft.channel_type || "phone"}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, channel_type: event.target.value }))
              }
            >
              <option value="phone">Telefon</option>
              <option value="live_chat">Canlı destek</option>
              <option value="email">E-posta</option>
              <option value="twitter">X / Twitter</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="instagram">Instagram</option>
              <option value="app">Uygulama</option>
              <option value="sikayetvar">Şikayetvar</option>
            </select>
          </div>
          <div className="field">
            <label>Label</label>
            <input
              value={draft.label || ""}
              onChange={(event) => setDraft((prev) => ({ ...prev, label: event.target.value }))}
            />
          </div>
          <div className="field">
            <label>Değer</label>
            <input
              value={draft.value || ""}
              onChange={(event) => setDraft((prev) => ({ ...prev, value: event.target.value }))}
              required
            />
          </div>
          <div className="field">
            <label>Fastest</label>
            <select
              value={draft.is_fastest ? "yes" : "no"}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, is_fastest: event.target.value === "yes" }))
              }
            >
              <option value="no">Hayır</option>
              <option value="yes">Evet</option>
            </select>
          </div>
          <div className="field">
            <label>Durum</label>
            <select
              value={draft.status || "draft"}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  status: event.target.value as ContactChannelRow["status"],
                }))
              }
            >
              <option value="draft">Taslak</option>
              <option value="in_review">İncelemede</option>
              <option value="approved">Onaylandı</option>
              <option value="published">Yayında</option>
              <option value="archived">Arşivde</option>
            </select>
          </div>
          <div className="fieldFull">
            <label>Resmi kaynak URL</label>
            <input
              value={draft.official_source_url || ""}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, official_source_url: event.target.value }))
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
              onClick={() => setDraft(EMPTY_CHANNEL)}
            >
              Temizle
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}
