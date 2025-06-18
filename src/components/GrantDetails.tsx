
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
    <div className="bg-white rounded-lg border border-gray-200 h-full">
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <img 
                src="/lovable-uploads/23db7362-fc6c-4227-9a07-bbc3e401ec75.png" 
                alt="Vinnova" 
                className="w-16 h-6 object-contain"
              />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">{grant.title}</h2>
            <p className="text-gray-600 leading-relaxed">{grant.description}</p>
          </div>
          <div className="flex gap-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleBookmark}
              className="p-2 hover:bg-gray-100"
            >
              <Bookmark
                className={`w-4 h-4 ${
                  isBookmarked ? "fill-blue-500 text-blue-500" : "text-gray-400"
                }`}
              />
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
              Apply
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Funding amount</p>
              <p className="font-medium text-gray-900">{grant.fundingAmount}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Deadline</p>
              <p className="font-medium text-gray-900">{grant.deadline}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
        <section>
          <h3 className="text-base font-medium text-gray-900 mb-3">About this grant</h3>
          <p className="text-gray-700 leading-relaxed text-sm">{grant.aboutGrant}</p>
        </section>

        <section>
          <h3 className="text-base font-medium text-gray-900 mb-3">Who can apply?</h3>
          <p className="text-gray-700 leading-relaxed text-sm">{grant.whoCanApply}</p>
        </section>

        <section>
          <h3 className="text-base font-medium text-gray-900 mb-3">Important dates</h3>
          <ul className="space-y-2">
            {grant.importantDates.map((date, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                {date}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-base font-medium text-gray-900 mb-3">General information</h3>
          <ul className="space-y-2">
            {grant.generalInfo.map((info, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                {info}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-base font-medium text-gray-900 mb-3">Requirements</h3>
          <ul className="space-y-2">
            {grant.requirements.map((req, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                {req}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-base font-medium text-gray-900 mb-3">Templates and files</h3>
          <div className="space-y-2">
            {grant.templates.map((template, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                  <span className="text-red-600 text-xs font-bold">PDF</span>
                </div>
                <span className="text-sm text-gray-700 flex-1">{template}</span>
                <Button variant="ghost" size="sm" className="p-1">
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-base font-medium text-gray-900 mb-3">Contact</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium text-gray-900">{grant.contact.name}</p>
            <p className="text-sm text-gray-600 mb-2">{grant.contact.organization}</p>
            <div className="space-y-1">
              <div className="text-sm text-gray-700">{grant.contact.email}</div>
              <div className="text-sm text-gray-700">{grant.contact.phone}</div>
            </div>
          </div>
        </section>
      </div>

      <div className="flex gap-2 p-6 pt-4 border-t border-gray-200">
        <Button
          variant="ghost"
          onClick={onToggleBookmark}
          className="hover:bg-gray-100"
        >
          <Bookmark
            className={`w-4 h-4 mr-2 ${
              isBookmarked ? "fill-blue-500 text-blue-500" : "text-gray-400"
            }`}
          />
          {isBookmarked ? "Saved" : "Save"}
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Apply
        </Button>
      </div>
    </div>
  );
};

export default GrantDetails;
