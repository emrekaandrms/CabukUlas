import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Category } from "@/lib/types";
import { getCategoryIcon } from "@/lib/utils";

interface CategoryGridProps {
  categories: Category[];
}

function CategoryItem({ category }: { category: Category }) {
  const router = useRouter();
  const iconName = getCategoryIcon(category.icon);

  return (
    <TouchableOpacity
      style={{
        flex: 1,
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 4,
        marginHorizontal: 4,
        marginBottom: 8,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#F0F0EB",
      }}
      activeOpacity={0.6}
      onPress={() => router.push(`/category/${category.id}?name=${encodeURIComponent(category.name)}`)}
    >
      <View style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "#F5F5F0",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
      }}>
        <Ionicons name={iconName as any} size={22} color="#1A1A1A" />
      </View>
      <Text style={{ fontSize: 12, fontWeight: "600", color: "#48484A", textAlign: "center" }} numberOfLines={1}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const rows: Category[][] = [];
  for (let i = 0; i < categories.length; i += 4) {
    rows.push(categories.slice(i, i + 4));
  }

  return (
    <View style={{ paddingHorizontal: 12 }}>
      {rows.map((row, idx) => (
        <View key={idx} style={{ flexDirection: "row" }}>
          {row.map((cat) => (
            <CategoryItem key={cat.id} category={cat} />
          ))}
          {row.length < 4 &&
            Array(4 - row.length)
              .fill(null)
              .map((_, i) => <View key={`empty-${i}`} style={{ flex: 1, marginHorizontal: 4 }} />)}
        </View>
      ))}
    </View>
  );
}
