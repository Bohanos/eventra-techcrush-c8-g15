import React from 'react';
import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { colors, radius, spacing } from '../constants/theme';

interface QRCodeCardProps {
  value: string;
  size?: number;
}

export default function QRCodeCard({ value, size = 200 }: QRCodeCardProps) {
  return (
    <View style={styles.card}>
      <QRCode value={value} size={size} color={colors.text} backgroundColor={colors.white} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});