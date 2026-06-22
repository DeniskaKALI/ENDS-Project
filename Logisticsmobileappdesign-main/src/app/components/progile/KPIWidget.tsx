import { Card } from "../ui/card";
import { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface KPIWidgetProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  color?: string;
  mini?: boolean;
}

export function KPIWidget({
  title,
  value,
  icon: Icon,
  trend,
  color = "#4DA6FF",
  mini = false
}: KPIWidgetProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className={`${mini ? 'p-3' : 'p-4'} bg-white`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-[#6B7280] mb-1">{title}</p>
            <p className={`${mini ? 'text-xl' : 'text-2xl'} font-semibold text-[#1F2937]`}>
              {value}
            </p>
            {trend !== undefined && (
              <div className={`text-xs mt-1 ${trend >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </div>
            )}
          </div>
          <div
            className={`${mini ? 'w-10 h-10' : 'w-12 h-12'} rounded-2xl flex items-center justify-center`}
            style={{ backgroundColor: color + '20' }}
          >
            <Icon className={`${mini ? 'w-5 h-5' : 'w-6 h-6'}`} style={{ color }} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
