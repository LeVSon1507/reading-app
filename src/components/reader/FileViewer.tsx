"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  Loader2,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sun,
  Moon,
  BookOpen,
  Type,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { parseFile } from "lib/fileParser";
import { TextFormatOptions } from "@/components/reader/type";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { predefinedTextColors } from "@/components/reader/constants";
import Image from "next/image";
import ColorPicker from "@/components/shared/ColorPicker";

interface FileViewerProps {
  file: File | null;
  formatOptions?: Partial<TextFormatOptions>;
  content?: string;
  maxHeight?: string;
  textColor: string;
}

const FileViewer: React.FC<FileViewerProps> = ({
  file,
  formatOptions: initialFormatOptions,
  content: externalContent,
  maxHeight = "70vh",
  textColor: textColorProps,
}) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formatOptions, setFormatOptions] = useState<any>(
    initialFormatOptions || {
      fontSize: 16,
      fontFamily: "inter",
      backgroundColor: "#d2b48c",
      alignment: "left",
      textColor: textColorProps || "#000000",
    }
  );

  useEffect(() => {
    if (externalContent !== undefined) {
      setContent(externalContent);
      return;
    }

    const readFile = async () => {
      if (!file) {
        setContent("");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const result = await parseFile(file, formatOptions);
        setContent(result.formattedContent);
      } catch (err) {
        console.error("Error reading file:", err);
        setError(
          err instanceof Error ? err.message : "Có lỗi xảy ra khi đọc file"
        );
      } finally {
        setLoading(false);
      }
    };

    readFile();
  }, [file, formatOptions, externalContent]);

  const contentStyle = {
    fontSize: `${formatOptions.fontSize}px`,
    fontFamily: formatOptions.fontFamily,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    textAlign: formatOptions.alignment as any,
    backgroundColor: formatOptions.backgroundColor,
    whiteSpace: "pre-wrap" as const,
    wordBreak: "break-word" as const,
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box" as const,
    lineHeight: "1.8",
    padding: "16px 20px",
    color: !isFullscreen ? textColorProps : formatOptions.textColor,
  };

  const scrollContainerStyle = {
    overflowY: "auto" as const,
    overflowX: "hidden" as const,
    maxHeight: isFullscreen ? "calc(100vh - 8rem)" : maxHeight,
    width: "100%",
    WebkitOverflowScrolling: "touch",
  } as const;

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const ReaderControls = () => {
    if (!isFullscreen) return <></>;
    return (
      <div className="sticky top-0 z-10 backdrop-blur-lg bg-background/90 border-b">
        <div className="flex flex-wrap items-center justify-between p-2 gap-2">
          {/* Font Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <Select
              value={formatOptions.fontFamily}
              onValueChange={(value) =>
                setFormatOptions({ ...formatOptions, fontFamily: value })
              }
            >
              <SelectTrigger className="w-20 h-8 text-sm text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="arial">Arial</SelectItem>
                <SelectItem value="times">Times</SelectItem>
              </SelectContent>
            </Select>

            {/* Text Color Refactor */}

            <ColorPicker
              icon={<Type className="w-4 h-4" />}
              tooltip="Change text color"
              selectedColor={formatOptions.textColor}
              colors={predefinedTextColors}
              onColorChange={(color) =>
                setFormatOptions({ ...formatOptions, textColor: color })
              }
            />
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                suppressHydrationWarning
                className="h-8 w-8 text-foreground hover:text-foreground"
                onClick={() =>
                  setFormatOptions({
                    ...formatOptions,
                    fontSize: Math.max(12, formatOptions.fontSize - 2),
                  })
                }
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-sm min-w-[2rem] text-center font-medium text-foreground">
                {formatOptions.fontSize}
              </span>
              <Button
                variant="ghost"
                size="sm"
                suppressHydrationWarning
                className="h-8 w-8 text-foreground hover:text-foreground"
                onClick={() =>
                  setFormatOptions({
                    ...formatOptions,
                    fontSize: Math.min(32, formatOptions.fontSize + 2),
                  })
                }
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Alignment Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 text-foreground hover:text-foreground",
                formatOptions.alignment === "left" &&
                  "bg-accent text-accent-foreground"
              )}
              onClick={() =>
                setFormatOptions({ ...formatOptions, alignment: "left" })
              }
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 text-foreground hover:text-foreground",
                formatOptions.alignment === "center" &&
                  "bg-accent text-accent-foreground"
              )}
              onClick={() =>
                setFormatOptions({ ...formatOptions, alignment: "center" })
              }
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 text-foreground hover:text-foreground",
                formatOptions.alignment === "right" &&
                  "bg-accent text-accent-foreground"
              )}
              onClick={() =>
                setFormatOptions({ ...formatOptions, alignment: "right" })
              }
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Theme Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 text-foreground hover:text-foreground",
                formatOptions.backgroundColor === "#ffffff" &&
                  "bg-accent text-accent-foreground"
              )}
              onClick={() =>
                setFormatOptions({
                  ...formatOptions,
                  backgroundColor: "#ffffff",
                })
              }
            >
              <Sun className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 text-foreground hover:text-foreground",
                formatOptions.backgroundColor === "#d2b48c" &&
                  "bg-accent text-accent-foreground"
              )}
              onClick={() =>
                setFormatOptions({
                  ...formatOptions,
                  backgroundColor: "#d2b48c",
                })
              }
            >
              <BookOpen className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 text-foreground hover:text-foreground",
                formatOptions.backgroundColor === "#1a1a1a" &&
                  "bg-accent text-accent-foreground"
              )}
              onClick={() =>
                setFormatOptions({
                  ...formatOptions,
                  backgroundColor: "#1a1a1a",
                })
              }
            >
              <Moon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const ViewerContent = () => (
    <div style={scrollContainerStyle} className="w-full">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Đang tải...</span>
        </div>
      ) : error ? (
        <Alert variant="destructive" className="m-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <article
          className="prose prose-sm max-w-none dark:prose-invert mx-auto px-4 sm:px-6"
          style={contentStyle}
        >
          {content}
        </article>
      )}
    </div>
  );

  const TruncatedFileName = ({ name }: { name: string }) => {
    const words = name.split(" ");
    let displayName = name;

    if (words.length > 1) {
      displayName = `${words[0]}...`;
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Image
                src="/text.svg"
                alt="Text File Name Icon"
                width={25}
                height={25}
                className="text-primary"
              />
              <span className="truncate max-w-[300px]">{displayName}</span>
            </h2>
          </TooltipTrigger>
          <TooltipContent>
            <p>{name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  if (!file) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Xem trước file
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Chưa chọn file
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-background">
          <TruncatedFileName name={file.name} />
          <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
            <Minimize2 className="h-5 w-5" />
          </Button>
        </div>
        <ReaderControls />
        <div className="flex-1 overflow-hidden">
          <ViewerContent />
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <TruncatedFileName name={file.name} />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="ml-2"
          >
            <Maximize2 className="h-5 w-5" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ReaderControls />
        <div className="p-4">
          <ViewerContent />
        </div>
      </CardContent>
    </Card>
  );
};

export default FileViewer;