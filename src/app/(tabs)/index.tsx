import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
import EventCard from '../../components/EventCard';
import { useAuth } from '../../context/AuthContext';
import { eventsService } from '../../services/eventsService';
import { colors, radius, spacing, typography } from '../../constants/theme';
import { Event } from '../../types';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventsService.getEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  const featured = events[0];
  const rest = events.slice(1);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>🎟️ Eventra</Text>
          <View style={styles.headerRight}>
            <Ionicons name="location-outline" size={16} color={colors.textMuted} />
            <Text style={styles.city}>Lagos</Text>
            <TouchableOpacity style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.avatarInitials ?? 'JD'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/(tabs)/discover')}>
          <Ionicons name="search" size={18} color={colors.textFaint} />
          <Text style={styles.searchPlaceholder}>Search events, artists, venues...</Text>
        </TouchableOpacity>

        <View style={styles.vibeBanner}>
          <Text style={styles.vibeTitle}>✨ VIBE PROFILE ACTIVE</Text>
          <Text style={styles.vibeText}>
            Welcome, {user?.firstName ?? 'there'}! Curated directly for your interests. Early bird access is live!
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : (
          <>
            {featured && (
              <TouchableOpacity
                style={styles.featuredCard}
                activeOpacity={0.9}
                onPress={() => router.push(`/event/${featured.id}`)}
              >
                <Image source={{ uri: featured.image }} style={styles.featuredImage} />
                <View style={styles.featuredBody}>
                  <Text style={styles.featuredTitle}>{featured.title}</Text>
                  <Text style={styles.featuredMeta}>{featured.venue}</Text>
                  <Text style={styles.featuredMeta}>{featured.dateLabel} • {featured.time}</Text>
                  <Text style={styles.featuredPrice}>From ₦{featured.priceFrom.toLocaleString()}</Text>
                </View>
              </TouchableOpacity>
            )}

            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeader}>Trending in Lagos</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/discover')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            {rest.map((event) => (
              <EventCard key={event.id} event={event} onPress={() => router.push(`/event/${event.id}`)} />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, paddingBottom: spacing.xxl },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logo: { ...typography.h3, color: colors.primary },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  city: { ...typography.caption, color: colors.textMuted, marginRight: spacing.sm },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { ...typography.small, color: colors.white, fontWeight: '700' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  searchPlaceholder: { ...typography.body, color: colors.textFaint },
  vibeBanner: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  vibeTitle: { ...typography.caption, color: colors.primaryDark, marginBottom: 4, fontWeight: '700' },
  vibeText: { ...typography.caption, color: colors.text },
  featuredCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featuredImage: { width: '100%', height: 180 },
  featuredBody: { padding: spacing.md },
  featuredTitle: { ...typography.h3, color: colors.text, marginBottom: 4 },
  featuredMeta: { ...typography.caption, color: colors.textMuted },
  featuredPrice: { ...typography.bodyBold, color: colors.primary, marginTop: spacing.xs },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionHeader: { ...typography.h3, color: colors.text },
  seeAll: { ...typography.caption, color: colors.primary },
});