
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSavedGrantsContext } from '@/contexts/SavedGrantsContext';
import { useNavigate } from 'react-router-dom';

const SavedGrants = () => {
  const { savedGrants, startApplication, submitForReview } = useSavedGrantsContext();
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
    navigate('/editor', { state: { grantId } });
  };

  const handleStartApplication = (grant: any) => {
    console.log('🚀 Starting application from saved grants page:', grant.id, grant.title);
    // This will move the grant from saved to active applications
    startApplication(grant);
    navigate('/business-plan-editor', { state: { grant } });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('sv-SE', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex-1 bg-[#f8f4ec]">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-bold text-gray-900 mb-2 text-2xl">Dashboard</h1>
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 rounded-full p-1 mb-8 h-auto">
            <TabsTrigger value="active" className="rounded-full px-6 py-3 text-sm font-medium transition-all data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900">
              Aktiva ansökningar ({savedGrants.activeApplications.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="rounded-full px-6 py-3 text-sm font-medium transition-all data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900">
              Väntande granskning ({savedGrants.pendingReview.length})
            </TabsTrigger>
            <TabsTrigger value="saved" className="rounded-full px-6 py-3 text-sm font-medium transition-all data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900">
              Sparade ansökningar ({savedGrants.savedApplications.length})
            </TabsTrigger>
          </TabsList>

          {/* Active Applications Tab */}
          <TabsContent value="active" className="space-y-4">
            {(() => {
              console.log('🎯 Rendering active applications tab, count:', savedGrants.activeApplications.length);
              console.log('📋 Active applications data:', savedGrants.activeApplications);
              return null;
            })()}
            {savedGrants.activeApplications.length === 0 ? (
              <Card className="p-8 bg-white border border-gray-200 shadow-sm text-center">
                <p className="text-gray-500">Inga aktiva ansökningar ännu.</p>
                <p className="text-sm text-gray-400 mt-2">Börja ansöka om bidrag för att se dem här.</p>
              </Card>
            ) : (
              savedGrants.activeApplications.map((grant) => {
                console.log('🎯 Rendering active grant:', grant.id, grant.title);
                return (
                  <Card key={grant.id} className="p-6 bg-white border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{grant.title}</h3>
                        <p className="text-sm text-gray-600 mb-1">Senaste ändring: Uppdaterade "Problem" avsnitt</p>
                        <p className="text-xs text-gray-500">Senast redigerad {formatDate(new Date())}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="default" 
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                          onClick={() => handleEditClick(grant.id)}
                        >
                          Redigera
                        </Button>
                        <Button variant="outline" size="icon" className="border-gray-300">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* Pending Review Tab */}
          <TabsContent value="pending" className="space-y-4">
            {savedGrants.pendingReview.length === 0 ? (
              <Card className="p-8 bg-white border border-gray-200 shadow-sm text-center">
                <p className="text-gray-500">Inga ansökningar under granskning.</p>
                <p className="text-sm text-gray-400 mt-2">Skicka in ansökningar för att se dem här.</p>
              </Card>
            ) : (
              savedGrants.pendingReview.map((grant) => (
                <Card key={grant.id} className="p-6 bg-white border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{grant.title}</h3>
                      <p className="text-xs text-gray-500">Skickad {formatDate(new Date())}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="border-gray-300">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Saved Applications Tab */}
          <TabsContent value="saved" className="space-y-4">
            {savedGrants.savedApplications.length === 0 ? (
              <Card className="p-8 bg-white border border-gray-200 shadow-sm text-center">
                <p className="text-gray-500">Inga sparade ansökningar.</p>
                <p className="text-sm text-gray-400 mt-2">Spara bidrag från upptäckssidan för att se dem här.</p>
              </Card>
            ) : (
              savedGrants.savedApplications.map((grant) => (
                <Card key={grant.id} className="p-6 bg-white border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{grant.title}</h3>
                      <p className="text-xs text-gray-500">Sparad {formatDate(new Date())}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="default" 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                        onClick={() => handleStartApplication(grant)}
                      >
                        Börja ansöka
                      </Button>
                      <Button variant="outline" size="icon" className="border-gray-300">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SavedGrants;
