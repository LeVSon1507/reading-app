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

export const parseFile2 = async (
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

// lib/fileParser.js
import { PDFDocument } from "pdf-lib";
import epub from "epubjs";

async function getTextContent(pdfPage) {
  const content = await pdfPage.getTextContent();
  return content.items.map((item) => item.str).join(" ");
}

export async function getEncoding(file) {
  try {
    const reader = new FileReader();
    reader.readAsText(file, "utf-8"); // Try UTF-8 first
    await new Promise((resolve) => (reader.onload = resolve));
    const text = reader.result as string;

    // Look for encoding declaration (example for HTML):
    const match = text.match(/<meta.*?charset=["']?([^"'\s]+)["']?/i);
    if (match) {
      return match[1];
    }
    return null; // No encoding found
  } catch (error) {
    console.log("🚀 ~ getEncoding ~ error:", error);
    return null; // Error reading file
  }
}

export async function parseFile(file) {
  // Removed formatOptions parameter, not needed here
  const fileType = file.name.split(".").pop().toLowerCase();
  let formattedContent = "";

  try {
    switch (fileType) {
      case "pdf":
        const pdfBytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = pdfDoc.getPages();

        // The correct way to extract text from PDF pages (using async/await):
        const textPromises = pages.map(getTextContent);
        const textArray = await Promise.all(textPromises);
        formattedContent = textArray.join("\n"); // Join the text from all pages
        break;

      case "docx":
        const docxBytes = await file.arrayBuffer();
        const { value } = await mammoth.convertToHtml({
          arrayBuffer: docxBytes,
        });
        formattedContent = value;
        break;

      case "epub":
        const epubBytes = await file.arrayBuffer();
        const book = epub(epubBytes);
        await book.ready;

        // Display all chapters or choose which ones you want to display
        let allContent = "";
        for (let i = 1; i <= +book.spine.get("length"); i++) {
          // Loop through spine items (chapters)
          const rendition = book.renderTo("body", {
            width: "100%",
            height: "100%",
            spread: "none", // To prevent two pages from displaying
            flow: "scrolled", // Ensure vertical scrolling
          });
          await rendition.display(i);

          // Extract the content after rendering:
          const chapterContent = document.body.innerHTML; // Get HTML content after it's rendered.
          allContent += chapterContent; // Append to a single string
          rendition.destroy(); // Clear up memory after reading chapter
        }

        formattedContent = allContent;
        book.destroy();
        break;

      case "html":
      case "txt":
      case "rtf":
      case "mobi":
        formattedContent = await file.text();
        break;

      default:
        throw new Error("Unsupported file type");
    }
  } catch (error) {
    console.error("Error parsing file:", error);
    throw error; // Re-throw the error to be handled by the caller
  }

  return { formattedContent };
}