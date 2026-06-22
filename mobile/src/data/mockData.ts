import type { AlertItem, RoutePlan, Vehicle } from "../types";

export const initialVehicles: Vehicle[] = [
  {
    id: 1,
    plateNumber: "А123ВС",
    model: "КАМАЗ 5320",
    driver: "Иванов И.И.",
    type: "Грузовой",
    status: "MOVING",
    speed: 72,
    fuel: 75,
    lastUpdate: "2 мин назад"
  },
  {
    id: 2,
    plateNumber: "К456МН",
    model: "МАЗ 6303",
    driver: "Петров П.П.",
    type: "Тягач",
    status: "OFF_ROUTE",
    speed: 45,
    fuel: 58,
    lastUpdate: "5 мин назад"
  },
  {
    id: 3,
    plateNumber: "Т789ОР",
    model: "Volvo FH16",
    driver: "Сидоров С.С.",
    type: "Фура",
    status: "STOPPED",
    speed: 0,
    fuel: 42,
    lastUpdate: "12 мин назад"
  }
];

export const initialRoutes: RoutePlan[] = [
  {
    id: 1,
    name: "Москва - Санкт-Петербург",
    startPoint: "Москва, ул. Складская 15",
    endPoint: "Санкт-Петербург, пр. Индустриальный 42",
    status: "ACTIVE",
    vehicleId: 1,
    eta: "18:30",
    progress: 65
  },
  {
    id: 2,
    name: "Самара - Уфа",
    startPoint: "Самара, Логопарк",
    endPoint: "Уфа, ул. Транспортная 12",
    status: "ACTIVE",
    vehicleId: 2,
    eta: "16:45",
    progress: 78
  },
  {
    id: 3,
    name: "Екатеринбург - Челябинск",
    startPoint: "Екатеринбург, Складской комплекс",
    endPoint: "Челябинск, ул. Промышленная 8",
    status: "PLANNED",
    eta: "Завтра 09:00",
    progress: 0
  }
];

export const initialAlerts: AlertItem[] = [
  {
    id: 1,
    title: "Отклонение от маршрута",
    message: "К456МН отклонился от маршрута на 2.5 км",
    severity: "error",
    read: false
  },
  {
    id: 2,
    title: "Превышение скорости",
    message: "А123ВС превысил лимит скорости на 15 км/ч",
    severity: "warning",
    read: false
  }
];
