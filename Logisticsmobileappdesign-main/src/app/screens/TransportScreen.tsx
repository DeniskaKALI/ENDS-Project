import { useState } from "react";
import { Plus, Truck, X } from "lucide-react";
import { TransportCard, SearchBar, EmptyState } from "../components/progile";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ScrollArea } from "../components/ui/scroll-area";
import { useProgile } from "../state/ProgileProvider";
import type { Vehicle, VehicleStatus } from "../types";

interface TransportScreenProps {
  onVehicleClick?: (vehicleId: string) => void;
}

type StatusFilter = "all" | VehicleStatus;

const statusFilters: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "Все" },
  { value: "MOVING", label: "В пути" },
  { value: "STOPPED", label: "Стоит" },
  { value: "OFF_ROUTE", label: "Сбой" },
  { value: "MAINTENANCE", label: "ТО" }
];

const emptyForm = {
  plateNumber: "",
  model: "",
  driver: "",
  type: "Грузовой",
  status: "MOVING" as VehicleStatus,
  speed: 0,
  fuel: 70
};

function vehicleToForm(vehicle: Vehicle) {
  return {
    plateNumber: vehicle.plateNumber,
    model: vehicle.model,
    driver: vehicle.driver,
    type: vehicle.type ?? "Грузовой",
    status: vehicle.status,
    speed: vehicle.speed,
    fuel: vehicle.fuel ?? 70
  };
}

export function TransportScreen({ onVehicleClick }: TransportScreenProps = {}) {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useProgile();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [form, setForm] = useState(emptyForm);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filteredVehicles = vehicles.filter((vehicle) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      vehicle.plateNumber.toLowerCase().includes(query) ||
      vehicle.driver.toLowerCase().includes(query) ||
      vehicle.model.toLowerCase().includes(query);
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openCreateForm = () => {
    setForm(emptyForm);
    setEditingVehicle(null);
    setShowForm(true);
  };

  const openEditForm = (vehicle: Vehicle) => {
    setForm(vehicleToForm(vehicle));
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const submitForm = () => {
    const ok = editingVehicle
      ? updateVehicle(editingVehicle.plateNumber, form)
      : addVehicle(form);

    if (ok) {
      setShowForm(false);
      setEditingVehicle(null);
      setForm(emptyForm);
    }
  };

  const removeVehicle = (plateNumber: string) => {
    if (window.confirm(`Удалить транспорт ${plateNumber}?`)) {
      deleteVehicle(plateNumber);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 pb-3 bg-white border-b border-[#E5E7EB]">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <h1 className="text-2xl font-semibold text-[#1F2937]">Транспорт</h1>
            <p className="text-xs text-[#6B7280]">CRUD и мониторинг автопарка</p>
          </div>
          <Button size="icon" onClick={openCreateForm} className="bg-[#4DA6FF] hover:bg-[#4DA6FF]/90">
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Поиск по номеру, водителю или модели..."
        />

        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {statusFilters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setStatusFilter(item.value)}
              className={`h-9 px-3 rounded-full text-sm whitespace-nowrap transition-colors ${
                statusFilter === item.value
                  ? "bg-[#4DA6FF] text-white"
                  : "bg-[#F3F4F6] text-[#6B7280]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex gap-4 mt-3 text-sm">
          <div>
            <span className="text-[#6B7280]">Всего: </span>
            <span className="font-semibold text-[#1F2937]">{vehicles.length}</span>
          </div>
          <div>
            <span className="text-[#6B7280]">В движении: </span>
            <span className="font-semibold text-[#22C55E]">
              {vehicles.filter((vehicle) => vehicle.status === "MOVING").length}
            </span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 pb-20 space-y-3 max-w-screen-sm mx-auto">
          {filteredVehicles.map((vehicle) => (
            <TransportCard
              key={vehicle.plateNumber}
              {...vehicle}
              onClick={() => onVehicleClick?.(vehicle.plateNumber)}
              onEdit={() => openEditForm(vehicle)}
              onDelete={() => removeVehicle(vehicle.plateNumber)}
            />
          ))}

          {filteredVehicles.length === 0 && (
            <EmptyState
              icon={Truck}
              title="Транспорт не найден"
              description="Измените фильтр или добавьте новое транспортное средство"
            />
          )}
        </div>
      </ScrollArea>

      {showForm && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-end sm:items-center sm:justify-center">
          <Card className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#1F2937]">
                {editingVehicle ? "Редактировать транспорт" : "Добавить транспорт"}
              </h2>
              <Button size="icon" variant="ghost" onClick={() => setShowForm(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="plateNumber">Госномер</Label>
                <Input
                  id="plateNumber"
                  value={form.plateNumber}
                  onChange={(event) => setForm((current) => ({ ...current, plateNumber: event.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="model">Модель</Label>
                  <Input
                    id="model"
                    value={form.model}
                    onChange={(event) => setForm((current) => ({ ...current, model: event.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="type">Тип</Label>
                  <Input
                    id="type"
                    value={form.type}
                    onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="driver">Водитель</Label>
                <Input
                  id="driver"
                  value={form.driver}
                  onChange={(event) => setForm((current) => ({ ...current, driver: event.target.value }))}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="status">Статус</Label>
                  <select
                    id="status"
                    value={form.status}
                    onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as VehicleStatus }))}
                    className="h-10 w-full rounded-md border border-[#E5E7EB] bg-white px-2 text-sm outline-none focus:ring-2 focus:ring-[#4DA6FF]/30"
                  >
                    <option value="MOVING">В пути</option>
                    <option value="STOPPED">Стоит</option>
                    <option value="OFF_ROUTE">Сбой</option>
                    <option value="MAINTENANCE">ТО</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="speed">Км/ч</Label>
                  <Input
                    id="speed"
                    type="number"
                    value={form.speed}
                    onChange={(event) => setForm((current) => ({ ...current, speed: Number(event.target.value) }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fuel">Топливо</Label>
                  <Input
                    id="fuel"
                    type="number"
                    value={form.fuel}
                    onChange={(event) => setForm((current) => ({ ...current, fuel: Number(event.target.value) }))}
                  />
                </div>
              </div>

              <Button onClick={submitForm} className="w-full bg-[#4DA6FF] hover:bg-[#4DA6FF]/90">
                {editingVehicle ? "Сохранить" : "Добавить"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
