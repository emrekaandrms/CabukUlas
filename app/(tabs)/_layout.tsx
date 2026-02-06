import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1A1A1A",
        tabBarInactiveTintColor: "#AEAEB2",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0.5,
          borderTopColor: "#E8E8E3",
          paddingBottom: 6,
          paddingTop: 6,
          height: 56,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Keşfet",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: "Kategoriler",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
