
import React, { useState } from "react";
import { ChevronDown, ChevronRight, Save, Eye, Check, Upload, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Section {
  id: string;
  title: string;
  fields: FormField[];
  isExpanded: boolean;
  isCompleted: boolean;
}

interface FormField {
  id: string;
  label: string;
  value: string;
  type: "input" | "textarea";
  placeholder?: string;
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: string;
}

const BusinessPlanEditor = () => {
  const [sections, setSections] = useState<Section[]>([
    {
      id: "foretaget",
      title: "Företaget",
      isExpanded: true,
      isCompleted: true,
      fields: [
        { id: "org_number", label: "Organisationsnummer", value: "827773392", type: "input" },
        { id: "reg_address", label: "Registrerad adress", value: "Value", type: "input" },
        { id: "antal_anstallda", label: "Antal anställda", value: "Value", type: "input" },
        { id: "omsattning_2022", label: "Omsättning (2022, 2023)", value: "Value", type: "input" },
        { id: "omsattning_result", label: "Resultat (2022, 2023)", value: "Value", type: "input" },
        { 
          id: "beskrivning", 
          label: "Beskriv kortfattat företagets verksamhet, eventuella produkter samt hur företaget finansieras. Vilka är företagets övergripande mål på 5-10 års sikt?", 
          value: "Value", 
          type: "textarea" 
        }
      ]
    },
    {
      id: "utmaning",
      title: "Utmaning",
      isExpanded: true,
      isCompleted: true,
      fields: [
        { 
          id: "utmaning_beskrivning", 
          label: "Beskriv den utmaning i vilket och område som ni adresserar. Vilka är behoven? Vad har ni gjort för att undersöka behoven?", 
          value: "Value", 
          type: "textarea" 
        }
      ]
    },
    {
      id: "losning",
      title: "Lösning och produktidé",
      isExpanded: true,
      isCompleted: false,
      fields: [
        { 
          id: "losning_beskrivning", 
          label: "Beskriv den produkt, tjänst eller lösning som ska utvecklas efter förståelse för marknadens ryndselekt. På vilket sätt är den innovativ? Vad är nytten för användaren? Beskriv för lägre prioritet hos kunnet i din utveckling. I vilket ställe ska produktidén befinn sig vid projektets slut?", 
          value: "Value", 
          type: "textarea" 
        }
      ]
    },
    {
      id: "immaterial",
      title: "Immaterialrätt",
      isExpanded: true,
      isCompleted: false,
      fields: [
        { 
          id: "immaterial_beskrivning", 
          label: "Har det genererita im nyhetsföbandlag? Har ni skyddad andra platener ni att skydda produktiden med ett patent, designskydd eller liknande?", 
          value: "Value", 
          type: "textarea" 
        }
      ]
    },
    {
      id: "marknad",
      title: "Marknadspotential",
      isExpanded: true,
      isCompleted: false,
      fields: [
        { 
          id: "marknad_beskrivning", 
          label: "Beskriv den tänkta marknaden (nationell och internationell). Vilka potentiella kundgrupper finns? Vilka andra företag finns som konkurrerar med er produkter? Hur förhåller sig er till konkurrenende förtregg? Vad gör er lösing unik?", 
          value: "Value", 
          type: "textarea" 
        }
      ]
    },
    {
      id: "kommersiell",
      title: "Kommersialisering och nyttjörande",
      isExpanded: true,
      isCompleted: false,
      fields: [
        { 
          id: "kommersiell_beskrivning", 
          label: "Beskriv strategin för hur idén ska kommersialisera, nyttigöras och implementeras. Vilka nätvreerk och internationella samarbeten kan komma att behövas för att kommersialisaera produktidén? Har ska utvecklingstyrelsen fönga efter att eventuellt finansiering från Vinnova?", 
          value: "Value", 
          type: "textarea" 
        }
      ]
    }
  ]);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    { id: "1", name: "Ansökning_dokument.pdf", type: "pdf", size: "2.4 MB" },
    { id: "2", name: "Ansökning_dokument.pdf", type: "pdf", size: "2.4 MB" },
    { id: "3", name: "Ansökning_dokument.pdf", type: "pdf", size: "2.4 MB" },
    { id: "4", name: "Ansökning_dokument.pdf", type: "pdf", size: "2.4 MB" }
  ]);

  const [isDragOver, setIsDragOver] = useState(false);
  const [autoSaved, setAutoSaved] = useState(true);

  const completedSections = sections.filter(section => section.isCompleted).length;
  const progressPercentage = Math.round((completedSections / sections.length) * 100);

  const toggleSection = (sectionId: string) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? { ...section, isExpanded: !section.isExpanded }
        : section
    ));
  };

  const updateFieldValue = (sectionId: string, fieldId: string, value: string) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            fields: section.fields.map(field =>
              field.id === fieldId ? { ...field, value } : field
            )
          }
        : section
    ));
    setAutoSaved(false);
    setTimeout(() => setAutoSaved(true), 1000);
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
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Business plan editor</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {autoSaved ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  Auto-saved
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-gray-400" />
                  Saving...
                </>
              )}
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 px-6">
              Review
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {sections.map((section) => (
              <Card key={section.id} className="border border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-medium text-gray-900">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 block">
                        {field.label}
                      </label>
                      {field.type === "input" ? (
                        <Input
                          value={field.value}
                          onChange={(e) => updateFieldValue(section.id, field.id, e.target.value)}
                          className="bg-gray-50 border-gray-200"
                          placeholder={field.placeholder}
                        />
                      ) : (
                        <Textarea
                          value={field.value}
                          onChange={(e) => updateFieldValue(section.id, field.id, e.target.value)}
                          className="bg-gray-50 border-gray-200 min-h-[100px]"
                          placeholder={field.placeholder}
                        />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Progress Checklist */}
            <Card className="border border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium text-gray-900">Progress Checklist</CardTitle>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{completedSections} of {sections.length} completed</span>
                  <span>{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </CardHeader>
              <CardContent className="space-y-3">
                {sections.map((section) => (
                  <div key={section.id} className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSectionCompletion(section.id)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        section.isCompleted
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {section.isCompleted && (
                        <Check className="w-3 h-3" />
                      )}
                    </button>
                    <span className={`text-sm ${section.isCompleted ? "text-gray-900" : "text-gray-600"}`}>
                      {section.title}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upload Files */}
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

                <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                  Review
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPlanEditor;
