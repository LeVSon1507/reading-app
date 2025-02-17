"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "lib/utils";
import { TextFormatOptions } from "@/components/reader/type";
import { FormatRules, formatText } from "@/lib/helpers";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const FileUpload = dynamic(() => import("@/components/reader/FileUpload"), {
  ssr: false,
});

const FileViewer = dynamic(() => import("@/components/reader/FileViewer"), {
  ssr: false,
});

const Controls = dynamic(() => import("@/components/reader/Controls"), {
  ssr: false,
});

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [isFormatting, setIsFormatting] = useState(false);
  const [formattedContent, setFormattedContent] = useState<string>("");

  const [formatOptions, setFormatOptions] = useState<TextFormatOptions>({
    lineWidth: 80,
    preserveParagraphs: true,
    removeExtraSpaces: true,
    normalizeNewlines: true,
    smartQuotes: true,
    normalizeUnicode: true,
    preserveIndentation: true,
    languageHint: "auto",
    fontSize: 16,
    alignment: "left",
    fontFamily: "inter",
    backgroundColor: "#d2b48c",
    textColor: "#000000",
  });

  const [formatRules, setFormatRules] = useState<FormatRules>({
    removeExtraSpaces: false,
    normalizeNewlines: false,
    smartQuotes: false,
    capitalizeFirstLetter: false,
    fixPunctuation: false,
    removeEmptyLines: false,
    trimLines: false,
    lineWidth: 80,
  });

  //TODO: Setup LaunchDarkly feature flags later
  const showAdvancedControls = true;
  const enableAutoFormat = true;

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    try {
      const content = await file.text();
      setFileContent(content);
      setFormattedContent(content);

      if (enableAutoFormat) {
        await handleFormatText(content);
      }
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };

  const handleFormatOptionsChange = (
    key: keyof TextFormatOptions,
    value: unknown
  ) => {
    setFormatOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFormatText = async (content?: string) => {
    const textToFormat = content || fileContent;
    if (!textToFormat) return;

    setIsFormatting(true);

    try {
      // Simulate async operation to show loading state
      await new Promise((resolve) => setTimeout(resolve, 500));

      const formattedContent = formatText(textToFormat, formatRules);
      setFormattedContent(formattedContent);
      console.log("Formatting completed", { formattedContent });
    } catch (error) {
      console.error("Error formatting text:", error);
    } finally {
      setIsFormatting(false);
    }
  };

  const handleFormatRulesChange = (newRules: Partial<FormatRules>) => {
    setFormatRules((prev) => ({
      ...prev,
      ...newRules,
    }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      <section
        className={cn("bg-white rounded-lg shadow-md p-6", {
          "border-2 border-blue-500": enableAutoFormat,
        })}
      >
        <h1 className="text-2xl font-bold mb-4 flex items-center">
          <Image
            src="/cloud-file.svg"
            alt="Reading Icon"
            width={55}
            height={55}
            className="text-primary"
          />
          <p className="ml-2 text-[#d2b48c] text-xl">File Reader</p>
        </h1>

        <FileUpload
          onFileSelect={handleFileSelect}
          acceptedFileTypes={[".txt"]}
          // acceptedFileTypes={[".txt", ".pdf", ".doc", ".docx"]}
        />
      </section>

      {showAdvancedControls && selectedFile && (
        <section className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col space-y-4">
            <Controls
              fontSize={formatOptions.fontSize}
              setFontSize={(size) =>
                handleFormatOptionsChange("fontSize", size)
              }
              alignment={formatOptions.alignment}
              setAlignment={(align) =>
                handleFormatOptionsChange("alignment", align)
              }
              fontFamily={formatOptions.fontFamily}
              setFontFamily={(font) =>
                handleFormatOptionsChange("fontFamily", font)
              }
              backgroundColor={formatOptions.backgroundColor}
              setBackgroundColor={(color) =>
                handleFormatOptionsChange("backgroundColor", color)
              }
              setTextColor={(color) =>
                handleFormatOptionsChange("textColor", color)
              }
              textColor={formatOptions.textColor}
              formatRules={formatRules}
              onFormatRulesChange={handleFormatRulesChange}
              onFormatText={handleFormatText}
              isFormatting={isFormatting}
            />

            <Button
              onClick={() => handleFormatText()}
              disabled={isFormatting}
              className="w-full"
            >
              {isFormatting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {/* <Image
                    src="/loading.svg"
                    alt="Loading Icon"
                    width={150}
                    height={150}
                    className=""
                  /> */}
                  Formatting...
                </>
              ) : (
                <div className="flex align-middle items-center cursor-pointer">
                  <p className="mr-2">Format Text</p>
                  <Image
                    src="/11.svg"
                    alt="Format Icon"
                    width={150}
                    height={150}
                    className="text-primary"
                  />
                </div>
              )}
            </Button>
          </div>
        </section>
      )}

      {selectedFile && (
        <section className="bg-white rounded-lg shadow-md p-6">
          {isFormatting ? (
            <div className="flex items-center justify-center p-4">
              {/* <Loader2 className="h-8 w-8 animate-spin" /> */}
              <Image
                src="/loading.svg"
                alt="Loading Icon"
                width={150}
                height={150}
              />
              <span className="ml-2">Formatting...</span>
            </div>
          ) : (
            <FileViewer
              textColor={formatOptions.textColor}
              file={selectedFile}
              formatOptions={formatOptions}
              content={formattedContent}
            />
          )}
        </section>
      )}
    </div>
  );
}
