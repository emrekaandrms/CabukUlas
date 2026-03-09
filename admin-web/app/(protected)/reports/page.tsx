"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SectionCard from "@/components/section-card";
import DataTable from "@/components/data-table";
import { listReports, resolveReport } from "@/lib/admin-api";
import { formatDate, statusLabel } from "@/lib/format";

export default function ReportsPage() {
  const queryClient = useQueryClient();
  const reports = useQuery({
    queryKey: ["admin", "reports"],
    queryFn: listReports,
  });

  const resolveMutation = useMutation({
    mutationFn: resolveReport,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
    },
  });

  return (
    <SectionCard
      title="Public reports"
      description="Yanlış bilgi bildirimlerini al, çöz ve etki takibini görünür kıl."
    >
      <DataTable
        rows={reports.data || []}
        columns={[
          { key: "company", header: "Firma", render: (row) => row.company?.name || "-" },
          { key: "type", header: "Tip", render: (row) => row.report_type },
          { key: "message", header: "Mesaj", render: (row) => row.message || "-" },
          { key: "status", header: "Durum", render: (row) => statusLabel(row.status) },
          { key: "created", header: "Açıldı", render: (row) => formatDate(row.created_at) },
          {
            key: "actions",
            header: "Aksiyon",
            render: (row) =>
              row.status === "resolved" ? (
                "Çözüldü"
              ) : (
                <button
                  className="primaryButton"
                  onClick={() => resolveMutation.mutate(row.id)}
                  disabled={resolveMutation.isPending}
                >
                  Çözüldü olarak işaretle
                </button>
              ),
          },
        ]}
      />
    </SectionCard>
  );
}
