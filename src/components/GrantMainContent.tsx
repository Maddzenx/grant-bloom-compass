
import React from "react";
import { Grant } from "@/types/grant";

interface GrantMainContentProps {
  grant: Grant;
}

const GrantMainContent = ({ grant }: GrantMainContentProps) => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="font-bold text-gray-900 mb-3 text-base">About this grant</h2>
        <div className="text-gray-700 leading-relaxed space-y-3">
          <p className="text-xs">{grant.aboutGrant}</p>
        </div>
      </section>

      <section>
        <h2 className="font-bold text-gray-900 mb-3 text-base">Who can apply?</h2>
        <div className="text-gray-700 leading-relaxed">
          <p className="text-xs">{grant.whoCanApply}</p>
        </div>
      </section>

      <section>
        <h2 className="text-gray-900 mb-3 font-bold text-base">About this grant</h2>
        <div className="text-gray-700 leading-relaxed space-y-3">
          <p className="text-xs">The Tech Innovation Grant 2024 is designed to support breakthrough technology startups developing solutions in artificial intelligence, blockchain, Internet of Things (IoT), and emerging technologies. This grant aims to accelerate innovation and help promising startups bridge the gap between research and market implementation.</p>
          <p className="text-xs">Our mission is to foster technological advancement that creates meaningful impact on society while supporting entrepreneurs who are building the future. Recipients will receive not only financial support but also access to our extensive network of mentors, industry experts, and potential investors.</p>
        </div>
      </section>
    </div>
  );
};

export default GrantMainContent;
