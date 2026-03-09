"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SectionCard from "@/components/section-card";
import DataTable from "@/components/data-table";
import { listReviewCompanies, updateCompanyWorkflow } from "@/lib/admin-api";
import { formatDate, statusLabel } from "@/lib/format";

export default function ReviewPage() {
  const queryClient = useQueryClient();
  const reviewCompanies = useQuery({
    queryKey: ["admin", "review", "companies"],
    queryFn: listReviewCompanies,
  });

  const workflowMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateCompanyWorkflow(id, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "review", "companies"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "companies"] });
    },
  });

  return (
    <SectionCard
      title="Review queue"
      description="Editör tarafından hazırlanan değişiklikleri doğrula, onayla ya da reddet."
    >
      <DataTable
        rows={reviewCompanies.data || []}
        columns={[
          { key: "name", header: "Firma", render: (row) => row.name },
          { key: "category", header: "Kategori", render: (row) => row.category?.name || "-" },
          {
            key: "status",
            header: "Durum",
            render: (row) => <span className="badge">{statusLabel(row.status)}</span>,
          },
          {
            key: "verification",
            header: "Verification",
            render: (row) => statusLabel(row.verification_status),
          },
          {
            key: "updated",
            header: "Son güncelleme",
            render: (row) => formatDate(row.updated_at),
          },
          {
            key: "actions",
            header: "Aksiyon",
            render: (row) => (
              <div className="buttonRow">
                <button
                  className="secondaryButton"
                  onClick={() => workflowMutation.mutate({ id: row.id, status: "in_review" })}
                >
                  İncelemeye al
                </button>
                <button
                  className="primaryButton"
                  onClick={() => workflowMutation.mutate({ id: row.id, status: "approved" })}
                >
                  Onayla
                </button>
                <button
                  className="ghostButton"
                  onClick={() => workflowMutation.mutate({ id: row.id, status: "published" })}
                >
                  Yayınla
                </button>
                <button
                  className="dangerButton"
                  onClick={() => workflowMutation.mutate({ id: row.id, status: "rejected" })}
                >
                  Reddet
                </button>
              </div>
            ),
          },
        ]}
      />
    </SectionCard>
  );
}
