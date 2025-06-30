
export const detectLanguage = (text: string): 'sv' | 'en' => {
  const swedishWords = ['och', 'för', 'att', 'med', 'av', 'på', 'är', 'som', 'den', 'det'];
  const words = text.toLowerCase().split(/\s+/);
  const swedishCount = words.filter(word => swedishWords.includes(word)).length;
  return swedishCount > words.length * 0.1 ? 'sv' : 'en';
};

export const checkDeadlineUrgency = (deadline?: string): boolean => {
  if (!deadline) return false;
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const hoursUntilDeadline = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursUntilDeadline <= 48;
};

export const hasAnswer = (topic: string, answers: Record<string, any>, materials: string[]): boolean => {
  // Check if topic is covered in collected answers or user materials
  return answers[topic] !== undefined || 
         materials.some(material => 
           material.toLowerCase().includes(topic.toLowerCase()) ||
           material.length > 100 // Assume substantial material might contain the answer
         );
};
