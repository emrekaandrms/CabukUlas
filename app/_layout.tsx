import "@/global.css";
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import { queryClient } from "@/lib/queryClient";
import { fetchCategories, fetchPopularCompanies, fetchSearchIndex } from "@/lib/api";
import SplashAnimation from "@/components/SplashAnimation";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { Colors, Motion } from "@/constants/theme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    SplashScreen.hideAsync();

    queryClient.prefetchQuery({
      queryKey: ["categories"],
      queryFn: fetchCategories,
    });
    queryClient.prefetchQuery({
      queryKey: ["companies", "popular"],
      queryFn: fetchPopularCompanies,
    });
    queryClient.prefetchQuery({
      queryKey: ["companies", "search-index"],
      queryFn: fetchSearchIndex,
    });

    const timer = setTimeout(
      () => setShowSplash(false),
      Motion.duration.splash
    );
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <>
        <StatusBar style="dark" />
        <SplashAnimation />
      </>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <AnalyticsTracker />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="company/[slug]"
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="category/[id]"
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
