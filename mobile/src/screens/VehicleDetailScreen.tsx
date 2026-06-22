import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { MetricCard } from "../components/MetricCard";
import { StatusChip } from "../components/StatusChip";
import { useApp } from "../state/AppProvider";
import type { RootStackParamList } from "../../App";
import type { VehicleStatus } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "VehicleDetail">;

const statuses: VehicleStatus[] = ["MOVING", "STOPPED", "OFF_ROUTE", "MAINTENANCE"];

export function VehicleDetailScreen({ route }: Props) {
  const { vehicles, routes, updateVehicleStatus } = useApp();
  const vehicle = vehicles.find((item) => item.id === route.params.id);
  const activeRoute = routes.find((item) => item.vehicleId === vehicle?.id);

  if (!vehicle) {
    return <Text style={styles.empty}>Транспорт не найден</Text>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card mode="elevated" style={styles.card}>
        <Card.Title title={vehicle.plateNumber} subtitle={`${vehicle.model} - ${vehicle.driver}`} right={() => <StatusChip status={vehicle.status} />} />
      </Card>
      <View style={styles.row}>
        <MetricCard label="Скорость" value={`${vehicle.speed} км/ч`} />
        <MetricCard label="Топливо" value={`${vehicle.fuel}%`} tone="success" />
      </View>
      <Card mode="elevated" style={styles.card}>
        <Card.Title title="Активный маршрут" subtitle={activeRoute?.name ?? "Не назначен"} />
        <Card.Content>
          <Text>{activeRoute ? `${activeRoute.startPoint} -> ${activeRoute.endPoint}` : "Назначьте маршрут на экране маршрутов"}</Text>
        </Card.Content>
      </Card>
      <Card mode="elevated" style={styles.card}>
        <Card.Title title="Изменить статус" />
        <Card.Content style={styles.actions}>
          {statuses.map((status) => (
            <Button key={status} mode={vehicle.status === status ? "contained" : "outlined"} onPress={() => updateVehicleStatus(vehicle.id, status)}>
              {status}
            </Button>
          ))}
        </Card.Content>
      </Card>
      <Card mode="elevated" style={styles.card}>
        <Card.Title title="Чат диспетчера" />
        <Card.Content>
          <Text>Диспетчер: подтвердите ETA.</Text>
          <Text>{vehicle.driver}: маршрут контролирую, связь есть.</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FBFF" },
  content: { padding: 16, gap: 12 },
  card: { borderRadius: 20 },
  row: { flexDirection: "row", gap: 12 },
  actions: { gap: 8 },
  empty: { padding: 24 }
});
