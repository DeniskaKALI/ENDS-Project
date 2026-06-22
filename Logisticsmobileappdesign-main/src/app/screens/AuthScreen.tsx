import { useState } from "react";
import { BarChart3, LockKeyhole, Route, ShieldCheck, Truck } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useProgile } from "../state/ProgileProvider";
import type { RoleName } from "../types";

const roles: Array<{ value: RoleName; label: string }> = [
  { value: "DISPATCHER", label: "Диспетчер" },
  { value: "LOGIST", label: "Логист" },
  { value: "ADMIN", label: "Администратор" },
  { value: "MANAGER", label: "Руководитель" },
  { value: "DRIVER", label: "Водитель" }
];

export function AuthScreen() {
  const { login, register } = useProgile();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [fullName, setFullName] = useState("Иванов Иван Иванович");
  const [email, setEmail] = useState("dispatcher@progile.ru");
  const [password, setPassword] = useState("demo123");
  const [role, setRole] = useState<RoleName>("DISPATCHER");

  const submit = () => {
    const payload = { fullName, email, password, role };
    if (mode === "login") {
      login(payload);
    } else {
      register(payload);
    }
  };

  return (
    <div className="min-h-full bg-[#F8FBFF] px-4 py-6 flex items-center justify-center">
      <div className="w-full max-w-screen-sm space-y-5">
        <div className="rounded-[28px] bg-[#4DA6FF] p-5 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold leading-tight">Progile Mobile</h1>
              <p className="text-sm text-white/80">Мониторинг транспорта</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-white/15 p-3">
              <Route className="w-5 h-5 mb-2" />
              <p className="text-xs text-white/80">Маршруты</p>
              <p className="font-semibold">Live</p>
            </div>
            <div className="rounded-2xl bg-white/15 p-3">
              <BarChart3 className="w-5 h-5 mb-2" />
              <p className="text-xs text-white/80">KPI</p>
              <p className="font-semibold">94%</p>
            </div>
            <div className="rounded-2xl bg-white/15 p-3">
              <ShieldCheck className="w-5 h-5 mb-2" />
              <p className="text-xs text-white/80">Роли</p>
              <p className="font-semibold">JWT</p>
            </div>
          </div>
        </div>

        <Card className="p-4">
          <div className="grid grid-cols-2 gap-2 mb-4 rounded-2xl bg-[#F3F4F6] p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`rounded-xl py-2 text-sm transition-colors ${
                mode === "login" ? "bg-white text-[#1F2937] shadow-sm" : "text-[#6B7280]"
              }`}
            >
              Вход
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`rounded-xl py-2 text-sm transition-colors ${
                mode === "register" ? "bg-white text-[#1F2937] shadow-sm" : "text-[#6B7280]"
              }`}
            >
              Регистрация
            </button>
          </div>

          <div className="space-y-3">
            {mode === "register" && (
              <div className="space-y-1.5">
                <Label htmlFor="fullName">ФИО</Label>
                <Input id="fullName" value={fullName} onChange={(event) => setFullName(event.target.value)} />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role">Роль</Label>
              <select
                id="role"
                value={role}
                onChange={(event) => setRole(event.target.value as RoleName)}
                className="h-10 w-full rounded-md border border-[#E5E7EB] bg-white px-3 text-sm text-[#1F2937] outline-none focus:ring-2 focus:ring-[#4DA6FF]/30"
              >
                {roles.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <Button onClick={submit} className="w-full bg-[#4DA6FF] hover:bg-[#4DA6FF]/90">
              <LockKeyhole className="w-4 h-4 mr-2" />
              {mode === "login" ? "Войти" : "Создать аккаунт"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
