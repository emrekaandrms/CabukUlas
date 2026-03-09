export function formatDate(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("tr-TR", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatShortDate(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function formatNumber(value?: number | null) {
  return new Intl.NumberFormat("tr-TR").format(value || 0);
}

export function statusLabel(value?: string | null) {
  if (!value) return "-";

  const labels: Record<string, string> = {
    draft: "Taslak",
    in_review: "İncelemede",
    approved: "Onaylandı",
    published: "Yayında",
    rejected: "Reddedildi",
    archived: "Arşivde",
    needs_verification: "Doğrulama gerekli",
    verified: "Doğrulandı",
    unverified: "Doğrulanmadı",
    needs_review: "İnceleme gerekli",
    open: "Açık",
    resolved: "Çözüldü",
    pending_review: "İnceleme bekliyor",
  };

  return labels[value] || value;
}
