import { Bell, Menu } from "lucide-react";
import { Badge } from "../ui/badge";

interface AppBarProps {
  title: string;
  subtitle?: string;
  onNotifications?: () => void;
  onMenu?: () => void;
  notificationCount?: number;
}

export function AppBar({
  title,
  subtitle,
  onNotifications,
  onMenu,
  notificationCount = 0
}: AppBarProps) {
  return (
    <div className="bg-white border-b border-[#E5E7EB] px-4 py-3">
      <div className="flex items-center justify-between max-w-screen-sm mx-auto">
        <div className="flex items-center gap-3">
          {onMenu && (
            <button
              onClick={onMenu}
              className="w-10 h-10 rounded-full hover:bg-[#F8FBFF] flex items-center justify-center transition-colors"
            >
              <Menu className="w-5 h-5 text-[#1F2937]" />
            </button>
          )}

          <div>
            <h1 className="text-lg font-semibold text-[#1F2937]">{title}</h1>
            {subtitle && (
              <p className="text-sm text-[#6B7280]">{subtitle}</p>
            )}
          </div>
        </div>

        {onNotifications && (
          <button
            onClick={onNotifications}
            className="relative w-10 h-10 rounded-full hover:bg-[#F8FBFF] flex items-center justify-center transition-colors"
          >
            <Bell className="w-5 h-5 text-[#1F2937]" />
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-[#EF4444] text-white text-xs">
                {notificationCount > 9 ? '9+' : notificationCount}
              </Badge>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
