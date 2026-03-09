"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navigation = [
  { href: "/overview", label: "Overview" },
  { href: "/companies", label: "Companies" },
  { href: "/categories", label: "Categories" },
  { href: "/channels", label: "Contact Channels" },
  { href: "/review", label: "Review Queue" },
  { href: "/placements", label: "Placements" },
  { href: "/data-health", label: "Data Health" },
  { href: "/reports", label: "Reports" },
  { href: "/analytics", label: "Analytics" },
  { href: "/audit-log", label: "Audit Log" },
  { href: "/settings", label: "Settings" },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="brandBlock">
        <p className="eyebrow">CabukUlas</p>
        <h1>Admin</h1>
        <span>Yayın, veri sağlığı ve analitik merkezi</span>
      </div>

      <nav className="sidebarNav">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx("sidebarLink", pathname === item.href && "active")}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
