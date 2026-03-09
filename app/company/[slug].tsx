import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCompany } from "@/hooks/useCompany";
import { useQuickAccess } from "@/hooks/useQuickAccess";
import ContactChannelItem from "@/components/ContactChannelItem";
import CargoTracker from "@/components/CargoTracker";
import SkeletonLoader from "@/components/SkeletonLoader";
import StateView from "@/components/StateView";
import SectionHeader from "@/components/SectionHeader";
import { formatUpdatedAt, getCompanyTrustSignals } from "@/lib/utils";
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/theme";

export default function CompanyDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { addRecent, isFavorite, toggleFavorite } = useQuickAccess();
  const { data: company, isLoading, error } = useCompany(slug || "");

  useEffect(() => {
    if (company) {
      addRecent(company);
    }
  }, [addRecent, company]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
            <Ionicons name="chevron-back" size={22} color={Colors.text} />
          </TouchableOpacity>
        </View>
        <SkeletonLoader type="detail" />
      </SafeAreaView>
    );
  }

  if (error || !company) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StateView
          icon="alert-circle-outline"
          title="Firma bulunamadi"
          subtitle="Bu profil kaldirilmis olabilir veya baglanti su anda ulasilamiyor."
          actionLabel="Geri don"
          onPressAction={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  const channels = company.contact_channels || [];
  const fastestChannel = channels.find((channel) => channel.is_fastest);
  const otherChannels = channels.filter((channel) => !channel.is_fastest);
  const favorite = isFavorite(company.id);
  const trustSignals = getCompanyTrustSignals(company);
  const updatedAt = formatUpdatedAt(company.updated_at);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.headerActions}>
          {company.website_url ? (
            <TouchableOpacity
              onPress={() => Linking.openURL(company.website_url!)}
              style={styles.headerBtn}
            >
              <Ionicons name="globe-outline" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            onPress={() => toggleFavorite(company)}
            style={styles.headerBtn}
          >
            <Ionicons
              name={favorite ? "bookmark" : "bookmark-outline"}
              size={20}
              color={favorite ? Colors.accent : Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroLogoWrap}>
            {company.logo_url ? (
              <Image
                source={{ uri: company.logo_url }}
                style={styles.heroLogoImg}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.heroLogoText}>{company.name.charAt(0)}</Text>
            )}
          </View>

          <Text style={styles.heroName}>{company.name}</Text>

          {company.category ? (
            <View style={styles.heroCategoryPill}>
              <Text style={styles.heroCategoryText}>{company.category.name}</Text>
            </View>
          ) : null}

          <Text style={styles.heroDesc}>
            {company.description ||
              "Bu profil, en dogru temas kanalina hizla gecmeniz icin hazirlandi."}
          </Text>

          <View style={styles.signalRow}>
            {trustSignals.map((signal) => (
              <View key={signal} style={styles.signalPill}>
                <Text style={styles.signalText}>{signal}</Text>
              </View>
            ))}
          </View>
        </View>

        {fastestChannel ? (
          <View style={styles.section}>
            <SectionHeader
              title="Onerilen sonraki adim"
              subtitle="En hizli iletisim yolu burada one cikiyor"
              icon="flash"
            />
            <ContactChannelItem channel={fastestChannel} prominent />
          </View>
        ) : null}

        {otherChannels.length > 0 ? (
          <View style={styles.section}>
            <SectionHeader
              title="Alternatif temas kanallari"
              subtitle="Durumunuza gore farkli bir yol secin"
            />
            <View style={styles.sectionBody}>
              {otherChannels.map((channel) => (
                <ContactChannelItem key={channel.id} channel={channel} />
              ))}
            </View>
          </View>
        ) : null}

        {company.has_cargo_tracking && company.cargo_tracking_url ? (
          <View style={styles.section}>
            <SectionHeader
              title="Kargo takibi"
              subtitle="Resmi takip baglantisina dogrudan gecis"
            />
            <CargoTracker
              companyName={company.name}
              trackingUrl={company.cargo_tracking_url}
            />
          </View>
        ) : null}

        <View style={styles.section}>
          <SectionHeader
            title="Guven ve kaynak"
            subtitle="Bilginin nereden geldigi gorunur olsun"
          />
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons
                name="shield-checkmark-outline"
                size={16}
                color={Colors.textSecondary}
              />
              <Text style={styles.infoText}>
                Kanallar resmi kaynak baglantilariyla derlenir ve gozden gecirilir.
              </Text>
            </View>
            {updatedAt ? (
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
                <Text style={styles.infoText}>{updatedAt}</Text>
              </View>
            ) : null}
            {company.website_url ? (
              <TouchableOpacity
                style={styles.inlineAction}
                activeOpacity={0.75}
                onPress={() => Linking.openURL(company.website_url!)}
              >
                <Text style={styles.inlineActionText}>Resmi siteyi ac</Text>
                <Ionicons name="open-outline" size={16} color={Colors.accent} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerActions: {
    flexDirection: "row",
    gap: 10,
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  hero: {
    alignItems: "center",
    paddingTop: 6,
    paddingBottom: 26,
    paddingHorizontal: Spacing.screenPadding,
  },
  heroLogoWrap: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.xxl,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.medium,
  },
  heroLogoImg: {
    width: 96,
    height: 96,
  },
  heroLogoText: {
    ...Typography.display,
    color: Colors.text,
  },
  heroName: {
    ...Typography.display,
    marginTop: 16,
    textAlign: "center",
  },
  heroCategoryPill: {
    marginTop: 10,
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.capsule,
  },
  heroCategoryText: {
    ...Typography.meta,
    color: Colors.text,
  },
  heroDesc: {
    ...Typography.body,
    textAlign: "center",
    marginTop: 14,
    maxWidth: "92%",
  },
  signalRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginTop: 18,
  },
  signalPill: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.capsule,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  signalText: {
    ...Typography.micro,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: 26,
  },
  sectionBody: {
    paddingHorizontal: Spacing.screenPadding,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    marginHorizontal: Spacing.screenPadding,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  infoText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginLeft: 10,
    flex: 1,
  },
  inlineAction: {
    marginTop: 6,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderLight,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inlineActionText: {
    ...Typography.bodyStrong,
    color: Colors.accent,
  },
});
