import { Badge } from "../ui/badge";

type VehicleStatus = "MOVING" | "STOPPED" | "OFF_ROUTE" | "MAINTENANCE";
type RouteStatus = "PLANNED" | "ACTIVE" | "COMPLETED";

interface StatusBadgeProps {
  status: VehicleStatus | RouteStatus;
  size?: "sm" | "md" | "lg";
}

const statusConfig = {
  // Vehicle statuses
  MOVING: { label: "В движении", color: "bg-[#22C55E] text-white" },
  STOPPED: { label: "Остановка", color: "bg-[#9CA3AF] text-white" },
  OFF_ROUTE: { label: "Вне маршрута", color: "bg-[#EF4444] text-white" },
  MAINTENANCE: { label: "Техобслуживание", color: "bg-[#F59E0B] text-white" },
  // Route statuses
  PLANNED: { label: "Запланирован", color: "bg-[#9CA3AF] text-white" },
  ACTIVE: { label: "Активный", color: "bg-[#4DA6FF] text-white" },
  COMPLETED: { label: "Завершён", color: "bg-[#22C55E] text-white" }
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5"
  };

  return (
    <Badge className={`${config.color} ${sizeClasses[size]}`}>
      {config.label}
    </Badge>
  );
}
