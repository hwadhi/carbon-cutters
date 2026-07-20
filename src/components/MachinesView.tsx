import React, { useState } from "react";
import { 
  Factory, 
  Plus, 
  Send, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  Activity, 
  User, 
  Flame, 
  Zap, 
  Truck, 
  Trash2,
  Cpu,
  RefreshCw,
  X,
  Play,
  Square
} from "lucide-react";
import { MachineAsset, MachineLog, UserRole } from "../types";

interface MachinesViewProps {
  role: UserRole;
  machines: MachineAsset[];
  machineLogs: MachineLog[];
  onAddMachineLog: (log: Omit<MachineLog, "id" | "timestamp">) => void;
  onApproveMachineLog: (id: string, adminName: string) => void;
  onDeleteMachineLog: (id: string) => void;
  iotActive: boolean;
  setIotActive: (active: boolean) => void;
}

export default function MachinesView({
  role,
  machines,
  machineLogs,
  onAddMachineLog,
  onApproveMachineLog,
  onDeleteMachineLog,
  iotActive,
  setIotActive
}: MachinesViewProps) {
  
  // Modal toggle for adding log
  const [showLogForm, setShowLogForm] = useState(false);
  
  // New Log inputs
  const [selectedMachineId, setSelectedMachineId] = useState(machines[0]?.id || "");
  const [selectedShift, setSelectedShift] = useState<"Shift 1" | "Shift 2" | "Shift 3">("Shift 1");
  const [logDate, setLogDate] = useState(new Date().toISOString().split("T")[0]);
  const [jobId, setJobId] = useState("JOB-2026");
  const [jobName, setJobName] = useState("JOB-2026 (Alloy Fittings)");
  
  // Direct inputs
  const [scope1, setScope1] = useState(40);
  const [scope2, setScope2] = useState(180);
  const [scope3Mat, setScope3Mat] = useState(520);
  const [scope3Waste, setScope3Waste] = useState(30);

  const handleSubmitLog = (e: React.FormEvent) => {
    e.preventDefault();
    const machine = machines.find(m => m.id === selectedMachineId);
    if (!machine) return;

    onAddMachineLog({
      machineId: selectedMachineId,
      machineName: machine.name,
      productionLine: machine.line,
      shift: selectedShift,
      date: logDate,
      jobId,
      jobName,
      scope1Direct: Number(scope1),
      scope2Indirect: Number(scope2),
      scope3Materials: Number(scope3Mat),
      scope3Waste: Number(scope3Waste),
      status: "Pending Approval"
    });

    setShowLogForm(false);
    // Reset values slightly
    setScope1(Math.round(30 + Math.random() * 20));
    setScope2(Math.round(150 + Math.random() * 50));
    setScope3Mat(Math.round(400 + Math.random() * 200));
  };

  return (
    <div className="space-y-6">
      
      {/* Top operational controls & Modbus stream indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-white/5 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/10">
            <Cpu className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-wider font-display uppercase">OPC-UA / Modbus Live IoT Stream</h3>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Automated PLC data capture directly from CNC machine registers & power meters</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* IoT Switch */}
          <button
            onClick={() => setIotActive(!iotActive)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
              iotActive 
                ? "bg-amber-500/15 border-amber-500/30 text-amber-400" 
                : "bg-slate-950 border-white/10 text-slate-400 hover:bg-slate-900"
            }`}
          >
            {iotActive ? (
              <>
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
                <span>IOT STREAM ACTIVE</span>
                <Square className="h-3.5 w-3.5 shrink-0" />
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-slate-600"></span>
                <span>IOT STREAM OFF</span>
                <Play className="h-3.5 w-3.5 shrink-0" />
              </>
            )}
          </button>

          {/* New manual log button */}
          {role !== "auditor" && (
            <button
              onClick={() => setShowLogForm(true)}
              className="text-xs font-mono font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/10"
            >
              <Plus className="h-4 w-4" />
              LOG TELEMETRY
            </button>
          )}
        </div>
      </div>

      {/* Grid of active machines */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {machines.map((machine) => {
          const mLogs = machineLogs.filter(l => l.machineId === machine.id && l.status === "Approved");
          const totalEmissions = mLogs.reduce((acc, curr) => acc + curr.scope1Direct + curr.scope2Indirect + curr.scope3Materials + curr.scope3Waste, 0);

          return (
            <div key={machine.id} className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-white/10 transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none"></div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono bg-slate-950 px-2 py-1 rounded border border-white/5 text-slate-400">
                    {machine.line}
                  </span>
                  <span className={`h-2 w-2 rounded-full ${machine.status === "Active" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}></span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white font-display leading-tight">{machine.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1.5 font-mono">
                    <User className="h-3 w-3 text-emerald-400" />
                    Operator: {machine.operatorName}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                  <div>
                    <span className="text-slate-500 block">BASE RATING</span>
                    <span className="text-white font-semibold">{machine.basePowerkW} kW</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">COOLANT CAP</span>
                    <span className="text-white font-semibold">{machine.coolantCapacityLtrs > 0 ? `${machine.coolantCapacityLtrs} Ltrs` : "N/A (Dry)"}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Total Approved CO2:</span>
                <span className="text-emerald-400 font-bold">{totalEmissions > 0 ? `${(totalEmissions / 1000).toFixed(2)} Tons` : "0.00 Tons"}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Operational Logs Queue & Approvals Ledger */}
      <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-white/5">
          <div>
            <h4 className="text-xs font-bold text-white tracking-wider font-display uppercase">Raw Telemetry Validation Buffer</h4>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Submitted operational logs requiring auditor/admin certification before compounding into final ESG sections</p>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-lg flex items-center gap-1">
              <Clock className="h-3 w-3 animate-spin" />
              {machineLogs.filter(l => l.status === "Pending Approval").length} Pending Certification
            </span>
          </div>
        </div>

        {machineLogs.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs font-mono">No telemetry log entries.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-mono font-bold text-slate-400">
                  <th className="py-2 px-3">ID</th>
                  <th className="py-2 px-3">TIMESTAMP</th>
                  <th className="py-2 px-3">ASSET</th>
                  <th className="py-2 px-3">SHIFT</th>
                  <th className="py-2 px-3 text-right">SCOPE 1 (S1)</th>
                  <th className="py-2 px-3 text-right">SCOPE 2 (S2)</th>
                  <th className="py-2 px-3 text-right">SCOPE 3 (S3)</th>
                  <th className="py-2 px-3 text-center">STATUS</th>
                  {role !== "auditor" && <th className="py-2 px-3 text-right">CERTIFICATION ACTIONS</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-mono text-slate-300">
                {machineLogs.map((log) => {
                  const isPending = log.status === "Pending Approval";
                  return (
                    <tr key={log.id} className="hover:bg-white/[0.01]">
                      <td className="py-3 px-3 text-slate-400 font-bold">{log.id}</td>
                      <td className="py-3 px-3 whitespace-nowrap text-slate-500">{log.date}</td>
                      <td className="py-3 px-3 font-sans font-semibold text-white">{log.machineName.split(" (")[0]}</td>
                      <td className="py-3 px-3">
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-white/5 text-[10px]">
                          {log.shift}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-rose-400">{log.scope1Direct} kg</td>
                      <td className="py-3 px-3 text-right text-amber-400">{log.scope2Indirect} kg</td>
                      <td className="py-3 px-3 text-right text-purple-400">{log.scope3Materials + log.scope3Waste} kg</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          isPending 
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      
                      {role !== "auditor" && (
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          {isPending ? (
                            <div className="flex items-center justify-end gap-2">
                              {role === "admin" ? (
                                <button
                                  onClick={() => onApproveMachineLog(log.id, "Arjun Mehta (Admin)")}
                                  className="text-[10px] font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 px-2.5 py-1 rounded transition-all flex items-center gap-1"
                                >
                                  <CheckCircle2 className="h-3 w-3" />
                                  APPROVE
                                </button>
                              ) : (
                                <span className="text-[9px] text-slate-500 font-mono italic">Needs Admin</span>
                              )}
                              <button
                                onClick={() => onDeleteMachineLog(log.id)}
                                className="text-[10px] font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-2 py-1 rounded transition-all"
                              >
                                DELETE
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-500 flex items-center justify-end gap-1 font-mono italic">
                              Approved by {log.approvedBy || "Admin"}
                            </span>
                          )}
                        </td>
                      )}

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Submission Modal Overlay */}
      {showLogForm && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-2">
                <Factory className="h-4.5 w-4.5 text-emerald-400" />
                <h4 className="text-sm font-bold text-white tracking-wider font-display uppercase">Add Machine Telemetry Log</h4>
              </div>
              <button onClick={() => setShowLogForm(false)} className="text-slate-400 hover:text-white transition-all">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitLog} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 font-mono">SELECT MACHINE</label>
                  <select
                    value={selectedMachineId}
                    onChange={(e) => setSelectedMachineId(e.target.value)}
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                  >
                    {machines.map(m => (
                      <option key={m.id} value={m.id}>{m.name.split(" (")[0]}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 font-mono">SHIFT</label>
                  <select
                    value={selectedShift}
                    onChange={(e) => setSelectedShift(e.target.value as any)}
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                  >
                    <option value="Shift 1">Shift 1</option>
                    <option value="Shift 2">Shift 2</option>
                    <option value="Shift 3">Shift 3</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 font-mono">DATE</label>
                  <input
                    type="date"
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/30 font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 font-mono">JOB ID</label>
                  <input
                    type="text"
                    value={jobId}
                    onChange={(e) => setJobId(e.target.value)}
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/30 font-mono"
                  />
                </div>
              </div>

              <div className="border-t border-white/5 pt-3">
                <h5 className="text-[10px] font-bold text-slate-400 font-mono mb-2 tracking-wider">MEASURED EMISSIONS DATA (KG CO2E)</h5>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1 bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                    <label className="text-[9px] font-mono text-rose-400 flex items-center gap-1">
                      <Flame className="h-3 w-3" />
                      SCOPE 1 (FUEL COMBUST)
                    </label>
                    <input
                      type="number"
                      value={scope1}
                      onChange={(e) => setScope1(Number(e.target.value))}
                      className="bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white mt-1 w-full font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-1 bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                    <label className="text-[9px] font-mono text-amber-400 flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      SCOPE 2 (GRID ELECTRIC)
                    </label>
                    <input
                      type="number"
                      value={scope2}
                      onChange={(e) => setScope2(Number(e.target.value))}
                      className="bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white mt-1 w-full font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="flex flex-col gap-1 bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                    <label className="text-[9px] font-mono text-purple-400 flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      SCOPE 3 (RAW MATS OVERHEAD)
                    </label>
                    <input
                      type="number"
                      value={scope3Mat}
                      onChange={(e) => setScope3Mat(Number(e.target.value))}
                      className="bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white mt-1 w-full font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-1 bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                    <label className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                      <Trash2 className="h-3 w-3" />
                      SCOPE 3 (WASTE DISPOSAL)
                    </label>
                    <input
                      type="number"
                      value={scope3Waste}
                      onChange={(e) => setScope3Waste(Number(e.target.value))}
                      className="bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white mt-1 w-full font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowLogForm(false)}
                  className="px-4 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-slate-400 hover:text-white transition-all font-mono"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs rounded-xl transition-all font-mono flex items-center gap-1"
                >
                  <Send className="h-3.5 w-3.5" />
                  SUBMIT TO VERIFY
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
