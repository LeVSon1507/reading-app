"use client";

import React, { useState } from "react";

const FileUploadAndAnalyze = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleAnalyzeFile = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/analyze-file", {
        method: "POST",
        body: formData,
      });

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
    <div className="max-w-lg mx-auto space-y-4">
      <h1 className="text-2xl font-bold">AI File Analyzer</h1>

      <input
        type="file"
        accept=".txt,.pdf,.doc,.docx"
        onChange={handleFileChange}
        className="block w-full border p-2"
      />

      <button
        onClick={handleAnalyzeFile}
        disabled={loading || !selectedFile}
        className={`px-4 py-2 text-white bg-blue-500 rounded ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Analyzing..." : "Analyze File"}
      </button>

      {analysisResult && (
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-bold">Analysis Result:</h2>
          <p>{analysisResult}</p>
        </div>
      )}
    </div>
  );
};

export default FileUploadAndAnalyze;
