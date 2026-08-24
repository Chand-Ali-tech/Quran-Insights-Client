"use client";

import React from "react";
import {
  Sparkles,
  BookOpen,
  Compass,
  HeartHandshake,
  Settings,
  PlusCircle,
  Menu,
  Zap,
} from "lucide-react";

interface NavbarProps {
  onNewChat: () => void;
  onOpenSurahs: () => void;
  onOpenTopics: () => void;
  onOpenDuas: () => void;
  onOpenSettings: () => void;
  onToggleSidebar: () => void;
  backendStatus: { ok: boolean; latencyMs: number; checking: boolean };
  isStreaming: boolean;
  onToggleStreaming: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewChat,
  onOpenSurahs,
  onOpenTopics,
  onOpenDuas,
  onOpenSettings,
  onToggleSidebar,
  backendStatus,
  isStreaming,
  onToggleStreaming,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-[#070d14]/85 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6">
        {/* Left: Hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle Navigation Sidebar"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800/80 bg-slate-900/60 text-slate-300 transition-all hover:border-emerald-500/40 hover:bg-slate-850 hover:text-emerald-400 focus:outline-none lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div
            onClick={onNewChat}
            className="group flex cursor-pointer items-center gap-3 select-none"
          >
            {/* Islamic Star / Octagram Crest */}
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-950 p-[1px] shadow-lg shadow-emerald-950/40 transition-transform group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#09141f]">
                <div className="relative flex items-center justify-center">
                  <span className="text-xl font-bold text-amber-400 drop-shadow-sm font-arabic">
                    ۞
                  </span>
                  <div className="absolute -inset-1 animate-pulse rounded-full bg-amber-400/10 blur-sm"></div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200 bg-clip-text text-base sm:text-lg font-bold tracking-tight text-transparent">
                  Quran Insights
                </span>
                <span className="hidden rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 sm:inline-block">
                  AI Studio
                </span>
              </div>
              {/* <p className="hidden text-[11px] text-slate-400 md:block">
                Semantic RAG & Authentic Ayah Citations
              </p> */}
            </div>
          </div>
        </div>

        {/* Center: Module Navigation Pills (Quick access for future modules) */}
        <div className="hidden items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/70 p-1 md:flex">
          <button
            onClick={onNewChat}
            className="flex items-center gap-1.5 rounded-full bg-emerald-600/20 px-3 py-1 text-xs font-medium text-emerald-300 border border-emerald-500/30 transition-all hover:bg-emerald-600/30"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>AI Chat</span>
          </button>

          <button
            onClick={onOpenSurahs}
            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-slate-400 transition-all hover:bg-slate-800 hover:text-slate-200"
          >
            <BookOpen className="h-3.5 w-3.5 text-amber-400/80" />
            <span>114 Surahs</span>
          </button>

          <button
            onClick={onOpenTopics}
            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-slate-400 transition-all hover:bg-slate-800 hover:text-slate-200"
          >
            <Compass className="h-3.5 w-3.5 text-teal-400/80" />
            <span>Themes</span>
          </button>

          <button
            onClick={onOpenDuas}
            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-slate-400 transition-all hover:bg-slate-800 hover:text-slate-200"
          >
            <HeartHandshake className="h-3.5 w-3.5 text-rose-400/80" />
            <span>Duas</span>
          </button>
        </div>

        {/* Right: Status, Streaming Mode & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Backend Status Pill */}
          <div
            title={
              backendStatus.ok
                ? `Backend online (${backendStatus.latencyMs}ms)`
                : backendStatus.checking
                  ? "Checking backend..."
                  : "Backend offline (Check server)"
            }
            className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-[11px] text-slate-300"
          >
            <span className="relative flex h-2 w-2">
              {backendStatus.ok ? (
                <>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </>
              ) : backendStatus.checking ? (
                <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-amber-400"></span>
              ) : (
                <span className="inline-flex h-2 w-2 rounded-full bg-rose-500"></span>
              )}
            </span>
            <span className="hidden sm:inline">
              {backendStatus.ok
                ? `${backendStatus.latencyMs}ms`
                : backendStatus.checking
                  ? "Connecting"
                  : "Offline"}
            </span>
          </div>

          {/* Stream Toggle Pill */}
          <button
            onClick={onToggleStreaming}
            title={
              isStreaming
                ? "Streaming mode: Real-time tokens"
                : "JSON mode: Fast batch response"
            }
            className={`hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium border transition-all ${
              isStreaming
                ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/40"
                : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Zap
              className={`h-3 w-3 ${isStreaming ? "text-emerald-400 fill-emerald-400" : "text-slate-500"}`}
            />
            <span>{isStreaming ? "Stream" : "JSON"}</span>
          </button>

          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-600/20 px-3 py-1.5 text-xs font-semibold text-emerald-300 shadow-sm transition-all hover:border-emerald-500/60 hover:bg-emerald-600/30 active:scale-95"
          >
            <PlusCircle className="h-4 w-4 text-emerald-400" />
            <span className="hidden sm:inline">New Chat</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            aria-label="Settings"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/70 text-slate-400 transition-all hover:border-slate-700 hover:bg-slate-800 hover:text-slate-200"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
