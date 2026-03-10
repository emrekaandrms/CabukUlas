"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const navigation = [
  { href: "/overview", label: "Overview", shortLabel: "Ov" },
  { href: "/companies", label: "Companies", shortLabel: "Co" },
  { href: "/categories", label: "Categories", shortLabel: "Ca" },
  { href: "/channels", label: "Contact Channels", shortLabel: "Ch" },
  { href: "/review", label: "Review Queue", shortLabel: "Re" },
  { href: "/placements", label: "Placements", shortLabel: "Pl" },
  { href: "/data-health", label: "Data Health", shortLabel: "Dh" },
  { href: "/reports", label: "Reports", shortLabel: "Rp" },
  { href: "/analytics", label: "Analytics", shortLabel: "An" },
  { href: "/audit-log", label: "Audit Log", shortLabel: "Au" },
  { href: "/settings", label: "Settings", shortLabel: "St" },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobile?: boolean;
}

export default function AppSidebar({ collapsed, onToggle, mobile = false }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={clsx("sidebar", collapsed && "collapsedSidebar", mobile && "mobileSidebar")}>
      <div className="sidebarHeader">
        <Card className="brandBlock">
          <CardContent className="p-4">
            <p className="eyebrow">CabukUlas</p>
            <h1>{collapsed ? "CU" : "Admin"}</h1>
            {!collapsed ? <span>Yayın, veri sağlığı ve analitik merkezi</span> : null}
          </CardContent>
        </Card>
        {!mobile ? (
          <Button variant="outline" className="sidebarMiniToggle" onClick={onToggle}>
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        ) : null}
      </div>

      <Separator className="my-5" />

      <nav className="sidebarNav">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx("sidebarLink", pathname === item.href && "active")}
            title={item.label}
          >
            <span className="sidebarLinkBadge">{item.shortLabel}</span>
            {!collapsed ? <span>{item.label}</span> : null}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
