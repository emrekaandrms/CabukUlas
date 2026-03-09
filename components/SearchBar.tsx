import React from "react";
import { View, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BorderRadius, Colors, Shadows, Spacing, Typography } from "@/constants/theme";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  isSearching?: boolean;
  autoFocus?: boolean;
}

export default function SearchBar({
  value,
  onChangeText,
  onClear,
  isSearching,
  autoFocus,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="search" size={17} color={Colors.textSecondary} />
      </View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Firma, marka veya hizmet ara"
        placeholderTextColor={Colors.textSecondary}
        autoFocus={autoFocus}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        selectionColor={Colors.accent}
      />
      {isSearching && (
        <ActivityIndicator
          size="small"
          color={Colors.accent}
          style={{ marginRight: Spacing.xs }}
        />
      )}
      {value.length > 0 && !isSearching && (
        <TouchableOpacity
          onPress={onClear}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.clearButton}
        >
          <Ionicons name="close-circle-outline" size={18} color={Colors.textTertiary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 8,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceSecondary,
  },
  input: {
    flex: 1,
    ...Typography.bodyStrong,
    marginLeft: 10,
    color: Colors.text,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 6,
  },
});
