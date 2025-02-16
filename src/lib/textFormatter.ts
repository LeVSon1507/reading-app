/**
 * Text formatting options
 */
export interface TextFormatOptions {
  lineWidth?: number; // Số ký tự tối đa trên một dòng
  preserveParagraphs?: boolean; // Giữ nguyên đoạn văn
  removeExtraSpaces?: boolean; // Xóa khoảng trắng thừa
  normalizeNewlines?: boolean; // Chuẩn hóa xuống dòng
  smartQuotes?: boolean; // Chuyển đổi dấu ngoặc kép
  normalizeUnicode?: boolean; // Chuẩn hóa Unicode
  preserveIndentation?: boolean; // Giữ nguyên thụt đầu dòng
  languageHint?: "vi" | "en" | "auto"; // Gợi ý ngôn ngữ để xử lý tốt hơn
}

/**
 * Default formatting options
 */
const DEFAULT_FORMAT_OPTIONS: TextFormatOptions = {
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
 * Normalize Unicode characters
 */
const normalizeUnicodeText = (text: string): string => {
  // Chuẩn hóa về dạng NFC (Normalization Form Canonical Composition)
  return text.normalize("NFC");
};

/**
 * Convert smart quotes
 */
export const convertSmartQuotes = (text: string): string => {
  return text
    .replace(/[\u2018\u2019]/g, "'") // Convert single smart quotes
    .replace(/[\u201C\u201D]/g, '"'); // Convert double smart quotes
};

/**
 * Detect text language
 */
export const detectLanguage = (text: string): "vi" | "en" => {
  // Regex để detect tiếng Việt (có dấu)
  const vietnamesePattern =
    /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
  return vietnamesePattern.test(text) ? "vi" : "en";
};

/**
 * Format paragraph with proper line breaks
 */
export const formatParagraph = (
  text: string,
  lineWidth: number,
  language: "vi" | "en"
): string => {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    // Kiểm tra xem thêm từ mới có vượt quá độ rộng cho phép không
    if (currentLine.length + word.length + 1 <= lineWidth) {
      currentLine += (currentLine ? " " : "") + word;
    } else {
      // Nếu là tiếng Việt, cần kiểm tra thêm để tránh ngắt câu không đúng chỗ
      if (language === "vi") {
        // Tránh ngắt giữa từ ghép
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
 * Check if two words form a Vietnamese compound word
 */
export const isVietnameseCompoundWord = (
  word1: string,
  word2: string
): boolean => {
  // Danh sách một số từ ghép phổ biến trong tiếng Việt
  const commonPairs = [
    ["của", "người"],
    ["trong", "nhà"],
    ["đang", "là"],
    ["sẽ", "được"],
    // Thêm các cặp từ ghép khác tùy nhu cầu
  ];

  return commonPairs.some(
    ([w1, w2]) => word1.toLowerCase() === w1 && word2.toLowerCase() === w2
  );
};

/**
 * Clean and normalize text content
 */
export const cleanText = (text: string, options: TextFormatOptions): string => {
  let cleaned = text;

  // Normalize Unicode if needed
  if (options.normalizeUnicode) {
    cleaned = normalizeUnicodeText(cleaned);
  }

  // Remove extra spaces
  if (options.removeExtraSpaces) {
    cleaned = cleaned
      .replace(/[ \t]+/g, " ") // Replace multiple spaces/tabs with single space
      .replace(/^ +| +$/gm, ""); // Remove leading/trailing spaces
  }

  // Normalize newlines
  if (options.normalizeNewlines) {
    cleaned = cleaned
      .replace(/\r\n/g, "\n") // Convert CRLF to LF
      .replace(/\r/g, "\n") // Convert CR to LF
      .replace(/\n{3,}/g, "\n\n"); // Replace multiple newlines with max two
  }

  // Convert smart quotes if needed
  if (options.smartQuotes) {
    cleaned = convertSmartQuotes(cleaned);
  }

  return cleaned;
};

/**
 * Main text formatting function
 */

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

  // Ensure language is either "vi" or "en"
  if (!isLanguage(language)) {
    throw new Error("Invalid language hint");
  }

  // Clean and normalize text first
  const formatted = cleanText(text, finalOptions);

  // Split into paragraphs
  const paragraphs = formatted.split(/\n{2,}/);

  // Format each paragraph
  const formattedParagraphs = paragraphs.map((paragraph) => {
    if (!paragraph.trim()) return "";

    // Preserve indentation
    const indentation = finalOptions.preserveIndentation
      ? paragraph.match(/^[ \t]*/)?.[0] || ""
      : "";

    // Format paragraph content
    const content = formatParagraph(
      paragraph.trim(),
      finalOptions.lineWidth! - indentation.length,
      language
    );

    // Reapply indentation
    return content
      .split("\n")
      .map((line) => indentation + line)
      .join("\n");
  });

  return formattedParagraphs.join("\n\n");
};

/**
 * Format text for display (e.g., in HTML)
 */
export const formatTextForDisplay = (text: string): string => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\n/g, "<br>");
};

/**
 * Extract text formatting metadata
 */
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
