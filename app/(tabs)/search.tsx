import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "@/components/SearchBar";
import CompanyCard from "@/components/CompanyCard";
import SkeletonLoader from "@/components/SkeletonLoader";
import SectionHeader from "@/components/SectionHeader";
import StateView from "@/components/StateView";
import { useSearch } from "@/hooks/useSearch";
import { usePopularCompanies } from "@/hooks/useCompany";
import { useQuickAccess, useSearchHistory } from "@/hooks/useQuickAccess";
import {
  BorderRadius,
  Colors,
  Spacing,
  Typography,
} from "@/constants/theme";
import { useRouter } from "expo-router";

export default function SearchScreen() {
  const router = useRouter();
  const { recents } = useQuickAccess();
  const { history, saveSearch, clearHistory } = useSearchHistory();
  const { data: popular } = usePopularCompanies();
  const { query, updateQuery, clearSearch, results, isSearching, isActive, error } =
    useSearch();

  useEffect(() => {
    if (!isSearching && query.trim().length >= 2 && results.length > 0) {
      saveSearch(query.trim());
    }
  }, [isSearching, query, results, saveSearch]);

  const renderDiscovery = () => (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.discoveryContent}
    >
      <View style={styles.hero}>
        <Text style={styles.heroEyebrow}>Arama</Text>
        <Text style={styles.heroTitle}>Hizli eslesme, guvenli sonraki adim.</Text>
        <Text style={styles.heroSubtitle}>
          Sirket, marka veya hizmet arayip en uygun temas yolunu bulun.
        </Text>
      </View>

      {history.length > 0 && (
        <View style={styles.section}>
          <SectionHeader
            title="Son aramalar"
            subtitle="Tek dokunusla tekrar dene"
            actionLabel="Temizle"
            onPressAction={clearHistory}
          />
          <View style={styles.inlineGrid}>
            {history.map((item) => (
              <TouchableOpacity
                key={item.query}
                style={styles.inlineChip}
                activeOpacity={0.75}
                onPress={() => updateQuery(item.query)}
              >
                <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
                <Text style={styles.inlineChipText}>{item.query}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {recents.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Son baktiklarin" subtitle="Sik kullandigin firmalar" />
          <View style={styles.cardStack}>
            {recents.slice(0, 3).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.recentRow}
                activeOpacity={0.8}
                onPress={() => router.push(`/company/${item.slug}`)}
              >
                <View style={styles.recentText}>
                  <Text style={styles.recentName}>{item.name}</Text>
                  <Text style={styles.recentMeta}>
                    {item.category_name || "Kurumsal hizmet"}
                  </Text>
                </View>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <SectionHeader title="Populer kisayollar" subtitle="Hizli baslamak icin" />
        <View style={styles.inlineGrid}>
          {(popular || []).slice(0, 6).map((company) => (
            <TouchableOpacity
              key={company.id}
              style={styles.inlineChip}
              activeOpacity={0.75}
              onPress={() => updateQuery(company.name)}
            >
              <Ionicons name="sparkles-outline" size={14} color={Colors.accent} />
              <Text style={styles.inlineChipText}>{company.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <SearchBar
          value={query}
          onChangeText={updateQuery}
          onClear={clearSearch}
          isSearching={isSearching}
        />
      </View>

      {!isActive ? (
        renderDiscovery()
      ) : isSearching ? (
        <View style={{ paddingTop: 18 }}>
          <SkeletonLoader type="cards" count={4} />
        </View>
      ) : error ? (
        <StateView
          icon="cloud-offline-outline"
          title="Arama su anda tamamlanamadi"
          subtitle="Baglantiyi kontrol edip tekrar deneyebilirsiniz."
          actionLabel="Aramayi temizle"
          onPressAction={clearSearch}
        />
      ) : results.length === 0 ? (
        <StateView
          icon="search-outline"
          title="Sonuc bulunamadi"
          subtitle="Farkli bir firma adi, kategori veya daha kisa bir ifade deneyin."
          actionLabel="Aramayi temizle"
          onPressAction={clearSearch}
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CompanyCard company={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.resultInfo}>
              <Text style={styles.resultCount}>{results.length} sonuc bulundu</Text>
              <Text style={styles.resultSubtitle}>
                Onerilen temas ve resmi erisim sinyalleriyle birlikte listelendi.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 8,
    paddingBottom: 12,
  },
  discoveryContent: {
    paddingBottom: 120,
  },
  hero: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 8,
    paddingBottom: 12,
  },
  heroEyebrow: {
    ...Typography.micro,
    color: Colors.accent,
    textTransform: "uppercase",
  },
  heroTitle: {
    ...Typography.screenTitle,
    marginTop: 8,
    maxWidth: "90%",
  },
  heroSubtitle: {
    ...Typography.body,
    marginTop: 8,
    maxWidth: "88%",
  },
  section: {
    marginTop: Spacing.lg,
  },
  inlineGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: Spacing.screenPadding,
  },
  inlineChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inlineChipText: {
    ...Typography.meta,
    color: Colors.text,
    marginLeft: 6,
  },
  cardStack: {
    paddingHorizontal: Spacing.screenPadding,
    gap: 10,
  },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  recentText: {
    flex: 1,
    marginRight: 12,
  },
  recentName: {
    ...Typography.bodyStrong,
  },
  recentMeta: {
    ...Typography.meta,
    marginTop: 2,
  },
  listContent: {
    paddingTop: 4,
    paddingBottom: 120,
  },
  resultInfo: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: 14,
  },
  resultCount: {
    ...Typography.bodyStrong,
  },
  resultSubtitle: {
    ...Typography.meta,
    marginTop: 4,
  },
});
