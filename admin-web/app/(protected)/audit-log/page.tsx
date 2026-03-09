"use client";

import { useQuery } from "@tanstack/react-query";
import SectionCard from "@/components/section-card";
import DataTable from "@/components/data-table";
import { listAuditLogs } from "@/lib/admin-api";
import { formatDate } from "@/lib/format";

export default function AuditLogPage() {
  const auditLogs = useQuery({
    queryKey: ["admin", "audit-log"],
    queryFn: listAuditLogs,
  });

  return (
    <SectionCard
      title="Audit log"
      description="Kim neyi ne zaman değiştirdiğini before / after ve reason ile takip edin."
    >
      <DataTable
        rows={auditLogs.data || []}
        columns={[
          { key: "entity", header: "Varlık", render: (row) => `${row.entity_type}:${row.entity_id}` },
          { key: "action", header: "Aksiyon", render: (row) => row.action },
          { key: "reason", header: "Neden", render: (row) => row.reason || "-" },
          { key: "changedBy", header: "Değiştiren", render: (row) => row.changed_by || "-" },
          { key: "created", header: "Tarih", render: (row) => formatDate(row.created_at) },
        ]}
      />
    </SectionCard>
  );
}
