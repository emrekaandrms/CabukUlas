"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SectionCard from "@/components/section-card";
import DataTable from "@/components/data-table";
import { listAdminProfiles, saveAdminProfile } from "@/lib/admin-api";
import { formatDate } from "@/lib/format";
import type { AdminProfile } from "@/lib/types";

const EMPTY_PROFILE: Partial<AdminProfile> = {
  user_id: "",
  full_name: "",
  role: "analyst",
  is_active: true,
};

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Partial<AdminProfile>>(EMPTY_PROFILE);

  const profiles = useQuery({
    queryKey: ["admin", "settings", "profiles"],
    queryFn: listAdminProfiles,
  });

  const saveMutation = useMutation({
    mutationFn: saveAdminProfile,
    onSuccess: async () => {
      setDraft(EMPTY_PROFILE);
      await queryClient.invalidateQueries({ queryKey: ["admin", "settings", "profiles"] });
    },
  });

  return (
    <div className="splitGrid">
      <SectionCard
        title="Admin erişim rolleri"
        description="Web admin paneline kimlerin erişeceğini ve hangi rol ile çalışacağını yönetin."
      >
        <DataTable
          rows={profiles.data || []}
          columns={[
            {
              key: "user",
              header: "Kullanıcı",
              render: (row) => (
                <button className="ghostButton" onClick={() => setDraft(row)}>
                  {row.full_name || row.user_id}
                </button>
              ),
            },
            { key: "role", header: "Rol", render: (row) => row.role },
            { key: "active", header: "Aktif", render: (row) => (row.is_active ? "Evet" : "Hayır") },
            { key: "created", header: "Oluşturuldu", render: (row) => formatDate(row.created_at) },
          ]}
        />
      </SectionCard>

      <SectionCard
        title="Rol ata / güncelle"
        description="Super admin, admin, editor, reviewer, analyst ve support rolleri desteklenir."
      >
        <form
          className="formGrid"
          onSubmit={(event) => {
            event.preventDefault();
            saveMutation.mutate(draft);
          }}
        >
          <div className="field">
            <label>User ID</label>
            <input
              value={draft.user_id || ""}
              onChange={(event) => setDraft((prev) => ({ ...prev, user_id: event.target.value }))}
              required
            />
          </div>
          <div className="field">
            <label>Ad soyad</label>
            <input
              value={draft.full_name || ""}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, full_name: event.target.value }))
              }
            />
          </div>
          <div className="field">
            <label>Rol</label>
            <select
              value={draft.role || "analyst"}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, role: event.target.value as AdminProfile["role"] }))
              }
            >
              <option value="super_admin">super_admin</option>
              <option value="admin">admin</option>
              <option value="editor">editor</option>
              <option value="reviewer">reviewer</option>
              <option value="analyst">analyst</option>
              <option value="support">support</option>
            </select>
          </div>
          <div className="field">
            <label>Aktif</label>
            <select
              value={draft.is_active ? "yes" : "no"}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, is_active: event.target.value === "yes" }))
              }
            >
              <option value="yes">Evet</option>
              <option value="no">Hayır</option>
            </select>
          </div>
          <div className="fieldFull buttonRow">
            <button className="primaryButton" type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Kaydediliyor..." : "Rolü kaydet"}
            </button>
            <button
              className="ghostButton"
              type="button"
              onClick={() => setDraft(EMPTY_PROFILE)}
            >
              Temizle
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}
