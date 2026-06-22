import { useState } from "react";
import { ArrowLeft, Clock, Fuel, Gauge, MapPin, Phone, Send, Truck, User } from "lucide-react";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { EmptyState } from "../components/progile/EmptyState";
import { StatusBadge } from "../components/progile/StatusBadge";
import { MapWidget } from "../components/progile/MapWidget";
import { useProgile } from "../state/ProgileProvider";
import type { VehicleStatus } from "../types";

interface TransportDetailScreenProps {
  id: string;
  onBack: () => void;
}

const statusActions: Array<{ status: VehicleStatus; label: string }> = [
  { status: "MOVING", label: "В пути" },
  { status: "STOPPED", label: "Стоит" },
  { status: "OFF_ROUTE", label: "Сбой" },
  { status: "MAINTENANCE", label: "ТО" }
];

export function TransportDetailScreen({ id, onBack }: TransportDetailScreenProps) {
  const { vehicles, routes, comments, addComment, updateVehicle } = useProgile();
  const [message, setMessage] = useState("");
  const vehicle = vehicles.find((item) => item.plateNumber === id);
  const route = routes.find((item) => item.id === vehicle?.routeId || item.vehicle === vehicle?.plateNumber);

  if (!vehicle) {
    return (
      <div className="h-full flex flex-col bg-[#F8FBFF]">
        <div className="p-4 bg-white border-b border-[#E5E7EB]">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
        </div>
        <div className="flex-1 p-4">
          <EmptyState icon={Truck} title="Транспорт не найден" description="Запись была удалена или ещё не синхронизирована" />
        </div>
      </div>
    );
  }

  const speedHistory = [
    { time: "10:00", speed: Math.max(0, vehicle.speed - 7) },
    { time: "10:30", speed: Math.max(0, vehicle.speed - 2) },
    { time: "11:00", speed: vehicle.speed },
    { time: "11:30", speed: Math.min(95, vehicle.speed + 4) },
    { time: "12:00", speed: Math.max(0, vehicle.speed - 3) },
    { time: "12:30", speed: vehicle.speed }
  ];

  const vehicleComments = comments[vehicle.plateNumber] ?? [];
  const stops =
    route?.checkpoints?.map((checkpoint) => ({
      time: checkpoint.time,
      duration: checkpoint.status === "completed" ? "8 мин" : "ожидается",
      location: checkpoint.name
    })) ?? [];

  const setStatus = (status: VehicleStatus) => {
    updateVehicle(vehicle.plateNumber, {
      plateNumber: vehicle.plateNumber,
      model: vehicle.model,
      driver: vehicle.driver,
      type: vehicle.type ?? "Грузовой",
      status,
      speed: status === "STOPPED" || status === "MAINTENANCE" ? 0 : Math.max(vehicle.speed, 45),
      fuel: vehicle.fuel ?? 70
    });
  };

  const submitMessage = () => {
    addComment(vehicle.plateNumber, message);
    setMessage("");
  };

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
            <h1 className="text-xl font-semibold text-[#1F2937]">{vehicle.plateNumber}</h1>
            <p className="text-sm text-[#6B7280] truncate">{vehicle.model}</p>
          </div>
          <StatusBadge status={vehicle.status} />
        </div>
      </div>

      <div className="px-4 pt-4">
        <MapWidget />
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 pb-20 space-y-4 max-w-screen-sm mx-auto">
          <Card className="p-4">
            <h3 className="font-semibold text-[#1F2937] mb-3">Информация</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#DDEFFF] flex items-center justify-center">
                  <Truck className="w-5 h-5 text-[#4DA6FF]" />
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Транспорт</p>
                  <p className="font-medium text-[#1F2937]">{vehicle.model}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#DDEFFF] flex items-center justify-center">
                  <User className="w-5 h-5 text-[#4DA6FF]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[#6B7280]">Водитель</p>
                  <p className="font-medium text-[#1F2937]">{vehicle.driver}</p>
                </div>
                <Button size="sm" variant="outline">
                  <Phone className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-[#6B7280]" />
                  <div>
                    <p className="text-xs text-[#6B7280]">Скорость</p>
                    <p className="font-semibold text-[#1F2937]">{vehicle.speed} км/ч</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-[#6B7280]" />
                  <div>
                    <p className="text-xs text-[#6B7280]">Топливо</p>
                    <p className="font-semibold text-[#1F2937]">{vehicle.fuel ?? 0}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#6B7280]" />
                  <div>
                    <p className="text-xs text-[#6B7280]">Пройдено</p>
                    <p className="font-semibold text-[#1F2937]">{vehicle.mileage ?? 0} км</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#6B7280]" />
                  <div>
                    <p className="text-xs text-[#6B7280]">Обновлено</p>
                    <p className="font-semibold text-[#1F2937]">{vehicle.lastUpdate}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-4 gap-2">
            {statusActions.map((action) => (
              <Button
                key={action.status}
                variant={vehicle.status === action.status ? "default" : "outline"}
                className={vehicle.status === action.status ? "bg-[#4DA6FF] hover:bg-[#4DA6FF]/90 text-xs" : "text-xs"}
                onClick={() => setStatus(action.status)}
              >
                {action.label}
              </Button>
            ))}
          </div>

          <Card className="p-4">
            <Tabs defaultValue="movement">
              <TabsList className="w-full grid grid-cols-4 bg-[#F8FBFF] mb-4">
                <TabsTrigger value="movement" className="text-xs">Движение</TabsTrigger>
                <TabsTrigger value="speed" className="text-xs">Скорость</TabsTrigger>
                <TabsTrigger value="stops" className="text-xs">Остановки</TabsTrigger>
                <TabsTrigger value="comments" className="text-xs">Чат</TabsTrigger>
              </TabsList>

              <TabsContent value="movement">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#22C55E] mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1F2937]">{route?.name ?? "Маршрут не назначен"}</p>
                    <p className="text-xs text-[#6B7280]">
                      {route ? `${route.start} → ${route.end}` : "Назначьте маршрут на экране маршрутов"}
                    </p>
                    <div className="mt-2 h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                      <div className="h-full bg-[#4DA6FF]" style={{ width: `${route?.progress ?? 0}%` }} />
                    </div>
                    <p className="text-xs text-[#6B7280] mt-1">{route?.progress ?? 0}% выполнено</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="speed">
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={speedHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="time" stroke="#6B7280" fontSize={10} />
                    <YAxis stroke="#6B7280" fontSize={10} />
                    <Tooltip />
                    <Line type="monotone" dataKey="speed" stroke="#4DA6FF" strokeWidth={2} dot={{ fill: "#4DA6FF", r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="stops">
                <div className="space-y-3">
                  {stops.map((stop, index) => (
                    <div key={`${stop.location}-${index}`} className="flex gap-3 pb-3 border-b border-[#E5E7EB] last:border-0">
                      <div className="text-center">
                        <Clock className="w-4 h-4 text-[#4DA6FF] mx-auto mb-1" />
                        <p className="text-xs font-medium text-[#1F2937]">{stop.time}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#1F2937]">{stop.location}</p>
                        <p className="text-xs text-[#6B7280]">Длительность: {stop.duration}</p>
                      </div>
                    </div>
                  ))}
                  {stops.length === 0 && <p className="text-sm text-[#6B7280]">Остановок пока нет</p>}
                </div>
              </TabsContent>

              <TabsContent value="comments">
                <div className="space-y-3 mb-4">
                  {vehicleComments.map((comment, index) => {
                    const mine = comment.author === "Диспетчер";
                    return (
                      <div key={`${comment.time}-${index}`} className={`flex gap-2 ${mine ? "flex-row-reverse" : ""}`}>
                        <div className={`flex-1 rounded-2xl p-3 ${mine ? "bg-[#4DA6FF] text-white" : "bg-[#F3F4F6] text-[#1F2937]"}`}>
                          <p className="text-xs font-medium mb-1">{comment.author}</p>
                          <p className="text-sm">{comment.text}</p>
                          <p className={`text-xs mt-1 ${mine ? "text-white/70" : "text-[#6B7280]"}`}>{comment.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Написать сообщение..."
                    className="flex-1"
                  />
                  <Button size="icon" onClick={submitMessage} className="bg-[#4DA6FF] hover:bg-[#4DA6FF]/90">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
