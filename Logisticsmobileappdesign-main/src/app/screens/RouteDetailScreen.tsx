import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Flag,
  MapPin,
  Navigation,
  Truck
} from "lucide-react";
import { Card } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { EmptyState } from "../components/progile/EmptyState";
import { StatusBadge } from "../components/progile/StatusBadge";
import { MapWidget } from "../components/progile/MapWidget";
import { useProgile } from "../state/ProgileProvider";
import type { RouteStatus } from "../types";

interface RouteDetailScreenProps {
  id: string;
  onBack: () => void;
}

const statusActions: Array<{ status: RouteStatus; label: string }> = [
  { status: "PLANNED", label: "План" },
  { status: "ACTIVE", label: "Запустить" },
  { status: "COMPLETED", label: "Завершить" }
];

export function RouteDetailScreen({ id, onBack }: RouteDetailScreenProps) {
  const { routes, vehicles, updateRouteStatus } = useProgile();
  const route = routes.find((item) => item.id === id);
  const vehicle = vehicles.find((item) => item.plateNumber === route?.vehicle);

  if (!route) {
    return (
      <div className="h-full flex flex-col bg-[#F8FBFF]">
        <div className="p-4 bg-white border-b border-[#E5E7EB]">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
        </div>
        <div className="flex-1 p-4">
          <EmptyState icon={MapPin} title="Маршрут не найден" description="Запись была удалена или ещё не синхронизирована" />
        </div>
      </div>
    );
  }

  const checkpoints = route.checkpoints ?? [
    { name: route.start, time: "09:00", status: route.status === "PLANNED" ? "pending" : "completed" as const },
    { name: route.end, time: route.eta ?? "18:00", status: route.status === "COMPLETED" ? "completed" : "pending" as const }
  ];
  const remaining = route.remainingKm ?? Math.round((route.distanceKm ?? 420) * (1 - route.progress / 100));
  const passed = Math.max(0, (route.distanceKm ?? 420) - remaining);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 bg-white border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full hover:bg-[#F8FBFF] flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold text-[#1F2937] truncate">{route.name}</h1>
          </div>
          <StatusBadge status={route.status} />
        </div>
      </div>

      <div className="px-4 pt-4">
        <MapWidget />
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 pb-20 space-y-4 max-w-screen-sm mx-auto">
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#22C55E] mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-[#6B7280]">Откуда</p>
                  <p className="font-medium text-[#1F2937]">{route.start}</p>
                  <p className="text-xs text-[#6B7280]">Отправление: 09:00</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Navigation className="w-5 h-5 text-[#EF4444] mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-[#6B7280]">Куда</p>
                  <p className="font-medium text-[#1F2937]">{route.end}</p>
                  <p className="text-xs text-[#6B7280]">Ожидаемое прибытие: {route.eta ?? "не задано"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Truck className="w-5 h-5 text-[#4DA6FF]" />
                <div className="flex-1">
                  <p className="text-xs text-[#6B7280]">Транспорт</p>
                  <p className="font-medium text-[#1F2937]">
                    {vehicle ? `${vehicle.plateNumber} - ${vehicle.model}` : route.vehicle ?? "Не назначен"}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold text-[#1F2937] mb-3">Прогресс маршрута</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#6B7280]">Выполнено</span>
                  <span className="font-semibold text-[#1F2937]">{route.progress}%</span>
                </div>
                <Progress value={route.progress} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-[#6B7280]">Пройдено</p>
                  <p className="font-semibold text-[#1F2937]">{passed} км</p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Осталось</p>
                  <p className="font-semibold text-[#1F2937]">{remaining} км</p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Статус</p>
                  <p className="font-semibold text-[#1F2937]">{route.status}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Дистанция</p>
                  <p className="font-semibold text-[#1F2937]">{route.distanceKm ?? 420} км</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-2">
            {statusActions.map((action) => (
              <Button
                key={action.status}
                variant={route.status === action.status ? "default" : "outline"}
                className={route.status === action.status ? "bg-[#4DA6FF] hover:bg-[#4DA6FF]/90 text-xs" : "text-xs"}
                onClick={() => updateRouteStatus(route.id, action.status)}
              >
                {action.label}
              </Button>
            ))}
          </div>

          <Card className={`p-4 border-l-4 ${route.status === "ACTIVE" ? "border-[#22C55E]" : "border-[#4DA6FF]"}`}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D1FAE5] flex items-center justify-center">
                {route.status === "ACTIVE" ? (
                  <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-[#4DA6FF]" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-[#1F2937] mb-1">
                  {route.status === "ACTIVE" ? "На маршруте" : "Контрольный статус"}
                </h4>
                <p className="text-sm text-[#6B7280]">
                  {route.status === "ACTIVE"
                    ? "Транспорт движется согласно плану. Отклонения отслеживаются в уведомлениях."
                    : "Маршрут можно запустить или завершить с фиксацией результата в отчётах."}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold text-[#1F2937] mb-4">Контрольные точки</h3>
            <div className="space-y-4">
              {checkpoints.map((checkpoint, index) => {
                const isLast = index === checkpoints.length - 1;
                const Icon = checkpoint.status === "completed" ? CheckCircle2 : checkpoint.status === "current" ? MapPin : Flag;
                const iconColor = checkpoint.status === "completed" ? "#22C55E" : checkpoint.status === "current" ? "#4DA6FF" : "#9CA3AF";
                const bgColor = checkpoint.status === "completed" ? "#D1FAE5" : checkpoint.status === "current" ? "#DDEFFF" : "#F3F4F6";

                return (
                  <div key={`${checkpoint.name}-${index}`} className="flex gap-3 relative">
                    {!isLast && (
                      <div className="absolute left-5 top-10 bottom-0 w-0.5" style={{ backgroundColor: `${iconColor}40` }} />
                    )}
                    <div className="w-10 h-10 rounded-full flex items-center justify-center z-10 flex-shrink-0" style={{ backgroundColor: bgColor }}>
                      <Icon className="w-5 h-5" style={{ color: iconColor }} />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-medium text-[#1F2937]">{checkpoint.name}</p>
                        <span className="text-xs text-[#6B7280] whitespace-nowrap">{checkpoint.time}</span>
                      </div>
                      <p className="text-xs text-[#6B7280]">
                        {checkpoint.status === "completed" ? "Пройдена" : checkpoint.status === "current" ? "Текущая позиция" : "Ожидается"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Сообщить
            </Button>
            <Button className="bg-[#4DA6FF] hover:bg-[#4DA6FF]/90">
              <Clock className="w-4 h-4 mr-2" />
              История
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
