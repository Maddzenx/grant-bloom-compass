
import React, { useState } from "react";
import { ChevronDown, ChevronRight, Save, Eye, Check, X, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Suggestion {
  id: string;
  type: "correctness" | "clarity" | "engagement" | "delivery";
  title: string;
  description: string;
  section: string;
}

interface Section {
  id: string;
  title: string;
  content: string;
  isExpanded: boolean;
}

const BusinessPlanEditor = () => {
  const [sections, setSections] = useState<Section[]>([
    {
      id: "foretaget",
      title: "Företaget",
      content: "Organisationsnummer: 887733392\n\nDiamantegatan 15\nVálue\n\nOmvetting (2022, 2023)\nVálue\n\nBeslin forfallet hensignal noddventet, eventuellt produkter samt hot finansigt finassiese. Välv är finansigen övergripande maj alt 3.19 bruh start.\nVálue",
      isExpanded: true
    },
    {
      id: "utmaning",
      title: "Utmaning",
      content: "Beskin den utmaning i vilket oth område som ni adresseier. Vilka är behoven? Vad har ni gjort för att undersöka behoven?\nVálue",
      isExpanded: false
    },
    {
      id: "losning",
      title: "Lösning och produktidé",
      content: "Beskin den produkt, tjänst eller lösving som ska utvecklas efter föherstelse för marknadens ryndselekt, På vilket sätt är den innovativ? Vad är nyehet för anvnaden? Beskin för lägre prioritiet hos kunttet i din utveckling. I vilket ställa ska produktidén befinn sig vid projektets slut?\nVálue",
      isExpanded: false
    },
    {
      id: "immaterial",
      title: "Immaterialrätt",
      content: "Har det genererita im nyhetsföbandlag? Har ni skyddad andra platener ni att skydda produktiden med ett patent, designskydd eller liknande?\nVálue",
      isExpanded: false
    },
    {
      id: "marknad",
      title: "Marknadspotential",
      content: "Beskin den tänkta marknaden (nationell och internationell). Vilka potentiella kundgrupper finns? Vilka andra företag finns som konkurrerar med er produkter? Hur förhåller sig er till konkurrenende förtregg? Vad gör er lösing unik?\nVálue",
      isExpanded: false
    },
    {
      id: "kommersiell",
      title: "Kommersialisering och nyttjögrande",
      content: "Beskin strategin för hur idén ska kommersialisera, nyttigöras och implementeras. Vilka nätvreerk och internationella samarbeten kan komma att behövas för att kommersialisaera produktidén? Har ska utvecklingstyrelsen fönga efter att eventuellt finansiering från Vinnova?\nVálue",
      isExpanded: false
    }
  ]);

  const [suggestions] = useState<Suggestion[]>([
    {
      id: "1",
      type: "correctness",
      title: "Change the word",
      description: "deeply",
      section: "Företaget"
    },
    {
      id: "2",
      type: "clarity",
      title: "Change the word",
      description: "deeply",
      section: "Utmaning"
    },
    {
      id: "3",
      type: "engagement",
      title: "Change the word",
      description: "deeply",
      section: "Lösning"
    },
    {
      id: "4",
      type: "delivery",
      title: "Change the word",
      description: "deeply",
      section: "Marknad"
    }
  ]);

  const [autoSaved, setAutoSaved] = useState(true);

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
    setAutoSaved(false);
    // Simulate auto-save
    setTimeout(() => setAutoSaved(true), 1000);
  };

  const getSuggestionsByType = (type: string) => {
    return suggestions.filter(suggestion => suggestion.type === type);
  };

  const getTabIcon = (type: string) => {
    switch (type) {
      case "correctness": return "✓";
      case "clarity": return "◐";
      case "engagement": return "♦";
      case "delivery": return "→";
      default: return "";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 pb-4 mb-6 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Business Plan Editor</h1>
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
            <Button className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Review
            </Button>
          </div>
        </div>
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

        {/* Right Sidebar - Review Suggestions */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Suggestions</h3>
            
            <Tabs defaultValue="correctness" className="w-full">
              <TabsList className="grid grid-cols-4 w-full mb-4">
                <TabsTrigger value="correctness" className="text-xs">
                  {getTabIcon("correctness")} Correctness
                </TabsTrigger>
                <TabsTrigger value="clarity" className="text-xs">
                  {getTabIcon("clarity")} Clarity
                </TabsTrigger>
                <TabsTrigger value="engagement" className="text-xs">
                  {getTabIcon("engagement")} Engagement
                </TabsTrigger>
                <TabsTrigger value="delivery" className="text-xs">
                  {getTabIcon("delivery")} Delivery
                </TabsTrigger>
              </TabsList>

              {["correctness", "clarity", "engagement", "delivery"].map((type) => (
                <TabsContent key={type} value={type} className="space-y-3">
                  {getSuggestionsByType(type).map((suggestion) => (
                    <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            {suggestion.title}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            {suggestion.description}
                          </p>
                          <Badge variant="secondary" className="text-xs mb-3">
                            {suggestion.section}
                          </Badge>
                          <div className="flex gap-2">
                            <Button size="sm" variant="default" className="h-7 px-3 text-xs">
                              Accept
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 px-3 text-xs">
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPlanEditor;
