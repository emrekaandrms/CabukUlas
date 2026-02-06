import React from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCategories } from "@/hooks/useCategories";
import { getCategoryIcon } from "@/lib/utils";

export default function CategoriesScreen() {
  const router = useRouter();
  const { data: categories, isLoading } = useCategories();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F0" }} edges={["top"]}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 }}>
        <Text style={{ fontSize: 28, fontWeight: "800", color: "#1A1A1A", letterSpacing: -0.5 }}>
          Kategoriler
        </Text>
        <Text style={{ fontSize: 14, color: "#8E8E93", marginTop: 2 }}>
          Sektöre göre firmalar
        </Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#1A1A1A" style={{ marginTop: 48 }} />
      ) : (
        <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
          {categories?.map((category) => {
            const iconName = getCategoryIcon(category.icon);

            return (
              <TouchableOpacity
                key={category.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#FFFFFF",
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: "#F0F0EB",
                }}
                activeOpacity={0.6}
                onPress={() =>
                  router.push(`/category/${category.id}?name=${encodeURIComponent(category.name)}`)
                }
              >
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: "#F5F5F0",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <Ionicons name={iconName as any} size={24} color="#1A1A1A" />
                </View>
                <Text style={{ flex: 1, fontSize: 16, fontWeight: "600", color: "#1A1A1A", marginLeft: 14 }}>
                  {category.name}
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#AEAEB2" />
              </TouchableOpacity>
            );
          })}
          <View style={{ height: 24 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
