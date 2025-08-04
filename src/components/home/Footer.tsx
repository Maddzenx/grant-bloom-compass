import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Main Footer Content */}
        <div className="mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center">
                {/* Circular Logo Icon */}
                <div className="mr-3">
                  <div className="circular-logo-icon w-10 h-10 bg-black rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none">
                      {/* Circular text path for "BIDRAGSSPRÅNGET" */}
                      <defs>
                        <path id="circlePath" d="M50,50 m-35,0 a35,35 0 1,1 70,0 a35,35 0 1,1 -70,0" />
                      </defs>
                      <text fill="#8B5CF6" fontFamily="Arial, sans-serif" fontSize="15" fontWeight="bold">
                        <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
                          BIDRAGSSPRÅNGET
                        </textPath>
                      </text>
                    </svg>
                  </div>
                </div>
                {/* Clean Typography */}
                <div className="flex flex-col">
                  <span className="text-xl font-inter font-semibold leading-tight text-white">
                    Bidragssprånget
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Vi analyserar hundratals bidrag i realtid och presenterar dig med de mest relevanta alternativen för att öka dina chanser till finansiering. 
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex justify-center">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Bidragssprånget är en oberoende plattform och har inget officiellt samarbete med statliga myndigheter eller EU-organisationer.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 