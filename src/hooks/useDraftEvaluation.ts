
import { useMemo } from 'react';
import { ApplicationDraft } from '@/hooks/useChatAgent';
import { Grant } from '@/types/grant';

export interface EvaluationSuggestion {
  id: string;
  type: 'Relevans' | 'Originalitet' | 'Struktur' | 'Övertygelse';
  suggestion: string;
  fieldId: string;
  sectionKey: string;
  originalText: string;
  suggestedText: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export const useDraftEvaluation = (draft: ApplicationDraft | null, grant: Grant | null) => {
  const suggestions = useMemo(() => {
    if (!draft || !grant) return [];

    const evaluationSuggestions: EvaluationSuggestion[] = [];

    // Analyze each section of the draft
    Object.entries(draft.sections).forEach(([sectionKey, content]) => {
      if (!content || content.trim().length === 0) return;

      // Relevance analysis
      if (content.length < 100) {
        evaluationSuggestions.push({
          id: `${sectionKey}-relevance-length`,
          type: 'Relevans',
          suggestion: 'Expand this section to better demonstrate relevance to the grant criteria',
          fieldId: `${sectionKey}_beskrivning`,
          sectionKey,
          originalText: content,
          suggestedText: content + ' [Expand with specific details about how this relates to the grant objectives]',
          reason: 'Content is too brief to fully demonstrate relevance',
          priority: 'high'
        });
      }

      // Check for grant-specific keywords
      const grantKeywords = grant.tags?.map(tag => tag.toLowerCase()) || [];
      const contentLower = content.toLowerCase();
      const missingKeywords = grantKeywords.filter(keyword => !contentLower.includes(keyword));
      
      if (missingKeywords.length > 0) {
        evaluationSuggestions.push({
          id: `${sectionKey}-relevance-keywords`,
          type: 'Relevans',
          suggestion: `Include relevant keywords: ${missingKeywords.join(', ')}`,
          fieldId: `${sectionKey}_beskrivning`,
          sectionKey,
          originalText: content,
          suggestedText: content + ` [Consider incorporating: ${missingKeywords.join(', ')}]`,
          reason: 'Missing key terms from grant criteria',
          priority: 'medium'
        });
      }

      // Originality analysis
      if (content.includes('standard') || content.includes('traditional') || content.includes('conventional')) {
        evaluationSuggestions.push({
          id: `${sectionKey}-originality-innovation`,
          type: 'Originalitet',
          suggestion: 'Emphasize innovative aspects and unique value proposition',
          fieldId: `${sectionKey}_beskrivning`,
          sectionKey,
          originalText: content,
          suggestedText: content.replace(/standard|traditional|conventional/g, 'innovative'),
          reason: 'Content uses conventional language instead of emphasizing innovation',
          priority: 'medium'
        });
      }

      // Structure analysis
      const sentences = content.split('.').filter(s => s.trim().length > 0);
      if (sentences.length < 3) {
        evaluationSuggestions.push({
          id: `${sectionKey}-structure-detail`,
          type: 'Struktur',
          suggestion: 'Add more detailed explanations with clear structure',
          fieldId: `${sectionKey}_beskrivning`,
          sectionKey,
          originalText: content,
          suggestedText: content + ' [Add specific examples and detailed explanations]',
          reason: 'Section lacks sufficient detail and structure',
          priority: 'high'
        });
      }

      // Check for bullet points or numbered lists
      if (content.length > 200 && !content.includes('•') && !content.match(/\d\./)) {
        evaluationSuggestions.push({
          id: `${sectionKey}-structure-formatting`,
          type: 'Struktur',
          suggestion: 'Consider using bullet points or numbered lists for better readability',
          fieldId: `${sectionKey}_beskrivning`,
          sectionKey,
          originalText: content,
          suggestedText: content + '\n\n• [Key point 1]\n• [Key point 2]\n• [Key point 3]',
          reason: 'Long text would benefit from structured formatting',
          priority: 'low'
        });
      }

      // Persuasion analysis
      const weakWords = ['might', 'maybe', 'possibly', 'probably', 'could'];
      const hasWeakLanguage = weakWords.some(word => contentLower.includes(word));
      
      if (hasWeakLanguage) {
        evaluationSuggestions.push({
          id: `${sectionKey}-persuasion-confidence`,
          type: 'Övertygelse',
          suggestion: 'Use more confident and assertive language',
          fieldId: `${sectionKey}_beskrivning`,
          sectionKey,
          originalText: content,
          suggestedText: content.replace(/might|maybe|possibly|probably|could/gi, 'will'),
          reason: 'Tentative language reduces persuasive impact',
          priority: 'medium'
        });
      }

      // Check for quantifiable results
      if (!content.match(/\d+(%|SEK|kr|€|\$|participants|users|customers)/)) {
        evaluationSuggestions.push({
          id: `${sectionKey}-persuasion-metrics`,
          type: 'Övertygelse',
          suggestion: 'Include specific metrics or quantifiable outcomes',
          fieldId: `${sectionKey}_beskrivning`,
          sectionKey,
          originalText: content,
          suggestedText: content + ' [Add specific metrics, e.g., "targeting X customers" or "Y% improvement"]',
          reason: 'Concrete numbers strengthen persuasive impact',
          priority: 'high'
        });
      }
    });

    return evaluationSuggestions;
  }, [draft, grant]);

  return { suggestions };
};
