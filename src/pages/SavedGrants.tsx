
import React from 'react';
import { useSavedGrantsContext } from '@/contexts/SavedGrantsContext';
import { useNavigate } from 'react-router-dom';
import SavedGrantsHeader from '@/components/saved-grants/SavedGrantsHeader';
import SavedGrantsTabs from '@/components/saved-grants/SavedGrantsTabs';

const SavedGrants = () => {
  const {
    savedGrants,
    startApplication,
    removeFromActive,
    removeFromSaved
  } = useSavedGrantsContext();
  const navigate = useNavigate();

  // Add comprehensive debugging
  console.log('🎯 SavedGrants component render - Full state:', {
    savedApplications: savedGrants.savedApplications,
    activeApplications: savedGrants.activeApplications,
    pendingReview: savedGrants.pendingReview,
    counts: {
      saved: savedGrants.savedApplications.length,
      active: savedGrants.activeApplications.length,
      pending: savedGrants.pendingReview.length
    }
  });

  const handleEditClick = (grantId: string) => {
    console.log('✏️ Edit clicked for grant:', grantId);
    // For now, default to chat interface - could be enhanced to remember last editing context
    navigate('/chat', {
      state: {
        grantId
      }
    });
  };

  const handleDeleteActive = (grantId: string) => {
    console.log('🗑️ Deleting active application:', grantId);
    removeFromActive(grantId);
  };

  const handleDeleteSaved = (grantId: string) => {
    console.log('🗑️ Deleting saved application:', grantId);
    removeFromSaved(grantId);
  };

  const handleStartApplication = (grant: any) => {
    console.log('🚀 Starting application from saved grants page:', grant.id, grant.title);
    // This will move the grant from saved to active applications
    startApplication(grant);
    navigate('/chat', {
      state: {
        grant
      }
    });
  };

  const handleReadMore = (grant: any) => {
    console.log('📖 Read more clicked for grant:', grant.id, grant.title);
    navigate('/discover', {
      state: {
        selectedGrantId: grant.id
      }
    });
  };

  return (
    <div className="flex-1 bg-canvas-cloud">
      <div className="p-8 bg-canvas-cloud">
        <SavedGrantsHeader />
        <SavedGrantsTabs
          savedGrants={savedGrants}
          onEdit={handleEditClick}
          onDeleteActive={handleDeleteActive}
          onDeleteSaved={handleDeleteSaved}
          onReadMore={handleReadMore}
          onStartApplication={handleStartApplication}
        />
      </div>
    </div>
  );
};

export default SavedGrants;
