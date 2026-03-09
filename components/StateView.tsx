import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BorderRadius, Colors, Shadows, Spacing, Typography } from "@/constants/theme";

interface StateViewProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onPressAction?: () => void;
  compact?: boolean;
}

export default function StateView({
  icon,
  title,
  subtitle,
  actionLabel,
  onPressAction,
  compact = false,
}: StateViewProps) {
  return (
    <View style={[styles.container, compact && styles.compact]}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={compact ? 24 : 30} color={Colors.textSecondary} />
      </View>
      <Text style={[styles.title, compact && styles.compactTitle]}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {actionLabel && onPressAction ? (
        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onPressAction}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xxl,
    paddingVertical: 48,
  },
  compact: {
    paddingVertical: 28,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...Typography.sectionTitle,
    marginTop: Spacing.md,
    textAlign: "center",
  },
  compactTitle: {
    fontSize: 16,
    lineHeight: 20,
  },
  subtitle: {
    ...Typography.body,
    textAlign: "center",
    marginTop: 8,
  },
  button: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 18,
    paddingVertical: 12,
    ...Shadows.small,
  },
  buttonText: {
    ...Typography.bodyStrong,
    color: Colors.textInverse,
  },
});
