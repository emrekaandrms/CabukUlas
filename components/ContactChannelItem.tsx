import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { ContactChannel } from "@/lib/types";
import { getChannelIcon, getChannelLabel, openChannel } from "@/lib/utils";
import {
  BorderRadius,
  Colors,
  Shadows,
  Typography,
} from "@/constants/theme";
import WorkingHoursIndicator from "./WorkingHoursIndicator";

interface ContactChannelItemProps {
  channel: ContactChannel;
  prominent?: boolean;
}

export default function ContactChannelItem({ channel, prominent }: ContactChannelItemProps) {
  const iconName = getChannelIcon(channel.channel_type);
  const label = channel.label || getChannelLabel(channel.channel_type);
  const hasOfficialSource = Boolean(channel.official_source_url);

  const handlePress = () => {
    void trackAnalyticsEvent({
      event_name: "contact_channel_clicked",
      source_screen: "/company",
      company_id: channel.company_id,
      contact_channel_id: channel.id,
      channel_type: channel.channel_type,
    });
    openChannel(channel.channel_type, channel.value);
  };

  // ===== PROMINENT MODE - Used for fastest channel =====
  if (prominent) {
    return (
      <TouchableOpacity
        style={styles.prominentCard}
        activeOpacity={0.8}
        onPress={handlePress}
      >
        <View style={styles.prominentBody}>
          <View style={styles.prominentIconWrap}>
            <Ionicons name={iconName as any} size={24} color={Colors.textInverse} />
          </View>
          <View style={styles.prominentInfo}>
            <Text style={styles.prominentLabel}>{label}</Text>
            <Text style={styles.prominentValue} numberOfLines={1}>
              {channel.value}
            </Text>
            <View style={styles.prominentMetaRow}>
              {hasOfficialSource ? (
                <View style={styles.prominentMetaPill}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={12}
                    color="rgba(255,255,255,0.8)"
                  />
                  <Text style={styles.prominentMetaText}>Resmi kaynak</Text>
                </View>
              ) : null}
            </View>
            {channel.working_hours && (
              <WorkingHoursIndicator workingHours={channel.working_hours} light />
            )}
          </View>
        </View>
        <View style={styles.prominentAction}>
          <Text style={styles.prominentActionText}>En iyi sonraki adim</Text>
          <View style={styles.prominentArrow}>
            <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // ===== REGULAR MODE =====
  return (
    <TouchableOpacity
      style={styles.item}
      activeOpacity={0.6}
      onPress={handlePress}
    >
      <View style={styles.iconWrap}>
        <Ionicons name={iconName as any} size={18} color={Colors.textSecondary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value} numberOfLines={1}>
          {channel.value}
        </Text>
        {hasOfficialSource ? (
          <View style={styles.inlineMeta}>
            <Ionicons
              name="shield-checkmark-outline"
              size={12}
              color={Colors.textSecondary}
            />
            <Text style={styles.inlineMetaText}>Resmi kaynak</Text>
          </View>
        ) : null}
        {channel.working_hours && (
          <WorkingHoursIndicator workingHours={channel.working_hours} />
        )}
      </View>
      <View style={styles.arrow}>
        <Ionicons name="chevron-forward" size={15} color={Colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // ===== PROMINENT (Fastest) =====
  prominentCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    marginHorizontal: 20,
    overflow: "hidden",
    ...Shadows.large,
  },
  prominentBody: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  prominentIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  prominentInfo: {
    flex: 1,
    marginLeft: 16,
  },
  prominentLabel: {
    ...Typography.sectionTitle,
    color: Colors.textInverse,
  },
  prominentValue: {
    fontSize: 14,
    color: "rgba(255,255,255,0.65)",
    marginTop: 3,
  },
  prominentMetaRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  prominentMetaPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  prominentMetaText: {
    ...Typography.micro,
    color: "rgba(255,255,255,0.8)",
    marginLeft: 4,
  },
  prominentAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.accent,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  prominentActionText: {
    ...Typography.bodyStrong,
    color: Colors.textInverse,
    flex: 1,
    textAlign: "center",
  },
  prominentArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  // ===== REGULAR =====
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: BorderRadius.lg,
    marginBottom: 8,
    ...Shadows.small,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    marginLeft: 14,
  },
  label: {
    ...Typography.bodyStrong,
  },
  value: {
    ...Typography.meta,
    marginTop: 2,
  },
  inlineMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },
  inlineMetaText: {
    ...Typography.micro,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  arrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
});
