
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Card } from '@/components/ui/card';

const SavedGrants = () => {
  return (
    <div className="flex-1 bg-white">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Översikt över pågående ansökningar och redigeringar</p>
        </div>

        {/* Correctness Badges */}
        <div className="flex gap-4 mb-8">
          <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm border">
            <span className="text-sm font-medium text-gray-700">Correctness</span>
            <div className="bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              2
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm border">
            <span className="text-sm font-medium text-gray-700">Correctness</span>
            <div className="bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              3
            </div>
          </div>
        </div>

        {/* Active Applications */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Aktiva ansökningar</h2>
          
          <div className="space-y-4">
            {/* Application 1 */}
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

            {/* Application 2 */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedGrants;
