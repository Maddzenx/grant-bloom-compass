
import React from 'react';
import { Card } from '@/components/ui/card';
import { Grant } from '@/types/grant';
import GrantApplicationCard from './GrantApplicationCard';

interface PendingReviewTabProps {
  grants: Grant[];
}

const PendingReviewTab = ({ grants }: PendingReviewTabProps) => {
  if (grants.length === 0) {
    return (
      <Card className="p-8 bg-white border border-accent-lavender shadow-sm text-center">
        <p className="type-body text-ink-secondary">Inga ansökningar under granskning.</p>
        <p className="type-secondary text-ink-secondary mt-2">Skicka in ansökningar för att se dem här.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {grants.map(grant => (
        <GrantApplicationCard
          key={grant.id}
          grant={grant}
          type="pending"
        />
      ))}
    </div>
  );
};

export default PendingReviewTab;
