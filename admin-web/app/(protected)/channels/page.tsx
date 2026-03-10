"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CsvExportButton from "@/components/csv-export-button";
import CsvImportSheet from "@/components/csv-import-sheet";
import SectionCard from "@/components/section-card";
import DataTable from "@/components/data-table";
import {
  archiveChannel,
  exportChannelsCsvRows,
  importChannelsCsv,
  listChannels,
  listCompanies,
  saveChannel,
} from "@/lib/admin-api";
import { formatDate, statusLabel } from "@/lib/format";
import type { ContactChannelRow } from "@/lib/types";

type ChannelDraft = Partial<ContactChannelRow>;
type CompanyOption = {
  id: string;
  name: string;
  slug: string;
};

type ChannelConfig = {
  valueLabel: string;
  placeholder: string;
  helper: string;
  suggestedLabel: string;
  actionHint: string;
  inputType: "text" | "url" | "email" | "tel";
};

const EMPTY_CHANNEL: Partial<ContactChannelRow> = {
  channel_type: "phone",
  value: "",
  label: "",
  is_fastest: false,
  official_source_url: "",
  sort_order: 0,
  status: "draft",
  verification_status: "needs_verification",
};

const CHANNEL_CONFIGS: Record<string, ChannelConfig> = {
  phone: {
    valueLabel: "Telefon numarası",
    placeholder: "0850 222 00 00",
    helper: "Müşteri hizmetleri veya çağrı merkezi numarasını boşluksuz ya da okunabilir formatta yaz.",
    suggestedLabel: "Müşteri Hizmetleri",
    actionHint: "Mobil uygulamada numara aranır.",
    inputType: "tel",
  },
  live_chat: {
    valueLabel: "Canlı destek bağlantısı",
    placeholder: "https://www.firma.com/canli-destek",
    helper: "Kullanıcıyı doğrudan sohbet başlatabileceği resmi sayfaya götüren bağlantıyı gir.",
    suggestedLabel: "Canlı Destek",
    actionHint: "Mobil uygulamada bağlantı tarayıcıda veya uygulama içinde açılır.",
    inputType: "url",
  },
  email: {
    valueLabel: "E-posta adresi",
    placeholder: "destek@firma.com",
    helper: "Doğrudan destek ekibine ulaşan aktif e-posta adresini gir.",
    suggestedLabel: "E-posta",
    actionHint: "Mobil uygulamada varsayılan e-posta uygulaması açılır.",
    inputType: "email",
  },
  twitter: {
    valueLabel: "X / Twitter profil bağlantısı",
    placeholder: "https://twitter.com/firma",
    helper: "Markanın resmi destek ya da kurumsal X hesabının tam profil linkini gir.",
    suggestedLabel: "X (Twitter)",
    actionHint: "Mobil uygulamada profil bağlantısı açılır.",
    inputType: "url",
  },
  whatsapp: {
    valueLabel: "WhatsApp numarası veya linki",
    placeholder: "905551112233 veya https://wa.me/905551112233",
    helper: "Sadece numara yazarsan WhatsApp sohbeti başlatılır, link yazarsan o bağlantı açılır.",
    suggestedLabel: "WhatsApp",
    actionHint: "Mobil uygulamada WhatsApp sohbeti veya verdiğin link açılır.",
    inputType: "text",
  },
  instagram: {
    valueLabel: "Instagram profil bağlantısı",
    placeholder: "https://instagram.com/firma",
    helper: "Resmi Instagram hesabının tam profil linkini gir.",
    suggestedLabel: "Instagram",
    actionHint: "Mobil uygulamada profil bağlantısı açılır.",
    inputType: "url",
  },
  app: {
    valueLabel: "Uygulama içi veya destek bağlantısı",
    placeholder: "https://www.firma.com/uygulama-destek",
    helper: "App Store, Play Store, deep link ya da destek ekranına giden bağlantıyı gir.",
    suggestedLabel: "Uygulama",
    actionHint: "Mobil uygulamada verdiğin bağlantı veya deep link açılır.",
    inputType: "url",
  },
  sikayetvar: {
    valueLabel: "Şikayetvar sayfa bağlantısı",
    placeholder: "https://www.sikayetvar.com/firma",
    helper: "Firmanın resmi ya da doğru Şikayetvar sayfasının tam linkini gir.",
    suggestedLabel: "Şikayetvar",
    actionHint: "Mobil uygulamada Şikayetvar sayfası açılır.",
    inputType: "url",
  },
};

const CHANNEL_IMPORT_COLUMNS = [
  "id",
  "company_id",
  "company_slug",
  "company_name",
  "channel_type",
  "label",
  "value",
  "is_fastest",
  "official_source_url",
  "sort_order",
  "status",
  "verification_status",
];

const CHANNEL_IMPORT_SAMPLE = `company_slug,channel_type,label,value,is_fastest,official_source_url,sort_order,status,verification_status
turkcell,twitter,X (Twitter),https://twitter.com/turkcell,false,https://www.turkcell.com.tr/iletisim,10,published,verified
turkcell,whatsapp,WhatsApp,905325320000,false,https://www.turkcell.com.tr/iletisim,20,published,verified`;

function getChannelConfig(type?: string): ChannelConfig {
  return CHANNEL_CONFIGS[type || "phone"] || CHANNEL_CONFIGS.phone;
}

function normalizeChannelValue(value?: string | null) {
  return value?.trim() || "";
}

function isLinkLike(value: string) {
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(value);
}

function isLikelyDefaultLabel(label?: string | null, type?: string) {
  if (!label) return true;
  const config = getChannelConfig(type);
  return label.trim().toLocaleLowerCase("tr") === config.suggestedLabel.toLocaleLowerCase("tr");
}

function validateChannelDraft(draft: ChannelDraft) {
  if (!draft.company_id) {
    return "Önce bir firma seç.";
  }

  const value = normalizeChannelValue(draft.value);
  const type = draft.channel_type || "phone";
  const config = getChannelConfig(type);

  if (!value) {
    return `${config.valueLabel} alanını doldur.`;
  }

  switch (type) {
    case "phone": {
      const numeric = value.replace(/[^\d+]/g, "");
      if (numeric.replace(/\D/g, "").length < 7) {
        return "Telefon için aranabilir bir numara gir.";
      }
      break;
    }
    case "email":
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Geçerli bir e-posta adresi gir.";
      }
      break;
    case "whatsapp":
      if (!isLinkLike(value) && value.replace(/\D/g, "").length < 10) {
        return "WhatsApp için telefon numarası ya da geçerli bir bağlantı gir.";
      }
      break;
    default:
      if (!isLinkLike(value)) {
        return `${config.valueLabel} tam bir bağlantı olmalı.`;
      }
      break;
  }

  return null;
}

export default function ChannelsPage() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<ChannelDraft>(EMPTY_CHANNEL);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

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
      await queryClient.invalidateQueries({ queryKey: ["admin", "channels"] });
      setDraft((prev) => ({
        ...EMPTY_CHANNEL,
        company_id: prev.company_id,
      }));
    },
  });

  const archiveMutation = useMutation({
    mutationFn: archiveChannel,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "channels"] });
    },
  });

  const companyRows = useMemo(
    () =>
      ((companies.data || []) as CompanyOption[]).slice().sort((a, b) =>
        a.name.localeCompare(b.name, "tr")
      ),
    [companies.data]
  );
  const activeCompanyId = selectedCompanyId || companyRows[0]?.id || "";

  const channelConfig = useMemo(
    () => getChannelConfig(draft.channel_type || "phone"),
    [draft.channel_type]
  );
  const formError = useMemo(() => validateChannelDraft(draft), [draft]);
  const selectedCompany = useMemo(
    () => companyRows.find((company) => company.id === activeCompanyId) || null,
    [activeCompanyId, companyRows]
  );
  const selectedCompanyChannels = useMemo(
    () =>
      (channels.data || [])
        .filter((channel) => channel.company_id === activeCompanyId)
        .sort((a, b) => {
          if ((a.sort_order || 0) !== (b.sort_order || 0)) {
            return (a.sort_order || 0) - (b.sort_order || 0);
          }
          return a.channel_type.localeCompare(b.channel_type, "tr");
        }),
    [activeCompanyId, channels.data]
  );
  const companiesWithStats = useMemo(
    () =>
      companyRows.map((company) => {
        const companyChannels = (channels.data || []).filter((channel) => channel.company_id === company.id);
        return {
          ...company,
          channelCount: companyChannels.length,
          fastestCount: companyChannels.filter((channel) => channel.is_fastest).length,
          lastUpdated: companyChannels[0]?.updated_at || null,
        };
      }),
    [companyRows, channels.data]
  );

  function startNewChannel() {
    if (!activeCompanyId) return;
    setDraft({
      ...EMPTY_CHANNEL,
      company_id: activeCompanyId,
      label: getChannelConfig("phone").suggestedLabel,
    });
  }

  function handleSelectCompany(companyId: string) {
    setSelectedCompanyId(companyId);
    setDraft({
      ...EMPTY_CHANNEL,
      company_id: companyId,
      label: getChannelConfig("phone").suggestedLabel,
    });
  }

  function handleEditChannel(channel: ContactChannelRow) {
    setSelectedCompanyId(channel.company_id);
    setDraft(channel);
  }

  return (
    <div className="splitGrid">
      <SectionCard
        title="Markalar"
        description="Önce markayı seç, sonra o markaya ait kanalları düzenle."
        action={
          <div className="buttonRow">
            <CsvExportButton
              filenamePrefix="channels-export"
              label="Mevcut veriyi indir"
              onExport={exportChannelsCsvRows}
            />
            <CsvImportSheet
              title="Kanal CSV import"
              description="Birden fazla marka için kanal kaydını tek seferde içe aktar. Şirket eşlemesi için company_slug kullanman en güvenlisi."
              expectedColumns={CHANNEL_IMPORT_COLUMNS}
              matchRules={[
                "Güncelleme için önce id aranır.",
                "id yoksa company_slug + channel_type + label ile eşleşme denenir.",
                "label boşsa company_slug + channel_type + value ile eşleşme yapılır, yoksa yeni kayıt açılır.",
              ]}
              sampleCsv={CHANNEL_IMPORT_SAMPLE}
              onImport={async (rows) => {
                const result = await importChannelsCsv(rows);
                await queryClient.invalidateQueries({ queryKey: ["admin", "channels"] });
                await queryClient.invalidateQueries({ queryKey: ["admin", "companies", "select"] });
                return result;
              }}
            />
          </div>
        }
      >
        <DataTable
          rows={companiesWithStats}
          columns={[
            {
              key: "name",
              header: "Firma",
              render: (row) => (
                <button
                  className={`ghostButton ${activeCompanyId === row.id ? "selectedGhostButton" : ""}`}
                  onClick={() => handleSelectCompany(row.id)}
                >
                  {row.name}
                </button>
              ),
            },
            {
              key: "count",
              header: "Kanal sayısı",
              render: (row) => row.channelCount,
            },
            {
              key: "fastest",
              header: "Fastest",
              render: (row) => row.fastestCount,
            },
            {
              key: "updated",
              header: "Son güncelleme",
              render: (row) => formatDate(row.lastUpdated),
            },
            {
              key: "actions",
              header: "Aksiyon",
              render: (row) => (
                <button className="secondaryButton" onClick={() => handleSelectCompany(row.id)}>
                  Kanalları yönet
                </button>
              ),
            },
          ]}
          emptyMessage="Henüz marka bulunamadı."
        />
      </SectionCard>

      <div className="stack">
        <SectionCard
          title={selectedCompany ? `${selectedCompany.name} kanalları` : "Kanal yönetimi"}
          description={
            selectedCompany
              ? "Düzenlemek istediğin kanalı seç veya aynı marka için yeni kanal ekle."
              : "Soldan bir marka seç."
          }
          action={
            <button className="primaryButton" onClick={startNewChannel} disabled={!activeCompanyId}>
              Yeni kanal ekle
            </button>
          }
        >
          {activeCompanyId ? (
            selectedCompanyChannels.length > 0 ? (
              <div className="channelCardList">
                {selectedCompanyChannels.map((row) => (
                  <div key={row.id} className="channelInfoCard">
                    <div className="channelInfoHeader">
                      <div>
                        <p className="eyebrow">{getChannelConfig(row.channel_type).suggestedLabel}</p>
                        <h3>{row.label || getChannelConfig(row.channel_type).suggestedLabel}</h3>
                      </div>
                      <span className="badge">{statusLabel(row.status)}</span>
                    </div>
                    <div className="channelInfoGrid">
                      <div>
                        <span className="channelInfoLabel">Bilgi</span>
                        <p className="channelInfoValue breakWord">{row.value}</p>
                      </div>
                      <div>
                        <span className="channelInfoLabel">Sıra</span>
                        <p className="channelInfoValue">{row.sort_order || 0}</p>
                      </div>
                      <div>
                        <span className="channelInfoLabel">Fastest</span>
                        <p className="channelInfoValue">{row.is_fastest ? "Evet" : "Hayır"}</p>
                      </div>
                      <div>
                        <span className="channelInfoLabel">Kaynak</span>
                        <p className="channelInfoValue breakWord">{row.official_source_url || "-"}</p>
                      </div>
                    </div>
                    <div className="buttonRow">
                      <button className="secondaryButton" onClick={() => handleEditChannel(row)}>
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
                  </div>
                ))}
              </div>
            ) : (
              <div className="emptyInline">
                Bu markaya ait kanal kaydı yok. Yeni kanal ekleyerek başlayabilirsin.
              </div>
            )
          ) : (
            <div className="emptyInline">Kanalları görmek için önce soldan bir marka seç.</div>
          )}
        </SectionCard>

        <SectionCard
          title={draft.id ? "Seçili kanalı düzenle" : "Yeni kanal oluştur"}
          description={
            selectedCompany
              ? `${selectedCompany.name} için kanal bilgisini burada düzenle.`
              : "Formu kullanmak için önce marka seç."
          }
        >
          <form
            className="formGrid"
            onSubmit={(event) => {
              event.preventDefault();
              if (formError) return;
              saveMutation.mutate(draft);
            }}
          >
            <div className="fieldFull">
              <label>Firma</label>
              <div className="readonlyField">{selectedCompany?.name || "Önce marka seç"}</div>
            </div>
            <div className="field">
              <label>Kanal tipi</label>
              <select
                value={draft.channel_type || "phone"}
                onChange={(event) =>
                  setDraft((prev) => {
                    const nextType = event.target.value;
                    const shouldReplaceLabel =
                      !prev.label || isLikelyDefaultLabel(prev.label, prev.channel_type);

                    return {
                      ...prev,
                      company_id: activeCompanyId,
                      channel_type: nextType,
                      label: shouldReplaceLabel ? getChannelConfig(nextType).suggestedLabel : prev.label,
                    };
                  })
                }
                disabled={!activeCompanyId}
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
              <label>Görünen ad</label>
              <input
                value={draft.label || ""}
                onChange={(event) => setDraft((prev) => ({ ...prev, label: event.target.value }))}
                placeholder={channelConfig.suggestedLabel}
                disabled={!activeCompanyId}
              />
            </div>
            <div className="fieldFull">
              <label>{channelConfig.valueLabel}</label>
              <input
                type={channelConfig.inputType}
                value={draft.value || ""}
                onChange={(event) => setDraft((prev) => ({ ...prev, value: event.target.value }))}
                placeholder={channelConfig.placeholder}
                required
                disabled={!activeCompanyId}
              />
            </div>
            <div className="field">
              <label>Fastest</label>
              <select
                value={draft.is_fastest ? "yes" : "no"}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, is_fastest: event.target.value === "yes" }))
                }
                disabled={!activeCompanyId}
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
                disabled={!activeCompanyId}
              >
                <option value="draft">Taslak</option>
                <option value="in_review">İncelemede</option>
                <option value="approved">Onaylandı</option>
                <option value="published">Yayında</option>
                <option value="archived">Arşivde</option>
              </select>
            </div>
            <div className="field">
              <label>Doğrulama</label>
              <select
                value={draft.verification_status || "needs_verification"}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    verification_status: event.target.value as ContactChannelRow["verification_status"],
                  }))
                }
                disabled={!activeCompanyId}
              >
                <option value="needs_verification">Doğrulama gerekli</option>
                <option value="verified">Doğrulandı</option>
                <option value="unverified">Doğrulanmadı</option>
              </select>
            </div>
            <div className="field">
              <label>Sıralama</label>
              <input
                type="number"
                value={draft.sort_order ?? 0}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, sort_order: Number(event.target.value) }))
                }
                disabled={!activeCompanyId}
              />
            </div>
            <div className="fieldFull">
              <label>Resmi kaynak URL</label>
              <input
                value={draft.official_source_url || ""}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, official_source_url: event.target.value }))
                }
                placeholder="https://www.firma.com/destek"
                disabled={!activeCompanyId}
              />
            </div>
            <div className="fieldFull">
              <div className="formHintCard">
                <strong>Bu alan nasıl kullanılacak?</strong>
                <p>
                  <span className="formHintLabel">{channelConfig.valueLabel}:</span>{" "}
                  {channelConfig.helper}
                </p>
                <p>
                  <span className="formHintLabel">Uygulama davranışı:</span>{" "}
                  {channelConfig.actionHint}
                </p>
                {formError ? <p className="formErrorText">{formError}</p> : null}
              </div>
            </div>
            <div className="fieldFull buttonRow">
              <button
                className="primaryButton"
                type="submit"
                disabled={saveMutation.isPending || Boolean(formError) || !activeCompanyId}
              >
                {saveMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
              </button>
              <button
                className="ghostButton"
                type="button"
                onClick={startNewChannel}
                disabled={!activeCompanyId}
              >
                Yeni kanal formu
              </button>
            </div>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}
