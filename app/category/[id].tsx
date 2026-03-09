import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCompaniesByCategory } from "@/hooks/useCompany";
import CompanyCard from "@/components/CompanyCard";
import SkeletonLoader from "@/components/SkeletonLoader";
import StateView from "@/components/StateView";
import { isCurrentlyOpen } from "@/lib/utils";
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/theme";

const FILTERS = [
  { key: "recommended", label: "Onerilen" },
  { key: "open", label: "Simdi acik" },
  { key: "az", label: "A-Z" },
] as const;

export default function CategoryScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const router = useRouter();
  const { data: companies, isLoading } = useCompaniesByCategory(id || "");
  const categoryName = name ? decodeURIComponent(name) : "Kategori";
  const [filter, setFilter] =
    React.useState<(typeof FILTERS)[number]["key"]>("recommended");

  const sortedCompanies = React.useMemo(() => {
    const list = [...(companies || [])];

    if (filter === "open") {
      return list.sort((a, b) => {
        const aOpen = a.contact_channels?.some((channel) =>
          isCurrentlyOpen(channel.working_hours) === true
        )
          ? 1
          : 0;
        const bOpen = b.contact_channels?.some((channel) =>
          isCurrentlyOpen(channel.working_hours) === true
        )
          ? 1
          : 0;
        return bOpen - aOpen || a.name.localeCompare(b.name, "tr");
      });
    }

    if (filter === "az") {
      return list.sort((a, b) => a.name.localeCompare(b.name, "tr"));
    }

    return list.sort((a, b) => {
      const aRecommended = a.contact_channels?.some((channel) => channel.is_fastest)
        ? 1
        : 0;
      const bRecommended = b.contact_channels?.some((channel) => channel.is_fastest)
        ? 1
        : 0;
      return bRecommended - aRecommended || a.name.localeCompare(b.name, "tr");
    });
  }, [companies, filter]);

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
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>{categoryName}</Text>
          <Text style={styles.headerSubtitle}>
            Firmalari en hizli temas sinyaline gore tara
          </Text>
        </View>
      </View>

      {isLoading ? (
        <View style={{ paddingTop: 8 }}>
          <SkeletonLoader type="cards" count={5} />
        </View>
      ) : companies && companies.length > 0 ? (
        <FlatList
          data={sortedCompanies}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CompanyCard company={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <View style={styles.resultInfo}>
                <Text style={styles.resultCount}>
                  {companies.length} firma bulundu
                </Text>
                <Text style={styles.resultSubtitle}>
                  Onerilen kanal, aciklik durumu ve alfabetik siralama ile filtrelenebilir.
                </Text>
              </View>
              <View style={styles.filterRow}>
                {FILTERS.map((item) => {
                  const active = filter === item.key;
                  return (
                    <TouchableOpacity
                      key={item.key}
                      style={[styles.filterChip, active && styles.filterChipActive]}
                      activeOpacity={0.75}
                      onPress={() => setFilter(item.key)}
                    >
                      <Text
                        style={[
                          styles.filterText,
                          active && styles.filterTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          }
        />
      ) : (
        <StateView
          icon="business-outline"
          title="Bu kategoride firma yok"
          subtitle="Yakinda yeni firmalar eklendiginde burada gorunecek."
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
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.small,
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
    marginTop: 2,
  },
  headerTitle: {
    ...Typography.sectionTitle,
  },
  headerSubtitle: {
    ...Typography.meta,
    marginTop: 4,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 120,
  },
  resultInfo: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: 12,
  },
  resultCount: {
    ...Typography.bodyStrong,
  },
  resultSubtitle: {
    ...Typography.meta,
    marginTop: 4,
  },
  filterRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: 16,
  },
  filterChip: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.capsule,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    ...Typography.meta,
    color: Colors.text,
  },
  filterTextActive: {
    color: Colors.textInverse,
  },
});
