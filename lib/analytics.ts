import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { supabase } from "./supabase";
import { ProductEventPayload } from "./types";
import { normalizeText } from "./utils";

const ANALYTICS_USER_KEY = "cabukulas:analytics-user-id";
const ANALYTICS_SESSION_KEY = "cabukulas:analytics-session-id";
const locale = Intl.DateTimeFormat().resolvedOptions().locale || "unknown";

type AnalyticsIdentity = {
  userPseudoId: string;
  sessionId: string;
};

let cachedIdentity: AnalyticsIdentity | null = null;
let sessionStartedAt = 0;

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

async function ensureIdentity(): Promise<AnalyticsIdentity> {
  if (cachedIdentity) return cachedIdentity;

  let userPseudoId = await AsyncStorage.getItem(ANALYTICS_USER_KEY);
  if (!userPseudoId) {
    userPseudoId = createId("usr");
    await AsyncStorage.setItem(ANALYTICS_USER_KEY, userPseudoId);
  }

  let sessionId = await AsyncStorage.getItem(ANALYTICS_SESSION_KEY);
  if (!sessionId) {
    sessionId = createId("ses");
    await AsyncStorage.setItem(ANALYTICS_SESSION_KEY, sessionId);
  }

  cachedIdentity = { userPseudoId, sessionId };
  return cachedIdentity;
}

async function replaceSession() {
  const userPseudoId = (await ensureIdentity()).userPseudoId;
  const sessionId = createId("ses");
  await AsyncStorage.setItem(ANALYTICS_SESSION_KEY, sessionId);
  cachedIdentity = { userPseudoId, sessionId };
  return cachedIdentity;
}

export async function trackAnalyticsEvent(payload: ProductEventPayload) {
  try {
    const identity = await ensureIdentity();

    await supabase.from("product_events").insert({
      user_pseudo_id: identity.userPseudoId,
      session_id: identity.sessionId,
      event_name: payload.event_name,
      source_screen: payload.source_screen,
      target_screen: payload.target_screen,
      company_id: payload.company_id || null,
      category_id: payload.category_id || null,
      contact_channel_id: payload.contact_channel_id || null,
      channel_type: payload.channel_type || null,
      query_text: payload.query_text || null,
      query_normalized: payload.query_text ? normalizeText(payload.query_text) : null,
      platform: Platform.OS,
      app_version: Constants.expoConfig?.version || "unknown",
      locale,
      device_type:
        Platform.OS === "ios" || Platform.OS === "android" ? "mobile" : Platform.OS,
      duration_seconds: payload.duration_seconds || null,
      metadata: payload.metadata || {},
    });
  } catch (error) {
    console.warn("Analytics event yazılamadı", error);
  }
}

export async function startAnalyticsSession() {
  const identity = await replaceSession();
  sessionStartedAt = Date.now();

  await supabase.from("product_events").insert({
    user_pseudo_id: identity.userPseudoId,
    session_id: identity.sessionId,
    event_name: "session_started",
    platform: Platform.OS,
    app_version: Constants.expoConfig?.version || "unknown",
    locale,
    device_type: Platform.OS === "ios" || Platform.OS === "android" ? "mobile" : Platform.OS,
    metadata: {},
  });
}

export async function endAnalyticsSession() {
  if (!sessionStartedAt) return;

  const identity = await ensureIdentity();
  const durationSeconds = Math.round((Date.now() - sessionStartedAt) / 1000);

  await supabase.from("product_events").insert({
    user_pseudo_id: identity.userPseudoId,
    session_id: identity.sessionId,
    event_name: "session_ended",
    platform: Platform.OS,
    app_version: Constants.expoConfig?.version || "unknown",
    locale,
    device_type: Platform.OS === "ios" || Platform.OS === "android" ? "mobile" : Platform.OS,
    duration_seconds: durationSeconds,
    metadata: {},
  });
}
