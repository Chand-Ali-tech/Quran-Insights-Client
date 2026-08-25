"use client";

import React, { useState } from "react";
import { X, Search, BookOpen, Sparkles, Filter } from "lucide-react";
import { ALL_SURAHS } from "../lib/quranData";

interface SurahsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSurahPrompt: (query: string) => void;
  onOpenAyahModal: (surahNo: number, ayahNo: number) => void;
}

export const SurahsDrawer: React.FC<SurahsDrawerProps> = ({
  isOpen,
  onClose,
  onSelectSurahPrompt,
  onOpenAyahModal,
}) => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "Meccan" | "Medinan">(
    "all",
  );

  if (!isOpen) return null;

  const filteredSurahs = ALL_SURAHS.filter((s) => {
    const matchesSearch =
      s.number.toString().includes(search) ||
      s.name_roman.toLowerCase().includes(search.toLowerCase()) ||
      s.name_english.toLowerCase().includes(search.toLowerCase()) ||
      s.name_arabic.includes(search);

    const matchesFilter =
      filterType === "all" || s.place_of_revelation === filterType;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-md">
      <div
        className="relative flex w-full max-w-4xl max-h-[92dvh] sm:max-h-[88vh] flex-col rounded-2xl border border-slate-800 bg-[#09111c] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#060c14] px-3.5 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-300">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-lg font-bold text-slate-100 flex items-center gap-1.5 sm:gap-2 truncate">
                <span>The Noble Quran</span>
                <span className="text-[10px] sm:text-xs text-amber-400 border border-amber-500/30 bg-amber-950/40 rounded-full px-1.5 sm:px-2 py-0.5 font-medium flex-shrink-0">
                  {filteredSurahs.length} Surahs
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                Explore chapters or ask AI for in-depth insights.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 border-b border-slate-800/80 bg-slate-900/40 p-2.5 sm:p-4">
          <div className="relative flex-1 w-full">
            <Search className="pointer-events-none absolute left-3 top-2.5 sm:top-3 h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Surah name, English, or number (1-114)..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-1.5 sm:py-2 pl-8 sm:pl-9 pr-3 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:border-emerald-500/40 focus:outline-none"
            />
          </div>

          {/* Place of Revelation Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 sm:pb-0">
            <Filter className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" />
            {(["all", "Meccan", "Medinan"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`rounded-lg px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium whitespace-nowrap transition-all ${
                  filterType === type
                    ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40"
                    : "border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200"
                }`}
              >
                {type === "all" ? "All" : `${type}`}
              </button>
            ))}
          </div>
        </div>

        {/* Surahs Grid */}
        <div className="flex-1 overflow-y-auto p-2.5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
          {filteredSurahs.map((surah) => (
            <div
              key={surah.number}
              className="group relative flex flex-col justify-between rounded-xl border border-slate-800/90 bg-slate-900/50 p-4 transition-all hover:border-emerald-500/40 hover:bg-slate-850 hover:shadow-lg hover:shadow-emerald-950/20"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800/80 text-xs font-bold text-slate-300 border border-slate-700/60">
                      {surah.number}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                        {surah.name_roman}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {surah.name_english}
                      </p>
                    </div>
                  </div>

                  <span className="font-arabic text-xl text-amber-300">
                    {surah.name_arabic}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-3">
                  <span className="rounded bg-slate-800/60 px-1.5 py-0.5">
                    {surah.ayah_count} Verses
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 font-medium ${
                      surah.place_of_revelation === "Meccan"
                        ? "bg-amber-950/40 text-amber-300 border border-amber-500/20"
                        : "bg-teal-950/40 text-teal-300 border border-teal-500/20"
                    }`}
                  >
                    {surah.place_of_revelation}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
                <button
                  onClick={() => onOpenAyahModal(surah.number, 1)}
                  className="flex-1 rounded-lg border border-slate-800 bg-slate-900/80 py-1 text-center text-[11px] font-medium text-slate-300 hover:border-slate-700 hover:text-white"
                >
                  Ayah 1
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onSelectSurahPrompt(
                      `Provide a comprehensive overview of Surah ${surah.name_roman} (${surah.name_english}). What are its main themes, historical context (${surah.place_of_revelation}), and key lessons for life?`,
                    );
                  }}
                  title="Ask AI Insights"
                  className="flex items-center justify-center gap-1 rounded-lg bg-emerald-600/20 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-600/30"
                >
                  <Sparkles className="h-3 w-3 text-emerald-400" />
                  <span>Insights</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
