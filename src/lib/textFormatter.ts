export interface TextFormatOptions {
  lineWidth?: number; // Maximum characters per line
  preserveParagraphs?: boolean; // Keep paragraph structure
  removeExtraSpaces?: boolean; // Remove redundant spaces
  normalizeNewlines?: boolean; // Normalize line breaks
  smartQuotes?: boolean; // Convert smart quotes
  normalizeUnicode?: boolean; // Normalize Unicode characters
  preserveIndentation?: boolean; // Preserve indentation
  languageHint?: "vi" | "en" | "auto"; // Language hint for better processing
}

export const DEFAULT_FORMAT_OPTIONS: TextFormatOptions = {
  lineWidth: 80,
  preserveParagraphs: true,
  removeExtraSpaces: true,
  normalizeNewlines: true,
  smartQuotes: true,
  normalizeUnicode: true,
  preserveIndentation: true,
  languageHint: "auto",
};

/**
 * Normalize Unicode characters to NFC form
 */
const normalizeUnicodeText = (text: string): string => {
  return text.normalize("NFC");
};

export const convertSmartQuotes = (text: string): string => {
  return text.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
};

/**
 * Detect if text is Vietnamese or English
 */
export const detectLanguage = (text: string): "vi" | "en" => {
  const vietnamesePattern =
    /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
  return vietnamesePattern.test(text) ? "vi" : "en";
};

export const formatParagraph = (
  text: string,
  lineWidth: number,
  language: "vi" | "en"
): string => {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if (currentLine.length + word.length + 1 <= lineWidth) {
      currentLine += (currentLine ? " " : "") + word;
    } else {
      if (language === "vi") {
        const nextWord = words[words.indexOf(word) + 1];
        if (nextWord && isVietnameseCompoundWord(word, nextWord)) {
          lines.push(currentLine);
          currentLine = word;
          continue;
        }
      }

      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.join("\n");
};

/**
 * Check for common Vietnamese compound words
 */
export const isVietnameseCompoundWord = (
  word1: string,
  word2: string
): boolean => {
  const commonPairs = [
    ["của", "người"],
    ["trong", "nhà"],
    ["đang", "là"],
    ["sẽ", "được"],
  ];

  return commonPairs.some(
    ([w1, w2]) => word1.toLowerCase() === w1 && word2.toLowerCase() === w2
  );
};

export const cleanText = (text: string, options: TextFormatOptions): string => {
  let cleaned = text;

  if (options.normalizeUnicode) {
    cleaned = normalizeUnicodeText(cleaned);
  }

  if (options.removeExtraSpaces) {
    cleaned = cleaned.replace(/[ \t]+/g, " ").replace(/^ +| +$/gm, "");
  }

  if (options.normalizeNewlines) {
    cleaned = cleaned
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/\n{3,}/g, "\n\n");
  }

  if (options.smartQuotes) {
    cleaned = convertSmartQuotes(cleaned);
  }

  return cleaned;
};

export const isLanguage = (lang?: string): lang is "vi" | "en" => {
  return lang === "vi" || lang === "en";
};

export const formatText = (
  text: string,
  options: Partial<TextFormatOptions> = {}
): string => {
  const finalOptions = { ...DEFAULT_FORMAT_OPTIONS, ...options };
  const language =
    finalOptions.languageHint === "auto"
      ? detectLanguage(text)
      : finalOptions.languageHint;

  if (!isLanguage(language)) {
    throw new Error("Invalid language hint");
  }

  const formatted = cleanText(text, finalOptions);
  const paragraphs = formatted.split(/\n{2,}/);

  const formattedParagraphs = paragraphs.map((paragraph) => {
    if (!paragraph.trim()) return "";

    const indentation = finalOptions.preserveIndentation
      ? paragraph.match(/^[ \t]*/)?.[0] || ""
      : "";

    const content = formatParagraph(
      paragraph.trim(),
      finalOptions.lineWidth! - indentation.length,
      language
    );

    return content
      .split("\n")
      .map((line) => indentation + line)
      .join("\n");
  });

  return formattedParagraphs.join("\n\n");
};

export const formatTextForDisplay = (text: string): string => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\n/g, "<br>");
};

export interface TextFormatMetadata {
  paragraphCount: number;
  sentenceCount: number;
  averageWordsPerSentence: number;
  averageCharsPerWord: number;
  languageDetected: "vi" | "en";
}

export const analyzeTextFormat = (text: string): TextFormatMetadata => {
  const language = detectLanguage(text);
  const sentences = text.split(/[.!?]+\s+/);
  const words = text.split(/\s+/);
  const paragraphs = text.split(/\n{2,}/);

  return {
    paragraphCount: paragraphs.length,
    sentenceCount: sentences.length,
    averageWordsPerSentence: words.length / sentences.length,
    averageCharsPerWord: text.replace(/\s+/g, "").length / words.length,
    languageDetected: language,
  };
};
