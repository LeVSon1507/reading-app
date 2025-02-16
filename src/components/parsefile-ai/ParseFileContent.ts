import mammoth from "mammoth";
import {
  detectLanguage,
  formatText,
  analyzeTextFormat,
} from "lib/textFormatter";

export const parseFileContent = async (file: File): Promise<string> => {
  const fileType = file.name.split(".").pop()?.toLowerCase();

  if (fileType === "docx") {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value || "";
  } else if (fileType === "txt") {
    const buffer = await file.arrayBuffer();
    const decoder = new TextDecoder("utf-8");
    return decoder.decode(buffer);
  } else if (fileType === "pdf") {
    throw new Error("PDF parsing not implemented yet.");
  } else {
    throw new Error("Unsupported file type");
  }
};

export const analyzeFileContent = async (content: string) => {
  const language = detectLanguage(content);

  const formattedContent = formatText(content, { languageHint: language });

  const formatMetadata = analyzeTextFormat(formattedContent);

  return { language, formattedContent, formatMetadata };
};
