import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { ContactChannel } from "@/lib/types";
import { getChannelIcon, getChannelLabel, getChannelColor, openChannel } from "@/lib/utils";
import FastestBadge from "./FastestBadge";
import WorkingHoursIndicator from "./WorkingHoursIndicator";

interface ContactChannelItemProps {
  channel: ContactChannel;
}

export default function ContactChannelItem({ channel }: ContactChannelItemProps) {
  const iconName = getChannelIcon(channel.channel_type);
  const color = getChannelColor(channel.channel_type);
  const label = channel.label || getChannelLabel(channel.channel_type);

  const handlePress = () => {
    openChannel(channel.channel_type, channel.value);
  };

  return (
    <TouchableOpacity
      className={`flex-row items-center p-4 rounded-2xl mb-3 ${
        channel.is_fastest
          ? "bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-200 dark:border-teal-800"
          : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
      }`}
      activeOpacity={0.6}
      onPress={handlePress}
    >
      {/* Kanal ikonu */}
      <View
        className="w-11 h-11 rounded-xl items-center justify-center"
        style={{ backgroundColor: `${color}15` }}
      >
        <MaterialCommunityIcons
          name={iconName as any}
          size={22}
          color={color}
        />
      </View>

      {/* Kanal bilgisi */}
      <View className="flex-1 ml-3">
        <View className="flex-row items-center">
          <Text className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {label}
          </Text>
          {channel.is_fastest && (
            <View className="ml-2">
              <FastestBadge small />
            </View>
          )}
        </View>
        <Text className="text-sm text-slate-500 dark:text-slate-400 mt-0.5" numberOfLines={1}>
          {channel.value}
        </Text>
        {channel.working_hours && (
          <WorkingHoursIndicator workingHours={channel.working_hours} />
        )}
      </View>

      {/* Aksiyon ikonu */}
      <View className="ml-2">
        {channel.channel_type === "phone" ? (
          <View className="w-10 h-10 rounded-full bg-primary-500 items-center justify-center">
            <Ionicons name="call" size={18} color="#fff" />
          </View>
        ) : (
          <View className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 items-center justify-center">
            <Ionicons name="open-outline" size={18} color="#64748b" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
