
import React from "react";
import { Grant } from "@/types/grant";
import ImportantDatesSection from "./sidebar-sections/ImportantDatesSection";
import ContactSection from "./sidebar-sections/ContactSection";

interface GrantSidebarProps {
  grant: Grant;
  isMobile?: boolean;
}

const GrantSidebar = ({ grant, isMobile = false }: GrantSidebarProps) => {
  const spacingClass = isMobile ? 'space-y-4' : 'space-y-6';

  return (
    <div className={spacingClass}>
      <ImportantDatesSection 
        importantDates={grant.importantDates} 
        isMobile={isMobile} 
      />
      <ContactSection 
        contact={grant.contact} 
        isMobile={isMobile} 
      />
    </div>
  );
};

export default GrantSidebar;
