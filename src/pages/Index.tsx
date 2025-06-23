import React from "react";
import { Plus, Settings, Mic, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const Index = () => {
  return <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-normal text-gray-900 mb-12">What do you need funding for?</h1>
          
          <div className="relative max-w-3xl mx-auto">
            <div className="flex items-center bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow px-6 py-4">
              <Plus className="w-5 h-5 text-gray-400 mr-4" />
              
              <Input placeholder="Ask anything" className="flex-1 border-0 bg-transparent text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 px-0" />
              
              <div className="flex items-center gap-3 ml-4">
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-full">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm font-medium">Tools</span>
                </Button>
                
                <div className="w-px h-6 bg-gray-200"></div>
                
                <Button variant="ghost" size="sm" className="p-2 rounded-full hover:bg-gray-100">
                  <Mic className="w-5 h-5 text-gray-500" />
                </Button>
                
                <Button variant="ghost" size="sm" className="p-2 rounded-full hover:bg-gray-100">
                  <BarChart3 className="w-5 h-5 text-gray-500" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Index;