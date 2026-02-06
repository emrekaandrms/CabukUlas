import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WorkingHours } from "@/lib/types";
import { isCurrentlyOpen } from "@/lib/utils";

interface WorkingHoursIndicatorProps {
  workingHours: WorkingHours;
}

export default function WorkingHoursIndicator({ workingHours }: WorkingHoursIndicatorProps) {
  const isOpen = isCurrentlyOpen(workingHours);

  if (isOpen === null) return null;

  return (
    <View className="flex-row items-center mt-1">
      <View
        className={`w-2 h-2 rounded-full mr-1.5 ${
          isOpen ? "bg-green-500" : "bg-red-400"
        }`}
      />
      <Text className={`text-xs ${isOpen ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
        {isOpen ? "Şu an açık" : "Şu an kapalı"}
      </Text>
      {workingHours.weekdays && (
        <Text className="text-xs text-slate-400 ml-1">
          • Haftaiçi {workingHours.weekdays}
        </Text>
      )}
    </View>
  );
}
