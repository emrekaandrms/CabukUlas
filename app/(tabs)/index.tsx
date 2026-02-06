import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCategories } from "@/hooks/useCategories";
import { usePopularCompanies } from "@/hooks/useCompany";
import CategoryGrid from "@/components/CategoryGrid";
import CompanyCard from "@/components/CompanyCard";
import { Colors } from "@/constants/theme";

export default function HomeScreen() {
  const router = useRouter();
  const { data: categories, isLoading: catLoading, refetch: refetchCats } = useCategories();
  const { data: popular, isLoading: popLoading, refetch: refetchPop } = usePopularCompanies();

  const isLoading = catLoading || popLoading;
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchCats(), refetchPop()]);
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900" edges={["top"]}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* Header */}
        <View className="px-5 pt-4 pb-2">
          <Text className="text-2xl font-bold text-slate-900 dark:text-white">
            ÇabukUlaş
          </Text>
          <Text className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Firmalara en hızlı yoldan ulaş
          </Text>
        </View>

        {/* Arama alani */}
        <TouchableOpacity
          className="flex-row items-center bg-white dark:bg-slate-800 rounded-2xl px-4 py-4 mx-4 mt-3 mb-5 shadow-sm border border-slate-100 dark:border-slate-700"
          activeOpacity={0.7}
          onPress={() => router.push("/search")}
        >
          <Ionicons name="search-outline" size={22} color={Colors.textSecondary} />
          <Text className="flex-1 ml-3 text-base text-slate-400">
            Firma ara...
          </Text>
        </TouchableOpacity>

        {/* Kategoriler */}
        <View className="mb-4">
          <View className="flex-row justify-between items-center px-5 mb-3">
            <Text className="text-lg font-bold text-slate-900 dark:text-white">
              Kategoriler
            </Text>
          </View>
          {catLoading ? (
            <ActivityIndicator size="small" color={Colors.primary} className="py-8" />
          ) : categories && categories.length > 0 ? (
            <CategoryGrid categories={categories} />
          ) : (
            <Text className="text-center text-slate-400 py-8">
              Kategori bulunamadı
            </Text>
          )}
        </View>

        {/* Populer Firmalar */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center px-5 mb-3">
            <Text className="text-lg font-bold text-slate-900 dark:text-white">
              Popüler Firmalar
            </Text>
          </View>
          {popLoading ? (
            <ActivityIndicator size="small" color={Colors.primary} className="py-8" />
          ) : popular && popular.length > 0 ? (
            popular.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))
          ) : (
            <View className="items-center py-8 mx-4">
              <Ionicons name="business-outline" size={48} color={Colors.textSecondary} />
              <Text className="text-slate-400 mt-3 text-center">
                Henüz firma eklenmemiş.{"\n"}Seed data'yı yükleyin.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
