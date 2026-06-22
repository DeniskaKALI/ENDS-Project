import { LayoutDashboard, Truck, Route, BarChart3, User } from "lucide-react";
import { motion } from "motion/react";

interface BottomNavProps {
  active: string;
  onNavigate: (screen: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Главная", icon: LayoutDashboard },
  { id: "transport", label: "Транспорт", icon: Truck },
  { id: "routes", label: "Маршруты", icon: Route },
  { id: "reports", label: "Отчёты", icon: BarChart3 },
  { id: "profile", label: "Профиль", icon: User }
];

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] shadow-lg z-50">
      <div className="flex items-center justify-around px-2 py-2 max-w-screen-sm mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center justify-center gap-1 px-4 py-2 min-w-[60px] relative"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#4DA6FF] rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              <Icon
                className={`w-6 h-6 transition-colors ${
                  isActive ? 'text-[#4DA6FF]' : 'text-[#9CA3AF]'
                }`}
              />

              <span
                className={`text-xs transition-colors ${
                  isActive ? 'text-[#4DA6FF] font-medium' : 'text-[#6B7280]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
