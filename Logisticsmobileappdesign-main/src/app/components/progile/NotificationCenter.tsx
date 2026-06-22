import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Bell,
  X,
  AlertTriangle,
  WifiOff,
  Activity,
  Clock as ClockIcon,
  CheckCircle2
} from "lucide-react";
import type { Alert } from "../../types";

interface NotificationCenterProps {
  onClose: () => void;
  notifications: Alert[];
  onMarkAllRead: () => void;
  onClear: () => void;
}

const iconMap = {
  speed_violation: Activity,
  route_deviation: AlertTriangle,
  long_stop: ClockIcon,
  gps_lost: WifiOff
};

const severityConfig = {
  info: { color: "#4DA6FF", bg: "#DDEFFF" },
  warning: { color: "#F59E0B", bg: "#FEF3C7" },
  error: { color: "#EF4444", bg: "#FEE2E2" },
  success: { color: "#22C55E", bg: "#D1FAE5" }
};

export function NotificationCenter({
  onClose,
  notifications,
  onMarkAllRead,
  onClear
}: NotificationCenterProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center sm:justify-center">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-[#4DA6FF]" />
            <h2 className="text-lg font-semibold text-[#1F2937]">Уведомления</h2>
            {unreadCount > 0 && (
              <Badge className="bg-[#EF4444] text-white">{unreadCount}</Badge>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#F8FBFF] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        {/* Actions */}
        <div className="p-4 border-b border-[#E5E7EB] flex gap-2">
          <Button variant="outline" size="sm" className="text-xs" onClick={onMarkAllRead}>
            Отметить все прочитанными
          </Button>
          <Button variant="outline" size="sm" className="text-xs" onClick={onClear}>
            Очистить все
          </Button>
        </div>

        {/* Notifications List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {notifications.length === 0 && (
              <Card className="p-6 text-center">
                <CheckCircle2 className="w-8 h-8 text-[#22C55E] mx-auto mb-2" />
                <p className="text-sm text-[#6B7280]">Новых событий нет</p>
              </Card>
            )}

            {notifications.map((notification) => {
              const Icon = iconMap[notification.type as keyof typeof iconMap] ?? Bell;
              const severityStyle = severityConfig[notification.severity];

              return (
                <Card
                  key={notification.id}
                  className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                    !notification.read ? 'border-l-4' : ''
                  }`}
                  style={!notification.read ? { borderLeftColor: severityStyle.color } : {}}
                >
                  <div className="flex gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: severityStyle.bg }}
                    >
                      <Icon className="w-5 h-5" style={{ color: severityStyle.color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={`text-sm ${!notification.read ? "font-semibold" : "font-medium"} text-[#1F2937]`}>
                          {notification.title ?? "Событие мониторинга"}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-[#4DA6FF]" />
                        )}
                      </div>
                      <p className="text-sm text-[#6B7280] mb-1">{notification.message}</p>
                      <p className="text-xs text-[#9CA3AF]">{notification.timestamp}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
