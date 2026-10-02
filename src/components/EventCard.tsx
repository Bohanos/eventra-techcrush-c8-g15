import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

export default function EventCard({ event, onPress }: EventCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: event.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.category}>{event.category}</Text>
        <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
        <Text style={styles.meta}>{event.venue}</Text>
        <Text style={styles.meta}>{event.dateLabel} • {event.time}</Text>
        <Text style={styles.price}>From ₦{event.priceFrom.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: { width: 96, height: 112 },
  info: { flex: 1, padding: spacing.sm + 4, justifyContent: 'center' },
  category: { ...typography.small, color: colors.primary, marginBottom: 2 },
  title: { ...typography.bodyBold, color: colors.text, marginBottom: 2 },
  meta: { ...typography.caption, color: colors.textMuted },
  price: { ...typography.bodyBold, color: colors.text, marginTop: spacing.xs },
});