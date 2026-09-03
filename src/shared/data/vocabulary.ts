export interface VocabWord {
  word: string;
  definition: string;
  example: string;
  synonym: string;
  antonym: string;
  topic: VocabTopic;
  difficulty: "beginner" | "intermediate" | "advanced";
  ieltsFrequency: "high" | "medium" | "low";
}

export type VocabTopic =
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

export const VOCAB_TOPICS: { id: VocabTopic; label: string; icon: string }[] = [
  { id: "education", label: "Education", icon: "BookOpen" },
  { id: "environment", label: "Environment", icon: "Leaf" },
  { id: "technology", label: "Technology", icon: "Cpu" },
  { id: "health", label: "Health", icon: "Heart" },
  { id: "society", label: "Society", icon: "Users" },
  { id: "economy", label: "Economy", icon: "TrendingUp" },
  { id: "crime", label: "Crime", icon: "Shield" },
  { id: "transport", label: "Transport", icon: "Car" },
  { id: "media", label: "Media", icon: "Newspaper" },
  { id: "government", label: "Government", icon: "Landmark" },
  { id: "work", label: "Work", icon: "Briefcase" },
  { id: "family", label: "Family", icon: "Home" },
];

export const VOCABULARY: VocabWord[] = [
  // Education
  { word: "curriculum", definition: "The subjects comprising a course of study", example: "The national curriculum was updated to include digital literacy.", synonym: "syllabus", antonym: "—", topic: "education", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "pedagogy", definition: "The method and practice of teaching", example: "Modern pedagogy emphasizes student-centered learning.", synonym: "teaching methodology", antonym: "—", topic: "education", difficulty: "advanced", ieltsFrequency: "medium" },
  { word: "literate", definition: "Able to read and write; well-educated", example: "Universal literacy is a goal of many developing nations.", synonym: "educated", antonym: "illiterate", topic: "education", difficulty: "beginner", ieltsFrequency: "high" },
  { word: "discipline", definition: "A branch of knowledge or field of study", example: "Psychology is a relatively young academic discipline.", synonym: "field", antonym: "—", topic: "education", difficulty: "beginner", ieltsFrequency: "high" },
  { word: "nurture", definition: "To care for and encourage growth", example: "Schools should nurture creativity in young students.", synonym: "foster", antonym: "neglect", topic: "education", difficulty: "intermediate", ieltsFrequency: "medium" },
  { word: "compulsory", definition: "Required by law or regulation", example: "Education is compulsory for children aged 6 to 16.", synonym: "mandatory", antonym: "optional", topic: "education", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "plagiarism", definition: "Copying someone else's work without permission", example: "Universities have strict policies against plagiarism.", synonym: "copying", antonym: "originality", topic: "education", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "rote learning", definition: "Memorization through repetition", example: "Rote learning is often criticized for not developing critical thinking.", synonym: "memorization", antonym: "critical thinking", topic: "education", difficulty: "intermediate", ieltsFrequency: "medium" },
  { word: "tenure", definition: "A permanent position, especially in academia", example: "Tenure provides job security for professors.", synonym: "permanence", antonym: "probation", topic: "education", difficulty: "advanced", ieltsFrequency: "low" },
  { word: "scholarship", definition: "A grant of financial aid for a student", example: "She received a full scholarship to study abroad.", synonym: "bursary", antonym: "—", topic: "education", difficulty: "beginner", ieltsFrequency: "high" },

  // Environment
  { word: "sustainable", definition: "Able to continue without depleting resources", example: "Sustainable development meets present needs without compromising the future.", synonym: "renewable", antonym: "unsustainable", topic: "environment", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "biodiversity", definition: "The variety of life in a particular habitat", example: "Deforestation threatens the biodiversity of tropical rainforests.", synonym: "biological diversity", antonym: "monoculture", topic: "environment", difficulty: "advanced", ieltsFrequency: "high" },
  { word: "emission", definition: "The release of gas or radiation into the atmosphere", example: "Carbon emissions must be reduced to combat climate change.", synonym: "discharge", antonym: "absorption", topic: "environment", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "renewable", definition: "A resource that can be replenished naturally", example: "Solar and wind are renewable sources of energy.", synonym: "sustainable", antonym: "non-renewable", topic: "environment", difficulty: "beginner", ieltsFrequency: "high" },
  { word: "deforestation", definition: "The clearing of trees on a large scale", example: "Deforestation contributes to global warming and habitat loss.", synonym: "clear-cutting", antonym: "reforestation", topic: "environment", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "ecosystem", definition: "A community of living organisms and their environment", example: "Coral reefs are fragile ecosystems threatened by pollution.", synonym: "biome", antonym: "—", topic: "environment", difficulty: "intermediate", ieltsFrequency: "medium" },
  { word: "contamination", definition: "The act of making something impure or poisonous", example: "Water contamination poses a serious risk to public health.", synonym: "pollution", antonym: "purification", topic: "environment", difficulty: "intermediate", ieltsFrequency: "medium" },
  { word: "conservation", definition: "The protection of natural resources", example: "Conservation efforts have helped save endangered species.", synonym: "preservation", antonym: "destruction", topic: "environment", difficulty: "beginner", ieltsFrequency: "high" },
  { word: "drought", definition: "A prolonged period of abnormally low rainfall", example: "The drought devastated agricultural production in the region.", synonym: "aridity", antonym: "flood", topic: "environment", difficulty: "beginner", ieltsFrequency: "medium" },
  { word: "fossil fuel", definition: "A natural fuel formed from remains of living organisms", example: "Reliance on fossil fuels is a major contributor to climate change.", synonym: "—", antonym: "renewable energy", topic: "environment", difficulty: "beginner", ieltsFrequency: "high" },

  // Technology
  { word: "innovation", definition: "The introduction of new ideas or methods", example: "Technological innovation has transformed the way we communicate.", synonym: "invention", antonym: "stagnation", topic: "technology", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "automation", definition: "The use of machines to do tasks without human control", example: "Automation in manufacturing has increased productivity.", synonym: "mechanization", antonym: "manual labor", topic: "technology", difficulty: "intermediate", ieltsFrequency: "medium" },
  { word: "artificial intelligence", definition: "Computer systems that can perform tasks requiring human intelligence", example: "Artificial intelligence is revolutionizing healthcare diagnostics.", synonym: "AI", antonym: "—", topic: "technology", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "obsolete", definition: "No longer in use or produced", example: "Smartphones have made many older devices obsolete.", synonym: "outdated", antonym: "modern", topic: "technology", difficulty: "intermediate", ieltsFrequency: "medium" },
  { word: "cybersecurity", definition: "The protection of computer systems from theft or damage", example: "Investment in cybersecurity is essential for modern businesses.", synonym: "information security", antonym: "—", topic: "technology", difficulty: "advanced", ieltsFrequency: "medium" },
  { word: "algorithm", definition: "A set of rules for solving a problem", example: "Search engines use complex algorithms to rank web pages.", synonym: "procedure", antonym: "—", topic: "technology", difficulty: "advanced", ieltsFrequency: "medium" },
  { word: "bandwidth", definition: "The maximum rate of data transfer", example: "Streaming video requires significant bandwidth.", synonym: "capacity", antonym: "—", topic: "technology", difficulty: "advanced", ieltsFrequency: "low" },
  { word: "digital divide", definition: "The gap between those with and without access to technology", example: "The digital divide affects rural communities disproportionately.", synonym: "technology gap", antonym: "digital equality", topic: "technology", difficulty: "advanced", ieltsFrequency: "high" },
  { word: "compatibility", definition: "The ability of systems to work together", example: "Software compatibility is crucial when upgrading systems.", synonym: "interoperability", antonym: "incompatibility", topic: "technology", difficulty: "intermediate", ieltsFrequency: "low" },
  { word: "surveillance", definition: "Close observation of a person or group", example: "CCTV surveillance is widespread in urban areas.", synonym: "monitoring", antonym: "privacy", topic: "technology", difficulty: "advanced", ieltsFrequency: "medium" },

  // Health
  { word: "sedentary", definition: "Tending to spend much time seated", example: "A sedentary lifestyle increases the risk of heart disease.", synonym: "inactive", antonym: "active", topic: "health", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "epidemic", definition: "A widespread occurrence of a disease", example: "Obesity has become an epidemic in many developed countries.", synonym: "outbreak", antonym: "—", topic: "health", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "nutrition", definition: "The process of providing food necessary for health", example: "Good nutrition is essential for child development.", synonym: "nourishment", antonym: "malnutrition", topic: "health", difficulty: "beginner", ieltsFrequency: "high" },
  { word: "prevalent", definition: "Widespread in a particular area or time", example: "Mental health issues are increasingly prevalent among young people.", synonym: "common", antonym: "rare", topic: "health", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "chronic", definition: "Long-lasting and difficult to cure", example: "Chronic stress can lead to serious health problems.", synonym: "persistent", antonym: "acute", topic: "health", difficulty: "intermediate", ieltsFrequency: "medium" },
  { word: "immunization", definition: "The process of making a person immune to infection", example: "Childhood immunization programs have reduced disease rates.", synonym: "vaccination", antonym: "—", topic: "health", difficulty: "intermediate", ieltsFrequency: "medium" },
  { word: "obesity", definition: "The condition of being grossly overweight", example: "Childhood obesity is linked to poor dietary habits.", synonym: "overweight", antonym: "underweight", topic: "health", difficulty: "beginner", ieltsFrequency: "high" },
  { word: "wellbeing", definition: "The state of being comfortable and healthy", example: "Employers are increasingly focusing on employee wellbeing.", synonym: "welfare", antonym: "illness", topic: "health", difficulty: "beginner", ieltsFrequency: "high" },
  { word: "pathogen", definition: "An organism that causes disease", example: "Vaccines help the body fight against dangerous pathogens.", synonym: "germ", antonym: "antibody", topic: "health", difficulty: "advanced", ieltsFrequency: "medium" },
  { word: "remedy", definition: "A medicine or treatment for a disease or injury", example: "There is no simple remedy for the obesity crisis.", synonym: "cure", antonym: "problem", topic: "health", difficulty: "intermediate", ieltsFrequency: "medium" },

  // Society
  { word: "inequality", definition: "The state of not being equal in status or rights", example: "Income inequality has widened in recent decades.", synonym: "disparity", antonym: "equality", topic: "society", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "diversity", definition: "The state of having variety, especially in ethnic culture", example: "Cultural diversity enriches society and promotes understanding.", synonym: "variety", antonym: "uniformity", topic: "society", difficulty: "beginner", ieltsFrequency: "high" },
  { word: "integration", definition: "The act of combining or being combined", example: "Social integration of immigrants benefits the wider community.", synonym: "inclusion", antonym: "segregation", topic: "society", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "welfare", definition: "The health and happiness of a person or group", example: "The government should prioritize the welfare of its citizens.", synonym: "wellbeing", antonym: "hardship", topic: "society", difficulty: "beginner", ieltsFrequency: "high" },
  { word: "poverty", definition: "The state of being extremely poor", example: "Millions of people worldwide live in poverty.", synonym: "destitution", antonym: "wealth", topic: "society", difficulty: "beginner", ieltsFrequency: "high" },
  { word: "discrimination", definition: "Unjust treatment based on race, age, or gender", example: "Anti-discrimination laws protect workers from unfair treatment.", synonym: "prejudice", antonym: "fairness", topic: "society", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "cohesion", definition: "The action of forming a united whole", example: "Social cohesion is vital for a stable society.", synonym: "unity", antonym: "division", topic: "society", difficulty: "intermediate", ieltsFrequency: "medium" },
  { word: "multiculturalism", definition: "The presence of diverse cultures in a society", example: "Multiculturalism promotes tolerance and mutual respect.", synonym: "cultural diversity", antonym: "assimilation", topic: "society", difficulty: "advanced", ieltsFrequency: "medium" },
  { word: "empowerment", definition: "The process of gaining confidence and control", example: "Women's empowerment is key to economic development.", synonym: "enablement", antonym: "oppression", topic: "society", difficulty: "intermediate", ieltsFrequency: "medium" },
  { word: "altruism", definition: "Selfless concern for the well-being of others", example: "Altruism drives charitable giving and volunteer work.", synonym: "selflessness", antonym: "selfishness", topic: "society", difficulty: "advanced", ieltsFrequency: "low" },

  // Economy
  { word: "recession", definition: "A significant decline in economic activity", example: "The recession led to widespread job losses.", synonym: "downturn", antonym: "boom", topic: "economy", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "inflation", definition: "A general increase in prices over time", example: "High inflation erodes the purchasing power of consumers.", synonym: "price rise", antonym: "deflation", topic: "economy", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "unemployment", definition: "The state of being without a job", example: "Youth unemployment is a growing concern in many countries.", synonym: "joblessness", antonym: "employment", topic: "economy", difficulty: "beginner", ieltsFrequency: "high" },
  { word: "globalization", definition: "The process of interaction among people worldwide", example: "Globalization has increased trade between nations.", synonym: "internationalization", antonym: "isolation", topic: "economy", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "entrepreneur", definition: "A person who starts a business and takes risks", example: "Young entrepreneurs are creating innovative startups.", synonym: "business owner", antonym: "employee", topic: "economy", difficulty: "intermediate", ieltsFrequency: "medium" },
  { word: "subsidiary", definition: "A company controlled by a holding company", example: "The subsidiary operates independently in foreign markets.", synonym: "branch", antonym: "parent company", topic: "economy", difficulty: "advanced", ieltsFrequency: "low" },
  { word: "revenue", definition: "Income generated from business activities", example: "The company's revenue increased by 15% last quarter.", synonym: "income", antonym: "expense", topic: "economy", difficulty: "intermediate", ieltsFrequency: "medium" },
  { word: "tariff", definition: "A tax on imported or exported goods", example: "New tariffs on steel imports raised consumer prices.", synonym: "duty", antonym: "subsidy", topic: "economy", difficulty: "advanced", ieltsFrequency: "medium" },
  { word: "austerity", definition: "Difficult economic conditions from reduced spending", example: "Austerity measures affected public services significantly.", synonym: "frugality", antonym: "prosperity", topic: "economy", difficulty: "advanced", ieltsFrequency: "medium" },
  { word: "monopoly", definition: "Exclusive ownership or control of a market", example: "The government broke up the telecommunications monopoly.", synonym: "dominance", antonym: "competition", topic: "economy", difficulty: "advanced", ieltsFrequency: "medium" },

  // Crime
  { word: "deterrent", definition: "Something that discourages an action", example: "Harsh penalties act as a deterrent to violent crime.", synonym: "discouragement", antonym: "incentive", topic: "crime", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "recidivism", definition: "The tendency to reoffend", example: "Education programs in prison reduce recidivism rates.", synonym: "relapse", antonym: "rehabilitation", topic: "crime", difficulty: "advanced", ieltsFrequency: "medium" },
  { word: "surveillance", definition: "Close monitoring of a person or area", example: "Increased surveillance has helped reduce street crime.", synonym: "monitoring", antonym: "neglect", topic: "crime", difficulty: "intermediate", ieltsFrequency: "medium" },
  { word: "penalty", definition: "A punishment for breaking a law or rule", example: "The penalty for drug trafficking is severe in many countries.", synonym: "punishment", antonym: "reward", topic: "crime", difficulty: "beginner", ieltsFrequency: "high" },
  { word: "juvenile", definition: "A young person, especially one below the age of majority", example: "Juvenile offenders should be treated differently from adults.", synonym: "minor", antonym: "adult", topic: "crime", difficulty: "intermediate", ieltsFrequency: "medium" },
  { word: "rehabilitation", definition: "Restoring someone to normal life through training", example: "Rehabilitation is more effective than long-term imprisonment.", synonym: "recovery", antonym: "punishment", topic: "crime", difficulty: "intermediate", ieltsFrequency: "medium" },
  { word: "fraud", definition: "Criminal deception for financial gain", example: "Online fraud has increased dramatically with digital banking.", synonym: "scam", antonym: "honesty", topic: "crime", difficulty: "beginner", ieltsFrequency: "high" },
  { word: "vandalism", definition: "Deliberate destruction of property", example: "Vandalism is a common problem in urban areas.", synonym: "destruction", antonym: "preservation", topic: "crime", difficulty: "beginner", ieltsFrequency: "medium" },
  { word: "retribution", definition: "Punishment inflicted as vengeance", example: "Some argue the justice system focuses too much on retribution.", synonym: "revenge", antonym: "forgiveness", topic: "crime", difficulty: "advanced", ieltsFrequency: "low" },
  { word: "incarceration", definition: "The state of being confined in prison", example: "Mass incarceration has become a controversial social issue.", synonym: "imprisonment", antonym: "liberation", topic: "crime", difficulty: "advanced", ieltsFrequency: "medium" },

  // Transport
  { word: "congestion", definition: "Overcrowding of traffic on roads", example: "Traffic congestion costs billions in lost productivity.", synonym: "gridlock", antonym: "flow", topic: "transport", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "infrastructure", definition: "The basic systems needed for a society to function", example: "Investment in transport infrastructure boosts economic growth.", synonym: "framework", antonym: "—", topic: "transport", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "commute", definition: "To travel regularly between home and work", example: "Long commutes reduce quality of life for many workers.", synonym: "travel", antonym: "—", topic: "transport", difficulty: "beginner", ieltsFrequency: "high" },
  { word: "pedestrian", definition: "A person walking rather than travelling in a vehicle", example: "Pedestrian zones improve safety in city centers.", synonym: "walker", antonym: "driver", topic: "transport", difficulty: "beginner", ieltsFrequency: "medium" },
  { word: "sustainable transport", definition: "Methods of travel that have minimal environmental impact", example: "Cycling is a form of sustainable transport.", synonym: "green transport", antonym: "private car", topic: "transport", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "logistics", definition: "The detailed coordination of a complex operation", example: "E-commerce requires efficient logistics and delivery networks.", synonym: "organization", antonym: "—", topic: "transport", difficulty: "advanced", ieltsFrequency: "medium" },
  { word: "commuter", definition: "A person who travels some distance to work regularly", example: "Commuters face longer journey times due to construction.", synonym: "traveller", antonym: "—", topic: "transport", difficulty: "beginner", ieltsFrequency: "medium" },
  { word: "vehicular", definition: "Relating to or designed for vehicles", example: "Vehicular emissions are a major source of air pollution.", synonym: "automotive", antonym: "pedestrian", topic: "transport", difficulty: "advanced", ieltsFrequency: "low" },
  { word: "emission", definition: "The discharge of something, especially gas or radiation", example: "Vehicle emissions contribute to urban air pollution.", synonym: "discharge", antonym: "absorption", topic: "transport", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "mobility", definition: "The ability to move freely and easily", example: "Electric scooters have increased urban mobility.", synonym: "movement", antonym: "immobility", topic: "transport", difficulty: "intermediate", ieltsFrequency: "medium" },

  // Media
  { word: "biased", definition: "Unfairly prejudiced for or against something", example: "Media bias can distort public perception of events.", synonym: "prejudiced", antonym: "impartial", topic: "media", difficulty: "beginner", ieltsFrequency: "high" },
  { word: "censorship", definition: "The suppression of speech or information", example: "Internet censorship is a major issue in some countries.", synonym: "suppression", antonym: "freedom", topic: "media", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "propaganda", definition: "Information used to promote a political cause", example: "Wartime propaganda shaped public opinion significantly.", synonym: "misinformation", antonym: "truth", topic: "media", difficulty: "intermediate", ieltsFrequency: "medium" },
  { word: "journalism", definition: "The activity of writing for newspapers or broadcasting", example: "Investigative journalism plays a vital role in democracy.", synonym: "reporting", antonym: "—", topic: "media", difficulty: "beginner", ieltsFrequency: "medium" },
  { word: "tabloid", definition: "A newspaper with short, sensational stories", example: "Tabloid newspapers often prioritize entertainment over facts.", synonym: "gossip paper", antonym: "broadsheet", topic: "media", difficulty: "intermediate", ieltsFrequency: "medium" },
  { word: "misinformation", definition: "False or inaccurate information spread unintentionally", example: "Social media has become a major source of misinformation.", synonym: "disinformation", antonym: "accurate information", topic: "media", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "broadcast", definition: "To transmit a program by radio or television", example: "The event was broadcast live to millions of viewers.", synonym: "transmit", antonym: "receive", topic: "media", difficulty: "beginner", ieltsFrequency: "medium" },
  { word: "sensationalism", definition: "The use of exciting or shocking stories to attract attention", example: "Sensationalism in the media can create unnecessary fear.", synonym: "exaggeration", antonym: "objectivity", topic: "media", difficulty: "advanced", ieltsFrequency: "medium" },
  { word: "content creator", definition: "A person who produces digital content for online platforms", example: "Many young people aspire to become content creators.", synonym: "digital creator", antonym: "consumer", topic: "media", difficulty: "beginner", ieltsFrequency: "medium" },
  { word: "infotainment", definition: "Television programs that combine information and entertainment", example: "Infotainment has blurred the line between news and entertainment.", synonym: "edutainment", antonym: "—", topic: "media", difficulty: "advanced", ieltsFrequency: "low" },

  // Government
  { word: "democracy", definition: "A system of government by the whole population", example: "Democracy allows citizens to participate in political decisions.", synonym: "self-governance", antonym: "dictatorship", topic: "government", difficulty: "beginner", ieltsFrequency: "high" },
  { word: "legislation", definition: "Laws considered collectively", example: "New legislation was introduced to protect consumer rights.", synonym: "law", antonym: "anarchy", topic: "government", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "bureaucracy", definition: "A system of government with many complicated rules", example: "Excessive bureaucracy slows down business development.", synonym: "administration", antonym: "—", topic: "government", difficulty: "advanced", ieltsFrequency: "medium" },
  { word: "corruption", definition: "Dishonest or fraudulent conduct by those in power", example: "Government corruption undermines public trust.", synonym: "malpractice", antonym: "integrity", topic: "government", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "referendum", definition: "A vote on a particular proposal", example: "The referendum on independence divided the nation.", synonym: "plebiscite", antonym: "—", topic: "government", difficulty: "advanced", ieltsFrequency: "medium" },
  { word: "sovereignty", definition: "Supreme power or authority over a territory", example: "National sovereignty is a key principle in international law.", synonym: "autonomy", antonym: "dependence", topic: "government", difficulty: "advanced", ieltsFrequency: "medium" },
  { word: "taxation", definition: "The levying of taxes by the government", example: "Taxation policy affects income distribution in society.", synonym: "tax collection", antonym: "exemption", topic: "government", difficulty: "intermediate", ieltsFrequency: "medium" },
  { word: "accountability", definition: "The fact of being responsible for actions", example: "Politicians should be held to a higher standard of accountability.", synonym: "responsibility", antonym: "irresponsibility", topic: "government", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "regulate", definition: "To control or maintain the rate of something", example: "The government must regulate the banking sector more strictly.", synonym: "control", antonym: "deregulate", topic: "government", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "civic", definition: "Relating to a city or town and its citizens", example: "Civic engagement is essential for a healthy democracy.", synonym: "municipal", antonym: "national", topic: "government", difficulty: "intermediate", ieltsFrequency: "medium" },

  // Work
  { word: "redundancy", definition: "The state of being no longer needed at work", example: "Many workers faced redundancy during the economic downturn.", synonym: "layoff", antonym: "employment", topic: "work", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "freelance", definition: "Working independently rather than for an employer", example: "More people are choosing freelance work for flexibility.", synonym: "independent", antonym: "employed", topic: "work", difficulty: "beginner", ieltsFrequency: "medium" },
  { word: "colleague", definition: "A person with whom one works", example: "She discussed the project with her colleagues.", synonym: "coworker", antonym: "stranger", topic: "work", difficulty: "beginner", ieltsFrequency: "high" },
  { word: "productivity", definition: "The effectiveness of productive effort", example: "Flexible working hours can increase employee productivity.", synonym: "efficiency", antonym: "inefficiency", topic: "work", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "occupational", definition: "Relating to a person's job or profession", example: "Occupational health and safety laws protect workers.", synonym: "professional", antonym: "personal", topic: "work", difficulty: "intermediate", ieltsFrequency: "medium" },
  { word: "retirement", definition: "The action of leaving one's job and ceasing to work", example: "The retirement age is gradually increasing in many countries.", synonym: "pension", antonym: "employment", topic: "work", difficulty: "beginner", ieltsFrequency: "medium" },
  { word: "promotion", definition: "Advancement to a higher position at work", example: "Hard work and dedication led to her promotion.", synonym: "advancement", antonym: "demotion", topic: "work", difficulty: "beginner", ieltsFrequency: "medium" },
  { word: "negotiate", definition: "To discuss something to reach an agreement", example: "Workers negotiated for better pay and conditions.", synonym: "bargain", antonym: "demand", topic: "work", difficulty: "intermediate", ieltsFrequency: "high" },
  { word: "apprenticeship", definition: "A system of training a new generation of practitioners", example: "An apprenticeship provides valuable hands-on experience.", synonym: "internship", antonym: "—", topic: "work", difficulty: "intermediate", ieltsFrequency: "medium" },
  { word: "autonomy", definition: "The right to self-govern; independence", example: "Employees value autonomy and flexible working arrangements.", synonym: "independence", antonym: "dependence", topic: "work", difficulty: "intermediate", ieltsFrequency: "medium" },

  // Family
  { word: "nuclear family", definition: "A family unit of two parents and their children", example: "The nuclear family is the most common family structure.", synonym: "immediate family", antonym: "extended family", topic: "family", difficulty: "beginner", ieltsFrequency: "high" },
  { word: "extended family", definition: "A family including parents, children, and other relatives", example: "Extended families often provide childcare support.", synonym: "relatives", antonym: "nuclear family", topic: "family", difficulty: "beginner", ieltsFrequency: "high" },
  { word: "upbringing", definition: "The way a child is raised and taught to behave", example: "A child's upbringing significantly influences their character.", synonym: "rearing", antonym: "—", topic: "family", difficulty: "intermediate", ieltsFrequency: "medium" },
  { word: "parental", definition: "Relating to a parent or parents", example: "Parental involvement in education improves student outcomes.", synonym: "familial", antonym: "—", topic: "family", difficulty: "intermediate", ieltsFrequency: "medium" },
  { word: "custody", definition: "The care and control of a child after separation", example: "The court granted custody to the mother.", synonym: "care", antonym: "abandonment", topic: "family", difficulty: "intermediate", ieltsFrequency: "medium" },
  { word: "household", definition: "A house and its occupants considered as a unit", example: "Dual-income households are now the norm in many countries.", synonym: "home", antonym: "—", topic: "family", difficulty: "beginner", ieltsFrequency: "medium" },
  { word: "generation", definition: "All the people born around the same time", example: "There is often a generation gap between parents and children.", synonym: "cohort", antonym: "—", topic: "family", difficulty: "beginner", ieltsFrequency: "high" },
  { word: "sibling", definition: "A brother or sister", example: "Sibling rivalry is common in many families.", synonym: "brother/sister", antonym: "—", topic: "family", difficulty: "intermediate", ieltsFrequency: "medium" },
  { word: "adolescent", definition: "A young person developing into an adult", example: "Adolescents need proper guidance during this critical period.", synonym: "teenager", antonym: "adult", topic: "family", difficulty: "intermediate", ieltsFrequency: "medium" },
  { word: "foster", definition: "To encourage the development of something", example: "Schools should foster strong family-school relationships.", synonym: "encourage", antonym: "discourage", topic: "family", difficulty: "intermediate", ieltsFrequency: "medium" },
];
