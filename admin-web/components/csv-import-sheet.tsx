"use client";

import { useMemo, useRef, useState, type ChangeEvent } from "react";
import Papa from "papaparse";
import { Upload, FileSpreadsheet, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { CsvImportResult } from "@/lib/types";

interface CsvImportSheetProps {
  title: string;
  description: string;
  expectedColumns: string[];
  matchRules: string[];
  sampleCsv: string;
  onImport: (rows: Array<Record<string, unknown>>) => Promise<CsvImportResult>;
}

export default function CsvImportSheet({
  title,
  description,
  expectedColumns,
  matchRules,
  sampleCsv,
  onImport,
}: CsvImportSheetProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [csvText, setCsvText] = useState("");
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<Array<Record<string, unknown>>>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [result, setResult] = useState<CsvImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const headers = useMemo(() => Object.keys(rows[0] || {}), [rows]);
  const previewRows = useMemo(() => rows.slice(0, 5), [rows]);

  function downloadTemplate() {
    const blob = new Blob([sampleCsv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${title.toLocaleLowerCase("tr").replace(/\s+/g, "-")}-template.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function parseText(raw: string) {
    setParseError(null);
    setResult(null);

    const parsed = Papa.parse<Record<string, unknown>>(raw, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
    });

    if (parsed.errors.length > 0) {
      setParseError(parsed.errors[0]?.message || "CSV parse edilemedi.");
      setRows([]);
      return;
    }

    const cleanedRows = parsed.data.filter((row: Record<string, unknown>) =>
      Object.values(row).some((value) => String(value ?? "").trim().length > 0)
    );

    if (cleanedRows.length === 0) {
      setParseError("CSV içinde içe aktarılacak satır bulunamadı.");
      setRows([]);
      return;
    }

    setRows(cleanedRows);
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const text = await file.text();
    setCsvText(text);
    parseText(text);
  }

  async function handleImport() {
    if (rows.length === 0) {
      setParseError("Önce geçerli bir CSV yükle veya yapıştır.");
      return;
    }

    setIsImporting(true);
    setParseError(null);
    try {
      const response = await onImport(rows);
      setResult(response);
    } catch (error) {
      setParseError(error instanceof Error ? error.message : "CSV import sırasında hata oluştu.");
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4" />
          CSV import
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-3xl">
        <div className="grid gap-5">
          <div>
            <p className="eyebrow">Bulk import</p>
            <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={() => fileInputRef.current?.click()}>
              <FileSpreadsheet className="h-4 w-4" />
              CSV dosyası seç
            </Button>
            <Button type="button" variant="outline" onClick={downloadTemplate}>
              <Download className="h-4 w-4" />
              Template indir
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Beklenen kolonlar</CardTitle>
              <CardDescription>
                CSV başlık satırında aşağıdaki kolonları kullan. İhtiyacın olmayan alanları boş bırakabilirsin.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex flex-wrap gap-2">
                {expectedColumns.map((column) => (
                  <Badge key={column} variant="outline">
                    {column}
                  </Badge>
                ))}
              </div>
              <div className="grid gap-2 text-sm text-muted-foreground">
                {matchRules.map((rule) => (
                  <p key={rule}>{rule}</p>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-2">
            <label className="text-sm font-medium">CSV içeriği</label>
            <Textarea
              value={csvText}
              onChange={(event) => setCsvText(event.target.value)}
              placeholder="CSV içeriğini buraya yapıştırabilirsin."
              className="min-h-[220px]"
            />
            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="outline" onClick={() => parseText(csvText)}>
                Önizlemeyi yenile
              </Button>
              {fileName ? <Badge variant="outline">Dosya: {fileName}</Badge> : null}
              {rows.length > 0 ? <Badge>{rows.length} satır hazır</Badge> : null}
            </div>
          </div>

          {parseError ? <div className="rounded-xl border border-destructive/20 bg-rose-50 p-4 text-sm text-rose-700">{parseError}</div> : null}

          {rows.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Önizleme</CardTitle>
                <CardDescription>İlk 5 satır gösteriliyor.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        {headers.map((header) => (
                          <th key={header} className="px-3 py-2 text-left font-semibold text-muted-foreground">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((row, index) => (
                        <tr key={index} className="border-b border-border last:border-0">
                          {headers.map((header) => (
                            <td key={header} className="px-3 py-2 align-top">
                              {String(row[header] ?? "")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {result ? (
            <Card>
              <CardHeader>
                <CardTitle>İçe aktarma sonucu</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="flex flex-wrap gap-2">
                  <Badge>Yeni: {result.created}</Badge>
                  <Badge variant="outline">Güncellendi: {result.updated}</Badge>
                  <Badge variant="outline">Atlandı: {result.skipped}</Badge>
                  <Badge variant={result.errors.length > 0 ? "danger" : "success"}>
                    Hata: {result.errors.length}
                  </Badge>
                </div>
                {result.errors.length > 0 ? (
                  <>
                    <Separator />
                    <div className="grid gap-2 text-sm text-rose-700">
                      {result.errors.slice(0, 20).map((error) => (
                        <p key={error}>{error}</p>
                      ))}
                    </div>
                  </>
                ) : null}
              </CardContent>
            </Card>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={handleImport} disabled={isImporting || rows.length === 0}>
              {isImporting ? "İçe aktarılıyor..." : "CSV içe aktar"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
