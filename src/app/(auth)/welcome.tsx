// src/app/(auth)/welcome.tsx
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../../constants/theme';

// Placeholder crowd/concert photo — swap for a licensed asset before shipping.
const BG_IMAGE = 'https://picsum.photos/seed/eventra-concert/900/1600';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground source={{ uri: BG_IMAGE }} style={styles.bg} resizeMode="cover">
      <LinearGradient
        colors={['rgba(30,10,60,0.35)', 'rgba(20,8,50,0.75)', 'rgba(10,4,30,0.95)']}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.logoWrap}>
          <Text style={styles.logo}>🎟️ Eventra</Text>
          <Text style={styles.tagline}>Discover. Book. Experience.</Text>
        </View>

        <View style={styles.bottom}>
          <Text style={styles.headline}>Find amazing events in your city and beyond.</Text>

          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={() => router.push('/(auth)/sign-up')}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.85}
            onPress={() => router.push('/(auth)/sign-in')}
          >
            <Text style={styles.secondaryButtonText}>Sign In</Text>
          </TouchableOpacity>

          <View style={styles.pagerDot} />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.black },
  safe: { flex: 1, justifyContent: 'space-between', padding: spacing.lg },
  logoWrap: { alignItems: 'center', marginTop: spacing.xxl },
  logo: { ...typography.h2, color: colors.white, fontWeight: '700' },
  tagline: { ...typography.caption, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  bottom: { alignItems: 'center', paddingBottom: spacing.md },
  headline: {
    ...typography.h2,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 32,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 6,
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  primaryButtonText: { ...typography.bodyBold, color: colors.white },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 6,
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  secondaryButtonText: { ...typography.bodyBold, color: colors.white },
  pagerDot: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
});