
import React from "react";
import { Grant } from "@/types/grant";

interface GrantMainContentProps {
  grant: Grant;
}

const GrantMainContent = ({ grant }: GrantMainContentProps) => {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-bold text-gray-900 mb-4 text-lg">Om detta bidrag</h2>
        <div className="text-gray-700 leading-relaxed">
          <p className="text-sm">{grant.aboutGrant}</p>
        </div>
      </section>

      <section>
        <h2 className="font-bold text-gray-900 mb-4 text-lg">Vem kan ansöka?</h2>
        <div className="text-gray-700 leading-relaxed">
          <p className="text-sm">{grant.whoCanApply}</p>
        </div>
      </section>
    </div>
  );
};

export default GrantMainContent;
