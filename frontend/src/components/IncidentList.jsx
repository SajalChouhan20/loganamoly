import React from 'react';
import { AlertCircle, ChevronRight, Bot, Cpu } from 'lucide-react';

export default function IncidentList({ incidents, selectedIncident, onSelectIncident }) {
  return (
    <div className="glass-card flex flex-col h-[480px]">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/60 rounded-t-xl">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <h2 className="text-xs font-semibold text-slate-200">Detected Incident Feed</h2>
          <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 font-mono text-[10px] border border-rose-800">
            {incidents.length} Active
          </span>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">Real-Time ML Detector</span>
      </div>

      {/* Incident List Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {incidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs text-center p-6">
            <div className="p-3 rounded-full bg-slate-900 border border-slate-800 mb-2 text-slate-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="font-semibold text-slate-400">No Incidents Detected</p>
            <p className="text-[11px] text-slate-600 mt-1 max-w-xs">
              DeepLog sequence model is monitoring HDFS block workflows. Inject a failure scenario above to trigger real-time detection & AI diagnosis.
            </p>
          </div>
        ) : (
          incidents.map((inc) => {
            const isSelected = selectedIncident?.id === inc.id;
            const scorePercent = (inc.anomaly_score * 100).toFixed(0);
            
            return (
              <div
                key={inc.id}
                onClick={() => onSelectIncident(inc)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-slate-900 border-cyan-500/80 shadow-lg shadow-cyan-500/10' 
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`badge badge-${inc.severity}`}>
                      {inc.severity}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-200">
                      {inc.block_id}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(inc.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                {/* Event Message */}
                <p className="text-xs text-slate-300 font-sans line-clamp-1 mb-2">
                  <strong className="text-rose-400 font-mono mr-1">
                    [{inc.root_cause_event?.observed_template || 'E_ERR'}]:
                  </strong>
                  {inc.root_cause_event?.observed_description || 'Abnormal sequence transition detected.'}
                </p>

                {/* Footer metrics & Action Button */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60 pt-2">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-mono">
                      <Cpu className="w-3 h-3 text-cyan-400" />
                      {inc.affected_component || 'dfs.DataNode'}
                    </span>
                    <span className="font-mono text-amber-400">
                      Dev Score: <strong>{scorePercent}%</strong>
                    </span>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectIncident(inc);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-950/80 border border-purple-500/40 text-purple-300 font-semibold text-[11px] hover:bg-purple-900 hover:text-purple-100 transition shadow-sm"
                  >
                    <Bot className="w-3.5 h-3.5 text-purple-400" />
                    <span>View Gemini AI Report</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
