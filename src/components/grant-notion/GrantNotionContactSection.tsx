import React from "react";
import { Grant } from "@/types/grant";
interface GrantNotionContactSectionProps {
  grant: Grant;
}
const GrantNotionContactSection = ({
  grant
}: GrantNotionContactSectionProps) => {
  if (!grant.contact.name && !grant.contact.email && !grant.contact.phone && !grant.contact.organization) {
    return null;
  }
  return <div className="pt-6 border-t border-gray-200">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Kontakt</h3>
        <div className="space-y-1 ">
          {(grant.contact.name || grant.contact.organization) && <div>
              {grant.contact.organization && <span className="text-xs text-gray-600 block">{grant.contact.organization}</span>}
              {grant.contact.name && <span className="text-xs font-medium text-gray-900">{grant.contact.name}</span>}
            </div>}
          {grant.contact.email && <div>
              <a href={`mailto:${grant.contact.email}`} className="text-xs text-blue-600 hover:text-blue-800 underline">
                {grant.contact.email}
              </a>
            </div>}
          {grant.contact.phone && <div>
              <a href={`tel:${grant.contact.phone}`} className="text-xs text-blue-600 hover:text-blue-800 underline">
                {grant.contact.phone}
              </a>
            </div>}
        </div>
      </div>
    </div>;
};
export default GrantNotionContactSection;