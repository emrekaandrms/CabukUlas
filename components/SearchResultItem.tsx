import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SearchCompanyIndex } from "@/lib/types";
import { getChannelLabel } from "@/lib/utils";
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/theme";

interface SearchResultItemProps {
  company: SearchCompanyIndex;
  compact?: boolean;
  onPress?: () => void;
}

export default function SearchResultItem({
  company,
  compact = false,
  onPress,
}: SearchResultItemProps) {
  const router = useRouter();

  const handlePress = () => {
    onPress?.();
    router.push(`/company/${company.slug}`);
  };

  return (
    <TouchableOpacity
      style={[styles.card, compact && styles.compactCard]}
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <View style={styles.logoWrap}>
        {company.logo_url ? (
          <Image source={{ uri: company.logo_url }} style={styles.logo} resizeMode="contain" />
        ) : (
          <Text style={styles.logoText}>{company.name.charAt(0)}</Text>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {company.name}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {company.category?.name || "Kurumsal hizmet"}
        </Text>

        <View style={styles.badgeRow}>
          {company.fastest_channel_type ? (
            <View style={styles.badge}>
              <Ionicons name="flash" size={11} color={Colors.accent} />
              <Text style={styles.badgeText}>
                {getChannelLabel(company.fastest_channel_type)}
              </Text>
            </View>
          ) : null}

          {company.has_cargo_tracking ? (
            <View style={styles.badge}>
              <Ionicons name="cube-outline" size={11} color={Colors.textSecondary} />
              <Text style={styles.badgeText}>Kargo takibi</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.arrow}>
        <Ionicons name="arrow-forward" size={15} color={Colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: 16,
    marginHorizontal: Spacing.screenPadding,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },
  compactCard: {
    marginBottom: 8,
  },
  logoWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logo: {
    width: 48,
    height: 48,
  },
  logoText: {
    ...Typography.cardTitle,
  },
  info: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
  },
  name: {
    ...Typography.cardTitle,
  },
  meta: {
    ...Typography.meta,
    marginTop: 3,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  badgeText: {
    ...Typography.micro,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  arrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceSecondary,
  },
});
