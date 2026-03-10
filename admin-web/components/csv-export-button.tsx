"use client";

import { useState } from "react";
import Papa from "papaparse";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CsvExportButtonProps {
  filenamePrefix: string;
  label?: string;
  onExport: () => Promise<Array<Record<string, unknown>>>;
}

export default function CsvExportButton({
  filenamePrefix,
  label = "CSV indir",
  onExport,
}: CsvExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleExport() {
    setIsExporting(true);
    setErrorMessage(null);
    try {
      const rows = await onExport();
      const csv = Papa.unparse(rows);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      const stamp = new Date().toISOString().slice(0, 10);
      anchor.href = url;
      anchor.download = `${filenamePrefix}-${stamp}.csv`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "CSV dışa aktarımı sırasında hata oluştu."
      );
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="grid gap-2">
      <Button type="button" variant="outline" onClick={handleExport} disabled={isExporting}>
        <Download className="h-4 w-4" />
        {isExporting ? "Hazırlanıyor..." : label}
      </Button>
      {errorMessage ? <p className="text-sm text-rose-700">{errorMessage}</p> : null}
    </div>
  );
}
