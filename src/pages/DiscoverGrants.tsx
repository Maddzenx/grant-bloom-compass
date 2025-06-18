
import React, { useState } from "react";
import { Search, Filter, Calendar, DollarSign, MapPin, FileText, Mail, Bookmark, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Grant {
  id: string;
  title: string;
  organization: string;
  description: string;
  fundingAmount: string;
  deadline: string;
  tags: string[];
  qualifications: string;
  aboutGrant: string;
  whoCanApply: string;
  importantDates: string[];
  fundingRules: string[];
  contact: {
    name: string;
    organization: string;
    email: string;
    phone: string;
  };
  templates: string[];
}

const DiscoverGrants = () => {
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookmarkedGrants, setBookmarkedGrants] = useState<Set<string>>(new Set());

  const grants: Grant[] = [
    {
      id: "1",
      title: "Tech Innovation Grant 2024",
      organization: "Vinnova",
      description: "Supporting breakthrough technology startups in AI, blockchain, and IoT",
      fundingAmount: "50 000 SEK",
      deadline: "March 15, 2025",
      tags: ["Technology", "Startup", "AI"],
      qualifications: "Early stage companies, tech focus, US based",
      aboutGrant: "The Tech Innovation Grant 2024 is designed to support breakthrough technology startups developing solutions in artificial intelligence, blockchain, Internet of Things (IoT), and emerging technologies. This grant aims to accelerate innovation and help promising startups bridge the gap between research and market implementation.",
      whoCanApply: "Early-stage technology companies with a focus on AI, blockchain, or IoT solutions. Applicants must be registered businesses with fewer than 50 employees and demonstrate innovative potential.",
      importantDates: [
        "4 okt 2025 - Info seminarium (länk)",
        "7 okt 2025 - Ansökan öppnar",
        "3 jan 2026 - Senast projektstart",
        "2 jan 2026 - Senast projektslut"
      ],
      fundingRules: [
        "Mottagare: Företag, Universitet, Forskare",
        "Konsortieform: Minst 2 aktörer, varav en från näringsliv",
        "Finansiering: Lån/bidr, konsulttjänster, licensavg, övriga kostnader"
      ],
      contact: {
        name: "Fredrik Welsner",
        organization: "Utlysningsansvarig",
        email: "fredrik.welsner@vinnova.se",
        phone: "+46 8 473 31 80"
      },
      templates: [
        "Bidragsansökan.pdf",
        "Infofordocumet.pmd",
        "Projektbeskrivning.docx",
        "CV-mall.pdf"
      ]
    },
    {
      id: "2",
      title: "Sustainable Innovation Fund",
      organization: "Green Tech Institute",
      description: "Funding for environmental technology and sustainability solutions",
      fundingAmount: "75 000 SEK",
      deadline: "April 20, 2025",
      tags: ["Sustainability", "Environment", "Technology"],
      qualifications: "Companies focused on environmental solutions",
      aboutGrant: "This fund supports innovative companies developing sustainable technologies that address climate change and environmental challenges.",
      whoCanApply: "Startups and SMEs working on environmental technology solutions with proven market potential.",
      importantDates: [
        "15 feb 2025 - Application opens",
        "20 apr 2025 - Application deadline",
        "1 jun 2025 - Results announced"
      ],
      fundingRules: [
        "Maximum 75% of project costs",
        "Minimum co-funding required",
        "Project duration: 12-24 months"
      ],
      contact: {
        name: "Anna Lindberg",
        organization: "Green Tech Institute",
        email: "anna.lindberg@greentech.se",
        phone: "+46 8 555 12 34"
      },
      templates: [
        "Application_Form.pdf",
        "Budget_Template.xlsx",
        "Technical_Specification.docx"
      ]
    }
  ];

  const toggleBookmark = (grantId: string) => {
    const newBookmarks = new Set(bookmarkedGrants);
    if (newBookmarks.has(grantId)) {
      newBookmarks.delete(grantId);
    } else {
      newBookmarks.add(grantId);
    }
    setBookmarkedGrants(newBookmarks);
  };

  const filteredGrants = grants.filter(grant =>
    grant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grant.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Discover Grants</h1>
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search grants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Grants List */}
        <div className="space-y-4">
          {filteredGrants.map((grant) => (
            <div
              key={grant.id}
              className={`bg-white rounded-lg border p-6 cursor-pointer transition-all hover:shadow-md ${
                selectedGrant?.id === grant.id ? "ring-2 ring-blue-500 shadow-md" : "border-gray-200"
              }`}
              onClick={() => setSelectedGrant(grant)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                      {grant.organization}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{grant.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{grant.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(grant.id);
                  }}
                  className="ml-2 p-1"
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      bookmarkedGrants.has(grant.id) ? "fill-blue-500 text-blue-500" : "text-gray-400"
                    }`}
                  />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {grant.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    {grant.fundingAmount}
                  </span>
                  <span className="flex items-center gap-1 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {grant.deadline}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Panel - Grant Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {selectedGrant ? (
            <div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                      {selectedGrant.organization}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedGrant.title}</h2>
                  <p className="text-gray-600">{selectedGrant.description}</p>
                </div>
                <Button className="flex items-center gap-2">
                  Apply
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Funding amount</p>
                    <p className="font-semibold">{selectedGrant.fundingAmount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Deadline</p>
                    <p className="font-semibold">{selectedGrant.deadline}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About this grant</h3>
                  <p className="text-gray-700">{selectedGrant.aboutGrant}</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Who can apply?</h3>
                  <p className="text-gray-700">{selectedGrant.whoCanApply}</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Important dates</h3>
                  <ul className="space-y-2">
                    {selectedGrant.importantDates.map((date, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        {date}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Funding rules</h3>
                  <ul className="space-y-2">
                    {selectedGrant.fundingRules.map((rule, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Templates and files</h3>
                  <div className="space-y-2">
                    {selectedGrant.templates.map((template, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border border-gray-200 rounded">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-700">{template}</span>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-900">{selectedGrant.contact.name}</p>
                    <p className="text-sm text-gray-600 mb-2">{selectedGrant.contact.organization}</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <a href={`mailto:${selectedGrant.contact.email}`} className="text-blue-600 hover:underline text-sm">
                          {selectedGrant.contact.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{selectedGrant.contact.phone}</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Select a grant to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscoverGrants;
