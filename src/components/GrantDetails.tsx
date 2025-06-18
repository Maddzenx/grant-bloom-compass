
import React from "react";
import { Calendar, DollarSign, Bookmark, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Grant } from "@/types/grant";

interface GrantDetailsProps {
  grant: Grant;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

const getOrganizationLogo = (organization: string) => {
  const orgLower = organization.toLowerCase();
  
  if (orgLower.includes('vinnova')) {
    return {
      src: "/lovable-uploads/dd840f7c-7034-4bfe-b763-b84461166cb6.png",
      alt: "Vinnova",
      className: "w-24 h-8 object-contain"
    };
  } else if (orgLower.includes('energimyndigheten')) {
    return {
      src: "/lovable-uploads/f8a26579-c7af-42a6-a518-0af3d65385d6.png",
      alt: "Energimyndigheten",
      className: "w-24 h-8 object-contain"
    };
  } else if (orgLower.includes('vetenskapsrådet')) {
    return {
      src: "/lovable-uploads/65e93ced-f449-4ba6-bcb0-5556c3edeb8a.png",
      alt: "Vetenskapsrådet",
      className: "w-24 h-8 object-contain"
    };
  } else if (orgLower.includes('formas')) {
    return {
      src: "/lovable-uploads/24e99124-8ec2-4d23-945b-ead48b809491.png",
      alt: "Formas",
      className: "w-24 h-8 object-contain"
    };
  } else if (orgLower.includes('tillväxtverket')) {
    return {
      src: "/lovable-uploads/112d5f02-31e8-4cb1-a8d5-7b7b422b0fa2.png",
      alt: "Tillväxtverket",
      className: "w-24 h-8 object-contain"
    };
  }
  
  // Default fallback to Vinnova
  return {
    src: "/lovable-uploads/dd840f7c-7034-4bfe-b763-b84461166cb6.png",
    alt: organization,
    className: "w-24 h-8 object-contain"
  };
};

const GrantDetails = ({ grant, isBookmarked, onToggleBookmark }: GrantDetailsProps) => {
  const orgLogo = getOrganizationLogo(grant.organization);

  return (
    <div className="h-full bg-white overflow-y-auto">
      <div className="p-8 max-w-4xl">
        {/* Header section */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1 pr-8">
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src={orgLogo.src}
                  alt={orgLogo.alt}
                  className={orgLogo.className}
                />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{grant.title}</h1>
              <p className="text-gray-700 text-lg leading-relaxed mb-6 max-w-4xl">{grant.description}</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleBookmark}
                className="p-3 hover:bg-gray-100 rounded-lg"
              >
                <Bookmark
                  className={`w-6 h-6 ${
                    isBookmarked ? "fill-blue-500 text-blue-500" : "text-gray-400"
                  }`}
                />
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-base">
                Apply
              </Button>
            </div>
          </div>

          {/* Key info section */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-gray-600" />
              <div>
                <span className="text-sm text-gray-600 block">Funding amount</span>
                <div className="font-bold text-gray-900 text-lg">{grant.fundingAmount}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-gray-600" />
              <div>
                <span className="text-sm text-gray-600 block">Deadline:</span>
                <span className="font-bold text-gray-900 text-lg">{grant.deadline}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content in two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left column - Main content */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">About this grant</h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>{grant.aboutGrant}</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Who can apply?</h2>
              <div className="text-gray-700 leading-relaxed">
                <p>{grant.whoCanApply}</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">About this grant</h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>The Tech Innovation Grant 2024 is designed to support breakthrough technology startups developing solutions in artificial intelligence, blockchain, Internet of Things (IoT), and emerging technologies. This grant aims to accelerate innovation and help promising startups bridge the gap between research and market implementation.</p>
                <p>Our mission is to foster technological advancement that creates meaningful impact on society while supporting entrepreneurs who are building the future. Recipients will receive not only financial support but also access to our extensive network of mentors, industry experts, and potential investors.</p>
              </div>
            </section>
          </div>

          {/* Right column - Sidebar info */}
          <div className="space-y-8">
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Allmän information</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-gray-900">• Bidrag:</span>
                  <span className="text-gray-700 ml-1">500 000 – 2 000 000 SEK</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">• Projekttid:</span>
                  <span className="text-gray-700 ml-1">12–18 mån</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">• Medfinansiering:</span>
                  <span className="text-gray-700 ml-1">60%</span>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Viktiga datum</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="font-semibold">•</span>
                  <span><strong>4 okt 2025</strong> - Info seminarium (länk)</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="font-semibold">•</span>
                  <span><strong>7 okt 2025</strong> - Ansökan öppnar</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="font-semibold">•</span>
                  <span><strong>3 jan 2026</strong> - Senast projektstart</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="font-semibold">•</span>
                  <span><strong>2 jan 2026</strong> - Senast projektslut</span>
                </li>
              </ul>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Krav</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-gray-900">• Mottagare:</span>
                  <span className="text-gray-700 ml-1">Företag, Universitet, Forskare</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">• Konsortiekrav:</span>
                  <span className="text-gray-700 ml-1">Minst 2 aktörer, varav en från näringsliv</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">• Finansiering:</span>
                  <span className="text-gray-700 ml-1">Löner, konsulttjänster, licenser, övriga kostnader</span>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Mallar och filer</h3>
              <div className="space-y-3">
                <div className="text-blue-600 hover:text-blue-800 cursor-pointer underline break-words">
                  Bidragsinformation.pdf
                </div>
                <div className="text-blue-600 hover:text-blue-800 cursor-pointer underline break-words">
                  Infovideomöte.pm4
                </div>
                <div className="text-blue-600 hover:text-blue-800 cursor-pointer underline break-words">
                  projektbeskrivningsmall.docx
                </div>
                <div className="text-blue-600 hover:text-blue-800 cursor-pointer underline break-words">
                  CV-mall.pdf
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Kontakt</h3>
              <div className="space-y-2">
                <div className="font-semibold text-gray-900">Fredrik Weisner</div>
                <div className="text-gray-700">Utlysningsansvarig</div>
                <div className="text-blue-600 underline cursor-pointer">fredrik.weisner@vinnova.se</div>
                <div className="text-gray-700">+46 8 473 31 80</div>
              </div>
            </section>
          </div>
        </div>

        {/* Bottom action buttons */}
        <div className="flex gap-3 pt-8 mt-8 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={onToggleBookmark}
            className="hover:bg-gray-100 font-semibold rounded-lg px-6"
          >
            <Bookmark
              className={`w-5 h-5 mr-2 ${
                isBookmarked ? "fill-blue-500 text-blue-500" : "text-gray-400"
              }`}
            />
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-base">
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GrantDetails;
