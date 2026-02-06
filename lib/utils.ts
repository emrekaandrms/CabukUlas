import { Linking } from "react-native";
import { ChannelType, WorkingHours } from "./types";

/**
 * Kanal tipine gore Ionicons ikon ismi
 */
export function getChannelIcon(type: ChannelType): string {
  const icons: Record<ChannelType, string> = {
    phone: "call-outline",
    live_chat: "chatbubble-ellipses-outline",
    email: "mail-outline",
    twitter: "logo-twitter",
    whatsapp: "logo-whatsapp",
    instagram: "logo-instagram",
    app: "phone-portrait-outline",
    sikayetvar: "megaphone-outline",
  };
  return icons[type] || "help-circle-outline";
}

/**
 * Kanal tipine gore Turkce etiket
 */
export function getChannelLabel(type: ChannelType): string {
  const labels: Record<ChannelType, string> = {
    phone: "Telefon",
    live_chat: "Canlı Destek",
    email: "E-posta",
    twitter: "X (Twitter)",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    app: "Uygulama",
    sikayetvar: "Şikayetvar",
  };
  return labels[type] || type;
}

/**
 * Kanal tipine gore aksiyon butonu rengi
 */
export function getChannelActionColor(type: ChannelType): string {
  const colors: Record<ChannelType, string> = {
    phone: "#1A1A1A",
    live_chat: "#FF6B35",
    email: "#1A1A1A",
    twitter: "#1A1A1A",
    whatsapp: "#25D366",
    instagram: "#E1306C",
    app: "#1A1A1A",
    sikayetvar: "#E74C3C",
  };
  return colors[type] || "#1A1A1A";
}

/**
 * Kanal tipine gore aksiyon ikonu
 */
export function getChannelActionIcon(type: ChannelType): string {
  switch (type) {
    case "phone": return "call";
    case "whatsapp": return "logo-whatsapp";
    case "email": return "mail";
    case "live_chat": return "chatbubble-ellipses";
    case "twitter": return "open-outline";
    case "instagram": return "open-outline";
    case "app": return "open-outline";
    case "sikayetvar": return "open-outline";
    default: return "open-outline";
  }
}

/**
 * Kanala tiklandiginda aksiyonu baslat
 */
export async function openChannel(type: ChannelType, value: string): Promise<void> {
  let url = "";

  switch (type) {
    case "phone":
      url = `tel:${value.replace(/\s/g, "")}`;
      break;
    case "email":
      url = `mailto:${value}`;
      break;
    case "whatsapp":
      if (value.startsWith("http")) {
        url = value;
      } else {
        const cleanNumber = value.replace(/[\s+\-()]/g, "");
        url = `whatsapp://send?phone=${cleanNumber}`;
      }
      break;
    case "twitter":
    case "instagram":
    case "live_chat":
    case "app":
    case "sikayetvar":
      url = value;
      break;
    default:
      url = value;
  }

  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else if (value.startsWith("http")) {
      await Linking.openURL(value);
    }
  } catch (error) {
    console.error("Kanal acilamadi:", error);
  }
}

/**
 * Calisma saatlerine gore su an acik mi
 */
export function isCurrentlyOpen(workingHours: WorkingHours | null): boolean | null {
  if (!workingHours) return null;

  const now = new Date();
  const day = now.getDay();
  const isWeekend = day === 0 || day === 6;

  const hoursStr = isWeekend ? workingHours.weekend : workingHours.weekdays;
  if (!hoursStr) return null;

  const parts = hoursStr.split("-");
  if (parts.length !== 2) return null;

  const [startStr, endStr] = parts;
  const [startH, startM] = startStr.split(":").map(Number);
  const [endH, endM] = endStr.split(":").map(Number);

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = startH * 60 + (startM || 0);
  const endMinutes = endH * 60 + (endM || 0);

  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
}

/**
 * Turkce normalize
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .trim();
}

/**
 * Kategori ikonu (Ionicons)
 */
export function getCategoryIcon(iconName: string): string {
  const iconMap: Record<string, string> = {
    "e-ticaret": "bag-handle-outline",
    kargo: "cube-outline",
    banka: "wallet-outline",
    telekom: "wifi-outline",
    dijital: "tv-outline",
    sigorta: "shield-checkmark-outline",
    enerji: "flash-outline",
    ulasim: "airplane-outline",
  };
  return iconMap[iconName] || "business-outline";
}
