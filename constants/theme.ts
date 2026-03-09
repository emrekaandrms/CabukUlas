// ==========================================
// CabukUlas - Premium Product Design System
// ==========================================

const Ink900 = "#18181B";
const Ink700 = "#45434B";
const Ink500 = "#6F6B78";
const Ink300 = "#A7A2AF";
const CanvasWarm = "#F7F4EE";
const CanvasSoft = "#F2EEE6";
const SurfaceRaised = "#FFFFFF";
const SurfaceTinted = "#F6F1EA";
const BorderSoft = "#E6DED2";
const BorderStrong = "#D7CCBD";
const Amber500 = "#D9733A";
const Amber100 = "#FCE9DE";
const Sage500 = "#3F8C6D";
const Sage100 = "#E7F4ED";
const Rose500 = "#C85B66";
const Rose100 = "#FBE8EB";

export const Colors = {
  // Backwards-compatible aliases
  primary: Ink900,
  accent: Amber500,
  accentLight: Amber100,
  accentDark: "#B85B24",
  background: CanvasWarm,
  surface: SurfaceRaised,
  surfaceSecondary: SurfaceTinted,
  text: Ink900,
  textSecondary: Ink700,
  textTertiary: Ink300,
  textInverse: "#FFFFFF",
  border: BorderSoft,
  borderLight: "#EFE8DE",
  success: Sage500,
  danger: Rose500,
  warning: "#D59A28",

  // Semantic scales
  brand: {
    ink: Ink900,
    warmCanvas: CanvasWarm,
    warmSurface: SurfaceTinted,
    accent: Amber500,
    accentMuted: Amber100,
  },
  textTokens: {
    strong: Ink900,
    default: Ink700,
    muted: Ink500,
    subtle: Ink300,
    inverse: "#FFFFFF",
    accent: Amber500,
  },
  surfaceTokens: {
    canvas: CanvasWarm,
    soft: CanvasSoft,
    raised: SurfaceRaised,
    tinted: SurfaceTinted,
    accent: Amber100,
    success: Sage100,
    danger: Rose100,
    contrast: Ink900,
  },
  borderTokens: {
    subtle: "#EFE8DE",
    default: BorderSoft,
    strong: BorderStrong,
    accent: "#F2C8B2",
  },
  status: {
    success: Sage500,
    successSurface: Sage100,
    warning: "#D59A28",
    warningSurface: "#FBF1D9",
    danger: Rose500,
    dangerSurface: Rose100,
    info: Amber500,
    infoSurface: Amber100,
  },
  channel: {
    phone: Ink900,
    whatsapp: "#25D366",
    twitter: "#1DA1F2",
    email: Ink900,
    liveChat: Amber500,
    sikayetvar: Rose500,
    instagram: "#E1306C",
    app: Ink900,
  },
  phone: Ink900,
  whatsapp: "#25D366",
  twitter: "#1DA1F2",
  email: Ink900,
  liveChat: Amber500,
  sikayetvar: Rose500,
  instagram: "#E1306C",
};

export const Shadows = {
  subtle: {
    shadowColor: Ink900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  small: {
    shadowColor: Ink900,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: Ink900,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
  },
  large: {
    shadowColor: Ink900,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 10,
  },
  tabBar: {
    shadowColor: Ink900,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 14,
  },
};

export const Spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  section: 28,
  screenPadding: 20,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  hero: 34,
  display: 40,
};

export const Typography = {
  display: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "800" as const,
    letterSpacing: -1,
    color: Colors.text,
  },
  screenTitle: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "800" as const,
    letterSpacing: -0.8,
    color: Colors.text,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "700" as const,
    letterSpacing: -0.3,
    color: Colors.text,
  },
  cardTitle: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "700" as const,
    letterSpacing: -0.2,
    color: Colors.text,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400" as const,
    color: Colors.textSecondary,
  },
  bodyStrong: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  meta: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500" as const,
    color: Colors.textSecondary,
  },
  micro: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "600" as const,
    letterSpacing: 0.2,
    color: Colors.textTertiary,
  },
};

export const BorderRadius = {
  xs: 10,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 28,
  capsule: 999,
  full: 999,
};

export const Motion = {
  duration: {
    instant: 120,
    quick: 180,
    standard: 240,
    screen: 320,
    splash: 1500,
  },
  spring: {
    gentle: {
      friction: 9,
      tension: 70,
    },
    emphasized: {
      friction: 8,
      tension: 85,
    },
  },
};
