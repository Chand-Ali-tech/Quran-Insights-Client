"use client";

import React from "react";
import { BookOpen, Compass, HeartHandshake, Menu } from "lucide-react";
import { QuranLogo } from "./QuranLogo";

interface NavbarProps {
  onNewChat: () => void;
  onOpenSurahs: () => void;
  onOpenTopics: () => void;
  onOpenDuas: () => void;
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewChat,
  onOpenSurahs,
  onOpenTopics,
  onOpenDuas,
  onToggleSidebar,
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
            {/* SVG Brand Favicon / Crest */}
            <div className="transition-transform group-hover:scale-105">
              <QuranLogo size={40} className="h-10 w-10 drop-shadow-md" />
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
            </div>
          </div>
        </div>

        {/* Center / Right: Module Navigation Pills (Visible on Tablet & Desktop) */}
        <div className="hidden md:flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/70 p-1">
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
      </div>
    </header>
  );
};
