import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { MapPin, Navigation, Clock, Pencil, Trash2 } from "lucide-react";
import { Progress } from "../ui/progress";

interface RouteCardProps {
  name: string;
  start: string;
  end: string;
  status: "PLANNED" | "ACTIVE" | "COMPLETED";
  vehicle?: string;
  eta?: string;
  progress: number;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const statusConfig = {
  PLANNED: { label: "Запланирован", color: "bg-[#9CA3AF] text-white" },
  ACTIVE: { label: "Активный", color: "bg-[#4DA6FF] text-white" },
  COMPLETED: { label: "Завершён", color: "bg-[#22C55E] text-white" }
};

export function RouteCard({
  name,
  start,
  end,
  status,
  vehicle,
  eta,
  progress,
  onClick,
  onEdit,
  onDelete
}: RouteCardProps) {
  return (
    <Card
      className="p-4 cursor-pointer transition-all hover:shadow-lg active:scale-[0.98]"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-[#1F2937]">{name}</h3>
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

      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-[#22C55E] mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-[#6B7280]">Откуда:</p>
            <p className="text-sm font-medium text-[#1F2937]">{start}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Navigation className="w-4 h-4 text-[#EF4444] mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-[#6B7280]">Куда:</p>
            <p className="text-sm font-medium text-[#1F2937]">{end}</p>
          </div>
        </div>

        {vehicle && (
          <div className="text-sm">
            <span className="text-[#6B7280]">Транспорт: </span>
            <span className="font-medium text-[#1F2937]">{vehicle}</span>
          </div>
        )}

        {eta && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-[#6B7280]" />
            <span className="text-[#6B7280]">Прибытие:</span>
            <span className="font-medium text-[#1F2937]">{eta}</span>
          </div>
        )}

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-[#6B7280]">Прогресс</span>
            <span className="font-medium text-[#1F2937]">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </Card>
  );
}
