import type { ReactNode } from "react";
import SessionGate from "@/components/session-gate";
import AppShell from "@/components/app-shell";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <SessionGate>
      <AppShell>{children}</AppShell>
    </SessionGate>
  );
}
