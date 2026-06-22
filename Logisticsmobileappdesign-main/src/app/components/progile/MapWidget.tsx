import { Card } from "../ui/card";
import { MapPin, Maximize2 } from "lucide-react";
import { motion } from "motion/react";

interface MapWidgetProps {
  mini?: boolean;
  markers?: Array<{ lat: number; lng: number; label: string }>;
  onExpand?: () => void;
}

export function MapWidget({ mini = false, markers = [], onExpand }: MapWidgetProps) {
  return (
    <Card className={`relative overflow-hidden ${mini ? 'h-48' : 'h-80'}`}>
      {/* Map placeholder with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#DDEFFF] to-[#4DA6FF]/20">
        {/* Grid pattern */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(77, 166, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(77, 166, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Mock markers */}
        <div className="absolute inset-0 flex items-center justify-center">
          {markers.length === 0 ? (
            <>
              <motion.div
                className="absolute"
                style={{ left: '30%', top: '40%' }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <MapPin className="w-8 h-8 text-[#22C55E] drop-shadow-lg" fill="#22C55E" />
              </motion.div>

              <motion.div
                className="absolute"
                style={{ left: '60%', top: '50%' }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
              >
                <MapPin className="w-8 h-8 text-[#4DA6FF] drop-shadow-lg" fill="#4DA6FF" />
              </motion.div>

              <motion.div
                className="absolute"
                style={{ left: '45%', top: '65%' }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, delay: 1, repeat: Infinity }}
              >
                <MapPin className="w-8 h-8 text-[#F59E0B] drop-shadow-lg" fill="#F59E0B" />
              </motion.div>
            </>
          ) : (
            markers.map((marker, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{ left: `${marker.lat}%`, top: `${marker.lng}%` }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
              >
                <MapPin className="w-8 h-8 text-[#4DA6FF] drop-shadow-lg" fill="#4DA6FF" />
              </motion.div>
            ))
          )}
        </div>

        {/* Route line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path
            d="M 30% 40% Q 45% 50% 60% 50%"
            stroke="#4DA6FF"
            strokeWidth="3"
            fill="none"
            strokeDasharray="5,5"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Expand button */}
      {onExpand && (
        <button
          onClick={onExpand}
          className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#F8FBFF] transition-colors"
        >
          <Maximize2 className="w-5 h-5 text-[#4DA6FF]" />
        </button>
      )}

      {/* Stats overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
        <div className="flex gap-4 text-white text-sm">
          <div>
            <div className="text-xs opacity-80">Активных</div>
            <div className="font-semibold">12 ТС</div>
          </div>
          <div>
            <div className="text-xs opacity-80">На маршруте</div>
            <div className="font-semibold">8 ТС</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
