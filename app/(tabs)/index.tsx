import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCategories } from "@/hooks/useCategories";
import { usePopularCompanies } from "@/hooks/useCompany";
import { useQuickAccess } from "@/hooks/useQuickAccess";
import CategoryGrid from "@/components/CategoryGrid";
import CompanyCard from "@/components/CompanyCard";
import SkeletonLoader from "@/components/SkeletonLoader";
import SectionHeader from "@/components/SectionHeader";
import StateView from "@/components/StateView";
import { getCompanyTrustSignals } from "@/lib/utils";
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/theme";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "Gec saatler icin hizli erisim";
  if (hour < 12) return "Gun icin hazir bir rehber";
  if (hour < 18) return "Dogru kanala hizla ulasin";
  return "Aksam icin sakin bir hizli erisim";
}

export default function HomeScreen() {
  const router = useRouter();
  const { favorites, recents } = useQuickAccess();
  const {
    data: categories,
    isLoading: catLoading,
    refetch: refetchCats,
  } = useCategories();
  const {
    data: popular,
    isLoading: popLoading,
    refetch: refetchPop,
  } = usePopularCompanies();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchCats(), refetchPop()]);
    setRefreshing(false);
  };

  const featuredCompany = popular?.[0];
  const otherCompanies = popular?.slice(1) || [];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accent}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>CabukUlas</Text>
          <Text style={styles.brandName}>Dogru firmaya, dogru kanalla ulas.</Text>
          <Text style={styles.subtitle}>{getGreeting()}</Text>
        </View>

        <TouchableOpacity
          style={styles.searchBar}
          activeOpacity={0.8}
          onPress={() => router.push("/search")}
        >
          <View style={styles.searchIconWrap}>
            <Ionicons name="search" size={18} color={Colors.textSecondary} />
          </View>
          <View style={styles.searchCopy}>
            <Text style={styles.searchTitle}>Firma veya hizmet ara</Text>
            <Text style={styles.searchSubtitle}>
              Hemen en uygun temas kanalini bul
            </Text>
          </View>
          <View style={styles.searchHint}>
            <Ionicons name="arrow-forward" size={16} color={Colors.accent} />
          </View>
        </TouchableOpacity>

        {recents.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title="Son baktiklarin"
              subtitle="Tekrar erisim icin hazir"
              actionLabel="Kaydedilenler"
              onPressAction={() => router.push("/saved")}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.railContent}
            >
              {recents.slice(0, 8).map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.quickCard}
                  activeOpacity={0.8}
                  onPress={() => router.push(`/company/${item.slug}`)}
                >
                  <View style={styles.quickLogo}>
                    {item.logo_url ? (
                      <Image
                        source={{ uri: item.logo_url }}
                        style={styles.quickLogoImage}
                        resizeMode="contain"
                      />
                    ) : (
                      <Text style={styles.quickLogoInitial}>
                        {item.name.charAt(0)}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.quickName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.quickMeta} numberOfLines={1}>
                    {item.category_name || "Kurumsal hizmet"}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <SectionHeader
            title="Kategoriler"
            subtitle="Isme emin degilsen sektorden ilerle"
            actionLabel="Tumunu ac"
            onPressAction={() => router.push("/categories")}
          />
          {catLoading ? (
            <SkeletonLoader type="chips" />
          ) : categories && categories.length > 0 ? (
            <CategoryGrid categories={categories} />
          ) : (
            <StateView
              compact
              icon="grid-outline"
              title="Kategori hazir degil"
              subtitle="Kategori listesi yuklenirken bir sorun olustu."
            />
          )}
        </View>

        {!popLoading && featuredCompany && (
          <View style={styles.section}>
            <SectionHeader
              title="One cikan erisim"
              subtitle="Hizli karar icin editor secimi"
              icon="sparkles"
            />
            <TouchableOpacity
              style={styles.featuredCard}
              activeOpacity={0.85}
              onPress={() => router.push(`/company/${featuredCompany.slug}`)}
            >
              <View style={styles.featuredTopRow}>
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>One cikan</Text>
                </View>
                <View style={styles.featuredBadgeMuted}>
                  <Text style={styles.featuredBadgeMutedText}>Sponsorlu alan</Text>
                </View>
              </View>

              <View style={styles.featuredRow}>
                <View style={styles.featuredLogo}>
                  {featuredCompany.logo_url ? (
                    <Image
                      source={{ uri: featuredCompany.logo_url }}
                      style={{ width: 56, height: 56 }}
                      resizeMode="contain"
                    />
                  ) : (
                    <Text style={styles.featuredLogoText}>
                      {featuredCompany.name.charAt(0)}
                    </Text>
                  )}
                </View>
                <View style={styles.featuredInfo}>
                  <Text style={styles.featuredName}>{featuredCompany.name}</Text>
                  <Text style={styles.featuredCategory}>
                    {featuredCompany.category?.name || "Kurumsal hizmet"}
                  </Text>
                </View>
              </View>

              <View style={styles.featuredSignalRow}>
                {getCompanyTrustSignals(featuredCompany).map((signal) => (
                  <View key={signal} style={styles.featuredSignal}>
                    <Text style={styles.featuredSignalText}>{signal}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.featuredCTA}>
                <Text style={styles.featuredCTAText}>Firma kartini ve en hizli yolu ac</Text>
                <Ionicons name="arrow-forward" size={16} color={Colors.textInverse} />
              </View>
            </TouchableOpacity>
          </View>
        )}

        {favorites.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title="Kaydettiklerin"
              subtitle="Guvendigin firmalar tek yerde"
              actionLabel="Tumunu gor"
              onPressAction={() => router.push("/saved")}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.railContent}
            >
              {favorites.slice(0, 6).map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.favoriteTile}
                  activeOpacity={0.8}
                  onPress={() => router.push(`/company/${item.slug}`)}
                >
                  <Text style={styles.favoriteName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.favoriteMeta} numberOfLines={1}>
                    {item.category_name || "Kurumsal hizmet"}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <SectionHeader
            title="Populer firmalar"
            subtitle="Hizli ulasim icin en cok bakilanlar"
          />
          {popLoading ? (
            <SkeletonLoader type="cards" count={4} />
          ) : otherCompanies.length > 0 ? (
            otherCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))
          ) : (
            <StateView
              compact
              icon="business-outline"
              title="Henuz firma yok"
              subtitle="Icerik eklendiginde burada gorunecek."
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
    paddingBottom: 8,
  },
  eyebrow: {
    ...Typography.micro,
    color: Colors.accent,
    textTransform: "uppercase",
  },
  brandName: {
    ...Typography.display,
    marginTop: 8,
    maxWidth: "92%",
  },
  subtitle: {
    ...Typography.body,
    marginTop: 10,
    maxWidth: "80%",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginHorizontal: Spacing.screenPadding,
    marginTop: 18,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },
  searchIconWrap: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  searchCopy: {
    flex: 1,
    marginLeft: 12,
  },
  searchTitle: {
    ...Typography.bodyStrong,
  },
  searchSubtitle: {
    ...Typography.meta,
    marginTop: 2,
  },
  searchHint: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginBottom: Spacing.section,
  },
  railContent: {
    paddingHorizontal: Spacing.screenPadding,
    gap: 12,
  },
  quickCard: {
    width: 132,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  quickLogo: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  quickLogoImage: {
    width: 48,
    height: 48,
  },
  quickLogoInitial: {
    ...Typography.cardTitle,
  },
  quickName: {
    ...Typography.bodyStrong,
    marginTop: 12,
  },
  quickMeta: {
    ...Typography.meta,
    marginTop: 4,
  },
  featuredCard: {
    marginHorizontal: Spacing.screenPadding,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: 20,
    ...Shadows.large,
  },
  featuredTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  featuredBadge: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  featuredBadgeText: {
    ...Typography.micro,
    color: Colors.textInverse,
  },
  featuredBadgeMuted: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  featuredBadgeMutedText: {
    ...Typography.micro,
    color: "rgba(255,255,255,0.78)",
  },
  featuredRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  featuredLogo: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  featuredLogoText: {
    ...Typography.sectionTitle,
    color: Colors.textInverse,
  },
  featuredInfo: {
    flex: 1,
    marginLeft: 16,
  },
  featuredName: {
    ...Typography.sectionTitle,
    color: Colors.textInverse,
  },
  featuredCategory: {
    ...Typography.meta,
    color: "rgba(255,255,255,0.65)",
    marginTop: 4,
  },
  featuredSignalRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 18,
  },
  featuredSignal: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  featuredSignalText: {
    ...Typography.micro,
    color: "rgba(255,255,255,0.82)",
  },
  featuredCTA: {
    marginTop: 20,
    paddingTop: 18,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.16)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  featuredCTAText: {
    ...Typography.bodyStrong,
    color: Colors.textInverse,
  },
  favoriteTile: {
    width: 150,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  favoriteName: {
    ...Typography.bodyStrong,
  },
  favoriteMeta: {
    ...Typography.meta,
    marginTop: 6,
  },
});
