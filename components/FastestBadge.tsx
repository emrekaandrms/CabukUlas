import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FastestBadgeProps {
  small?: boolean;
}

export default function FastestBadge({ small = false }: FastestBadgeProps) {
  if (small) {
    return (
      <View className="flex-row items-center bg-accent-light px-2 py-0.5 rounded-full">
        <Ionicons name="flash" size={9} color="#FF6B35" />
        <Text style={{ color: "#FF6B35", fontSize: 10, fontWeight: "700", marginLeft: 2 }}>
          Hızlı
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-center" style={{ backgroundColor: "#FFF0EB" , paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 }}>
      <Ionicons name="flash" size={13} color="#FF6B35" />
      <Text style={{ color: "#FF6B35", fontSize: 12, fontWeight: "700", marginLeft: 3 }}>
        En Hızlı Yol
      </Text>
    </View>
  );
}
