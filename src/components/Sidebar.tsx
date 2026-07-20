import React from "react";
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
  ChevronRight,
  Shield,
  Star
} from "lucide-react";

export type TabType = 
  | "dashboard" 
  | "analytics" 
  | "esg" 
  | "machines" 
  | "logistics" 
  | "chat" 
  | "documents" 
  | "reports" 
  | "feedback"
  | "settings";

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  pendingApprovalsCount: number;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  collapsed, 
  setCollapsed,
  pendingApprovalsCount
}: SidebarProps) {
  
  const navItems = [
    { id: "dashboard" as TabType, label: "Dashboard", sub: "Carbon score & ESG overview", icon: Gauge },
    { id: "analytics" as TabType, label: "Analytics", sub: "Visual emissions profiling", icon: Activity },
    { id: "esg" as TabType, label: "ESG Section", sub: "Non-editable standard ledger", icon: Layers },
    { id: "machines" as TabType, label: "Machines & Lines", sub: "Production line telemetry", icon: Factory },
    { id: "logistics" as TabType, label: "Logistics & WMS", sub: "Inbound, outbound & warehouse", icon: Truck },
    { id: "chat" as TabType, label: "AI Advisor", sub: "Interactive compliance advisor", icon: MessageSquareCode },
    { id: "documents" as TabType, label: "Documents Library", sub: "Audit evidence & vault", icon: FileCheck },
    { id: "reports" as TabType, label: "Reports", sub: "AI-generated disclosure sheets", icon: FileText },
    { id: "feedback" as TabType, label: "Review & Feedback", sub: "Contact us & reviews", icon: Star },
    { id: "settings" as TabType, label: "Settings", sub: "Configure corporate credentials", icon: Settings },
  ];


  return (
    <aside 
      className={`bg-white border-r border-slate-200/80 flex flex-col h-screen sticky top-0 transition-all duration-300 z-30 shrink-0 ${
        collapsed ? "w-16 sm:w-20" : "w-64 sm:w-72"
      }`}
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0 ring-1 ring-emerald-200 shadow-sm">
            <Shield className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-emerald-700">CARBON</span>
              <span className="text-[10px] font-semibold tracking-[0.2em] text-slate-600">CUTTERS</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative group text-left ${
                isActive 
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-medium" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
              }`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"}`} />
              
              {!collapsed && (
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wide truncate">{item.label}</span>
                    {item.id === "dashboard" && pendingApprovalsCount > 0 && (
                      <span className="bg-amber-100 border border-amber-200 text-amber-800 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full">
                        {pendingApprovalsCount}
                      </span>
                    )}
                  </div>
                  <p className="text-[9px] text-slate-400 font-mono truncate mt-0.5">{item.sub}</p>
                </div>
              )}

              {/* Collapsed tooltips */}
              {collapsed && (
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-800 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 whitespace-nowrap shadow-lg z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Collapse Button */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-lg text-xs font-mono transition-all border border-slate-200"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : "◀ COLLAPSE"}
        </button>
      </div>
    </aside>
  );
}
