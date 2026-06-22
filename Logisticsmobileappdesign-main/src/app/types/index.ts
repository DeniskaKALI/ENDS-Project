export type VehicleStatus = "MOVING" | "STOPPED" | "OFF_ROUTE" | "MAINTENANCE";
export type RouteStatus = "PLANNED" | "ACTIVE" | "COMPLETED";
export type AlertSeverity = "info" | "warning" | "error" | "success";
export type AlertType = "gps_lost" | "speed_violation" | "route_deviation" | "long_stop";
export type RoleName = "DISPATCHER" | "LOGIST" | "ADMIN" | "MANAGER" | "DRIVER";
export type ReportFormat = "pdf" | "xlsx" | "csv";

export interface Vehicle {
  plateNumber: string;
  model: string;
  driver: string;
  status: VehicleStatus;
  speed: number;
  lastUpdate: string;
  type?: string;
  fuel?: number;
  mileage?: number;
  routeId?: string;
}

export interface Route {
  id: string;
  name: string;
  start: string;
  end: string;
  status: RouteStatus;
  vehicle?: string;
  eta?: string;
  progress: number;
  distanceKm?: number;
  remainingKm?: number;
  checkpoints?: Checkpoint[];
}

export interface Alert {
  id: number;
  type: AlertType;
  title?: string;
  message: string;
  timestamp: string;
  severity: AlertSeverity;
  vehicleId?: string;
  read?: boolean;
}

export interface Checkpoint {
  name: string;
  time: string;
  status: "completed" | "current" | "pending";
}

export interface KPIData {
  title: string;
  value: string | number;
  icon: any;
  color?: string;
  trend?: number;
}

export interface Comment {
  author: string;
  time: string;
  text: string;
}

export interface UserProfile {
  fullName: string;
  email: string;
  role: RoleName;
  company: string;
  token: string;
}

export interface AppSettings {
  notifications: boolean;
  darkMode: boolean;
  language: "Русский";
}

export interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description: string;
}
