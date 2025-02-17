import mammoth from "mammoth";
import {
  analyzeTextFormat,
  DEFAULT_FORMAT_OPTIONS,
  detectLanguage,
  formatText,
  TextFormatMetadata,
} from "lib/textFormatter";
import { TextFormatOptions } from "@/components/reader/type";

export const ACCEPTED_FILE_TYPES = {
  "text/plain": [".txt"],
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
};

export type SupportedFileType = "txt" | "doc" | "docx" | "pdf";
export interface ParsedFileResult {
  content: string;
  formattedContent: string;
  metadata: {
    fileName: string;
    fileType: SupportedFileType;
    fileSize: number;
    lastModified: string;
    encoding: string;
    language: string;
    pageCount?: number;
    formatMetadata: TextFormatMetadata;
  };
  raw?: unknown;
}

export const parseTextFile = async (
  file: File,
  formatOptions?: Partial<TextFormatOptions>
): Promise<ParsedFileResult> => {
  try {
    const buffer = await file.arrayBuffer();
    const decoder = new TextDecoder("utf-8");
    const content = decoder.decode(buffer);

    const language = detectLanguage(content);
    const formattedContent = formatText(content, {
      ...DEFAULT_FORMAT_OPTIONS,
      ...formatOptions,
      languageHint: language,
    });

    const formatMetadata = analyzeTextFormat(formattedContent);

    return {
      content,
      formattedContent,
      metadata: {
        fileName: file.name,
        fileType: "txt",
        fileSize: file.size,
        lastModified: new Date(file.lastModified).toISOString(),
        encoding: "utf-8",
        language,
        formatMetadata,
      },
    };
  } catch (error) {
    throw new Error(`Error parsing text file: ${error}`);
  }
};

export const parsePDFFile = async (
  file: File,
  formatOptions?: Partial<TextFormatOptions>
): Promise<ParsedFileResult> => {
  console.log("🚀 ~ formatOptions:", formatOptions);
  try {
    return {
      content: "123",
      formattedContent: "123",
      metadata: {
        fileName: file.name,
        fileType: "pdf",
        fileSize: file.size,
        lastModified: new Date(file.lastModified).toDateString(),
        pageCount: 1,
        encoding: "utf-8",
        language: "vi",
        formatMetadata: {
          paragraphCount: 123,
          sentenceCount: 123,
          averageWordsPerSentence: 123,
          averageCharsPerWord: 123,
          languageDetected: "vi",
        },
      },
    };
  } catch (error) {
    throw new Error(
      `Error parsing PDF file: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const parseDocxFile = async (
  file: File,
  formatOptions?: Partial<TextFormatOptions>
): Promise<ParsedFileResult> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({
      arrayBuffer: arrayBuffer,
    });

    const content = result.value || "";
    const language = detectLanguage(content);
    const formattedContent = formatText(content, {
      ...DEFAULT_FORMAT_OPTIONS,
      ...formatOptions,
      languageHint: language,
    });

    const formatMetadata = analyzeTextFormat(formattedContent);

    return {
      content,
      formattedContent,
      metadata: {
        fileName: file.name,
        fileType: "docx",
        fileSize: file.size,
        lastModified: new Date(file.lastModified).toDateString(),
        encoding: "utf-8",
        language,
        formatMetadata,
      },
    };
  } catch (error) {
    throw new Error(`Error parsing DOCX file: ${error}`);
  }
};

export const parseFile = async (
  file: File,
  formatOptions?: Partial<TextFormatOptions>
): Promise<ParsedFileResult> => {
  if (!file) {
    throw new Error("No file provided");
  }

  const fileType = file.name.split(".").pop()?.toLowerCase();

  switch (fileType) {
    case "txt":
      return parseTextFile(file, formatOptions);
    case "pdf":
      return parsePDFFile(file, formatOptions);
    case "docx":
    case "doc":
      return parseDocxFile(file, formatOptions);
    default:
      throw new Error("Unsupported file type");
  }
};
