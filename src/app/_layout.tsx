// src/app/_layout.tsx
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../context/AuthContext";

const MAX_SPLASH_MS = 3000;

// Keep the native splash on screen until we know whether the user
// is signed in — prevents a blank white flash between JS boot and
// the auth redirect deciding where to send them.
SplashScreen.preventAutoHideAsync().catch(() => {
  // no-op — can throw if called more than once during fast refresh
});

function RootNavigation() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const splashHidden = useRef(false);

  function hideSplashOnce() {
    if (splashHidden.current) return;
    splashHidden.current = true;
    SplashScreen.hideAsync().catch(() => {});
  }

  // Hard ceiling: never let the splash sit on screen longer than
  // MAX_SPLASH_MS, even if auth restore is unexpectedly slow.
  useEffect(() => {
    const timeout = setTimeout(hideSplashOnce, MAX_SPLASH_MS);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (isLoading) return; // wait until session restore finishes

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/sign-in");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }

    // Session check resolved and the correct route has been chosen —
    // safe to reveal the app now (usually well before the 3s ceiling).
    hideSplashOnce();
  }, [isAuthenticated, isLoading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="event/[id]" options={{ presentation: "card" }} />
      <Stack.Screen
        name="checkout/[id]/order-summary"
        options={{ presentation: "card" }}
      />
      <Stack.Screen
        name="checkout/[id]/payment-method"
        options={{ presentation: "card" }}
      />
      <Stack.Screen
        name="checkout/[id]/processing"
        options={{ presentation: "card", gestureEnabled: false }}
      />
      <Stack.Screen
        name="checkout/[id]/success"
        options={{ presentation: "card", gestureEnabled: false }}
      />
      <Stack.Screen name="ticket/[id]/qr" options={{ presentation: "modal" }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootNavigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
