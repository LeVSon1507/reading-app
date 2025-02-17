export type TextAlignment = "left" | "center" | "right";
export type FontFamily = "inter" | "roboto" | "arial" | "times" | "courier";

export interface TextFormatMetadata {
  paragraphCount: number;
  sentenceCount: number;
  averageWordsPerSentence: number;
  averageCharsPerWord: number;
  languageDetected: string;
}

export interface TextFormatOptions {
  // Text Content Formatting
  lineWidth: number; // Maximum characters per line
  preserveParagraphs: boolean; // Keep paragraph breaks
  removeExtraSpaces: boolean; // Remove redundant spaces
  normalizeNewlines: boolean; // Convert different newline types to standard
  smartQuotes: boolean; // Convert quotes to smart quotes
  normalizeUnicode: boolean; // Normalize Unicode characters
  preserveIndentation: boolean; // Keep text indentation

  // Display Formatting
  fontSize: number; // Font size in pixels
  alignment: TextAlignment; // Text alignment
  fontFamily: FontFamily; // Font family
  backgroundColor: string; // Background color in hex

  // Language Settings
  languageHint: string; // Preferred language for formatting ('auto' or ISO code)

  textColor?: string;
}

export const DEFAULT_FORMAT_OPTIONS: TextFormatOptions = {
  // Text Content Formatting
  lineWidth: 80,
  preserveParagraphs: true,
  removeExtraSpaces: true,
  normalizeNewlines: true,
  smartQuotes: true,
  normalizeUnicode: true,
  preserveIndentation: true,

  // Display Formatting
  fontSize: 16,
  alignment: "left",
  fontFamily: "inter",
  backgroundColor: "#ffffff",

  // Language Settings
  languageHint: "auto",
};
