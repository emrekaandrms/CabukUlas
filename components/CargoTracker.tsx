import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Linking, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  BorderRadius,
  Colors,
  Shadows,
  Typography,
} from "@/constants/theme";

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
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="cube-outline" size={18} color={Colors.text} />
        </View>
        <View>
          <Text style={styles.title}>Kargo Takip</Text>
          <Text style={styles.subtitle}>
            {companyName} resmi takip sayfasina guvenli gecis
          </Text>
        </View>
      </View>

      <View style={styles.noteRow}>
        <Ionicons
          name="shield-checkmark-outline"
          size={12}
          color={Colors.textSecondary}
        />
        <Text style={styles.noteText}>Takip kodunuz yalnizca resmi baglantiya aktarilir</Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={trackingCode}
          onChangeText={setTrackingCode}
          placeholder="Takip numarasi"
          placeholderTextColor={Colors.textTertiary}
          autoCapitalize="characters"
          returnKeyType="go"
          onSubmitEditing={handleTrack}
        />
        <TouchableOpacity
          style={[
            styles.trackButton,
            !trackingCode.trim() && styles.trackButtonDisabled,
          ]}
          onPress={handleTrack}
          disabled={!trackingCode.trim()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-forward" size={18} color={Colors.textInverse} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  title: {
    ...Typography.bodyStrong,
  },
  subtitle: {
    ...Typography.meta,
    marginTop: 2,
  },
  noteRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  noteText: {
    ...Typography.micro,
    color: Colors.textSecondary,
    marginLeft: 5,
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 13,
    ...Typography.bodyStrong,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  trackButton: {
    width: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  trackButtonDisabled: {
    backgroundColor: Colors.border,
  },
});
