"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import SectionCard from "@/components/section-card";
import MetricCard from "@/components/metric-card";
import DataTable from "@/components/data-table";
import { listChannels, listCompanies } from "@/lib/admin-api";
import { formatDate, formatNumber, statusLabel } from "@/lib/format";

export default function DataHealthPage() {
  const companies = useQuery({
    queryKey: ["admin", "data-health", "companies"],
    queryFn: listCompanies,
  });
  const channels = useQuery({
    queryKey: ["admin", "data-health", "channels"],
    queryFn: listChannels,
  });

  const health = useMemo(() => {
    const companyRows = companies.data || [];
    const channelRows = channels.data || [];

    const staleCompanies = companyRows.filter((item) => (item.data_freshness_score || 0) < 50);
    const missingVerification = companyRows.filter(
      (item) => item.verification_status === "needs_verification"
    );
    const missingSource = channelRows.filter((item) => !item.official_source_url);
    const multipleFastest = Object.values(
      channelRows.reduce<Record<string, number>>((acc, channel) => {
        if (channel.is_fastest) acc[channel.company_id] = (acc[channel.company_id] || 0) + 1;
        return acc;
      }, {})
    ).filter((count) => count > 1).length;

    return {
      staleCompanies,
      missingVerification,
      missingSource,
      multipleFastest,
    };
  }, [channels.data, companies.data]);

  return (
    <>
      <div className="metricsGrid">
        <MetricCard
          title="Stale firma"
          value={formatNumber(health.staleCompanies.length)}
          hint="Tazelik skoru 50 altındaki kayıtlar"
          tone="warning"
        />
        <MetricCard
          title="Verification eksik"
          value={formatNumber(health.missingVerification.length)}
          hint="Yayına çıkmadan önce kontrol bekleyen firmalar"
          tone="danger"
        />
        <MetricCard
          title="Kaynaksız kanal"
          value={formatNumber(health.missingSource.length)}
          hint="Official source URL girilmemiş contact channel sayısı"
          tone="danger"
        />
        <MetricCard
          title="Çakışan fastest"
          value={formatNumber(health.multipleFastest)}
          hint="Aynı firmada birden fazla fastest kanal olan durumlar"
          tone="warning"
        />
      </div>

      <SectionCard
        title="Öncelikli düzeltme listesi"
        description="İlk olarak stale ve verification eksik kayıtları temizleyin."
      >
        <DataTable
          rows={health.staleCompanies.slice(0, 20)}
          columns={[
            { key: "name", header: "Firma", render: (row) => row.name },
            { key: "status", header: "Durum", render: (row) => statusLabel(row.status) },
            {
              key: "verification",
              header: "Verification",
              render: (row) => statusLabel(row.verification_status),
            },
            {
              key: "updated",
              header: "Güncellendi",
              render: (row) => formatDate(row.updated_at),
            },
          ]}
        />
      </SectionCard>
    </>
  );
}
