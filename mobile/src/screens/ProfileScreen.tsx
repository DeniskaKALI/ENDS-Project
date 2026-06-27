import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Button, Card, List, Modal, Portal, RadioButton, Switch, Text, TextInput } from "react-native-paper";
import { MetricCard } from "../components/MetricCard";
import { useApp } from "../state/AppProvider";
import type { RoleName } from "../types";

const roleLabels = {
  USER: "Пользователь",
  DISPATCHER: "Диспетчер",
  LOGIST: "Логист",
  ADMIN: "Администратор",
  MANAGER: "Руководитель",
  DRIVER: "Водитель"
};

export function ProfileScreen() {
  const { user, vehicles, routes, logout, isOnline, updateProfile, changePassword } = useApp();
  const [editVisible, setEditVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [company, setCompany] = useState(user?.company ?? "");
  const [role, setRole] = useState<RoleName>(user?.role ?? "USER");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  if (!user) return null;

  const openProfileEditor = () => {
    setFullName(user.fullName);
    setCompany(user.company);
    setRole(user.role);
    setEditVisible(true);
  };

  const submitProfile = async () => {
    await updateProfile({ fullName, company, role });
    setEditVisible(false);
  };

  const submitPassword = async () => {
    await changePassword(currentPassword, newPassword);
    setCurrentPassword("");
    setNewPassword("");
    setPasswordVisible(false);
  };

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

      <View style={styles.actions}>
        <Button mode="contained-tonal" onPress={openProfileEditor} style={styles.actionButton}>
          Редактировать
        </Button>
        <Button mode="contained-tonal" onPress={() => setPasswordVisible(true)} style={styles.actionButton}>
          Пароль
        </Button>
      </View>

      <Button mode="outlined" textColor="#EF4444" onPress={logout} style={styles.logout}>
        Выйти
      </Button>

      <Portal>
        <Modal visible={editVisible} onDismiss={() => setEditVisible(false)} contentContainerStyle={styles.modal}>
          <Text variant="titleMedium" style={styles.modalTitle}>Профиль</Text>
          <TextInput label="ФИО" value={fullName} onChangeText={setFullName} style={styles.input} />
          <TextInput label="Компания" value={company} onChangeText={setCompany} style={styles.input} />
          <RadioButton.Group value={role} onValueChange={(value) => setRole(value as RoleName)}>
            {Object.entries(roleLabels).map(([value, label]) => (
              <RadioButton.Item key={value} label={label} value={value} />
            ))}
          </RadioButton.Group>
          <Button mode="contained" onPress={submitProfile} style={styles.saveButton}>Сохранить</Button>
        </Modal>

        <Modal visible={passwordVisible} onDismiss={() => setPasswordVisible(false)} contentContainerStyle={styles.modal}>
          <Text variant="titleMedium" style={styles.modalTitle}>Смена пароля</Text>
          <TextInput label="Текущий пароль" value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry style={styles.input} />
          <TextInput label="Новый пароль" value={newPassword} onChangeText={setNewPassword} secureTextEntry style={styles.input} />
          <Button mode="contained" onPress={submitPassword} style={styles.saveButton}>Изменить пароль</Button>
        </Modal>
      </Portal>
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
  actions: { flexDirection: "row", gap: 12 },
  actionButton: { flex: 1, borderRadius: 12 },
  modal: { margin: 16, borderRadius: 24, backgroundColor: "white", padding: 16 },
  modalTitle: { marginBottom: 12 },
  input: { marginBottom: 12, backgroundColor: "white" },
  saveButton: { marginTop: 8, borderRadius: 12 },
  logout: { borderRadius: 12, borderColor: "#EF4444" }
});
