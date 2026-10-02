// src/app/(auth)/welcome.tsx
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius, spacing, typography } from "../../constants/theme";

// Placeholder crowd/concert photo — swap for a licensed asset before shipping.
const BG_IMAGE =
  "https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGNvbmNlcnQlMjBjcm93ZHxlbnwwfHwwfHx8MA%3D%3D";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={{ uri: BG_IMAGE }}
      style={styles.bg}
      resizeMode="cover"
    >
      <LinearGradient
        colors={[
          "rgba(30,10,60,0.35)",
          "rgba(20,8,50,0.75)",
          "rgba(10,4,30,0.95)",
        ]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <View style={styles.logoWrap}>
          <View style={styles.logoRow}>
            <Image
              source={require("@/assets/images/eventra_logo.png")}
              style={styles.logoIcon}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.logo}>Eventra</Text>
              <Text style={styles.tagline}>Discover. Book. Experience.</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottom}>
          <Text style={styles.headline}>
            Find amazing events in your city and beyond.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={() => router.push("/(auth)/sign-up")}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.85}
            onPress={() => router.push("/(auth)/sign-in")}
          >
            <Text style={styles.secondaryButtonText}>Sign In</Text>
          </TouchableOpacity>

          <View style={styles.pagerDot} />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.black },
  safe: { flex: 1, justifyContent: "space-between", padding: spacing.lg },
  logoWrap: { alignItems: "center", marginTop: spacing.xxl },
  logoRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  logoIcon: { width: 64, height: 64 },
  logo: {
    fontSize: 46,
    fontWeight: "800",
    color: colors.white,
    lineHeight: 34,
  },
  tagline: {
    ...typography.caption,
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
    fontSize: 13,
  },
  bottom: { alignItems: "center", paddingBottom: spacing.md },
  headline: {
    ...typography.h2,
    color: colors.white,
    textAlign: "center",
    marginBottom: spacing.lg,
    lineHeight: 30,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 6,
    width: "100%",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  primaryButtonText: { ...typography.bodyBold, color: colors.white },
  secondaryButton: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 6,
    width: "100%",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  secondaryButtonText: { ...typography.bodyBold, color: colors.white },
  pagerDot: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
});
