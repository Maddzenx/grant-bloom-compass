
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

  // Check if we have any content to show
  const hasImportantDates = grant.importantDates.length > 0;
  const hasContactInfo = grant.contact.name || grant.contact.email || grant.contact.phone || grant.contact.organization;

  // If no content to show, return null
  if (!hasImportantDates && !hasContactInfo) {
    return null;
  }

  return (
    <div className={spacingClass}>
      {hasImportantDates && (
        <ImportantDatesSection 
          importantDates={grant.importantDates} 
          isMobile={isMobile} 
        />
      )}
      {hasContactInfo && (
        <ContactSection 
          contact={grant.contact} 
          isMobile={isMobile} 
        />
      )}
    </div>
  );
};

export default GrantSidebar;
