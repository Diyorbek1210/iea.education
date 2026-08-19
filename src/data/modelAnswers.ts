export interface ModelAnswer {
  id: string;
  title: string;
  category: string;
  skill: "writing" | "speaking" | "reading" | "listening";
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
  // ── Reading Model Answers ──
  {
    id: "ma-reading-1",
    title: "Reading Passage — Urban Gardening (Band 8)",
    category: "environment",
    skill: "reading",
    band: 8,
    prompt: "Read the passage below and answer the questions that follow.\n\nUrban gardening has seen a remarkable surge in popularity over the past decade. What was once considered a hobby for retirees has transformed into a global movement embraced by年轻人 and city planners alike. The reasons for this shift are multifaceted, ranging from concerns about food security to a growing awareness of mental health benefits associated with nurturing living plants.\n\nIn cities like Detroit, abandoned lots have been converted into thriving community gardens, providing fresh produce to neighbourhoods that were previously classified as food deserts. These initiatives have not only improved access to healthy food but have also strengthened community bonds. Residents who participate in urban gardening programmes report feeling more connected to their neighbours and more invested in the wellbeing of their local area.\n\nCritics argue that urban gardening is merely a trend that will fade as cities continue to prioritise development. However, the data suggests otherwise. A 2023 study published in the Journal of Urban Agriculture found that cities with established urban gardening programmes experienced a 15% reduction in food-related carbon emissions and a measurable improvement in居民 mental health indicators.\n\nFurthermore, urban gardens serve as crucial green spaces in densely populated areas. They provide habitats for pollinators, reduce the urban heat island effect, and improve air quality. These ecological benefits make urban gardening not just a social phenomenon but an essential component of sustainable urban planning.",
    answer: `Question 1: The passage states that urban gardening was once considered "a hobby for retirees" but has now become "a global movement embraced by年轻人 and city planners alike."

Question 2: According to the passage, abandoned lots in Detroit have been converted into community gardens that provide fresh produce to neighbourhoods previously classified as food deserts.

Question 3: The 2023 study found that cities with established urban gardening programmes experienced a 15% reduction in food-related carbon emissions and measurable improvement in居民 mental health indicators.

Question 4: The author presents a balanced view but ultimately supports urban gardening, citing evidence of its ecological, social, and health benefits.

Question 5: The main purpose of the passage is to discuss the growth, benefits, and future prospects of urban gardening in modern cities.`,
    criteria: [
      { label: "Reading Comprehension", band: 8, comment: "Reader correctly identifies key details, author's purpose, and supporting evidence." },
      { label: "Inference Skills", band: 8, comment: "Draws logical conclusions from implicit information in the passage." },
      { label: "Vocabulary in Context", band: 8, comment: "Understands meaning of words as used in context, including less common items." },
      { label: "Detail Identification", band: 8, comment: "Accurately locates and extracts specific information from the text." },
    ],
    tips: [
      "Always read the questions before the passage to know what to look for.",
      "Pay attention to signal words: 'however', 'furthermore', 'according to'.",
      "For True/False/Not Given, only use information explicitly stated in the passage.",
      "Practice skimming for main ideas and scanning for specific details."
    ],
  },
  {
    id: "ma-reading-2",
    title: "Reading Passage — Digital Literacy (Band 7)",
    category: "technology",
    skill: "reading",
    band: 7,
    prompt: `Read the passage and answer the questions.\n\nDigital literacy has become as fundamental as traditional literacy in the modern world. The ability to find, evaluate, and communicate information through various digital platforms is now essential for participation in civic, economic, and social life. Yet significant disparities persist in digital skills across age groups, income levels, and geographic regions.\n\nA report by the OECD found that approximately 30% of adults in developed countries lack basic digital skills, struggling with tasks such as sending emails, using search engines, or completing online forms. This digital divide disproportionately affects elderly populations and those with lower educational attainment.\n\nEducational institutions are increasingly integrating digital literacy into their curricula. Finland, often cited as a leader in education reform, introduced computational thinking and digital citizenship as core subjects in primary schools as early as 2016. The results have been promising, with Finnish students consistently ranking among the top performers in international assessments.\n\nHowever, critics caution that teaching technical skills alone is insufficient. True digital literacy encompasses critical thinking about online information, understanding privacy and data protection, recognising misinformation, and using technology ethically. Without these broader competencies, individuals remain vulnerable to manipulation and exploitation in the digital sphere.`,
    answer: `Question 1: Digital literacy is defined as the ability to find, evaluate, and communicate information through various digital platforms.

Question 2: According to the OECD report, approximately 30% of adults in developed countries lack basic digital skills.

Question 3: Finland introduced computational thinking and digital citizenship as core subjects in primary schools in 2016.

Question 4: Critics argue that true digital literacy includes critical thinking, privacy awareness, recognising misinformation, and ethical use of technology — not just technical skills.

Question 5: The author's main argument is that digital literacy is essential but must go beyond technical skills to include critical and ethical competencies.`,
    criteria: [
      { label: "Reading Comprehension", band: 7, comment: "Good understanding of main ideas and supporting details." },
      { label: "Inference Skills", band: 7, comment: "Can draw reasonable inferences from the text." },
      { label: "Vocabulary in Context", band: 7, comment: "Understands most vocabulary in context, including some less common terms." },
      { label: "Detail Identification", band: 7, comment: "Accurately identifies most specific information." },
    ],
    tips: [
      "Underline key statistics and names as you read — they often appear in questions.",
      "Distinguish between the author's opinion and facts presented.",
      "For summary completion, ensure your answer fits grammatically in the gap.",
      "Manage your time: spend no more than 20 minutes per passage."
    ],
  },
  // ── Listening Model Answers ──
  {
    id: "ma-listening-1",
    title: "Listening Section 1 — Hotel Booking (Band 8)",
    category: "travel",
    skill: "listening",
    band: 8,
    prompt: "Listen to the conversation between a hotel receptionist and a guest making a reservation. Answer the following questions based on what you hear.\n\n1. What is the guest's booking reference?\n2. How many nights will the guest be staying?\n3. What time is check-out?\n4. Does the guest request a room with a view?\n5. What additional service does the guest book?",
    answer: `1. The booking reference is BK7429. The receptionist confirms: "Your booking reference is BK7429."

2. The guest will be staying for 3 nights (arriving Friday, departing Monday).

3. Check-out time is at 11:00 am. The receptionist states: "Check-out is at eleven am, but we can offer a late check-out until noon if needed."

4. Yes, the guest requests a room with a garden view. The receptionist confirms availability on the third floor.

5. The guest also books an airport transfer for Monday morning at 6:30 am.`,
    criteria: [
      { label: "Listening for Detail", band: 8, comment: "Correctly identifies all specific information from the audio." },
      { label: "Note-taking", band: 8, comment: "Effective at capturing key details while listening." },
      { label: "Number Recognition", band: 8, comment: "Accurately records numbers, times, and references." },
      { label: "Inference", band: 8, comment: "Can infer unstated information from context." },
    ],
    tips: [
      "Read the questions before the audio plays — know what information to listen for.",
      "Write answers as you hear them; don't try to remember everything.",
      "Pay attention to corrections: speakers sometimes change their answers mid-sentence.",
      "Check spelling and word limits carefully on the answer sheet."
    ],
  },
  {
    id: "ma-listening-2",
    title: "Listening Section 3 — Academic Discussion (Band 7)",
    category: "education",
    skill: "listening",
    band: 7,
    prompt: "Listen to a discussion between two students about their research project on climate change. Answer:\n\n1. What topic did they choose for their presentation?\n2. Who will handle the data analysis section?\n3. What is the deadline for the first draft?\n4. What source did they decide to use for statistics?\n5. When will they meet again to review progress?",
    answer: `1. They chose 'The Impact of Urbanisation on Local Climate Patterns' as their presentation topic.

2. Sarah will handle the data analysis section, as she has experience with statistical software.

3. The deadline for the first draft is November 15th.

4. They decided to use the World Climate Database for their statistics, as it provides reliable and up-to-date data.

5. They will meet again on Thursday at 3 pm in the library to review their progress.`,
    criteria: [
      { label: "Listening for Detail", band: 7, comment: "Captures most key details accurately." },
      { label: "Note-taking", band: 7, comment: "Good note-taking skills with minor omissions." },
      { label: "Speaker Identification", band: 7, comment: "Can distinguish between different speakers in a conversation." },
      { label: "Inference", band: 7, comment: "Makes reasonable inferences from the discussion." },
    ],
    tips: [
      "In academic discussions, pay attention to which speaker says what.",
      "Note down names, dates, and specific references as they are mentioned.",
      "Speakers may disagree initially but reach consensus — follow the final decision.",
      "Practice with academic podcasts and lectures to improve comprehension."
    ],
  },
];

export function getAnswersByCategory(category: string): ModelAnswer[] {
  return MODEL_ANSWERS.filter((a) => a.category === category);
}

export function getAnswersBySkill(skill: "writing" | "speaking" | "reading" | "listening"): ModelAnswer[] {
  return MODEL_ANSWERS.filter((a) => a.skill === skill);
}

export function getAnswersByBand(minBand: number): ModelAnswer[] {
  return MODEL_ANSWERS.filter((a) => a.band >= minBand);
}
