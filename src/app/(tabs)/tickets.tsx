import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
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
import { ticketsService } from '../../services/ticketsService';
import { colors, radius, spacing, typography } from '../../constants/theme';
import { Ticket, TicketStatus } from '../../types';

export default function TicketsScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<TicketStatus>('upcoming');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  // Refetch every time the tab is focused so a ticket booked on the
  // Event Detail screen shows up immediately without a manual refresh.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      ticketsService.getMyTickets().then((data) => {
        if (active) {
          setTickets(data);
          setLoading(false);
        }
      });
      return () => {
        active = false;
      };
    }, [])
  );

  const filtered = tickets.filter((t) => t.status === tab);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <Text style={styles.title}>Tickets</Text>

        <View style={styles.tabRow}>
          <TouchableOpacity style={styles.tabButton} onPress={() => setTab('upcoming')}>
            <Text style={[styles.tabText, tab === 'upcoming' && styles.tabTextActive]}>Upcoming</Text>
            {tab === 'upcoming' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabButton} onPress={() => setTab('past')}>
            <Text style={[styles.tabText, tab === 'past' && styles.tabTextActive]}>Past</Text>
            {tab === 'past' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : filtered.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>
              {tab === 'upcoming' ? "Your schedule's pretty open" : 'Nothing to see here'}
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={() => router.push('/(tabs)/discover')}>
              <Text style={styles.emptyButtonText}>Let&apos;s make plans</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {filtered.map((ticket) => (
              <TouchableOpacity
                key={ticket.id}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => router.push(`/ticket/${ticket.id}/qr`)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardDate}>{ticket.dateLabel}</Text>
                  <Text style={styles.cardTime}>{ticket.time}</Text>
                </View>
                <Text style={styles.cardTitle}>{ticket.eventTitle}</Text>
                <Text style={styles.cardVenue}>{ticket.venue}</Text>
                <Image source={{ uri: ticket.eventImage }} style={styles.cardImage} />
                <View style={styles.cardFooter}>
                  <Text style={styles.cardTier}>{ticket.tierName} × {ticket.quantity}</Text>
                  <Text style={styles.cardLink}>View QR Pass →</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.lg },
  title: { ...typography.h2, color: colors.text, marginBottom: spacing.md },
  tabRow: { flexDirection: 'row', gap: spacing.lg, marginBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  tabButton: { paddingBottom: spacing.sm },
  tabText: { ...typography.bodyBold, color: colors.textFaint },
  tabTextActive: { color: colors.text },
  tabIndicator: { height: 2, backgroundColor: colors.primary, marginTop: spacing.xs, borderRadius: 2 },
  emptyWrap: { alignItems: 'center', marginTop: spacing.xxl },
  emptyTitle: { ...typography.bodyBold, color: colors.textMuted, marginBottom: spacing.md },
  emptyButton: { backgroundColor: colors.text, borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  emptyButtonText: { ...typography.bodyBold, color: colors.white },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  cardDate: { ...typography.bodyBold, color: colors.text },
  cardTime: { ...typography.caption, color: colors.textMuted },
  cardTitle: { ...typography.h3, color: colors.text, marginBottom: 2 },
  cardVenue: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.sm },
  cardImage: { width: '100%', height: 120, borderRadius: radius.sm, marginBottom: spacing.sm },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTier: { ...typography.caption, color: colors.textMuted },
  cardLink: { ...typography.caption, color: colors.primary, fontWeight: '700' },
});