import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, FAB, Modal, Portal, SegmentedButtons, TextInput } from "react-native-paper";
import { StatusChip } from "../components/StatusChip";
import { useApp } from "../state/AppProvider";
import type { RootStackParamList } from "../../App";
import type { RoutePlan, RouteStatus } from "../types";

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const emptyRoute = {
  name: "",
  startPoint: "",
  endPoint: "",
  status: "PLANNED" as RouteStatus,
  eta: "",
  progress: 0,
  vehicleId: undefined as number | undefined
};

export function RoutesScreen() {
  const navigation = useNavigation<Navigation>();
  const { routes, saveRoute, deleteRoute } = useApp();
  const [filter, setFilter] = useState("ACTIVE");
  const [visible, setVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | undefined>();
  const [form, setForm] = useState(emptyRoute);

  const filtered = filter === "ALL" ? routes : routes.filter((item) => item.status === filter);

  const openForm = (route?: RoutePlan) => {
    setEditingId(route?.id);
    setForm(route ? {
      name: route.name,
      startPoint: route.startPoint,
      endPoint: route.endPoint,
      status: route.status,
      eta: route.eta,
      progress: route.progress,
      vehicleId: route.vehicleId
    } : emptyRoute);
    setVisible(true);
  };

  const submit = async () => {
    await saveRoute({ id: editingId, ...form });
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={filter}
        onValueChange={setFilter}
        style={styles.filters}
        buttons={[
          { value: "ALL", label: "Все" },
          { value: "ACTIVE", label: "Актив" },
          { value: "PLANNED", label: "План" },
          { value: "COMPLETED", label: "Готово" }
        ]}
      />
      <ScrollView contentContainerStyle={styles.list}>
        {filtered.map((route) => (
          <Card key={route.id} mode="elevated" style={styles.card} onPress={() => navigation.navigate("RouteDetail", { id: route.id })}>
            <Card.Title title={route.name} subtitle={`${route.startPoint} -> ${route.endPoint}`} right={() => <StatusChip status={route.status} />} />
            <Card.Content>
              <Button compact>Прогресс {route.progress}%</Button>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => openForm(route)}>Изменить</Button>
              <Button textColor="#EF4444" onPress={() => deleteRoute(route.id)}>Удалить</Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>
      <FAB icon="plus" label="Маршрут" style={styles.fab} onPress={() => openForm()} />
      <Portal>
        <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={styles.modal}>
          <TextInput label="Название" value={form.name} onChangeText={(value) => setForm((current) => ({ ...current, name: value }))} style={styles.input} />
          <TextInput label="Старт" value={form.startPoint} onChangeText={(value) => setForm((current) => ({ ...current, startPoint: value }))} style={styles.input} />
          <TextInput label="Финиш" value={form.endPoint} onChangeText={(value) => setForm((current) => ({ ...current, endPoint: value }))} style={styles.input} />
          <TextInput label="ETA" value={form.eta} onChangeText={(value) => setForm((current) => ({ ...current, eta: value }))} style={styles.input} />
          <Button mode="contained" onPress={submit}>{editingId ? "Сохранить" : "Создать"}</Button>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FBFF" },
  filters: { margin: 16 },
  list: { paddingHorizontal: 16, paddingBottom: 96, gap: 12 },
  card: { borderRadius: 20 },
  fab: { position: "absolute", right: 16, bottom: 20, borderRadius: 18 },
  modal: { margin: 16, borderRadius: 24, backgroundColor: "white", padding: 16 },
  input: { marginBottom: 10, backgroundColor: "white" }
});
