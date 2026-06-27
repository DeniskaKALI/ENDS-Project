import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Card, RadioButton, Text, TextInput } from "react-native-paper";
import { useApp } from "../state/AppProvider";
import type { RoleName } from "../types";

const roles: Array<{ value: RoleName; label: string }> = [
  { value: "USER", label: "Пользователь" },
  { value: "DISPATCHER", label: "Диспетчер" },
  { value: "LOGIST", label: "Логист" },
  { value: "ADMIN", label: "Администратор" },
  { value: "MANAGER", label: "Руководитель" },
  { value: "DRIVER", label: "Водитель" }
];

export function LoginScreen() {
  const { login, register, isOnline } = useApp();
  const [email, setEmail] = useState("dispatcher@progile.ru");
  const [password, setPassword] = useState("demo123");
  const [fullName, setFullName] = useState("Иванов Иван Иванович");
  const [company, setCompany] = useState("ООО \"Прогайл Логистика\"");
  const [role, setRole] = useState<RoleName>("DISPATCHER");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    if (isRegisterMode) {
      await register(fullName, email, password, role, company);
    } else {
      await login(email, password, role);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <Card mode="elevated" style={styles.hero}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.heroTitle}>Progile Mobile</Text>
          <Text variant="bodyMedium" style={styles.heroText}>Мониторинг транспорта, маршрутов и KPI в реальном времени</Text>
          <Text variant="labelMedium" style={styles.status}>{isOnline ? "Онлайн режим" : "Оффлайн вход по кэшу"}</Text>
        </Card.Content>
      </Card>

      <Card mode="elevated" style={styles.card}>
        <Card.Content>
          <View style={styles.modeRow}>
            <Button mode={!isRegisterMode ? "contained-tonal" : "text"} onPress={() => setIsRegisterMode(false)}>
              Вход
            </Button>
            <Button mode={isRegisterMode ? "contained-tonal" : "text"} onPress={() => setIsRegisterMode(true)}>
              Регистрация
            </Button>
          </View>
          {isRegisterMode && (
            <>
              <TextInput label="ФИО" value={fullName} onChangeText={setFullName} style={styles.input} />
              <TextInput label="Компания" value={company} onChangeText={setCompany} style={styles.input} />
            </>
          )}
          <TextInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={styles.input} />
          <TextInput label="Пароль" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
          <Text variant="titleSmall" style={styles.roleTitle}>Роль</Text>
          <RadioButton.Group onValueChange={(value) => setRole(value as RoleName)} value={role}>
            {roles.map((item) => (
              <RadioButton.Item key={item.value} label={item.label} value={item.value} />
            ))}
          </RadioButton.Group>
          <Button mode="contained" loading={loading} onPress={submit} style={styles.button}>
            {isRegisterMode ? "Зарегистрироваться" : "Войти"}
          </Button>
        </Card.Content>
      </Card>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FBFF", justifyContent: "center", padding: 16 },
  hero: { borderRadius: 24, marginBottom: 16, backgroundColor: "#4DA6FF" },
  heroTitle: { color: "white", fontWeight: "800" },
  heroText: { color: "white", marginTop: 8 },
  status: { color: "white", marginTop: 16 },
  card: { borderRadius: 24 },
  modeRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  input: { marginBottom: 12, backgroundColor: "white" },
  roleTitle: { marginTop: 4, marginBottom: 4 },
  button: { marginTop: 16, borderRadius: 12 }
});
