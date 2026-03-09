import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";

export const metadata: Metadata = {
  title: "CabukUlas Admin",
  description: "CabukUlas veri yönetimi ve analitik paneli",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
