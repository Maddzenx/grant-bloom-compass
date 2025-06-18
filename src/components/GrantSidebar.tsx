import React from "react";
const GrantSidebar = () => {
  return <div className="space-y-8">
      <section className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-bold text-gray-900 mb-4 text-base">Allmän information</h3>
        <div className="space-y-3">
          <div>
            <span className="font-semibold text-gray-900 text-sm">• Bidrag:</span>
            <span className="text-gray-700 ml-1 text-sm">500 000 – 2 000 000 SEK</span>
          </div>
          <div>
            <span className="font-semibold text-gray-900 text-sm">• Projekttid:</span>
            <span className="text-gray-700 ml-1 text-sm">12–18 mån</span>
          </div>
          <div>
            <span className="font-semibold text-gray-900 text-sm">• Medfinansiering:</span>
            <span className="text-gray-700 ml-1 text-sm">60%</span>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-bold text-gray-900 mb-4 text-base">Viktiga datum</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-2 text-gray-700">
            <span className="font-semibold">•</span>
            <span className="text-sm"><strong>4 okt 2025</strong> - Info seminarium (länk)</span>
          </li>
          <li className="flex items-start gap-2 text-gray-700">
            <span className="font-semibold">•</span>
            <span className="text-sm"><strong>7 okt 2025</strong> - Ansökan öppnar</span>
          </li>
          <li className="flex items-start gap-2 text-gray-700">
            <span className="font-semibold">•</span>
            <span className="text-sm"><strong>3 jan 2026</strong> - Senast projektstart</span>
          </li>
          <li className="flex items-start gap-2 text-gray-700">
            <span className="font-semibold">•</span>
            <span className="text-sm"><strong>2 jan 2026</strong> - Senast projektslut</span>
          </li>
        </ul>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-bold text-gray-900 mb-4 text-base">Krav</h3>
        <div className="space-y-3">
          <div>
            <span className="font-semibold text-gray-900 text-sm">• Mottagare:</span>
            <span className="text-gray-700 ml-1 text-sm">Företag, Universitet, Forskare</span>
          </div>
          <div>
            <span className="font-semibold text-gray-900 text-sm">• Konsortiekrav:</span>
            <span className="text-gray-700 ml-1 text-sm">Minst 2 aktörer, varav en från näringsliv</span>
          </div>
          <div>
            <span className="font-semibold text-gray-900 text-sm">• Finansiering:</span>
            <span className="text-gray-700 ml-1">Löner, konsulttjänster, licenser, övriga kostnader</span>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-bold text-gray-900 mb-4 text-base">Mallar och filer</h3>
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
        <h3 className="font-bold text-gray-900 mb-4 text-base">Kontakt</h3>
        <div className="space-y-2">
          <div className="font-semibold text-gray-900">Fredrik Weisner</div>
          <div className="text-gray-700">Utlysningsansvarig</div>
          <div className="text-blue-600 underline cursor-pointer">fredrik.weisner@vinnova.se</div>
          <div className="text-gray-700">+46 8 473 31 80</div>
        </div>
      </section>
    </div>;
};
export default GrantSidebar;