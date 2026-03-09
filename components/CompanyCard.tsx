import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Company } from "@/lib/types";
import {
  formatUpdatedAt,
  getChannelLabel,
  getCompanyFastestChannel,
  getCompanyTrustSignals,
} from "@/lib/utils";
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/theme";
import FastestBadge from "./FastestBadge";

interface CompanyCardProps {
  company: Company;
  compact?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (company: Company) => void;
}

export default function CompanyCard({
  company,
  compact = false,
  isFavorite = false,
  onToggleFavorite,
}: CompanyCardProps) {
  const router = useRouter();
  const fastestChannel = getCompanyFastestChannel(company);
  const trustSignals = getCompanyTrustSignals(company);
  const updatedAt = formatUpdatedAt(company.updated_at);

  return (
    <TouchableOpacity
      style={[styles.card, compact && styles.compactCard]}
      activeOpacity={0.78}
      onPress={() => router.push(`/company/${company.slug}`)}
    >
      <View style={styles.row}>
        <View style={styles.logoContainer}>
          {company.logo_url ? (
            <Image
              source={{ uri: company.logo_url }}
              style={styles.logo}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.logoInitial}>{company.name.charAt(0)}</Text>
          )}
        </View>

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {company.name}
            </Text>
            {fastestChannel ? <FastestBadge small /> : null}
          </View>
          {company.category?.name ? (
            <Text style={styles.categoryLine} numberOfLines={1}>
              {company.category.name}
            </Text>
          ) : null}
          <View style={styles.metaRow}>
            {trustSignals.map((signal) => (
              <View key={signal} style={styles.metaPill}>
                <Text style={styles.metaPillText}>{signal}</Text>
              </View>
            ))}
          </View>
        </View>

        {onToggleFavorite ? (
          <TouchableOpacity
            style={styles.favoriteButton}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => onToggleFavorite(company)}
          >
            <Ionicons
              name={isFavorite ? "bookmark" : "bookmark-outline"}
              size={18}
              color={isFavorite ? Colors.accent : Colors.textSecondary}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.arrowContainer}>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={Colors.textTertiary}
            />
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          {fastestChannel ? (
            <>
              <Ionicons name="flash" size={12} color={Colors.accent} />
              <Text style={styles.fastestText}>
                En hızlı kanal: {getChannelLabel(fastestChannel)}
              </Text>
            </>
          ) : (
            <>
              <Ionicons
                name="shield-checkmark-outline"
                size={12}
                color={Colors.textSecondary}
              />
              <Text style={styles.fastestText}>Resmi temas seçenekleri</Text>
            </>
          )}
        </View>
        {updatedAt ? <Text style={styles.updatedAt}>{updatedAt}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: 18,
    marginHorizontal: Spacing.screenPadding,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },
  compactCard: {
    marginHorizontal: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  logoContainer: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logo: {
    width: 54,
    height: 54,
  },
  logoInitial: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
  },
  info: {
    flex: 1,
    marginLeft: 14,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  name: {
    ...Typography.cardTitle,
    flexShrink: 1,
  },
  categoryLine: {
    ...Typography.meta,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  metaPill: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  metaPillText: {
    ...Typography.micro,
    color: Colors.textSecondary,
  },
  favoriteButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderLight,
    gap: 12,
  },
  footerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  fastestText: {
    ...Typography.meta,
    color: Colors.text,
    marginLeft: 6,
  },
  updatedAt: {
    ...Typography.micro,
    color: Colors.textSecondary,
    textAlign: "right",
  },
});
