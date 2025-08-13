import React from "react";
import { GrantDetails as GrantDetailsType } from "@/types/grant";
import { formatCofinancingText } from "@/utils/grantHelpers";

interface GrantNotionKeyInfoProps {
  grant: GrantDetailsType;
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
    cofinancing_level: grant.cofinancing_level_min,
    fundingRules: grant.fundingRules,
    region: grant.region,
    regionType: typeof grant.region,
    regionExists: grant.region !== undefined && grant.region !== null,
    project_duration_months_min: grant.project_duration_months_min,
    project_duration_months_max: grant.project_duration_months_max
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

  // Format project duration
  const formatProjectDuration = (min?: number, max?: number): string | null => {
    if (min === undefined && max === undefined) return null;
    
    if (min !== undefined && max !== undefined) {
      if (min === max) {
        return `${min} månader`;
      } else {
        return `${min}-${max} månader`;
      }
    } else if (min !== undefined) {
      return `min ${min} månader`;
    } else if (max !== undefined) {
      return `max ${max} månader`;
    }
    
    return null;
  };

  // Allmän information fields
  const infoFields = [
    grant.fundingAmount ? (<li key="fundingAmount" className="type-secondary text-zinc-700 leading-relaxed"><span className="font-bold">Bidragsbelopp:</span> {grant.fundingAmount}</li>) : null,
    grant.deadline ? (<li key="deadline" className="type-secondary text-zinc-700 leading-relaxed"><span className="font-bold">Ansökningsdeadline:</span> {grant.deadline}</li>) : null,
    formatProjectDuration(grant.project_duration_months_min, grant.project_duration_months_max) ? (
      <li key="projectDuration" className="type-secondary text-zinc-700 leading-relaxed">
        <span className="font-bold">Projekttid:</span> {formatProjectDuration(grant.project_duration_months_min, grant.project_duration_months_max)}
      </li>
    ) : null,
    grant.cofinancing_required !== undefined || grant.cofinancing_level_min !== undefined || grant.cofinancing_level_max !== undefined ? (
      <li key="cofinancing" className="type-secondary text-zinc-700 leading-relaxed"><span className="font-bold">Medfinansiering:</span> {formatCofinancingText(grant.cofinancing_required, grant.cofinancing_level_min, grant.cofinancing_level_max)}</li>
    ) : null,
    // formatArray(grant.geographic_scope) ? (<li key="geographicScope" className="type-secondary text-zinc-700 leading-relaxed"><span className="font-bold">Typ av bidrag:</span> {formatArray(grant.geographic_scope)}</li>) : null,
    grant.region ? (<li key="region" className="type-secondary text-zinc-700 leading-relaxed"><span className="font-bold">Region:</span> {grant.region}</li>) : null,
  ].filter(Boolean);

  // Krav fields
  const kravFields = [
    formatArray(grant.eligible_organisations) ? (<li key="eligibleOrganisations" className="type-secondary text-zinc-700 leading-relaxed"><span className="font-bold">Mottagare:</span> {formatArray(grant.eligible_organisations)}</li>) : null,
    formatConsortium(grant.consortium_requirement) ? (<li key="consortiumRequirement" className="type-secondary text-zinc-700 leading-relaxed"><span className="font-bold">Konsortiekrav:</span> {formatConsortium(grant.consortium_requirement)}</li>) : null,
    formatFundingRules(grant.fundingRules) ? (<li key="fundingRules" className="type-secondary text-zinc-700 leading-relaxed"><span className="font-bold">Finansiering:</span> {formatFundingRules(grant.fundingRules)}</li>) : null,
  ].filter(Boolean);

  return (
    <div>
      {(section === 'info' || !section) && infoFields.length > 0 && (
        <>
          <h3 className="type-title text-zinc-900 mb-4">Allmän information</h3>
          <ul className="space-y-0 mb-4">
            {infoFields}
          </ul>
        </>
      )}
      {(section === 'krav' || !section) && kravFields.length > 0 && (
        <>
          <h3 className="type-title text-zinc-900 mb-4">Krav</h3>
          <ul className="space-y-0">
            {kravFields}
          </ul>
        </>
      )}
    </div>
  );
};

export default GrantNotionKeyInfo;