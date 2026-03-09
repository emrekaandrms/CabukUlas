import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCategories } from "@/hooks/useCategories";
import { getCategoryIcon } from "@/lib/utils";
import SkeletonLoader from "@/components/SkeletonLoader";
import StateView from "@/components/StateView";
import SectionHeader from "@/components/SectionHeader";
import { trackAnalyticsEvent } from "@/lib/analytics";
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/theme";

export default function CategoriesScreen() {
  const router = useRouter();
  const { data: categories, isLoading } = useCategories();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Kategoriler</Text>
        <Text style={styles.title}>Şirket adını bilmesen de doğru yola çık.</Text>
        <Text style={styles.subtitle}>
          Sektöre göre keşfet, sonra en hızlı temas kanalına ilerle.
        </Text>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroIcon}>
          <Ionicons name="layers-outline" size={20} color={Colors.accent} />
        </View>
        <View style={styles.heroText}>
          <Text style={styles.heroTitle}>Trend kategoriler ve tüm sektörler</Text>
          <Text style={styles.heroSubtitle}>
            Her kategori seni ilgili firma listesine ve en iyi sonraki aksiyona taşır.
          </Text>
        </View>
      </View>

      {isLoading ? (
        <View style={{ paddingTop: 16 }}>
          <SkeletonLoader type="cards" count={6} />
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          <SectionHeader
            title="Tüm kategoriler"
            subtitle={`${categories?.length || 0} sektör hazır`}
          />
          {categories?.map((category, index) => {
            const iconName = getCategoryIcon(category.icon);

            return (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                activeOpacity={0.7}
                onPress={() => {
                  void trackAnalyticsEvent({
                    event_name: "category_opened",
                    source_screen: "/categories",
                    category_id: category.id,
                    metadata: { category_name: category.name },
                  });
                  router.push(
                    `/category/${category.id}?name=${encodeURIComponent(category.name)}`
                  );
                }}
              >
                <View style={styles.categoryIconContainer}>
                  <Ionicons
                    name={iconName as any}
                    size={22}
                    color={Colors.accent}
                  />
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryMeta}>Firmaları ve temas yöntemlerini gör</Text>
                </View>
                <View style={styles.categoryArrow}>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={Colors.textTertiary}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
          {categories?.length === 0 ? (
            <StateView
              compact
              icon="grid-outline"
              title="Kategori bulunamadı"
              subtitle="İçerik yenilenirken kısa bir süre beklemeniz gerekebilir."
            />
          ) : null}
          <View style={{ height: 24 }} />
        </ScrollView>
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
    paddingTop: 16,
    paddingBottom: 16,
  },
  eyebrow: {
    ...Typography.micro,
    color: Colors.accent,
    textTransform: "uppercase",
  },
  title: {
    ...Typography.screenTitle,
    marginTop: 8,
  },
  subtitle: {
    ...Typography.body,
    marginTop: 8,
  },
  heroCard: {
    flexDirection: "row",
    marginHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    ...Typography.bodyStrong,
  },
  heroSubtitle: {
    ...Typography.meta,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: 24,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryInfo: {
    flex: 1,
    marginLeft: 16,
  },
  categoryName: {
    ...Typography.bodyStrong,
  },
  categoryMeta: {
    ...Typography.meta,
    marginTop: 4,
  },
  categoryArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
});
