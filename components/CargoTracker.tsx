import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CargoTrackerProps {
  companyName: string;
  trackingUrl: string;
}

export default function CargoTracker({ companyName, trackingUrl }: CargoTrackerProps) {
  const [trackingCode, setTrackingCode] = useState("");

  const handleTrack = () => {
    if (!trackingCode.trim()) return;
    const url = trackingUrl.replace("{code}", trackingCode.trim());
    Linking.openURL(url);
  };

  return (
    <View style={{
      backgroundColor: "#FFFFFF",
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 16,
      marginTop: 16,
      borderWidth: 1,
      borderColor: "#F0F0EB",
    }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <Ionicons name="cube-outline" size={18} color="#1A1A1A" />
        <Text style={{ fontSize: 14, fontWeight: "600", color: "#1A1A1A", marginLeft: 8 }}>
          Kargo Takip
        </Text>
      </View>

      <Text style={{ fontSize: 12, color: "#8E8E93", marginBottom: 12 }}>
        {companyName} resmi sitesinden takip edin
      </Text>

      <View style={{ flexDirection: "row" }}>
        <TextInput
          style={{
            flex: 1,
            backgroundColor: "#F5F5F0",
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 14,
            color: "#1A1A1A",
          }}
          value={trackingCode}
          onChangeText={setTrackingCode}
          placeholder="Takip numarası..."
          placeholderTextColor="#AEAEB2"
          autoCapitalize="characters"
          returnKeyType="go"
          onSubmitEditing={handleTrack}
        />
        <TouchableOpacity
          style={{
            marginLeft: 8,
            borderRadius: 12,
            paddingHorizontal: 18,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: trackingCode.trim() ? "#1A1A1A" : "#E8E8E3",
          }}
          onPress={handleTrack}
          disabled={!trackingCode.trim()}
        >
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
