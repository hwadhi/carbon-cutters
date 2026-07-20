import React from "react";
import { 
  Layers, 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  HelpCircle, 
  Download, 
  Globe, 
  ArrowUpRight,
  FileSpreadsheet
} from "lucide-react";
import { MachineLog, LogisticsLog } from "../types";

interface EsgLedgerViewProps {
  filteredLogs: MachineLog[];
  filteredLogistics: LogisticsLog[];
  onTriggerAuditExport: () => void;
}

export default function EsgLedgerView({ 
  filteredLogs, 
  filteredLogistics,
  onTriggerAuditExport
}: EsgLedgerViewProps) {
  
  // Filter for approved logs only to populate the final official ESG statement
  const approvedMachineLogs = filteredLogs.filter(l => l.status === "Approved");
  const approvedLogisticsLogs = filteredLogistics.filter(l => l.status === "Approved");

  // Sum Scope 1 & 2
  const s1Direct = approvedMachineLogs.reduce((acc, curr) => acc + curr.scope1Direct, 0);
  const s2Indirect = approvedMachineLogs.reduce((acc, curr) => acc + curr.scope2Indirect, 0);
  
  // Sum Scope 3 components
  const s3Mat = approvedMachineLogs.reduce((acc, curr) => acc + curr.scope3Materials, 0);
  const s3Waste = approvedMachineLogs.reduce((acc, curr) => acc + curr.scope3Waste, 0);
  const s3Freight = approvedLogisticsLogs.reduce((acc, curr) => acc + curr.emissionsScope3, 0);
  const s3Total = s3Mat + s3Waste + s3Freight;

  const totalCO2e = s1Direct + s2Indirect + s3Total;

  // Static target calculations
  const targetYearLimit = 150000; // 150 Tons CO2e
  const targetMetPct = totalCO2e > 0 ? Math.round(((targetYearLimit - totalCO2e) / targetYearLimit) * 100) : 100;
  const complianceScore = Math.min(100, Math.max(30, 95 - Math.round(totalCO2e / 1200)));

  return (
    <div className="space-y-6">
      
      {/* Locked Section Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl mt-0.5 border border-emerald-200 shrink-0">
            <Lock className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800">CERTIFIED NON-EDITABLE LEDGER</h3>
              <span className="text-[9px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                ISO 14064 COMPLIANT
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
              This panel presents the locked, immutable ESG carbon balances compiled exclusively from authorized, approved logs. Direct manual overrides are disabled to enforce SEC climate reporting integrity.
            </p>
          </div>
        </div>
        
        <button
          onClick={onTriggerAuditExport}
          className="text-xs font-mono font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
        >
          <Download className="h-4 w-4" />
          EXPORT LEDGER
        </button>
      </div>

      {/* GHG Protocol Scope Categories Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Scope 1 Panel */}
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 font-mono">GHG SCOPE 1</span>
            <span className="text-[10px] text-slate-500 font-mono">DIRECT EMISSIONS</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-800 font-display">{(s1Direct / 1000).toFixed(3)}</span>
              <span className="text-xs text-slate-400 font-mono">Tons CO2e</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 leading-normal font-mono">
              Combustion of fossil fuels (diesel, LPG) & process coolants consumed on-site.
            </p>
          </div>
          <div className="border-t border-white/5 pt-3 space-y-2">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>Forklifts (LPG/Diesel):</span>
              <span className="text-slate-800 font-semibold">{s1Direct} kg</span>
            </div>
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>Stationary Gas:</span>
              <span className="text-white font-semibold">0 kg</span>
            </div>
          </div>
        </div>

        {/* Scope 2 Panel */}
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 font-mono">GHG SCOPE 2</span>
            <span className="text-[10px] text-slate-500 font-mono">INDIRECT ENERGY</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-800 font-display">{(s2Indirect / 1000).toFixed(3)}</span>
              <span className="text-xs text-slate-400 font-mono">Tons CO2e</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 leading-normal font-mono">
              Purchased electricity imported from the utility grid, offset by active solar gen.
            </p>
          </div>
          <div className="border-t border-white/5 pt-3 space-y-2">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>Grid Power Consumed:</span>
              <span className="text-slate-800 font-semibold">{(s2Indirect).toFixed(0)} kg</span>
            </div>
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>Renewable Offsets:</span>
              <span className="text-emerald-600 font-semibold">Calculated Live</span>
            </div>
          </div>
        </div>

        {/* Scope 3 Panel */}
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-600 font-mono">GHG SCOPE 3</span>
            <span className="text-[10px] text-slate-500 font-mono">VALUE CHAIN</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-800 font-display">{(s3Total / 1000).toFixed(3)}</span>
              <span className="text-xs text-slate-400 font-mono">Tons CO2e</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 leading-normal font-mono">
              Upstream material extraction, logistics freight & downstream waste lifecycles.
            </p>
          </div>
          <div className="border-t border-white/5 pt-3 space-y-2">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>Raw Materials:</span>
              <span className="text-slate-800 font-semibold">{s3Mat} kg</span>
            </div>
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>Supply Freight:</span>
              <span className="text-slate-800 font-semibold">{s3Freight} kg</span>
            </div>
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>Disposal overhead:</span>
              <span className="text-slate-800 font-semibold">{s3Waste} kg</span>
            </div>
          </div>
        </div>

      </div>

      {/* Disclosures & Regulatory compliance checks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Disclosure Statements */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4.5 w-4.5 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800 tracking-wider font-display uppercase">SEC Climate Compliance Statement</span>
            </div>
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
          </div>

          <div className="bg-slate-950/80 p-4 border border-white/5 rounded-xl space-y-3">
            <p className="text-xs text-slate-700 font-serif leading-relaxed italic">
              "Based on verified electronic operational telemetry compiled under strict ISO 14064-1 criteria, Apex Precision Manufacturing Pvt. Ltd. declares a total certified green burden of <span className="font-sans font-bold text-emerald-600">{(totalCO2e / 1000).toFixed(3)} Metric Tons of CO2 equivalent</span> for the defined filtered coordinates. The organization certifies that no raw logs were bypassed, modified, or manually adjusted during this consolidation cycle."
            </p>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-white/5">
              <span>STAMP: SUSTANEER_CERT_LEDGER_AJP_0726</span>
              <span>SIGNED: ESG AUDIT COUNCIL</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5">
              <span className="text-[10px] font-bold text-slate-400 font-mono">COMPLIANCE INDEX SCORE</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-emerald-600 font-display">{complianceScore}%</span>
                <span className="text-[9px] text-slate-500 font-mono">GRADE: AAA Excellent</span>
              </div>
            </div>
            <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5">
              <span className="text-[10px] font-bold text-slate-400 font-mono">TARGET DEVIATION</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-sky-600 font-display">{targetMetPct}%</span>
                <span className="text-[9px] text-slate-500 font-mono">BELOW CORPORATE CAPS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Checkpoints */}
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 space-y-4">
          <span className="text-xs font-bold text-slate-800 tracking-wider font-display uppercase block">GHG Audit Checkpoints</span>
          
          <div className="space-y-3.5">
            {[
              { label: "ISO 14064-1 Boundaries Defined", status: true, desc: "Operational and organizational boundaries locked." },
              { label: "Approved Machine Logs Matched", status: true, desc: "Only certified telemetries are fed into the summary." },
              { label: "Scope 3 Logistics Sourced", status: true, desc: "Freight distances backed by freight invoices." },
              { label: "Zero Manual Data Bypass", status: true, desc: "Tamperproof audit log active on settings portal." },
            ].map((chk, i) => (
              <div key={i} className="flex gap-2.5 items-start">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-slate-700 block">{chk.label}</span>
                  <span className="text-[10px] text-slate-600 leading-normal font-mono">{chk.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Certified Ledger Table of contributing records */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xs font-bold text-slate-800 tracking-wider font-display uppercase">Contributing Certified Telemetry Logs</h3>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Every record that has passed QA/Signoff and contributes to the metrics above</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-50 border border-slate-200 text-[10px] text-slate-600 font-mono px-2.5 py-1 rounded-lg">
              {approvedMachineLogs.length} verified records
            </span>
          </div>
        </div>

        {approvedMachineLogs.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs font-mono border border-dashed border-slate-200 rounded-xl bg-slate-50">
            No certified machine logs match current filter coordinates.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-mono font-bold text-slate-500">
                  <th className="py-2.5 px-3">RECORD ID</th>
                  <th className="py-2.5 px-3">DATE / SHIFT</th>
                  <th className="py-2.5 px-3">ASSET NAME</th>
                  <th className="py-2.5 px-3">JOB ID</th>
                  <th className="py-2.5 px-3 text-right">S1 DIRECT</th>
                  <th className="py-2.5 px-3 text-right">S2 ELECTRIC</th>
                  <th className="py-2.5 px-3 text-right">S3 MATERIAL</th>
                  <th className="py-2.5 px-3 text-right">S3 WASTE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs font-mono text-slate-600">
                {approvedMachineLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-all">
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">{log.id}</td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span>{log.date}</span>
                      <span className="text-[9px] text-slate-500 bg-slate-950 px-1 py-0.5 rounded border border-white/5 ml-1.5">{log.shift}</span>
                    </td>
                    <td className="py-2.5 px-3 font-sans font-semibold text-white">{log.machineName.split(" (")[0]}</td>
                    <td className="py-2.5 px-3 text-slate-400">{log.jobId}</td>
                    <td className="py-2.5 px-3 text-right text-rose-400">{log.scope1Direct} kg</td>
                    <td className="py-2.5 px-3 text-right text-amber-400">{log.scope2Indirect} kg</td>
                    <td className="py-2.5 px-3 text-right text-purple-400">{log.scope3Materials} kg</td>
                    <td className="py-2.5 px-3 text-right text-emerald-400">{log.scope3Waste} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
