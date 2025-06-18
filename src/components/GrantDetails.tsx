
import React from "react";
import { Calendar, DollarSign, Bookmark, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Grant } from "@/types/grant";

interface GrantDetailsProps {
  grant: Grant;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

const GrantDetails = ({ grant, isBookmarked, onToggleBookmark }: GrantDetailsProps) => {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header section */}
      <div className="p-8 pb-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/lovable-uploads/23db7362-fc6c-4227-9a07-bbc3e401ec75.png" 
                alt="Vinnova" 
                className="w-16 h-6 object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">{grant.title}</h2>
            <p className="text-gray-600 leading-relaxed">{grant.description}</p>
          </div>
          <div className="flex gap-3 ml-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleBookmark}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Bookmark
                className={`w-5 h-5 ${
                  isBookmarked ? "fill-blue-500 text-blue-500" : "text-gray-400"
                }`}
              />
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-semibold">
              Apply
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-gray-600" />
            <div>
              <span className="text-sm text-gray-600">Funding amount</span>
              <div className="font-bold text-gray-900">{grant.fundingAmount}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-600" />
            <div>
              <span className="text-sm text-gray-600">Deadline:</span>
              <span className="font-bold text-gray-900 ml-1">{grant.deadline}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="space-y-8">
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4">About this grant</h3>
            <p className="text-gray-700 leading-relaxed mb-6">{grant.aboutGrant}</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Who can apply?</h3>
            <p className="text-gray-700 leading-relaxed mb-6">{grant.whoCanApply}</p>
          </section>

          {/* Right sidebar content */}
          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Allmän information</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-gray-900">Bidrag:</span>
                  <span className="text-gray-700 ml-1">500 000 – 2 000 000 SEK</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Projekttid:</span>
                  <span className="text-gray-700 ml-1">12–18 mån</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Medfinansiering:</span>
                  <span className="text-gray-700 ml-1">60%</span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Viktiga datum</h3>
              <ul className="space-y-2">
                {grant.importantDates.map((date, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{date}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Krav</h3>
              <div className="space-y-4">
                <div>
                  <span className="font-semibold text-gray-900">Mottagare:</span>
                  <span className="text-gray-700 ml-1">Företag, Universitet, Forskare</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Konsortiekrav:</span>
                  <span className="text-gray-700 ml-1">Minst 2 aktörer, varav en från näringsliv</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Finansiering:</span>
                  <span className="text-gray-700 ml-1">Löner, konsulttjänster, licenser, övriga kostnader</span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Mallar och filer</h3>
              <div className="space-y-3">
                {grant.templates.map((template, index) => (
                  <div key={index} className="flex items-center gap-3 text-blue-600 hover:text-blue-800 cursor-pointer">
                    <span className="underline">{template}</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Kontakt</h3>
              <div className="space-y-2">
                <div className="font-semibold text-gray-900">{grant.contact.name}</div>
                <div className="text-gray-700">{grant.contact.organization}</div>
                <div className="text-blue-600 underline cursor-pointer">{grant.contact.email}</div>
                <div className="text-gray-700">{grant.contact.phone}</div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Fixed bottom action bar */}
      <div className="flex gap-3 p-8 pt-6 border-t border-gray-200 bg-white">
        <Button
          variant="ghost"
          onClick={onToggleBookmark}
          className="hover:bg-gray-100 font-semibold rounded-lg px-6"
        >
          <Bookmark
            className={`w-4 h-4 mr-2 ${
              isBookmarked ? "fill-blue-500 text-blue-500" : "text-gray-400"
            }`}
          />
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-semibold">
          Apply
        </Button>
      </div>
    </div>
  );
};

export default GrantDetails;
