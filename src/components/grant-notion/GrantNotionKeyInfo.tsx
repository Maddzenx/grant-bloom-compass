import React from "react";
import { Grant } from "@/types/grant";
import { formatCofinancingText } from "@/utils/grantHelpers";

interface GrantNotionKeyInfoProps {
  grant: Grant;
  isMobile?: boolean;
  section?: 'info' | 'krav';
}

const GrantNotionKeyInfo = ({
  grant,
  isMobile = false,
  section
}: GrantNotionKeyInfoProps) => {
  // Debug logging
  console.log('🔍 GrantNotionKeyInfo - Grant data:', {
    consortium_requirement: grant.consortium_requirement,
    cofinancing_required: grant.cofinancing_required,
    cofinancing_level: grant.cofinancing_level,
    fundingRules: grant.fundingRules,
    region: grant.region
  });

  // Format helpers
  const formatArray = (arr?: string[] | null) => arr && arr.length > 0 ? arr.join(", ") : null;
  const formatConsortium = (val: any) => {
    if (val === true) return 'Ja';
    if (val === false) return 'Nej';
    if (typeof val === 'string' && val.trim()) return val.trim();
    return null;
  };
  const formatFundingRules = (arr?: string[] | null) => arr && arr.length > 0 ? arr.join(", ") : null;

  // Allmän information fields
  const infoFields = [
    grant.fundingAmount ? (<li className="text-sm text-gray-700 leading-relaxed"><span className="font-bold">Bidragsbelopp:</span> {grant.fundingAmount}</li>) : null,
    grant.deadline ? (<li className="text-sm text-gray-700 leading-relaxed"><span className="font-bold">Ansökningsdeadline:</span> {grant.deadline}</li>) : null,
    grant.cofinancing_required !== undefined || grant.cofinancing_level !== undefined ? (
      <li className="text-sm text-gray-700 leading-relaxed"><span className="font-bold">Medfinansiering:</span> {formatCofinancingText(grant.cofinancing_required, grant.cofinancing_level)}</li>
    ) : null,
    // formatArray(grant.geographic_scope) ? (<li className="text-sm text-gray-700 leading-relaxed"><span className="font-bold">Typ av bidrag:</span> {formatArray(grant.geographic_scope)}</li>) : null,
    grant.region ? (<li className="text-sm text-gray-700 leading-relaxed"><span className="font-bold">Region:</span> {grant.region}</li>) : null,
  ].filter(Boolean);

  // Krav fields
  const kravFields = [
    formatArray(grant.eligible_organisations) ? (<li className="text-sm text-gray-700 leading-relaxed"><span className="font-bold">Mottagare:</span> {formatArray(grant.eligible_organisations)}</li>) : null,
    formatConsortium(grant.consortium_requirement) ? (<li className="text-sm text-gray-700 leading-relaxed"><span className="font-bold">Konsortiekrav:</span> {formatConsortium(grant.consortium_requirement)}</li>) : null,
    formatFundingRules(grant.fundingRules) ? (<li className="text-sm text-gray-700 leading-relaxed"><span className="font-bold">Finansiering:</span> {formatFundingRules(grant.fundingRules)}</li>) : null,
  ].filter(Boolean);

  return (
    <div>
      {(section === 'info' || !section) && infoFields.length > 0 && (
        <>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Allmän information</h3>
          <ul className="space-y-0 mb-4">
            {infoFields}
          </ul>
        </>
      )}
      {(section === 'krav' || !section) && kravFields.length > 0 && (
        <>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Krav</h3>
          <ul className="space-y-0">
            {kravFields}
          </ul>
        </>
      )}
    </div>
  );
};

export default GrantNotionKeyInfo;