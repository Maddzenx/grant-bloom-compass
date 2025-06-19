
import React, { useState } from "react";
import { Upload, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadedFile } from "@/types/businessPlan";

interface FileUploadProps {
  uploadedFiles: UploadedFile[];
  onRemoveFile: (fileId: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ uploadedFiles, onRemoveFile }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    console.log("Files dropped");
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium text-gray-900">Upload files</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop to upload or{" "}
            <button className="text-blue-600 hover:underline font-medium">browse</button>
          </p>
          <p className="text-xs text-gray-500">
            PDF, JPG, PNG, BMP and HEIC file formats only.
          </p>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Uploaded files</h4>
            <div className="space-y-2">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-2 border border-gray-200 rounded">
                  <FileText className="w-4 h-4 text-red-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{file.name}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveFile(file.id)}
                    className="p-1 h-auto text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
          Review
        </Button>
      </CardContent>
    </Card>
  );
};
