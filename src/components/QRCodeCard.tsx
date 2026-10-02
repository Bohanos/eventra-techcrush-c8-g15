import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "../constants/theme";

interface QRCodeCardProps {
  qrCodeUrl: string | null;
  ticketCode: string;
  size?: number;
}

export default function QRCodeCard({
  qrCodeUrl,
  ticketCode,
  size = 200,
}: QRCodeCardProps) {
  return (
    <View style={styles.card}>
      {qrCodeUrl ? (
        <Image
          source={{ uri: qrCodeUrl }}
          style={{ width: size, height: size }}
          resizeMode="contain"
        />
      ) : (
        <View style={[styles.placeholder, { width: size, height: size }]}>
          <Ionicons name="qr-code-outline" size={48} color={colors.textFaint} />
          <Text style={styles.placeholderText}>
            QR code pending — connects during payment integration
          </Text>
        </View>
      )}
      <Text style={styles.code}>{ticketCode}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    padding: spacing.md,
  },
  placeholderText: {
    ...typography.small,
    color: colors.textFaint,
    textAlign: "center",
    marginTop: spacing.xs,
  },
  code: { ...typography.bodyBold, color: colors.text, marginTop: spacing.sm },
});
