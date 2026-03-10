import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";

interface FastestBadgeProps {
  small?: boolean;
}

export default function FastestBadge({ small = false }: FastestBadgeProps) {
  if (small) {
    return (
      <View style={styles.smallContainer}>
        <Ionicons name="flash" size={9} color={Colors.accent} />
        <Text style={styles.smallText}>Hızlı</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Ionicons name="flash" size={13} color={Colors.accent} />
      <Text style={styles.text}>En Hızlı Yol</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  smallContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  smallText: {
    color: Colors.accent,
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 2,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  text: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 4,
  },
});
