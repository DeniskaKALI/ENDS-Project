import { useState } from "react";
import { MapPin, Plus, X } from "lucide-react";
import { RouteCard, EmptyState } from "../components/progile";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ScrollArea } from "../components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useProgile } from "../state/ProgileProvider";
import type { Route, RouteStatus } from "../types";

interface RoutesScreenProps {
  onRouteClick?: (routeId: string) => void;
}

const emptyForm = {
  name: "",
  start: "",
  end: "",
  status: "PLANNED" as RouteStatus,
  vehicle: "",
  eta: "",
  progress: 0
};

function routeToForm(route: Route) {
  return {
    name: route.name,
    start: route.start,
    end: route.end,
    status: route.status,
    vehicle: route.vehicle ?? "",
    eta: route.eta ?? "",
    progress: route.progress
  };
}

export function RoutesScreen({ onRouteClick }: RoutesScreenProps = {}) {
  const { routes, vehicles, addRoute, updateRoute, deleteRoute } = useProgile();
  const [activeTab, setActiveTab] = useState("active");
  const [showForm, setShowForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filterRoutes = (status: string) => {
    if (status === "all") return routes;
    return routes.filter((route) => route.status.toLowerCase() === status);
  };

  const filteredRoutes = filterRoutes(activeTab);

  const openCreateForm = () => {
    setForm(emptyForm);
    setEditingRoute(null);
    setShowForm(true);
  };

  const openEditForm = (route: Route) => {
    setForm(routeToForm(route));
    setEditingRoute(route);
    setShowForm(true);
  };

  const submitForm = () => {
    const payload = { ...form, vehicle: form.vehicle || undefined, eta: form.eta || undefined };
    const ok = editingRoute ? updateRoute(editingRoute.id, payload) : addRoute(payload);
    if (ok) {
      setShowForm(false);
      setEditingRoute(null);
      setForm(emptyForm);
    }
  };

  const removeRoute = (route: Route) => {
    if (window.confirm(`Удалить маршрут «${route.name}»?`)) {
      deleteRoute(route.id);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 pb-3 bg-white border-b border-[#E5E7EB]">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <h1 className="text-2xl font-semibold text-[#1F2937]">Маршруты</h1>
            <p className="text-xs text-[#6B7280]">Планирование и контроль рейсов</p>
          </div>
          <Button size="icon" onClick={openCreateForm} className="bg-[#4DA6FF] hover:bg-[#4DA6FF]/90">
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-4 bg-[#F8FBFF]">
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="active">Активные</TabsTrigger>
            <TabsTrigger value="planned">План</TabsTrigger>
            <TabsTrigger value="completed">Готово</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 pb-20 space-y-3 max-w-screen-sm mx-auto">
          {filteredRoutes.map((route) => (
            <RouteCard
              key={route.id}
              {...route}
              onClick={() => onRouteClick?.(route.id)}
              onEdit={() => openEditForm(route)}
              onDelete={() => removeRoute(route)}
            />
          ))}

          {filteredRoutes.length === 0 && (
            <EmptyState
              icon={MapPin}
              title="Маршруты не найдены"
              description="Создайте маршрут или измените фильтр"
            />
          )}
        </div>
      </ScrollArea>

      {showForm && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-end sm:items-center sm:justify-center">
          <Card className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#1F2937]">
                {editingRoute ? "Редактировать маршрут" : "Создать маршрут"}
              </h2>
              <Button size="icon" variant="ghost" onClick={() => setShowForm(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="routeName">Название</Label>
                <Input
                  id="routeName"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="routeStart">Старт</Label>
                <Input
                  id="routeStart"
                  value={form.start}
                  onChange={(event) => setForm((current) => ({ ...current, start: event.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="routeEnd">Финиш</Label>
                <Input
                  id="routeEnd"
                  value={form.end}
                  onChange={(event) => setForm((current) => ({ ...current, end: event.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="routeStatus">Статус</Label>
                  <select
                    id="routeStatus"
                    value={form.status}
                    onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as RouteStatus }))}
                    className="h-10 w-full rounded-md border border-[#E5E7EB] bg-white px-2 text-sm outline-none focus:ring-2 focus:ring-[#4DA6FF]/30"
                  >
                    <option value="PLANNED">Запланирован</option>
                    <option value="ACTIVE">Активный</option>
                    <option value="COMPLETED">Завершён</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="routeVehicle">Транспорт</Label>
                  <select
                    id="routeVehicle"
                    value={form.vehicle}
                    onChange={(event) => setForm((current) => ({ ...current, vehicle: event.target.value }))}
                    className="h-10 w-full rounded-md border border-[#E5E7EB] bg-white px-2 text-sm outline-none focus:ring-2 focus:ring-[#4DA6FF]/30"
                  >
                    <option value="">Не назначен</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.plateNumber} value={vehicle.plateNumber}>
                        {vehicle.plateNumber}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="routeEta">ETA</Label>
                  <Input
                    id="routeEta"
                    value={form.eta}
                    onChange={(event) => setForm((current) => ({ ...current, eta: event.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="routeProgress">%</Label>
                  <Input
                    id="routeProgress"
                    type="number"
                    min={0}
                    max={100}
                    value={form.progress}
                    onChange={(event) => setForm((current) => ({ ...current, progress: Number(event.target.value) }))}
                  />
                </div>
              </div>

              <Button onClick={submitForm} className="w-full bg-[#4DA6FF] hover:bg-[#4DA6FF]/90">
                {editingRoute ? "Сохранить" : "Создать"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
