
import { LucideIcon } from "lucide-react";

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface Device {
  id: string;
  name: string;
  type: 'HVAC' | 'Lighting' | 'Meter' | 'Sensor' | 'Gateway' | 'WaterHeater';
  brand: string;
  model: string;
  status: 'online' | 'offline' | 'fault';
  location: string; // Store > Floor > Area
  storeId: string;
  areaId?: string; // Optional link to specific area
  gatewayId: string; // The IoT Box ID
  modbusAddr: number;
  lastActive: string;
  powerUsage: number; // kW
  todayEnergy: number; // kWh
}

export interface DeviceHistory {
  time: string;
  value: number;
}

export interface EnergyMetric {
  time: string;
  usage: number; // kWh
  cost: number;
}

export interface Alarm {
  id: string;
  message: string;
  level: 'info' | 'warning' | 'critical';
  time: string;
  location: string;
}

export type StrategyType = 'time' | 'environment' | 'device';
export type ExecutionLocation = 'cloud' | 'edge';

export interface Strategy {
  id: string;
  name: string;
  description: string;
  type: StrategyType;
  status: 'active' | 'inactive';
  executionLocation: ExecutionLocation;
  targetCount: number; // Count of devices
  storeCount: number; // Count of stores
  savingsKwh: number; // Total saved kWh
  savingsMoney: number; // Total saved currency
  savingRate: number; // Percentage
  lastRunTime: string;
  nextRunTime: string;
  algorithm: string; // e.g., 'PID', 'Threshold', 'Schedule'
  createTime: string;
}

export interface RankingItem {
  id: string;
  name: string;
  value: number;
  unit: string;
  percentage: number;
}

// --- Category Management Types ---

export type DataType = 'Boolean' | 'Integer' | 'Enum' | 'String' | 'Json';
export type AccessMode = 'RO' | 'RW' | 'WO';

export interface StandardDP {
  id: string; 
  identifier: string; // The functional key, e.g., 'switch_led'
  name: string;       // Display name, e.g., '开关'
  dataType: DataType;
  accessMode: AccessMode;
  range?: string;     // "0-100" or enum values "cool,heat,fan"
  step?: number;      // Step for sliders
  unit?: string;      // "°C", "%"
  multiplier?: number; // Scaling factor
  description?: string;
}

export interface DeviceCategory {
  id: string;
  name: string;
  code: string;       // Unique identifier, e.g., 'lighting'
  description: string;
  standardDPs: StandardDP[];
  brandCount: number;
  deviceCount: number;
  createTime: string;
  updateTime: string;
}

// --- Brand Management Types ---

export type ModbusRegisterType = 'Coil' | 'DiscreteInput' | 'InputRegister' | 'HoldingRegister';
export type ModbusDataType = 'int16' | 'uint16' | 'int32' | 'uint32' | 'float32' | 'bool';

export interface ProtocolMapping {
  dpIdentifier: string; // Links to the DP
  registerAddress: number; // 0-65535
  registerType: ModbusRegisterType;
  dataType: ModbusDataType;
  scaleFactor?: number; // e.g., 0.1
  offset?: number;      // e.g., 0
  unitConversion?: string;
  enumMapping?: string; // JSON string "0:cool,1:heat"
}

export interface ProductModel {
  id: string;
  name: string;
  code: string; // Model identifier
  categoryId: string; // Link to Category
  categoryName: string; // Denormalized for display
  description: string;
  dps: StandardDP[]; // Specific DPs for this model
  mappings: ProtocolMapping[];
  deviceCount: number;
}

export interface Brand {
  id: string;
  name: string;
  code: string;
  description: string;
  logo?: string;
  models: ProductModel[];
  deviceCount: number; // Aggregate
  pluginPath?: string; // Adapter plugin reference
  createTime: string;
  updateTime: string;
}

// --- Space Management Types ---

export type StoreType = 'CHAIN_STORE' | 'BUILDING' | 'FACTORY' | 'SMALL_BUSINESS';
export type StoreStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';

export interface Store {
  id: string;
  name: string;
  type: StoreType;
  address: string;
  contactPerson: string;
  contactPhone: string;
  description?: string;
  status: StoreStatus;
  deviceCount: number;
  areaCount: number;
  totalEnergy: number; // kWh
  averagePower: number; // kW
  createTime: string;
  updateTime: string;
}

export type AreaType = 'FLOOR' | 'ZONE' | 'ROOM' | 'OTHER';
export type AreaStatus = 'ACTIVE' | 'INACTIVE';

export interface Area {
  id: string;
  name: string;
  type: AreaType;
  storeId: string;
  storeName?: string; // Denormalized
  description?: string;
  status: AreaStatus;
  deviceCount: number;
  totalEnergy: number; // kWh
  averagePower: number; // kW
  createTime: string;
  updateTime: string;
}

// --- Statistics Types ---

export interface StatisticsReport {
  id: string;
  name: string;
  type: 'ENERGY' | 'SAVINGS' | 'DEVICE_RUNNING' | 'ALARM';
  format: 'EXCEL' | 'PDF' | 'CSV';
  timeRange: string; // e.g. "2023-10-01 ~ 2023-10-31"
  creator: string;
  createTime: string;
  status: 'GENERATED' | 'PROCESSING' | 'FAILED';
  fileSize: string;
}

// --- System Settings Types ---

export interface SystemConfig {
  basic: {
    systemName: string;
    description: string;
    timezone: string;
    language: string;
  };
  energy: {
    peakPrice: number; // Peak electricity price
    valleyPrice: number; // Valley electricity price
    billingCycle: string; // 'monthly' | 'daily' etc.
    precision: string; // e.g., '2 decimals'
    unit: 'kWh' | 'MWh';
  };
  alarm: {
    powerThreshold: number; // kW
    energyThreshold: number; // kWh
    faultFrequency: number; // times/day
    notifications: string[]; // e.g. ['email', 'sms', 'site']
    recipients: string;
  };
  retention: {
    rawDataDays: number;
    statsDataDays: number;
    logDays: number;
    archivePolicy: 'auto' | 'manual';
  };
}

export interface User {
  id: string;
  username: string;
  role: string; // Role Name
  roleId: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  email: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // List of permission codes e.g. 'sys:device:read'
  dataScope: 'ALL' | 'STORE' | 'AREA' | 'SELF'; // Data permission scope
  isDefault?: boolean; // Protect default roles
  userCount: number;
}

export interface LoginLog {
  id: string;
  userId: string;
  username: string;
  time: string;
  ip: string;
  device: string; // e.g. Chrome on Windows 10
  status: 'success' | 'failure';
  reason?: string;
}

export interface AuditLog {
  id: string;
  time: string;
  user: string;
  actionType: string; // 'CONFIG', 'USER', 'AUTH'
  content: string;
  result: 'success' | 'failure';
  ip: string;
}

export enum PageView {
  DASHBOARD = 'dashboard',
  SPACE = 'space',
  DEVICES = 'devices',
  STRATEGY = 'strategy',
  CATEGORY = 'category',
  BRAND = 'brand',
  STATISTICS_QUERY = 'statistics_query',
  STATISTICS_REPORTS = 'statistics_reports',
  STATISTICS_CONFIG = 'statistics_config',
  SETTINGS_CONFIG = 'settings_config',
  SETTINGS_USERS = 'settings_users',
  SETTINGS_SYSTEM = 'settings_system',
  SETTINGS_AUDIT = 'settings_audit',
}
