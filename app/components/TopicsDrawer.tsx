"use client";

import React from "react";
import { X, Compass, ArrowRight } from "lucide-react";
import { QURAN_TOPICS } from "../lib/quranData";

interface TopicsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (query: string) => void;
}

export const TopicsDrawer: React.FC<TopicsDrawerProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md">
      <div
        className="relative flex w-full max-w-4xl max-h-[88vh] flex-col rounded-2xl border border-slate-800 bg-[#09111c] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#060c14] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-950/60 border border-teal-500/30 text-teal-300">
              <Compass className="h-5 w-5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>Thematic Quran Insights</span>
                <span className="text-xs text-teal-400 border border-teal-500/30 bg-teal-950/40 rounded-full px-2 py-0.5 font-medium">
                  Spiritual Themes
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Explore deep wisdom, ethics, and principles across Quranic
                themes.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Topics Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {QURAN_TOPICS.map((topic) => (
            <div
              key={topic.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 transition-all hover:border-teal-500/30 hover:bg-slate-850"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <span>{topic.title}</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {topic.description}
                    </p>
                  </div>
                  <span className="font-arabic text-xl text-teal-300">
                    {topic.arabicTitle}
                  </span>
                </div>

                {/* Key Verses Chips */}
                <div className="flex items-center gap-1.5 mt-3 mb-4">
                  <span className="text-[10px] font-semibold uppercase text-slate-500">
                    Key Verses:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {topic.keyVerses.map((v, i) => (
                      <span
                        key={i}
                        className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-emerald-300 font-mono"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sample Queries */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-medium text-slate-400">
                    Suggested Exploration Prompts:
                  </span>
                  {topic.sampleQueries.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onClose();
                        onSelectPrompt(q);
                      }}
                      className="group flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-2.5 text-left text-xs text-slate-300 transition-all hover:border-emerald-500/30 hover:bg-emerald-950/20 hover:text-emerald-200"
                    >
                      <span className="line-clamp-1">{q}</span>
                      <ArrowRight className="h-3 w-3 flex-shrink-0 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-emerald-400 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
