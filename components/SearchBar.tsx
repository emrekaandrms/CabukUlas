import React from "react";
import { View, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BorderRadius, Colors, Shadows, Spacing, Typography } from "@/constants/theme";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  onSubmit?: () => void;
  isSearching?: boolean;
  autoFocus?: boolean;
  prominent?: boolean;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  onClear,
  onSubmit,
  isSearching,
  autoFocus,
  prominent = false,
  placeholder = "Firma, marka veya hizmet ara",
}: SearchBarProps) {
  return (
    <View style={[styles.container, prominent && styles.containerProminent]}>
      <View style={[styles.iconWrap, prominent && styles.iconWrapProminent]}>
        <Ionicons
          name="search"
          size={prominent ? 24 : 17}
          color={Colors.textSecondary}
        />
      </View>
      <TextInput
        style={[styles.input, prominent && styles.inputProminent]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textSecondary}
        autoFocus={autoFocus}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        selectionColor={Colors.accent}
        onSubmitEditing={onSubmit}
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
  containerProminent: {
    height: 74,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: 12,
    ...Shadows.medium,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceSecondary,
  },
  iconWrapProminent: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.md,
  },
  input: {
    flex: 1,
    ...Typography.bodyStrong,
    marginLeft: 10,
    color: Colors.text,
    paddingVertical: 0,
  },
  inputProminent: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700",
    marginLeft: 14,
  },
  clearButton: {
    padding: 6,
  },
});
