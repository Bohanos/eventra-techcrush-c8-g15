import { Image, StyleSheet, Text, View } from "react-native";
import { colors, typography } from "../constants/theme";

interface LogoProps {
  variant?: "white" | "blue"; // white = dark backgrounds (Welcome), blue = light backgrounds (Home, Tabs)
  showTagline?: boolean;
  size?: number;
}

// Static requires — Metro needs these as literal paths, not dynamic strings.
const LOGO_SOURCES = {
  white: require("@/assets/images/eventra_logo.png"),
  blue: require("@/assets/images/eventra_logo_blue.png"),
};

export default function Logo({
  variant = "blue",
  showTagline = false,
  size = 20,
}: LogoProps) {
  const textColor = variant === "white" ? colors.white : colors.primary;

  return (
    <View style={styles.row}>
      <Image
        source={LOGO_SOURCES[variant]}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
      <View>
        <Text style={[styles.text, { color: textColor }]}>Eventra</Text>
        {showTagline && (
          <Text
            style={[styles.tagline, variant === "white" && styles.taglineWhite]}
          >
            Discover. Book. Experience.
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  text: { ...typography.h3, fontWeight: "800" },
  tagline: { ...typography.small, color: colors.textMuted, marginTop: 1 },
  taglineWhite: { color: "rgba(255,255,255,0.75)" },
});
