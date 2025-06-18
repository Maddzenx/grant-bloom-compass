
import React from "react";

const GrantSidebar = () => {
  return (
    <div className="space-y-6">
      <section className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-bold text-gray-900 mb-3 text-sm">Allmän information</h3>
        <div className="space-y-2">
          <div>
            <span className="font-semibold text-gray-900 text-xs">• Bidrag:</span>
            <span className="text-gray-700 ml-1 text-xs">500 000 – 2 000 000 SEK</span>
          </div>
          <div>
            <span className="font-semibold text-gray-900 text-xs">• Projekttid:</span>
            <span className="text-gray-700 ml-1 text-xs">12–18 mån</span>
          </div>
          <div>
            <span className="font-semibold text-gray-900 text-xs">• Medfinansiering:</span>
            <span className="text-gray-700 ml-1 text-xs">60%</span>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-bold text-gray-900 mb-3 text-sm">Viktiga datum</h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-gray-700">
            <span className="font-semibold">•</span>
            <span className="text-xs"><strong>4 okt 2025</strong> - Info seminarium (länk)</span>
          </li>
          <li className="flex items-start gap-2 text-gray-700">
            <span className="font-semibold">•</span>
            <span className="text-xs"><strong>7 okt 2025</strong> - Ansökan öppnar</span>
          </li>
          <li className="flex items-start gap-2 text-gray-700">
            <span className="font-semibold">•</span>
            <span className="text-xs"><strong>3 jan 2026</strong> - Senast projektstart</span>
          </li>
          <li className="flex items-start gap-2 text-gray-700">
            <span className="font-semibold">•</span>
            <span className="text-xs"><strong>2 jan 2026</strong> - Senast projektslut</span>
          </li>
        </ul>
      </section>

      <section className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-bold text-gray-900 mb-3 text-sm">Krav</h3>
        <div className="space-y-2">
          <div>
            <span className="font-semibold text-gray-900 text-xs">• Mottagare:</span>
            <span className="text-gray-700 ml-1 text-xs">Företag, Universitet, Forskare</span>
          </div>
          <div>
            <span className="font-semibold text-gray-900 text-xs">• Konsortiekrav:</span>
            <span className="text-gray-700 ml-1 text-xs">Minst 2 aktörer, varav en från näringsliv</span>
          </div>
          <div>
            <span className="font-semibold text-gray-900 text-xs">• Finansiering:</span>
            <span className="text-gray-700 ml-1 text-xs break-words">Löner, konsulttjänster, licenser, övriga kostnader</span>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-bold text-gray-900 mb-3 text-sm">Mallar och filer</h3>
        <div className="space-y-2">
          <div className="text-blue-600 hover:text-blue-800 cursor-pointer underline text-xs break-all">
            Bidragsinformation.pdf
          </div>
          <div className="text-blue-600 hover:text-blue-800 cursor-pointer underline text-xs break-all">
            Infovideomöte.pm4
          </div>
          <div className="text-blue-600 hover:text-blue-800 cursor-pointer underline text-xs break-all">
            projektbeskrivningsmall.docx
          </div>
          <div className="text-blue-600 hover:text-blue-800 cursor-pointer underline text-xs break-all">
            CV-mall.pdf
          </div>
        </div>
      </section>

      <section className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-bold text-gray-900 mb-3 text-sm">Kontakt</h3>
        <div className="space-y-1">
          <div className="font-semibold text-gray-900 text-xs">Fredrik Weisner</div>
          <div className="text-gray-700 text-xs">Utlysningsansvarig</div>
          <div className="text-blue-600 underline cursor-pointer text-xs break-all">fredrik.weisner@vinnova.se</div>
          <div className="text-gray-700 text-xs">+46 8 473 31 80</div>
        </div>
      </section>
    </div>
  );
};

export default GrantSidebar;
