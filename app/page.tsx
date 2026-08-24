"use client";

import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "./components/Navbar";
import { Sidebar, ConversationHistory } from "./components/Sidebar";
import { ChatArea } from "./components/ChatArea";
import { ChatInput } from "./components/ChatInput";
import { AyahModal } from "./components/AyahModal";
import { SurahsDrawer } from "./components/SurahsDrawer";
import { TopicsDrawer } from "./components/TopicsDrawer";
import { DuasModal } from "./components/DuasModal";
import { SettingsModal } from "./components/SettingsModal";
import { AppSettings, ChatMessage, SourceAyah } from "./types";
import {
  sendChatMessageJSON,
  sendChatMessageStream,
  DEFAULT_BACKEND_URL,
} from "./lib/api";

const STORAGE_KEYS = {
  CONVERSATIONS: "quran_insights_conversations_v1",
  BOOKMARKS: "quran_insights_bookmarks_v1",
  SETTINGS: "quran_insights_settings_v1",
};

const DEFAULT_SETTINGS: AppSettings = {
  streamingEnabled: true,
  similarityThreshold: 0.4,
  backendUrl: DEFAULT_BACKEND_URL,
  arabicFontSize: "lg",
  themeMode: "emerald-dark",
};

function getStoredValue<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export default function HomePage() {
  // ── States ──────────────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<ConversationHistory[]>(
    () => getStoredValue(STORAGE_KEYS.CONVERSATIONS, []),
  );
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<SourceAyah[]>(() =>
    getStoredValue(STORAGE_KEYS.BOOKMARKS, []),
  );
  const [settings, setSettings] = useState<AppSettings>(() =>
    getStoredValue(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS),
  );
  const [isLoading, setIsLoading] = useState(false);

  // Modal / Drawer visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedAyah, setSelectedAyah] = useState<{
    surahNo: number;
    ayahNo: number;
  } | null>(null);
  const [isSurahsOpen, setIsSurahsOpen] = useState(false);
  const [isTopicsOpen, setIsTopicsOpen] = useState(false);
  const [isDuasOpen, setIsDuasOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.CONVERSATIONS,
        JSON.stringify(conversations),
      );
    } catch {
      // Ignore
    }
  }, [conversations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    } catch {
      // Ignore
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // Ignore
    }
  }, [settings]);

  // ── Chat Handlers ────────────────────────────────────────────────────────
  const saveConversationState = (msgs: ChatMessage[], convId: string) => {
    if (msgs.length === 0 || !convId) return;
    const firstUserMsg = msgs.find((m) => m.role === "user");
    const title = firstUserMsg
      ? firstUserMsg.content.slice(0, 42) +
        (firstUserMsg.content.length > 42 ? "..." : "")
      : "Quran Wisdom";

    setConversations((prev) => {
      const existingIdx = prev.findIndex((c) => c.id === convId);
      const updatedItem: ConversationHistory = {
        id: convId,
        title,
        timestamp: Date.now(),
        messages: msgs,
      };

      if (existingIdx >= 0) {
        const newArr = [...prev];
        newArr[existingIdx] = updatedItem;
        return newArr;
      }
      return [updatedItem, ...prev];
    });
  };

  const handleSendMessage = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    const targetConvId = activeConvId || `conv-${Date.now()}`;
    if (!activeConvId) {
      setActiveConvId(targetConvId);
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: queryText.trim(),
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    const assistantMsgId = `asst-${Date.now()}`;

    const historyPayload = messages
      .filter((m) => m.content && !m.error)
      .map((m) => ({ role: m.role, content: m.content }));

    // Check if streaming enabled
    if (settings.streamingEnabled) {
      const tempAssistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
        isStreaming: true,
        sources: [],
      };

      const messagesWithStream = [...newMessages, tempAssistantMsg];
      setMessages(messagesWithStream);

      abortControllerRef.current = new AbortController();

      try {
        let fullContent = "";

        await sendChatMessageStream(
          queryText,
          settings.similarityThreshold,
          settings.backendUrl,
          {
            onMetadata: (meta) => {
              setMessages((curr) =>
                curr.map((m) =>
                  m.id === assistantMsgId
                    ? {
                        ...m,
                        sources: meta.sources,
                        detectedLanguage: meta.detected_language,
                        isGreeting: meta.is_greeting,
                      }
                    : m,
                ),
              );
            },
            onToken: (token) => {
              fullContent += token;
              setMessages((curr) =>
                curr.map((m) =>
                  m.id === assistantMsgId
                    ? { ...m, content: fullContent, isStreaming: true }
                    : m,
                ),
              );
            },
            onDone: () => {
              setIsLoading(false);
              setMessages((curr) => {
                const finished = curr.map((m) =>
                  m.id === assistantMsgId ? { ...m, isStreaming: false } : m,
                );
                saveConversationState(finished, targetConvId);
                return finished;
              });
            },
            onError: async (err) => {
              // Try fallback to JSON if SSE stream had an issue
              console.warn("Streaming error, falling back to JSON:", err);
              try {
                const jsonRes = await sendChatMessageJSON(
                  queryText,
                  settings.similarityThreshold,
                  settings.backendUrl,
                  historyPayload,
                );
                const updated = newMessages.concat({
                  id: assistantMsgId,
                  role: "assistant",
                  content: jsonRes.answer,
                  timestamp: Date.now(),
                  sources: jsonRes.sources,
                  detectedLanguage: jsonRes.detected_language,
                  isGreeting: jsonRes.is_greeting,
                  isStreaming: false,
                });
                setMessages(updated);
                saveConversationState(updated, targetConvId);
              } catch {
                setMessages((curr) =>
                  curr.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          content:
                            "⚠️ An error occurred connecting to the backend server. Please make sure the FastAPI server is running.",
                          isStreaming: false,
                          error: true,
                        }
                      : m,
                  ),
                );
              } finally {
                setIsLoading(false);
              }
            },
          },
          abortControllerRef.current.signal,
          historyPayload,
        );
      } catch {
        setIsLoading(false);
      }
    } else {
      // Standard Fast JSON Mode
      try {
        const jsonRes = await sendChatMessageJSON(
          queryText,
          settings.similarityThreshold,
          settings.backendUrl,
          historyPayload,
        );

        const finishedMessages = [
          ...newMessages,
          {
            id: assistantMsgId,
            role: "assistant" as const,
            content: jsonRes.answer,
            timestamp: Date.now(),
            sources: jsonRes.sources,
            detectedLanguage: jsonRes.detected_language,
            isGreeting: jsonRes.is_greeting,
            isStreaming: false,
          },
        ];
        setMessages(finishedMessages);
        saveConversationState(finishedMessages, targetConvId);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        setMessages([
          ...newMessages,
          {
            id: assistantMsgId,
            role: "assistant",
            content: `⚠️ Failed to get response from server: ${errMsg}. Please ensure the backend is running at ${settings.backendUrl}.`,
            timestamp: Date.now(),
            error: true,
            isStreaming: false,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setMessages((curr) =>
      curr.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m)),
    );
  };

  const handleNewChat = () => {
    handleStopStreaming();
    setMessages([]);
    setActiveConvId(null);
  };

  const handleSelectConversation = (id: string) => {
    const conv = conversations.find((c) => c.id === id);
    if (conv) {
      handleStopStreaming();
      setActiveConvId(conv.id);
      setMessages(conv.messages);
    }
  };

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConvId === id) {
      handleNewChat();
    }
  };

  const handleClearAllConversations = () => {
    if (confirm("Are you sure you want to clear all chat history?")) {
      setConversations([]);
      handleNewChat();
    }
  };

  const handleToggleBookmark = (ayah: SourceAyah) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.verse_id === ayah.verse_id);
      if (exists) {
        return prev.filter((b) => b.verse_id !== ayah.verse_id);
      }
      return [ayah, ...prev];
    });
  };

  const bookmarkedIds = new Set(bookmarks.map((b) => b.verse_id));

  return (
    <div className="flex h-screen w-full flex-col bg-[#070d14] text-slate-100 antialiased overflow-hidden">
      {/* ── Top Navbar ────────────────────────────────────────────────────────── */}
      <Navbar
        onNewChat={handleNewChat}
        onOpenSurahs={() => setIsSurahsOpen(true)}
        onOpenTopics={() => setIsTopicsOpen(true)}
        onOpenDuas={() => setIsDuasOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* ── Main App Layout ───────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Navigation Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          conversations={conversations}
          activeConvId={activeConvId}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
          onClearAllConversations={handleClearAllConversations}
          onNewChat={handleNewChat}
          onSelectPrompt={handleSendMessage}
          onOpenAyahModal={(surahNo, ayahNo) =>
            setSelectedAyah({ surahNo, ayahNo })
          }
          bookmarks={bookmarks}
          onRemoveBookmark={(verseId) =>
            setBookmarks((prev) => prev.filter((b) => b.verse_id !== verseId))
          }
        />

        {/* Central Chat Stream & Input Bar */}
        <main className="flex flex-1 flex-col overflow-hidden relative">
          <ChatArea
            messages={messages}
            isLoading={isLoading}
            onSelectPrompt={handleSendMessage}
            onOpenAyahModal={(surahNo, ayahNo) =>
              setSelectedAyah({ surahNo, ayahNo })
            }
            onToggleBookmark={handleToggleBookmark}
            bookmarkedIds={bookmarkedIds}
            onRetry={() => {
              const lastUserMsg = [...messages]
                .reverse()
                .find((m) => m.role === "user");
              if (lastUserMsg) {
                handleSendMessage(lastUserMsg.content);
              }
            }}
          />

          {/* Floating Glassmorphic Input Bar */}
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onStopStreaming={handleStopStreaming}
          />
        </main>
      </div>

      {/* ── Interactive Modals & Drawers ──────────────────────────────────────── */}
      {selectedAyah && (
        <AyahModal
          surahNo={selectedAyah.surahNo}
          ayahNo={selectedAyah.ayahNo}
          onClose={() => setSelectedAyah(null)}
          onAskAboutAyah={handleSendMessage}
          isBookmarked={bookmarks.some(
            (b) =>
              b.surah_number === selectedAyah.surahNo &&
              b.ayah_number === selectedAyah.ayahNo,
          )}
          onToggleBookmark={handleToggleBookmark}
        />
      )}

      <SurahsDrawer
        isOpen={isSurahsOpen}
        onClose={() => setIsSurahsOpen(false)}
        onSelectSurahPrompt={handleSendMessage}
        onOpenAyahModal={(surahNo, ayahNo) =>
          setSelectedAyah({ surahNo, ayahNo })
        }
      />

      <TopicsDrawer
        isOpen={isTopicsOpen}
        onClose={() => setIsTopicsOpen(false)}
        onSelectPrompt={handleSendMessage}
      />

      <DuasModal
        isOpen={isDuasOpen}
        onClose={() => setIsDuasOpen(false)}
        onSelectPrompt={handleSendMessage}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newSettings) =>
          setSettings((prev) => ({ ...prev, ...newSettings }))
        }
      />
    </div>
  );
}
