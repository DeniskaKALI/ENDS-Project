import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, FAB, Modal, Portal, Searchbar, TextInput } from "react-native-paper";
import { StatusChip } from "../components/StatusChip";
import { useApp } from "../state/AppProvider";
import type { RootStackParamList } from "../../App";
import type { Vehicle, VehicleStatus } from "../types";

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const emptyVehicle = {
  plateNumber: "",
  model: "",
  driver: "",
  type: "Грузовой",
  status: "MOVING" as VehicleStatus,
  speed: 0,
  fuel: 70
};

export function TransportScreen() {
  const navigation = useNavigation<Navigation>();
  const { vehicles, saveVehicle, deleteVehicle } = useApp();
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | undefined>();
  const [form, setForm] = useState(emptyVehicle);

  const filtered = useMemo(() => {
    const value = query.toLowerCase();
    return vehicles.filter((item) =>
      [item.plateNumber, item.model, item.driver].some((field) => field.toLowerCase().includes(value))
    );
  }, [query, vehicles]);

  const openForm = (vehicle?: Vehicle) => {
    setEditingId(vehicle?.id);
    setForm(vehicle ? {
      plateNumber: vehicle.plateNumber,
      model: vehicle.model,
      driver: vehicle.driver,
      type: vehicle.type,
      status: vehicle.status,
      speed: vehicle.speed,
      fuel: vehicle.fuel
    } : emptyVehicle);
    setVisible(true);
  };

  const submit = async () => {
    await saveVehicle({ id: editingId, ...form });
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <Searchbar placeholder="Поиск по номеру, модели, водителю" value={query} onChangeText={setQuery} style={styles.search} />
      <ScrollView contentContainerStyle={styles.list}>
        {filtered.map((vehicle) => (
          <Card key={vehicle.id} mode="elevated" style={styles.card} onPress={() => navigation.navigate("VehicleDetail", { id: vehicle.id })}>
            <Card.Title title={vehicle.plateNumber} subtitle={`${vehicle.model} - ${vehicle.driver}`} right={() => <StatusChip status={vehicle.status} />} />
            <Card.Content>
              <View style={styles.stats}>
                <Button compact>Скорость {vehicle.speed} км/ч</Button>
                <Button compact>Топливо {vehicle.fuel}%</Button>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => openForm(vehicle)}>Изменить</Button>
              <Button textColor="#EF4444" onPress={() => deleteVehicle(vehicle.id)}>Удалить</Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>

      <FAB icon="plus" label="ТС" style={styles.fab} onPress={() => openForm()} />

      <Portal>
        <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={styles.modal}>
          <TextInput label="Госномер" value={form.plateNumber} onChangeText={(value) => setForm((current) => ({ ...current, plateNumber: value }))} style={styles.input} />
          <TextInput label="Модель" value={form.model} onChangeText={(value) => setForm((current) => ({ ...current, model: value }))} style={styles.input} />
          <TextInput label="Водитель" value={form.driver} onChangeText={(value) => setForm((current) => ({ ...current, driver: value }))} style={styles.input} />
          <TextInput label="Тип" value={form.type} onChangeText={(value) => setForm((current) => ({ ...current, type: value }))} style={styles.input} />
          <TextInput label="Скорость" value={String(form.speed)} keyboardType="numeric" onChangeText={(value) => setForm((current) => ({ ...current, speed: Number(value) || 0 }))} style={styles.input} />
          <Button mode="contained" onPress={submit}>{editingId ? "Сохранить" : "Добавить"}</Button>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FBFF" },
  search: { margin: 16, borderRadius: 16 },
  list: { paddingHorizontal: 16, paddingBottom: 96, gap: 12 },
  card: { borderRadius: 20 },
  stats: { flexDirection: "row", justifyContent: "space-between" },
  fab: { position: "absolute", right: 16, bottom: 20, borderRadius: 18 },
  modal: { margin: 16, borderRadius: 24, backgroundColor: "white", padding: 16 },
  input: { marginBottom: 10, backgroundColor: "white" }
});
