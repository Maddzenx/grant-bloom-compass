
import React from 'react';
import { Card } from '@/components/ui/card';
import { Grant } from '@/types/grant';
import GrantApplicationCard from './GrantApplicationCard';

interface ActiveApplicationsTabProps {
  grants: Grant[];
  onEdit: (grantId: string) => void;
  onDelete: (grantId: string) => void;
}

const ActiveApplicationsTab = ({ grants, onEdit, onDelete }: ActiveApplicationsTabProps) => {
  console.log('🎯 SavedGrants component render - Active applications:', grants.length);

  if (grants.length === 0) {
    return (
      <Card className="p-8 bg-white border border-accent-lavender shadow-sm text-center">
        <p className="type-body text-ink-secondary">Inga aktiva ansökningar ännu.</p>
        <p className="type-secondary text-ink-secondary mt-2">Börja ansöka om bidrag för att se dem här.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {grants.map(grant => {
        console.log('🎯 Rendering active grant:', grant.id, grant.title);
        return (
          <GrantApplicationCard
            key={grant.id}
            grant={grant}
            type="active"
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
};

export default ActiveApplicationsTab;
