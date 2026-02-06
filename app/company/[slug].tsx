import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCompany } from "@/hooks/useCompany";
import ContactChannelItem from "@/components/ContactChannelItem";
import CargoTracker from "@/components/CargoTracker";
import FastestBadge from "@/components/FastestBadge";
import { Colors } from "@/constants/theme";

export default function CompanyDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { data: company, isLoading, error } = useCompany(slug || "");

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900 items-center justify-center">
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text className="text-slate-400 mt-3">Yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  if (error || !company) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900 items-center justify-center px-8">
        <Ionicons name="alert-circle-outline" size={64} color={Colors.danger} />
        <Text className="text-lg font-semibold text-slate-700 dark:text-slate-300 mt-4 text-center">
          Firma bulunamadı
        </Text>
        <TouchableOpacity
          className="mt-4 bg-primary-500 px-6 py-3 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Geri Dön</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const channels = company.contact_channels || [];
  const fastestChannel = channels.find((c) => c.is_fastest);
  const otherChannels = channels.filter((c) => !c.is_fastest);

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-1"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text
          className="flex-1 text-lg font-semibold text-slate-900 dark:text-white ml-3"
          numberOfLines={1}
        >
          {company.name}
        </Text>
        {company.website_url && (
          <TouchableOpacity
            onPress={() => Linking.openURL(company.website_url!)}
            className="p-1"
          >
            <Ionicons name="globe-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Firma bilgi karti */}
        <View className="items-center pt-4 pb-6 px-4">
          <View className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            {company.logo_url ? (
              <Image
                source={{ uri: company.logo_url }}
                className="w-20 h-20"
                resizeMode="contain"
              />
            ) : (
              <Text className="text-3xl font-bold text-primary-500">
                {company.name.charAt(0)}
              </Text>
            )}
          </View>
          <Text className="text-xl font-bold text-slate-900 dark:text-white mt-3">
            {company.name}
          </Text>
          {company.category && (
            <Text className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {company.category.name}
            </Text>
          )}
          {company.description && (
            <Text className="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center px-4">
              {company.description}
            </Text>
          )}
        </View>

        {/* En Hizli Yol - Vurgulu */}
        {fastestChannel && (
          <View className="px-4 mb-2">
            <View className="flex-row items-center mb-3">
              <Ionicons name="flash" size={18} color="#0d9488" />
              <Text className="text-base font-bold text-teal-700 dark:text-teal-400 ml-1.5">
                En Hızlı Yol
              </Text>
            </View>
            <ContactChannelItem channel={fastestChannel} />
          </View>
        )}

        {/* Diger Kanallar */}
        {otherChannels.length > 0 && (
          <View className="px-4 mt-2">
            <Text className="text-base font-bold text-slate-900 dark:text-white mb-3">
              Diğer İletişim Kanalları
            </Text>
            {otherChannels.map((channel) => (
              <ContactChannelItem key={channel.id} channel={channel} />
            ))}
          </View>
        )}

        {/* Kargo Takip */}
        {company.has_cargo_tracking && company.cargo_tracking_url && (
          <CargoTracker
            companyName={company.name}
            trackingUrl={company.cargo_tracking_url}
          />
        )}

        {/* Bilgi kaynagi */}
        {company.website_url && (
          <TouchableOpacity
            className="flex-row items-center justify-center py-4 mt-4 mb-8"
            onPress={() => Linking.openURL(company.website_url!)}
          >
            <Ionicons name="information-circle-outline" size={16} color={Colors.textSecondary} />
            <Text className="text-xs text-slate-400 ml-1.5">
              Bilgiler resmi web sitesinden derlenmiştir
            </Text>
            <Ionicons name="open-outline" size={12} color={Colors.textSecondary} className="ml-1" />
          </TouchableOpacity>
        )}

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
