import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius, spacing, typography } from "../../../constants/theme";
import { bookingsService } from "../../../services/bookingsService";
import { eventsService } from "../../../services/eventsService";

const STEPS = [
  "Payment Request Initiated",
  "Bank 3D Secure Authorization",
  "Issuing Event Pass & QR",
];

export default function ProcessingScreen() {
  const params = useLocalSearchParams<{
    id: string;
    tierId: string;
    tierName: string;
    unitPrice: string;
    quantity: string;
    attendeeName: string;
    total: string;
  }>();
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      // Simulated Paystack-style step progression — replace this whole
      // effect with real /payments/initiate + /payments/verify calls
      // once backend ships the payment endpoints. The final booking
      // creation call below stays the same either way.
      for (let i = 0; i < STEPS.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 900));
        if (cancelled) return;
        setStepIndex(i + 1);
      }

      try {
        const event = await eventsService.getEventById(params.id);
        if (!event) throw new Error("Event not found");

        const newBooking = await bookingsService.createBooking({
          eventId: event.id,
          ticketTypeId: params.tierId,
          quantity: Number(params.quantity ?? "1"),
          attendeeName: params.attendeeName,
          eventTitle: event.title,
          eventImage: event.image,
          tierName: params.tierName,
          unitPrice: Number(params.unitPrice ?? "0"),
          startDate: event.startDate,
          venue: event.venue,
        });

        if (cancelled) return;
        router.replace({
          pathname: "/checkout/[id]/success",
          params: {
            id: params.id,
            bookingId: newBooking.id,
            total: params.total,
            eventTitle: event.title,
          },
        });
      } catch (e: any) {
        if (!cancelled)
          setErrorMsg(e?.message ?? "Something went wrong while booking.");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.badge}>
          <Ionicons name="shield-checkmark" size={28} color={colors.white} />
        </View>
        <Text style={styles.title}>
          {errorMsg ? "Payment Failed" : "Processing Payment…"}
        </Text>
        <Text style={styles.subtitle}>
          {errorMsg ??
            "Please do not refresh, close the app, or press back. Your transaction is being authenticated."}
        </Text>

        {!errorMsg && (
          <View style={styles.stepsCard}>
            {STEPS.map((label, i) => {
              const done = i < stepIndex;
              const active = i === stepIndex;
              return (
                <View key={label} style={styles.stepRow}>
                  <Ionicons
                    name={
                      done
                        ? "checkmark-circle"
                        : active
                          ? "ellipse-outline"
                          : "ellipse-outline"
                    }
                    size={18}
                    color={
                      done
                        ? colors.primary
                        : active
                          ? colors.textMuted
                          : colors.textFaint
                    }
                  />
                  <Text style={[styles.stepText, done && styles.stepTextDone]}>
                    {label}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
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
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
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
    marginBottom: spacing.xl,
  },
  stepsCard: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  stepText: { ...typography.caption, color: colors.textFaint },
  stepTextDone: { color: colors.text, fontWeight: "600" },
});
