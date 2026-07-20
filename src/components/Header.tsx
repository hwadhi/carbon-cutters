import React, { useState } from "react";
import { 
  Sparkles, 
  Clock, 
  User, 
  ChevronDown, 
  ShieldAlert, 
  UserCheck, 
  Unlock,
  AlertCircle,
  LogOut
} from "lucide-react";
import { UserRole } from "../types";

interface HeaderProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentTime: string;
  apiStatus: { hasApiKey: boolean; isMock: boolean; rateLimited?: boolean };
  onLogout?: () => void;
}

export default function Header({ 
  role, 
  setRole, 
  currentTime, 
  apiStatus,
  onLogout
}: HeaderProps) {

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const rolesConfig = {
    admin: {
      name: "Admin (Chief ESG Officer)",
      badge: "Admin",
      color: "border-emerald-200 text-emerald-700 bg-emerald-50",
      desc: "Full read-write & approval permissions. Can sign off carbon reports and documents."
    },
    user: {
      name: "Operator (Production Staff)",
      badge: "Staff",
      color: "border-sky-200 text-sky-700 bg-sky-50",
      desc: "Can log machine and logistics raw emissions and toggle simulation streams."
    },
    auditor: {
      name: "Auditor (Third-Party Verifier)",
      badge: "Auditor",
      color: "border-purple-200 text-purple-700 bg-purple-50",
      desc: "Read-only compliance verification mode. Can download verified audit packs."
    }
  };

  return (
    <header className="bg-white/85 border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 backdrop-blur-md z-20">
      
      {/* Title block */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold tracking-wide text-slate-500">APEX PRECISION MANUFACTURING</h1>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-bold text-slate-800 tracking-wider font-display">CARBON CUTTERS ESG PLATFORM</span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">LOCATION: INDUSTRIAL SECTOR-3 • CERTIFICATION ACTIVE</p>
        </div>
      </div>

      {/* Control Widgets */}
      <div className="flex items-center flex-wrap gap-4 select-none">
        
        {/* Digital UTC clock */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl font-mono text-[10px] text-slate-600">
          <Clock className="h-3.5 w-3.5 text-emerald-600" />
          <span>{currentTime || "CONNECTING..."}</span>
        </div>

        {/* Period selection indicator */}
        <div className="bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold text-slate-600 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>PERIOD: <span className="text-emerald-600">FY 2026-27</span></span>
        </div>

        {/* AI Audit Status Indicator */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl">
          <Sparkles className={`h-3.5 w-3.5 ${apiStatus.rateLimited ? "text-amber-500 animate-pulse" : "text-emerald-600"}`} />
          <span className="text-[10px] text-slate-600 font-mono">
            AUDIT CORE: <span className={`${apiStatus.rateLimited ? "text-amber-600" : "text-emerald-600"} font-semibold`}>
              {apiStatus.rateLimited ? "Heuristics (API Quota)" : apiStatus.isMock ? "Eco-Heuristics" : "Gemini 3.5 Active"}
            </span>
          </span>
        </div>

        {/* User Persona Profile and Login Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl transition-all text-left"
          >
            <div className="h-6 w-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
              {role === "admin" ? "AM" : role === "user" ? "OP" : "AU"}
            </div>
            
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800 leading-none">
                  {role === "admin" ? "Arjun Mehta" : role === "user" ? "Staff Operator" : "Veritas Auditor"}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
              </div>
              <span className={`text-[9px] font-mono inline-block px-1 rounded border mt-0.5 ${rolesConfig[role].color}`}>
                {rolesConfig[role].badge}
              </span>
            </div>
          </button>

          {dropdownOpen && (
            <>
              {/* Backing layer */}
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
              
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">CHOOSE ACCESS PORTAL</p>
                </div>
                
                <div className="py-1 space-y-1">
                  {(Object.keys(rolesConfig) as UserRole[]).map((roleKey) => {
                    const isSelected = role === roleKey;
                    const conf = rolesConfig[roleKey];
                    return (
                      <button
                        key={roleKey}
                        onClick={() => {
                          setRole(roleKey);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg transition-all flex flex-col gap-1 ${
                          isSelected ? "bg-slate-50 ring-1 ring-slate-200" : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">{conf.name}</span>
                          {isSelected && <UserCheck className="h-3.5 w-3.5 text-emerald-600" />}
                        </div>
                        <p className="text-[9px] text-slate-500 leading-normal">{conf.desc}</p>
                      </button>
                    );
                  })}
                </div>

                {onLogout && (
                  <div className="border-t border-slate-100 mt-2 pt-2 px-1">
                    <button
                      onClick={() => {
                        onLogout();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-rose-50 text-rose-600 font-mono text-[10px] font-bold flex items-center gap-2 transition-all"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      SIGN OUT SECURELY
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

      </div>

    </header>
  );
}
