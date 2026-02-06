import React from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCompany } from "@/hooks/useCompany";
import ContactChannelItem from "@/components/ContactChannelItem";
import CargoTracker from "@/components/CargoTracker";

export default function CompanyDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { data: company, isLoading, error } = useCompany(slug || "");

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F0", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#1A1A1A" />
      </SafeAreaView>
    );
  }

  if (error || !company) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F0", alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
        <Ionicons name="alert-circle-outline" size={56} color="#AEAEB2" />
        <Text style={{ fontSize: 17, fontWeight: "600", color: "#48484A", marginTop: 16, textAlign: "center" }}>
          Firma bulunamadı
        </Text>
        <TouchableOpacity
          style={{ marginTop: 16, backgroundColor: "#1A1A1A", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}
          onPress={() => router.back()}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>Geri Dön</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const channels = company.contact_channels || [];
  const fastestChannel = channels.find((c) => c.is_fastest);
  const otherChannels = channels.filter((c) => !c.is_fastest);

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
        <Text style={{ flex: 1, fontSize: 17, fontWeight: "600", color: "#1A1A1A", marginLeft: 12 }} numberOfLines={1}>
          {company.name}
        </Text>
        {company.website_url && (
          <TouchableOpacity onPress={() => Linking.openURL(company.website_url!)} style={{ padding: 4 }}>
            <Ionicons name="globe-outline" size={22} color="#8E8E93" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Company info */}
        <View style={{ alignItems: "center", paddingTop: 8, paddingBottom: 24, paddingHorizontal: 20 }}>
          <View style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            backgroundColor: "#FFFFFF",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: "#E8E8E3",
            overflow: "hidden",
          }}>
            {company.logo_url ? (
              <Image source={{ uri: company.logo_url }} style={{ width: 72, height: 72 }} resizeMode="contain" />
            ) : (
              <Text style={{ fontSize: 28, fontWeight: "800", color: "#1A1A1A" }}>
                {company.name.charAt(0)}
              </Text>
            )}
          </View>
          <Text style={{ fontSize: 22, fontWeight: "700", color: "#1A1A1A", marginTop: 12 }}>
            {company.name}
          </Text>
          {company.category && (
            <Text style={{ fontSize: 14, color: "#8E8E93", marginTop: 4 }}>
              {company.category.name}
            </Text>
          )}
          {company.description && (
            <Text style={{ fontSize: 13, color: "#8E8E93", marginTop: 6, textAlign: "center" }}>
              {company.description}
            </Text>
          )}
        </View>

        {/* Fastest Channel */}
        {fastestChannel && (
          <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
              <Ionicons name="flash" size={16} color="#FF6B35" />
              <Text style={{ fontSize: 15, fontWeight: "700", color: "#FF6B35", marginLeft: 6 }}>
                En Hızlı Yol
              </Text>
            </View>
            <ContactChannelItem channel={fastestChannel} />
          </View>
        )}

        {/* Other Channels */}
        {otherChannels.length > 0 && (
          <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "#1A1A1A", marginBottom: 10 }}>
              Tüm İletişim Kanalları
            </Text>
            {otherChannels.map((channel) => (
              <ContactChannelItem key={channel.id} channel={channel} />
            ))}
          </View>
        )}

        {/* Cargo */}
        {company.has_cargo_tracking && company.cargo_tracking_url && (
          <CargoTracker companyName={company.name} trackingUrl={company.cargo_tracking_url} />
        )}

        {/* Source */}
        {company.website_url && (
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 20, marginTop: 8 }}
            onPress={() => Linking.openURL(company.website_url!)}
          >
            <Ionicons name="information-circle-outline" size={14} color="#AEAEB2" />
            <Text style={{ fontSize: 11, color: "#AEAEB2", marginLeft: 4 }}>
              Bilgiler resmi kaynaktan derlenmiştir
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
