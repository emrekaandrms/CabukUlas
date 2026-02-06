import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Company } from "@/lib/types";
import { getChannelLabel } from "@/lib/utils";
import FastestBadge from "./FastestBadge";

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  const router = useRouter();
  const fastestChannel = company.contact_channels?.find((c) => c.is_fastest);

  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#F0F0EB",
      }}
      activeOpacity={0.6}
      onPress={() => router.push(`/company/${company.slug}`)}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* Logo */}
        <View style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: "#F5F5F0",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}>
          {company.logo_url ? (
            <Image source={{ uri: company.logo_url }} style={{ width: 44, height: 44 }} resizeMode="contain" />
          ) : (
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#1A1A1A" }}>
              {company.name.charAt(0)}
            </Text>
          )}
        </View>

        {/* Info */}
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 15, fontWeight: "600", color: "#1A1A1A" }} numberOfLines={1}>
              {company.name}
            </Text>
            {fastestChannel && (
              <View style={{ marginLeft: 8 }}>
                <FastestBadge small />
              </View>
            )}
          </View>
          <Text style={{ fontSize: 12, color: "#8E8E93", marginTop: 2 }}>
            {company.category?.name || ""}
          </Text>
        </View>

        {/* Arrow */}
        <Ionicons name="chevron-forward" size={18} color="#AEAEB2" />
      </View>

      {/* Fastest channel hint */}
      {fastestChannel && (
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 12,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: "#F0F0EB",
        }}>
          <Ionicons name="flash" size={13} color="#FF6B35" />
          <Text style={{ fontSize: 12, color: "#FF6B35", fontWeight: "600", marginLeft: 4 }}>
            {getChannelLabel(fastestChannel.channel_type)} ile ulaş
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
