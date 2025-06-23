import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ApplicationDraft } from '@/hooks/useChatAgent';
import { Grant } from '@/types/grant';
interface BusinessPlanEditorProps {}
const BusinessPlanEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    draft,
    grant
  } = location.state as {
    draft: ApplicationDraft;
    grant: Grant;
  } || {};
  if (!draft || !grant) {
    navigate('/chat');
    return null;
  }
  return <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/chat')} className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Förhandsgranska</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
              Review
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Auto-saved
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl">
            {/* Företaget Section */}
            <div className="mb-8">
              
              
              <div>
                
                
              </div>
            </div>

            {/* Utmaning Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Utmaning</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beskriv den utmaning i ditt och omvärld som ni adresserar. Vilka är behoven? Vad har ni gjort för att undersöka behoven?
                </label>
                <div className="bg-gray-100 rounded px-3 py-2 text-sm text-gray-600 min-h-[100px]">
                  {draft.sections.problemformulering || 'Value'}
                </div>
              </div>
            </div>

            {/* Lösning och produktidé Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Lösning och produktidé</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beskriv den produkt, tjänst eller lösning som ska utvecklas eller förbättras för marknaden i projektet. På vilket sätt är den innovativ? Vad är nytten för kunden? Beskriv hur långt projektet har kommit i sin utveckling. I vilket skede ska produkten befinna sig vid projektets slut?
                </label>
                <div className="bg-gray-100 rounded px-3 py-2 text-sm text-gray-600 min-h-[100px]">
                  {draft.sections.mal_och_resultat || 'Value'}
                </div>
              </div>
            </div>

            {/* Immaterialrätt Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Immaterialrätt</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Har det genomförts en nyhetsgranskning? Har ni skyddat eller planerar ni att skydda produkten med ett patent, designskydd eller förvaradt?
                </label>
                <div className="bg-gray-100 rounded px-3 py-2 text-sm text-gray-600 min-h-[100px]">
                  Value
                </div>
              </div>
            </div>

            {/* Marknadspotential Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Marknadspotential</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beskriv den tänkta marknaden (nationell och internationell). Vilka potentiella kundgrupper finns? Vilka andra företag finns som konkurrenter med er produktidé? Har företaget oss er så till framtidsvarande förening? Vad gör er lösning unik?
                </label>
                <div className="bg-gray-100 rounded px-3 py-2 text-sm text-gray-600 min-h-[100px]">
                  {draft.sections.malgrupp || 'Value'}
                </div>
              </div>
            </div>

            {/* Kommersialisering och nyttiggörande Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Kommersialisering och nyttiggörande</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beskriv strategin för hur idén ska kommersialiseras, nyttiggöras och implementeras. Vilka nationella och internationella samarbeten kan komma att behövas för att kommersialisera produkten? Har det utvecklats konkreta sätt eller en eventull finansiering från första?
                </label>
                <div className="bg-gray-100 rounded px-3 py-2 text-sm text-gray-600 min-h-[100px]">
                  Value
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold text-gray-900">Review suggestions</h3>
            <span className="text-yellow-500">⚠️</span>
          </div>
          
          <div className="space-y-3">
            {Array.from({
            length: 10
          }).map((_, index) => <Card key={index} className="border border-gray-200">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500">Correctness</span>
                    <div className="w-12 h-1 bg-gray-200 rounded">
                      <div className="w-full h-full bg-gray-400 rounded"></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Change the word</p>
                  <p className="text-xs font-medium text-gray-900 mb-2">deeply</p>
                  <div className="flex gap-1">
                    <Button size="sm" className="text-xs h-6 px-2 bg-blue-600 hover:bg-blue-700">
                      Accept
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs h-6 px-2">
                      Dismiss
                    </Button>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </div>
    </div>;
};
export default BusinessPlanEditor;