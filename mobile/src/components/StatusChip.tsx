import { Chip } from "react-native-paper";
import type { RouteStatus, VehicleStatus } from "../types";

const labels: Record<VehicleStatus | RouteStatus, string> = {
  MOVING: "В пути",
  STOPPED: "Стоит",
  OFF_ROUTE: "Вне маршрута",
  MAINTENANCE: "ТО",
  PLANNED: "План",
  ACTIVE: "Активный",
  COMPLETED: "Готово"
};

const colors: Record<VehicleStatus | RouteStatus, string> = {
  MOVING: "#22C55E",
  STOPPED: "#9CA3AF",
  OFF_ROUTE: "#EF4444",
  MAINTENANCE: "#F59E0B",
  PLANNED: "#9CA3AF",
  ACTIVE: "#4DA6FF",
  COMPLETED: "#22C55E"
};

export function StatusChip({ status }: { status: VehicleStatus | RouteStatus }) {
  return (
    <Chip compact textStyle={{ color: "white", fontWeight: "700" }} style={{ backgroundColor: colors[status] }}>
      {labels[status]}
    </Chip>
  );
}
