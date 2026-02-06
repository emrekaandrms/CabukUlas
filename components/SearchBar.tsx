import React from "react";
import { View, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  isSearching?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function SearchBar({
  value,
  onChangeText,
  onClear,
  isSearching = false,
  placeholder = "Firma ara... (ör: Trendyol, Yurtiçi Kargo)",
  autoFocus = false,
}: SearchBarProps) {
  return (
    <View className="flex-row items-center bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 mx-4 shadow-sm border border-slate-100 dark:border-slate-700">
      <Ionicons
        name="search-outline"
        size={22}
        color={Colors.textSecondary}
      />
      <TextInput
        className="flex-1 ml-3 text-base text-slate-900 dark:text-slate-100"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textSecondary}
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {isSearching && (
        <ActivityIndicator size="small" color={Colors.primary} />
      )}
      {value.length > 0 && !isSearching && (
        <TouchableOpacity onPress={onClear} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}
