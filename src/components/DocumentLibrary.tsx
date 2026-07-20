import React, { useState } from "react";
import { 
  FileCheck, 
  Plus, 
  Search, 
  Download, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Paperclip,
  Clock,
  ShieldCheck,
  FileText,
  Upload,
  FolderOpen
} from "lucide-react";
import { ComplianceDoc, MachineAsset, UserRole } from "../types";

interface DocumentLibraryProps {
  role: UserRole;
  documents: ComplianceDoc[];
  machines: MachineAsset[];
  onUploadDoc: (doc: Omit<ComplianceDoc, "id" | "uploadDate" | "verified">) => void;
  onVerifyDoc: (id: string) => void;
  onDeleteDoc: (id: string) => void;
}

export default function DocumentLibrary({
  role,
  documents,
  machines,
  onUploadDoc,
  onVerifyDoc,
  onDeleteDoc
}: DocumentLibraryProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Simulated File Drag State
  const [dragActive, setDragActive] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<any>("Utility Bill");
  const [selectedAssetId, setSelectedAssetId] = useState("all");

  const handleSimulatedUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onUploadDoc({
      title: newTitle,
      category: newCategory,
      fileSize: `${(1 + Math.random() * 3).toFixed(1)} MB`,
      uploadedBy: role === "admin" ? "Arjun Mehta (Admin)" : "Staff Operator",
      fileType: "pdf",
      associatedAsset: selectedAssetId === "all" ? undefined : selectedAssetId
    });

    setNewTitle("");
  };

  const filteredDocs = documents.filter((doc) => {
    const matchSearch = doc.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || doc.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit evidence, receipt slips, or declarations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-slate-500">CATEGORY:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 font-mono cursor-pointer"
          >
            <option value="all">All Evidence Types</option>
            <option value="Utility Bill">Utility Electricity Bills</option>
            <option value="Fuel Slip">Fuel Delivery Receipts</option>
            <option value="Freight Invoice">Freight Freight Invoices</option>
            <option value="Material Sheet">Material Declaration Sheets</option>
            <option value="ISO Certificate">ISO Audit Certs</option>
          </select>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Document list (takes 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 tracking-wider font-display uppercase flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-emerald-600" />
              Verified Auditor Evidence Repository
            </h3>
            <span className="bg-slate-50 border border-slate-200 text-[10px] text-slate-600 font-mono px-2 py-0.5 rounded">
              {filteredDocs.length} Documents
            </span>
          </div>

          <div className="space-y-2">
            {filteredDocs.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-500 text-xs font-mono">
                No compliance documentation matching current search criteria.
              </div>
            ) : (
              filteredDocs.map((doc) => (
                <div 
                  key={doc.id} 
                  className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                      <FileText className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-800">{doc.title}</span>
                        {doc.verified ? (
                          <span className="text-[8px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-1 rounded flex items-center gap-0.5">
                            <ShieldCheck className="h-2.5 w-2.5" />
                            VERIFIED AUDIT EVIDENCE
                          </span>
                        ) : (
                          <span className="text-[8px] font-mono bg-amber-500/15 text-amber-400 border border-amber-500/20 px-1 rounded flex items-center gap-0.5">
                            <Clock className="h-2.5 w-2.5 animate-pulse" />
                            PENDING QA STAMP
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1 font-mono">
                        <span>Category: <span className="text-slate-600">{doc.category}</span></span>
                        <span>•</span>
                        <span>Size: <span className="text-slate-600">{doc.fileSize}</span></span>
                        <span>•</span>
                        <span>Uploader: <span className="text-slate-600">{doc.uploadedBy}</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 shrink-0">
                    {/* Auditor / Admin verification button */}
                    {!doc.verified && role !== "user" && (
                      <button
                        onClick={() => onVerifyDoc(doc.id)}
                        className="text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1 rounded transition-all"
                      >
                        VERIFY
                      </button>
                    )}

                    <button 
                      onClick={() => alert(`Simulating file download: ${doc.title}`)}
                      className="text-slate-500 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg border border-transparent hover:border-slate-200"
                    >
                      <Download className="h-4 w-4" />
                    </button>

                    {role === "admin" && (
                      <button 
                        onClick={() => onDeleteDoc(doc.id)}
                        className="text-rose-500 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>

        </div>

        {/* Upload simulated box (takes 1 col) */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-800 tracking-wider font-display uppercase">Evidence Submission Drawer</h3>
          
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
            
            {/* Drag & Drop mockup container */}
            <div 
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); alert("File dropped! Please complete the category information to index it."); }}
              className={`border border-dashed p-6 rounded-2xl text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                dragActive ? "border-emerald-500 bg-emerald-500/5" : "border-white/10 hover:border-white/20 bg-slate-950/20"
              }`}
            >
              <Upload className="h-7 w-7 text-emerald-400 mb-1" />
              <span className="text-xs font-bold text-slate-800">Simulate File Drag & Drop</span>
              <span className="text-[10px] text-slate-500 font-mono">Supports PDF, XLSX, fuel receipt scans up to 10MB</span>
            </div>

            <form onSubmit={handleSimulatedUpload} className="space-y-3 pt-2">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 font-mono">DOCUMENT LABEL</label>
                <input
                  type="text"
                  placeholder="e.g. June Fuel delivery bill"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 font-mono">EVIDENCE COMPLIANCE TYPE</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/30 font-mono"
                >
                  <option value="Utility Bill">Utility Electricity Bill</option>
                  <option value="Fuel Slip">Fuel Delivery Receipt</option>
                  <option value="Freight Invoice">Freight Freight Invoice</option>
                  <option value="Material Sheet">Material Declaration Sheet</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 font-mono">ASSOCIATED MACHINE ASSET</label>
                <select
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/30 font-mono"
                >
                  <option value="all">Facility-wide (No asset link)</option>
                  {machines.map(m => (
                    <option key={m.id} value={m.id}>{m.name.split(" (")[0]}</option>
                  ))}
                </select>
              </div>

              {role === "auditor" ? (
                <div className="bg-purple-950/20 text-purple-400 border border-purple-500/20 p-2.5 rounded-xl text-[10px] font-mono leading-relaxed">
                  ⓘ Third-party Auditor cannot upload direct evidence drafts, only verify files uploaded by operations.
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs rounded-xl transition-all font-mono flex items-center justify-center gap-1.5"
                >
                  <Paperclip className="h-4.5 w-4.5" />
                  INDEX FILE
                </button>
              )}

            </form>

          </div>
        </div>

      </div>

    </div>
  );
}
