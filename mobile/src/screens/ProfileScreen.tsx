import { ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Button, Card, List, Switch, Text } from "react-native-paper";
import { MetricCard } from "../components/MetricCard";
import { useApp } from "../state/AppProvider";

const roleLabels = {
  USER: "Пользователь",
  DISPATCHER: "Диспетчер",
  LOGIST: "Логист",
  ADMIN: "Администратор",
  MANAGER: "Руководитель",
  DRIVER: "Водитель"
};

export function ProfileScreen() {
  const { user, vehicles, routes, logout, isOnline } = useApp();

  if (!user) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card mode="elevated" style={styles.profile}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text size={64} label={user.fullName.split(" ").slice(0, 2).map((part) => part[0]).join("")} />
          <View style={styles.profileText}>
            <Text variant="titleLarge">{user.fullName}</Text>
            <Text>{roleLabels[user.role]}</Text>
            <Text style={styles.muted}>{user.company}</Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.row}>
        <MetricCard label="Транспорт" value={vehicles.length} />
        <MetricCard label="Маршруты" value={routes.length} tone="success" />
      </View>

      <Card mode="elevated" style={styles.card}>
        <List.Item title="JWT-аутентификация" description={user.token.slice(0, 24)} />
        <List.Item title="Оффлайн-кэш" description={isOnline ? "Готов к работе без интернета" : "Используется локальный кэш"} right={() => <Switch value />} />
        <List.Item title="Роли и доступ" description="USER, ADMIN и логистические роли" />
      </Card>

      <Button mode="outlined" textColor="#EF4444" onPress={logout} style={styles.logout}>
        Выйти
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FBFF" },
  content: { padding: 16, gap: 12 },
  profile: { borderRadius: 24 },
  profileContent: { flexDirection: "row", alignItems: "center", gap: 16 },
  profileText: { flex: 1 },
  muted: { color: "#6B7280" },
  row: { flexDirection: "row", gap: 12 },
  card: { borderRadius: 20 },
  logout: { borderRadius: 12, borderColor: "#EF4444" }
});
