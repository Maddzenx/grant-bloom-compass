
import React from "react";
import { Grant } from "@/types/grant";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Info } from "lucide-react";

interface GrantAdditionalInfoSectionProps {
  grant: Grant;
  isMobile?: boolean;
}

const GrantAdditionalInfoSection = ({ grant, isMobile = false }: GrantAdditionalInfoSectionProps) => {
  const titleClass = isMobile ? 'text-lg' : 'text-xl';
  const textClass = isMobile ? 'text-sm' : 'text-sm';

  // Only render if we have additional information
  if (!grant.qualifications) return null;

  return (
    <Accordion type="single" collapsible className="bg-white rounded-lg border">
      <AccordionItem value="additional-info">
        <AccordionTrigger className="px-4 hover:no-underline">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-gray-600" />
            <span className={`font-semibold text-gray-900 ${titleClass}`}>
              Ytterligare information
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Kvalifikationer</h4>
              <p className={`text-gray-700 ${textClass}`}>{grant.qualifications}</p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default GrantAdditionalInfoSection;
