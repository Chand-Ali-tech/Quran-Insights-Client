"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  User,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Bookmark,
  Layers,
  ChevronRight,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { ChatMessage, SourceAyah } from "../types";
import { CURATED_HERO_PROMPTS } from "../lib/quranData";
import { getAyahAudioUrl } from "../lib/api";

interface ChatAreaProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSelectPrompt: (query: string) => void;
  onOpenAyahModal: (surahNo: number, ayahNo: number) => void;
  onToggleBookmark: (ayah: SourceAyah) => void;
  bookmarkedIds: Set<string>;
  onRetry: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading,
  onSelectPrompt,
  onOpenAyahModal,
  onToggleBookmark,
  bookmarkedIds,
  onRetry,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingVerseId, setPlayingVerseId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isAutoScrollEnabled = useRef(true);

  // Monitor user scrolling to avoid locking scroll when user reads top verses
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    isAutoScrollEnabled.current = distanceFromBottom < 150;
  };

  // Auto scroll to bottom only when appropriate
  useEffect(() => {
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];

    if (lastMsg.role === "user") {
      isAutoScrollEnabled.current = true;
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (isAutoScrollEnabled.current && containerRef.current) {
      if (lastMsg.isStreaming) {
        // Instant direct scroll prevents animation frame collisions and eliminates screen shaking
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      } else {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages, isLoading]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleAudio = (ayah: SourceAyah) => {
    if (playingVerseId === ayah.verse_id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingVerseId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audioUrl = getAyahAudioUrl(ayah.surah_number, ayah.ayah_number);
    const audio = new Audio(audioUrl);
    audio.onended = () => setPlayingVerseId(null);
    audio.onerror = () => {
      setPlayingVerseId(null);
      alert("Audio recitation currently unavailable for this Ayah.");
    };

    audioRef.current = audio;
    audio
      .play()
      .then(() => setPlayingVerseId(ayah.verse_id))
      .catch(() => setPlayingVerseId(null));
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`flex-1 overflow-y-auto px-3 sm:px-6 ambient-bg islamic-geometry-bg ${
        messages.length === 0
          ? "flex flex-col justify-center py-2 sm:py-3"
          : "pt-6 pb-20 space-y-6"
      }`}
    >
      <div
        className={`max-w-4xl w-full mx-auto space-y-6 ${
          messages.length === 0 ? "my-auto" : ""
        }`}
      >
        {/* ── 1. Hero Welcome State (When No Messages) ────────────────────────── */}
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4 animate-fadeIn">
            {/* Ambient Hero Glow */}
            <div className="relative flex flex-col items-center">
              <div className="ambient-hero-glow absolute -inset-6 -z-10 rounded-full blur-2xl opacity-60" />

              {/* Bismillah Calligraphy */}
              <div className="mb-0.5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/40 px-3.5 py-1 text-xs text-emerald-300 shadow-inner">
                <span className="font-arabic text-sm text-amber-300">۞</span>
                <span className="font-arabic tracking-wide text-xs">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </span>
                <span className="font-arabic text-sm text-amber-300">۞</span>
              </div>

              {/* Title Header */}
              <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Quranic{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                  Insights
                </span>
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-lg">
                Explore deep authentic wisdom, tafsir, thematic connections, and
                multilingual answers directly grounded in the Holy Quran.
              </p>
            </div>

            {/* ── Curated Multilingual Question Pills ─────────────────────── */}
            <div className="w-full max-w-3xl pt-2">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {CURATED_HERO_PROMPTS.map((item) => {
                  const isArOrUr = item.lang === "ar" || item.lang === "ur";
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectPrompt(item.query)}
                      className="group inline-flex items-center gap-1.5 rounded-full border border-slate-800/80 bg-slate-900/60 px-3.5 py-1.5 text-xs text-slate-300 transition-all hover:border-emerald-500/40 hover:bg-emerald-950/40 hover:text-emerald-200 shadow-sm"
                    >
                      <span className="text-amber-400 text-[10px] transition-transform group-hover:scale-110">
                        ✦
                      </span>
                      <span
                        className={
                          isArOrUr ? "font-arabic text-xs leading-normal" : ""
                        }
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ── 2. Active Chat Messages ─────────────────────────────────────── */
          messages.map((msg) => {
            const isUser = msg.role === "user";

            return (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 items-start ${
                  isUser ? "justify-end" : "justify-start"
                } animate-fadeIn`}
              >
                {/* Assistant Avatar */}
                {!isUser && (
                  <div className="flex-shrink-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-amber-300 shadow-md border border-emerald-400/30 font-arabic font-bold text-sm">
                      ۞
                    </div>
                  </div>
                )}

                {/* Message Bubble Container */}
                <div
                  className={`flex flex-col space-y-2 max-w-[92%] sm:max-w-[85%] ${
                    isUser ? "items-end" : "items-start"
                  }`}
                >
                  {/* Bubble Content */}
                  <div
                    className={`rounded-2xl p-4 sm:p-5 text-sm sm:text-base leading-relaxed ${
                      isUser
                        ? "bg-gradient-to-br from-emerald-700 to-teal-800 text-white rounded-tr-sm shadow-md shadow-emerald-950/30"
                        : "glass-panel border border-slate-800/90 text-slate-100 rounded-tl-sm shadow-lg shadow-black/40"
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : msg.content ? (
                      <div className="markdown-content space-y-2 select-text">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>

                        {/* Streaming Pulse Cursor */}
                        {msg.isStreaming && (
                          <span className="streaming-cursor" />
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5 text-slate-300 py-1 text-xs sm:text-sm">
                        <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                        <span>Synthesizing answer from Quranic verses...</span>
                      </div>
                    )}
                  </div>

                  {/* ── Source Ayah Citations (Rich Cards) ──────────────────── */}
                  {!isUser && msg.sources && msg.sources.length > 0 && (
                    <div className="w-full space-y-2.5 pt-2">
                      <div className="flex items-center gap-2 px-1">
                        <Layers className="h-3.5 w-3.5 text-amber-400" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                          Quranic Sources & Citations ({msg.sources.length})
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {msg.sources.map((src) => {
                          const isBookmarked = bookmarkedIds.has(src.verse_id);
                          const isPlayingThis = playingVerseId === src.verse_id;

                          return (
                            <div
                              key={src.verse_id}
                              className="rounded-2xl border border-slate-800/90 bg-gradient-to-b from-[#0d1826]/90 to-[#09111c]/90 p-4 transition-all hover:border-emerald-500/30 shadow-md"
                            >
                              {/* Source Header */}
                              <div className="flex items-center gap-2 border-b border-slate-800/60 pb-2.5 mb-2.5">
                                <span className="rounded-lg bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 text-xs font-bold text-emerald-300">
                                  {src.surah_name_roman} [{src.verse_id}]
                                </span>
                                <span className="text-xs text-amber-300 font-arabic font-semibold">
                                  {src.surah_name_arabic}
                                </span>
                                <span className="text-[10px] text-slate-400 rounded bg-slate-800/60 px-1.5 py-0.5">
                                  {src.place_of_revelation}
                                </span>
                              </div>

                              {/* Arabic Text */}
                              <p
                                dir="rtl"
                                className="text-right text-base sm:text-lg font-arabic text-emerald-100 drop-shadow-sm leading-loose mb-2 select-text"
                              >
                                {src.text_arabic}
                                <span className="inline-block mx-3 text-amber-400 font-arabic text-xl select-none align-middle">
                                  {"\u00A0"}۝
                                </span>
                              </p>

                              {/* Translation */}
                              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                                &ldquo;{src.translation}&rdquo;
                              </p>

                              {/* Citation Action Buttons */}
                              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/50 pt-2.5 text-xs">
                                <div className="flex items-center gap-1.5">
                                  {/* Audio Recitation Button */}
                                  <button
                                    onClick={() => handleToggleAudio(src)}
                                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium transition-all ${
                                      isPlayingThis
                                        ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                                        : "border border-slate-800 bg-slate-900/80 text-emerald-400 hover:border-emerald-500/40 hover:bg-slate-800"
                                    }`}
                                  >
                                    {isPlayingThis ? (
                                      <>
                                        <VolumeX className="h-3.5 w-3.5" />
                                        <span>Pause</span>
                                      </>
                                    ) : (
                                      <>
                                        <Volume2 className="h-3.5 w-3.5" />
                                        <span>Listen</span>
                                      </>
                                    )}
                                  </button>

                                  {/* Bookmark Button */}
                                  <button
                                    onClick={() => onToggleBookmark(src)}
                                    title={
                                      isBookmarked
                                        ? "Remove bookmark"
                                        : "Save verse"
                                    }
                                    className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 transition-all ${
                                      isBookmarked
                                        ? "border-amber-500/40 bg-amber-950/40 text-amber-300"
                                        : "border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200"
                                    }`}
                                  >
                                    <Bookmark
                                      className={`h-3 w-3 ${
                                        isBookmarked
                                          ? "text-amber-400 fill-amber-400"
                                          : ""
                                      }`}
                                    />
                                    <span className="hidden sm:inline">
                                      {isBookmarked ? "Saved" : "Bookmark"}
                                    </span>
                                  </button>
                                </div>

                                {/* View Detail Modal */}
                                <button
                                  onClick={() =>
                                    onOpenAyahModal(
                                      src.surah_number,
                                      src.ayah_number,
                                    )
                                  }
                                  className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 hover:underline"
                                >
                                  <span>View Ayah Details & Urdu</span>
                                  <ChevronRight className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Message Bottom Action Bar */}
                  <div className="flex items-center gap-2 px-1 text-[11px] text-slate-500">
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="hover:text-slate-300 flex items-center gap-1 transition-colors"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {msg.error && (
                      <button
                        onClick={onRetry}
                        className="flex items-center gap-1 text-rose-400 hover:text-rose-300 transition-colors ml-2"
                        title="Retry question"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Retry</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* User Avatar */}
                {isUser && (
                  <div className="flex-shrink-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-slate-300">
                      <User className="h-4 w-4" />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Loading Indicator when awaiting first token */}
        {isLoading &&
          messages.length > 0 &&
          !messages[messages.length - 1].isStreaming && (
            <div className="flex gap-3 sm:gap-4 items-start animate-fadeIn">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-amber-300 border border-emerald-400/30">
                <span className="text-sm font-arabic font-bold">۞</span>
              </div>
              <div className="glass-panel flex items-center gap-2.5 rounded-2xl px-4 py-3 text-xs text-slate-300 border border-slate-800">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                <span>Searching Quranic verses & synthesizing answer...</span>
              </div>
            </div>
          )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
