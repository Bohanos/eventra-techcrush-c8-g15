import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QRCodeCard from "../../../components/QRCodeCard";
import { colors, radius, spacing, typography } from "../../../constants/theme";
import { bookingsService } from "../../../services/bookingsService";
import { Booking } from "../../../types";

const { width } = Dimensions.get("window");

export default function TicketQRScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    bookingsService.getBookingById(id).then((data) => {
      setBooking(data ?? null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator
          color={colors.primary}
          style={{ marginTop: spacing.xxl }}
        />
      </SafeAreaView>
    );
  }

  if (!booking) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.notFound}>Booking not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Alert.alert("Share", "Sharing the digital pass...")}
        >
          <Ionicons name="share-outline" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <View style={styles.statusRow}>
          <View style={styles.activeDot} />
          <Text style={styles.activeText}>
            {booking.tickets.length > 1
              ? `${booking.tickets.length} PASSES`
              : "ACTIVE PASS"}
          </Text>
        </View>
        <Text style={styles.eventTitle}>{booking.eventTitle}</Text>
        <Text style={styles.eventVenue}>{booking.venue}</Text>
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: (width - 280) / 2 }}
      >
        {booking.tickets.map((ticket, index) => (
          <View key={ticket.id} style={{ width: 280, alignItems: "center" }}>
            <QRCodeCard
              qrCodeUrl={ticket.qrCodeUrl}
              ticketCode={ticket.ticketCode}
            />
            {booking.tickets.length > 1 && (
              <Text style={styles.pageIndicator}>
                Ticket {index + 1} of {booking.tickets.length}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.detailsScroll}>
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>ATTENDEE</Text>
            <Text style={styles.detailValue}>{booking.attendeeName}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>TICKET TIER</Text>
            <Text style={styles.detailValue}>
              {booking.tierName} × {booking.quantity}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>DATE</Text>
            <Text style={styles.detailValue}>{booking.dateLabel}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>TIME</Text>
            <Text style={styles.detailValue}>{booking.time}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.walletButton}
          onPress={() =>
            Alert.alert("Saved", "Pass saved to device wallet (demo).")
          }
        >
          <Ionicons name="wallet-outline" size={18} color={colors.white} />
          <Text style={styles.walletButtonText}>Save to Device Wallet</Text>
        </TouchableOpacity>
      </ScrollView>
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
  header: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#4ADE80",
    marginRight: spacing.xs,
  },
  activeText: { ...typography.small, color: colors.white, fontWeight: "700" },
  eventTitle: { ...typography.h3, color: colors.white, marginBottom: 2 },
  eventVenue: { ...typography.caption, color: "rgba(255,255,255,0.85)" },
  pageIndicator: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  detailsScroll: { padding: spacing.lg, alignItems: "center" },
  detailsGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  detailItem: { width: "50%", marginBottom: spacing.sm },
  detailLabel: {
    ...typography.small,
    color: colors.textFaint,
    marginBottom: 2,
  },
  detailValue: { ...typography.bodyBold, color: colors.text },
  walletButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    backgroundColor: colors.text,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 6,
    width: "100%",
  },
  walletButtonText: { ...typography.bodyBold, color: colors.white },
  notFound: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.xxl,
  },
});
