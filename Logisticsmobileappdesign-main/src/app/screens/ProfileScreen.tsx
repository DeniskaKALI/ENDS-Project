import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { Switch } from "../components/ui/switch";
import { useProgile } from "../state/ProgileProvider";
import {
  Bell,
  Building2,
  ChevronRight,
  Globe,
  HelpCircle,
  LogOut,
  Moon,
  Shield,
  User
} from "lucide-react";
import type { RoleName } from "../types";

const roleLabels: Record<RoleName, string> = {
  DISPATCHER: "Диспетчер",
  LOGIST: "Логист",
  ADMIN: "Администратор",
  MANAGER: "Руководитель",
  DRIVER: "Водитель"
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function ProfileScreen() {
  const { user, vehicles, routes, settings, updateSettings, logout } = useProgile();

  if (!user) return null;

  const settingsSections = [
    {
      title: "Настройки",
      items: [
        {
          icon: Bell,
          label: "Уведомления",
          type: "toggle" as const,
          value: settings.notifications,
          onChange: (value: boolean) => updateSettings({ notifications: value })
        },
        {
          icon: Moon,
          label: "Тёмная тема",
          type: "toggle" as const,
          value: settings.darkMode,
          onChange: (value: boolean) => updateSettings({ darkMode: value })
        },
        {
          icon: Globe,
          label: "Язык",
          type: "link" as const,
          value: settings.language
        }
      ]
    },
    {
      title: "Поддержка",
      items: [
        { icon: Shield, label: "Политика конфиденциальности", type: "link" as const },
        { icon: HelpCircle, label: "Помощь и поддержка", type: "link" as const }
      ]
    }
  ];

  return (
    <div className="h-full flex flex-col bg-[#F8FBFF]">
      <div className="p-4 pb-6 bg-gradient-to-br from-[#4DA6FF] to-[#4DA6FF]/80">
        <h1 className="text-2xl font-semibold text-white mb-6">Профиль</h1>

        <Card className="p-4">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-[#DDEFFF] text-[#4DA6FF] text-xl font-semibold">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h2 className="font-semibold text-[#1F2937] mb-1">{user.fullName}</h2>
              <Badge className="bg-[#4DA6FF] text-white mb-2">{roleLabels[user.role]}</Badge>
              <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                <Building2 className="w-4 h-4" />
                <span>{user.company}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 pb-20 space-y-4 max-w-screen-sm mx-auto">
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-3 text-center">
              <p className="text-2xl font-semibold text-[#1F2937]">{routes.length}</p>
              <p className="text-xs text-[#6B7280] mt-1">Рейсов</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-2xl font-semibold text-[#1F2937]">{vehicles.length}</p>
              <p className="text-xs text-[#6B7280] mt-1">Транспорта</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-2xl font-semibold text-[#1F2937]">4.8</p>
              <p className="text-xs text-[#6B7280] mt-1">Рейтинг</p>
            </Card>
          </div>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#DDEFFF] flex items-center justify-center">
                <User className="w-5 h-5 text-[#4DA6FF]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#1F2937]">{user.email}</p>
                <p className="text-xs text-[#6B7280] truncate">JWT: {user.token.slice(0, 16)}...</p>
              </div>
            </div>
          </Card>

          {settingsSections.map((section, sectionIndex) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-[#6B7280] mb-2 px-1">{section.title}</h3>
              <Card>
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={`${sectionIndex}-${item.label}`}
                      className={`flex items-center justify-between p-4 ${
                        itemIndex !== section.items.length - 1 ? "border-b border-[#E5E7EB]" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#F8FBFF] flex items-center justify-center">
                          <Icon className="w-5 h-5 text-[#4DA6FF]" />
                        </div>
                        <span className="text-[#1F2937]">{item.label}</span>
                      </div>

                      {item.type === "toggle" && (
                        <Switch checked={item.value as boolean} onCheckedChange={item.onChange} />
                      )}

                      {item.type === "link" && (
                        <div className="flex items-center gap-2">
                          {"value" in item && item.value && (
                            <span className="text-sm text-[#6B7280]">{item.value}</span>
                          )}
                          <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </Card>
            </div>
          ))}

          <Button
            variant="outline"
            className="w-full text-[#EF4444] border-[#EF4444]/30 hover:bg-[#EF4444]/10"
            onClick={logout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Выйти из аккаунта
          </Button>

          <p className="text-center text-xs text-[#9CA3AF] mt-4">Progile Mobile v1.0.0</p>
        </div>
      </ScrollArea>
    </div>
  );
}
