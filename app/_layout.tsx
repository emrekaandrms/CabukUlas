import "@/global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import { queryClient } from "@/lib/queryClient";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: "#F5F5F0" },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="company/[slug]" options={{ headerShown: false, animation: "slide_from_right" }} />
        <Stack.Screen name="category/[id]" options={{ headerShown: false, animation: "slide_from_right" }} />
        <Stack.Screen name="search" options={{ headerShown: false, animation: "fade" }} />
      </Stack>
    </QueryClientProvider>
  );
}
