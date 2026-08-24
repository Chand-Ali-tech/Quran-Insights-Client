"use client";

import React, { useState } from "react";
import {
  X,
  Settings as SettingsIcon,
  Zap,
  Sliders,
  Server,
  Check,
  RotateCcw,
} from "lucide-react";
import { AppSettings } from "../types";
import { DEFAULT_BACKEND_URL } from "../lib/api";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const [localUrl, setLocalUrl] = useState(settings.backendUrl);
  const [threshold, setThreshold] = useState(settings.similarityThreshold);
  const [streaming, setStreaming] = useState(settings.streamingEnabled);
  const [savedMessage, setSavedMessage] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateSettings({
      backendUrl: localUrl.trim() || DEFAULT_BACKEND_URL,
      similarityThreshold: threshold,
      streamingEnabled: streaming,
    });
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      onClose();
    }, 800);
  };

  const handleReset = () => {
    setLocalUrl(DEFAULT_BACKEND_URL);
    setThreshold(0.4);
    setStreaming(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div
        className="relative flex w-full max-w-lg flex-col rounded-2xl border border-slate-800 bg-[#0b1420] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#080f19] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-slate-300">
              <SettingsIcon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Application Preferences
              </h3>
              <p className="text-xs text-slate-400">
                Configure RAG thresholds, streaming, and API endpoints.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Response Mode: Streaming SSE vs Fast JSON */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-semibold text-slate-200">
                  Real-time SSE Streaming
                </span>
              </div>
              <input
                type="checkbox"
                checked={streaming}
                onChange={(e) => setStreaming(e.target.checked)}
                className="h-5 w-5 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900 cursor-pointer"
              />
            </div>
            <p className="text-xs text-slate-400">
              When enabled, responses stream word-by-word with instant token
              feedback (~0.8s). Disable for standard complete JSON responses.
            </p>
          </div>

          {/* Similarity Cutoff Threshold Slider */}
          <div className="space-y-2 border-t border-slate-800/80 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-semibold text-slate-200">
                  Vector Similarity Cutoff
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-amber-300 rounded bg-amber-950/50 border border-amber-500/30 px-2 py-0.5">
                {(threshold * 100).toFixed(0)}% ({threshold.toFixed(2)})
              </span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.90"
              step="0.05"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0.10 (Broad Matches)</span>
              <span>0.40 (Recommended)</span>
              <span>0.90 (Strict Matches)</span>
            </div>
          </div>

          {/* Backend API Endpoint */}
          <div className="space-y-2 border-t border-slate-800/80 pt-4">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-teal-400" />
              <span className="text-sm font-semibold text-slate-200">
                Backend API Server URL
              </span>
            </div>
            <input
              type="text"
              value={localUrl}
              onChange={(e) => setLocalUrl(e.target.value)}
              placeholder="http://127.0.0.1:8000"
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2 text-xs font-mono text-slate-200 focus:border-teal-500/40 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500">
              Default is{" "}
              <code className="text-slate-400 font-mono">
                http://127.0.0.1:8000
              </code>
              .
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-[#080f19] px-6 py-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md shadow-emerald-950/40"
            >
              {savedMessage ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
