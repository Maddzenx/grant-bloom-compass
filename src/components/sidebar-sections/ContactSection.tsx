
import React from "react";
import { Mail, Phone, Building, User } from "lucide-react";
import { Grant } from "@/types/grant";

interface ContactSectionProps {
  contact: Grant['contact'];
  isMobile?: boolean;
}

const ContactSection = ({ contact, isMobile = false }: ContactSectionProps) => {
  const paddingClass = isMobile ? 'p-3' : 'p-4';
  const textClass = isMobile ? 'text-xs' : 'text-xs';
  const titleClass = isMobile ? 'text-sm' : 'text-sm';

  // Check if we have any contact information to display
  const hasContactInfo = contact.name || contact.email || contact.phone || contact.organization;
  
  if (!hasContactInfo) {
    return null;
  }

  return (
    <section className={`bg-gray-50 ${paddingClass} rounded-lg border border-gray-200`}>
      <h3 className={`font-bold text-gray-900 mb-2 md:mb-3 ${titleClass}`}>Kontakt</h3>
      <div className="space-y-2">
        {contact.name && (
          <div className="flex items-center gap-2">
            <User className="w-3 h-3 text-gray-600 flex-shrink-0" />
            <span className={`font-medium text-gray-900 ${textClass} truncate`}>{contact.name}</span>
          </div>
        )}
        {contact.organization && (
          <div className="flex items-center gap-2">
            <Building className="w-3 h-3 text-gray-600 flex-shrink-0" />
            <span className={`text-gray-700 ${textClass} truncate`}>{contact.organization}</span>
          </div>
        )}
        {contact.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-3 h-3 text-gray-600 flex-shrink-0" />
            <a 
              href={`mailto:${contact.email}`}
              className={`text-blue-600 underline hover:text-blue-800 ${textClass} break-all truncate`}
            >
              {contact.email}
            </a>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-3 h-3 text-gray-600 flex-shrink-0" />
            <a 
              href={`tel:${contact.phone}`}
              className={`text-blue-600 underline hover:text-blue-800 ${textClass}`}
            >
              {contact.phone}
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
