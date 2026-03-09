import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, Typography } from "@/constants/theme";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onPressAction?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export default function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onPressAction,
  icon,
}: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.textBlock}>
        <View style={styles.titleRow}>
          {icon ? <Ionicons name={icon} size={15} color={Colors.accent} /> : null}
          <Text style={[styles.title, icon ? styles.titleWithIcon : null]}>{title}</Text>
        </View>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {actionLabel && onPressAction ? (
        <TouchableOpacity
          style={styles.action}
          activeOpacity={0.7}
          onPress={onPressAction}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: Spacing.md,
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.sm,
  },
  textBlock: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    ...Typography.sectionTitle,
  },
  titleWithIcon: {
    marginLeft: 6,
  },
  subtitle: {
    ...Typography.meta,
    marginTop: 4,
  },
  action: {
    paddingVertical: 2,
  },
  actionText: {
    ...Typography.meta,
    color: Colors.accent,
    fontWeight: "700",
  },
});
