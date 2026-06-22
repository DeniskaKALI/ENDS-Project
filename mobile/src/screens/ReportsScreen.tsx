import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, DataTable, Text } from "react-native-paper";
import { MetricCard } from "../components/MetricCard";
import { useApp } from "../state/AppProvider";

export function ReportsScreen() {
  const { vehicles, routes, isOnline } = useApp();
  const completed = routes.filter((item) => item.status === "COMPLETED").length;
  const active = routes.filter((item) => item.status === "ACTIVE").length;
  const avgSpeed = Math.round(vehicles.reduce((sum, item) => sum + item.speed, 0) / Math.max(vehicles.length, 1));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.row}>
        <MetricCard label="В работе" value={active} />
        <MetricCard label="Завершено" value={completed} tone="success" />
      </View>
      <View style={styles.row}>
        <MetricCard label="Средняя скорость" value={`${avgSpeed} км/ч`} />
        <MetricCard label="Режим" value={isOnline ? "Online" : "Cache"} tone={isOnline ? "success" : "warning"} />
      </View>

      <Card mode="elevated" style={styles.card}>
        <Card.Title title="Экспорт отчётов" subtitle="PDF, Excel, CSV через REST API" />
        <Card.Content style={styles.actions}>
          <Button mode="outlined">PDF</Button>
          <Button mode="outlined">Excel</Button>
          <Button mode="outlined">CSV</Button>
        </Card.Content>
      </Card>

      <Card mode="elevated" style={styles.card}>
        <Card.Title title="REST API покрытие" subtitle="8+ endpoints + OpenAPI" />
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Метод</DataTable.Title>
            <DataTable.Title>Endpoint</DataTable.Title>
          </DataTable.Header>
          {[
            ["POST", "/api/auth/login"],
            ["POST", "/api/auth/register"],
            ["GET", "/api/entities"],
            ["GET", "/api/entities/{id}"],
            ["POST", "/api/entities"],
            ["PUT", "/api/entities/{id}"],
            ["DELETE", "/api/entities/{id}"],
            ["GET", "/api/entities/search"]
          ].map(([method, path]) => (
            <DataTable.Row key={path}>
              <DataTable.Cell><Text>{method}</Text></DataTable.Cell>
              <DataTable.Cell><Text>{path}</Text></DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FBFF" },
  content: { padding: 16, gap: 12 },
  row: { flexDirection: "row", gap: 12 },
  card: { borderRadius: 20 },
  actions: { flexDirection: "row", gap: 8 }
});
