import React from "react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { 
  Zap, 
  Flame, 
  Truck, 
  Leaf,
  Layers,
  Award,
  AlertTriangle,
  FileCheck
} from "lucide-react";
import { MachineLog, LogisticsLog } from "../types";

interface AnalyticsViewProps {
  filteredLogs: MachineLog[];
  filteredLogistics: LogisticsLog[];
}

export default function AnalyticsView({ filteredLogs, filteredLogistics }: AnalyticsViewProps) {
  
  // 1. Compute summary stats from currently filtered approved logs
  const approvedMachineLogs = filteredLogs.filter(l => l.status === "Approved");
  const approvedLogisticsLogs = filteredLogistics.filter(l => l.status === "Approved");

  const scope1 = approvedMachineLogs.reduce((acc, curr) => acc + curr.scope1Direct, 0);
  const scope2 = approvedMachineLogs.reduce((acc, curr) => acc + curr.scope2Indirect, 0);
  
  const mScope3Mat = approvedMachineLogs.reduce((acc, curr) => acc + curr.scope3Materials, 0);
  const mScope3Waste = approvedMachineLogs.reduce((acc, curr) => acc + curr.scope3Waste, 0);
  const logScope3 = approvedLogisticsLogs.reduce((acc, curr) => acc + curr.emissionsScope3, 0);
  const scope3Total = mScope3Mat + mScope3Waste + logScope3;

  const totalCO2e = scope1 + scope2 + scope3Total;

  // Pie chart data
  const pieData = [
    { name: "Direct Fuel (Scope 1)", value: scope1, color: "#f43f5e" },
    { name: "Electricity (Scope 2)", value: scope2, color: "#f59e0b" },
    { name: "Embedded Materials (Scope 3)", value: mScope3Mat, color: "#a855f7" },
    { name: "Supply Logistics (Scope 3)", value: logScope3, color: "#06b6d4" },
    { name: "Waste Disposal (Scope 3)", value: mScope3Waste, color: "#10b981" },
  ].filter(item => item.value > 0);

  // 2. Compute Shift-wise distribution
  const shiftDataMap = {
    "Shift 1": { name: "Shift 1", Scope1: 0, Scope2: 0, Scope3: 0 },
    "Shift 2": { name: "Shift 2", Scope1: 0, Scope2: 0, Scope3: 0 },
    "Shift 3": { name: "Shift 3", Scope1: 0, Scope2: 0, Scope3: 0 }
  };

  approvedMachineLogs.forEach(log => {
    const shift = log.shift;
    if (shiftDataMap[shift]) {
      shiftDataMap[shift].Scope1 += log.scope1Direct;
      shiftDataMap[shift].Scope2 += log.scope2Indirect;
      shiftDataMap[shift].Scope3 += log.scope3Materials + log.scope3Waste;
    }
  });
  const shiftChartData = Object.values(shiftDataMap);

  // 3. Compute Machine-wise emissions
  const machineEmissionMap: Record<string, { name: string; Scope1: number; Scope2: number; Scope3: number }> = {};
  approvedMachineLogs.forEach(log => {
    if (!machineEmissionMap[log.machineId]) {
      machineEmissionMap[log.machineId] = { name: log.machineName.split(" (")[0], Scope1: 0, Scope2: 0, Scope3: 0 };
    }
    machineEmissionMap[log.machineId].Scope1 += log.scope1Direct;
    machineEmissionMap[log.machineId].Scope2 += log.scope2Indirect;
    machineEmissionMap[log.machineId].Scope3 += log.scope3Materials + log.scope3Waste;
  });
  const machineChartData = Object.values(machineEmissionMap).slice(0, 5);

  // 4. Job carbon profiling
  const jobEmissionsMap: Record<string, { name: string; Total: number }> = {};
  approvedMachineLogs.forEach(log => {
    if (!jobEmissionsMap[log.jobId]) {
      jobEmissionsMap[log.jobId] = { name: log.jobId, Total: 0 };
    }
    jobEmissionsMap[log.jobId].Total += log.scope1Direct + log.scope2Indirect + log.scope3Materials + log.scope3Waste;
  });
  const jobChartData = Object.values(jobEmissionsMap).slice(0, 6);

  return (
    <div className="space-y-6">
      
      {/* Top statistics overview block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">TOTAL EMISSIONS</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-slate-800 font-display">{(totalCO2e / 1000).toFixed(2)}</span>
              <span className="text-xs text-slate-500 font-mono">Tons CO2e</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold font-mono mt-0.5 block flex items-center gap-1">
              ✓ Verified & Certified
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/50">
            <Leaf className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">SCOPE 1 DIRECT</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-rose-600 font-display">{(scope1 / 1000).toFixed(2)}</span>
              <span className="text-xs text-slate-500 font-mono">Tons</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Process fuels, Forklifts</span>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600 ring-1 ring-rose-200/50">
            <Flame className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">SCOPE 2 INDIRECT</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-amber-600 font-display">{(scope2 / 1000).toFixed(2)}</span>
              <span className="text-xs text-slate-500 font-mono">Tons</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Grid power imports</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-200/50">
            <Zap className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">SCOPE 3 SUPPLY CHAIN</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-purple-600 font-display">{(scope3Total / 1000).toFixed(2)}</span>
              <span className="text-xs text-slate-500 font-mono">Tons</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Inbound, outbound & raw mat</span>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600 ring-1 ring-purple-200/50">
            <Truck className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Main visual charts grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Scope breakdown pie chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col shadow-sm">
          <span className="text-xs font-bold text-slate-800 tracking-wider font-display mb-4 uppercase">Emissions Segment Distribution</span>
          {pieData.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <AlertTriangle className="h-8 w-8 text-slate-400 mb-2" />
              <p className="text-xs font-mono">No approved data currently in the database for these filter coordinates.</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col sm:flex-row items-center gap-6">
              <div className="h-48 w-48 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => [`${(Number(value) / 1000).toFixed(2)} Tons CO2e`, "Impact"]}
                      contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                      itemStyle={{ color: "#334155" }}
                      labelStyle={{ color: "#64748b", fontWeight: "bold" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex-1 space-y-2">
                {pieData.map((item, idx) => {
                  const pct = totalCO2e > 0 ? ((item.value / totalCO2e) * 100).toFixed(1) : "0.0";
                  return (
                    <div key={idx} className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                        <span className="text-slate-600 truncate max-w-[150px] sm:max-w-xs">{item.name}</span>
                      </div>
                      <span className="text-slate-800 font-bold">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Shift-wise emissions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col shadow-sm">
          <span className="text-xs font-bold text-slate-800 tracking-wider font-display mb-4 uppercase">Emissions profiling by shift</span>
          <div className="flex-1 h-52 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shiftChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip 
                  formatter={(value: any) => [`${value} kg CO2e`]}
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                  itemStyle={{ color: "#334155" }}
                  labelStyle={{ color: "#64748b", fontWeight: "bold" }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="Scope1" name="Scope 1 Direct" fill="#f43f5e" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Scope2" name="Scope 2 Indirect" fill="#f59e0b" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Scope3" name="Scope 3 Operations" fill="#a855f7" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Machine carbon profiling */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col shadow-sm">
          <span className="text-xs font-bold text-slate-800 tracking-wider font-display mb-4 uppercase">Asset emissions comparison</span>
          <div className="flex-1 h-52 min-h-[200px]">
            {machineChartData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-400 text-xs font-mono">No machine data approved.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={machineChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis type="number" stroke="#64748b" fontSize={10} />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={9} width={80} tickLine={false} />
                  <Tooltip 
                    formatter={(value: any) => [`${value} kg CO2e`]}
                    contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                    itemStyle={{ color: "#334155" }}
                    labelStyle={{ color: "#64748b", fontWeight: "bold" }}
                  />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="Scope1" name="Scope 1" fill="#f43f5e" stackId="a" />
                  <Bar dataKey="Scope2" name="Scope 2" fill="#f59e0b" stackId="a" />
                  <Bar dataKey="Scope3" name="Scope 3" fill="#a855f7" stackId="a" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Job Carbon Slicing */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col shadow-sm">
          <span className="text-xs font-bold text-slate-800 tracking-wider font-display mb-4 uppercase">Job order carbon profiling</span>
          <div className="flex-1 h-52 min-h-[200px]">
            {jobChartData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-400 text-xs font-mono">No job records available.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={jobChartData}>
                  <defs>
                    <linearGradient id="colorJob" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip 
                    formatter={(value: any) => [`${value} kg CO2e`, "Job Emissions"]}
                    contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                    itemStyle={{ color: "#334155" }}
                    labelStyle={{ color: "#64748b", fontWeight: "bold" }}
                  />
                  <Area type="monotone" dataKey="Total" name="Carbon Burden" stroke="#10b981" fillOpacity={1} fill="url(#colorJob)" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
