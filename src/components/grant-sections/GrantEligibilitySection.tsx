import React from "react";
import { Grant } from "@/types/grant";
import { Users } from "lucide-react";
interface GrantEligibilitySectionProps {
  grant: Grant;
  isMobile?: boolean;
}
const GrantEligibilitySection = ({
  grant,
  isMobile = false
}: GrantEligibilitySectionProps) => {
  const titleClass = isMobile ? 'text-lg' : 'text-xl';
  const textClass = isMobile ? 'text-sm' : 'text-sm';
  return;
};
export default GrantEligibilitySection;