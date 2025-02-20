"use client";

import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button"; // Assuming you have a UI component library
import { useState } from "react";

export default function CombineImagePage() {
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function combineImagesToPdf(files: File[]) {
    try {
      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
        try {
          const imageBytes = await file.arrayBuffer();
          let image;

          if (file.type.startsWith("image/png")) {
            image = await pdfDoc.embedPng(imageBytes);
          } else if (
            file.type.startsWith("image/jpeg") ||
            file.type.startsWith("image/jpg")
          ) {
            image = await pdfDoc.embedJpg(imageBytes);
          } else {
            console.error(`Unsupported image type: ${file.type}`);
            continue; // Skip to the next file
          }

          const page = pdfDoc.addPage();
          const { width, height } = page.getSize();

          const imageAspectRatio = image.width / image.height;
          const pageAspectRatio = width / height;

          let scaledWidth, scaledHeight;
          if (imageAspectRatio >= pageAspectRatio) {
            scaledWidth = width;
            scaledHeight = width / imageAspectRatio;
          } else {
            scaledHeight = height;
            scaledWidth = height * imageAspectRatio;
          }

          const xOffset = (width - scaledWidth) / 2;
          const yOffset = (height - scaledHeight) / 2;

          page.drawImage(image, {
            x: xOffset,
            y: yOffset,
            width: scaledWidth,
            height: scaledHeight,
          });
        } catch (innerError) {
          console.error(`Error processing image ${file.name}:`, innerError);
          setErrorMessage(`Error processing ${file.name}: ${innerError}`);
        }
      }

      const bytes = await pdfDoc.save();
      setPdfBytes(bytes);
      setErrorMessage(null); // Clear any previous errors
    } catch (error) {
      console.error("Error creating PDF:", error);
      setErrorMessage(`Error creating PDF: ${error}`);
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileList = Array.from(files);
      combineImagesToPdf(fileList);
    }
  };

  const handleDownload = () => {
    if (pdfBytes) {
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "output.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
      />
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}{" "}
      {/* Display error message */}
      {pdfBytes && <Button onClick={handleDownload}>Download PDF</Button>}
    </div>
  );
}
