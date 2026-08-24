"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Bookmark,
  Trash2,
  X,
  Sparkles,
  ChevronRight,
  Search,
} from "lucide-react";
import { ChatMessage, SourceAyah } from "../types";

export interface ConversationHistory {
  id: string;
  title: string;
  timestamp: number;
  messages: ChatMessage[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: ConversationHistory[];
  activeConvId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onClearAllConversations: () => void;
  onNewChat: () => void;
  onSelectPrompt: (promptText: string) => void;
  onOpenAyahModal: (surahNo: number, ayahNo: number) => void;
  bookmarks: SourceAyah[];
  onRemoveBookmark: (verseId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  conversations,
  activeConvId,
  onSelectConversation,
  onDeleteConversation,
  onClearAllConversations,
  onNewChat,
  onSelectPrompt,
  onOpenAyahModal,
  bookmarks,
  onRemoveBookmark,
}) => {
  const [activeTab, setActiveTab] = useState<"chats" | "bookmarks">("chats");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Drawer Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 flex w-80 flex-col border-r border-slate-800/80 bg-[#070e17]/95 backdrop-blur-2xl transition-transform duration-300 ease-in-out lg:static lg:z-10 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Close Button Bar (Hidden on desktop) */}
        <div className="flex h-12 items-center justify-end px-3 border-b border-slate-800/70 lg:hidden">
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Switcher: Chats vs Bookmarks */}
        <div className="flex border-b border-slate-800/60 bg-slate-900/40 px-3 pt-2">
          <button
            onClick={() => setActiveTab("chats")}
            className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 py-2 text-xs font-semibold transition-all ${
              activeTab === "chats"
                ? "border-emerald-500 text-emerald-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Chat Sessions ({conversations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 py-2 text-xs font-semibold transition-all ${
              activeTab === "bookmarks"
                ? "border-amber-500 text-amber-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Saved Verses ({bookmarks.length})</span>
          </button>
        </div>

        {/* Search Bar if chats or bookmarks exist */}
        <div className="p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === "chats"
                  ? "Search conversation titles..."
                  : "Filter saved verses..."
              }
              className="w-full rounded-lg border border-slate-800 bg-slate-900/60 py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-emerald-500/40 focus:outline-none"
            />
          </div>
        </div>

        {/* Main List Container */}
        <div className="flex-1 overflow-y-auto px-3 space-y-1.5">
          {activeTab === "chats" ? (
            <>
              <div className="mb-2">
                <button
                  onClick={() => {
                    onNewChat();
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/40 transition-all shadow-sm"
                >
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                  <span>+ Start New Chat</span>
                </button>
              </div>

              {filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-slate-500">
                  <MessageSquare className="h-8 w-8 stroke-[1.5] text-slate-600 mb-2" />
                  <p className="text-xs font-medium text-slate-400">
                    No chat history yet
                  </p>
                  <p className="text-[11px] text-slate-500 max-w-[200px] mt-1 mb-3">
                    Ask questions about any Quranic concept to start.
                  </p>
                  <button
                    onClick={() => {
                      onSelectPrompt(
                        "What does the Quran say about patience (Sabr)?",
                      );
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-[11px] text-emerald-300 hover:bg-slate-800"
                  >
                    Try: &quot;Patience in the Quran&quot;
                  </button>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isActive = conv.id === activeConvId;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => {
                        onSelectConversation(conv.id);
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className={`group relative flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-xs transition-all ${
                        isActive
                          ? "border border-emerald-500/40 bg-emerald-950/40 text-emerald-200"
                          : "border border-transparent hover:border-slate-800 hover:bg-slate-900/60 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <MessageSquare
                          className={`h-3.5 w-3.5 flex-shrink-0 ${
                            isActive ? "text-emerald-400" : "text-slate-500"
                          }`}
                        />
                        <span className="truncate font-medium">
                          {conv.title || "Quran Insight Query"}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation(conv.id);
                        }}
                        title="Delete conversation"
                        className="opacity-0 group-hover:opacity-100 flex h-6 w-6 items-center justify-center rounded text-slate-500 hover:bg-rose-950/40 hover:text-rose-400 transition-opacity"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })
              )}
            </>
          ) : (
            <>
              {bookmarks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center text-slate-500">
                  <Bookmark className="h-8 w-8 stroke-[1.5] text-slate-600 mb-2" />
                  <p className="text-xs font-medium text-slate-400">
                    No bookmarked verses
                  </p>
                  <p className="text-[11px] text-slate-500 max-w-[200px] mt-1">
                    Click the bookmark icon on any cited Ayah to save it here.
                  </p>
                </div>
              ) : (
                bookmarks.map((b) => (
                  <div
                    key={b.verse_id}
                    className="group rounded-xl border border-slate-800/80 bg-slate-900/50 p-2.5 text-xs transition-all hover:border-amber-500/30 hover:bg-slate-850"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-amber-300">
                        {b.surah_name_roman} [{b.verse_id}]
                      </span>
                      <button
                        onClick={() => onRemoveBookmark(b.verse_id)}
                        className="text-slate-500 hover:text-rose-400"
                        title="Remove bookmark"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="line-clamp-2 text-[11px] text-slate-300 font-arabic mb-1 text-right">
                      {b.text_arabic}
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/50">
                      <span className="text-[10px] text-slate-500">
                        {b.place_of_revelation}
                      </span>
                      <button
                        onClick={() =>
                          onOpenAyahModal(b.surah_number, b.ayah_number)
                        }
                        className="text-[10px] font-medium text-emerald-400 hover:underline flex items-center gap-0.5"
                      >
                        <span>View</span>
                        <ChevronRight className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800/80 px-4 py-2.5 bg-[#050b12]">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span>Powered by</span>
            <span className="font-semibold text-slate-300">FastAPI & RAG</span>
          </div>

          {conversations.length > 0 && (
            <button
              onClick={onClearAllConversations}
              className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
