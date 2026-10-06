import React from 'react';
import { Target, ArrowRight, AlertTriangle, Layers, Info } from 'lucide-react';

export default function RootCauseDetail({ incident }) {
  if (!incident) {
    return (
      <div className="glass-card p-6 flex flex-col items-center justify-center text-center h-[280px]">
        <Target className="w-8 h-8 text-slate-600 mb-2" />
        <h3 className="text-sm font-semibold text-slate-400">No Incident Selected</h3>
        <p className="text-xs text-slate-600 mt-1 max-w-sm">
          Select an incident from the Incident Feed to pinpoint the exact sequence break location and compare expected vs observed log templates.
        </p>
      </div>
    );
  }

  const rootCause = incident.root_cause_event;
  const surrounding = incident.surrounding_events || [];

  return (
    <div className="glass-card p-5 mb-6 border-l-4 border-l-cyan-400">
      
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-200">
            Root-Cause Localization & Sequence Break Analysis
          </h2>
          <span className="font-mono text-xs text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
            {incident.block_id}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Anomaly Deviation Score:</span>
          <span className="text-amber-400 font-extrabold text-sm">
            {(incident.anomaly_score * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Expected vs Observed Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        
        {/* Expected Template */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-500/30">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold mb-2">
            <span>Expected Transition (DeepLog LSTM Model)</span>
            <span className="font-mono text-[10px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              HIGH PROBABILITY
            </span>
          </div>
          <div className="font-mono text-xs text-emerald-300 font-semibold mb-1">
            Template IDs: [{(rootCause?.expected_templates || []).join(', ')}]
          </div>
          <p className="text-xs text-slate-300">
            {(rootCause?.expected_descriptions || [])[0] || 'Standard block packet transmission completion.'}
          </p>
        </div>

        {/* Observed Template */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-rose-500/40">
          <div className="flex items-center justify-between text-xs text-rose-400 font-semibold mb-2">
            <span>Observed Log Event (Root Cause Break)</span>
            <span className="font-mono text-[10px] bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
              SEQUENCE BREAK (Step {rootCause?.event_index ?? '?'})
            </span>
          </div>
          <div className="font-mono text-xs text-rose-300 font-semibold mb-1">
            Template ID: {rootCause?.observed_template || 'E_ERR'}
          </div>
          <p className="text-xs text-slate-200">
            {rootCause?.observed_description || rootCause?.actual_log?.raw_log}
          </p>
        </div>

      </div>

      {/* Surrounding Context Sequence Timeline */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-2">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Surrounding Event Sequence (Step Timeline)</span>
        </div>

        <div className="flex items-center overflow-x-auto p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 gap-2">
          {surrounding.map((evt, idx) => {
            const isRoot = idx === rootCause?.event_index;
            return (
              <React.Fragment key={idx}>
                <div
                  className={`flex-shrink-0 p-2.5 rounded-lg border font-mono text-xs min-w-[130px] transition-all ${
                    isRoot
                      ? 'bg-rose-950/70 border-rose-500 text-rose-200 shadow-md shadow-rose-500/20 ring-1 ring-rose-500'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span>Step {idx + 1}</span>
                    <span className={isRoot ? 'text-rose-400 font-bold' : 'text-cyan-400'}>
                      {evt.template_id || 'E?'}
                    </span>
                  </div>
                  <div className="text-[11px] truncate" title={evt.message}>
                    {evt.template_id || evt.message}
                  </div>
                </div>
                {idx < surrounding.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

    </div>
  );
}
