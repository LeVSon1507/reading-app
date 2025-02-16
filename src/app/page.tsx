"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

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
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setAnalysisResult(null); // Reset kết quả phân tích khi chọn file mới
  };

  const handleAnalyzeFile = async () => {
    if (!selectedFile) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/aim-llm", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze file");
      }

      const data = await response.json();

      if (data.success) {
        setAnalysisResult(data.analysis);
      } else {
        alert("Failed to analyze file: " + data.error);
      }
    } catch (error) {
      console.error("Error analyzing file:", error);
      alert("An error occurred while analyzing the file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <header className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold">AI Document Reader</h1>
        <p className="text-sm mt-2">
          Upload your file and let AI analyze it for you!
        </p>
      </header>

      {/* File Upload Section */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Upload Your Document</h2>
        <FileUpload
          onFileSelect={handleFileSelect}
          acceptedFileTypes={[".txt", ".pdf", ".doc", ".docx"]}
        />
      </section>

      {/* Analyze Button */}
      {selectedFile && (
        <section className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Selected File:</h3>
            <p>{selectedFile.name}</p>
          </div>
          <button
            onClick={handleAnalyzeFile}
            disabled={loading}
            className={`px-4 py-2 bg-blue-500 text-white rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Analyzing..." : "Analyze File"}
          </button>
        </section>
      )}

      {/* Analysis Result */}
      {analysisResult && (
        <section className="bg-gray-100 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Analysis Result</h2>
          <p>{analysisResult}</p>
        </section>
      )}

      {/* Advanced Controls */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Advanced Controls</h2>
        <Controls
          fontSize={16}
          setFontSize={() => {}}
          alignment="left"
          setAlignment={() => {}}
          fontFamily="inter"
          setFontFamily={() => {}}
          backgroundColor="#ffffff"
          setBackgroundColor={() => {}}
        />
      </section>
    </div>
  );
}
