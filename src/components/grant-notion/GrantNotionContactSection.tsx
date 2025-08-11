import React from "react";
import { GrantDetails as GrantDetailsType } from "@/types/grant";
interface GrantNotionContactSectionProps {
  grant: GrantDetailsType;
}
const GrantNotionContactSection = ({
  grant
}: GrantNotionContactSectionProps) => {
  if (!grant.contact.name && !grant.contact.email && !grant.contact.phone && !grant.contact.organization) {
    return null;
  }
  return <div className="pt-6 border-t border-gray-200">
      <div>
        <h3 className="type-secondary font-semibold text-zinc-900 mb-3">Kontakt</h3>
        <div className="space-y-1 ">
          {(grant.contact.name || grant.contact.organization) && <div>
              {grant.contact.organization && <span className="type-caption text-zinc-600 block">{grant.contact.organization}</span>}
              {grant.contact.name && <span className="type-caption font-medium text-zinc-900">{grant.contact.name}</span>}
            </div>}
          {grant.contact.email && <div>
              <a href={`mailto:${grant.contact.email}`} className="type-caption text-[#7D54F4] hover:opacity-90 underline">
                {grant.contact.email}
              </a>
            </div>}
          {grant.contact.phone && <div>
              <a href={`tel:${grant.contact.phone}`} className="type-caption text-[#7D54F4] hover:opacity-90 underline">
                {grant.contact.phone}
              </a>
            </div>}
        </div>
      </div>
    </div>;
};
export default GrantNotionContactSection;