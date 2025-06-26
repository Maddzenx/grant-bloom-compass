import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useSavedGrantsContext } from '@/contexts/SavedGrantsContext';
import { useNavigate } from 'react-router-dom';
const SavedGrants = () => {
  const {
    savedGrants,
    startApplication,
    submitForReview,
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
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('sv-SE', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  return <div className="flex-1 bg-canvas-cloud">
      <div className="p-8 bg-canvas-cloud">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-bold text-ink-obsidian mb-2 text-2xl">Dashboard</h1>
        </div>

        {/* Enhanced Tabs */}
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

          {/* Active Applications Tab */}
          <TabsContent value="active" className="space-y-4">
            {savedGrants.activeApplications.length === 0 ? <Card className="p-8 bg-white border border-accent-lavender shadow-sm text-center">
                <p className="text-ink-secondary">Inga aktiva ansökningar ännu.</p>
                <p className="text-sm text-ink-secondary mt-2">Börja ansöka om bidrag för att se dem här.</p>
              </Card> : savedGrants.activeApplications.map(grant => {
            console.log('🎯 Rendering active grant:', grant.id, grant.title);
            return <Card key={grant.id} className="p-6 bg-white border border-accent-lavender shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-ink-obsidian mb-1">{grant.title}</h3>
                        <p className="text-sm text-ink-secondary mb-1">Senaste ändring: Uppdaterade "Problem" avsnitt</p>
                        <p className="text-xs text-ink-secondary">Senast redigerad {formatDate(new Date())}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="default" onClick={() => handleEditClick(grant.id)} className="bg-accent-lime hover:bg-[#D7CFFC] text-ink-obsidian px-6 bg-[#cec5f9]">
                          Redigera
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon" className="border-[FFFFFF]-300 hover:[#F0F1F3] bg-[\"#F0F1F3] bg-white">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Ta bort ansökan</AlertDialogTitle>
                              <AlertDialogDescription>
                                Är du säker på att du vill ta bort denna aktiva ansökan? Denna åtgärd kan inte ångras.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Avbryt</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteActive(grant.id)} className="bg-red-600 hover:bg-red-700">
                                Ta bort
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </Card>;
          })}
          </TabsContent>

          {/* Pending Review Tab */}
          <TabsContent value="pending" className="space-y-4">
            {savedGrants.pendingReview.length === 0 ? <Card className="p-8 bg-white border border-accent-lavender shadow-sm text-center">
                <p className="text-ink-secondary">Inga ansökningar under granskning.</p>
                <p className="text-sm text-ink-secondary mt-2">Skicka in ansökningar för att se dem här.</p>
              </Card> : savedGrants.pendingReview.map(grant => <Card key={grant.id} className="p-6 bg-white border border-accent-lavender shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-ink-obsidian mb-1">{grant.title}</h3>
                      <p className="text-xs text-ink-secondary">Skickad {formatDate(new Date())}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="border-accent-lavender">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>)}
          </TabsContent>

          {/* Saved Applications Tab */}
          <TabsContent value="saved" className="space-y-4">
            {savedGrants.savedApplications.length === 0 ? <Card className="p-8 bg-white border border-accent-lavender shadow-sm text-center">
                <p className="text-ink-secondary">Inga sparade ansökningar.</p>
                <p className="text-sm text-ink-secondary mt-2">Spara bidrag från upptäckssidan för att se dem här.</p>
              </Card> : savedGrants.savedApplications.map(grant => <Card key={grant.id} className="p-6 bg-white border border-accent-lavender shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-ink-obsidian mb-1">{grant.title}</h3>
                      <p className="text-xs text-ink-secondary">Sparad {formatDate(new Date())}</p>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="px-4 border-accent-lavender" onClick={() => handleReadMore(grant)}>
                        Läs mer
                      </Button>
                      <Button variant="default" className="bg-accent-lime hover:bg-accent-lime/90 text-ink-obsidian px-6" onClick={() => handleStartApplication(grant)}>
                        Börja ansöka
                      </Button>
                      <Button variant="outline" size="icon" className="border-accent-lavender">
                        <Download className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon" className="border-red-300 hover:bg-red-50">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Ta bort sparad ansökan</AlertDialogTitle>
                            <AlertDialogDescription>
                              Är du säker på att du vill ta bort denna sparade ansökan? Denna åtgärd kan inte ångras.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Avbryt</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteSaved(grant.id)} className="bg-red-600 hover:bg-red-700">
                              Ta bort
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </Card>)}
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};
export default SavedGrants;