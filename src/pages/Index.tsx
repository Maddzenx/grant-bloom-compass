import React, { useState } from "react";
import { Mic, Upload, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const Index = () => {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/discover");
  };
  const handleFileUpload = () => {
    // Future file upload functionality
    console.log("File upload clicked");
  };
  const handleVoiceInput = () => {
    // Future voice input functionality
    console.log("Voice input clicked");
  };
  return <div className="min-h-screen flex items-center justify-center p-6 bg-[#f8f4ec]">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-normal text-gray-900 mb-12">What is your project about?</h1>
          
          <div className="relative max-w-3xl mx-auto">
            <div className="flex items-center border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow px-6 py-4 gap-4 bg-white">
              {/* Audio Icon */}
              <Button variant="ghost" size="sm" className="p-2 rounded-full hover:bg-gray-100 flex-shrink-0" onClick={handleVoiceInput} title="Voice input">
                <Mic className="w-5 h-5 text-gray-500" />
              </Button>
              
              {/* Upload File Button */}
              <Button variant="ghost" size="sm" className="p-2 rounded-full hover:bg-gray-100 flex-shrink-0" onClick={handleFileUpload} title="Upload file">
                <Upload className="w-5 h-5 text-gray-500" />
              </Button>
              
              {/* Text Input Field */}
              <Input placeholder="Describe your project or funding needs..." className="flex-1 border-0 bg-transparent text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 px-0" value={inputValue} onChange={e => setInputValue(e.target.value)} />
              
              {/* Redirect Button - Only show when there's input */}
              {inputValue.trim() && <Button variant="default" size="sm" className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleRedirect}>
                  <span>Find Grants</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>}
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Index;