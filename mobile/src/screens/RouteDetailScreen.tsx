import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView, StyleSheet } from "react-native";
import { Button, Card, ProgressBar, Text } from "react-native-paper";
import { StatusChip } from "../components/StatusChip";
import { useApp } from "../state/AppProvider";
import type { RootStackParamList } from "../../App";
import type { RouteStatus } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "RouteDetail">;

const statuses: RouteStatus[] = ["PLANNED", "ACTIVE", "COMPLETED"];

export function RouteDetailScreen({ route }: Props) {
  const { routes, vehicles, updateRouteStatus } = useApp();
  const plan = routes.find((item) => item.id === route.params.id);
  const vehicle = vehicles.find((item) => item.id === plan?.vehicleId);

  if (!plan) {
    return <Text style={styles.empty}>Маршрут не найден</Text>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card mode="elevated" style={styles.card}>
        <Card.Title title={plan.name} subtitle={vehicle?.plateNumber ?? "Транспорт не назначен"} right={() => <StatusChip status={plan.status} />} />
        <Card.Content>
          <Text>{plan.startPoint}</Text>
          <Text>{plan.endPoint}</Text>
          <Text>ETA: {plan.eta}</Text>
          <ProgressBar progress={plan.progress / 100} style={styles.progress} />
          <Text>{plan.progress}% выполнено</Text>
        </Card.Content>
      </Card>
      <Card mode="elevated" style={styles.card}>
        <Card.Title title="Контрольные точки" />
        <Card.Content>
          <Text>1. Старт - пройдена</Text>
          <Text>2. Промежуточная точка - текущая</Text>
          <Text>3. Финиш - ожидается</Text>
        </Card.Content>
      </Card>
      <Card mode="elevated" style={styles.card}>
        <Card.Title title="Изменить статус" />
        <Card.Content style={styles.actions}>
          {statuses.map((status) => (
            <Button key={status} mode={plan.status === status ? "contained" : "outlined"} onPress={() => updateRouteStatus(plan.id, status)}>
              {status}
            </Button>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FBFF" },
  content: { padding: 16, gap: 12 },
  card: { borderRadius: 20 },
  progress: { marginVertical: 12, height: 8, borderRadius: 8 },
  actions: { gap: 8 },
  empty: { padding: 24 }
});
