
import React from 'react';
import { Card } from '@/components/ui/card';
import { Grant } from '@/types/grant';
import GrantApplicationCard from './GrantApplicationCard';

interface SavedApplicationsTabProps {
  grants: Grant[];
  onReadMore: (grant: Grant) => void;
  onStartApplication: (grant: Grant) => void;
  onDelete: (grantId: string) => void;
}

const SavedApplicationsTab = ({ grants, onReadMore, onStartApplication, onDelete }: SavedApplicationsTabProps) => {
  if (grants.length === 0) {
    return (
      <Card className="p-8 bg-white border border-accent-lavender shadow-sm text-center">
        <p className="text-ink-secondary">Inga sparade ansökningar.</p>
        <p className="text-sm text-ink-secondary mt-2">Spara bidrag från upptäckssidan för att se dem här.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {grants.map(grant => (
        <GrantApplicationCard
          key={grant.id}
          grant={grant}
          type="saved"
          onReadMore={onReadMore}
          onStartApplication={onStartApplication}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default SavedApplicationsTab;
