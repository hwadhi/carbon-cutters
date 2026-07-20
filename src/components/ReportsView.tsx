import React, { useState } from "react";
import { 
  FileText, 
  Sparkles, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Info,
  Sliders,
  ChevronDown,
  Printer
} from "lucide-react";
import { MachineAsset, MachineLog, LogisticsLog } from "../types";

interface ReportsViewProps {
  machines: MachineAsset[];
  machineLogs: MachineLog[];
  logisticsLogs: LogisticsLog[];
  onGenerateAiReport: (machineId: string, shift: string, month: string) => Promise<{ text: string; source: string }>;
}

export default function ReportsView({
  machines,
  machineLogs,
  logisticsLogs,
  onGenerateAiReport
}: ReportsViewProps) {
  
  const [selectedMachineId, setSelectedMachineId] = useState("all");
  const [selectedShift, setSelectedShift] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("2026-07");
  
  const [generating, setGenerating] = useState(false);
  const [reportResult, setReportResult] = useState<string | null>(null);
  const [reportSource, setReportSource] = useState<string>("");

  const handleGenerate = async () => {
    setGenerating(true);
    setReportResult(null);
    try {
      const res = await onGenerateAiReport(selectedMachineId, selectedShift, selectedMonth);
      setReportResult(res.text);
      setReportSource(res.source);
    } catch (err) {
      setReportResult("An error occurred during generative report modeling. Please check your credentials.");
      setReportSource("Heuristic Model Error");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!reportResult) return;
    
    const element = document.createElement("a");
    const file = new Blob([
      `=========================================
SUSTANEER CERTIFIED CORPORATE ESG REPORT
CLIENT: AJANTA PHARMA LTD (MFG UNIT-II)
GENERATED TIMESTAMP: ${new Date().toUTCString()}
COORDINATES: Machine: ${selectedMachineId} | Shift: ${selectedShift} | Month: ${selectedMonth}
METHODOLOGY: GHG Protocol / ISO 14064-1
=========================================

${reportResult}

-----------------------------------------
CERTIFICATION GRANTED - IMMUTABLE DATABASE LEDGER
SUSTANEER AI ADVISOR COMPLIANCE VERIFICATION
-----------------------------------------`
    ], { type: "text/plain" });
    
    element.href = URL.createObjectURL(file);
    element.download = `Carbon_Cutters_ESG_Report_${selectedMachineId}_${selectedMonth}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      
      {/* Report filter setup card */}
      <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 space-y-4">
        
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Sparkles className="h-4.5 w-4.5 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-wider font-display uppercase">AI Carbon Optimization & Disclosure Generator</h3>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Select audit scope to synthesize carbon impact summaries with compliance suggestions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 font-mono">ASSET OF FOCUS</label>
            <div className="relative">
              <select
                value={selectedMachineId}
                onChange={(e) => setSelectedMachineId(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none appearance-none cursor-pointer"
              >
                <option value="all">Entire Manufacturing Facility (All Assets)</option>
                {machines.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 font-mono">SHIFT SEGMENT</label>
            <div className="relative">
              <select
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none appearance-none cursor-pointer"
              >
                <option value="all">Consolidated (All Shifts)</option>
                <option value="Shift 1">Shift 1 Only</option>
                <option value="Shift 2">Shift 2 Only</option>
                <option value="Shift 3">Shift 3 Only</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 font-mono">DISCLOSURE MONTH</label>
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none appearance-none cursor-pointer font-mono"
              >
                <option value="2026-07">July 2026</option>
                <option value="2026-06">June 2026</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

        </div>

        <div className="pt-2 flex items-center justify-between gap-4">
          <div className="text-[10px] text-slate-500 font-mono max-w-md">
            ⓘ The AI engine queries approved database rows. Unapproved logs are automatically ignored to preserve reporting integrity.
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className={`text-xs font-mono font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/10 ${
              generating ? "opacity-50 cursor-not-allowed animate-pulse" : ""
            }`}
          >
            <Sparkles className="h-4 w-4 animate-spin" />
            {generating ? "SYNTHESIZING REPORT..." : "COMPILE AI REPORT"}
          </button>
        </div>

      </div>

      {/* Report Result Panel */}
      {generating && (
        <div className="bg-slate-900/20 border border-dashed border-white/10 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3">
          <RefreshCw className="h-8 w-8 text-emerald-400 animate-spin" />
          <p className="text-xs font-mono text-slate-400">Querying Gemini 3.5 AI Core and executing Carbon Balancing formulas...</p>
        </div>
      )}

      {!generating && reportResult && (
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          
          <div className="bg-slate-950/80 px-5 py-3 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-emerald-400" />
              <span className="text-xs font-bold text-white tracking-wider font-display uppercase">Certified Output Document</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                METHOD: {reportSource}
              </span>
              <button
                onClick={handleDownload}
                className="text-[10px] font-mono font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 px-3 py-1 rounded transition-all flex items-center gap-1"
              >
                <Download className="h-3 w-3" />
                DOWNLOAD
              </button>
              <button
                onClick={() => window.print()}
                className="text-[10px] font-mono font-bold text-slate-400 hover:text-white px-2 py-1 rounded border border-white/5 transition-all flex items-center gap-1"
              >
                <Printer className="h-3 w-3" />
                PRINT
              </button>
            </div>
          </div>

          <div className="p-6 bg-slate-950/20 text-slate-200 space-y-4">
            <div className="border border-white/5 p-4 rounded-xl bg-slate-950/60 max-w-3xl mx-auto space-y-6 text-sm font-sans">
              
              <div className="text-center space-y-1.5 pb-4 border-b border-white/5">
                <h4 className="text-sm font-bold tracking-widest text-slate-400 font-mono">AJANTA PHARMA LTD</h4>
                <h3 className="text-lg font-bold text-white font-display">CARBON COMPLIANCE DISCLOSURE SHEET</h3>
                <p className="text-[10px] text-slate-500 font-mono uppercase">ISO 14064-1 STANDARDS • INTERNAL AUDITING COPY</p>
              </div>

              <div className="whitespace-pre-line leading-relaxed text-xs text-slate-300 font-mono space-y-4">
                {reportResult}
              </div>

              <div className="border-t border-white/5 pt-4 text-[10px] font-mono text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>DIGITAL CERTIFICATE ID: SUST_AI_AJP_DISC_726</span>
                <span>SIGNED BY CHIEF OPERATIONS AUDITING AGENT</span>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Static info box when no report compiled yet */}
      {!generating && !reportResult && (
        <div className="bg-slate-900/25 border border-white/5 rounded-2xl p-6 text-center text-slate-500 max-w-md mx-auto space-y-2">
          <FileText className="h-8 w-8 text-slate-600 mx-auto" />
          <h4 className="text-xs font-bold text-slate-300">No Report Compiled in this session</h4>
          <p className="text-[10px] font-mono leading-normal">
            Select your operational variables above (Machine, Shift, Month) and click Compile AI Report to view certified energy and carbon optimization sheets.
          </p>
        </div>
      )}

    </div>
  );
}
