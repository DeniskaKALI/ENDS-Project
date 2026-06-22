import { WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface OfflineIndicatorProps {
  isOffline: boolean;
}

export function OfflineIndicator({ isOffline }: OfflineIndicatorProps) {
  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-[#F59E0B] text-white py-2 px-4 flex items-center justify-center gap-2 text-sm font-medium"
        >
          <WifiOff className="w-4 h-4" />
          <span>Нет подключения к интернету</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
