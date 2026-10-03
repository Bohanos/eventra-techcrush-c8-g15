import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../../components/PrimaryButton";
import { colors, radius, spacing, typography } from "../../../constants/theme";

type PaymentOption = "card" | "bank_transfer" | "ussd";

const OPTIONS: {
  id: PaymentOption;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}[] = [
  {
    id: "card",
    icon: "card-outline",
    title: "Debit / Credit Card",
    subtitle: "Mastercard, Visa, Verve via Paystack",
  },
  {
    id: "bank_transfer",
    icon: "business-outline",
    title: "Bank Transfer",
    subtitle: "Instant account transfer with fast confirmation",
  },
  {
    id: "ussd",
    icon: "keypad-outline",
    title: "USSD / Bank Code",
    subtitle: "GTBank (*737#), Zenith (*966#), UBA (*919#)",
  },
];

export default function PaymentMethodScreen() {
  const params = useLocalSearchParams<{
    id: string;
    tierId: string;
    tierName: string;
    unitPrice: string;
    quantity: string;
    attendeeName: string;
    attendeeEmail: string;
    attendeePhone: string;
    subtotal: string;
    serviceFee: string;
    vat: string;
    total: string;
  }>();
  const router = useRouter();
  const [selected, setSelected] = useState<PaymentOption>("card");

  const total = Number(params.total ?? "0");

  function handlePay() {
    router.push({
      pathname: "/checkout/[id]/processing",
      params: { ...params, paymentMethod: selected },
    });
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.secureBadge}>Secure Checkout</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.stepLabel}>STEP 2 OF 2</Text>
        <Text style={styles.title}>Payment Method</Text>

        <View style={styles.orderCard}>
          <View>
            <Text style={styles.orderLabel}>ORDER ITEM</Text>
            <Text style={styles.orderValue}>
              {params.tierName} × {params.quantity}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.orderLabel}>AMOUNT DUE</Text>
            <Text style={styles.orderTotal}>₦{total.toLocaleString()}</Text>
          </View>
        </View>

        {OPTIONS.map((option) => {
          const isSelected = selected === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                isSelected && styles.optionCardSelected,
              ]}
              onPress={() => setSelected(option.id)}
              activeOpacity={0.85}
            >
              <View style={styles.optionIcon}>
                <Ionicons name={option.icon} size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: spacing.sm }}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
              </View>
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={styles.securityRow}>
          <Ionicons
            name="shield-checkmark-outline"
            size={16}
            color={colors.success}
          />
          <Text style={styles.securityText}>
            Bank-grade payment security • 256-bit SSL
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Total Payable</Text>
          <Text style={styles.footerTotal}>₦{total.toLocaleString()}</Text>
        </View>
        <PrimaryButton
          title={`Pay ₦${total.toLocaleString()}`}
          icon="lock-closed"
          onPress={handlePay}
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
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  secureBadge: { ...typography.small, color: colors.textMuted },
  container: { padding: spacing.lg, paddingTop: spacing.sm },
  stepLabel: {
    ...typography.small,
    color: colors.primary,
    fontWeight: "700",
    marginBottom: 2,
  },
  title: { ...typography.h2, color: colors.text, marginBottom: spacing.md },
  orderCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  orderLabel: { ...typography.small, color: colors.textFaint, marginBottom: 2 },
  orderValue: { ...typography.bodyBold, color: colors.text },
  orderTotal: { ...typography.h3, color: colors.primary },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  optionTitle: { ...typography.bodyBold, color: colors.text },
  optionSubtitle: { ...typography.caption, color: colors.textMuted },
  radio: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: { borderColor: colors.primary },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: spacing.md,
    justifyContent: "center",
  },
  securityText: { ...typography.small, color: colors.textMuted },
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
