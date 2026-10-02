import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCodeCard from '../../../components/QRCodeCard';
import { ticketsService } from '../../../services/ticketsService';
import { colors, radius, spacing, typography } from '../../../constants/theme';
import { Ticket } from '../../../types';

export default function TicketQRScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    ticketsService.getTicketById(id).then((data) => {
      setTicket(data ?? null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xxl }} />
      </SafeAreaView>
    );
  }

  if (!ticket) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.notFound}>Ticket not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Alert.alert('Share', 'Sharing the digital pass...')}>
          <Ionicons name="share-outline" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.statusRow}>
            <View style={styles.activeDot} />
            <Text style={styles.activeText}>ACTIVE PASS</Text>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>VERIFIED</Text>
            </View>
          </View>
          <Text style={styles.eventTitle}>{ticket.eventTitle}</Text>
          <Text style={styles.eventVenue}>{ticket.venue}</Text>
        </View>

        <QRCodeCard value={ticket.qrValue} />

        <Text style={styles.qrRef}>{ticket.qrValue}</Text>
        <Text style={styles.qrHint}>Tap to brighten screen for entry scanning</Text>

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>ATTENDEE</Text>
            <Text style={styles.detailValue}>{ticket.attendeeName}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>TICKET TIER</Text>
            <Text style={styles.detailValue}>{ticket.tierName} × {ticket.quantity}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>DATE</Text>
            <Text style={styles.detailValue}>{ticket.dateLabel}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>TIME</Text>
            <Text style={styles.detailValue}>{ticket.time}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>GATE / ENTRY</Text>
            <Text style={styles.detailValue}>{ticket.gate}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>SEAT / AREA</Text>
            <Text style={styles.detailValue}>{ticket.seatArea}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.walletButton}
          onPress={() => Alert.alert('Saved', 'Pass saved to device wallet (demo).')}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  container: { padding: spacing.lg, alignItems: 'center' },
  header: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.md,
    width: '100%',
    marginBottom: spacing.lg,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  activeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#4ADE80', marginRight: spacing.xs },
  activeText: { ...typography.small, color: colors.white, fontWeight: '700', flex: 1 },
  verifiedBadge: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  verifiedText: { ...typography.small, color: colors.white, fontWeight: '700' },
  eventTitle: { ...typography.h3, color: colors.white, marginBottom: 2 },
  eventVenue: { ...typography.caption, color: 'rgba(255,255,255,0.85)' },
  qrRef: { ...typography.bodyBold, color: colors.text, marginTop: spacing.md },
  qrHint: { ...typography.caption, color: colors.textFaint, marginBottom: spacing.lg },
  detailsGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  detailItem: { width: '50%', marginBottom: spacing.sm },
  detailLabel: { ...typography.small, color: colors.textFaint, marginBottom: 2 },
  detailValue: { ...typography.bodyBold, color: colors.text },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.text,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 6,
    width: '100%',
  },
  walletButtonText: { ...typography.bodyBold, color: colors.white },
  notFound: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xxl },
});