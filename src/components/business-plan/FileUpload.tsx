import React, { useState, useRef } from "react";
import { Upload, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadedFile } from "@/types/businessPlan";
import { useToast } from "@/hooks/use-toast";
interface FileUploadProps {
  uploadedFiles: UploadedFile[];
  onRemoveFile: (fileId: string) => void;
  onFilesUploaded?: (files: UploadedFile[]) => void;
}
export const FileUpload: React.FC<FileUploadProps> = ({
  uploadedFiles,
  onRemoveFile,
  onFilesUploaded
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    toast
  } = useToast();
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/heic'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const validateFile = (file: File): boolean => {
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Filtyp stöds ej",
        description: `${file.name} har en filtyp som inte stöds. Endast PDF, JPG, PNG, BMP och HEIC tillåts.`,
        variant: "destructive"
      });
      return false;
    }
    if (file.size > maxFileSize) {
      toast({
        title: "Fil för stor",
        description: `${file.name} är för stor. Maximal filstorlek är 10MB.`,
        variant: "destructive"
      });
      return false;
    }
    return true;
  };
  const processFiles = (files: FileList) => {
    const validFiles: UploadedFile[] = [];
    Array.from(files).forEach(file => {
      if (validateFile(file)) {
        const uploadedFile: UploadedFile = {
          id: crypto.randomUUID(),
          name: file.name,
          type: file.type,
          size: formatFileSize(file.size)
        };
        validFiles.push(uploadedFile);
      }
    });
    if (validFiles.length > 0) {
      onFilesUploaded?.(validFiles);
      toast({
        title: "Filer uppladdade",
        description: `${validFiles.length} fil(er) har laddats upp framgångsrikt.`
      });
    }
  };
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
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
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  };
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  return <Card className="border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium text-gray-900">Upload files</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hidden file input */}
        <input ref={fileInputRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.bmp,.heic" onChange={handleFileChange} className="hidden" />

        {/* Upload Zone */}
        <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${isDragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`} onClick={handleBrowseClick}>
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop to upload or{" "}
            <button type="button" onClick={handleBrowseClick} className="text-blue-600 hover:underline font-medium">
              browse
            </button>
          </p>
          <p className="text-xs text-gray-500">
            PDF, JPG, PNG, BMP and HEIC file formats only. Max 10MB per file.
          </p>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Uploaded files</h4>
            <div className="space-y-2">
              {uploadedFiles.map(file => <div key={file.id} className="flex items-center gap-3 p-2 border border-gray-200 rounded">
                  <FileText className="w-4 h-4 text-red-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{file.size}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => onRemoveFile(file.id)} className="p-1 h-auto text-gray-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </Button>
                </div>)}
            </div>
          </div>}

        
      </CardContent>
    </Card>;
};