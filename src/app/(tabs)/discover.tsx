import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EventCard from '../../components/EventCard';
import { eventsService } from '../../services/eventsService';
import { colors, radius, spacing, typography } from '../../constants/theme';
import { Event } from '../../types';

export default function DiscoverScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    eventsService.getEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  const filtered = events.filter((e) =>
    e.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <Text style={styles.title}>Discover Events</Text>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textFaint} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search events..."
            placeholderTextColor={colors.textFaint}
          />
        </View>

        <View style={styles.chipsRow}>
          <View style={[styles.chip, styles.chipActive]}>
            <Text style={styles.chipTextActive}>📍 Lagos</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>Date</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>Category</Text>
          </View>
        </View>

        <Text style={styles.resultCount}>{filtered.length} events found</Text>

        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} onPress={() => router.push(`/event/${event.id}`)} />
            ))}
            {filtered.length === 0 && (
              <Text style={styles.empty}>No events match &quot;{query}&quot;.</Text>
            )}
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  searchInput: { flex: 1, paddingVertical: spacing.sm + 2, ...typography.body, color: colors.text },
  chipsRow: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.sm },
  chip: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  chipText: { ...typography.caption, color: colors.textMuted },
  chipTextActive: { ...typography.caption, color: colors.primaryDark, fontWeight: '700' },
  resultCount: { ...typography.caption, color: colors.textFaint, marginBottom: spacing.sm },
  empty: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});