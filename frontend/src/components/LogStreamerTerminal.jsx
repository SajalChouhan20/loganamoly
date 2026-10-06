import React, { useRef, useEffect, useState } from 'react';
import { Terminal, Filter, Trash2, ArrowDown } from 'lucide-react';

export default function LogStreamerTerminal({ logs, onClear }) {
  const terminalEndRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [filterLevel, setFilterLevel] = useState('ALL');

  useEffect(() => {
    if (autoScroll && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter(log => {
    if (filterLevel === 'ALL') return true;
    return log.level === filterLevel;
  });

  return (
    <div className="glass-card flex flex-col h-[480px]">
      
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-950/60 rounded-t-xl">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200">Live Ingested Log Stream</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
            {logs.length} events
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {/* Level Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded border border-slate-800">
            <Filter className="w-3 h-3 text-slate-400" />
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="bg-transparent text-slate-300 font-mono text-[11px] outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">ALL LEVELS</option>
              <option value="INFO" className="bg-slate-900">INFO</option>
              <option value="WARN" className="bg-slate-900">WARN</option>
              <option value="ERROR" className="bg-slate-900">ERROR / FATAL</option>
            </select>
          </div>

          {/* Auto Scroll Toggle */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-1.5 rounded transition ${autoScroll ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}
            title="Toggle Auto-Scroll"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>

          {/* Clear Button */}
          <button
            onClick={onClear}
            className="p-1.5 rounded bg-slate-900 text-slate-400 hover:text-rose-400 hover:bg-slate-800 border border-slate-800 transition"
            title="Clear Stream History"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal View Body */}
      <div className="terminal-window flex-1 p-3 overflow-y-auto space-y-1">
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-600 text-xs font-mono">
            <span>Awaiting log stream ingestion...</span>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isError = log.level === 'ERROR' || log.level === 'FATAL';
            return (
              <div key={log.id} className={`log-line ${log.level}`}>
                <span className="text-slate-500 mr-2 font-mono select-none">[{log.timestamp}]</span>
                <span className={`font-semibold mr-2 ${isError ? 'text-rose-400' : log.level === 'WARN' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  [{log.level}]
                </span>
                <span className="text-cyan-300/80 mr-2 font-mono">[{log.template_id || 'E?'}]</span>
                <span className="text-slate-400 mr-2 font-mono">[{log.block_id}]</span>
                <span className="text-slate-200">{log.message}</span>
              </div>
            );
          })
        )}
        <div ref={terminalEndRef} />
      </div>

    </div>
  );
}
