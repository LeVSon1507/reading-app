import React, { useEffect, useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FileViewerProps {
  file: File | null;
}

const FileViewer: React.FC<FileViewerProps> = ({ file }) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const readFile = async () => {
      if (!file) {
        setContent("");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const reader = new FileReader();

        reader.onload = (e) => {
          const text = e.target?.result as string;
          setContent(text);
          setLoading(false);
        };

        reader.onerror = () => {
          setError("Failed to read file");
          setLoading(false);
        };

        if (file.type.includes("text") || file.name.endsWith(".txt")) {
          reader.readAsText(file);
        } else {
          setError("Unsupported file format. Please upload a text file.");
          setLoading(false);
        }
      } catch (err) {
        console.log("🚀 ~ readFile ~ err:", err);
        setError("An error occurred while reading the file");
        setLoading(false);
      }
    };

    readFile();
  }, [file]);

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
          <pre className="whitespace-pre-wrap break-words bg-muted p-4 rounded-lg text-sm">
            {content}
          </pre>
        )}
      </CardContent>
    </Card>
  );
};

export default FileViewer;
