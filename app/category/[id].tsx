import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCompaniesByCategory } from "@/hooks/useCompany";
import CompanyCard from "@/components/CompanyCard";
import { Colors } from "@/constants/theme";

export default function CategoryScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const router = useRouter();
  const { data: companies, isLoading } = useCompaniesByCategory(id || "");

  const categoryName = name ? decodeURIComponent(name) : "Kategori";

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-1"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-slate-900 dark:text-white ml-3">
          {categoryName}
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : companies && companies.length > 0 ? (
        <FlatList
          data={companies}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CompanyCard company={item} />}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text className="text-xs text-slate-400 px-5 mb-2">
              {companies.length} firma
            </Text>
          }
        />
      ) : (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="business-outline" size={64} color={Colors.border} />
          <Text className="text-lg font-semibold text-slate-400 mt-4 text-center">
            Bu kategoride firma yok
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
