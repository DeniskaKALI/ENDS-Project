import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";

interface MetricCardProps {
  label: string;
  value: string | number;
  tone?: "primary" | "success" | "warning" | "danger";
}

const colors = {
  primary: "#4DA6FF",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444"
};

export function MetricCard({ label, value, tone = "primary" }: MetricCardProps) {
  return (
    <Card mode="elevated" style={styles.card}>
      <Card.Content>
        <View style={[styles.dot, { backgroundColor: colors[tone] }]} />
        <Text variant="labelMedium" style={styles.label}>
          {label}
        </Text>
        <Text variant="headlineSmall" style={styles.value}>
          {value}
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minHeight: 104, borderRadius: 20 },
  dot: { width: 10, height: 10, borderRadius: 5, marginBottom: 8 },
  label: { color: "#6B7280" },
  value: { color: "#1F2937", fontWeight: "700", marginTop: 4 }
});
