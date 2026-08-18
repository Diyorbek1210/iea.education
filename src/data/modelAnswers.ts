export interface ModelAnswer {
  id: string;
  title: string;
  category: string;
  skill: "writing" | "speaking";
  band: number;
  prompt: string;
  answer: string;
  criteria: { label: string; band: number; comment: string }[];
  tips: string[];
}

export const MODEL_ANSWERS: ModelAnswer[] = [
  {
    id: "ma-1",
    title: "Education Essay — Band 8",
    category: "education",
    skill: "writing",
    band: 8,
    prompt: "Some people believe that university education should be available to all, while others think it should be restricted to those with high academic ability. Discuss both views and give your opinion.",
    answer: `The question of whether university education should be universally accessible or limited to high achievers is a subject of ongoing debate. While there are valid arguments on both sides, I believe that broad access to higher education benefits society as a whole.

On the one hand, proponents of restricting university places argue that selective admission ensures academic standards are maintained. If universities only accept the most capable students, the quality of research and teaching may improve. Furthermore, with finite resources, it could be argued that funding should be directed towards those most likely to succeed academically. This merit-based approach, they contend, maximises the return on educational investment.

On the other hand, I firmly believe that making university education available to a wider population produces greater long-term benefits. Firstly, restricting access perpetuates social inequality, as students from disadvantaged backgrounds often underperform in standardised tests due to lack of resources rather than lack of ability. Secondly, a more diverse student body enriches the learning environment by bringing together people with different perspectives and experiences. Thirdly, in an increasingly knowledge-based economy, a highly educated workforce is essential for national competitiveness.

Moreover, many successful individuals have demonstrated that academic potential cannot always be measured by prior qualifications. By opening doors to non-traditional students, universities can discover hidden talent that would otherwise go unnoticed.

In conclusion, while maintaining quality is important, I believe the advantages of making university education widely accessible far outweigh the disadvantages. Governments should invest in support systems to help students from all backgrounds succeed, rather than limiting opportunity to a select few.`,
    criteria: [
      { label: "Task Response", band: 8, comment: "Both views are fully addressed and a clear personal opinion is given throughout." },
      { label: "Coherence and Cohesion", band: 8, comment: "Ideas are logically organised with clear progression and effective use of cohesive devices." },
      { label: "Lexical Resource", band: 8, comment: "Wide range of vocabulary used accurately and appropriately with natural collocations." },
      { label: "Grammatical Range and Accuracy", band: 8, comment: "Variety of complex structures used with consistent accuracy and minor errors only." },
    ],
    tips: [
      "Notice how the essay uses linking phrases like 'On the one hand' and 'On the other hand' to structure the discussion.",
      "The writer uses a range of vocabulary: 'perpetuates', 'enriches', 'demonstrated', 'non-traditional'.",
      "Each paragraph has a clear topic sentence that guides the reader."
    ],
  },
  {
    id: "ma-2",
    title: "Environment Essay — Band 7",
    category: "environment",
    skill: "writing",
    band: 7,
    prompt: "Plastic pollution is a growing problem worldwide. What measures can be taken to reduce the use of plastic?",
    answer: `Plastic pollution has become one of the most pressing environmental issues of our time. From clogging waterways to harming marine life, the consequences of excessive plastic use are widespread. This essay will discuss several measures that can be implemented to reduce plastic consumption at both individual and governmental levels.

One effective approach is for governments to impose bans or taxes on single-use plastic items. Several countries have already introduced legislation prohibiting plastic bags and straws, with measurable reductions in plastic waste. By making such items less accessible or more expensive, consumers are naturally encouraged to seek alternatives. Additionally, governments could invest in research and development of biodegradable packaging materials, which would provide sustainable replacements for conventional plastics.

At the individual level, people can make a significant difference by adopting reusable alternatives in their daily lives. Carrying reusable shopping bags, water bottles, and food containers can dramatically reduce personal plastic waste. Furthermore, consumers can choose products with minimal or recyclable packaging, sending a clear signal to manufacturers about their preferences.

Education also plays a crucial role. Schools and communities should raise awareness about the environmental impact of plastic and teach practical ways to reduce consumption. When people understand the long-term damage caused by plastic pollution, they are more motivated to change their habits.

In conclusion, reducing plastic pollution requires a combination of government regulation, individual responsibility, and public education. By working together at all levels, society can make substantial progress in tackling this global problem.`,
    criteria: [
      { label: "Task Response", band: 7, comment: "Main ideas are relevant and well-developed with a clear position throughout." },
      { label: "Coherence and Cohesion", band: 7, comment: "Clear overall progression with appropriate paragraphing and cohesive devices." },
      { label: "Lexical Resource", band: 7, comment: "Good range of vocabulary with some less common items used effectively." },
      { label: "Grammatical Range and Accuracy", band: 7, comment: "Variety of complex sentences with generally accurate grammar." },
    ],
    tips: [
      "The essay addresses the question directly with clear measures at different levels.",
      "Paragraph structure: problem statement → government measures → individual measures → education → conclusion.",
      "Notice the use of topic sentences at the start of each body paragraph."
    ],
  },
  {
    id: "ma-3",
    title: "Speaking Part 2 — Band 8",
    category: "education",
    skill: "speaking",
    band: 8,
    prompt: "Describe a teacher who has influenced you in your education. You should say where you met them, what subject they taught, what was special about them, and explain why this person is your favourite teacher.",
    answer: `I'd like to talk about my high school English teacher, Mrs. Karimova, who had a profound impact on my education. I studied under her guidance from ages 15 to 18 at a secondary school in my hometown.

What made her truly exceptional was her innovative teaching methodology. Rather than simply lecturing us on grammar rules, she would create immersive scenarios where we had to use English naturally. For instance, she once organised a mock United Nations debate where every student had to represent a different country and argue their position entirely in English. It was both challenging and incredibly engaging.

She was also remarkably perceptive about each student's individual strengths and weaknesses. Whenever I struggled with essay writing, she would sit with me after class and break down the process into manageable steps, showing me how to construct arguments logically. Her patience and dedication went far beyond what was expected of any teacher.

What I admire most is that she instilled in me a genuine love for the English language, not just the mechanics of learning it. Because of her, I developed the confidence to pursue English at university level, which ultimately opened doors to international opportunities. She demonstrated that a great teacher doesn't just impart knowledge — they ignite curiosity and inspire lifelong learning.`,
    criteria: [
      { label: "Fluency and Coherence", band: 8, comment: "Speaks fluently with only rare hesitation; ideas are well-connected." },
      { label: "Lexical Resource", band: 8, comment: "Wide vocabulary range used naturally: 'innovative', 'perceptive', 'instilled'." },
      { label: "Grammatical Range and Accuracy", band: 8, comment: "Complex structures used accurately with good control." },
    ],
    tips: [
      "The speaker covers all bullet points from the cue card systematically.",
      "Uses specific examples (mock UN debate) to make the answer vivid and personal.",
      "Natural discourse markers: 'What made her...', 'She was also...', 'What I admire most...'."
    ],
  },
  {
    id: "ma-4",
    title: "Technology Essay — Band 7.5",
    category: "technology",
    skill: "writing",
    band: 7.5,
    prompt: "Artificial intelligence is expected to replace many jobs in the future. What are the problems this may cause, and what solutions can you suggest?",
    answer: `The rapid advancement of artificial intelligence is transforming the labour market at an unprecedented pace. While this technological revolution brings numerous benefits, it also raises concerns about widespread job displacement. This essay will examine the potential problems and propose practical solutions.

The most significant issue arising from AI-driven automation is mass unemployment. Routine tasks in manufacturing, customer service, and data processing are increasingly being performed by machines, leaving millions of workers at risk. This could lead to severe economic inequality, as those with specialised skills thrive while others struggle to find employment. Moreover, the psychological impact of job loss should not be underestimated — it can lead to depression, loss of purpose, and social exclusion.

To address these challenges, governments should invest heavily in retraining and upskilling programmes. Workers displaced by automation need to be equipped with new skills that complement rather than compete with AI. Educational institutions must also adapt their curricula to focus on skills that machines cannot easily replicate, such as critical thinking, creativity, and emotional intelligence.

Furthermore, policymakers should consider implementing a universal basic income or similar safety net to support those who cannot immediately transition to new roles. This would provide a financial cushion while the economy adjusts to the new technological landscape.

In conclusion, while AI-driven job displacement poses real challenges, they can be mitigated through proactive government policies, educational reform, and social safety nets. The key is to prepare for these changes rather than resist them.`,
    criteria: [
      { label: "Task Response", band: 7.5, comment: "Clear coverage of both problems and solutions with well-developed ideas." },
      { label: "Coherence and Cohesion", band: 7.5, comment: "Logical structure with clear paragraphing and appropriate linking." },
      { label: "Lexical Resource", band: 7.5, comment: "Good range of vocabulary with natural use of less common items." },
      { label: "Grammatical Range and Accuracy", band: 7.5, comment: "Wide range of structures with consistent accuracy." },
    ],
    tips: [
      "The essay clearly separates problems and solutions into different paragraphs.",
      "Advanced vocabulary: 'unprecedented', 'mitigated', 'proactive', 'psychological impact'.",
      "The conclusion restates the position without simply repeating the introduction."
    ],
  },
  {
    id: "ma-5",
    title: "Speaking Part 3 — Band 7",
    category: "technology",
    skill: "speaking",
    band: 7,
    prompt: "Do you think technology has made our lives easier or more complicated?",
    answer: `That's an interesting question. I think technology has generally made our lives easier, but there are definitely some downsides that we shouldn't ignore.

On the positive side, things like online banking, video calls, and delivery apps have saved us enormous amounts of time. For example, I can do my grocery shopping in five minutes on my phone instead of spending an hour in a supermarket. Communication has also become much more convenient — I can instantly connect with friends and family anywhere in the world.

However, there's also an argument that technology has created new problems. Many people are now addicted to their phones and social media, which can affect their mental health and sleep quality. Also, the constant need to update software and learn new systems can be frustrating, especially for older people.

So overall, while I believe technology has made life more convenient in many ways, we need to use it wisely to avoid the potential negative consequences.`,
    criteria: [
      { label: "Fluency and Coherence", band: 7, comment: "Speaks at length with natural hesitation only when thinking." },
      { label: "Lexical Resource", band: 7, comment: "Good vocabulary range with natural collocations." },
      { label: "Grammatical Range and Accuracy", band: 7, comment: "Mix of simple and complex sentences with good accuracy." },
    ],
    tips: [
      "The speaker gives a balanced view with clear opinions and examples.",
      "Uses natural spoken English: 'That's an interesting question', 'So overall'.",
      "Extends answers well without being repetitive."
    ],
  },
  {
    id: "ma-6",
    title: "Health Essay — Band 7",
    category: "health",
    skill: "writing",
    band: 7,
    prompt: "Many people today struggle to maintain a healthy work-life balance. What problems does this cause, and how can they be solved?",
    answer: `In today's fast-paced world, many individuals find it increasingly difficult to balance their professional responsibilities with their personal lives. This imbalance can lead to several significant problems, but there are practical solutions that both employers and individuals can adopt.

The most immediate consequence of poor work-life balance is physical and mental exhaustion. When people work long hours without adequate rest, they become more susceptible to stress, anxiety, and burnout. This not only affects their performance at work but also damages their relationships with family and friends. Furthermore, chronic overwork has been linked to serious health conditions such as heart disease and depression. The problem is compounded by technology, which means many employees are expected to be available outside of normal working hours.

To address these issues, employers should implement flexible working policies that allow employees to manage their time more effectively. Remote working options, compressed work weeks, and reasonable overtime limits can all contribute to a healthier balance. Companies should also foster a culture where taking breaks and holidays is encouraged rather than seen as a sign of weakness.

On a personal level, individuals need to set clear boundaries between work and home life. This might mean turning off work emails in the evening, dedicating time to exercise, or simply making an effort to be fully present during family meals. Learning to say no to excessive demands is equally important.

In conclusion, while the modern workplace presents real challenges to work-life balance, the combination of progressive employer policies and personal discipline can help individuals achieve a healthier and more sustainable lifestyle.`,
    criteria: [
      { label: "Task Response", band: 7, comment: "Clear identification of problems and relevant solutions." },
      { label: "Coherence and Cohesion", band: 7, comment: "Well-organised with appropriate use of cohesive devices." },
      { label: "Lexical Resource", band: 7, comment: "Good range of vocabulary related to the topic." },
      { label: "Grammatical Range and Accuracy", band: 7, comment: "Good control of grammar with minor errors." },
    ],
    tips: [
      "Notice how the essay addresses both parts of the question (problems AND solutions).",
      "The writer uses specific examples: 'turning off work emails', 'compressed work weeks'.",
      "Each body paragraph focuses on one aspect — problems first, then solutions."
    ],
  },
];

export function getAnswersByCategory(category: string): ModelAnswer[] {
  return MODEL_ANSWERS.filter((a) => a.category === category);
}

export function getAnswersBySkill(skill: "writing" | "speaking"): ModelAnswer[] {
  return MODEL_ANSWERS.filter((a) => a.skill === skill);
}

export function getAnswersByBand(minBand: number): ModelAnswer[] {
  return MODEL_ANSWERS.filter((a) => a.band >= minBand);
}
