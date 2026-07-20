import { MachineAsset, MachineLog, LogisticsLog, ComplianceDoc } from "./types";

export const INITIAL_MACHINE_ASSETS: MachineAsset[] = [
  {
    id: "vmc-850",
    name: "VMC-850 (Vertical Machining Center)",
    type: "VMC",
    line: "Production Line A",
    status: "Active",
    basePowerkW: 22,
    coolantCapacityLtrs: 150,
    operatorName: "Arjun Mehta"
  },
  {
    id: "vmc-1050",
    name: "VMC-1050 High-Speed Milling",
    type: "VMC",
    line: "Production Line A",
    status: "Active",
    basePowerkW: 30,
    coolantCapacityLtrs: 180,
    operatorName: "Sarah Connor"
  },
  {
    id: "hmc-630",
    name: "HMC-630 (Horizontal Machining Center)",
    type: "HMC",
    line: "Production Line B",
    status: "Active",
    basePowerkW: 45,
    coolantCapacityLtrs: 250,
    operatorName: "Marcus Vance"
  },
  {
    id: "press-450t",
    name: "Plastics Injection Press 450T",
    type: "InjectionPress",
    line: "Production Line B",
    status: "Active",
    basePowerkW: 55,
    coolantCapacityLtrs: 0,
    operatorName: "Elena Rostova"
  },
  {
    id: "assem-robot",
    name: "Automated SMT & Assembly Cell 1",
    type: "AssemblyLine",
    line: "Assembly Area",
    status: "Active",
    basePowerkW: 12,
    coolantCapacityLtrs: 0,
    operatorName: "Rajesh K."
  },
  {
    id: "assem-manual",
    name: "Manual Packing & Inspection Line",
    type: "AssemblyLine",
    line: "Assembly Area",
    status: "Idle",
    basePowerkW: 3,
    coolantCapacityLtrs: 0,
    operatorName: "Mei Ling"
  }
];

export const INITIAL_MACHINE_LOGS: MachineLog[] = [
  // July 14, 2026 (Recent approved logs)
  {
    id: "mlog-001",
    machineId: "vmc-850",
    machineName: "VMC-850 (Vertical Machining Center)",
    productionLine: "Production Line A",
    shift: "Shift 1",
    date: "2026-07-14",
    jobId: "JOB-2021",
    jobName: "JOB-2021 (Alloy Castings)",
    scope1Direct: 35,   // Diesel forklift handling/coolant replenishment
    scope2Indirect: 145, // Electricity
    scope3Materials: 450, // Steel billet carbon
    scope3Waste: 22,
    status: "Approved",
    approvedBy: "Admin Chief ESG",
    timestamp: "2026-07-14T14:30:00Z"
  },
  {
    id: "mlog-002",
    machineId: "vmc-850",
    machineName: "VMC-850 (Vertical Machining Center)",
    productionLine: "Production Line A",
    shift: "Shift 2",
    date: "2026-07-14",
    jobId: "JOB-2021",
    jobName: "JOB-2021 (Alloy Castings)",
    scope1Direct: 38,
    scope2Indirect: 155,
    scope3Materials: 450,
    scope3Waste: 25,
    status: "Approved",
    approvedBy: "Admin Chief ESG",
    timestamp: "2026-07-14T22:15:00Z"
  },
  {
    id: "mlog-003",
    machineId: "vmc-1050",
    machineName: "VMC-1050 High-Speed Milling",
    productionLine: "Production Line A",
    shift: "Shift 1",
    date: "2026-07-14",
    jobId: "JOB-2022",
    jobName: "JOB-2022 (Steel Hubs)",
    scope1Direct: 42,
    scope2Indirect: 195,
    scope3Materials: 680,
    scope3Waste: 35,
    status: "Approved",
    approvedBy: "Admin Chief ESG",
    timestamp: "2026-07-14T14:32:00Z"
  },
  {
    id: "mlog-004",
    machineId: "hmc-630",
    machineName: "HMC-630 (Horizontal Machining Center)",
    productionLine: "Production Line B",
    shift: "Shift 1",
    date: "2026-07-14",
    jobId: "JOB-2024",
    jobName: "JOB-2024 (Titanium Plates)",
    scope1Direct: 65,
    scope2Indirect: 320,
    scope3Materials: 1150,
    scope3Waste: 58,
    status: "Approved",
    approvedBy: "Admin Chief ESG",
    timestamp: "2026-07-14T14:35:00Z"
  },
  {
    id: "mlog-005",
    machineId: "press-450t",
    machineName: "Plastics Injection Press 450T",
    productionLine: "Production Line B",
    shift: "Shift 1",
    date: "2026-07-14",
    jobId: "JOB-2023",
    jobName: "JOB-2023 (Polymer Brackets)",
    scope1Direct: 12,
    scope2Indirect: 280,
    scope3Materials: 340,
    scope3Waste: 15,
    status: "Approved",
    approvedBy: "Admin Chief ESG",
    timestamp: "2026-07-14T14:40:00Z"
  },
  {
    id: "mlog-006",
    machineId: "assem-robot",
    machineName: "Automated SMT & Assembly Cell 1",
    productionLine: "Assembly Area",
    shift: "Shift 1",
    date: "2026-07-14",
    jobId: "JOB-2025",
    jobName: "JOB-2025 (Controller Boards)",
    scope1Direct: 0,
    scope2Indirect: 85,
    scope3Materials: 220,
    scope3Waste: 8,
    status: "Approved",
    approvedBy: "Admin Chief ESG",
    timestamp: "2026-07-14T14:45:00Z"
  },

  // July 15, 2026 (Today's active data - Some pending approval for the workflow demo)
  {
    id: "mlog-007",
    machineId: "vmc-850",
    machineName: "VMC-850 (Vertical Machining Center)",
    productionLine: "Production Line A",
    shift: "Shift 1",
    date: "2026-07-15",
    jobId: "JOB-2021",
    jobName: "JOB-2021 (Alloy Castings)",
    scope1Direct: 33,
    scope2Indirect: 140,
    scope3Materials: 450,
    scope3Waste: 21,
    status: "Pending Approval",
    timestamp: "2026-07-15T06:15:00Z"
  },
  {
    id: "mlog-008",
    machineId: "vmc-1050",
    machineName: "VMC-1050 High-Speed Milling",
    productionLine: "Production Line A",
    shift: "Shift 1",
    date: "2026-07-15",
    jobId: "JOB-2022",
    jobName: "JOB-2022 (Steel Hubs)",
    scope1Direct: 45,
    scope2Indirect: 210,
    scope3Materials: 680,
    scope3Waste: 38,
    status: "Pending Approval",
    timestamp: "2026-07-15T06:22:00Z"
  },
  {
    id: "mlog-009",
    machineId: "hmc-630",
    machineName: "HMC-630 (Horizontal Machining Center)",
    productionLine: "Production Line B",
    shift: "Shift 1",
    date: "2026-07-15",
    jobId: "JOB-2024",
    jobName: "JOB-2024 (Titanium Plates)",
    scope1Direct: 68,
    scope2Indirect: 330,
    scope3Materials: 1150,
    scope3Waste: 60,
    status: "Pending Approval",
    timestamp: "2026-07-15T06:30:00Z"
  },
  {
    id: "mlog-010",
    machineId: "press-450t",
    machineName: "Plastics Injection Press 450T",
    productionLine: "Production Line B",
    shift: "Shift 1",
    date: "2026-07-15",
    jobId: "JOB-2023",
    jobName: "JOB-2023 (Polymer Brackets)",
    scope1Direct: 14,
    scope2Indirect: 295,
    scope3Materials: 340,
    scope3Waste: 18,
    status: "Pending Approval",
    timestamp: "2026-07-15T06:40:00Z"
  },

  // Historic Data: June 2026 (Monthly aggregates represent high-quality back logs)
  {
    id: "mlog-hist-01",
    machineId: "vmc-850",
    machineName: "VMC-850 (Vertical Machining Center)",
    productionLine: "Production Line A",
    shift: "Shift 1",
    date: "2026-06-15",
    jobId: "JOB-2010",
    jobName: "JOB-2010 (Alloy Blocks)",
    scope1Direct: 850,
    scope2Indirect: 3800,
    scope3Materials: 11200,
    scope3Waste: 540,
    status: "Approved",
    approvedBy: "External ESG Auditor",
    timestamp: "2026-06-30T18:00:00Z"
  },
  {
    id: "mlog-hist-02",
    machineId: "vmc-1050",
    machineName: "VMC-1050 High-Speed Milling",
    productionLine: "Production Line A",
    shift: "Shift 1",
    date: "2026-06-15",
    jobId: "JOB-2011",
    jobName: "JOB-2011 (Drive Shafts)",
    scope1Direct: 1100,
    scope2Indirect: 5200,
    scope3Materials: 16400,
    scope3Waste: 820,
    status: "Approved",
    approvedBy: "External ESG Auditor",
    timestamp: "2026-06-30T18:10:00Z"
  },
  {
    id: "mlog-hist-03",
    machineId: "hmc-630",
    machineName: "HMC-630 (Horizontal Machining Center)",
    productionLine: "Production Line B",
    shift: "Shift 2",
    date: "2026-06-15",
    jobId: "JOB-2012",
    jobName: "JOB-2012 (Gearboxes)",
    scope1Direct: 1850,
    scope2Indirect: 8900,
    scope3Materials: 28500,
    scope3Waste: 1450,
    status: "Approved",
    approvedBy: "External ESG Auditor",
    timestamp: "2026-06-30T18:20:00Z"
  },
  {
    id: "mlog-hist-04",
    machineId: "press-450t",
    machineName: "Plastics Injection Press 450T",
    productionLine: "Production Line B",
    shift: "Shift 3",
    date: "2026-06-15",
    jobId: "JOB-2013",
    jobName: "JOB-2013 (Fender Covers)",
    scope1Direct: 420,
    scope2Indirect: 7800,
    scope3Materials: 9500,
    scope3Waste: 380,
    status: "Approved",
    approvedBy: "External ESG Auditor",
    timestamp: "2026-06-30T18:30:00Z"
  },
  {
    id: "mlog-hist-05",
    machineId: "assem-robot",
    machineName: "Automated SMT & Assembly Cell 1",
    productionLine: "Assembly Area",
    shift: "Shift 1",
    date: "2026-06-15",
    jobId: "JOB-2014",
    jobName: "JOB-2014 (Inverter Cards)",
    scope1Direct: 0,
    scope2Indirect: 2400,
    scope3Materials: 5800,
    scope3Waste: 190,
    status: "Approved",
    approvedBy: "External ESG Auditor",
    timestamp: "2026-06-30T18:40:00Z"
  }
];

export const INITIAL_LOGISTICS_LOGS: LogisticsLog[] = [
  // July 14, 2026
  {
    id: "log-001",
    direction: "Inbound",
    mode: "Road Freight (Truck)",
    jobId: "JOB-2021",
    carrierName: "BlueDart Logistics",
    cargoWeightTons: 12.5,
    distanceKm: 450,
    emissionsScope3: 562, // kg CO2e
    status: "Approved",
    approvedBy: "Admin Chief ESG",
    date: "2026-07-14"
  },
  {
    id: "log-002",
    direction: "Inbound",
    mode: "Rail Cargo",
    jobId: "JOB-2024",
    carrierName: "National Rail Corp",
    cargoWeightTons: 45.0,
    distanceKm: 1200,
    emissionsScope3: 1350,
    status: "Approved",
    approvedBy: "Admin Chief ESG",
    date: "2026-07-14"
  },
  {
    id: "log-003",
    direction: "Outbound",
    mode: "Road Freight (Truck)",
    jobId: "JOB-2021",
    carrierName: "Gati Express",
    cargoWeightTons: 8.2,
    distanceKm: 280,
    emissionsScope3: 230,
    status: "Approved",
    approvedBy: "Admin Chief ESG",
    date: "2026-07-14"
  },
  {
    id: "log-004",
    direction: "WMS Inventory",
    mode: "Warehouse Storage Grid",
    jobId: "JOB-GEN",
    carrierName: "Zone A Storage Coolers",
    cargoWeightTons: 150.0,
    distanceKm: 0,
    emissionsScope3: 185, // Cooling & Handling overhead
    status: "Approved",
    approvedBy: "Admin Chief ESG",
    date: "2026-07-14"
  },
  {
    id: "log-005",
    direction: "WMS Inventory",
    mode: "LPG Forklift",
    jobId: "JOB-GEN",
    carrierName: "Hyster LPG 2.5T",
    cargoWeightTons: 15.0,
    distanceKm: 12,
    emissionsScope3: 92, // LPG combustion
    status: "Approved",
    approvedBy: "Admin Chief ESG",
    date: "2026-07-14"
  },

  // July 15, 2026 (Pending Logistics logs for Approval flow)
  {
    id: "log-006",
    direction: "Inbound",
    mode: "Road Freight (Truck)",
    jobId: "JOB-2022",
    carrierName: "Direct Mill Carriers",
    cargoWeightTons: 18.0,
    distanceKm: 320,
    emissionsScope3: 412,
    status: "Pending Approval",
    date: "2026-07-15"
  },
  {
    id: "log-007",
    direction: "Outbound",
    mode: "Electric Carrier",
    jobId: "JOB-2023",
    carrierName: "EcoShip EV",
    cargoWeightTons: 3.5,
    distanceKm: 85,
    emissionsScope3: 15, // Highly optimized solar power charging
    status: "Pending Approval",
    date: "2026-07-15"
  },
  {
    id: "log-008",
    direction: "WMS Inventory",
    mode: "Warehouse Storage Grid",
    jobId: "JOB-GEN",
    carrierName: "Rack Zone B (Non-cooled)",
    cargoWeightTons: 85.0,
    distanceKm: 0,
    emissionsScope3: 35, // Low ambient overhead
    status: "Pending Approval",
    date: "2026-07-15"
  }
];

export const INITIAL_COMPLIANCE_DOCS: ComplianceDoc[] = [
  {
    id: "doc-001",
    title: "Electricity Grid Bill - July 2026 (Provisional)",
    category: "Utility Bill",
    uploadDate: "2026-07-12",
    fileSize: "1.4 MB",
    uploadedBy: "Sarah Connor (Ops)",
    verified: true,
    associatedAsset: "vmc-850",
    fileType: "pdf"
  },
  {
    id: "doc-002",
    title: "Milling Steel Material Grade Cert - Batch 42A",
    category: "Material Sheet",
    uploadDate: "2026-07-10",
    fileSize: "640 KB",
    uploadedBy: "Arjun Mehta (QA)",
    verified: true,
    associatedAsset: "vmc-1050",
    fileType: "pdf"
  },
  {
    id: "doc-003",
    title: "Diesel Dispensing Receipt - Forklift Refuels #22",
    category: "Fuel Slip",
    uploadDate: "2026-07-14",
    fileSize: "280 KB",
    uploadedBy: "Rajesh K. (Store)",
    verified: true,
    fileType: "png" as any // standard pdf fallback
  },
  {
    id: "doc-004",
    title: "Supply Chain Inbound Waybill - Rail Carrier #RC8921",
    category: "Freight Invoice",
    uploadDate: "2026-07-14",
    fileSize: "2.1 MB",
    uploadedBy: "Elena Rostova (Logistics)",
    verified: false, // Pending Verification for the Auditor/Admin to verify!
    fileType: "pdf"
  },
  {
    id: "doc-005",
    title: "ISO 14064 Carbon Verification Audit Cert 2025",
    category: "ISO Certificate",
    uploadDate: "2026-01-15",
    fileSize: "4.5 MB",
    uploadedBy: "Admin Chief ESG",
    verified: true,
    fileType: "pdf"
  }
];

export const INITIAL_FEEDBACK_REVIEWS = [
  {
    id: "rev-001",
    name: "Rajesh Kumar",
    email: "rajesh@precisionmfg.com",
    role: "OPERATOR",
    rating: 5,
    subject: "Superb Real-time PLC Sync",
    message: "The telemetry from our HMC and SMT pick-and-place lines is incredibly accurate. It has completely eliminated manually logging coolant refuels and electric utility units. Extremely user-friendly interface!",
    date: "2026-07-16"
  },
  {
    id: "rev-002",
    name: "Sarah Jenkins",
    email: "sjenkins@veritasaudit.com",
    role: "AUDITOR",
    rating: 5,
    subject: "Audit Evidence Vault is Outstanding",
    message: "Verifying ISO 14064 compliance across our manufacturing operations used to take us weeks of manual ledger checking. This digital audit trail, complete with linked PDF invoices and third-party certifications, makes sign-offs effortless.",
    date: "2026-07-14"
  },
  {
    id: "rev-003",
    name: "Arjun Mehta",
    email: "arjun@carboncutters.com",
    role: "ADMIN",
    rating: 4,
    subject: "Carbon Cutters Streamlines Reporting",
    message: "Since we transitioned our operational boundaries to Carbon Cutters, our SBTi scope tracking is fully automated. The Gemini advisor suggestions for scheduling machines during off-peak grid hours saved us 15% on Scope 2 footprint this month.",
    date: "2026-07-15"
  }
];
