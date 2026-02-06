import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCategories } from "@/hooks/useCategories";
import { getCategoryIcon } from "@/lib/utils";
import { Colors } from "@/constants/theme";

const categoryColors: Record<string, string> = {
  "e-ticaret": "#ea580c",
  kargo: "#d97706",
  banka: "#2563eb",
  telekom: "#7c3aed",
  dijital: "#0891b2",
  sigorta: "#16a34a",
  enerji: "#ca8a04",
  ulasim: "#e11d48",
};

export default function CategoriesScreen() {
  const router = useRouter();
  const { data: categories, isLoading } = useCategories();

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900" edges={["top"]}>
      {/* Header */}
      <View className="px-5 pt-4 pb-4">
        <Text className="text-2xl font-bold text-slate-900 dark:text-white">
          Kategoriler
        </Text>
        <Text className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Sektöre göre firmaları keşfet
        </Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.primary} className="mt-12" />
      ) : (
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {categories?.map((category) => {
            const iconName = getCategoryIcon(category.icon);
            const color = categoryColors[category.icon] || Colors.primary;

            return (
              <TouchableOpacity
                key={category.id}
                className="flex-row items-center bg-white dark:bg-slate-800 rounded-2xl p-4 mb-3 border border-slate-100 dark:border-slate-700"
                activeOpacity={0.7}
                onPress={() =>
                  router.push(
                    `/category/${category.id}?name=${encodeURIComponent(category.name)}`
                  )
                }
              >
                <View
                  className="w-14 h-14 rounded-xl items-center justify-center"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Ionicons name={iconName as any} size={28} color={color} />
                </View>
                <View className="flex-1 ml-4">
                  <Text className="text-base font-semibold text-slate-900 dark:text-white">
                    {category.name}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            );
          })}
          <View className="h-6" />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
