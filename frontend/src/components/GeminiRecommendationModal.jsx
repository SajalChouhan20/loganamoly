import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, X, Copy, Check, Sparkles, ArrowDown, ArrowUp } from 'lucide-react';

export default function GeminiRecommendationModal({ incident, onClose }) {
  const [copied, setCopied] = useState(false);
  const scrollContainerRef = useRef(null);

  if (!incident) return null;

  const llmReport = incident.llm_recommendation;

  const handleCopy = () => {
    if (llmReport?.explanation) {
      navigator.clipboard.writeText(llmReport.explanation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-hidden"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-card w-full max-w-3xl max-h-[88vh] h-[85vh] flex flex-col border border-purple-500/40 shadow-2xl shadow-purple-500/20 rounded-2xl overflow-hidden bg-slate-950/95"
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20 bg-slate-950 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100">
                  Gemini LLM Automated Diagnostic Report
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-purple-950 text-purple-300 border border-purple-800">
                  {llmReport?.source || 'Gemini 1.5 AI'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Block Session: <span className="text-cyan-300 font-semibold">{incident.block_id}</span> • Severity: <span className="text-rose-400 font-bold">{incident.severity}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-700 transition"
              title="Copy Full Diagnostic Report"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Report'}</span>
            </button>
            
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 transition"
              title="Close Report (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body with Custom Scrollbar */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-6 bg-slate-950/80 space-y-4"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#4c1d95 #090d16' }}
        >
          
          {/* Constrained Notice Banner */}
          <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-purple-200">
              <strong className="font-semibold text-purple-300">Constrained LLM Architecture (Slide 5 Specification):</strong>
              <p className="mt-0.5 text-purple-300/80">
                Anomaly detection was performed deterministically by the DeepLog LSTM sequence engine. Gemini API was invoked exclusively to translate quantitative sequence metrics into human-actionable engineering guidance.
              </p>
            </div>
          </div>

          {/* Markdown Content */}
          <div className="markdown-body pr-2">
            <ReactMarkdown>
              {llmReport?.explanation || 'Generating diagnostic report...'}
            </ReactMarkdown>
          </div>

        </div>

        {/* Modal Footer with Scroll Helpers */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] border border-slate-800"
            >
              <ArrowUp className="w-3 h-3 text-cyan-400" />
              <span>Top</span>
            </button>

            <button
              onClick={scrollToBottom}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] border border-slate-800"
            >
              <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
              <span>Scroll to Bottom</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md transition"
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
}
