import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "@/components/SearchBar";
import CompanyCard from "@/components/CompanyCard";
import { useSearch } from "@/hooks/useSearch";
import { Colors } from "@/constants/theme";

export default function SearchScreen() {
  const router = useRouter();
  const { query, updateQuery, clearSearch, results, isSearching, isActive } = useSearch();

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-2 pt-3 pb-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View className="flex-1">
          <SearchBar
            value={query}
            onChangeText={updateQuery}
            onClear={clearSearch}
            isSearching={isSearching}
            autoFocus
          />
        </View>
      </View>

      {/* Sonuclar */}
      {!isActive ? (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="search" size={64} color={Colors.border} />
          <Text className="text-lg font-semibold text-slate-400 mt-4 text-center">
            Firma adını yazın
          </Text>
          <Text className="text-sm text-slate-400 mt-1 text-center">
            En az 2 karakter girin
          </Text>
        </View>
      ) : isSearching ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text className="text-slate-400 mt-3">Aranıyor...</Text>
        </View>
      ) : results.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="alert-circle-outline" size={64} color={Colors.border} />
          <Text className="text-lg font-semibold text-slate-400 mt-4 text-center">
            Sonuç bulunamadı
          </Text>
          <Text className="text-sm text-slate-400 mt-1 text-center">
            "{query}" ile eşleşen firma yok.{"\n"}Farklı bir arama deneyin.
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CompanyCard company={item} />}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text className="text-xs text-slate-400 px-5 mb-2">
              {results.length} sonuç bulundu
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}
