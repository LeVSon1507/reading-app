"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  Loader2,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
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
import { Slider } from "@/components/ui/slider";
import { parseFile } from "lib/fileParser";
import { TextFormatOptions } from "@/components/reader/type";

interface FileViewerProps {
  file: File | null;
  formatOptions?: Partial<TextFormatOptions>;
  content?: string;
  maxHeight?: string;
}

const FileViewer: React.FC<FileViewerProps> = ({
  file,
  formatOptions: initialFormatOptions,
  content: externalContent,
  maxHeight = "70vh",
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
          err instanceof Error
            ? err.message
            : "An error occurred while reading the file"
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
    textAlign: formatOptions.alignment,
    backgroundColor: formatOptions.backgroundColor,
    whiteSpace: "pre-wrap" as const,
    wordBreak: "break-word" as const,
    padding: "1rem",
    borderRadius: "0.5rem",
    // minWidth: "100%",
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box" as const,
  };

  const scrollContainerStyle = {
    overflowY: "auto" as const,
    overflowX: "hidden" as const,
    maxHeight: isFullscreen ? "calc(100vh - 8rem)" : maxHeight,
    width: "100%",
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const Controls = () => (
    <div className="flex items-center gap-2 p-2 bg-background/95 backdrop-blur border-b">
      <Select
        value={formatOptions.fontFamily}
        onValueChange={(value) =>
          setFormatOptions({ ...formatOptions, fontFamily: value })
        }
      >
        <SelectTrigger className="w-24 h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="inter">Inter</SelectItem>
          <SelectItem value="arial">Arial</SelectItem>
          <SelectItem value="times">Times</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() =>
            setFormatOptions({
              ...formatOptions,
              fontSize: Math.max(8, formatOptions.fontSize - 2),
            })
          }
        >
          <Minus className="h-5 w-5" />
        </Button>
        <span className="text-sm w-8 text-center">
          {formatOptions.fontSize}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() =>
            setFormatOptions({
              ...formatOptions,
              fontSize: Math.min(32, formatOptions.fontSize + 2),
            })
          }
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Type className="h-4 w-4" />
        <Slider
          className="w-24"
          value={[formatOptions.fontSize]}
          min={8}
          max={32}
          step={1}
          onValueChange={([value]) =>
            setFormatOptions({ ...formatOptions, fontSize: value })
          }
        />
      </div>
    </div>
  );

  if (!file) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            File Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No file selected
          </p>
        </CardContent>
      </Card>
    );
  }

  const ViewerContent = () => (
    <div style={scrollContainerStyle} className="scrollbar-custom w-full">
      {loading ? (
        <div className="flex items-center justify-center py-8 w-full">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading file content...</span>
        </div>
      ) : error ? (
        <Alert variant="destructive" className="w-full">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <pre className="w-full min-w-full" style={contentStyle}>
          {content}
        </pre>
      )}
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        <div className="sticky top-0 z-10">
          <div className="p-4 border-b flex items-center justify-between bg-background">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {file.name}
            </h2>

            <div className="flex items-center align-middle">
              <Controls />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="ml-auto"
              >
                <Minimize2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex-1 p-4 overflow-hidden w-full">
          <ViewerContent />
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {file.name}
          </div>
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
      <CardContent className="w-full">
        <ViewerContent />
      </CardContent>
    </Card>
  );
};

export default FileViewer;
