
import React, { useState } from "react";
import { ChevronDown, ChevronRight, Upload, FileText, Image, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

interface Section {
  id: string;
  title: string;
  content: string;
  isExpanded: boolean;
  isCompleted: boolean;
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: string;
}

const ProgressChecklist = () => {
  const [sections, setSections] = useState<Section[]>([
    {
      id: "foretaget",
      title: "Företaget",
      content: "Company information and details...",
      isExpanded: true,
      isCompleted: true
    },
    {
      id: "utmaning",
      title: "Utmaning",
      content: "Challenge description...",
      isExpanded: false,
      isCompleted: true
    },
    {
      id: "losning",
      title: "Lösning och produktidé",
      content: "Solution and product idea...",
      isExpanded: false,
      isCompleted: false
    },
    {
      id: "immaterial",
      title: "Immaterialrätt",
      content: "Intellectual property information...",
      isExpanded: false,
      isCompleted: false
    },
    {
      id: "marknad",
      title: "Marknadspotential",
      content: "Market potential analysis...",
      isExpanded: false,
      isCompleted: false
    },
    {
      id: "kommersiell",
      title: "Kommersialisering och nyttjögrande",
      content: "Commercialization strategy...",
      isExpanded: false,
      isCompleted: false
    }
  ]);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: "1",
      name: "Ansökning_dokument.pdf",
      type: "pdf",
      size: "2.4 MB"
    },
    {
      id: "2",
      name: "Ansökning_dokument.pdf",
      type: "pdf",
      size: "2.4 MB"
    },
    {
      id: "3",
      name: "Ansökning_dokument.pdf",
      type: "pdf",
      size: "2.4 MB"
    },
    {
      id: "4",
      name: "Ansökning_dokument.pdf",
      type: "pdf",
      size: "2.4 MB"
    }
  ]);

  const [isDragOver, setIsDragOver] = useState(false);

  const completedSections = sections.filter(section => section.isCompleted).length;
  const progressPercentage = Math.round((completedSections / sections.length) * 100);

  const toggleSection = (sectionId: string) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? { ...section, isExpanded: !section.isExpanded }
        : section
    ));
  };

  const updateSectionContent = (sectionId: string, content: string) => {
    setSections(sections.map(section =>
      section.id === sectionId ? { ...section, content } : section
    ));
  };

  const toggleSectionCompletion = (sectionId: string) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? { ...section, isCompleted: !section.isCompleted }
        : section
    ));
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(uploadedFiles.filter(file => file.id !== fileId));
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-6 h-6 text-red-500" />;
      case "png":
      case "jpg":
      case "jpeg":
        return <Image className="w-6 h-6 text-blue-500" />;
      default:
        return <FileText className="w-6 h-6 text-gray-500" />;
    }
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
    // Handle file drop logic here
    console.log("Files dropped");
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Progress & Upload</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Business Plan Form */}
        <div className="lg:col-span-2 space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                {section.isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
              </button>
              
              {section.isExpanded && (
                <div className="px-4 pb-4">
                  <Textarea
                    value={section.content}
                    onChange={(e) => updateSectionContent(section.id, e.target.value)}
                    className="min-h-[200px] resize-none border-0 focus:ring-0 p-0"
                    placeholder={`Describe your ${section.title.toLowerCase()}...`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Sidebar - Progress & Upload */}
        <div className="space-y-6">
          {/* Progress Checklist */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Checklist</h3>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {completedSections} of {sections.length} completed
                </span>
                <span className="text-sm font-medium text-gray-700">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            <div className="space-y-3">
              {sections.map((section) => (
                <div key={section.id} className="flex items-center gap-3">
                  <button
                    onClick={() => toggleSectionCompletion(section.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      section.isCompleted
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {section.isCompleted && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  <span className={`text-sm ${section.isCompleted ? "text-gray-900" : "text-gray-600"}`}>
                    {section.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload files</h3>
            
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
                PDF, JPG, PNG, and BMP file formats only
              </p>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Uploaded files</h4>
                <div className="space-y-3">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{file.size}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="p-1 h-auto text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Review Button */}
          <Button className="w-full" size="lg">
            Review
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProgressChecklist;
