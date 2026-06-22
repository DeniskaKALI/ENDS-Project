import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MD3LightTheme, PaperProvider } from "react-native-paper";
import { AppProvider, useApp } from "./src/state/AppProvider";
import { LoginScreen } from "./src/screens/LoginScreen";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { TransportScreen } from "./src/screens/TransportScreen";
import { VehicleDetailScreen } from "./src/screens/VehicleDetailScreen";
import { RoutesScreen } from "./src/screens/RoutesScreen";
import { RouteDetailScreen } from "./src/screens/RouteDetailScreen";
import { ReportsScreen } from "./src/screens/ReportsScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";

export type RootStackParamList = {
  MainTabs: undefined;
  VehicleDetail: { id: number };
  RouteDetail: { id: number };
};

export type TabParamList = {
  Dashboard: undefined;
  Transport: undefined;
  Routes: undefined;
  Reports: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#4DA6FF",
    secondary: "#22C55E",
    background: "#F8FBFF",
    surface: "#FFFFFF",
    error: "#EF4444"
  }
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#FFFFFF" },
        headerTitleStyle: { color: "#1F2937" },
        tabBarActiveTintColor: "#4DA6FF",
        tabBarInactiveTintColor: "#6B7280",
        tabBarStyle: { height: 64, paddingBottom: 8, paddingTop: 6 }
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: "Главная", tabBarLabel: "Главная" }} />
      <Tab.Screen name="Transport" component={TransportScreen} options={{ title: "Транспорт", tabBarLabel: "Транспорт" }} />
      <Tab.Screen name="Routes" component={RoutesScreen} options={{ title: "Маршруты", tabBarLabel: "Маршруты" }} />
      <Tab.Screen name="Reports" component={ReportsScreen} options={{ title: "Отчёты", tabBarLabel: "Отчёты" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Профиль", tabBarLabel: "Профиль" }} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user } = useApp();

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="VehicleDetail" component={VehicleDetailScreen} options={{ title: "Транспорт" }} />
        <Stack.Screen name="RouteDetail" component={RouteDetailScreen} options={{ title: "Маршрут" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AppProvider>
        <AppNavigator />
      </AppProvider>
    </PaperProvider>
  );
}
