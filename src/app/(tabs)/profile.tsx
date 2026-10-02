import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors, radius, spacing, typography } from '../../constants/theme';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.name}>{user ? `${user.firstName} ${user.lastName}` : 'Profile'}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, padding: spacing.lg },
  name: { ...typography.h3, color: colors.text },
  email: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.lg },
  signOutButton: { backgroundColor: colors.error, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  signOutText: { ...typography.bodyBold, color: colors.white },
});