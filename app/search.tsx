import React from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "@/components/SearchBar";
import CompanyCard from "@/components/CompanyCard";
import { useSearch } from "@/hooks/useSearch";

export default function SearchScreen() {
  const router = useRouter();
  const { query, updateQuery, clearSearch, results, isSearching, isActive } = useSearch();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F0" }} edges={["top"]}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingTop: 8, paddingBottom: 12 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ padding: 8 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <SearchBar
            value={query}
            onChangeText={updateQuery}
            onClear={clearSearch}
            isSearching={isSearching}
            autoFocus
          />
        </View>
      </View>

      {/* Results */}
      {!isActive ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 }}>
          <Ionicons name="search" size={48} color="#E8E8E3" />
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#AEAEB2", marginTop: 16, textAlign: "center" }}>
            Firma adını yazın
          </Text>
          <Text style={{ fontSize: 13, color: "#AEAEB2", marginTop: 4, textAlign: "center" }}>
            En az 2 karakter girin
          </Text>
        </View>
      ) : isSearching ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#1A1A1A" />
        </View>
      ) : results.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 }}>
          <Ionicons name="search-outline" size={48} color="#E8E8E3" />
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#AEAEB2", marginTop: 16, textAlign: "center" }}>
            Sonuç bulunamadı
          </Text>
          <Text style={{ fontSize: 13, color: "#AEAEB2", marginTop: 4, textAlign: "center" }}>
            Farklı bir arama deneyin
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CompanyCard company={item} />}
          contentContainerStyle={{ paddingTop: 4, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={{ fontSize: 12, color: "#8E8E93", marginLeft: 20, marginBottom: 8 }}>
              {results.length} sonuç
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}
