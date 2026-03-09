import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { WorkingHours } from "@/lib/types";
import { isCurrentlyOpen } from "@/lib/utils";
import { BorderRadius, Colors, Typography } from "@/constants/theme";

interface WorkingHoursIndicatorProps {
  workingHours: WorkingHours;
  light?: boolean;
}

export default function WorkingHoursIndicator({ workingHours, light }: WorkingHoursIndicatorProps) {
  const isOpen = isCurrentlyOpen(workingHours);
  const activeHours = workingHours.weekend || workingHours.weekdays;

  if (isOpen === null) return null;

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.dot,
          { backgroundColor: isOpen ? Colors.success : Colors.danger },
        ]}
      />
      <Text
        style={[
          styles.status,
          {
            color: light
              ? "rgba(255,255,255,0.9)"
              : isOpen
                ? Colors.success
                : Colors.danger,
          },
        ]}
      >
        Şu an {isOpen ? "açık" : "kapalı"}
      </Text>
      {activeHours && (
        <Text
          style={[
            styles.hours,
            {
              color: light ? "rgba(255,255,255,0.6)" : Colors.textSecondary,
            },
          ]}
        >
          {activeHours}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
    marginRight: 6,
  },
  status: {
    ...Typography.micro,
    fontWeight: "700",
  },
  hours: {
    ...Typography.micro,
    marginLeft: 6,
  },
});
