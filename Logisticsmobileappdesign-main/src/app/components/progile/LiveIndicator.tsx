import { motion } from "motion/react";

interface LiveIndicatorProps {
  status: "active" | "inactive";
  label?: string;
}

export function LiveIndicator({ status, label = "LIVE" }: LiveIndicatorProps) {
  return (
    <div className="inline-flex items-center gap-2 bg-white rounded-full px-3 py-1 shadow-md">
      <motion.div
        className={`w-2 h-2 rounded-full ${
          status === "active" ? "bg-[#EF4444]" : "bg-[#9CA3AF]"
        }`}
        animate={
          status === "active"
            ? {
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1]
              }
            : {}
        }
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <span className="text-xs font-semibold text-[#1F2937]">{label}</span>
    </div>
  );
}
