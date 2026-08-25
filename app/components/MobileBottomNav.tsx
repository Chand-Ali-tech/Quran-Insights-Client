"use client";

import React from "react";
import {
  House as HomeIcon,
  BookOpen,
  Compass,
  HeartHandshake,
} from "lucide-react";

interface MobileBottomNavProps {
  onHome: () => void;
  onOpenSurahs: () => void;
  onOpenTopics: () => void;
  onOpenDuas: () => void;
  isHomeActive?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onHome,
  onOpenSurahs,
  onOpenTopics,
  onOpenDuas,
  isHomeActive = false,
}) => {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden sticky bottom-0 z-30 w-full border-t border-slate-800/90 bg-[#070d14]/95 backdrop-blur-xl px-2 py-1.5 shadow-[0_-8px_20px_rgba(0,0,0,0.6)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* 1. Home Screen Tab */}
        <button
          onClick={onHome}
          className={`flex flex-1 flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
            isHomeActive
              ? "text-emerald-400 font-semibold"
              : "text-slate-400 hover:text-slate-200 active:scale-95"
          }`}
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              isHomeActive
                ? "bg-emerald-950/70 border border-emerald-500/30 text-emerald-300"
                : ""
            }`}
          >
            <HomeIcon className="h-4 w-4" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Home</span>
        </button>

        {/* 2. 114 Surahs Tab */}
        <button
          onClick={onOpenSurahs}
          className="flex flex-1 flex-col items-center justify-center py-1 px-1 rounded-xl text-slate-400 hover:text-slate-200 active:scale-95 transition-all"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg">
            <BookOpen className="h-4 w-4 text-amber-400/90" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">114 Surahs</span>
        </button>

        {/* 3. Themes Tab */}
        <button
          onClick={onOpenTopics}
          className="flex flex-1 flex-col items-center justify-center py-1 px-1 rounded-xl text-slate-400 hover:text-slate-200 active:scale-95 transition-all"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg">
            <Compass className="h-4 w-4 text-teal-400/90" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Themes</span>
        </button>

        {/* 4. Duas Tab */}
        <button
          onClick={onOpenDuas}
          className="flex flex-1 flex-col items-center justify-center py-1 px-1 rounded-xl text-slate-400 hover:text-slate-200 active:scale-95 transition-all"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg">
            <HeartHandshake className="h-4 w-4 text-rose-400/90" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Duas</span>
        </button>
      </div>
    </nav>
  );
};
