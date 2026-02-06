import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";

interface CargoTrackerProps {
  companyName: string;
  trackingUrl: string; // URL sablonu, {code} placeholder icermeli
}

export default function CargoTracker({ companyName, trackingUrl }: CargoTrackerProps) {
  const [trackingCode, setTrackingCode] = useState("");

  const handleTrack = () => {
    if (!trackingCode.trim()) return;
    const url = trackingUrl.replace("{code}", trackingCode.trim());
    Linking.openURL(url);
  };

  return (
    <View className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 mx-4 mt-4 border border-amber-200 dark:border-amber-800">
      <View className="flex-row items-center mb-3">
        <Ionicons name="cube-outline" size={20} color="#d97706" />
        <Text className="text-sm font-bold text-amber-800 dark:text-amber-300 ml-2">
          Kargo Takip
        </Text>
      </View>

      <Text className="text-xs text-amber-700 dark:text-amber-400 mb-3">
        {companyName} kargonuzu resmi siteden takip edin
      </Text>

      <View className="flex-row">
        <TextInput
          className="flex-1 bg-white dark:bg-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 border border-amber-200 dark:border-slate-600"
          value={trackingCode}
          onChangeText={setTrackingCode}
          placeholder="Takip numaranız..."
          placeholderTextColor={Colors.textSecondary}
          autoCapitalize="characters"
          returnKeyType="go"
          onSubmitEditing={handleTrack}
        />
        <TouchableOpacity
          className={`ml-2 rounded-xl px-5 items-center justify-center ${
            trackingCode.trim() ? "bg-amber-500" : "bg-amber-300"
          }`}
          onPress={handleTrack}
          disabled={!trackingCode.trim()}
        >
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text className="text-[10px] text-amber-600/60 dark:text-amber-400/40 mt-2">
        Resmi takip sayfasına yönlendirilirsiniz. Verileriniz uygulama tarafından saklanmaz.
      </Text>
    </View>
  );
}
