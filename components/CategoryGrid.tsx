import React from "react";
import { Text, FlatList, TouchableOpacity, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Category } from "@/lib/types";
import { getCategoryIcon } from "@/lib/utils";
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/theme";

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const router = useRouter();

  const renderChip = ({ item }: { item: Category }) => {
    const iconName = getCategoryIcon(item.icon);

    return (
      <TouchableOpacity
        style={styles.chip}
        activeOpacity={0.7}
        onPress={() =>
          router.push(
            `/category/${item.id}?name=${encodeURIComponent(item.name)}`
          )
        }
      >
        <View style={styles.chipIconContainer}>
          <Ionicons name={iconName as any} size={15} color={Colors.text} />
        </View>
        <View>
          <Text style={styles.chipLabel}>{item.name}</Text>
          <Text style={styles.chipMeta}>Sektoru ac</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={categories}
      keyExtractor={(item) => item.id}
      renderItem={renderChip}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.screenPadding,
    gap: 12,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 132,
    ...Shadows.subtle,
  },
  chipIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  chipLabel: {
    ...Typography.bodyStrong,
  },
  chipMeta: {
    ...Typography.micro,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
