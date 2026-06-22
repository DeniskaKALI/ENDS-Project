import { Card } from "../ui/card";
import { LucideIcon } from "lucide-react";

interface StatItem {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  color?: string;
}

interface QuickStatsProps {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
}

export function QuickStats({ stats, columns = 2 }: QuickStatsProps) {
  const gridClass = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4"
  }[columns];

  return (
    <div className={`grid ${gridClass} gap-3`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <Card key={index} className="p-3 text-center">
            {Icon && (
              <div
                className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"
                style={{
                  backgroundColor: (stat.color || "#4DA6FF") + "20"
                }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{ color: stat.color || "#4DA6FF" }}
                />
              </div>
            )}
            <p className="text-2xl font-semibold text-[#1F2937]">{stat.value}</p>
            <p className="text-xs text-[#6B7280] mt-1">{stat.label}</p>
          </Card>
        );
      })}
    </div>
  );
}
