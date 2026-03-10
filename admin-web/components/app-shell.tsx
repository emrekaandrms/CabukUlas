"use client";

import { PropsWithChildren, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import AppSidebar from "@/components/app-sidebar";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <div className={`appLayout ${sidebarCollapsed ? "sidebarCollapsedLayout" : ""}`}>
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />
      <div className="appContent">
        <header className="topbar">
          <div className="topbarTitleRow">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="mobileSidebarTrigger">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 sm:max-w-sm">
                <AppSidebar collapsed={false} onToggle={() => undefined} mobile />
              </SheetContent>
            </Sheet>
            <Button
              variant="outline"
              className="sidebarToggleButton"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
            >
              {sidebarCollapsed ? "Menüyü aç" : "Menüyü daralt"}
            </Button>
            <div>
              <p className="eyebrow">Operational surface</p>
              <h2>{pageLabels[pathname] || "CabukUlas Admin"}</h2>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Çıkış yap
          </Button>
        </header>
        <main className="pageContent">{children}</main>
      </div>
    </div>
  );
}
