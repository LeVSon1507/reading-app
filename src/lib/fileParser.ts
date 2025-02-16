import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { formatText, TextFormatOptions } from "./textFormatter";
import { Buffer } from "buffer";

/**
 * Supported file types and their MIME types
 */
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
    wordCount: number;
    charCount: number;
    lineCount: number;
    lastModified: Date;
    pageCount?: number;
    encoding: string;
    language: "vi" | "en";
  };
  raw?: any;
}

// ... các hàm utility giữ nguyên ...

/**
 * Parse text file content
 */
export const parseTextFile = async (
  file: File,
  formatOptions?: Partial<TextFormatOptions>
): Promise<ParsedFileResult> => {
  try {
    const buffer = await file.arrayBuffer();
    const decoder = new TextDecoder("utf-8");
    const content = decoder.decode(buffer);
    const formattedContent = formatText(content, formatOptions);
    const stats = calculateTextStats(formattedContent);

    return {
      content,
      formattedContent,
      metadata: {
        fileName: file.name,
        fileType: "txt",
        fileSize: file.size,
        lastModified: new Date(file.lastModified),
        encoding: "utf-8",
        language: detectLanguage(content),
        ...stats,
      },
    };
  } catch (error) {
    throw new Error(`Error parsing text file: ${error}`);
  }
};

/**
 * Parse PDF file content
 */
export const parsePDFFile = async (
  file: File,
  formatOptions?: Partial<TextFormatOptions>
): Promise<ParsedFileResult> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    // Convert ArrayBuffer to Buffer
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdfParse(buffer);
    const content = data.text;
    const formattedContent = formatText(content, formatOptions);
    const stats = calculateTextStats(formattedContent);

    return {
      content,
      formattedContent,
      metadata: {
        fileName: file.name,
        fileType: "pdf",
        fileSize: file.size,
        lastModified: new Date(file.lastModified),
        pageCount: data.numpages,
        encoding: "utf-8",
        language: detectLanguage(content),
        ...stats,
      },
      raw: data,
    };
  } catch (error) {
    throw new Error(`Error parsing PDF file: ${error}`);
  }
};

/**
 * Parse DOCX file content
 */
export const parseDocxFile = async (
  file: File,
  formatOptions?: Partial<TextFormatOptions>
): Promise<ParsedFileResult> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const content = result.value;
    const formattedContent = formatText(content, formatOptions);
    const stats = calculateTextStats(formattedContent);

    return {
      content,
      formattedContent,
      metadata: {
        fileName: file.name,
        fileType: "docx",
        fileSize: file.size,
        lastModified: new Date(file.lastModified),
        encoding: "utf-8",
        language: detectLanguage(content),
        ...stats,
      },
      raw: result,
    };
  } catch (error) {
    throw new Error(`Error parsing DOCX file: ${error}`);
  }
};

/**
 * Parse DOC file content
 */
export const parseDocFile = async (
  file: File,
  formatOptions?: Partial<TextFormatOptions>
): Promise<ParsedFileResult> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const content = result.value;
    const formattedContent = formatText(content, formatOptions);
    const stats = calculateTextStats(formattedContent);

    return {
      content,
      formattedContent,
      metadata: {
        fileName: file.name,
        fileType: "doc",
        fileSize: file.size,
        lastModified: new Date(file.lastModified),
        encoding: "utf-8",
        language: detectLanguage(content),
        ...stats,
      },
      raw: result,
    };
  } catch (error) {
    throw new Error(`Error parsing DOC file: ${error}`);
  }
};

/**
 * Main function to parse any supported file
 */
export const parseFile = async (
  file: File,
  formatOptions?: Partial<TextFormatOptions>
): Promise<ParsedFileResult> => {
  if (!file) {
    throw new Error("No file provided");
  }

  if (!isSupportedFileType(file.name)) {
    throw new Error("Unsupported file type");
  }

  const fileType = getFileExtension(file.name);

  switch (fileType) {
    case "txt":
      return parseTextFile(file, formatOptions);
    case "pdf":
      return parsePDFFile(file, formatOptions);
    case "docx":
      return parseDocxFile(file, formatOptions);
    case "doc":
      return parseDocFile(file, formatOptions);
    default:
      throw new Error("Unsupported file type");
  }
};
