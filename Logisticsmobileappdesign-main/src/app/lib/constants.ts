export const APP_NAME = "Progile Mobile";
export const APP_VERSION = "1.0.0";

export const COLORS = {
  primary: "#4DA6FF",
  primaryLight: "#DDEFFF",
  background: "#F8FBFF",
  surface: "#FFFFFF",
  text: "#1F2937",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  gray: "#9CA3AF",
  grayLight: "#F3F4F6",
} as const;

export const VEHICLE_STATUS = {
  MOVING: { label: "В движении", color: COLORS.success },
  STOPPED: { label: "Остановка", color: COLORS.gray },
  OFF_ROUTE: { label: "Вне маршрута", color: COLORS.danger },
  MAINTENANCE: { label: "Техобслуживание", color: COLORS.warning },
} as const;

export const ROUTE_STATUS = {
  PLANNED: { label: "Запланирован", color: COLORS.gray },
  ACTIVE: { label: "Активный", color: COLORS.primary },
  COMPLETED: { label: "Завершён", color: COLORS.success },
} as const;

export const ALERT_SEVERITY = {
  info: { color: COLORS.primary, bg: COLORS.primaryLight },
  warning: { color: COLORS.warning, bg: "#FEF3C7" },
  error: { color: COLORS.danger, bg: "#FEE2E2" },
  success: { color: COLORS.success, bg: "#D1FAE5" },
} as const;
