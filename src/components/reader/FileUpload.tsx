import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "lib/utils";
import Image from "next/image";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: string[];
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  // acceptedFileTypes = [".txt", ".pdf", ".doc", ".docx"],
  acceptedFileTypes = [".txt"],
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce(
      (acc, type) => ({
        ...acc,
        [type]: [],
      }),
      {}
    ),
    multiple: false,
  });

  return (
    <Card className="w-full">
      <CardContent>
        <div
          {...getRootProps()}
          className={cn(
            "mt-6 border-2 border-dashed rounded-lg p-8 transition-colors duration-200 ease-in-out text-center cursor-pointer",
            {
              "border-primary bg-primary/10": isDragActive,
              "border-muted hover:border-primary": !isDragActive,
            }
          )}
        >
          <input {...getInputProps()} />
          {/* <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" /> */}
          <Image
            src="/9.svg"
            alt="Reading Icon"
            width={300}
            height={300}
            className="mx-auto mb-4 text-muted-foreground"
          />
          {isDragActive ? (
            <p className="text-lg">Drop your file here...</p>
          ) : (
            <div className="space-y-2">
              <p className="text-lg">Drop your file here or</p>
              <Button variant="secondary" size="sm">
                <div className="flex justify-center items-center align-middle">
                  <p className="mr-2">Browse Files</p>
                </div>
              </Button>
              <p className="text-sm text-muted-foreground">
                Supported formats: {acceptedFileTypes.join(", ")}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
