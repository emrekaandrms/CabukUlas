import { Linking, Platform } from "react-native";
import { ChannelType, WorkingHours } from "./types";

/**
 * Kanal tipine gore ikon ismi dondurur (MaterialCommunityIcons)
 */
export function getChannelIcon(type: ChannelType): string {
  const icons: Record<ChannelType, string> = {
    phone: "phone",
    live_chat: "chat-processing",
    email: "email-outline",
    twitter: "twitter",
    whatsapp: "whatsapp",
    instagram: "instagram",
    app: "cellphone",
  };
  return icons[type] || "help-circle-outline";
}

/**
 * Kanal tipine gore Turkce etiket dondurur
 */
export function getChannelLabel(type: ChannelType): string {
  const labels: Record<ChannelType, string> = {
    phone: "Telefon",
    live_chat: "Canli Destek",
    email: "E-posta",
    twitter: "Twitter/X",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    app: "Uygulama",
  };
  return labels[type] || type;
}

/**
 * Kanal tipine gore renk dondurur
 */
export function getChannelColor(type: ChannelType): string {
  const colors: Record<ChannelType, string> = {
    phone: "#1a73e8",
    live_chat: "#0d9488",
    email: "#ea580c",
    twitter: "#1d9bf0",
    whatsapp: "#25d366",
    instagram: "#e1306c",
    app: "#7c3aed",
  };
  return colors[type] || "#6b7280";
}

/**
 * Kanala tiklandiginda ilgili aksiyonu baslat
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
      // Numara veya link olabilir
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
      url = value;
      break;
    default:
      url = value;
  }

  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      // Fallback: tarayicide ac
      if (value.startsWith("http")) {
        await Linking.openURL(value);
      }
    }
  } catch (error) {
    console.error("Kanal acilamadi:", error);
  }
}

/**
 * Calisma saatlerine gore su an acik mi kontrol et
 */
export function isCurrentlyOpen(workingHours: WorkingHours | null): boolean | null {
  if (!workingHours) return null;

  const now = new Date();
  const day = now.getDay(); // 0=Pazar, 6=Cumartesi
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
 * Turkce karakterleri normalize et (arama icin)
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
    "e-ticaret": "cart-outline",
    kargo: "cube-outline",
    banka: "card-outline",
    telekom: "call-outline",
    dijital: "globe-outline",
    sigorta: "shield-checkmark-outline",
    enerji: "flash-outline",
    ulasim: "bus-outline",
  };
  return iconMap[iconName] || "business-outline";
}
