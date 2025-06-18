
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
    <div className="h-full flex flex-col">
      {/* Header section */}
      <div className="p-8 pb-6 border-b border-gray-200 bg-white">
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
            <p className="text-gray-600 leading-relaxed text-base">{grant.description}</p>
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

        <div className="grid grid-cols-2 gap-6 p-5 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">Funding amount</p>
              <p className="font-bold text-gray-900 text-lg">{grant.fundingAmount}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">Deadline</p>
              <p className="font-bold text-gray-900 text-lg">{grant.deadline}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="space-y-8">
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4">About this grant</h3>
            <p className="text-gray-700 leading-relaxed">{grant.aboutGrant}</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Who can apply?</h3>
            <p className="text-gray-700 leading-relaxed">{grant.whoCanApply}</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Important dates</h3>
            <ul className="space-y-3">
              {grant.importantDates.map((date, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="leading-relaxed">{date}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4">General information</h3>
            <ul className="space-y-3">
              {grant.generalInfo.map((info, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="leading-relaxed">{info}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Requirements</h3>
            <ul className="space-y-3">
              {grant.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="leading-relaxed">{req}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Templates and files</h3>
            <div className="space-y-3">
              {grant.templates.map((template, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-red-600 text-xs font-bold">PDF</span>
                  </div>
                  <span className="text-gray-700 flex-1 font-medium">{template}</span>
                  <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100 rounded-lg">
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </Button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Contact</h3>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="font-bold text-gray-900 text-lg mb-1">{grant.contact.name}</p>
              <p className="text-gray-600 mb-4">{grant.contact.organization}</p>
              <div className="space-y-2">
                <div className="text-gray-700 font-medium">{grant.contact.email}</div>
                <div className="text-gray-700 font-medium">{grant.contact.phone}</div>
              </div>
            </div>
          </section>
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
          {isBookmarked ? "Saved" : "Save"}
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-semibold">
          Apply
        </Button>
      </div>
    </div>
  );
};

export default GrantDetails;
