import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FastestBadgeProps {
  small?: boolean;
}

export default function FastestBadge({ small = false }: FastestBadgeProps) {
  if (small) {
    return (
      <View className="flex-row items-center bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded-full">
        <Ionicons name="flash" size={10} color="#0d9488" />
        <Text className="text-[10px] font-semibold text-teal-700 dark:text-teal-400 ml-0.5">
          En Hızlı
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-center bg-teal-50 dark:bg-teal-900/30 px-3 py-1.5 rounded-full">
      <Ionicons name="flash" size={14} color="#0d9488" />
      <Text className="text-xs font-bold text-teal-700 dark:text-teal-400 ml-1">
        En Hızlı Yol
      </Text>
    </View>
  );
}
