import { useState } from "react";
import { BottomNav, NotificationCenter, AppBar, OfflineIndicator } from "./components/progile";
import { DashboardScreen } from "./screens/DashboardScreen";
import { TransportScreen } from "./screens/TransportScreen";
import { TransportDetailScreen } from "./screens/TransportDetailScreen";
import { RoutesScreen } from "./screens/RoutesScreen";
import { RouteDetailScreen } from "./screens/RouteDetailScreen";
import { ReportsScreen } from "./screens/ReportsScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { AuthScreen } from "./screens/AuthScreen";
import { Toaster } from "./components/ui/sonner";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import { ProgileProvider, useProgile } from "./state/ProgileProvider";

type Screen =
  | { type: "dashboard" }
  | { type: "transport" }
  | { type: "transport-detail"; id: string }
  | { type: "routes" }
  | { type: "route-detail"; id: string }
  | { type: "reports" }
  | { type: "profile" };

function ProgileShell() {
  const [screen, setScreen] = useState<Screen>({ type: "dashboard" });
  const [showNotifications, setShowNotifications] = useState(false);
  const isOnline = useOnlineStatus();
  const { alerts, user, markAllAlertsRead, clearAlerts } = useProgile();

  if (!user) {
    return (
      <>
        <AuthScreen />
        <Toaster position="top-center" />
      </>
    );
  }

  const handleNavigate = (screenId: string) => {
    setScreen({ type: screenId as any });
  };

  const getActiveScreen = () => {
    if (screen.type.includes("-detail")) {
      const baseType = screen.type.split("-")[0];
      return baseType;
    }
    return screen.type;
  };

  const showAppBar = !["dashboard", "profile"].includes(screen.type) && !screen.type.includes("-detail");

  const renderScreen = () => {
    switch (screen.type) {
      case "dashboard":
        return <DashboardScreen />;

      case "transport":
        return (
          <TransportScreen
            onVehicleClick={(id) => setScreen({ type: "transport-detail", id })}
          />
        );

      case "transport-detail":
        return <TransportDetailScreen id={screen.id} onBack={() => setScreen({ type: "transport" })} />;

      case "routes":
        return (
          <RoutesScreen
            onRouteClick={(id) => setScreen({ type: "route-detail", id })}
          />
        );

      case "route-detail":
        return <RouteDetailScreen id={screen.id} onBack={() => setScreen({ type: "routes" })} />;

      case "reports":
        return <ReportsScreen />;

      case "profile":
        return <ProfileScreen />;

      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="size-full flex flex-col bg-[#F8FBFF] max-w-screen-sm mx-auto relative">
      {/* Offline Indicator */}
      <OfflineIndicator isOffline={!isOnline} />

      {/* App Bar (for screens that need it) */}
      {showAppBar && (
        <AppBar
          title={
            screen.type === "transport" ? "Транспорт" :
            screen.type === "routes" ? "Маршруты" :
            screen.type === "reports" ? "Отчёты" :
            "Progile"
          }
          onNotifications={() => setShowNotifications(true)}
          notificationCount={alerts.filter((alert) => !alert.read).length}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {renderScreen()}
      </div>

      {/* Bottom Navigation (hide on detail screens) */}
      {!screen.type.includes("-detail") && (
        <BottomNav active={getActiveScreen()} onNavigate={handleNavigate} />
      )}

      {/* Notification Center */}
      {showNotifications && (
        <NotificationCenter
          notifications={alerts}
          onMarkAllRead={markAllAlertsRead}
          onClear={clearAlerts}
          onClose={() => setShowNotifications(false)}
        />
      )}

      {/* Toast Notifications */}
      <Toaster position="top-center" />
    </div>
  );
}

export default function App() {
  return (
    <ProgileProvider>
      <ProgileShell />
    </ProgileProvider>
  );
}
