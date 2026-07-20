import React, { useState, useEffect } from "react";
import { 
  Gauge, 
  Activity, 
  Layers, 
  Factory, 
  Truck, 
  MessageSquareCode, 
  FileCheck, 
  FileText, 
  Settings,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  User,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info
} from "lucide-react";
import { UserRole, MachineAsset, MachineLog, LogisticsLog, ComplianceDoc, FeedbackReview } from "./types";
import { 
  INITIAL_MACHINE_ASSETS, 
  INITIAL_MACHINE_LOGS, 
  INITIAL_LOGISTICS_LOGS, 
  INITIAL_COMPLIANCE_DOCS,
  INITIAL_FEEDBACK_REVIEWS
} from "./mockDb";

import Sidebar, { TabType } from "./components/Sidebar";
import Header from "./components/Header";
import FiltersBar from "./components/FiltersBar";
import AnalyticsView from "./components/AnalyticsView";
import EsgLedgerView from "./components/EsgLedgerView";
import MachinesView from "./components/MachinesView";
import LogisticsView from "./components/LogisticsView";
import DocumentLibrary from "./components/DocumentLibrary";
import AiChatbot from "./components/AiChatbot";
import ReportsView from "./components/ReportsView";
import FeedbackView from "./components/FeedbackView";
import LoginPortal from "./components/LoginPortal";


export default function App() {
  // 1. Core database states, synced to localStorage if available
  const [machines, setMachines] = useState<MachineAsset[]>(() => {
    const saved = localStorage.getItem("sustaneer_machines");
    return saved ? JSON.parse(saved) : INITIAL_MACHINE_ASSETS;
  });

  const [machineLogs, setMachineLogs] = useState<MachineLog[]>(() => {
    const saved = localStorage.getItem("sustaneer_machine_logs");
    return saved ? JSON.parse(saved) : INITIAL_MACHINE_LOGS;
  });

  const [logisticsLogs, setLogisticsLogs] = useState<LogisticsLog[]>(() => {
    const saved = localStorage.getItem("sustaneer_logistics_logs");
    return saved ? JSON.parse(saved) : INITIAL_LOGISTICS_LOGS;
  });

  const [complianceDocs, setComplianceDocs] = useState<ComplianceDoc[]>(() => {
    const saved = localStorage.getItem("sustaneer_compliance_docs");
    return saved ? JSON.parse(saved) : INITIAL_COMPLIANCE_DOCS;
  });

  // Save states to localStorage
  useEffect(() => {
    localStorage.setItem("sustaneer_machines", JSON.stringify(machines));
  }, [machines]);

  useEffect(() => {
    localStorage.setItem("sustaneer_machine_logs", JSON.stringify(machineLogs));
  }, [machineLogs]);

  useEffect(() => {
    localStorage.setItem("sustaneer_logistics_logs", JSON.stringify(logisticsLogs));
  }, [logisticsLogs]);

  useEffect(() => {
    localStorage.setItem("sustaneer_compliance_docs", JSON.stringify(complianceDocs));
  }, [complianceDocs]);

  // Feedback reviews state
  const [feedbackReviews, setFeedbackReviews] = useState<FeedbackReview[]>(() => {
    const saved = localStorage.getItem("carbon_cutters_reviews");
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACK_REVIEWS;
  });

  useEffect(() => {
    localStorage.setItem("carbon_cutters_reviews", JSON.stringify(feedbackReviews));
  }, [feedbackReviews]);

  const handleAddFeedbackReview = (newReview: Omit<FeedbackReview, "id" | "date">) => {
    const formatted: FeedbackReview = {
      ...newReview,
      id: `rev-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split("T")[0]
    };
    setFeedbackReviews(prev => [formatted, ...prev]);
  };

  // Login session states
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem("carbon_cutters_logged_in");
    return saved === "true";
  });

  const [userEmail, setUserEmail] = useState<string>(() => {
    return localStorage.getItem("carbon_cutters_user_email") || "";
  });

  const handleLoginSuccess = (selectedRole: UserRole, email: string) => {
    setRole(selectedRole);
    setUserEmail(email);
    setIsLoggedIn(true);
    localStorage.setItem("carbon_cutters_logged_in", "true");
    localStorage.setItem("carbon_cutters_user_email", email);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("carbon_cutters_logged_in");
    localStorage.removeItem("carbon_cutters_user_email");
  };

  // 2. Navigation & UX states
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [role, setRole] = useState<UserRole>("admin");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [apiStatus, setApiStatus] = useState({ hasApiKey: true, isMock: false, rateLimited: false });


  // 3. Cascading shared filters
  const [selectedMachine, setSelectedMachine] = useState("all");
  const [selectedShift, setSelectedShift] = useState("all");
  const [selectedJob, setSelectedJob] = useState("all");
  const [selectedPeriodType, setSelectedPeriodType] = useState<"day" | "month" | "year">("month");
  
  const [selectedDate, setSelectedDate] = useState("2026-07-15");
  const [selectedMonth, setSelectedMonth] = useState("2026-07");
  const [selectedYear, setSelectedYear] = useState("2026");

  // IoT Simulation live state
  const [iotActive, setIotActive] = useState(false);

  // Digital clock ticks
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace("GMT", "UTC"));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check if API works on load
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch("/api/health");
        const data = await res.json();
        setApiStatus({
          hasApiKey: data.hasApiKey,
          isMock: !data.hasApiKey,
          rateLimited: false
        });
      } catch (e) {
        setApiStatus({ hasApiKey: false, isMock: true, rateLimited: false });
      }
    };
    checkHealth();
  }, []);

  // IoT Live Telemetry Simulator Stream
  useEffect(() => {
    if (!iotActive) return;

    const interval = setInterval(() => {
      // Pick a random machine
      const randomMachine = machines[Math.floor(Math.random() * machines.length)];
      const shifts: ("Shift 1" | "Shift 2" | "Shift 3")[] = ["Shift 1", "Shift 2", "Shift 3"];
      const randShift = shifts[Math.floor(Math.random() * shifts.length)];
      
      const newLog: MachineLog = {
        id: `mlog-iot-${Math.floor(100 + Math.random() * 900)}`,
        machineId: randomMachine.id,
        machineName: randomMachine.name,
        productionLine: randomMachine.line,
        shift: randShift,
        date: new Date().toISOString().split("T")[0],
        jobId: `JOB-${Math.floor(2025 + Math.random() * 5)}`,
        jobName: "JOB-Auto (Live Telemetry)",
        scope1Direct: Math.round(20 + Math.random() * 30),
        scope2Indirect: Math.round(120 + Math.random() * 80),
        scope3Materials: Math.round(300 + Math.random() * 200),
        scope3Waste: Math.round(10 + Math.random() * 20),
        status: "Pending Approval",
        timestamp: new Date().toISOString()
      };

      setMachineLogs(prev => [newLog, ...prev]);
    }, 8500); // New telemetry packet every 8.5 seconds

    return () => clearInterval(interval);
  }, [iotActive, machines]);

  // Extract unique jobs for the filters dropdown
  const uniqueJobs = Array.from(new Set([
    ...machineLogs.map(l => l.jobId),
    ...logisticsLogs.map(l => l.jobId)
  ])).filter(Boolean);

  // Helper function to reset filters
  const handleResetFilters = () => {
    setSelectedMachine("all");
    setSelectedShift("all");
    setSelectedJob("all");
    setSelectedPeriodType("month");
    setSelectedDate("2026-07-15");
    setSelectedMonth("2026-07");
    setSelectedYear("2026");
  };

  // 4. Filtering Slices matching criteria
  const getFilteredLogs = () => {
    return machineLogs.filter(log => {
      const matchMachine = selectedMachine === "all" || log.machineId === selectedMachine;
      const matchShift = selectedShift === "all" || log.shift === selectedShift;
      const matchJob = selectedJob === "all" || log.jobId === selectedJob;
      
      let matchDate = true;
      if (selectedPeriodType === "day") {
        matchDate = log.date === selectedDate;
      } else if (selectedPeriodType === "month") {
        matchDate = log.date.startsWith(selectedMonth);
      } else if (selectedPeriodType === "year") {
        matchDate = log.date.startsWith(selectedYear);
      }
      return matchMachine && matchShift && matchJob && matchDate;
    });
  };

  const getFilteredLogistics = () => {
    return logisticsLogs.filter(log => {
      const matchJob = selectedJob === "all" || log.jobId === selectedJob;
      
      let matchDate = true;
      if (selectedPeriodType === "day") {
        matchDate = log.date === selectedDate;
      } else if (selectedPeriodType === "month") {
        matchDate = log.date.startsWith(selectedMonth);
      } else if (selectedPeriodType === "year") {
        matchDate = log.date.startsWith(selectedYear);
      }
      return matchJob && matchDate;
    });
  };

  const activeLogs = getFilteredLogs();
  const activeLogistics = getFilteredLogistics();

  // Count pending approvals to display badge on sidebar
  const pendingMachineApprovals = machineLogs.filter(l => l.status === "Pending Approval");
  const pendingLogisticsApprovals = logisticsLogs.filter(l => l.status === "Pending Approval");
  const pendingDocsVerification = complianceDocs.filter(d => !d.verified);
  const pendingApprovalsCount = pendingMachineApprovals.length + pendingLogisticsApprovals.length;

  // Actions for database updates
  const handleAddMachineLog = (newLog: Omit<MachineLog, "id" | "timestamp">) => {
    const log: MachineLog = {
      ...newLog,
      id: `mlog-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString()
    };
    setMachineLogs(prev => [log, ...prev]);
  };

  const handleApproveMachineLog = (id: string, adminName: string) => {
    setMachineLogs(prev => prev.map(log => {
      if (log.id === id) {
        return { ...log, status: "Approved", approvedBy: adminName };
      }
      return log;
    }));
  };

  const handleDeleteMachineLog = (id: string) => {
    setMachineLogs(prev => prev.filter(l => l.id !== id));
  };

  const handleAddLogisticsLog = (newLog: Omit<LogisticsLog, "id">) => {
    const log: LogisticsLog = {
      ...newLog,
      id: `log-${Math.floor(100 + Math.random() * 900)}`
    };
    setLogisticsLogs(prev => [log, ...prev]);
  };

  const handleApproveLogisticsLog = (id: string, adminName: string) => {
    setLogisticsLogs(prev => prev.map(log => {
      if (log.id === id) {
        return { ...log, status: "Approved", approvedBy: adminName };
      }
      return log;
    }));
  };

  const handleDeleteLogisticsLog = (id: string) => {
    setLogisticsLogs(prev => prev.filter(l => l.id !== id));
  };

  const handleUploadDoc = (newDoc: Omit<ComplianceDoc, "id" | "uploadDate" | "verified">) => {
    const doc: ComplianceDoc = {
      ...newDoc,
      id: `doc-${Math.floor(100 + Math.random() * 900)}`,
      uploadDate: new Date().toISOString().split("T")[0],
      verified: false
    };
    setComplianceDocs(prev => [doc, ...prev]);
  };

  const handleVerifyDoc = (id: string) => {
    setComplianceDocs(prev => prev.map(doc => {
      if (doc.id === id) {
        return { ...doc, verified: true };
      }
      return doc;
    }));
  };

  const handleDeleteDoc = (id: string) => {
    setComplianceDocs(prev => prev.filter(d => d.id !== id));
  };

  // Chat integration calling backend
  const handleSendMessageToGemini = async (text: string): Promise<string> => {
    const contextPayload = {
      role,
      activeFilters: { selectedMachine, selectedShift, selectedJob, selectedMonth },
      summaryMetrics: {
        totalApprovedLogs: machineLogs.filter(l => l.status === "Approved").length,
        pendingApprovals: pendingApprovalsCount
      }
    };

    const res = await fetch("/api/gemini/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: text }],
        contextData: contextPayload
      })
    });

    const data = await res.json();
    if (data.success) {
      if (data.isMock && data.rateLimited) {
        setApiStatus(prev => ({ ...prev, rateLimited: true }));
      }
      return data.reply;
    }
    throw new Error("Chat request failed");
  };

  // Report generation calling backend or formatting locally
  const handleGenerateAiReport = async (machineId: string, shift: string, month: string) => {
    const approvedLogs = machineLogs.filter(l => {
      const matchMach = machineId === "all" || l.machineId === machineId;
      const matchShf = shift === "all" || l.shift === shift;
      const matchMth = l.date.startsWith(month);
      return l.status === "Approved" && matchMach && matchShf && matchMth;
    });

    const s1 = approvedLogs.reduce((acc, curr) => acc + curr.scope1Direct, 0);
    const s2 = approvedLogs.reduce((acc, curr) => acc + curr.scope2Indirect, 0);
    const s3Mat = approvedLogs.reduce((acc, curr) => acc + curr.scope3Materials, 0);
    const s3Wst = approvedLogs.reduce((acc, curr) => acc + curr.scope3Waste, 0);
    const s3Total = s3Mat + s3Wst;
    const total = s1 + s2 + s3Total;

    const res = await fetch("/api/gemini/optimize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        segment: "machining",
        productionVolume: approvedLogs.length * 80,
        gridElectricity: s2 * 1.3,
        solarElectricity: s2 * 0.2,
        dieselFuel: s1 / 2.68,
        materialWeight: s3Mat / 2.1,
        generalWaste: s3Wst / 0.45,
        hazardousWaste: 15
      })
    });

    const data = await res.json();
    let text = "";
    let source = "Gemini AI Core";

    if (data.success && data.aiInsights) {
      const insights = data.aiInsights;
      source = insights.aiModelUsed || "Gemini 3.5 Active";
      
      text = `1. SUMMARY CLASSIFICATION
----------------------------
Total Telemetry Data Count: ${approvedLogs.length} approved shifts
Aggregate Scope 1 Burden: ${s1} kg CO2e
Aggregate Scope 2 Burden: ${s2} kg CO2e
Aggregate Scope 3 Burden: ${s3Total} kg CO2e
----------------------------
TOTAL ACCOUNTED COMPLIANCE BALANCE: ${(total / 1000).toFixed(3)} Metric Tons CO2e
Estimated ISO 14064 Compliance Score: ${insights.complianceScore || 85}%

2. HOTSPOTS DETECTED
----------------------------
${(insights.hotspots || []).map((h: any) => `• [${h.source}] (${h.impactPercentage}%): ${h.details}`).join("\n\n")}

3. TECHNICAL OPTIMIZATION RECOMMENDATIONS
----------------------------
${(insights.recommendations || []).map((r: any) => `• [${r.category} - Impact: ${r.impact}] ${r.title}\n  Potential Reduction: ${r.reductionPotentialCO2} kg CO2e\n  ROI / Difficulty: ${r.costDifficulty}\n  Action: ${r.description}`).join("\n\n")}

4. OFFICIAL CORPORATE DISCLOSURE STATEMENT
----------------------------
${insights.regulatoryDisclosures?.secDisclosureStatement || "Statement compilation offline."}

Alignment Pathway: ${insights.regulatoryDisclosures?.improvementTarget || "Science-Based Target active."}`;
    } else {
      source = "Eco-Heuristics Fallback";
      text = `Heuristics summary compiled. Clean carbon indices: Scope 1 = ${s1}kg, Scope 2 = ${s2}kg, Scope 3 = ${s3Total}kg. Total = ${total}kg. Suggesting shift scheduling optimizations to reduce electricity burden by up to 15%.`;
    }

    return { text, source };
  };

  // Master Approval click on Dashboard
  const handleApproveAllDashboard = () => {
    setMachineLogs(prev => prev.map(l => ({ ...l, status: "Approved", approvedBy: "Arjun Mehta (Admin Master)" })));
    setLogisticsLogs(prev => prev.map(l => ({ ...l, status: "Approved", approvedBy: "Arjun Mehta (Admin Master)" })));
  };

  const getGreetingWish = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  };

  if (!isLoggedIn) {
    return <LoginPortal onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="light-theme bg-[#f8fafc] text-slate-800 min-h-screen flex font-sans">
      
      {/* 1. Left sidebar Navigation rail */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      {/* 2. Main content container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Widget */}
        <Header 
          role={role} 
          setRole={setRole} 
          currentTime={currentTime} 
          apiStatus={apiStatus} 
          onLogout={handleLogout}
        />

        {/* Outer content stage */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto w-full">
          
          {/* Dashboard Shared Filters (Shown on Dashboard, Analytics, and ESG sections to coordinate dataset calculations) */}
          {(activeTab === "dashboard" || activeTab === "analytics" || activeTab === "esg") && (
            <FiltersBar
              machines={machines}
              uniqueJobs={uniqueJobs}
              selectedMachine={selectedMachine}
              setSelectedMachine={setSelectedMachine}
              selectedShift={selectedShift}
              setSelectedShift={setSelectedShift}
              selectedJob={selectedJob}
              setSelectedJob={setSelectedJob}
              selectedPeriodType={selectedPeriodType}
              setSelectedPeriodType={setSelectedPeriodType}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              onResetFilters={handleResetFilters}
            />
          )}

          {/* 3. Conditional rendering of active tab panels */}
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              
              {/* Corporate Welcome Header */}
              <div className="bg-gradient-to-r from-white via-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-500/5 rounded-full blur-3xl"></div>
                <div className="space-y-2.5">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 rounded-full">
                    {getGreetingWish()}, {role === "admin" ? "Arjun Mehta" : role === "user" ? "Staff Operator" : "Veritas Auditor"}!
                  </span>
                  
                  <h2 className="text-base font-bold text-slate-800 tracking-tight font-display flex items-center gap-2 mt-1">
                    <Shield className="h-5 w-5 text-emerald-600" />
                    Carbon Cutters ESG Workspace
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                    Welcome to the digital ESG ledger. This secure workspace tracks precise real-time mechanical telemetry across your CNC milling centers, assembly lines, and transport logistics to ensure elegant, compliant reporting.
                  </p>
                </div>

                <div className="flex items-center gap-3 font-mono shrink-0">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-xs">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">PENDING ACTIONS</span>
                    <span className="text-xl font-bold text-amber-600 mt-1 block">
                      {pendingApprovalsCount + pendingDocsVerification.length}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-xs">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">APPROVED LEDGER ITEMS</span>
                    <span className="text-xl font-bold text-emerald-600 mt-1 block">
                      {machineLogs.filter(l => l.status === "Approved").length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Key Workflow Approvals Drawer & Action Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Pending Actions Feed (takes 2 columns) */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 tracking-wider font-display uppercase flex items-center gap-1.5">
                        <Cpu className="h-4.5 w-4.5 text-amber-500" />
                        Awaiting Corporate Sign-Off
                      </h3>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">Raw manufacturing logs logged by operators that must be signed off by Chief ESG Admin</p>
                    </div>

                    {role === "admin" && pendingApprovalsCount > 0 && (
                      <button
                        onClick={handleApproveAllDashboard}
                        className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition-all"
                      >
                        APPROVE ALL RECORD COORDINATES
                      </button>
                    )}
                  </div>

                  {pendingApprovalsCount === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs font-mono border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                      ✓ Database complete. All raw CNC telemetry and freight waybills have been certified.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                      {/* Machine Pending list */}
                      {pendingMachineApprovals.map((log) => (
                        <div key={log.id} className="bg-slate-50/50 p-3.5 border border-slate-200/60 rounded-xl flex items-center justify-between gap-4 transition-all hover:border-emerald-300 hover:bg-white">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-slate-700">{log.machineName.split(" (")[0]}</span>
                              <span className="text-[8px] font-mono bg-amber-50 text-amber-700 border border-amber-200/50 px-1.5 rounded uppercase">
                                Telemetry pending
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono">
                              <span>Shift: <span className="text-slate-600">{log.shift}</span></span>
                              <span>•</span>
                              <span>Job: <span className="text-slate-600">{log.jobId}</span></span>
                              <span>•</span>
                              <span>Impact: <span className="text-rose-600 font-bold">{log.scope1Direct + log.scope2Indirect} kg</span></span>
                            </div>
                          </div>

                          {role === "admin" ? (
                            <button
                              onClick={() => handleApproveMachineLog(log.id, "Arjun Mehta (Admin)")}
                              className="text-[10px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1 rounded transition-all"
                            >
                              CERTIFY
                            </button>
                          ) : (
                            <span className="text-[9px] font-mono text-slate-400 italic">Admin Sign-off Required</span>
                          )}
                        </div>
                      ))}

                      {/* Logistics Pending list */}
                      {pendingLogisticsApprovals.map((log) => (
                        <div key={log.id} className="bg-slate-50/50 p-3.5 border border-slate-200/60 rounded-xl flex items-center justify-between gap-4 transition-all hover:border-emerald-300 hover:bg-white">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-slate-700">{log.carrierName} ({log.direction})</span>
                              <span className="text-[8px] font-mono bg-amber-50 text-amber-700 border border-amber-200/50 px-1.5 rounded uppercase">
                                Freight pending
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono">
                              <span>Mode: <span className="text-slate-600">{log.mode}</span></span>
                              <span>•</span>
                              <span>Weight: <span className="text-slate-600">{log.cargoWeightTons} Tons</span></span>
                              <span>•</span>
                              <span>Impact: <span className="text-purple-600 font-bold">{log.emissionsScope3} kg</span></span>
                            </div>
                          </div>

                          {role === "admin" ? (
                            <button
                              onClick={() => handleApproveLogisticsLog(log.id, "Arjun Mehta (Admin)")}
                              className="text-[10px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1 rounded transition-all"
                            >
                              CERTIFY
                            </button>
                          ) : (
                            <span className="text-[9px] font-mono text-slate-400 italic">Admin Sign-off Required</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ISO Audit Check-ins Sidebar (takes 1 column) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-800 tracking-wider font-display uppercase">Audit Quality Checklist</h3>
                  
                  <div className="space-y-3 font-mono text-[11px]">
                    {[
                      { text: "Operational Boundaries Verified", done: true },
                      { text: "Approved Telemetry Logs Sign-off", done: pendingApprovalsCount === 0 },
                      { text: "Material Mill Invoices Indexed", done: complianceDocs.filter(d => d.category === "Material Sheet").length > 0 },
                      { text: "Electricity Utility Bill Matching", done: complianceDocs.filter(d => d.category === "Utility Bill").length > 0 },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl">
                        <span className="text-slate-500 max-w-[200px] truncate">{item.text}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                          item.done ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" : "bg-amber-50 text-amber-700 border border-amber-200/50 animate-pulse"
                        }`}>
                          {item.done ? "COMPLIANT" : "PENDING"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-xl space-y-1.5 text-[10px]">
                    <span className="text-slate-400 font-mono block font-bold">AUDITOR BRIEFING</span>
                    <p className="text-slate-500 leading-normal">
                      The Veritas Third-Party verification cycle starts shortly. Ensure all pending forklift refuel slips and waybills are verified inside the Documents Library tab.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: RICH DATA ANALYTICS */}
          {activeTab === "analytics" && (
            <AnalyticsView 
              filteredLogs={activeLogs} 
              filteredLogistics={activeLogistics} 
            />
          )}

          {/* TAB 3: NON-EDITABLE ESG REPORTING LEDGER */}
          {activeTab === "esg" && (
            <EsgLedgerView 
              filteredLogs={activeLogs} 
              filteredLogistics={activeLogistics}
              onTriggerAuditExport={() => {
                setActiveTab("reports");
              }}
            />
          )}

          {/* TAB 4: MACHINES OPERATIONS COCKPIT */}
          {activeTab === "machines" && (
            <MachinesView
              role={role}
              machines={machines}
              machineLogs={machineLogs}
              onAddMachineLog={handleAddMachineLog}
              onApproveMachineLog={handleApproveMachineLog}
              onDeleteMachineLog={handleDeleteMachineLog}
              iotActive={iotActive}
              setIotActive={setIotActive}
            />
          )}

          {/* TAB 5: LOGISTICS, TRANSPORT & WMS PORTAL */}
          {activeTab === "logistics" && (
            <LogisticsView
              role={role}
              logisticsLogs={logisticsLogs}
              onAddLogisticsLog={handleAddLogisticsLog}
              onApproveLogisticsLog={handleApproveLogisticsLog}
              onDeleteLogisticsLog={handleDeleteLogisticsLog}
            />
          )}

          {/* TAB 6: AI INTERACTIVE CHAT ADVISOR */}
          {activeTab === "chat" && (
            <AiChatbot onSendMessageToGemini={handleSendMessageToGemini} />
          )}

          {/* TAB 7: EVIDENCE VAULT AND DOCUMENTS LIBRARY */}
          {activeTab === "documents" && (
            <DocumentLibrary
              role={role}
              documents={complianceDocs}
              machines={machines}
              onUploadDoc={handleUploadDoc}
              onVerifyDoc={handleVerifyDoc}
              onDeleteDoc={handleDeleteDoc}
            />
          )}

          {/* TAB 8: REPORT GENERATOR AND DEVICE EXPORTER */}
          {activeTab === "reports" && (
            <ReportsView
              machines={machines}
              machineLogs={machineLogs}
              logisticsLogs={logisticsLogs}
              onGenerateAiReport={handleGenerateAiReport}
            />
          )}

          {/* TAB 8.5: REVIEWS AND FEEDBACK */}
          {activeTab === "feedback" && (
            <FeedbackView 
              role={role} 
              reviews={feedbackReviews} 
              onAddReview={handleAddFeedbackReview} 
            />
          )}

          {/* TAB 9: SETTINGS & CORPORATE STANDARDS */}
          {activeTab === "settings" && (
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-6 max-w-4xl">
              
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-xs font-bold text-slate-800 tracking-wider font-display uppercase">Corporate Settings & Emissions Coefficients</h3>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Define corporate emissions boundaries, validation protocols, and API access keys</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 font-mono">ISO 14064 TARGET TYPE</span>
                    <select className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500">
                      <option>SBTi Well-Below 1.5°C Alignment</option>
                      <option>Net-Zero 2035 Corporate Target</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 font-mono">AUTOMATED PLC POLLING FREQUENCY</span>
                    <select className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500">
                      <option>Real-time (OPC-UA Push)</option>
                      <option>Every 1 hour (Modbus Pull)</option>
                      <option>Daily Shift-End (Batch operator logs)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider block">GHG Emissions Coefficients used by System</span>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[10px] font-mono text-slate-500">
                    <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-xs">
                      <span className="text-slate-400 block">DIESEL (S1)</span>
                      <span className="text-slate-700 font-bold">2.68 kg CO2e / Ltr</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-xs">
                      <span className="text-slate-400 block">ELECTRICITY (S2)</span>
                      <span className="text-slate-700 font-bold">0.72 kg CO2e / kWh</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-xs">
                      <span className="text-slate-400 block">STEEL BILLETS (S3)</span>
                      <span className="text-slate-700 font-bold">2.10 kg CO2e / kg</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-xs">
                      <span className="text-slate-400 block">ROAD FREIGHT (S3)</span>
                      <span className="text-slate-700 font-bold">0.15 kg CO2e / km-ton</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => alert("Settings saved to browser memory! Current coefficients validated.")}
                    className="text-xs font-mono font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 rounded-xl transition-all shadow-sm"
                  >
                    SAVE PREFERENCES
                  </button>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

    </div>
  );
}
