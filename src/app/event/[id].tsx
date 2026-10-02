import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthContext';
import { getMockTiersForEvent } from '../../mocks/mockEvents';
import { eventsService } from '../../services/eventsService';
import { ticketsService } from '../../services/ticketsService';
import { colors, radius, spacing, typography } from '../../constants/theme';
import { Event, TicketTier } from '../../types';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [tiers, setTiers] = useState<TicketTier[]>([]);
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    eventsService.getEventById(id).then((data) => {
      if (data) {
        setEvent(data);
        const eventTiers = getMockTiersForEvent(data);
        setTiers(eventTiers);
        setSelectedTierId(eventTiers[0]?.id ?? null);
      }
      setLoading(false);
    });
  }, [id]);

  const selectedTier = tiers.find((t) => t.id === selectedTierId);
  const total = (selectedTier?.price ?? 0) * quantity;

  async function handleGetTickets() {
    if (!event || !selectedTier) return;
    setBooking(true);
    try {
      const ticket = await ticketsService.bookTicket({
        eventId: event.id,
        eventTitle: event.title,
        eventImage: event.image,
        tierName: selectedTier.name,
        quantity,
        dateLabel: event.dateLabel,
        time: event.time,
        venue: event.venue,
        attendeeName: user ? `${user.firstName} ${user.lastName}` : 'Guest',
      });
      // Skips the checkout/payment screens (not built yet) and goes
      // straight to the issued pass — good enough for today's demo.
      router.push(`/ticket/${ticket.id}/qr`);
    } finally {
      setBooking(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xxl }} />
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.notFound}>Event not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView>
        <View>
          <Image source={{ uri: event.image }} style={styles.hero} />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.heartButton} onPress={() => setSaved((s) => !s)}>
            <Ionicons name={saved ? 'heart' : 'heart-outline'} size={20} color={saved ? colors.error : colors.white} />
          </TouchableOpacity>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{event.category}</Text>
            </View>
            {!!event.seatsLeft && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>🎟 {event.seatsLeft} Seats Left</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>{event.title}</Text>
          {!!event.description && <Text style={styles.description}>{event.description}</Text>}

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color={colors.primary} />
            <View style={{ marginLeft: spacing.sm }}>
              <Text style={styles.infoPrimary}>{event.dateLabel}</Text>
              <Text style={styles.infoSecondary}>{event.time}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color={colors.primary} />
            <View style={{ marginLeft: spacing.sm, flex: 1 }}>
              <Text style={styles.infoPrimary}>{event.venue}</Text>
            </View>
          </View>

          {!!event.organizerName && (
            <View style={styles.infoRow}>
              <Ionicons name="person-circle-outline" size={18} color={colors.primary} />
              <Text style={[styles.infoPrimary, { marginLeft: spacing.sm }]}>
                Organized by {event.organizerName}
              </Text>
            </View>
          )}

          <Text style={styles.sectionHeader}>Select Pass Tier</Text>
          {tiers.map((tier) => {
            const isSelected = tier.id === selectedTierId;
            return (
              <TouchableOpacity
                key={tier.id}
                style={[styles.tierCard, isSelected && styles.tierCardSelected]}
                onPress={() => setSelectedTierId(tier.id)}
                activeOpacity={0.85}
              >
                <View style={styles.tierHeaderRow}>
                  <Text style={styles.tierName}>{tier.name}</Text>
                  <Text style={styles.tierPrice}>₦{tier.price.toLocaleString()}</Text>
                </View>
                <Text style={styles.tierPerks}>{tier.perks.join(' • ')}</Text>

                {isSelected && (
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
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Total Amount</Text>
          <Text style={styles.footerTotal}>₦{total.toLocaleString()}</Text>
        </View>
        <PrimaryButton
          title="Get Tickets"
          icon="arrow-forward"
          onPress={handleGetTickets}
          loading={booking}
          style={{ flex: 1, marginLeft: spacing.md }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  hero: { width: '100%', height: 260 },
  backButton: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: radius.pill,
    padding: spacing.xs + 2,
  },
  heartButton: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: radius.pill,
    padding: spacing.xs + 2,
  },
  badgeRow: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.md,
    flexDirection: 'row',
    gap: spacing.xs,
  },
  badge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  badgeText: { ...typography.small, color: colors.white },
  body: { padding: spacing.lg },
  title: { ...typography.h2, color: colors.text, marginBottom: spacing.xs },
  description: { ...typography.body, color: colors.textMuted, marginBottom: spacing.md },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  infoPrimary: { ...typography.bodyBold, color: colors.text },
  infoSecondary: { ...typography.caption, color: colors.textMuted },
  sectionHeader: { ...typography.h3, color: colors.text, marginTop: spacing.md, marginBottom: spacing.sm },
  tierCard: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  tierCardSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  tierHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  tierName: { ...typography.bodyBold, color: colors.text },
  tierPrice: { ...typography.bodyBold, color: colors.primary },
  tierPerks: { ...typography.caption, color: colors.textMuted },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  quantityLabel: { ...typography.caption, color: colors.textMuted },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  stepperButton: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  stepperValue: { ...typography.bodyBold, color: colors.text },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  footerLabel: { ...typography.caption, color: colors.textMuted },
  footerTotal: { ...typography.h3, color: colors.text },
  notFound: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xxl },
});