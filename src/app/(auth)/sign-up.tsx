import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthContext';
import { mockAuth } from '../../mocks/mockAuth';
import { colors, spacing, typography } from '../../constants/theme';

export default function SignUpScreen() {
  const { setSession } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCreateAccount() {
    setError('');
    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in every field.');
      return;
    }
    if (!agreed) {
      setError('Please agree to the Terms & Conditions.');
      return;
    }
    setLoading(true);
    try {
      await mockAuth.signUp({ firstName, lastName, email, password });
      // NOTE: the real flow routes to an OTP step (verify-account) before
      // issuing a session. That screen isn't wired up yet, so for today's
      // demo we sign the user in immediately after "sign up."
      const session = await mockAuth.verifyAccount(email, '000000');
      session.user.firstName = firstName;
      session.user.lastName = lastName;
      session.user.avatarInitials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
      await setSession(session);
    } catch (e: any) {
      setError(e?.message || 'Could not create account.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join Eventra and start exploring amazing events.</Text>

        <View style={styles.nameRow}>
          <View style={{ flex: 1 }}>
            <InputField label="First Name" value={firstName} onChangeText={setFirstName} placeholder="John" />
          </View>
          <View style={{ flex: 1 }}>
            <InputField label="Last Name" value={lastName} onChangeText={setLastName} placeholder="Doe" />
          </View>
        </View>

        <InputField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="john@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <InputField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="secretpassword"
          secureTextEntry
        />

        <Pressable style={styles.agreeRow} onPress={() => setAgreed((a) => !a)}>
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed && <Ionicons name="checkmark" size={12} color={colors.white} />}
          </View>
          <Text style={styles.agreeText}>I agree to the Terms & Conditions</Text>
        </Pressable>

        {!!error && <Text style={styles.error}>{error}</Text>}

        <PrimaryButton
          title="Create Account"
          onPress={handleCreateAccount}
          loading={loading}
          style={{ marginTop: spacing.md }}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/sign-in" asChild>
            <TouchableOpacity>
              <Text style={styles.link}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, paddingTop: spacing.xl },
  title: { ...typography.h1, color: colors.text, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textMuted, marginBottom: spacing.lg },
  nameRow: { flexDirection: 'row', gap: spacing.md },
  agreeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  },
  checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  agreeText: { ...typography.caption, color: colors.textMuted },
  error: { ...typography.caption, color: colors.error, marginBottom: spacing.sm },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  footerText: { ...typography.body, color: colors.textMuted },
  link: { ...typography.bodyBold, color: colors.primary },
});