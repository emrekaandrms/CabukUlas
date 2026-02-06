import React from "react";
import { View, Text } from "react-native";
import { WorkingHours } from "@/lib/types";
import { isCurrentlyOpen } from "@/lib/utils";

interface WorkingHoursIndicatorProps {
  workingHours: WorkingHours;
}

export default function WorkingHoursIndicator({ workingHours }: WorkingHoursIndicatorProps) {
  const isOpen = isCurrentlyOpen(workingHours);

  if (isOpen === null) return null;

  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: isOpen ? "#34C759" : "#FF3B30",
          marginRight: 5,
        }}
      />
      <Text style={{ fontSize: 11, color: isOpen ? "#34C759" : "#FF3B30", fontWeight: "500" }}>
        {isOpen ? "Açık" : "Kapalı"}
      </Text>
      {workingHours.weekdays && (
        <Text style={{ fontSize: 11, color: "#AEAEB2", marginLeft: 4 }}>
          {workingHours.weekdays}
        </Text>
      )}
    </View>
  );
}
