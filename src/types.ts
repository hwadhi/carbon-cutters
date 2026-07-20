export interface CarbonInput {
  segment: "machining" | "plastics" | "foundry" | "electronics" | "textiles";
  productionVolume: number; // units/month
  materialWeight: number; // kg
  materialType: string;
  gridElectricity: number; // kWh
  solarElectricity: number; // kWh
  dieselFuel: number; // Litres
  machiningHours: number; // hrs
  transportDistance: number; // km
  cargoWeight: number; // Tons
  generalWaste: number; // kg
  hazardousWaste: number; // kg
}

export interface CalculatedMetrics {
  scope1Direct: number;
  scope2Indirect: number;
  scope3Materials: number;
  scope3Transport: number;
  scope3Waste: number;
  scope3Total: number;
  totalCO2e: number; // kg CO2e
  co2ePerUnit: number; // kg CO2e / unit
}

export interface Hotspot {
  source: string;
  impactPercentage: number;
  details: string;
}

export interface Recommendation {
  title: string;
  category: string;
  reductionPotentialCO2: number; // kg
  impact: "High" | "Medium" | "Low" | string;
  costDifficulty: "Low" | "Medium" | "High" | string;
  description: string;
}

export interface RegulatoryDisclosures {
  ghgProtocolStatus: string;
  secDisclosureStatement: string;
  improvementTarget: string;
}

export interface AiInsights {
  complianceScore: number;
  hotspots: Hotspot[];
  recommendations: Recommendation[];
  regulatoryDisclosures: RegulatoryDisclosures;
  aiModelUsed?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ManufacturingPreset {
  name: string;
  segment: "machining" | "plastics" | "foundry" | "electronics" | "textiles";
  description: string;
  defaults: CarbonInput;
}

// === NEW MANUFACTURING ESG PORTAL SCHEMAS ===

export type UserRole = "admin" | "user" | "auditor";

export interface MachineAsset {
  id: string;
  name: string;
  type: "VMC" | "HMC" | "AssemblyLine" | "InjectionPress";
  line: "Production Line A" | "Production Line B" | "Assembly Area";
  status: "Active" | "Idle" | "Maintenance";
  basePowerkW: number;
  coolantCapacityLtrs: number;
  operatorName: string;
}

export interface MachineLog {
  id: string;
  machineId: string;
  machineName: string;
  productionLine: string;
  shift: "Shift 1" | "Shift 2" | "Shift 3";
  date: string; // YYYY-MM-DD
  jobId: string; // e.g., "JOB-8942"
  jobName: string;
  scope1Direct: number; // LPG/Gas/Coolant (kg CO2e)
  scope2Indirect: number; // Electricity (kg CO2e)
  scope3Materials: number; // Embedded materials (kg CO2e)
  scope3Waste: number; // Waste overhead (kg CO2e)
  status: "Pending Approval" | "Approved";
  approvedBy?: string;
  timestamp: string;
}

export interface LogisticsLog {
  id: string;
  direction: "Inbound" | "Outbound" | "WMS Inventory";
  mode: "Road Freight (Truck)" | "Rail Cargo" | "Air Freight" | "Electric Carrier" | "Warehouse Storage Grid" | "LPG Forklift";
  jobId: string;
  carrierName: string;
  cargoWeightTons: number;
  distanceKm: number;
  emissionsScope3: number; // kg CO2e
  status: "Pending Approval" | "Approved";
  approvedBy?: string;
  date: string;
}

export interface ComplianceDoc {
  id: string;
  title: string;
  category: "Utility Bill" | "Fuel Slip" | "Freight Invoice" | "ISO Certificate" | "Audit Report" | "Material Sheet";
  uploadDate: string;
  fileSize: string;
  uploadedBy: string;
  verified: boolean;
  associatedAsset?: string;
  fileType: "pdf" | "xlsx" | "csv" | "docx";
}

export interface FeedbackReview {
  id: string;
  name: string;
  email: string;
  role: string;
  rating: number; // 1 to 5
  subject: string;
  message: string;
  date: string;
}

