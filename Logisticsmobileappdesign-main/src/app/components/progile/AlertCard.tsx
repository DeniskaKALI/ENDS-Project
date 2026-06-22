import { Card } from "../ui/card";
import { AlertTriangle, WifiOff, Activity, Clock as ClockIcon } from "lucide-react";

type AlertSeverity = "info" | "warning" | "error" | "success";
type AlertType = "gps_lost" | "speed_violation" | "route_deviation" | "long_stop";

interface AlertCardProps {
  type: AlertType;
  message: string;
  timestamp: string;
  severity: AlertSeverity;
  vehicleId?: string;
}

const alertConfig = {
  gps_lost: {
    icon: WifiOff,
    title: "Потеря GPS сигнала"
  },
  speed_violation: {
    icon: Activity,
    title: "Превышение скорости"
  },
  route_deviation: {
    icon: AlertTriangle,
    title: "Отклонение от маршрута"
  },
  long_stop: {
    icon: ClockIcon,
    title: "Длительная остановка"
  }
};

const severityConfig = {
  info: { color: "#4DA6FF", bg: "#DDEFFF" },
  warning: { color: "#F59E0B", bg: "#FEF3C7" },
  error: { color: "#EF4444", bg: "#FEE2E2" },
  success: { color: "#22C55E", bg: "#D1FAE5" }
};

export function AlertCard({
  type,
  message,
  timestamp,
  severity,
  vehicleId
}: AlertCardProps) {
  const alert = alertConfig[type];
  const Icon = alert.icon;
  const severityStyle = severityConfig[severity];

  return (
    <Card
      className="p-4 transition-all hover:shadow-md cursor-pointer"
      style={{ borderLeft: `4px solid ${severityStyle.color}` }}
    >
      <div className="flex gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: severityStyle.bg }}
        >
          <Icon className="w-5 h-5" style={{ color: severityStyle.color }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-medium text-[#1F2937]">{alert.title}</h4>
            <span className="text-xs text-[#6B7280] whitespace-nowrap">{timestamp}</span>
          </div>

          <p className="text-sm text-[#6B7280] mb-1">{message}</p>

          {vehicleId && (
            <p className="text-xs text-[#9CA3AF]">Транспорт: {vehicleId}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
