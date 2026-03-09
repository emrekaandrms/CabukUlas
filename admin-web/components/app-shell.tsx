"use client";

import { PropsWithChildren, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import AppSidebar from "@/components/app-sidebar";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const pageLabels: Record<string, string> = {
  "/overview": "Overview",
  "/companies": "Companies",
  "/categories": "Categories",
  "/channels": "Contact Channels",
  "/review": "Review Queue",
  "/placements": "Placements",
  "/data-health": "Data Health",
  "/reports": "Reports",
  "/analytics": "Analytics",
  "/audit-log": "Audit Log",
  "/settings": "Settings",
};

export default function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <div className="appLayout">
      <AppSidebar />
      <div className="appContent">
        <header className="topbar">
          <div>
            <p className="eyebrow">Operational surface</p>
            <h2>{pageLabels[pathname] || "CabukUlas Admin"}</h2>
          </div>
          <button className="ghostButton" onClick={handleLogout}>
            Çıkış yap
          </button>
        </header>
        <main className="pageContent">{children}</main>
      </div>
    </div>
  );
}
