import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Category } from "@/lib/types";
import { getCategoryIcon } from "@/lib/utils";
import { Colors } from "@/constants/theme";

interface CategoryGridProps {
  categories: Category[];
}

const categoryColors: Record<string, { bg: string; icon: string }> = {
  "e-ticaret": { bg: "bg-orange-50 dark:bg-orange-900/20", icon: "#ea580c" },
  kargo: { bg: "bg-amber-50 dark:bg-amber-900/20", icon: "#d97706" },
  banka: { bg: "bg-blue-50 dark:bg-blue-900/20", icon: "#2563eb" },
  telekom: { bg: "bg-purple-50 dark:bg-purple-900/20", icon: "#7c3aed" },
  dijital: { bg: "bg-cyan-50 dark:bg-cyan-900/20", icon: "#0891b2" },
  sigorta: { bg: "bg-green-50 dark:bg-green-900/20", icon: "#16a34a" },
  enerji: { bg: "bg-yellow-50 dark:bg-yellow-900/20", icon: "#ca8a04" },
  ulasim: { bg: "bg-rose-50 dark:bg-rose-900/20", icon: "#e11d48" },
};

function CategoryItem({ category }: { category: Category }) {
  const router = useRouter();
  const iconName = getCategoryIcon(category.icon);
  const colorScheme = categoryColors[category.icon] || { bg: "bg-slate-50 dark:bg-slate-800", icon: Colors.primary };

  return (
    <TouchableOpacity
      className={`flex-1 items-center py-4 px-2 rounded-2xl mx-1.5 mb-3 ${colorScheme.bg}`}
      activeOpacity={0.7}
      onPress={() => router.push(`/category/${category.id}?name=${encodeURIComponent(category.name)}`)}
    >
      <View className="w-12 h-12 rounded-xl items-center justify-center bg-white/70 dark:bg-white/10 mb-2">
        <Ionicons
          name={iconName as any}
          size={24}
          color={colorScheme.icon}
        />
      </View>
      <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-center" numberOfLines={1}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  // 2 veya 3 sutunlu grid
  const rows: Category[][] = [];
  for (let i = 0; i < categories.length; i += 3) {
    rows.push(categories.slice(i, i + 3));
  }

  return (
    <View className="px-2.5">
      {rows.map((row, idx) => (
        <View key={idx} className="flex-row">
          {row.map((cat) => (
            <CategoryItem key={cat.id} category={cat} />
          ))}
          {/* Bos alanlar icin placeholder */}
          {row.length < 3 &&
            Array(3 - row.length)
              .fill(null)
              .map((_, i) => <View key={`empty-${i}`} className="flex-1 mx-1.5" />)}
        </View>
      ))}
    </View>
  );
}
