import React from "react";
import { Sliders, Calendar, ChevronDown, RefreshCw, Layers } from "lucide-react";
import { MachineAsset, MachineLog } from "../types";

interface FiltersBarProps {
  machines: MachineAsset[];
  uniqueJobs: string[];
  
  selectedMachine: string;
  setSelectedMachine: (m: string) => void;
  selectedShift: string;
  setSelectedShift: (s: string) => void;
  selectedJob: string;
  setSelectedJob: (j: string) => void;
  
  selectedPeriodType: "day" | "month" | "year";
  setSelectedPeriodType: (p: "day" | "month" | "year") => void;
  
  selectedDate: string;
  setSelectedDate: (d: string) => void;
  selectedMonth: string;
  setSelectedMonth: (m: string) => void;
  selectedYear: string;
  setSelectedYear: (y: string) => void;
  
  onResetFilters: () => void;
}

export default function FiltersBar({
  machines,
  uniqueJobs,
  selectedMachine,
  setSelectedMachine,
  selectedShift,
  setSelectedShift,
  selectedJob,
  setSelectedJob,
  selectedPeriodType,
  setSelectedPeriodType,
  selectedDate,
  setSelectedDate,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  onResetFilters
}: FiltersBarProps) {
  
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-emerald-600" />
          <h2 className="text-xs font-bold text-slate-800 tracking-wider font-display uppercase">Interactive Asset Slicing & Filters</h2>
        </div>
        <button 
          onClick={onResetFilters}
          className="text-[10px] font-mono font-bold text-emerald-700 hover:text-emerald-800 transition-all flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-200/80"
        >
          <RefreshCw className="h-3 w-3" />
          RESET FILTERS
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* Machine Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">MACHINE / LINE</label>
          <div className="relative">
            <select
              value={selectedMachine}
              onChange={(e) => setSelectedMachine(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 appearance-none cursor-pointer"
            >
              <option value="all">All Machines & lines</option>
              {machines.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* Shift Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">SHIFT SELECTION</label>
          <div className="relative">
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 appearance-none cursor-pointer"
            >
              <option value="all">All Shifts (Daily)</option>
              <option value="Shift 1">Shift 1 (06:00 - 14:00)</option>
              <option value="Shift 2">Shift 2 (14:00 - 22:00)</option>
              <option value="Shift 3">Shift 3 (22:00 - 06:00)</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* Job ID Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">MANUFACTURING JOB</label>
          <div className="relative">
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 appearance-none cursor-pointer"
            >
              <option value="all">All Jobs & Batches</option>
              {uniqueJobs.map((job) => (
                <option key={job} value={job}>{job}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* Period Selector (Type selector) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">TIME WINDOW LAYER</label>
          <div className="grid grid-cols-3 bg-slate-100 p-1 border border-slate-200 rounded-xl">
            {(["day", "month", "year"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedPeriodType(type)}
                className={`py-1 rounded-lg text-[9px] font-mono font-bold uppercase transition-all ${
                  selectedPeriodType === type 
                    ? "bg-white text-emerald-700 shadow-xs border border-slate-200" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Period selection inputs based on Choice */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">
            {selectedPeriodType === "day" ? "SELECT DATE" : selectedPeriodType === "month" ? "SELECT MONTH" : "SELECT YEAR"}
          </label>
          
          {selectedPeriodType === "day" && (
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 font-mono cursor-pointer"
              />
            </div>
          )}

          {selectedPeriodType === "month" && (
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 appearance-none cursor-pointer font-mono"
              >
                <option value="2026-07">July 2026</option>
                <option value="2026-06">June 2026</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
            </div>
          )}

          {selectedPeriodType === "year" && (
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 appearance-none cursor-pointer font-mono"
              >
                <option value="2026">Year 2026</option>
                <option value="2025">Year 2025</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
