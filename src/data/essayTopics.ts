export type EssayType =
  | "agree_disagree"
  | "advantages_disadvantages"
  | "problem_solution"
  | "opinion"
  | "discussion"
  | "two_part_question";

export type EssayCategory =
  | "education"
  | "environment"
  | "technology"
  | "health"
  | "society"
  | "economy"
  | "crime"
  | "transport"
  | "media"
  | "government"
  | "work"
  | "family";

export interface EssayTopic {
  id: string;
  title: string;
  prompt: string;
  type: EssayType;
  category: EssayCategory;
  difficulty: "intermediate" | "advanced";
  suggestedTime: number;
  minWords: number;
}

export const ESSAY_TYPES: { id: EssayType; label: string; description: string }[] = [
  { id: "agree_disagree", label: "Agree/Disagree", description: "To what extent do you agree or disagree?" },
  { id: "advantages_disadvantages", label: "Advantages/Disadvantages", description: "What are the advantages and disadvantages?" },
  { id: "problem_solution", label: "Problem/Solution", description: "What are the problems and possible solutions?" },
  { id: "opinion", label: "Opinion", description: "What is your opinion on this issue?" },
  { id: "discussion", label: "Discussion", description: "Discuss both views and give your opinion." },
  { id: "two_part_question", label: "Two-Part Question", description: "Answer two related questions about the topic." },
];

export const ESSAY_TOPICS: EssayTopic[] = [
  // Education
  {
    id: "edu-1",
    title: "University Education",
    prompt: "Some people believe that university education should be available to all, while others think it should be restricted to those with high academic ability. Discuss both views and give your opinion.",
    type: "discussion",
    category: "education",
    difficulty: "advanced",
    suggestedTime: 40,
    minWords: 250,
  },
  {
    id: "edu-2",
    title: "Online vs Traditional Learning",
    prompt: "Online learning has become increasingly popular. Some people think it is better than traditional classroom learning. To what extent do you agree or disagree?",
    type: "agree_disagree",
    category: "education",
    difficulty: "intermediate",
    suggestedTime: 40,
    minWords: 250,
  },
  {
    id: "edu-3",
    title: "Teaching Methods",
    prompt: "In many countries, the traditional method of teaching involves lecturing students. However, some educators argue that practical activities are more effective. What are the advantages and disadvantages of each approach?",
    type: "advantages_disadvantages",
    category: "education",
    difficulty: "intermediate",
    suggestedTime: 40,
    minWords: 250,
  },
  {
    id: "edu-4",
    title: "Homework for Children",
    prompt: "Some people think that giving homework to children at school is unnecessary. Others believe it helps them learn better. What is your opinion?",
    type: "opinion",
    category: "education",
    difficulty: "intermediate",
    suggestedTime: 40,
    minWords: 250,
  },
  {
    id: "edu-5",
    title: "Gap Year Before University",
    prompt: "Many young people take a year off between school and university. What are the advantages and disadvantages of taking a gap year?",
    type: "advantages_disadvantages",
    category: "education",
    difficulty: "intermediate",
    suggestedTime: 40,
    minWords: 250,
  },

  // Environment
  {
    id: "env-1",
    title: "Climate Change Action",
    prompt: "Some people argue that individuals can do nothing about climate change, and only governments and large corporations can make a difference. To what extent do you agree or disagree?",
    type: "agree_disagree",
    category: "environment",
    difficulty: "advanced",
    suggestedTime: 40,
    minWords: 250,
  },
  {
    id: "env-2",
    title: "Environmental Protection vs Economic Growth",
    prompt: "Some people believe that environmental problems should be solved by the government. Others think individuals should take responsibility. Discuss both views and give your opinion.",
    type: "discussion",
    category: "environment",
    difficulty: "advanced",
    suggestedTime: 40,
    minWords: 250,
  },
  {
    id: "env-3",
    title: "Plastic Pollution",
    prompt: "Plastic pollution is a growing problem worldwide. What measures can be taken to reduce the use of plastic?",
    type: "problem_solution",
    category: "environment",
    difficulty: "intermediate",
    suggestedTime: 40,
    minWords: 250,
  },
  {
    id: "env-4",
    title: "Renewable Energy Transition",
    prompt: "Many countries are now moving away from fossil fuels towards renewable energy. What are the benefits and challenges of this transition?",
    type: "advantages_disadvantages",
    category: "environment",
    difficulty: "intermediate",
    suggestedTime: 40,
    minWords: 250,
  },
  {
    id: "env-5",
    title: "Urban Green Spaces",
    prompt: "Some people think that cities should invest more in parks and green spaces, while others believe the money should be spent on housing and transport. Discuss both views.",
    type: "discussion",
    category: "environment",
    difficulty: "intermediate",
    suggestedTime: 40,
    minWords: 250,
  },

  // Technology
  {
    id: "tech-1",
    title: "Social Media Impact",
    prompt: "Social media has had a significant impact on society. Do the benefits outweigh the negatives?",
    type: "opinion",
    category: "technology",
    difficulty: "intermediate",
    suggestedTime: 40,
    minWords: 250,
  },
  {
    id: "tech-2",
    title: "AI in Employment",
    prompt: "Artificial intelligence is expected to replace many jobs in the future. What are the problems this may cause, and what solutions can you suggest?",
    type: "problem_solution",
    category: "technology",
    difficulty: "advanced",
    suggestedTime: 40,
    minWords: 250,
  },
  {
    id: "tech-3",
    title: "Children and Screen Time",
    prompt: "Children today spend much more time on screens than in the past. Is this a positive or negative development?",
    type: "opinion",
    category: "technology",
    difficulty: "intermediate",
    suggestedTime: 40,
    minWords: 250,
  },
  {
    id: "tech-4",
    title: "Digital Communication",
    prompt: "Some people think digital communication has improved relationships, while others believe it has weakened them. Discuss both views and give your opinion.",
    type: "discussion",
    category: "technology",
    difficulty: "intermediate",
    suggestedTime: 40,
    minWords: 250,
  },
  {
    id: "tech-5",
    title: "Internet Access as a Right",
    prompt: "Some people believe that internet access should be a fundamental right. To what extent do you agree or disagree?",
    type: "agree_disagree",
    category: "technology",
    difficulty: "advanced",
    suggestedTime: 40,
    minWords: 250,
  },

  // Health
  {
    id: "health-1",
    title: "Fast Food vs Home Cooking",
    prompt: "Many people today prefer eating fast food rather than cooking at home. What are the reasons for this, and what can be done to encourage healthier eating?",
    type: "two_part_question",
    category: "health",
    difficulty: "intermediate",
    suggestedTime: 40,
    minWords: 250,
  },
  {
    id: "health-2",
    title: "Mental Health Awareness",
    prompt: "Mental health issues are becoming more common, especially among young people. What are the causes, and what measures can be taken to address this problem?",
    type: "problem_solution",
    category: "health",
    difficulty: "intermediate",
    suggestedTime: 40,
    minWords: 250,
  },
  {
    id: "health-3",
    title: "Government Role in Public Health",
    prompt: "Some people believe the government should regulate unhealthy foods, while others think individuals should make their own choices. Discuss both views.",
    type: "discussion",
    category: "health",
    difficulty: "advanced",
    suggestedTime: 40,
    minWords: 250,
  },
  {
    id: "health-4",
    title: "Sports in Schools",
    prompt: "To what extent do you agree or disagree that physical education should be compulsory in all schools?",
    type: "agree_disagree",
    category: "health",
    difficulty: "intermediate",
    suggestedTime: 40,
    minWords: 250,
  },
  {
    id: "health-5",
    title: "Work-Life Balance",
    prompt: "Many people today struggle to maintain a healthy work-life balance. What problems does this cause, and how can they be solved?",
    type: "problem_solution",
    category: "health",
    difficulty: "intermediate",
    suggestedTime: 40,
    minWords: 250,
  },

  // Society
  {
    id: "soc-1",
    title: "Ageing Population",
    prompt: "In many countries, the proportion of elderly people is increasing. What problems does this cause, and what solutions can you suggest?",
    type: "problem_solution",
    category: "society",
    difficulty: "advanced",
    suggestedTime: 40,
    minWords: 250,
  },
  {
    id: "soc-2",
    title: "Urbanisation",
    prompt: "More people are moving from rural areas to cities. What are the advantages and disadvantages of this trend?",
    type: "advantages_disadvantages",
    category: "society",
    difficulty: "intermediate",
    suggestedTime: 40,
    minWords: 250,
  },
  {
    id: "soc-3",
    title: "Gender Equality",
    prompt: "Despite progress, gender inequality still exists in many areas of society. What more can be done to achieve equality?",
    type: "problem_solution",
    category: "society",
    difficulty: "advanced",
    suggestedTime: 40,
    minWords: 250,
  },
  {
    id: "soc-4",
    title: "Cultural Loss",
    prompt: "Some people worry that globalisation is leading to the loss of cultural identity. To what extent do you agree or disagree?",
    type: "agree_disagree",
    category: "society",
    difficulty: "advanced",
    suggestedTime: 40,
    minWords: 250,
  },
  {
    id: "soc-5",
    title: "Volunteering",
    prompt: "Some people think young people should be encouraged to do volunteer work. Others believe it should be part of the school curriculum. Discuss both views.",
    type: "discussion",
    category: "society",
    difficulty: "intermediate",
    suggestedTime: 40,
    minWords: 250,
  },

  // Economy
  {
    id: "econ-1",
    title: "Income Inequality",
    prompt: "The gap between the rich and poor is growing in many countries. What problems does this cause, and what solutions can you suggest?",
    type: "problem_solution",
    category: "economy",
    difficulty: "advanced",
    suggestedTime: 40,
    minWords: 250,
  },
  {
    id: "econ-2",
    title: "Globalisation and Local Business",
    prompt: "Globalisation has made it easier for large companies to operate worldwide, but small local businesses may suffer. Discuss both views.",
    type: "discussion",
    category: "economy",
    difficulty: "advanced",
    suggestedTime: 40,
    minWords: 250,
  },
  {
    id: "econ-3",
    title: "Tourism Impact",
    prompt: "Tourism brings both benefits and problems to a country. Do you think the advantages of tourism outweigh the disadvantages?",
    type: "opinion",
    category: "economy",
    difficulty: "intermediate",
    suggestedTime: 40,
    minWords: 250,
  },

  // Crime
  {
    id: "crime-1",
    title: "Youth Crime",
    prompt: "Youth crime is increasing in many countries. What are the causes, and how can parents and schools help prevent it?",
    type: "two_part_question",
    category: "crime",
    difficulty: "intermediate",
    suggestedTime: 40,
    minWords: 250,
  },
  {
    id: "crime-2",
    title: "Prison vs Education",
    prompt: "Some people think prisoners should receive education to help them reintegrate into society, while others believe they should be punished. Discuss both views.",
    type: "discussion",
    category: "crime",
    difficulty: "advanced",
    suggestedTime: 40,
    minWords: 250,
  },
  {
    id: "crime-3",
    title: "Crime Prevention",
    prompt: "The best way to reduce crime is to give longer prison sentences. To what extent do you agree or disagree?",
    type: "agree_disagree",
    category: "crime",
    difficulty: "intermediate",
    suggestedTime: 40,
    minWords: 250,
  },

  // Transport
  {
    id: "trans-1",
    title: "Public vs Private Transport",
    prompt: "Some people think governments should invest more in public transport, while others believe private cars are better. Discuss both views and give your opinion.",
    type: "discussion",
    category: "transport",
    difficulty: "intermediate",
    suggestedTime: 40,
    minWords: 250,
  },
  {
    id: "trans-2",
    title: "Congestion Charging",
    prompt: "Some cities have introduced congestion charges for drivers entering the city centre. Is this a positive or negative development?",
    type: "opinion",
    category: "transport",
    difficulty: "intermediate",
    suggestedTime: 40,
    minWords: 250,
  },

  // Media
  {
    id: "media-1",
    title: "News Media Trust",
    prompt: "Many people no longer trust the news media. What are the reasons for this, and what can be done to restore trust?",
    type: "two_part_question",
    category: "media",
    difficulty: "intermediate",
    suggestedTime: 40,
    minWords: 250,
  },
  {
    id: "media-2",
    title: "Advertising to Children",
    prompt: "Advertising to children should be banned because it encourages unhealthy habits. To what extent do you agree or disagree?",
    type: "agree_disagree",
    category: "media",
    difficulty: "intermediate",
    suggestedTime: 40,
    minWords: 250,
  },

  // Government
  {
    id: "gov-1",
    title: "Government Spending on Arts",
    prompt: "Some people think the government should spend money on public services rather than the arts. To what extent do you agree or disagree?",
    type: "agree_disagree",
    category: "government",
    difficulty: "intermediate",
    suggestedTime: 40,
    minWords: 250,
  },
  {
    id: "gov-2",
    title: "Retirement Age",
    prompt: "In some countries, the government is considering raising the retirement age. What are the advantages and disadvantages of this policy?",
    type: "advantages_disadvantages",
    category: "government",
    difficulty: "advanced",
    suggestedTime: 40,
    minWords: 250,
  },

  // Work
  {
    id: "work-1",
    title: "Remote Working",
    prompt: "Remote working has become more common since the pandemic. What are the benefits and drawbacks for employees and employers?",
    type: "advantages_disadvantages",
    category: "work",
    difficulty: "intermediate",
    suggestedTime: 40,
    minWords: 250,
  },
  {
    id: "work-2",
    title: "Job Satisfaction vs Salary",
    prompt: "Some people believe a high salary is the most important factor in choosing a job. Others think job satisfaction is more important. Discuss both views.",
    type: "discussion",
    category: "work",
    difficulty: "intermediate",
    suggestedTime: 40,
    minWords: 250,
  },

  // Family
  {
    id: "fam-1",
    title: "Working Parents",
    prompt: "Both parents in many families now work full-time. What effects does this have on children and families?",
    type: "two_part_question",
    category: "family",
    difficulty: "intermediate",
    suggestedTime: 40,
    minWords: 250,
  },
  {
    id: "fam-2",
    title: "Family Size",
    prompt: "Some people think having a large family is better, while others prefer smaller families. Discuss both views and give your opinion.",
    type: "discussion",
    category: "family",
    difficulty: "intermediate",
    suggestedTime: 40,
    minWords: 250,
  },
];

export function getRandomTopic(type?: EssayType, category?: EssayCategory): EssayTopic {
  let filtered = [...ESSAY_TOPICS];
  if (type) filtered = filtered.filter((t) => t.type === type);
  if (category) filtered = filtered.filter((t) => t.category === category);
  return filtered[Math.floor(Math.random() * filtered.length)]!;
}

export function getTopicsByType(type: EssayType): EssayTopic[] {
  return ESSAY_TOPICS.filter((t) => t.type === type);
}

export function getTopicsByCategory(category: EssayCategory): EssayTopic[] {
  return ESSAY_TOPICS.filter((t) => t.category === category);
}
