"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AnalyzePage() {
  const searchParams = useSearchParams();
  const fileData = searchParams.get("fileData");
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const analyzeFile = async () => {
      if (!fileData) return;

      try {
        const parsedFileData = JSON.parse(fileData);

        const file = new File([parsedFileData.content], parsedFileData.name, {
          type: parsedFileData.type,
        });

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/aim-llm", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          setAnalysisResult(data.analysis);
        } else {
          console.error("Error analyzing file:", data.error);
          setAnalysisResult("Failed to analyze the file.");
        }
      } catch (error) {
        if (error.status === 429) {
          alert("The server is busy. Please try again in a few seconds.");
        }
        console.error("Error:", error);
        setAnalysisResult("An error occurred while analyzing the file.");
      } finally {
        setLoading(false);
      }
    };

    analyzeFile();
  }, [fileData]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold">Analyze File</h1>
      </header>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Analysis Result</h2>
        {loading ? (
          <p>Loading analysis...</p>
        ) : analysisResult ? (
          <p>{analysisResult}</p>
        ) : (
          <p>No analysis result available.</p>
        )}
      </section>
    </div>
  );
}
