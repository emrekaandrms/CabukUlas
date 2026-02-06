import "@/global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import { queryClient } from "@/lib/queryClient";

// Splash screen'i uygulama hazir olana kadar goster
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Font, asset vb. yukleme burada yapilabilir
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: "#f8fafc" },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="company/[slug]"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="category/[id]"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="search"
          options={{
            headerShown: false,
            animation: "fade",
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
