import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, Redirect, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "../Store/auth.store";
import { useLanguageStore } from "../Store/language.store";
import { useEffect } from "react";
import AIHomeScreen from "./AIPrediction/AIHomeScreen";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();

  const { token, isHydrated, hydrate } = useAuthStore();
  const { hydrate: hydrateLanguage } = useLanguageStore();

  useEffect(() => {
    hydrate();
    hydrateLanguage();
  }, []);

  // ⏳ wait until auth is restored
  if (!isHydrated) {
    return null;
  }

  const inAuthGroup = segments.length > 0 && segments[0] === "Auth";
  const isLoggedIn = !!token;

  // 🔐 not logged in → login
  if (!isLoggedIn && !inAuthGroup) {
    return <Redirect href="/Auth/login" />;
  }

  // 🚫 logged in → block auth screens
  if (isLoggedIn && inAuthGroup) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* 🔑 AUTH ROUTES */}
        <Stack.Screen name="Auth" />

        {/* 🧭 MAIN TABS */}
        <Stack.Screen name="(tabs)" />

        {/* OPTIONAL MODAL */}
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal" }}
        />

        <Stack.Screen
          name="AIPrediction/AIHomeScreen"
          options={{ headerShown: true, title: "" }}
        />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
