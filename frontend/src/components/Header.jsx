import React from 'react';
import { ShieldAlert, Activity, Cpu, Sparkles, GraduationCap } from 'lucide-react';

export default function Header({ isConnected, stats }) {
  return (
    <header className="glass-card p-4 mb-6 border-b border-cyan-500/20 bg-slate-950/80 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Title & Branding */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/30 text-cyan-400">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                Intelligent Log Monitor & Anomaly Detector
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                Loghub HDFS Benchmark
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>DeepLog Sequence Model</span>
              <span>•</span>
              <span className="text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Gemini LLM Recommendation Layer
              </span>
            </p>
          </div>
        </div>

        {/* Middle Academic Metadata */}
        <div className="hidden lg:flex items-center gap-3 text-xs bg-slate-900/60 px-3.5 py-1.5 rounded-lg border border-slate-800">
          <GraduationCap className="w-4 h-4 text-indigo-400" />
          <div className="flex flex-col">
            <span className="text-slate-300 font-medium">RCOEM Nagpur • CSE VII</span>
            <span className="text-slate-500">Guide: Dr. Devishree Naidu</span>
          </div>
        </div>

        {/* Right System Telemetry */}
        <div className="flex items-center gap-3 text-xs">
          {/* Socket Connection */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-400 pulse-active' : 'bg-rose-500'}`}></span>
            <span className="text-slate-300 font-mono">
              {isConnected ? 'LIVE STREAM' : 'DISCONNECTED'}
            </span>
          </div>

          {/* Active Mode */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Mode:</span>
            <span className="font-mono font-semibold text-cyan-300 uppercase">
              {stats?.activeMode || 'NORMAL'}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}
