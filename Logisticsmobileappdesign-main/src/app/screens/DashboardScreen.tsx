import { KPIWidget, MapWidget, AlertCard, LiveIndicator } from "../components/progile";
import { Truck, Route, CheckCircle, AlertTriangle, Gauge, TrendingUp, RefreshCw } from "lucide-react";
import { ScrollArea } from "../components/ui/scroll-area";
import { Button } from "../components/ui/button";
import { useProgile } from "../state/ProgileProvider";

export function DashboardScreen() {
  const { vehicles, routes, alerts, lastSync, simulateSync } = useProgile();
  const activeVehicles = vehicles.filter((vehicle) => vehicle.status === "MOVING").length;
  const stoppedVehicles = vehicles.filter((vehicle) => vehicle.status === "STOPPED").length;
  const offRouteVehicles = vehicles.filter((vehicle) => vehicle.status === "OFF_ROUTE").length;
  const maintenanceVehicles = vehicles.filter((vehicle) => vehicle.status === "MAINTENANCE").length;
  const activeRoutes = routes.filter((route) => route.status === "ACTIVE").length;
  const completedRoutes = routes.filter((route) => route.status === "COMPLETED").length;
  const avgSpeed = Math.round(
    vehicles.reduce((sum, vehicle) => sum + vehicle.speed, 0) / Math.max(vehicles.length, 1)
  );
  const efficiency = Math.round((completedRoutes / Math.max(routes.length, 1)) * 100);

  const kpiData = [
    { title: "Активные ТС", value: activeVehicles, icon: Truck, color: "#4DA6FF", trend: 5 },
    { title: "Активные маршруты", value: activeRoutes, icon: Route, color: "#22C55E", trend: 12 },
    { title: "Завершено", value: completedRoutes, icon: CheckCircle, color: "#8B5CF6", trend: -3 },
    { title: "Уведомления", value: alerts.filter((alert) => !alert.read).length, icon: AlertTriangle, color: "#F59E0B" },
    { title: "Средняя скорость", value: `${avgSpeed} км/ч`, icon: Gauge, color: "#4DA6FF" },
    { title: "Эффективность", value: `${efficiency}%`, icon: TrendingUp, color: "#22C55E", trend: 8 }
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-4 pb-20 space-y-6 max-w-screen-sm mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="text-2xl font-semibold text-[#1F2937] mb-1">
                Главная
              </h1>
              <p className="text-sm text-[#6B7280]">
                Синхронизация: {lastSync}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <LiveIndicator status="active" />
              <Button size="sm" variant="outline" onClick={simulateSync} className="h-8 text-xs">
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                GPS
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          {kpiData.map((kpi, index) => (
            <KPIWidget
              key={index}
              title={kpi.title}
              value={kpi.value}
              icon={kpi.icon}
              color={kpi.color}
              trend={kpi.trend}
              mini
            />
          ))}
        </div>

        {/* Live Status */}
        <div>
          <h2 className="font-semibold text-[#1F2937] mb-3">Статус в реальном времени</h2>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-white rounded-2xl p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                <span className="text-xs text-[#6B7280]">В движении</span>
              </div>
              <p className="text-xl font-semibold text-[#1F2937]">{activeVehicles}</p>
            </div>
            <div className="bg-white rounded-2xl p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-[#9CA3AF]" />
                <span className="text-xs text-[#6B7280]">Остановка</span>
              </div>
              <p className="text-xl font-semibold text-[#1F2937]">{stoppedVehicles}</p>
            </div>
            <div className="bg-white rounded-2xl p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
                <span className="text-xs text-[#6B7280]">Вне маршрута</span>
              </div>
              <p className="text-xl font-semibold text-[#1F2937]">{offRouteVehicles}</p>
            </div>
            <div className="bg-white rounded-2xl p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <span className="text-xs text-[#6B7280]">Тех. обслуж.</span>
              </div>
              <p className="text-xl font-semibold text-[#1F2937]">{maintenanceVehicles}</p>
            </div>
          </div>
        </div>

        {/* Map Widget */}
        <div>
          <h2 className="font-semibold text-[#1F2937] mb-3">Карта транспорта</h2>
          <MapWidget mini />
        </div>

        {/* Alerts Feed */}
        <div>
          <h2 className="font-semibold text-[#1F2937] mb-3">Уведомления</h2>
          <div className="space-y-3">
            {alerts.slice(0, 4).map((alert) => (
              <AlertCard key={alert.id} {...alert} />
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
