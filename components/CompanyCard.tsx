import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Company } from "@/lib/types";
import { getChannelIcon, getChannelLabel } from "@/lib/utils";
import FastestBadge from "./FastestBadge";
import { Colors } from "@/constants/theme";

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  const router = useRouter();
  const fastestChannel = company.contact_channels?.find((c) => c.is_fastest);

  return (
    <TouchableOpacity
      className="bg-white dark:bg-slate-800 rounded-2xl p-4 mx-4 mb-3 shadow-sm border border-slate-100 dark:border-slate-700"
      activeOpacity={0.7}
      onPress={() => router.push(`/company/${company.slug}`)}
    >
      <View className="flex-row items-center">
        {/* Firma logosu */}
        <View className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 items-center justify-center overflow-hidden">
          {company.logo_url ? (
            <Image
              source={{ uri: company.logo_url }}
              className="w-12 h-12"
              resizeMode="contain"
            />
          ) : (
            <Text className="text-lg font-bold text-primary-500">
              {company.name.charAt(0)}
            </Text>
          )}
        </View>

        {/* Firma bilgileri */}
        <View className="flex-1 ml-3">
          <Text className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {company.name}
          </Text>
          <Text className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {company.category?.name || ""}
          </Text>
        </View>

        {/* En hizli kanal gostergesi */}
        <View className="items-end">
          {fastestChannel && <FastestBadge small />}
          <Ionicons
            name="chevron-forward"
            size={18}
            color={Colors.textSecondary}
            style={{ marginTop: 4 }}
          />
        </View>
      </View>

      {/* En hizli kanal bilgisi */}
      {fastestChannel && (
        <View className="flex-row items-center mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
          <Ionicons name="flash" size={14} color="#0d9488" />
          <Text className="text-xs text-teal-700 dark:text-teal-400 ml-1 font-medium">
            {getChannelLabel(fastestChannel.channel_type)} ile ulaş
          </Text>
          {fastestChannel.channel_type === "phone" && (
            <Text className="text-xs text-slate-400 ml-1">
              • {fastestChannel.value}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
