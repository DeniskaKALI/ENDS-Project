export type RoleName = "USER" | "DISPATCHER" | "LOGIST" | "ADMIN" | "MANAGER" | "DRIVER";
export type VehicleStatus = "MOVING" | "STOPPED" | "OFF_ROUTE" | "MAINTENANCE";
export type RouteStatus = "PLANNED" | "ACTIVE" | "COMPLETED";

export interface UserProfile {
  id?: number;
  fullName: string;
  email: string;
  role: RoleName;
  company: string;
  token: string;
}

export interface Vehicle {
  id: number;
  plateNumber: string;
  model: string;
  driver: string;
  type: string;
  status: VehicleStatus;
  speed: number;
  fuel: number;
  lastUpdate: string;
}

export interface RoutePlan {
  id: number;
  name: string;
  startPoint: string;
  endPoint: string;
  status: RouteStatus;
  vehicleId?: number;
  eta: string;
  progress: number;
}

export interface AlertItem {
  id: number;
  title: string;
  message: string;
  severity: "info" | "warning" | "error" | "success";
  read: boolean;
}
