import type { Vehicle, Route, Alert } from "../types";

export const MOCK_VEHICLES: Vehicle[] = [
  {
    plateNumber: "А123ВС",
    model: "КАМАЗ 5320",
    driver: "Иванов И.И.",
    status: "MOVING",
    speed: 72,
    lastUpdate: "2 мин назад",
    type: "Грузовой",
    fuel: 75,
    mileage: 450,
    routeId: "route-msk-spb"
  },
  {
    plateNumber: "К456МН",
    model: "МАЗ 6303",
    driver: "Петров П.П.",
    status: "OFF_ROUTE",
    speed: 45,
    lastUpdate: "5 мин назад",
    type: "Тягач",
    fuel: 58,
    mileage: 612,
    routeId: "route-samara-ufa"
  },
  {
    plateNumber: "Т789ОР",
    model: "Volvo FH16",
    driver: "Сидоров С.С.",
    status: "STOPPED",
    speed: 0,
    lastUpdate: "12 мин назад",
    type: "Фура",
    fuel: 42,
    mileage: 695
  },
  {
    plateNumber: "Е234УХ",
    model: "Scania R450",
    driver: "Козлов К.К.",
    status: "MOVING",
    speed: 68,
    lastUpdate: "1 мин назад",
    type: "Фура",
    fuel: 81,
    mileage: 310,
    routeId: "route-kazan-nn"
  },
  {
    plateNumber: "М567АВ",
    model: "Mercedes Actros",
    driver: "Новиков Н.Н.",
    status: "MOVING",
    speed: 75,
    lastUpdate: "3 мин назад",
    type: "Тягач",
    fuel: 67,
    mileage: 503
  },
  {
    plateNumber: "Р890СТ",
    model: "MAN TGX",
    driver: "Морозов М.М.",
    status: "STOPPED",
    speed: 0,
    lastUpdate: "8 мин назад",
    type: "Рефрижератор",
    fuel: 49,
    mileage: 184
  }
];

export const MOCK_ROUTES: Route[] = [
  {
    id: "route-msk-spb",
    name: "Москва — Санкт-Петербург",
    start: "Москва, ул. Складская 15",
    end: "Санкт-Петербург, пр. Индустриальный 42",
    status: "ACTIVE",
    vehicle: "А123ВС",
    eta: "18:30",
    progress: 65,
    distanceKm: 695,
    remainingKm: 245,
    checkpoints: [
      { name: "Москва, ул. Складская 15", time: "09:00", status: "completed" },
      { name: "Тверь, заправка BP", time: "11:20", status: "completed" },
      { name: "Валдай, кафе Уют", time: "13:45", status: "current" },
      { name: "Новгород, контрольная точка", time: "16:00", status: "pending" },
      { name: "Санкт-Петербург, пр. Индустриальный 42", time: "18:30", status: "pending" }
    ]
  },
  {
    id: "route-kazan-nn",
    name: "Казань — Нижний Новгород",
    start: "Казань, Логистический центр",
    end: "Нижний Новгород, ТЦ Волга",
    status: "ACTIVE",
    vehicle: "Е234УХ",
    eta: "14:15",
    progress: 42,
    distanceKm: 392,
    remainingKm: 227,
    checkpoints: [
      { name: "Казань, Логистический центр", time: "08:10", status: "completed" },
      { name: "Чебоксары, контрольная точка", time: "11:20", status: "current" },
      { name: "Нижний Новгород, ТЦ Волга", time: "14:15", status: "pending" }
    ]
  },
  {
    id: "route-ekb-chel",
    name: "Екатеринбург — Челябинск",
    start: "Екатеринбург, Складской комплекс",
    end: "Челябинск, ул. Промышленная 8",
    status: "PLANNED",
    eta: "Завтра 09:00",
    progress: 0,
    distanceKm: 214,
    remainingKm: 214,
    checkpoints: [
      { name: "Екатеринбург, Складской комплекс", time: "09:00", status: "pending" },
      { name: "Челябинск, ул. Промышленная 8", time: "13:20", status: "pending" }
    ]
  },
  {
    id: "route-nsk-omsk",
    name: "Новосибирск — Омск",
    start: "Новосибирск, База №3",
    end: "Омск, Распределительный центр",
    status: "COMPLETED",
    vehicle: "М567АВ",
    progress: 100,
    distanceKm: 642,
    remainingKm: 0,
    checkpoints: [
      { name: "Новосибирск, База №3", time: "07:30", status: "completed" },
      { name: "Омск, Распределительный центр", time: "17:40", status: "completed" }
    ]
  },
  {
    id: "route-samara-ufa",
    name: "Самара — Уфа",
    start: "Самара, Логопарк",
    end: "Уфа, ул. Транспортная 12",
    status: "ACTIVE",
    vehicle: "К456МН",
    eta: "16:45",
    progress: 78,
    distanceKm: 466,
    remainingKm: 103,
    checkpoints: [
      { name: "Самара, Логопарк", time: "07:40", status: "completed" },
      { name: "Октябрьский, АЗС", time: "12:10", status: "completed" },
      { name: "Уфа, ул. Транспортная 12", time: "16:45", status: "pending" }
    ]
  },
  {
    id: "route-rostov-krasnodar",
    name: "Ростов-на-Дону — Краснодар",
    start: "Ростов-на-Дону, Терминал А",
    end: "Краснодар, Складской комплекс Юг",
    status: "COMPLETED",
    vehicle: "Т789ОР",
    progress: 100,
    distanceKm: 274,
    remainingKm: 0,
    checkpoints: [
      { name: "Ростов-на-Дону, Терминал А", time: "08:00", status: "completed" },
      { name: "Краснодар, Складской комплекс Юг", time: "12:35", status: "completed" }
    ]
  }
];

export const MOCK_ALERTS: Alert[] = [
  {
    id: 1,
    type: "speed_violation",
    title: "Превышение скорости",
    message: "Превышение скорости на 15 км/ч",
    timestamp: "5 мин назад",
    severity: "warning",
    vehicleId: "А123ВС",
    read: false
  },
  {
    id: 2,
    type: "route_deviation",
    title: "Отклонение от маршрута",
    message: "Отклонение от маршрута на 2.5 км",
    timestamp: "12 мин назад",
    severity: "error",
    vehicleId: "К456МН",
    read: false
  },
  {
    id: 3,
    type: "long_stop",
    title: "Длительная остановка",
    message: "Остановка более 30 минут",
    timestamp: "18 мин назад",
    severity: "info",
    vehicleId: "Т789ОР",
    read: true
  }
];
