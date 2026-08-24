"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Square, Globe, Trash2, Sparkles, CornerDownLeft } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (query: string) => void;
  isLoading: boolean;
  onStopStreaming?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  onStopStreaming,
}) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Detect Arabic/Urdu unicode characters directly during render
  const isRTL =
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(
      input,
    );

  // Auto resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180,
      )}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSendMessage(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 pb-3 pt-1">
      {/* Main Input Box with Ambient Emerald Framing */}
      <div className="glass-input-box relative flex flex-col rounded-2xl p-2.5 sm:p-3 transition-all">
        {/* Upper Input Row */}
        <div className="flex items-start gap-2.5">
          {/* Left Decorative Prompt Indicator */}
          <div className="hidden sm:flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 mt-0.5 shadow-inner">
            <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
          </div>

          {/* Textarea Input */}
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              rows={1}
              dir={isRTL ? "rtl" : "ltr"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isRTL
                  ? "قرآن مجید سے متعلق اپنا سوال یہاں درج کریں..."
                  : "Ask your question about Quranic verses, wisdom, or life guidance..."
              }
              className={`w-full resize-none bg-transparent px-1 py-1.5 text-sm sm:text-base text-slate-100 placeholder-slate-400/80 focus:outline-none max-h-40 ${
                isRTL ? "font-arabic text-base sm:text-lg" : ""
              }`}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 flex-shrink-0 self-end pb-0.5">
            {input.trim() && (
              <button
                type="button"
                onClick={() => setInput("")}
                aria-label="Clear input"
                title="Clear question"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}

            {isLoading ? (
              <button
                type="button"
                onClick={onStopStreaming}
                title="Stop generation"
                className="flex h-9 px-3 items-center gap-1.5 rounded-xl bg-rose-600/20 border border-rose-500/50 text-rose-300 hover:bg-rose-600/30 transition-all active:scale-95 text-xs font-semibold"
              >
                <Square className="h-3.5 w-3.5 fill-rose-300" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={!input.trim()}
                aria-label="Send question"
                className={`flex h-9 items-center gap-1.5 px-3.5 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-md active:scale-95 ${
                  input.trim()
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-emerald-500/30 hover:from-emerald-400 hover:to-teal-400 hover:shadow-emerald-500/50 cursor-pointer"
                    : "bg-slate-800/70 border border-slate-700/60 text-slate-500 cursor-not-allowed"
                }`}
              >
                <span>Ask</span>
                <Send className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Helper / Guidance Bar */}
        <div className="flex items-center justify-between border-t border-slate-800/60 pt-2 mt-1.5 px-1 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Globe className="h-3 w-3 text-emerald-400" />
              <span>Ask in English • اردو • العربية</span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
            <span>Press</span>
            <kbd className="inline-flex items-center gap-0.5 rounded bg-slate-800/90 px-1.5 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-700">
              <span>Enter</span>
              <CornerDownLeft className="h-2.5 w-2.5" />
            </kbd>
            <span>to ask</span>
            <span className="text-slate-600">•</span>
            <kbd className="rounded bg-slate-800/90 px-1.5 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-700">
              Shift + Enter
            </kbd>
            <span>new line</span>
          </div>
        </div>
      </div>
    </div>
  );
};
