import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Truck, User, Clock, Pencil, Trash2 } from "lucide-react";

interface TransportCardProps {
  plateNumber: string;
  model: string;
  driver: string;
  status: "MOVING" | "STOPPED" | "OFF_ROUTE" | "MAINTENANCE";
  speed: number;
  lastUpdate: string;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const statusConfig = {
  MOVING: { label: "В движении", color: "bg-[#22C55E] text-white" },
  STOPPED: { label: "Остановка", color: "bg-[#9CA3AF] text-white" },
  OFF_ROUTE: { label: "Вне маршрута", color: "bg-[#EF4444] text-white" },
  MAINTENANCE: { label: "Техобслуживание", color: "bg-[#F59E0B] text-white" }
};

export function TransportCard({
  plateNumber,
  model,
  driver,
  status,
  speed,
  lastUpdate,
  onClick,
  onEdit,
  onDelete
}: TransportCardProps) {
  return (
    <Card
      className="p-4 cursor-pointer transition-all hover:shadow-lg active:scale-[0.98]"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#DDEFFF] flex items-center justify-center">
            <Truck className="w-5 h-5 text-[#4DA6FF]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#1F2937]">{plateNumber}</h3>
            <p className="text-sm text-[#6B7280]">{model}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={statusConfig[status].color}>
            {statusConfig[status].label}
          </Badge>
          {(onEdit || onDelete) && (
            <div className="flex items-center gap-1">
              {onEdit && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={(event) => {
                    event.stopPropagation();
                    onEdit();
                  }}
                >
                  <Pencil className="w-4 h-4 text-[#6B7280]" />
                </Button>
              )}
              {onDelete && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete();
                  }}
                >
                  <Trash2 className="w-4 h-4 text-[#EF4444]" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
          <User className="w-4 h-4" />
          <span>{driver}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#6B7280]" />
            <span className="text-sm text-[#6B7280]">{lastUpdate}</span>
          </div>
          <div className="text-sm font-medium text-[#1F2937]">
            {speed} км/ч
          </div>
        </div>
      </div>
    </Card>
  );
}
