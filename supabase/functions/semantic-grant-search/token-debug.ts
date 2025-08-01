// Token usage debug utility for semantic search and LLM filtering
// This helps identify what's causing high token consumption

export interface TokenDebugInfo {
  promptLength: number;
  estimatedTokens: number;
  grantsCount: number;
  averageGrantLength: number;
  totalGrantContentLength: number;
  promptBreakdown: {
    systemMessage: string;
    userQuery: string;
    evaluationCriteria: string;
    scoringGuidelines: string;
    grantsData: string;
  };
  grantsData: Array<{
    id: string;
    descriptionLength: number;
    description: string;
  }>;
}

export function analyzeTokenUsage(
  query: string, 
  grants: Array<{id: string, description: string, currentRelevanceScore: number}>
): TokenDebugInfo {
  
  // Use the already prepared grants data
  const grantsForLLM = grants;

  const systemMessage = 'You are a precise grant matching expert. Always respond with valid JSON only.';
  
  const evaluationCriteria = `EVALUATION CRITERIA:
1. RELEVANCE MATCH: Does the grant's description align with the search query? Consider the purpose, industry, and scope mentioned in the description.
2. CONTENT RELEVANCE: Does the description contain information that would be useful for someone searching for this query?`;

  const scoringGuidelines = `SCORING GUIDELINES:
- 100%: Perfect match - description directly addresses the search query
- 75-99%: Excellent match - strong alignment with the search intent
- 50-74%: Good match - relevant content but may not be the exact focus
- 25-49%: Partial match - tangentially related content
- 1-24%: Weak match - minimal connection to the search query
- 0%: No match - completely irrelevant to the search query`;

  const grantsData = JSON.stringify(grantsForLLM, null, 2);

  const prompt = `You are an expert grant matching system. Your task is to evaluate grants for relevance to a user's search query based on their descriptions. Disregard which language is used, it's the content that matters.

USER SEARCH QUERY: "${query}"

${evaluationCriteria}

${scoringGuidelines}

GRANTS TO EVALUATE:
${grantsData}

Evaluate each grant and respond with a JSON array of objects with this structure:
{
  "grantId": "grant_id_here",
  "shouldInclude": true/false,
  "refinedScore": 0-100
}

Do NOT include any other text in your response.
`;

  // Rough token estimation (1 token ≈ 4 characters for English text)
  const estimatedTokens = Math.ceil(prompt.length / 4);
  
  const totalGrantContentLength = grantsForLLM.reduce((sum, grant) => sum + grant.description.length, 0);
  const averageGrantLength = grantsForLLM.length > 0 ? totalGrantContentLength / grantsForLLM.length : 0;

  return {
    promptLength: prompt.length,
    estimatedTokens,
    grantsCount: grants.length,
    averageGrantLength: Math.round(averageGrantLength),
    totalGrantContentLength,
    promptBreakdown: {
      systemMessage,
      userQuery: query,
      evaluationCriteria,
      scoringGuidelines,
      grantsData
    },
    grantsData: grantsForLLM.map(grant => ({
      id: grant.id,
      descriptionLength: grant.description.length,
      description: grant.description.substring(0, 200) + (grant.description.length > 200 ? '...' : '')
    }))
  };
}

export function logTokenDebugInfo(debugInfo: TokenDebugInfo): void {
  console.log('🔍 TOKEN USAGE DEBUG ANALYSIS');
  console.log('================================');
  console.log(`📏 Total prompt length: ${debugInfo.promptLength.toLocaleString()} characters`);
  console.log(`🎯 Estimated tokens: ${debugInfo.estimatedTokens.toLocaleString()}`);
  console.log(`📊 Number of grants: ${debugInfo.grantsCount}`);
  console.log(`📝 Average grant description length: ${debugInfo.averageGrantLength.toLocaleString()} characters`);
  console.log(`📚 Total grant content length: ${debugInfo.totalGrantContentLength.toLocaleString()} characters`);
  console.log('');
  
  console.log('📋 PROMPT BREAKDOWN:');
  console.log(`   System message: ${debugInfo.promptBreakdown.systemMessage.length} chars`);
  console.log(`   User query: ${debugInfo.promptBreakdown.userQuery.length} chars`);
  console.log(`   Evaluation criteria: ${debugInfo.promptBreakdown.evaluationCriteria.length} chars`);
  console.log(`   Scoring guidelines: ${debugInfo.promptBreakdown.scoringGuidelines.length} chars`);
  console.log(`   Grants data: ${debugInfo.promptBreakdown.grantsData.length} chars`);
  console.log('');
  
  console.log('📊 GRANTS DATA SAMPLE (first 5):');
  debugInfo.grantsData.slice(0, 5).forEach((grant, index) => {
    console.log(`   ${index + 1}. ${grant.id}: ${grant.descriptionLength} chars`);
    console.log(`      Preview: ${grant.description}`);
  });
  
  if (debugInfo.grantsData.length > 5) {
    console.log(`   ... and ${debugInfo.grantsData.length - 5} more grants`);
  }
  console.log('');
  
  // Token optimization suggestions
  console.log('💡 TOKEN OPTIMIZATION SUGGESTIONS:');
  if (debugInfo.estimatedTokens > 3000) {
    console.log('   ⚠️  High token usage detected!');
    console.log('   🔧 Consider:');
    console.log('      - Reducing number of grants sent to LLM (currently ' + debugInfo.grantsCount + ')');
    console.log('      - Truncating grant descriptions to 500-1000 characters');
    console.log('      - Using more concise evaluation criteria');
    console.log('      - Batching grants into smaller groups');
  }
  
  const grantsDataPercentage = (debugInfo.promptBreakdown.grantsData.length / debugInfo.promptLength) * 100;
  console.log(`   📊 Grants data represents ${grantsDataPercentage.toFixed(1)}% of total prompt`);
  
  if (grantsDataPercentage > 80) {
    console.log('   🎯 Grants data dominates the prompt - focus optimization here');
  }
  
  console.log('================================');
} 