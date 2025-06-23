
import React from "react";
import { Link } from "react-router-dom";
import { Search, CheckSquare } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Bidragsansökningsverktyg
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Effektivisera din bidragsansökningsprocess från upptäckt till inlämning med vårt omfattande verktyg designat för nystartade företag.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <Link 
              to="/discover" 
              className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 block group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upptäck bidrag</h3>
              <p className="text-gray-600">Hitta och utforska tillgängliga bidrag som matchar ditt företags behov och mål.</p>
            </Link>
            
            <Link 
              to="/progress" 
              className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 block group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <CheckSquare className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Framsteg & uppladdning</h3>
              <p className="text-gray-600">Spåra dina ansökningsframsteg och ladda upp nödvändiga dokument.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
