import React from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCompaniesByCategory } from "@/hooks/useCompany";
import CompanyCard from "@/components/CompanyCard";

export default function CategoryScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const router = useRouter();
  const { data: companies, isLoading } = useCompaniesByCategory(id || "");
  const categoryName = name ? decodeURIComponent(name) : "Kategori";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F0" }} edges={["top"]}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ padding: 4 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={{ fontSize: 17, fontWeight: "600", color: "#1A1A1A", marginLeft: 12 }}>
          {categoryName}
        </Text>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#1A1A1A" />
        </View>
      ) : companies && companies.length > 0 ? (
        <FlatList
          data={companies}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CompanyCard company={item} />}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={{ fontSize: 12, color: "#8E8E93", marginLeft: 20, marginBottom: 8 }}>
              {companies.length} firma
            </Text>
          }
        />
      ) : (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="business-outline" size={48} color="#AEAEB2" />
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#AEAEB2", marginTop: 12 }}>
            Bu kategoride firma yok
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
