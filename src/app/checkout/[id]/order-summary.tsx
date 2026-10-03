import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../../components/PrimaryButton";
import { colors, radius, spacing, typography } from "../../../constants/theme";
import { useAuth } from "../../../context/AuthContext";
import { eventsService } from "../../../services/eventsService";
import { Event } from "../../../types";

const RESERVATION_SECONDS = 20 * 60; // 20:00, cosmetic countdown matching Figma

function formatCountdown(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function OrderSummaryScreen() {
  const {
    id,
    tierId,
    tierName,
    unitPrice,
    quantity: quantityParam,
  } = useLocalSearchParams<{
    id: string;
    tierId: string;
    tierName: string;
    unitPrice: string;
    quantity: string;
  }>();
  const router = useRouter();
  const { user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(Number(quantityParam ?? "1"));
  const [secondsLeft, setSecondsLeft] = useState(RESERVATION_SECONDS);

  const [fullName, setFullName] = useState(
    user ? `${user.firstName} ${user.lastName}` : "",
  );
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [attendingPersonally, setAttendingPersonally] = useState(true);

  useEffect(() => {
    if (!id) return;
    eventsService.getEventById(id).then((data) => {
      setEvent(data ?? null);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const price = Number(unitPrice ?? "0");
  const subtotal = price * quantity;
  const serviceFee = Math.round(subtotal * 0.1);
  const vat = Math.round(subtotal * 0.075);
  const total = subtotal + serviceFee + vat;

  function handleContinue() {
    if (!event) return;
    router.push({
      pathname: "/checkout/[id]/payment-method",
      params: {
        id: event.id,
        tierId,
        tierName,
        unitPrice,
        quantity: String(quantity),
        attendeeName: fullName,
        attendeeEmail: email,
        attendeePhone: phone,
        subtotal: String(subtotal),
        serviceFee: String(serviceFee),
        vat: String(vat),
        total: String(total),
      },
    });
  }

  if (loading || !event) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator
          color={colors.primary}
          style={{ marginTop: spacing.xxl }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/(tabs)")}>
          <Ionicons name="close" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.reservedBanner}>
        <View style={styles.reservedLeft}>
          <Ionicons name="time-outline" size={16} color={colors.primaryDark} />
          <Text style={styles.reservedText}>RESERVED FOR YOU</Text>
        </View>
        <Text style={styles.reservedTimer}>{formatCountdown(secondsLeft)}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.stepLabel}>STEP 1 OF 2</Text>
        <Text style={styles.title}>Order Summary</Text>

        <View style={styles.eventCard}>
          <Image source={{ uri: event.image }} style={styles.eventImage} />
          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <Text style={styles.eventTitle} numberOfLines={2}>
              {event.title}
            </Text>
            <Text style={styles.eventMeta}>
              {event.dateLabel} • {event.time}
            </Text>
            <Text style={styles.eventMeta}>{event.venue}</Text>
          </View>
        </View>

        <View style={styles.tierCard}>
          <View style={styles.tierHeaderRow}>
            <Text style={styles.tierName}>{tierName}</Text>
            <Text style={styles.tierPrice}>₦{price.toLocaleString()}</Text>
          </View>
          <View style={styles.quantityRow}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Ionicons name="remove" size={16} color={colors.text} />
              </TouchableOpacity>
              <Text style={styles.stepperValue}>{quantity}</Text>
              <TouchableOpacity
                style={[styles.stepperButton, styles.stepperButtonActive]}
                onPress={() => setQuantity((q) => q + 1)}
              >
                <Ionicons name="add" size={16} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Primary Attendee</Text>
        <View style={styles.formCard}>
          <Text style={styles.fieldLabel}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="John Doe"
          />

          <Text style={styles.fieldLabel}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="john@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.fieldLabel}>Phone (WhatsApp updates)</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="+234 801 234 5678"
            keyboardType="phone-pad"
          />

          <Pressable
            style={styles.checkboxRow}
            onPress={() => setAttendingPersonally((v) => !v)}
          >
            <View
              style={[
                styles.checkbox,
                attendingPersonally && styles.checkboxChecked,
              ]}
            >
              {attendingPersonally && (
                <Ionicons name="checkmark" size={12} color={colors.white} />
              )}
            </View>
            <Text style={styles.checkboxLabel}>
              I am attending this event personally
            </Text>
          </Pressable>
        </View>

        <Text style={styles.sectionHeader}>Payment Breakdown</Text>
        <View style={styles.breakdownCard}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>
              {tierName} (×{quantity})
            </Text>
            <Text style={styles.breakdownValue}>
              ₦{subtotal.toLocaleString()}
            </Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Service & Processing</Text>
            <Text style={styles.breakdownValue}>
              ₦{serviceFee.toLocaleString()}
            </Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>VAT (7.5%)</Text>
            <Text style={styles.breakdownValue}>₦{vat.toLocaleString()}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.breakdownRow}>
            <Text style={styles.totalLabel}>Total Due</Text>
            <Text style={styles.totalValue}>₦{total.toLocaleString()}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Total Payable</Text>
          <Text style={styles.footerTotal}>₦{total.toLocaleString()}</Text>
        </View>
        <PrimaryButton
          title="Proceed to Payment"
          icon="arrow-forward"
          onPress={handleContinue}
          disabled={!fullName || !email}
          style={{ flex: 1, marginLeft: spacing.md }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  reservedBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.warningBg,
    marginHorizontal: spacing.lg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  reservedLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  reservedText: {
    ...typography.small,
    color: colors.primaryDark,
    fontWeight: "700",
  },
  reservedTimer: { ...typography.bodyBold, color: colors.warning },
  container: { padding: spacing.lg, paddingTop: spacing.sm },
  stepLabel: {
    ...typography.small,
    color: colors.primary,
    fontWeight: "700",
    marginBottom: 2,
  },
  title: { ...typography.h2, color: colors.text, marginBottom: spacing.md },
  eventCard: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  eventImage: { width: 64, height: 64, borderRadius: radius.sm },
  eventTitle: { ...typography.bodyBold, color: colors.text },
  eventMeta: { ...typography.caption, color: colors.textMuted },
  tierCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  tierHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  tierName: { ...typography.bodyBold, color: colors.text },
  tierPrice: { ...typography.bodyBold, color: colors.primary },
  quantityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  quantityLabel: { ...typography.caption, color: colors.textMuted },
  stepper: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  stepperButton: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepperValue: { ...typography.bodyBold, color: colors.text },
  sectionHeader: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.text,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.xs,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxLabel: { ...typography.caption, color: colors.textMuted },
  breakdownCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  breakdownLabel: { ...typography.caption, color: colors.textMuted },
  breakdownValue: { ...typography.caption, color: colors.text },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  totalLabel: { ...typography.bodyBold, color: colors.text },
  totalValue: { ...typography.bodyBold, color: colors.primary },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  footerLabel: { ...typography.caption, color: colors.textMuted },
  footerTotal: { ...typography.h3, color: colors.text },
});
