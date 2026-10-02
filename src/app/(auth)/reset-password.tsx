import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../../constants/theme';

export default function ResetPasswordScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Reset Password — coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  text: { ...typography.body, color: colors.textMuted },
});