
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grant } from '@/types/grant';
import ActiveApplicationsTab from './ActiveApplicationsTab';
import PendingReviewTab from './PendingReviewTab';
import SavedApplicationsTab from './SavedApplicationsTab';

interface SavedGrantsTabsProps {
  savedGrants: {
    savedApplications: Grant[];
    activeApplications: Grant[];
    pendingReview: Grant[];
  };
  onEdit: (grantId: string) => void;
  onDeleteActive: (grantId: string) => void;
  onDeleteSaved: (grantId: string) => void;
  onReadMore: (grant: Grant) => void;
  onStartApplication: (grant: Grant) => void;
}

const SavedGrantsTabs = ({
  savedGrants,
  onEdit,
  onDeleteActive,
  onDeleteSaved,
  onReadMore,
  onStartApplication
}: SavedGrantsTabsProps) => {
  return (
    <Tabs defaultValue="active" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-white border border-accent-lavender rounded-full p-1 mb-8 h-auto">
        <TabsTrigger value="active" className="rounded-full px-6 py-3 text-sm font-medium transition-all data-[state=active]:bg-ink-obsidian data-[state=active]:text-white data-[state=inactive]:text-ink-secondary data-[state=inactive]:hover:text-ink-obsidian">
          Aktiva ansökningar ({savedGrants.activeApplications.length})
        </TabsTrigger>
        <TabsTrigger value="pending" className="rounded-full px-6 py-3 text-sm font-medium transition-all data-[state=active]:bg-ink-obsidian data-[state=active]:text-white data-[state=inactive]:text-ink-secondary data-[state=inactive]:hover:text-ink-obsidian">
          Väntande granskning ({savedGrants.pendingReview.length})
        </TabsTrigger>
        <TabsTrigger value="saved" className="rounded-full px-6 py-3 text-sm font-medium transition-all data-[state=active]:bg-ink-obsidian data-[state=active]:text-white data-[state=inactive]:text-ink-secondary data-[state=inactive]:hover:text-ink-obsidian">
          Sparade ansökningar ({savedGrants.savedApplications.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="active" className="space-y-4">
        <ActiveApplicationsTab
          grants={savedGrants.activeApplications}
          onEdit={onEdit}
          onDelete={onDeleteActive}
        />
      </TabsContent>

      <TabsContent value="pending" className="space-y-4">
        <PendingReviewTab grants={savedGrants.pendingReview} />
      </TabsContent>

      <TabsContent value="saved" className="space-y-4">
        <SavedApplicationsTab
          grants={savedGrants.savedApplications}
          onReadMore={onReadMore}
          onStartApplication={onStartApplication}
          onDelete={onDeleteSaved}
        />
      </TabsContent>
    </Tabs>
  );
};

export default SavedGrantsTabs;
