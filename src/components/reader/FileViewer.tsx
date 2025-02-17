import React, { useEffect, useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { parseFile } from "lib/fileParser";
import { TextFormatOptions } from "@/components/reader/type";

interface FileViewerProps {
  file: File | null;
  formatOptions?: Partial<TextFormatOptions>;
  content?: string;
}

const FileViewer: React.FC<FileViewerProps> = ({
  file,
  formatOptions,
  content: externalContent,
}) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

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
    fontSize: `${formatOptions?.fontSize || 16}px`,
    fontFamily: formatOptions?.fontFamily || "inter",
    textAlign: formatOptions?.alignment || "left",
    backgroundColor: formatOptions?.backgroundColor || "#d2b48c",
    whiteSpace: "pre-wrap" as const,
    wordBreak: "break-word" as const,
    padding: "1rem",
    borderRadius: "0.5rem",
  };

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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          {file?.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">Loading file content...</span>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <pre style={contentStyle}>{content}</pre>
        )}
      </CardContent>
    </Card>
  );
};

export default FileViewer;
