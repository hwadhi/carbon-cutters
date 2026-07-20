import React, { useState } from "react";
import { 
  Truck, 
  Plus, 
  Send, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  X, 
  Layers, 
  Activity, 
  Warehouse, 
  Compass, 
  Navigation,
  Globe
} from "lucide-react";
import { LogisticsLog, UserRole } from "../types";

interface LogisticsViewProps {
  role: UserRole;
  logisticsLogs: LogisticsLog[];
  onAddLogisticsLog: (log: Omit<LogisticsLog, "id" | "timestamp">) => void;
  onApproveLogisticsLog: (id: string, adminName: string) => void;
  onDeleteLogisticsLog: (id: string) => void;
}

export default function LogisticsView({
  role,
  logisticsLogs,
  onAddLogisticsLog,
  onApproveLogisticsLog,
  onDeleteLogisticsLog
}: LogisticsViewProps) {
  
  const [showLogForm, setShowLogForm] = useState(false);
  
  // Form fields
  const [direction, setDirection] = useState<"Inbound" | "Outbound" | "WMS Inventory">("Inbound");
  const [mode, setMode] = useState<any>("Road Freight (Truck)");
  const [carrierName, setCarrierName] = useState("");
  const [weight, setWeight] = useState(15.5);
  const [distance, setDistance] = useState(250);
  const [emissions, setEmissions] = useState(380);
  const [jobId, setJobId] = useState("JOB-2027");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // Adjust default emissions factor when inputs change to make logging helpful
  const handleInputsChange = (field: string, val: any) => {
    if (field === "direction") {
      setDirection(val);
      if (val === "WMS Inventory") {
        setMode("Warehouse Storage Grid");
        setDistance(0);
      } else {
        setMode("Road Freight (Truck)");
      }
    } else if (field === "mode") {
      setMode(val);
    } else if (field === "weight") {
      const w = Number(val);
      setWeight(w);
      setEmissions(Math.round(w * distance * 0.12));
    } else if (field === "distance") {
      const d = Number(val);
      setDistance(d);
      setEmissions(Math.round(weight * d * 0.12));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLogisticsLog({
      direction,
      mode,
      jobId,
      carrierName: carrierName || (direction === "WMS Inventory" ? "Warehouse Grid B" : "Direct Carrier LLC"),
      cargoWeightTons: Number(weight),
      distanceKm: Number(distance),
      emissionsScope3: Number(emissions),
      status: "Pending Approval",
      date
    });
    setShowLogForm(false);
    // Reset defaults
    setCarrierName("");
  };

  const inboundLogs = logisticsLogs.filter(l => l.direction === "Inbound" && l.status === "Approved");
  const outboundLogs = logisticsLogs.filter(l => l.direction === "Outbound" && l.status === "Approved");
  const wmsLogs = logisticsLogs.filter(l => l.direction === "WMS Inventory" && l.status === "Approved");

  const inboundEmissions = inboundLogs.reduce((acc, curr) => acc + curr.emissionsScope3, 0);
  const outboundEmissions = outboundLogs.reduce((acc, curr) => acc + curr.emissionsScope3, 0);
  const wmsEmissions = wmsLogs.reduce((acc, curr) => acc + curr.emissionsScope3, 0);

  return (
    <div className="space-y-6">
      
      {/* Top statistics summary for Logistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">INBOUND SUPPLY FREIGHT</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-sky-400 font-display">{(inboundEmissions / 1000).toFixed(2)}</span>
              <span className="text-xs text-slate-400 font-mono">Tons</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Materials & ingredients</span>
          </div>
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400">
            <Compass className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">OUTBOUND COURIER FREIGHT</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-purple-400 font-display">{(outboundEmissions / 1000).toFixed(2)}</span>
              <span className="text-xs text-slate-400 font-mono">Tons</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Finished products to clients</span>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
            <Navigation className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">WMS INVENTORY STORES</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-teal-400 font-display">{(wmsEmissions / 1000).toFixed(2)}</span>
              <span className="text-xs text-slate-400 font-mono">Tons</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Cold storage & forklifts</span>
          </div>
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400">
            <Warehouse className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Button to log and table header */}
      <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-white/5">
          <div>
            <h4 className="text-xs font-bold text-white tracking-wider font-display uppercase">Logistics & Supply Chain Ledger</h4>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Comprehensive Scope 3 carbon tracking of inbound raw materials, outbound deliveries, and warehouse inventory emissions</p>
          </div>

          {role !== "auditor" && (
            <button
              onClick={() => setShowLogForm(true)}
              className="text-xs font-mono font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/10 self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              LOG FREIGHT RECORD
            </button>
          )}
        </div>

        {logisticsLogs.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs font-mono">No freight or inventory logs currently.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-mono font-bold text-slate-400">
                  <th className="py-2 px-3">ID</th>
                  <th className="py-2 px-3">DATE</th>
                  <th className="py-2 px-3">FLOW CATEGORY</th>
                  <th className="py-2 px-3">CARRIER / MACHINE</th>
                  <th className="py-2 px-3">TRANS MODE</th>
                  <th className="py-2 px-3 text-right">CARGO WEIGHT</th>
                  <th className="py-2 px-3 text-right">DISTANCE</th>
                  <th className="py-2 px-3 text-right text-purple-400">EMISSIONS (S3)</th>
                  <th className="py-2 px-3 text-center">STATUS</th>
                  {role !== "auditor" && <th className="py-2 px-3 text-right">AUDIT SIGN-OFF</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-mono text-slate-300">
                {logisticsLogs.map((log) => {
                  const isPending = log.status === "Pending Approval";
                  return (
                    <tr key={log.id} className="hover:bg-white/[0.01]">
                      <td className="py-3 px-3 text-slate-400 font-bold">{log.id}</td>
                      <td className="py-3 px-3 whitespace-nowrap text-slate-500">{log.date}</td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          log.direction === "Inbound" 
                            ? "bg-sky-500/15 text-sky-400 border border-sky-500/10" 
                            : log.direction === "Outbound"
                            ? "bg-purple-500/15 text-purple-400 border border-purple-500/10"
                            : "bg-teal-500/15 text-teal-400 border border-teal-500/10"
                        }`}>
                          {log.direction}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-white font-sans font-semibold">{log.carrierName}</td>
                      <td className="py-3 px-3 text-slate-400">{log.mode}</td>
                      <td className="py-3 px-3 text-right">{log.cargoWeightTons > 0 ? `${log.cargoWeightTons} Tons` : "N/A"}</td>
                      <td className="py-3 px-3 text-right">{log.distanceKm > 0 ? `${log.distanceKm} km` : "N/A"}</td>
                      <td className="py-3 px-3 text-right text-purple-400 font-bold">{log.emissionsScope3} kg CO2e</td>
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
                                  onClick={() => onApproveLogisticsLog(log.id, "Arjun Mehta (Admin)")}
                                  className="text-[10px] font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 px-2.5 py-1 rounded transition-all flex items-center gap-1"
                                >
                                  <CheckCircle2 className="h-3 w-3" />
                                  SIGN-OFF
                                </button>
                              ) : (
                                <span className="text-[9px] text-slate-500 font-mono italic">Needs Admin</span>
                              )}
                              <button
                                onClick={() => onDeleteLogisticsLog(log.id)}
                                className="text-[10px] font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-2 py-1 rounded transition-all"
                              >
                                DELETE
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-500 flex items-center justify-end gap-1 font-mono italic">
                              Verified by {log.approvedBy || "Admin"}
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
                <Truck className="h-4.5 w-4.5 text-emerald-400" />
                <h4 className="text-sm font-bold text-white tracking-wider font-display uppercase font-mono">Log Supply Freight & Logistics</h4>
              </div>
              <button onClick={() => setShowLogForm(false)} className="text-slate-400 hover:text-white transition-all">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 font-mono">FLOW DIRECTION</label>
                  <select
                    value={direction}
                    onChange={(e) => handleInputsChange("direction", e.target.value)}
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/30 font-mono"
                  >
                    <option value="Inbound">Inbound Supply Freight</option>
                    <option value="Outbound">Outbound Delivery Shipping</option>
                    <option value="WMS Inventory">WMS Inventory Storage / Forklift</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 font-mono">CARRIER / SUBSYSTEM</label>
                  <input
                    type="text"
                    placeholder={direction === "WMS Inventory" ? "e.g. Zone B Freezer Grid" : "e.g. DHL Express, RailFreight Corp"}
                    value={carrierName}
                    onChange={(e) => setCarrierName(e.target.value)}
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 font-mono">TRANSPORT MODE</label>
                  <select
                    value={mode}
                    onChange={(e) => handleInputsChange("mode", e.target.value)}
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/30 font-mono"
                  >
                    {direction === "WMS Inventory" ? (
                      <>
                        <option value="Warehouse Storage Grid">Warehouse Storage Grid</option>
                        <option value="LPG Forklift">LPG Forklift (Combustion)</option>
                      </>
                    ) : (
                      <>
                        <option value="Road Freight (Truck)">Road Freight (Diesel Truck)</option>
                        <option value="Rail Cargo">Rail Cargo Freight</option>
                        <option value="Air Freight">Air Freight (Premium)</option>
                        <option value="Electric Carrier">Electric Carrier (EV-Ship)</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 font-mono">JOB ID ASSOCIATED</label>
                  <input
                    type="text"
                    value={jobId}
                    onChange={(e) => setJobId(e.target.value)}
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/30 font-mono"
                  />
                </div>
              </div>

              {direction !== "WMS Inventory" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 font-mono">CARGO WEIGHT (TONS)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => handleInputsChange("weight", e.target.value)}
                      className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/30 font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 font-mono">DISTANCE (KM)</label>
                    <input
                      type="number"
                      value={distance}
                      onChange={(e) => handleInputsChange("distance", e.target.value)}
                      className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/30 font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 font-mono">DATE</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/30 font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1 bg-slate-950 border border-white/10 p-2 rounded-xl flex items-center justify-center">
                  <label className="text-[9px] font-bold text-purple-400 font-mono tracking-wide">ESTIMATED SCOPE 3 BURDEN</label>
                  <div className="flex items-baseline gap-1 mt-1">
                    <input
                      type="number"
                      value={emissions}
                      onChange={(e) => setEmissions(Number(e.target.value))}
                      className="bg-transparent border-b border-white/20 text-white text-sm font-bold w-16 text-center focus:outline-none font-mono"
                    />
                    <span className="text-[9px] text-slate-400 font-mono">kg CO2e</span>
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
                  LOG FREIGHT
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
