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

export default function HomeScreen() {
  const router = useRouter();
  const { data: categories, isLoading: catLoading, refetch: refetchCats } = useCategories();
  const { data: popular, isLoading: popLoading, refetch: refetchPop } = usePopularCompanies();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchCats(), refetchPop()]);
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F0" }} edges={["top"]}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1A1A1A" />
        }
      >
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 }}>
          <Text style={{ fontSize: 28, fontWeight: "800", color: "#1A1A1A", letterSpacing: -0.5 }}>
            ÇabukUlaş
          </Text>
          <Text style={{ fontSize: 14, color: "#8E8E93", marginTop: 2 }}>
            Firmalara hızlıca ulaş
          </Text>
        </View>

        {/* Search */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
            borderRadius: 14,
            paddingHorizontal: 16,
            paddingVertical: 14,
            marginHorizontal: 16,
            marginTop: 16,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: "#E8E8E3",
          }}
          activeOpacity={0.6}
          onPress={() => router.push("/search")}
        >
          <Ionicons name="search" size={20} color="#AEAEB2" />
          <Text style={{ flex: 1, marginLeft: 12, fontSize: 15, color: "#AEAEB2" }}>
            Firma ara...
          </Text>
        </TouchableOpacity>

        {/* Categories */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#1A1A1A", marginLeft: 20, marginBottom: 12 }}>
            Kategoriler
          </Text>
          {catLoading ? (
            <ActivityIndicator size="small" color="#1A1A1A" style={{ paddingVertical: 32 }} />
          ) : categories && categories.length > 0 ? (
            <CategoryGrid categories={categories} />
          ) : (
            <Text style={{ textAlign: "center", color: "#AEAEB2", paddingVertical: 32 }}>
              Kategori bulunamadı
            </Text>
          )}
        </View>

        {/* Popular Companies */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#1A1A1A", marginLeft: 20, marginBottom: 12 }}>
            Popüler Firmalar
          </Text>
          {popLoading ? (
            <ActivityIndicator size="small" color="#1A1A1A" style={{ paddingVertical: 32 }} />
          ) : popular && popular.length > 0 ? (
            popular.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))
          ) : (
            <View style={{ alignItems: "center", paddingVertical: 32 }}>
              <Ionicons name="business-outline" size={40} color="#AEAEB2" />
              <Text style={{ color: "#AEAEB2", marginTop: 8 }}>Henüz firma yok</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
