export interface SourceAyah {
  verse_id: string; // e.g. "2:255"
  surah_number: number;
  ayah_number: number;
  surah_name_roman: string;
  surah_name_english: string;
  surah_name_arabic: string;
  place_of_revelation: string;
  text_arabic: string;
  translation: string;
  similarity_score: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  sources?: SourceAyah[];
  detectedLanguage?: string;
  isGreeting?: boolean;
  isStreaming?: boolean;
  error?: boolean;
}

export interface SurahMeta {
  number: number;
  name_arabic: string;
  name_english: string;
  name_roman: string;
  ayah_count: number;
  place_of_revelation: "Meccan" | "Medinan" | string;
}

export interface AyahDetail {
  verse_id: string;
  ayah_number: number;
  text_arabic: string;
  text_english: string;
  text_urdu?: string | null;
  main_themes?: string | null;
  surah: {
    number: number;
    name_arabic: string;
    name_english: string;
    name_roman: string;
    place_of_revelation: string;
  };
}

export interface QuranTopic {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  icon: string;
  sampleQueries: string[];
  keyVerses: string[];
}

export interface RabbanaDua {
  id: string;
  verse_id: string;
  arabic: string;
  english: string;
  context: string;
  surah_name: string;
}

export interface AppSettings {
  streamingEnabled: boolean;
  similarityThreshold: number;
  backendUrl: string;
  arabicFontSize: "sm" | "md" | "lg" | "xl";
  themeMode: "emerald-dark" | "midnight-gold" | "serene-light";
}
