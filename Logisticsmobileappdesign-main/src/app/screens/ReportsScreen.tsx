import { useState } from "react";
import { Award, Download, FileSpreadsheet, FileText, Server, Sheet } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { useProgile } from "../state/ProgileProvider";
import type { ReportFormat } from "../types";

export function ReportsScreen() {
  const { vehicles, routes, apiEndpoints, exportReport } = useProgile();
  const [activeTab, setActiveTab] = useState("routes");

  const completedRoutes = routes.filter((route) => route.status === "COMPLETED").length;
  const activeRoutes = routes.filter((route) => route.status === "ACTIVE").length;
  const plannedRoutes = routes.filter((route) => route.status === "PLANNED").length;
  const avgSpeed = Math.round(
    vehicles.reduce((sum, vehicle) => sum + vehicle.speed, 0) / Math.max(vehicles.length, 1)
  );
  const mileage = vehicles.reduce((sum, vehicle) => sum + (vehicle.mileage ?? 0), 0);

  const routeData = [
    { status: "План", count: plannedRoutes, target: Math.max(plannedRoutes, 2) },
    { status: "Актив", count: activeRoutes, target: Math.max(activeRoutes + 1, 3) },
    { status: "Готово", count: completedRoutes, target: Math.max(completedRoutes + 1, 3) }
  ];

  const speedData = vehicles.map((vehicle) => ({
    vehicle: vehicle.plateNumber,
    avg: vehicle.speed
  }));

  const exportButtons: Array<{ label: string; format: ReportFormat; icon: typeof FileText; color: string }> = [
    { label: "PDF", format: "pdf", icon: FileText, color: "#EF4444" },
    { label: "Excel", format: "xlsx", icon: Sheet, color: "#22C55E" },
    { label: "CSV", format: "csv", icon: FileSpreadsheet, color: "#4DA6FF" }
  ];

  const topDrivers = [...vehicles]
    .sort((a, b) => (b.mileage ?? 0) - (a.mileage ?? 0))
    .slice(0, 3)
    .map((vehicle, index) => ({
      name: vehicle.driver,
      trips: Math.max(8, Math.round((vehicle.mileage ?? 100) / 22)),
      rating: (4.9 - index * 0.1).toFixed(1)
    }));

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 pb-3 bg-white border-b border-[#E5E7EB]">
        <h1 className="text-2xl font-semibold text-[#1F2937] mb-3">Отчёты</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-4 bg-[#F8FBFF]">
            <TabsTrigger value="routes" className="text-xs">Маршруты</TabsTrigger>
            <TabsTrigger value="drivers" className="text-xs">Водители</TabsTrigger>
            <TabsTrigger value="vehicles" className="text-xs">Транспорт</TabsTrigger>
            <TabsTrigger value="api" className="text-xs">API</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 pb-20 space-y-4 max-w-screen-sm mx-auto">
          <Card className="p-4">
            <h3 className="font-semibold text-[#1F2937] mb-4">Сводка мониторинга</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[#6B7280]">Завершено</p>
                <p className="text-2xl font-semibold text-[#1F2937]">{completedRoutes}</p>
                <p className="text-xs text-[#22C55E]">маршрутов</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">В работе</p>
                <p className="text-2xl font-semibold text-[#1F2937]">{activeRoutes}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Средняя скорость</p>
                <p className="text-2xl font-semibold text-[#1F2937]">{avgSpeed} км/ч</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Пробег</p>
                <p className="text-2xl font-semibold text-[#1F2937]">{mileage} км</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold text-[#1F2937] mb-4">Выполнение маршрутов</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={routeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="status" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#4DA6FF" radius={[8, 8, 0, 0]} />
                <Bar dataKey="target" fill="#DDEFFF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold text-[#1F2937] mb-4">Скорость по транспорту</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={speedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="vehicle" stroke="#6B7280" fontSize={11} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="avg" stroke="#4DA6FF" strokeWidth={3} dot={{ fill: "#4DA6FF", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold text-[#1F2937] mb-3">Экспорт отчёта</h3>
            <div className="space-y-2">
              {exportButtons.map((btn) => {
                const Icon = btn.icon;
                return (
                  <Button
                    key={btn.format}
                    variant="outline"
                    className="w-full justify-start gap-3"
                    style={{ borderColor: `${btn.color}40` }}
                    onClick={() => exportReport(btn.format)}
                  >
                    <Icon className="w-5 h-5" style={{ color: btn.color }} />
                    <span>Скачать {btn.label}</span>
                    <Download className="w-4 h-4 ml-auto text-[#6B7280]" />
                  </Button>
                );
              })}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold text-[#1F2937] mb-3">Топ водителей</h3>
            <div className="space-y-3">
              {topDrivers.map((driver, index) => (
                <div key={driver.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#DDEFFF] flex items-center justify-center font-semibold text-[#4DA6FF]">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-[#1F2937]">{driver.name}</p>
                      <p className="text-xs text-[#6B7280]">{driver.trips} рейсов</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-[#F59E0B]">
                    <Award className="w-4 h-4" />
                    {driver.rating}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#DDEFFF] flex items-center justify-center">
                <Server className="w-5 h-5 text-[#4DA6FF]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1F2937]">REST API</h3>
                <p className="text-xs text-[#6B7280]">{apiEndpoints.length} эндпоинтов для Spring Boot backend</p>
              </div>
            </div>
            <div className="space-y-2">
              {apiEndpoints.slice(0, 5).map((endpoint) => (
                <div key={`${endpoint.method}-${endpoint.path}`} className="flex items-start gap-2 text-xs">
                  <span className="min-w-12 rounded-full bg-[#F3F4F6] px-2 py-1 text-center font-semibold text-[#4DA6FF]">
                    {endpoint.method}
                  </span>
                  <div>
                    <p className="font-medium text-[#1F2937]">{endpoint.path}</p>
                    <p className="text-[#6B7280]">{endpoint.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
