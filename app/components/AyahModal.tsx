"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  X,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Sparkles,
  Bookmark,
  BookOpen,
  Loader2,
} from "lucide-react";
import { AyahDetail, SourceAyah } from "../types";
import { fetchAyahDetail, getAyahAudioUrl } from "../lib/api";

interface AyahModalProps {
  surahNo: number | null;
  ayahNo: number | null;
  onClose: () => void;
  onAskAboutAyah: (query: string) => void;
  onToggleBookmark?: (ayah: SourceAyah) => void;
  isBookmarked?: boolean;
}

export const AyahModal: React.FC<AyahModalProps> = ({
  surahNo,
  ayahNo,
  onClose,
  onAskAboutAyah,
  onToggleBookmark,
  isBookmarked = false,
}) => {
  const [loading, setLoading] = useState(true);
  const [ayahData, setAyahData] = useState<AyahDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg" | "xl">("lg");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!surahNo || !ayahNo) return;
    let isCurrent = true;

    fetchAyahDetail(surahNo, ayahNo)
      .then((data) => {
        if (!isCurrent) return;
        setAyahData(data);
        setLoading(false);
      })
      .catch((err) => {
        if (!isCurrent) return;
        setError(err.message || "Failed to load Ayah details.");
        setLoading(false);
      });

    return () => {
      isCurrent = false;
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [surahNo, ayahNo]);

  if (!surahNo || !ayahNo) return null;

  const audioUrl = getAyahAudioUrl(surahNo, ayahNo);

  const toggleAudio = () => {
    if (!audioRef.current) {
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        alert("Audio recitation currently unavailable for this Ayah.");
      };
      audioRef.current = audio;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case "sm":
        return "text-xl leading-relaxed";
      case "md":
        return "text-2xl leading-loose";
      case "lg":
        return "text-3xl leading-[2.6]";
      case "xl":
        return "text-4xl leading-[2.8]";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div
        className="relative flex w-full max-w-2xl max-h-[90vh] flex-col rounded-2xl border border-slate-700/80 bg-[#0b1420] shadow-2xl shadow-emerald-950/40 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#080f19] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
              <BookOpen className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>{ayahData?.surah.name_roman || `Surah ${surahNo}`}</span>
                <span className="text-amber-400 font-arabic text-lg">
                  {ayahData?.surah.name_arabic}
                </span>
                <span className="rounded-md border border-slate-700 bg-slate-800/60 px-1.5 py-0.5 text-xs text-slate-300">
                  {surahNo}:{ayahNo}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {ayahData?.surah.name_english} •{" "}
                {ayahData?.surah.place_of_revelation}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Button */}
            <button
              onClick={toggleAudio}
              title={isPlaying ? "Pause Recitation" : "Listen to Recitation"}
              className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${
                isPlaying
                  ? "border-emerald-500 bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30"
                  : "border-slate-800 bg-slate-900/80 text-emerald-400 hover:border-emerald-500/40 hover:bg-slate-800"
              }`}
            >
              {isPlaying ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-400 mb-3" />
              <p className="text-sm">Fetching Ayah & Surah details...</p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 text-center text-rose-300">
              <p className="text-sm font-semibold">{error}</p>
              <button
                onClick={onClose}
                className="mt-3 rounded-lg bg-slate-800 px-4 py-1.5 text-xs text-slate-200 hover:bg-slate-700"
              >
                Dismiss
              </button>
            </div>
          ) : ayahData ? (
            <>
              {/* Font Size Selector */}
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/60 pb-3">
                <span className="font-medium text-slate-300">
                  Arabic Text Size:
                </span>
                <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/60 p-1">
                  {(["sm", "md", "lg", "xl"] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`px-2.5 py-0.5 rounded text-xs font-semibold transition-all ${
                        fontSize === size
                          ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {size.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Arabic Verse Card */}
              <div className="relative rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-950/20 to-slate-900/60 p-6 shadow-inner">
                <p
                  className={`font-arabic text-right text-emerald-100 drop-shadow-sm select-text ${getFontSizeClass()}`}
                  dir="rtl"
                >
                  {ayahData.text_arabic}{" "}
                  <span className="inline-block px-1 text-amber-400 font-arabic text-2xl">
                    ۝
                  </span>
                </p>

                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    onClick={() =>
                      copyToClipboard(ayahData.text_arabic, "arabic")
                    }
                    className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-300 hover:border-emerald-500/40 hover:text-emerald-300"
                  >
                    {copiedField === "arabic" ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy Arabic</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* English Translation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    English Translation
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(ayahData.text_english, "english")
                    }
                    className="text-xs text-slate-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    {copiedField === "english" ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    <span>Copy</span>
                  </button>
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-slate-200 bg-slate-900/40 rounded-xl p-4 border border-slate-800/80">
                  {ayahData.text_english}
                </p>
              </div>

              {/* Urdu Translation if available */}
              {ayahData.text_urdu && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                      اردو ترجمہ (Urdu Translation)
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(ayahData.text_urdu!, "urdu")
                      }
                      className="text-xs text-slate-400 hover:text-teal-300 flex items-center gap-1"
                    >
                      {copiedField === "urdu" ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span>Copy</span>
                    </button>
                  </div>
                  <p
                    dir="rtl"
                    className="text-right text-base sm:text-lg leading-loose text-slate-200 font-urdu bg-slate-900/40 rounded-xl p-4 border border-slate-800/80"
                  >
                    {ayahData.text_urdu}
                  </p>
                </div>
              )}

              {/* Main Themes */}
              {ayahData.main_themes && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Thematic Tags
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(() => {
                      try {
                        const parsed = JSON.parse(
                          ayahData.main_themes.replace(/'/g, '"'),
                        );
                        if (Array.isArray(parsed)) {
                          return parsed.map((t: string, idx: number) => (
                            <span
                              key={idx}
                              className="rounded-lg border border-slate-700 bg-slate-800/50 px-2.5 py-1 text-xs text-emerald-300"
                            >
                              {t}
                            </span>
                          ));
                        }
                      } catch {
                        return (
                          <span className="text-xs text-slate-400">
                            {ayahData.main_themes}
                          </span>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer Actions */}
        {ayahData && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-[#080f19] px-6 py-4">
            <button
              onClick={() => {
                if (onToggleBookmark && ayahData) {
                  onToggleBookmark({
                    verse_id: ayahData.verse_id,
                    surah_number: ayahData.surah.number,
                    ayah_number: ayahData.ayah_number,
                    surah_name_roman: ayahData.surah.name_roman,
                    surah_name_english: ayahData.surah.name_english,
                    surah_name_arabic: ayahData.surah.name_arabic,
                    place_of_revelation: ayahData.surah.place_of_revelation,
                    text_arabic: ayahData.text_arabic,
                    translation: ayahData.text_english,
                    similarity_score: 1.0,
                  });
                }
              }}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                isBookmarked
                  ? "border-amber-500/50 bg-amber-950/40 text-amber-300"
                  : "border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200"
              }`}
            >
              <Bookmark
                className={`h-4 w-4 ${
                  isBookmarked ? "text-amber-400 fill-amber-400" : ""
                }`}
              />
              <span>{isBookmarked ? "Bookmarked" : "Bookmark Ayah"}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onAskAboutAyah(
                  `What are the profound insights, background, and lessons from Surah ${ayahData.surah.name_roman} [${ayahData.verse_id}]?`,
                );
              }}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-950/50 transition-all hover:from-emerald-500 hover:to-teal-500 active:scale-95"
            >
              <Sparkles className="h-4 w-4 text-emerald-200" />
              <span>Ask AI Insights About This Verse</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
