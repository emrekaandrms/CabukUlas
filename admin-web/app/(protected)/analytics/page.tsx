"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import SectionCard from "@/components/section-card";
import DataTable from "@/components/data-table";
import {
  fetchAnalyticsDaily,
  fetchNoResultSearches,
  fetchTopChannels,
  fetchTopCompanies,
} from "@/lib/admin-api";
import { formatNumber } from "@/lib/format";

export default function AnalyticsPage() {
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

  return (
    <>
      <section className="pageIntro">
        <div>
          <p className="eyebrow">Analytics</p>
          <h1>Ürün kullanımı ve operasyon içgörüleri</h1>
          <p>
            Hangi ekranlar açılıyor, hangi firmalara gidiliyor, hangi butonlar tıklanıyor ve
            nerede veri boşluğu oluşuyor tek rapor alanında görünür.
          </p>
        </div>
      </section>

      <SectionCard
        title="Günlük ürün metrikleri"
        description="Oturum, kullanıcı, ekran görüntüleme ve kanal tıklaması trendi"
      >
        <div className="chartWrap">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsDaily.data || []}>
              <CartesianGrid stroke="#ece4d8" vertical={false} />
              <XAxis dataKey="metric_date" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="sessions" fill="#18181b" radius={[6, 6, 0, 0]} />
              <Bar dataKey="channel_taps" fill="#d9733a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <div className="splitGrid">
        <SectionCard
          title="Top firms"
          description="Firma açılışı ve temas aksiyonu üretme performansı"
        >
          <DataTable
            rows={topCompanies.data || []}
            columns={[
              { key: "name", header: "Firma", render: (row) => row.company_name },
              { key: "opens", header: "Açılış", render: (row) => formatNumber(row.opens) },
              {
                key: "taps",
                header: "Kanal tıklaması",
                render: (row) => formatNumber(row.channel_taps),
              },
            ]}
          />
        </SectionCard>
        <SectionCard
          title="Top channels"
          description="Kullanıcının en çok tercih ettiği iletişim yolları"
        >
          <DataTable
            rows={topChannels.data || []}
            columns={[
              { key: "channel", header: "Kanal", render: (row) => row.channel_type },
              { key: "taps", header: "Tıklama", render: (row) => formatNumber(row.taps) },
            ]}
          />
        </SectionCard>
      </div>

      <SectionCard
        title="No-result search insights"
        description="Veri kapsamını genişletmek için en kritik boş aramalar"
      >
        <DataTable
          rows={noResultSearches.data || []}
          columns={[
            { key: "query", header: "Sorgu", render: (row) => row.query_text },
            { key: "count", header: "Tekrar", render: (row) => formatNumber(row.no_result_count) },
          ]}
        />
      </SectionCard>
    </>
  );
}
