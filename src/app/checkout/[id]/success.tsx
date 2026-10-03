import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../../components/PrimaryButton";
import { colors, radius, spacing, typography } from "../../../constants/theme";

export default function SuccessScreen() {
  const { bookingId, eventTitle } = useLocalSearchParams<{
    bookingId: string;
    eventTitle: string;
  }>();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.badge}>
          <Ionicons name="checkmark" size={32} color={colors.white} />
        </View>
        <Text style={styles.statusTag}>ORDER CONFIRMED</Text>
        <Text style={styles.title}>Payment Successful!</Text>
        <Text style={styles.subtitle}>
          Your spot for {eventTitle ?? "the event"} is reserved. Your digital
          pass is ready below.
        </Text>

        <PrimaryButton
          title="View Full Digital Pass"
          icon="qr-code-outline"
          onPress={() =>
            router.replace({
              pathname: "/ticket/[id]/qr",
              params: { id: bookingId as string },
            })
          }
          style={{ width: "100%", marginTop: spacing.xl }}
        />
        <TouchableOpacity
          style={styles.homeLink}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={styles.homeLinkText}>Return to Eventra Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  statusTag: {
    ...typography.small,
    color: colors.success,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: "center",
  },
  homeLink: { marginTop: spacing.lg },
  homeLinkText: { ...typography.bodyBold, color: colors.primary },
});
