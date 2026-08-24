"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Square, Globe, Trash2 } from "lucide-react";

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
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 pb-4 pt-2">
      {/* Main Input Glass Container */}
      <div className="glass-input-box relative flex flex-col rounded-2xl p-2.5 transition-all">
        <div className="flex items-center gap-2">
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
                : "Ask anything about Quranic verses, themes, stories, or life wisdom..."
            }
            className={`w-full resize-none bg-transparent px-3 py-2 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none max-h-44 ${
              isRTL ? "font-arabic text-lg" : ""
            }`}
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 self-end pb-1 pr-1">
            {input.trim() && (
              <button
                type="button"
                onClick={() => setInput("")}
                aria-label="Clear input"
                className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-800 hover:text-slate-300"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}

            {isLoading ? (
              <button
                type="button"
                onClick={onStopStreaming}
                title="Stop generation"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600/20 border border-rose-500/40 text-rose-300 hover:bg-rose-600/30 transition-all active:scale-95"
              >
                <Square className="h-4 w-4 fill-rose-300" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={!input.trim()}
                aria-label="Send message"
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all shadow-md active:scale-95 ${
                  input.trim()
                    ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 font-bold shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500"
                    : "bg-slate-800/60 text-slate-600 cursor-not-allowed"
                }`}
              >
                <Send className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Helper Bar */}
        <div className="flex items-center justify-between border-t border-slate-800/40 pt-2 mt-1 px-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-slate-400">
              <Globe className="h-3 w-3 text-emerald-400" />
              <span>English • اردو • العربية</span>
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-400 hidden sm:flex">
            <span>Press</span>
            <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-700">
              Enter ↵
            </kbd>
            <span>to ask</span>
            <span className="text-slate-500">•</span>
            <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-700">
              Shift + Enter
            </kbd>
            <span>for new line</span>
          </div>
        </div>
      </div>
    </div>
  );
};
