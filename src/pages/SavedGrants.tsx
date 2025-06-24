import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
const SavedGrants = () => {
  // Mock data for different tab counts
  const activeApplicationsCount = 2;
  const pendingReviewCount = 3;
  const savedApplicationsCount = 5;
  return <div className="flex-1 bg-[#f8f4ec]">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-bold text-gray-900 mb-2 text-2xl">Dashboard</h1>
          
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 rounded-full p-1 mb-8 h-auto">
            <TabsTrigger value="active" className="rounded-full px-6 py-3 text-sm font-medium transition-all data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900">
              Aktiva ansökningar ({activeApplicationsCount})
            </TabsTrigger>
            <TabsTrigger value="pending" className="rounded-full px-6 py-3 text-sm font-medium transition-all data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900">
              Väntande granskning ({pendingReviewCount})
            </TabsTrigger>
            <TabsTrigger value="saved" className="rounded-full px-6 py-3 text-sm font-medium transition-all data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900">
              Sparade ansökningar ({savedApplicationsCount})
            </TabsTrigger>
          </TabsList>

          {/* Active Applications Tab */}
          <TabsContent value="active" className="space-y-4">
            <Card className="p-6 bg-white border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Titel Utlysning</h3>
                  <p className="text-sm text-gray-600 mb-1">Senaste ändring: Uppdaterade "Problem" avsnitt</p>
                  <p className="text-xs text-gray-500">Senast redigerad 15 jan 14:30</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                    Redigera
                  </Button>
                  <Button variant="outline" size="icon" className="border-gray-300">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Titel Utlysning 2</h3>
                  <p className="text-sm text-gray-600 mb-1">Senaste ändring: Uppdaterade "Problem" avsnitt</p>
                  <p className="text-xs text-gray-500">Senast redigerad 14 jan 16:45</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                    Redigera
                  </Button>
                  <Button variant="outline" size="icon" className="border-gray-300">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Pending Review Tab */}
          <TabsContent value="pending" className="space-y-4">
            <Card className="p-6 bg-white border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Innovation Grant Application</h3>
                  
                  <p className="text-xs text-gray-500">Skickad 10 jan 09:15</p>
                </div>
                <div className="flex gap-2">
                  
                  <Button variant="outline" size="icon" className="border-gray-300">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Sustainability Project</h3>
                  
                  <p className="text-xs text-gray-500">Skickad 8 jan 15:22</p>
                </div>
                <div className="flex gap-2">
                  
                  <Button variant="outline" size="icon" className="border-gray-300">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Research Initiative</h3>
                  
                  <p className="text-xs text-gray-500">Skickad 5 jan 11:30</p>
                </div>
                <div className="flex gap-2">
                  
                  <Button variant="outline" size="icon" className="border-gray-300">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Saved Applications Tab */}
          <TabsContent value="saved" className="space-y-4">
            <Card className="p-6 bg-white border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Digital Transformation Grant</h3>
                  
                  <p className="text-xs text-gray-500">Sparad 20 jan 10:00</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                    Börja ansöka
                  </Button>
                  <Button variant="outline" size="icon" className="border-gray-300">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Green Energy Initiative</h3>
                  
                  <p className="text-xs text-gray-500">Sparad 18 jan 14:30</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                    Börja ansöka
                  </Button>
                  <Button variant="outline" size="icon" className="border-gray-300">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">AI Development Fund</h3>
                  
                  <p className="text-xs text-gray-500">Sparad 16 jan 09:45</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                    Börja ansöka
                  </Button>
                  <Button variant="outline" size="icon" className="border-gray-300">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            

            
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};
export default SavedGrants;