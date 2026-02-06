import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ContactChannel } from "@/lib/types";
import { getChannelIcon, getChannelLabel, getChannelActionColor, getChannelActionIcon, openChannel } from "@/lib/utils";
import WorkingHoursIndicator from "./WorkingHoursIndicator";

interface ContactChannelItemProps {
  channel: ContactChannel;
}

export default function ContactChannelItem({ channel }: ContactChannelItemProps) {
  const iconName = getChannelIcon(channel.channel_type);
  const actionColor = getChannelActionColor(channel.channel_type);
  const actionIcon = getChannelActionIcon(channel.channel_type);
  const label = channel.label || getChannelLabel(channel.channel_type);

  const handlePress = () => {
    openChannel(channel.channel_type, channel.value);
  };

  const isFastest = channel.is_fastest;

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
        borderRadius: 14,
        marginBottom: 8,
        backgroundColor: isFastest ? "#FFF7F3" : "#FFFFFF",
        borderWidth: isFastest ? 1.5 : 1,
        borderColor: isFastest ? "#FFD4C0" : "#F0F0EB",
      }}
      activeOpacity={0.5}
      onPress={handlePress}
    >
      {/* Channel icon */}
      <View style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: isFastest ? "#FFF0EB" : "#F5F5F0",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Ionicons name={iconName as any} size={20} color={isFastest ? "#FF6B35" : "#48484A"} />
      </View>

      {/* Channel info */}
      <View style={{ flex: 1, marginLeft: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#1A1A1A" }}>
            {label}
          </Text>
          {isFastest && (
            <View style={{
              marginLeft: 6,
              backgroundColor: "#FFF0EB",
              paddingHorizontal: 6,
              paddingVertical: 1,
              borderRadius: 8,
            }}>
              <Text style={{ fontSize: 9, fontWeight: "700", color: "#FF6B35" }}>EN HIZLI</Text>
            </View>
          )}
        </View>
        <Text style={{ fontSize: 12, color: "#8E8E93", marginTop: 2 }} numberOfLines={1}>
          {channel.value}
        </Text>
        {channel.working_hours && (
          <WorkingHoursIndicator workingHours={channel.working_hours} />
        )}
      </View>

      {/* Action button */}
      <TouchableOpacity
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: actionColor,
          alignItems: "center",
          justifyContent: "center",
          marginLeft: 8,
        }}
        activeOpacity={0.7}
        onPress={handlePress}
      >
        <Ionicons name={actionIcon as any} size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
