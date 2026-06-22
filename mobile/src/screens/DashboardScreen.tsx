import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, List, Text } from "react-native-paper";
import { MetricCard } from "../components/MetricCard";
import { useApp } from "../state/AppProvider";

export function DashboardScreen() {
  const { vehicles, routes, alerts, isOnline, lastSync, refresh, markAlertsRead } = useApp();
  const moving = vehicles.filter((item) => item.status === "MOVING").length;
  const offRoute = vehicles.filter((item) => item.status === "OFF_ROUTE").length;
  const activeRoutes = routes.filter((item) => item.status === "ACTIVE").length;
  const completedRoutes = routes.filter((item) => item.status === "COMPLETED").length;
  const avgSpeed = Math.round(vehicles.reduce((sum, item) => sum + item.speed, 0) / Math.max(vehicles.length, 1));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} />}
    >
      <Card mode="contained" style={[styles.banner, { backgroundColor: isOnline ? "#D1FAE5" : "#FEF3C7" }]}>
        <Card.Content>
          <Text variant="titleMedium">{isOnline ? "Онлайн" : "Оффлайн режим"}</Text>
          <Text variant="bodySmall">Последняя синхронизация: {lastSync}</Text>
        </Card.Content>
      </Card>

      <View style={styles.row}>
        <MetricCard label="В движении" value={moving} tone="success" />
        <MetricCard label="Вне маршрута" value={offRoute} tone="danger" />
      </View>
      <View style={styles.row}>
        <MetricCard label="Активные маршруты" value={activeRoutes} />
        <MetricCard label="Завершено" value={completedRoutes} tone="success" />
      </View>
      <View style={styles.row}>
        <MetricCard label="Средняя скорость" value={`${avgSpeed} км/ч`} />
        <MetricCard label="Уведомления" value={alerts.filter((item) => !item.read).length} tone="warning" />
      </View>

      <Card mode="elevated" style={styles.card}>
        <Card.Title title="Карта транспорта" subtitle="Схема live-мониторинга" />
        <Card.Content>
          <View style={styles.map}>
            <View style={[styles.point, { left: "22%", top: "30%" }]} />
            <View style={[styles.point, { left: "60%", top: "55%", backgroundColor: "#EF4444" }]} />
            <View style={[styles.point, { left: "75%", top: "24%" }]} />
          </View>
        </Card.Content>
      </Card>

      <Card mode="elevated" style={styles.card}>
        <Card.Title title="Уведомления" right={() => <Button onPress={markAlertsRead}>Прочитано</Button>} />
        {alerts.map((alert) => (
          <List.Item key={alert.id} title={alert.title} description={alert.message} />
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FBFF" },
  content: { padding: 16, gap: 12 },
  row: { flexDirection: "row", gap: 12 },
  banner: { borderRadius: 20 },
  card: { borderRadius: 20 },
  map: { height: 180, borderRadius: 20, backgroundColor: "#DDEFFF", overflow: "hidden" },
  point: { position: "absolute", width: 18, height: 18, borderRadius: 9, backgroundColor: "#22C55E", borderWidth: 3, borderColor: "white" }
});
