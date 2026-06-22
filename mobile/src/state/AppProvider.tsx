import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import * as SecureStore from "expo-secure-store";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { api, setAuthToken } from "../api/client";
import { initialAlerts, initialRoutes, initialVehicles } from "../data/mockData";
import type { AlertItem, RoleName, RoutePlan, RouteStatus, UserProfile, Vehicle, VehicleStatus } from "../types";

const STORAGE_KEY = "progile-mobile-cache";
const TOKEN_KEY = "progile-mobile-jwt";

interface AppState {
  user: UserProfile | null;
  vehicles: Vehicle[];
  routes: RoutePlan[];
  alerts: AlertItem[];
  isOnline: boolean;
  lastSync: string;
  login: (email: string, password: string, role: RoleName) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  saveVehicle: (vehicle: Omit<Vehicle, "id" | "lastUpdate"> & { id?: number }) => Promise<void>;
  deleteVehicle: (id: number) => Promise<void>;
  saveRoute: (route: Omit<RoutePlan, "id"> & { id?: number }) => Promise<void>;
  deleteRoute: (id: number) => Promise<void>;
  updateVehicleStatus: (id: number, status: VehicleStatus) => Promise<void>;
  updateRouteStatus: (id: number, status: RouteStatus) => Promise<void>;
  markAlertsRead: () => void;
}

const AppContext = createContext<AppState | null>(null);

function syncLabel() {
  return new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit" }).format(new Date());
}

function nextId(items: Array<{ id: number }>) {
  return Math.max(0, ...items.map((item) => item.id)) + 1;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [routes, setRoutes] = useState<RoutePlan[]>(initialRoutes);
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSync, setLastSync] = useState(syncLabel());

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(Boolean(state.isConnected && state.isInternetReachable !== false));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(async (raw) => {
      if (!raw) return;
      const cached = JSON.parse(raw);
      setUser(cached.user ?? null);
      setVehicles(cached.vehicles?.length ? cached.vehicles : initialVehicles);
      setRoutes(cached.routes?.length ? cached.routes : initialRoutes);
      setAlerts(cached.alerts?.length ? cached.alerts : initialAlerts);
      setLastSync(cached.lastSync ?? syncLabel());
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      setAuthToken(token ?? cached.user?.token);
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ user, vehicles, routes, alerts, lastSync }));
  }, [alerts, lastSync, routes, user, vehicles]);

  const login = async (email: string, password: string, role: RoleName) => {
    if (isOnline) {
      try {
        const response = await api.post("/auth/login", { email, password });
        const nextUser = response.data as UserProfile;
        setUser(nextUser);
        setAuthToken(nextUser.token);
        await SecureStore.setItemAsync(TOKEN_KEY, nextUser.token);
        return;
      } catch {
        // Demo fallback keeps the mobile app usable when the course backend is not running.
      }
    }

    const nextUser: UserProfile = {
      fullName: "Иванов Иван Иванович",
      email,
      role,
      company: "ООО \"Прогайл Логистика\"",
      token: `offline-demo-${role.toLowerCase()}`
    };
    setUser(nextUser);
    setAuthToken(nextUser.token);
    await SecureStore.setItemAsync(TOKEN_KEY, nextUser.token);
  };

  const logout = async () => {
    setUser(null);
    setAuthToken(undefined);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  };

  const refresh = async () => {
    if (!isOnline) return;
    try {
      const [vehicleResponse, routeResponse] = await Promise.all([
        api.get<Vehicle[]>("/transport"),
        api.get<RoutePlan[]>("/routes")
      ]);
      setVehicles(vehicleResponse.data);
      setRoutes(routeResponse.data);
      setLastSync(syncLabel());
    } catch {
      setLastSync(syncLabel());
    }
  };

  const saveVehicle: AppState["saveVehicle"] = async (vehicle) => {
    const payload: Vehicle = {
      ...vehicle,
      id: vehicle.id ?? nextId(vehicles),
      lastUpdate: "только что"
    };
    setVehicles((current) => (vehicle.id ? current.map((item) => (item.id === vehicle.id ? payload : item)) : [payload, ...current]));
    if (isOnline) {
      await (vehicle.id ? api.put(`/transport/${vehicle.id}`, payload) : api.post("/transport", payload)).catch(() => undefined);
    }
  };

  const deleteVehicle = async (id: number) => {
    setVehicles((current) => current.filter((item) => item.id !== id));
    if (isOnline) {
      await api.delete(`/transport/${id}`).catch(() => undefined);
    }
  };

  const saveRoute: AppState["saveRoute"] = async (route) => {
    const payload: RoutePlan = { ...route, id: route.id ?? nextId(routes) };
    setRoutes((current) => (route.id ? current.map((item) => (item.id === route.id ? payload : item)) : [payload, ...current]));
    if (isOnline) {
      await (route.id ? api.put(`/routes/${route.id}`, payload) : api.post("/routes", payload)).catch(() => undefined);
    }
  };

  const deleteRoute = async (id: number) => {
    setRoutes((current) => current.filter((item) => item.id !== id));
    if (isOnline) {
      await api.delete(`/routes/${id}`).catch(() => undefined);
    }
  };

  const updateVehicleStatus = async (id: number, status: VehicleStatus) => {
    setVehicles((current) => current.map((item) => (item.id === id ? { ...item, status, speed: status === "MOVING" ? Math.max(item.speed, 45) : 0 } : item)));
    if (isOnline) {
      await api.patch(`/transport/${id}/status`, { status }).catch(() => undefined);
    }
  };

  const updateRouteStatus = async (id: number, status: RouteStatus) => {
    setRoutes((current) => current.map((item) => (item.id === id ? { ...item, status, progress: status === "COMPLETED" ? 100 : item.progress } : item)));
    if (isOnline) {
      await api.patch(`/routes/${id}/status`, { status }).catch(() => undefined);
    }
  };

  const markAlertsRead = () => {
    setAlerts((current) => current.map((item) => ({ ...item, read: true })));
  };

  const value = useMemo(
    () => ({
      user,
      vehicles,
      routes,
      alerts,
      isOnline,
      lastSync,
      login,
      logout,
      refresh,
      saveVehicle,
      deleteVehicle,
      saveRoute,
      deleteRoute,
      updateVehicleStatus,
      updateRouteStatus,
      markAlertsRead
    }),
    [alerts, isOnline, lastSync, routes, user, vehicles]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return context;
}
