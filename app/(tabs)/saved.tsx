import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuickAccess } from "@/hooks/useQuickAccess";
import SectionHeader from "@/components/SectionHeader";
import CompanyCard from "@/components/CompanyCard";
import StateView from "@/components/StateView";
import { Colors, Spacing, Typography } from "@/constants/theme";

export default function SavedScreen() {
  const { favorites, recents, isLoading } = useQuickAccess();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Kaydedilenler</Text>
          <Text style={styles.title}>Tekrar baktiklarin ve sabitlediklerin.</Text>
          <Text style={styles.subtitle}>
            Siklikla dondugun firmalari burada hazir tut.
          </Text>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Favoriler"
            subtitle="Uzun sure saklamak istediklerin"
          />
          {favorites.length > 0 ? (
            favorites.map((company) => (
              <CompanyCard
                key={company.id}
                company={{
                  ...company,
                  category: company.category_name ? { id: "", name: company.category_name, icon: "", sort_order: 0 } : undefined,
                  category_id: "",
                  description: null,
                  website_url: null,
                  cargo_tracking_url: null,
                  created_at: company.last_viewed_at || new Date().toISOString(),
                  updated_at: company.last_viewed_at || new Date().toISOString(),
                  has_cargo_tracking: Boolean(company.has_cargo_tracking),
                  logo_url: company.logo_url,
                  contact_channels: [],
                  name: company.name,
                  slug: company.slug,
                  id: company.id,
                }}
                compact
              />
            ))
          ) : (
            <StateView
              icon="bookmark-outline"
              title="Henüz favori yok"
              subtitle="Firma detayinda yer isareti simgesiyle favori olusturabilirsiniz."
            />
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Son goruntulenenler"
            subtitle="Hizli geri donus icin tutulur"
          />
          {recents.length > 0 ? (
            recents.map((company) => (
              <CompanyCard
                key={company.id}
                company={{
                  ...company,
                  category: company.category_name ? { id: "", name: company.category_name, icon: "", sort_order: 0 } : undefined,
                  category_id: "",
                  description: null,
                  website_url: null,
                  cargo_tracking_url: null,
                  created_at: company.last_viewed_at || new Date().toISOString(),
                  updated_at: company.last_viewed_at || new Date().toISOString(),
                  has_cargo_tracking: Boolean(company.has_cargo_tracking),
                  logo_url: company.logo_url,
                  contact_channels: [],
                  name: company.name,
                  slug: company.slug,
                  id: company.id,
                }}
                compact
              />
            ))
          ) : isLoading ? null : (
            <StateView
              icon="time-outline"
              title="Henüz gecmis yok"
              subtitle="Ziyaret ettigin firma profilleri burada listelenecek."
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 12,
    paddingBottom: 12,
  },
  eyebrow: {
    ...Typography.micro,
    color: Colors.accent,
    textTransform: "uppercase",
  },
  title: {
    ...Typography.screenTitle,
    marginTop: 8,
    maxWidth: "88%",
  },
  subtitle: {
    ...Typography.body,
    marginTop: 8,
  },
  section: {
    marginTop: Spacing.md,
  },
});
