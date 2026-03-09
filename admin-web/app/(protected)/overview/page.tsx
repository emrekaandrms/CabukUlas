"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import MetricCard from "@/components/metric-card";
import SectionCard from "@/components/section-card";
import DataTable from "@/components/data-table";
import {
  fetchAnalyticsDaily,
  fetchNoResultSearches,
  fetchOverviewMetrics,
  fetchTopChannels,
  fetchTopCompanies,
} from "@/lib/admin-api";
import { formatNumber } from "@/lib/format";

export default function OverviewPage() {
  const metrics = useQuery({
    queryKey: ["admin", "overview", "metrics"],
    queryFn: fetchOverviewMetrics,
  });
  const analyticsDaily = useQuery({
    queryKey: ["admin", "analytics", "daily"],
    queryFn: fetchAnalyticsDaily,
  });
  const topCompanies = useQuery({
    queryKey: ["admin", "analytics", "top-companies"],
    queryFn: fetchTopCompanies,
  });
  const topChannels = useQuery({
    queryKey: ["admin", "analytics", "top-channels"],
    queryFn: fetchTopChannels,
  });
  const noResultSearches = useQuery({
    queryKey: ["admin", "analytics", "no-result-searches"],
    queryFn: fetchNoResultSearches,
  });

  const overview = metrics.data;

  return (
    <>
      <section className="pageIntro">
        <div>
          <p className="eyebrow">Control tower</p>
          <h1>Yayın, veri sağlığı ve ürün davranışı tek bakışta</h1>
          <p>
            Bu panel editoryal iş akışını, veri kalitesini ve mobil uygulamadaki gerçek
            kullanım davranışlarını aynı yüzeyde toplar.
          </p>
        </div>
      </section>

      <div className="metricsGrid">
        <MetricCard
          title="Bekleyen inceleme"
          value={formatNumber(overview?.pendingReview)}
          hint="Review queue içinde aksiyon bekleyen kayıtlar"
          tone="warning"
        />
        <MetricCard
          title="Doğrulama gerekli"
          value={formatNumber(overview?.needsVerification)}
          hint="Güven sinyali eksik ya da yeniden kontrol gerektiren firmalar"
          tone="danger"
        />
        <MetricCard
          title="Açık rapor"
          value={formatNumber(overview?.openReports)}
          hint="Kullanıcılardan gelen çözülmemiş hata bildirimleri"
          tone="warning"
        />
        <MetricCard
          title="Toplam firma"
          value={formatNumber(overview?.companies)}
          hint={`${formatNumber(overview?.channels)} kanal, ${formatNumber(
            overview?.placements
          )} placement`}
          tone="success"
        />
      </div>

      <div className="splitGrid">
        <SectionCard
          title="Kullanım trendi"
          description="Son 14 güne ait günlük oturum ve kanal tıklaması görünümü"
        >
          <div className="chartWrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsDaily.data || []}>
                <defs>
                  <linearGradient id="sessionsFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#d9733a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#d9733a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#ece4d8" vertical={false} />
                <XAxis dataKey="metric_date" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="sessions"
                  stroke="#d9733a"
                  fillOpacity={1}
                  fill="url(#sessionsFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="Operasyon özeti"
          description="Sahada veri kalitesi ve içerik bakım yükü"
        >
          <div className="stack">
            <MetricCard
              title="Bozuk / zayıf kaynak"
              value={formatNumber(overview?.brokenSources)}
              hint="Düşük confidence ya da kırık source adayları"
              tone="danger"
            />
            <MetricCard
              title="Stale kayıt"
              value={formatNumber(overview?.staleRecords)}
              hint="Tazelik skoru düşük görünen firma kayıtları"
              tone="warning"
            />
          </div>
        </SectionCard>
      </div>

      <div className="splitGrid">
        <SectionCard
          title="En çok açılan firmalar"
          description="Firma açılışı ve kanal tıklaması performansı"
        >
          <DataTable
            rows={topCompanies.data || []}
            columns={[
              { key: "name", header: "Firma", render: (row) => row.company_name },
              {
                key: "opens",
                header: "Açılış",
                render: (row) => formatNumber(row.opens),
              },
              {
                key: "taps",
                header: "Kanal tıklaması",
                render: (row) => formatNumber(row.channel_taps),
              },
            ]}
          />
        </SectionCard>

        <SectionCard
          title="En çok kullanılan kanallar"
          description="Kullanıcının en çok hangi iletişim yoluna geçtiği"
        >
          <DataTable
            rows={topChannels.data || []}
            columns={[
              { key: "channel_type", header: "Kanal", render: (row) => row.channel_type },
              { key: "taps", header: "Tıklama", render: (row) => formatNumber(row.taps) },
            ]}
          />
        </SectionCard>
      </div>

      <SectionCard
        title="Sonuçsuz aramalar"
        description="Arama kalitesi ve kapsama boşlukları için öncelik listesi"
      >
        <DataTable
          rows={noResultSearches.data || []}
          columns={[
            { key: "query_text", header: "Arama terimi", render: (row) => row.query_text },
            {
              key: "count",
              header: "Tekrar",
              render: (row) => formatNumber(row.no_result_count),
            },
          ]}
        />
      </SectionCard>
    </>
  );
}
