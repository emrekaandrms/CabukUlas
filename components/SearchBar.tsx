import React from "react";
import { View, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  isSearching?: boolean;
  autoFocus?: boolean;
}

export default function SearchBar({ value, onChangeText, onClear, isSearching, autoFocus }: SearchBarProps) {
  return (
    <View style={{
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#F5F5F0",
      borderRadius: 12,
      paddingHorizontal: 14,
      height: 44,
    }}>
      <Ionicons name="search" size={18} color="#AEAEB2" />
      <TextInput
        style={{
          flex: 1,
          marginLeft: 10,
          fontSize: 15,
          color: "#1A1A1A",
          paddingVertical: 0,
        }}
        value={value}
        onChangeText={onChangeText}
        placeholder="Firma adı yazın..."
        placeholderTextColor="#AEAEB2"
        autoFocus={autoFocus}
        returnKeyType="search"
        autoCorrect={false}
      />
      {isSearching && <ActivityIndicator size="small" color="#8E8E93" style={{ marginRight: 8 }} />}
      {value.length > 0 && !isSearching && (
        <TouchableOpacity onPress={onClear} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close-circle" size={18} color="#AEAEB2" />
        </TouchableOpacity>
      )}
    </View>
  );
}
