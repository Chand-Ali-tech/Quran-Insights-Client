"use client";

import React, { useState } from "react";
import { X, HeartHandshake, Copy, Check, Sparkles } from "lucide-react";
import { RABBANA_DUAS } from "../lib/quranData";

interface DuasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (query: string) => void;
}

export const DuasModal: React.FC<DuasModalProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyDua = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-md">
      <div
        className="relative flex w-full max-w-4xl max-h-[92dvh] sm:max-h-[88vh] flex-col rounded-2xl border border-slate-800 bg-[#09111c] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#060c14] px-3.5 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300">
              <HeartHandshake className="h-4 w-4 sm:h-5 sm:w-5 text-rose-400" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-lg font-bold text-slate-100 flex items-center gap-1.5 sm:gap-2 truncate">
                <span>Quranic Rabbana Duas</span>
                <span className="text-[10px] sm:text-xs text-rose-400 border border-rose-500/30 bg-rose-950/40 rounded-full px-1.5 sm:px-2 py-0.5 font-medium flex-shrink-0">
                  {RABBANA_DUAS.length} Duas
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                Timeless prophetic prayers for guidance, peace, and mercy.
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

        {/* Duas List */}
        <div className="flex-1 overflow-y-auto p-2.5 sm:p-6 space-y-3 sm:space-y-4">
          {RABBANA_DUAS.map((dua) => (
            <div
              key={dua.id}
              className="rounded-2xl border border-slate-800/90 bg-slate-900/50 p-3.5 sm:p-5 transition-all hover:border-rose-500/30 hover:bg-slate-850"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/60 pb-2.5 mb-2.5 sm:pb-3 sm:mb-3">
                <span className="text-xs font-semibold text-rose-300">
                  {dua.surah_name}
                </span>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() =>
                      copyDua(
                        dua.id,
                        `${dua.arabic}\n\n${dua.english} (${dua.surah_name})`,
                      )
                    }
                    className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/80 px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs text-slate-400 hover:text-white"
                  >
                    {copiedId === dua.id ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onSelectPrompt(
                        `Explain the profound spiritual meaning, context of revelation, and virtues of the Dua: "${dua.english}" [${dua.surah_name}].`,
                      );
                    }}
                    className="flex items-center gap-1 rounded-lg bg-rose-950/40 border border-rose-500/30 px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-rose-300 hover:bg-rose-900/40"
                  >
                    <Sparkles className="h-3 w-3 text-rose-400" />
                    <span>Ask Insights</span>
                  </button>
                </div>
              </div>

              {/* Arabic */}
              <p
                dir="rtl"
                className="font-arabic text-right text-xl sm:text-2xl leading-loose text-amber-100 mb-3"
              >
                {dua.arabic}
              </p>

              {/* English */}
              <p className="text-sm text-slate-200 leading-relaxed mb-2">
                &ldquo;{dua.english}&rdquo;
              </p>

              {/* Context */}
              <p className="text-xs text-slate-400 italic">{dua.context}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
