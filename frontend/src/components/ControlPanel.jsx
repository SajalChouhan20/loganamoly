import React from 'react';
import { Play, Pause, AlertOctagon, WifiOff, HardDrive, Cpu, CheckCircle } from 'lucide-react';

export default function ControlPanel({ stats, onSelectMode, onToggleStream }) {
  const isStreaming = stats?.isStreaming ?? true;
  const currentMode = stats?.activeMode || 'NORMAL';

  const failureScenarios = [
    {
      id: 'NORMAL',
      label: 'Normal Flow',
      icon: CheckCircle,
      color: 'hover:bg-emerald-950/40 hover:border-emerald-500/50 text-emerald-400',
      activeColor: 'bg-emerald-950/70 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/30'
    },
    {
      id: 'DISK_FULL',
      label: 'Disk Space Full (E11)',
      icon: HardDrive,
      color: 'hover:bg-rose-950/40 hover:border-rose-500/50 text-rose-400',
      activeColor: 'bg-rose-950/70 border-rose-500 text-rose-300 ring-1 ring-rose-500/30'
    },
    {
      id: 'NETWORK_TIMEOUT',
      label: 'Network Socket Timeout (E9)',
      icon: WifiOff,
      color: 'hover:bg-amber-950/40 hover:border-amber-500/50 text-amber-400',
      activeColor: 'bg-amber-950/70 border-amber-500 text-amber-300 ring-1 ring-amber-500/30'
    },
    {
      id: 'DATANODE_CRASH',
      label: 'DataNode OOM Crash (E10)',
      icon: Cpu,
      color: 'hover:bg-purple-950/40 hover:border-purple-500/50 text-purple-400',
      activeColor: 'bg-purple-950/70 border-purple-500 text-purple-300 ring-1 ring-purple-500/30'
    },
    {
      id: 'CHECKSUM_FAIL',
      label: 'Checksum Corruption (E8)',
      icon: AlertOctagon,
      color: 'hover:bg-orange-950/40 hover:border-orange-500/50 text-orange-400',
      activeColor: 'bg-orange-950/70 border-orange-500 text-orange-300 ring-1 ring-orange-500/30'
    }
  ];

  return (
    <div className="glass-card p-4 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left: Stream Control Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleStream}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs transition-all shadow-md ${
              isStreaming 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30' 
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {isStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isStreaming ? 'Pause Real-Time Stream' : 'Resume Real-Time Stream'}</span>
          </button>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Inject synthetic HDFS log stream & evaluate next-event transitions live.
          </span>
        </div>

        {/* Right: Failure Injector Scenario Switchers */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mr-1 hidden lg:inline">
            Failure Injector:
          </span>
          {failureScenarios.map((sc) => {
            const Icon = sc.icon;
            const isActive = currentMode === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => onSelectMode(sc.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  isActive ? sc.activeColor : `bg-slate-900/60 border-slate-800 text-slate-400 ${sc.color}`
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sc.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
