// src/app/_layout.tsx
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../context/AuthContext";

const MIN_SPLASH_MS = 1200; // minimum time splash stays visible — makes the brand moment felt, not just a flash
const MAX_SPLASH_MS = 3000; // hard ceiling — safety net if auth restore is ever slow

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
  const mountedAt = useRef(Date.now());
  const authResolved = useRef(false);

  function hideSplashOnce() {
    if (splashHidden.current) return;
    splashHidden.current = true;
    SplashScreen.hideAsync().catch(() => {});
  }

  function tryHideSplash() {
    const elapsed = Date.now() - mountedAt.current;
    const remaining = MIN_SPLASH_MS - elapsed;

    if (remaining > 0) {
      // Auth resolved faster than the minimum display time —
      // wait out the rest so the splash doesn't just flash by.
      setTimeout(hideSplashOnce, remaining);
    } else {
      hideSplashOnce();
    }
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

    // Auth check resolved and the correct route has been chosen.
    // Only the FIRST resolution should drive the min-display timer —
    // this effect can re-fire later (e.g. sign out), and we don't want
    // to re-delay hiding on those later runs.
    if (!authResolved.current) {
      authResolved.current = true;
      tryHideSplash();
    }
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
