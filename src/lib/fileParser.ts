import mammoth from "mammoth";
import {
  analyzeTextFormat,
  DEFAULT_FORMAT_OPTIONS,
  detectLanguage,
  formatText,
  TextFormatMetadata,
  TextFormatOptions,
} from "lib/textFormatter";

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

    const lastModified = new Date(file.lastModified).toISOString();
    return {
      content,
      formattedContent,
      metadata: {
        fileName: file.name,
        fileType: "txt",
        fileSize: file.size,
        lastModified,
        encoding: "utf-8",
        language,
        formatMetadata,
      },
    };
  } catch (error) {
    throw new Error(`Error parsing text file: ${error}`);
  }
};

// export const parsePDFFile = async (
//   file: File,
//   formatOptions?: Partial<TextFormatOptions>
// ): Promise<ParsedFileResult> => {
//   try {
//     const arrayBuffer = await file.arrayBuffer();
//     const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

//     let fullText = "";
//     for (let i = 1; i <= pdf.numPages; i++) {
//       const page = await pdf.getPage(i);
//       const textContent = await page.getTextContent();
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       const pageText = textContent.items.map((item: any) => item.str).join(" ");
//       fullText += pageText + "\n";
//     }

//     const language = detectLanguage(fullText);
//     const formattedContent = formatText(fullText, {
//       ...DEFAULT_FORMAT_OPTIONS,
//       ...formatOptions,
//       languageHint: language,
//     });

//     const formatMetadata = analyzeTextFormat(formattedContent);

//     return {
//       content: fullText,
//       formattedContent,
//       metadata: {
//         fileName: file.name,
//         fileType: "pdf",
//         fileSize: file.size,
//         lastModified: new Date(file.lastModified).toDateString(),
//         pageCount: pdf.numPages,
//         encoding: "utf-8",
//         language,
//         formatMetadata,
//       },
//     };
//   } catch (error) {
//     throw new Error(`Error parsing PDF file: ${error}`);
//   }
// };

export const parsePDFFile = async (
  file: File,
  formatOptions?: Partial<TextFormatOptions>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  try {
    return {
      content: "123",
      metadata: {
        fileName: file.name,
        fileType: "pdf" as SupportedFileType,
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
    console.error("PDF parsing error:", error);
    throw new Error(
      `Error parsing PDF file: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
// export const parsePDFFile = async (
//   file: File,
//   formatOptions?: Partial<TextFormatOptions>
// ): Promise<ParsedFileResult> => {
//   try {
//     const arrayBuffer = await file.arrayBuffer();
//     const pdfDoc = await PDFDocument.load(arrayBuffer);
//     const pages = pdfDoc.getPages();

//     const worker = new Worker("/pdf.worker.js");

//     let fullText = "";
//     const extractPromises = pages.map((page, index) => {
//       return new Promise((resolve) => {
//         worker.postMessage({
//           page: page,
//           index: index,
//         });

//         worker.onmessage = (e) => {
//           fullText += e.data.text + "\n";
//           resolve(null);
//         };
//       });
//     });

//     await Promise.all(extractPromises);
//     worker.terminate();

//     const language = detectLanguage(fullText);
//     const formattedContent = formatText(fullText, {
//       ...DEFAULT_FORMAT_OPTIONS,
//       ...formatOptions,
//       languageHint: language,
//     });

//     const formatMetadata = analyzeTextFormat(formattedContent);

//     return {
//       content: fullText,
//       formattedContent,
//       metadata: {
//         fileName: file.name,
//         fileType: "pdf",
//         fileSize: file.size,
//         lastModified: new Date(file.lastModified).toDateString(),
//         pageCount: pages.length,
//         encoding: "utf-8",
//         language,
//         formatMetadata,
//       },
//     };
//   } catch (error) {
//     throw new Error(`Error parsing PDF file: ${error}`);
//   }
// };

export const parseDocxFile = async (
  file: File,
  formatOptions?: Partial<TextFormatOptions>
): Promise<ParsedFileResult> => {
  try {
    const arrayBuffer = await file.arrayBuffer();

    // Sử dụng mammoth để extract text
    const result = await mammoth.extractRawText({
      arrayBuffer: arrayBuffer,
    });

    const content = result.value || "";
    const warnings = result.messages;

    if (warnings.length > 0) {
      console.warn("Docx parsing warnings:", warnings);
    }

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
      return aiParseFile(file, formatOptions);
    default:
      throw new Error("Unsupported file type");
  }
};
export const testAI = async (input: string) => {
  try {
    const response = await fetch("/api/aim-llm", {
      method: "POST",
      body: JSON.stringify({ body: input }),
    });

    const data = await response.json();

    console.log("🚀 ~ data:", data);
  } catch (error) {
    console.log("🚀 ~ testAI ~ error:", error);
  }
};

export const aiParseFile = async (
  file: File,
  formatOptions?: Partial<TextFormatOptions>
): Promise<ParsedFileResult> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/aim-llm", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    const { content } = data;
    console.log("🚀 ~ content:", content);

    if (!response.ok) {
      throw new Error(
        data.details || data.error || "Failed to parse DOCX file"
      );
    }

    if (!content) {
      throw new Error("No content extracted from file");
    }

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
    console.error("Detailed error:", error);
    throw new Error(
      "Không thể đọc file này. Vui lòng thử lại hoặc sử dụng file khác."
    );
  }
};

//NOTE: This is a second solution to use docx preview lib
// export const parseDocxFile2 = async (
//   file: File,
//   formatOptions?: Partial<TextFormatOptions>
// ): Promise<ParsedFileResult> => {
//   try {
//     const arrayBuffer = await file.arrayBuffer();

//     // Create a temporary container for rendering
//     const container = document.createElement("div");
//     document.body.appendChild(container);

//     // Render DOCX to HTML
//     await renderAsync(arrayBuffer, container);

//     // Extract text content
//     const content = container.innerText;

//     // Clean up
//     document.body.removeChild(container);

//     // Process the content
//     const language = detectLanguage(content);
//     const formattedContent = formatText(content, {
//       ...DEFAULT_FORMAT_OPTIONS,
//       ...formatOptions,
//       languageHint: language,
//     });

//     const formatMetadata = analyzeTextFormat(formattedContent);

//     return {
//       content,
//       formattedContent,
//       metadata: {
//         fileName: file.name,
//         fileType: "docx",
//         fileSize: file.size,
//         lastModified: new Date(file.lastModified).toDateString(),
//         encoding: "utf-8",
//         language,
//         formatMetadata,
//       },
//     };
//   } catch (error) {
//     throw new Error(`Error parsing DOCX file: ${error}`);
//   }
// };

// NOTE: This is a third solution to use docx and formidable lib
export const parseDocxFile3 = async (
  file: File,
  formatOptions?: Partial<TextFormatOptions>
): Promise<ParsedFileResult> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/parse-docx", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.details || data.error || "Failed to parse DOCX file"
      );
    }

    const { content } = data;

    if (!content) {
      throw new Error("No content extracted from file");
    }

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
    console.error("Detailed error:", error);
    throw new Error(
      "Không thể đọc file này. Vui lòng thử lại hoặc sử dụng file khác."
    );
  }
};
