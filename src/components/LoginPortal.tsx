import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Shield, ShieldCheck, ChevronRight, User, Key, Users } from "lucide-react";
import { UserRole } from "../types";

interface LoginPortalProps {
  onLoginSuccess: (role: UserRole, email: string) => void;
}

export default function LoginPortal({ onLoginSuccess }: LoginPortalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("admin@carboncutters.com");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");

  // Pre-configured accounts for the 3 interfaces/roles
  const accounts = {
    admin: {
      email: "admin@carboncutters.com",
      name: "Arjun Mehta",
      roleLabel: "Admin (Chief ESG Officer)"
    },
    user: {
      email: "operator@carboncutters.com",
      name: "Rajesh Kumar",
      roleLabel: "Operator (Production Staff)"
    },
    auditor: {
      email: "auditor@veritasaudit.com",
      name: "Sarah Jenkins",
      roleLabel: "Auditor (Third-Party Verifier)"
    }
  };

  const handleQuickSelect = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(accounts[role].email);
    setStep(2);
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStep(2);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // In our mock system, any password works. We match the selected email to its role!
    let matchingRole: UserRole = "admin";
    if (email.includes("operator")) {
      matchingRole = "user";
    } else if (email.includes("auditor")) {
      matchingRole = "auditor";
    } else {
      matchingRole = selectedRole;
    }
    onLoginSuccess(matchingRole, email);
  };

  return (
    <div 
      className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center select-none"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.45), rgba(240, 244, 248, 0.75)), url('/src/assets/images/bright_misty_forest_bg_1784445683639.jpg')`,
      }}
    >
      {/* Top Left Branding Logo (Replaces SmartEase) */}
      <div className="absolute top-6 left-6 flex items-center gap-2.5">
        <div className="p-2 bg-white/90 border border-emerald-100 rounded-xl text-emerald-600 shadow-sm shrink-0">
          <Shield className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-emerald-800 leading-none">CARBON CUTTERS</span>
          <span className="text-[9px] text-slate-500 font-mono mt-0.5 uppercase tracking-wide">Secure Manufacturing Network</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-100/80 p-8 sm:p-12 max-w-[460px] w-full relative z-10 transition-all">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold font-display text-slate-800 tracking-tight">
            Welcome to Carbon Cutters
          </h2>
          <p className="text-xs text-slate-500 mt-1.5">
            A polished, light-weight ESG workspace for manufacturing teams.
          </p>
        </div>

        {/* 3 Interface/Role Selector Tabs (For easy quick pre-fills & explicit interface requests) */}
        <div className="mb-6">
          <label className="text-[10px] font-bold text-slate-400 tracking-wider font-mono block mb-2 text-center">
            CHOOSE YOUR INTERFACE
          </label>
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/50">
            {(["admin", "user", "auditor"] as UserRole[]).map((roleKey) => (
              <button
                key={roleKey}
                type="button"
                onClick={() => handleQuickSelect(roleKey)}
                className={`py-2 px-2 rounded-xl text-[10px] font-bold font-mono transition-all text-center ${
                  selectedRole === roleKey && email === accounts[roleKey].email
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
                }`}
              >
                <span className="block capitalize">{roleKey}</span>
              </button>
            ))}
          </div>
        </div>

        {step === 1 ? (
          /* STEP 1: EMAIL INPUT */
          <form onSubmit={handleNext} className="space-y-5">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 tracking-wider font-mono block">
                EMAIL ADDRESS
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. arjun@carboncutters.com"
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-3.5 pl-11 pr-4 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono text-xs py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-emerald-600/10 flex items-center justify-center gap-1.5 mt-2"
            >
              NEXT
              <ChevronRight className="h-4 w-4" />
            </button>
          </form>
        ) : (
          /* STEP 2: PASSWORD INPUT */
          <form onSubmit={handleSignIn} className="space-y-5">
            {/* Back to step 1 show email */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
              <div className="min-w-0">
                <span className="text-[9px] text-slate-400 font-mono block">WELCOME BACK</span>
                <span className="text-xs font-semibold text-slate-700 truncate block">{email}</span>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[10px] font-bold font-mono text-emerald-600 hover:text-emerald-500 whitespace-nowrap"
              >
                Change
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-400 tracking-wider font-mono block">
                  PASSWORD
                </label>
                <a 
                  href="#forgot" 
                  onClick={(e) => { e.preventDefault(); alert("Mock password system: clicking Sign In will proceed automatically."); }}
                  className="text-[10px] font-bold font-mono text-emerald-600 hover:text-emerald-500"
                >
                  Forgot your password?
                </a>
              </div>
              
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-3.5 pl-11 pr-11 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                defaultChecked
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
              />
              <label htmlFor="remember" className="text-[11px] text-slate-500 font-mono">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono text-xs py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-emerald-600/10 flex items-center justify-center gap-1.5"
            >
              SIGN IN WITH PASSWORD
            </button>
          </form>
        )}

        {/* Informative Footer */}
        <div className="text-center mt-8 pt-4 border-t border-slate-100 text-[10px] font-mono text-slate-400">
          New User? <span className="text-emerald-600 font-bold cursor-pointer hover:underline" onClick={() => alert("Registration system is currently managed by IT administrators.")}>Signup</span>
        </div>

      </div>

      {/* Helper floating bubble showing default logins */}
      <div className="mt-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/40 max-w-[460px] w-full text-center space-y-2 text-slate-600 shadow-lg relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1">
          <Users className="h-3.5 w-3.5 text-emerald-600" />
          Quick Click login credentials
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] font-mono text-left">
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100 transition-all" onClick={() => handleQuickSelect("admin")}>
            <span className="text-emerald-600 font-bold block">1. ADMIN</span>
            <span className="text-slate-400 text-[8px]">{accounts.admin.name}</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100 transition-all" onClick={() => handleQuickSelect("user")}>
            <span className="text-sky-600 font-bold block">2. OPERATOR</span>
            <span className="text-slate-400 text-[8px]">{accounts.user.name}</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100 transition-all" onClick={() => handleQuickSelect("auditor")}>
            <span className="text-purple-600 font-bold block">3. AUDITOR</span>
            <span className="text-slate-400 text-[8px]">{accounts.auditor.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
