import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { MOCK_ALERTS, MOCK_ROUTES, MOCK_VEHICLES } from "../data/mockData";
import type {
  Alert,
  ApiEndpoint,
  AppSettings,
  Comment,
  ReportFormat,
  RoleName,
  Route,
  RouteStatus,
  UserProfile,
  Vehicle,
  VehicleStatus
} from "../types";

interface TransportInput {
  plateNumber: string;
  model: string;
  driver: string;
  type: string;
  status: VehicleStatus;
  speed: number;
  fuel: number;
}

interface RouteInput {
  name: string;
  start: string;
  end: string;
  status: RouteStatus;
  vehicle?: string;
  eta?: string;
  progress: number;
}

interface Credentials {
  fullName?: string;
  email: string;
  password: string;
  role: RoleName;
}

interface ProgileContextValue {
  user: UserProfile | null;
  vehicles: Vehicle[];
  routes: Route[];
  alerts: Alert[];
  comments: Record<string, Comment[]>;
  settings: AppSettings;
  apiEndpoints: ApiEndpoint[];
  lastSync: string;
  login: (credentials: Credentials) => void;
  register: (credentials: Credentials) => void;
  logout: () => void;
  addVehicle: (vehicle: TransportInput) => boolean;
  updateVehicle: (plateNumber: string, vehicle: TransportInput) => boolean;
  deleteVehicle: (plateNumber: string) => void;
  addRoute: (route: RouteInput) => boolean;
  updateRoute: (routeId: string, route: RouteInput) => boolean;
  updateRouteStatus: (routeId: string, status: RouteStatus) => void;
  deleteRoute: (routeId: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  addComment: (vehicleId: string, text: string) => void;
  markAllAlertsRead: () => void;
  clearAlerts: () => void;
  exportReport: (format: ReportFormat) => void;
  simulateSync: () => void;
}

const STORAGE_KEY = "progile-mobile-state-v2";

const defaultUser: UserProfile = {
  fullName: "Иванов Иван Иванович",
  email: "dispatcher@progile.ru",
  role: "DISPATCHER",
  company: "ООО \"Прогайл Логистика\"",
  token: "demo.jwt.token"
};

const defaultSettings: AppSettings = {
  notifications: true,
  darkMode: false,
  language: "Русский"
};

const defaultComments: Record<string, Comment[]> = {
  "А123ВС": [
    { author: "Диспетчер", time: "14:20", text: "Прошу подтвердить прибытие в 18:30" },
    { author: "Иванов И.И.", time: "14:25", text: "Прибуду вовремя, без задержек" },
    { author: "Диспетчер", time: "14:30", text: "Отлично, спасибо!" }
  ],
  "К456МН": [
    { author: "Логист", time: "13:10", text: "Зафиксировано отклонение от маршрута." }
  ]
};

const apiEndpoints: ApiEndpoint[] = [
  { method: "POST", path: "/api/auth/login", description: "Аутентификация пользователя" },
  { method: "POST", path: "/api/auth/register", description: "Регистрация пользователя" },
  { method: "GET", path: "/api/transport", description: "Список транспорта компании" },
  { method: "POST", path: "/api/transport", description: "Регистрация транспортного средства" },
  { method: "PATCH", path: "/api/transport/{id}/status", description: "Обновление статуса транспорта" },
  { method: "GET", path: "/api/routes", description: "Список маршрутов с фильтрами" },
  { method: "POST", path: "/api/routes", description: "Создание маршрута" },
  { method: "PUT", path: "/api/routes/{id}", description: "Редактирование маршрута" },
  { method: "GET", path: "/api/tracking/current", description: "Текущие GPS-координаты" },
  { method: "POST", path: "/api/tracking", description: "Приём GPS-снимка" },
  { method: "POST", path: "/api/reports", description: "Формирование отчёта" },
  { method: "GET", path: "/api/reports/{id}/export", description: "Экспорт отчёта" },
  { method: "POST", path: "/api/comments", description: "Комментарий к транспорту или маршруту" }
];

const ProgileContext = createContext<ProgileContextValue | null>(null);

function nowLabel() {
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(new Date());
}

function makeRouteId(name: string) {
  return `route-${name.toLowerCase().replace(/[^a-zа-я0-9]+/gi, "-").replace(/^-|-$/g, "")}-${Date.now()}`;
}

function makeCsv(vehicles: Vehicle[], routes: Route[]) {
  const vehicleRows = vehicles.map((vehicle) => [
    vehicle.plateNumber,
    vehicle.model,
    vehicle.driver,
    vehicle.status,
    vehicle.speed,
    vehicle.fuel ?? "",
    vehicle.lastUpdate
  ]);
  const routeRows = routes.map((route) => [
    route.id,
    route.name,
    route.status,
    route.vehicle ?? "",
    route.progress,
    route.eta ?? ""
  ]);

  return [
    "Транспорт",
    "Номер;Модель;Водитель;Статус;Скорость;Топливо;Обновлено",
    ...vehicleRows.map((row) => row.join(";")),
    "",
    "Маршруты",
    "ID;Название;Статус;Транспорт;Прогресс;ETA",
    ...routeRows.map((row) => row.join(";"))
  ].join("\n");
}

function makeReportText(vehicles: Vehicle[], routes: Route[]) {
  const activeVehicles = vehicles.filter((vehicle) => vehicle.status === "MOVING").length;
  const activeRoutes = routes.filter((route) => route.status === "ACTIVE").length;
  const completedRoutes = routes.filter((route) => route.status === "COMPLETED").length;
  const avgSpeed = Math.round(
    vehicles.reduce((sum, vehicle) => sum + vehicle.speed, 0) / Math.max(vehicles.length, 1)
  );

  return [
    "Progile Mobile Report",
    `Generated: ${new Date().toLocaleString("ru-RU")}`,
    `Active vehicles: ${activeVehicles}`,
    `Active routes: ${activeRoutes}`,
    `Completed routes: ${completedRoutes}`,
    `Average speed: ${avgSpeed} km/h`,
    "",
    "Vehicles:",
    ...vehicles.map((vehicle) => `${vehicle.plateNumber} | ${vehicle.model} | ${vehicle.status} | ${vehicle.speed} km/h`),
    "",
    "Routes:",
    ...routes.map((route) => `${route.name} | ${route.status} | ${route.progress}%`)
  ].join("\n");
}

function makePseudoPdf(text: string) {
  const escaped = text
    .replace(/[^\x20-\x7E\n]/g, "?")
    .split("\n")
    .slice(0, 42)
    .map((line) => line.replace(/[()\\]/g, "\\$&"));
  const stream = [
    "BT",
    "/F1 12 Tf",
    "50 780 Td",
    ...escaped.map((line, index) => `${index === 0 ? "" : "0 -16 Td "}(${line}) Tj`),
    "ET"
  ].join("\n");
  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj",
    "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    `5 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream endobj`
  ];
  const body = objects.join("\n");
  return `%PDF-1.4\n${body}\ntrailer << /Root 1 0 R >>\n%%EOF`;
}

function downloadBlob(content: string, fileName: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export function ProgileProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [routes, setRoutes] = useState<Route[]>(MOCK_ROUTES);
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [comments, setComments] = useState<Record<string, Comment[]>>(defaultComments);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [lastSync, setLastSync] = useState(nowLabel());

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      setUser(parsed.user ?? null);
      setVehicles(parsed.vehicles?.length ? parsed.vehicles : MOCK_VEHICLES);
      setRoutes(parsed.routes?.length ? parsed.routes : MOCK_ROUTES);
      setAlerts(parsed.alerts?.length ? parsed.alerts : MOCK_ALERTS);
      setComments(parsed.comments ?? defaultComments);
      setSettings({ ...defaultSettings, ...parsed.settings });
      setLastSync(parsed.lastSync ?? nowLabel());
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user, vehicles, routes, alerts, comments, settings, lastSync })
    );
  }, [alerts, comments, lastSync, routes, settings, user, vehicles]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.darkMode);
  }, [settings.darkMode]);

  const login = (credentials: Credentials) => {
    if (!credentials.email || !credentials.password) {
      toast.error("Заполните email и пароль");
      return;
    }

    setUser({
      ...defaultUser,
      fullName: credentials.fullName || defaultUser.fullName,
      email: credentials.email,
      role: credentials.role,
      token: `demo.${credentials.role.toLowerCase()}.${Date.now()}`
    });
    setLastSync(nowLabel());
    toast.success("Вход выполнен");
  };

  const register = (credentials: Credentials) => {
    login(credentials);
    toast.success("Пользователь зарегистрирован в демо-контуре");
  };

  const logout = () => {
    setUser(null);
    toast.message("Сеанс завершён");
  };

  const addVehicle = (vehicle: TransportInput) => {
    const plate = vehicle.plateNumber.trim().toUpperCase();
    if (!plate || !vehicle.model.trim() || !vehicle.driver.trim()) {
      toast.error("Заполните номер, модель и водителя");
      return false;
    }

    if (vehicles.some((item) => item.plateNumber.toUpperCase() === plate)) {
      toast.error("Транспорт с таким номером уже есть");
      return false;
    }

    setVehicles((current) => [
      {
        ...vehicle,
        plateNumber: plate,
        model: vehicle.model.trim(),
        driver: vehicle.driver.trim(),
        type: vehicle.type.trim() || "Грузовой",
        mileage: 0,
        lastUpdate: "только что"
      },
      ...current
    ]);
    setLastSync(nowLabel());
    toast.success("Транспорт добавлен");
    return true;
  };

  const updateVehicle = (plateNumber: string, vehicle: TransportInput) => {
    const nextPlate = vehicle.plateNumber.trim().toUpperCase();
    if (!nextPlate || !vehicle.model.trim() || !vehicle.driver.trim()) {
      toast.error("Заполните номер, модель и водителя");
      return false;
    }

    if (
      nextPlate !== plateNumber.toUpperCase() &&
      vehicles.some((item) => item.plateNumber.toUpperCase() === nextPlate)
    ) {
      toast.error("Транспорт с таким номером уже есть");
      return false;
    }

    setVehicles((current) =>
      current.map((item) =>
        item.plateNumber === plateNumber
          ? {
              ...item,
              ...vehicle,
              plateNumber: nextPlate,
              model: vehicle.model.trim(),
              driver: vehicle.driver.trim(),
              type: vehicle.type.trim() || item.type,
              lastUpdate: "только что"
            }
          : item
      )
    );
    setRoutes((current) =>
      current.map((route) => (route.vehicle === plateNumber ? { ...route, vehicle: nextPlate } : route))
    );
    setLastSync(nowLabel());
    toast.success("Транспорт обновлён");
    return true;
  };

  const deleteVehicle = (plateNumber: string) => {
    setVehicles((current) => current.filter((vehicle) => vehicle.plateNumber !== plateNumber));
    setRoutes((current) =>
      current.map((route) => (route.vehicle === plateNumber ? { ...route, vehicle: undefined } : route))
    );
    setLastSync(nowLabel());
    toast.message("Транспорт удалён");
  };

  const addRoute = (route: RouteInput) => {
    if (!route.name.trim() || !route.start.trim() || !route.end.trim()) {
      toast.error("Заполните название, старт и финиш");
      return false;
    }

    const id = makeRouteId(route.name);
    setRoutes((current) => [
      {
        ...route,
        id,
        name: route.name.trim(),
        start: route.start.trim(),
        end: route.end.trim(),
        progress: Math.min(100, Math.max(0, route.progress)),
        remainingKm: route.status === "COMPLETED" ? 0 : 120,
        distanceKm: 420,
        checkpoints: [
          { name: route.start.trim(), time: "09:00", status: route.status === "PLANNED" ? "pending" : "completed" },
          { name: route.end.trim(), time: route.eta || "18:00", status: route.status === "COMPLETED" ? "completed" : "pending" }
        ]
      },
      ...current
    ]);
    if (route.vehicle) {
      setVehicles((current) =>
        current.map((vehicle) =>
          vehicle.plateNumber === route.vehicle ? { ...vehicle, routeId: id, lastUpdate: "только что" } : vehicle
        )
      );
    }
    setLastSync(nowLabel());
    toast.success("Маршрут создан");
    return true;
  };

  const updateRoute = (routeId: string, route: RouteInput) => {
    if (!route.name.trim() || !route.start.trim() || !route.end.trim()) {
      toast.error("Заполните название, старт и финиш");
      return false;
    }

    setRoutes((current) =>
      current.map((item) =>
        item.id === routeId
          ? {
              ...item,
              ...route,
              name: route.name.trim(),
              start: route.start.trim(),
              end: route.end.trim(),
              progress: Math.min(100, Math.max(0, route.progress))
            }
          : item
      )
    );
    setLastSync(nowLabel());
    toast.success("Маршрут обновлён");
    return true;
  };

  const updateRouteStatus = (routeId: string, status: RouteStatus) => {
    setRoutes((current) =>
      current.map((route) =>
        route.id === routeId
          ? {
              ...route,
              status,
              progress: status === "COMPLETED" ? 100 : status === "PLANNED" ? 0 : Math.max(route.progress, 15),
              remainingKm: status === "COMPLETED" ? 0 : route.remainingKm
            }
          : route
      )
    );
    setLastSync(nowLabel());
    toast.success("Статус маршрута изменён");
  };

  const deleteRoute = (routeId: string) => {
    setRoutes((current) => current.filter((route) => route.id !== routeId));
    setVehicles((current) =>
      current.map((vehicle) => (vehicle.routeId === routeId ? { ...vehicle, routeId: undefined } : vehicle))
    );
    setLastSync(nowLabel());
    toast.message("Маршрут удалён");
  };

  const updateSettings = (nextSettings: Partial<AppSettings>) => {
    setSettings((current) => ({ ...current, ...nextSettings }));
  };

  const addComment = (vehicleId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setComments((current) => ({
      ...current,
      [vehicleId]: [
        ...(current[vehicleId] ?? []),
        {
          author: user?.role === "DRIVER" ? user.fullName : "Диспетчер",
          time: new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
          text: trimmed
        }
      ]
    }));
  };

  const markAllAlertsRead = () => {
    setAlerts((current) => current.map((alert) => ({ ...alert, read: true })));
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  const exportReport = (format: ReportFormat) => {
    const stamp = new Date().toISOString().slice(0, 10);
    const csv = makeCsv(vehicles, routes);
    const text = makeReportText(vehicles, routes);

    if (format === "csv") {
      downloadBlob(csv, `progile-report-${stamp}.csv`, "text/csv;charset=utf-8");
    } else if (format === "xlsx") {
      downloadBlob(csv, `progile-report-${stamp}.xls`, "application/vnd.ms-excel;charset=utf-8");
    } else {
      downloadBlob(makePseudoPdf(text), `progile-report-${stamp}.pdf`, "application/pdf");
    }

    toast.success("Отчёт сформирован");
  };

  const simulateSync = () => {
    setLastSync(nowLabel());
    setVehicles((current) =>
      current.map((vehicle) =>
        vehicle.status === "MOVING"
          ? {
              ...vehicle,
              speed: Math.max(45, Math.min(90, vehicle.speed + Math.round(Math.random() * 8 - 4))),
              mileage: (vehicle.mileage ?? 0) + 3,
              fuel: Math.max(0, (vehicle.fuel ?? 70) - 1),
              lastUpdate: "только что"
            }
          : vehicle
      )
    );
    toast.success("GPS-данные обновлены");
  };

  const value = useMemo(
    () => ({
      user,
      vehicles,
      routes,
      alerts,
      comments,
      settings,
      apiEndpoints,
      lastSync,
      login,
      register,
      logout,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      addRoute,
      updateRoute,
      updateRouteStatus,
      deleteRoute,
      updateSettings,
      addComment,
      markAllAlertsRead,
      clearAlerts,
      exportReport,
      simulateSync
    }),
    [alerts, comments, lastSync, routes, settings, user, vehicles]
  );

  return <ProgileContext.Provider value={value}>{children}</ProgileContext.Provider>;
}

export function useProgile() {
  const context = useContext(ProgileContext);
  if (!context) {
    throw new Error("useProgile must be used inside ProgileProvider");
  }
  return context;
}
