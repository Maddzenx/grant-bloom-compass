import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import GrantCard from "@/components/GrantCard";
import { Grant } from "@/types/grant";
import { useSavedGrantsContext } from "@/contexts/SavedGrantsContext";
import { AIGrantMatch } from "@/hooks/useAIGrantSearch";
interface GrantListProps {
  grants: Grant[];
  selectedGrant: Grant | null;
  onGrantSelect: (grant: Grant) => void;
  onToggleBookmark: (grantId: string) => void;
  searchTerm: string;
  isMobile: boolean;
  aiMatches?: AIGrantMatch[];
}
const GrantList = ({
  grants,
  selectedGrant,
  onGrantSelect,
  onToggleBookmark,
  searchTerm,
  isMobile,
  aiMatches
}: GrantListProps) => {
  const {
    isGrantSaved
  } = useSavedGrantsContext();
  const containerClass = isMobile ? "w-full bg-canvas-cloud overflow-hidden flex flex-col" : "w-[35%] bg-canvas-cloud overflow-hidden flex flex-col border-r" + " border-[#F0F1F3]";

  // Create a map of grant IDs to match scores for quick lookup
  const matchScoreMap = React.useMemo(() => {
    if (!aiMatches || aiMatches.length === 0) {
      console.log('📊 No AI matches available for mapping');
      return new Map();
    }
    console.log('📊 Creating match score map from AI matches:', {
      aiMatchesCount: aiMatches.length,
      firstFewMatches: aiMatches.slice(0, 3).map(m => ({
        grantId: m.grantId,
        score: m.relevanceScore,
        reasons: m.matchingReasons
      }))
    });
    const map = new Map<string, number>();
    aiMatches.forEach(match => {
      // Ensure valid score - no null or undefined values
      const validScore = match.relevanceScore !== null && match.relevanceScore !== undefined ? match.relevanceScore : 0.25; // Fallback score

      map.set(match.grantId, validScore);
    });
    console.log('📊 Final matchScoreMap:', {
      mapSize: map.size,
      sampleEntries: Array.from(map.entries()).slice(0, 3)
    });
    return map;
  }, [aiMatches]);
  return <div className={containerClass}>
      <ScrollArea className="flex-1">
        <div className="bg-canvas-cloud w-full bg-[#f0f1f3] py-px px-[5px]">
          <div className="space-y-2 pl-10 pr-0">
            {grants.length === 0 ? <div className="text-center text-ink-secondary mt-12 px-4">
                <div className="body-text">
                  {searchTerm ? "Inga bidrag hittades för din sökning." : "Inga bidrag tillgängliga."}
                </div>
              </div> : grants.map(grant => {
            const matchScore = matchScoreMap.get(grant.id);
            console.log('🎯 Rendering grant card:', {
              grantId: grant.id,
              grantTitle: grant.title.substring(0, 30) + '...',
              matchScore,
              hasValidScore: matchScore !== null && matchScore !== undefined,
              scoreAsPercentage: matchScore ? Math.round(matchScore * 100) : 'N/A'
            });
            return <GrantCard key={grant.id} grant={grant} isSelected={selectedGrant?.id === grant.id} isBookmarked={isGrantSaved(grant.id)} onSelect={() => onGrantSelect(grant)} onToggleBookmark={() => onToggleBookmark(grant.id)} isMobile={isMobile} matchScore={matchScore} />;
          })}
          </div>
        </div>
      </ScrollArea>
    </div>;
};
export default GrantList;