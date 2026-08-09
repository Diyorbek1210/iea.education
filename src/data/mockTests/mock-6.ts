import { speakingPart1, speakingPart2, speakingPart3, type MockTestSet } from "./types";

export const mock6: MockTestSet = {
  id: "mock-6",
  order: 6,
  title: "IELTS Mock Test 6",
  reading: {
    passages: [
      {
        title: "The Story of Glass",
        passage:
          "Few materials surround us as constantly, yet pass as unnoticed, as glass. It holds our water, forms our windows and screens, and carries most of the world's data, yet its story stretches back several thousand years. Stone Age peoples made tools from obsidian, a natural glass formed by volcanoes, but the first glass deliberately manufactured by humans appeared around 1500 BCE, probably in Mesopotamia or Egypt, in the form of small vessels shaped around a removable clay core. The decisive breakthrough came on the Syrian coast in the first century BCE with the invention of glassblowing: blowing molten glass through an iron pipe allowed thin-walled vessels to be produced quickly and cheaply, and under the Roman Empire glass became an everyday material, used even for windows in wealthy houses. After the fall of Rome, glassmaking survived in monasteries and, above all, in Venice, where in 1291 the authorities ordered all glass furnaces to relocate to the island of Murano. The official reason was the fear that furnace fires would destroy the crowded city, but the ruling also protected Venetian trade secrets, since the craftsmen on Murano were effectively forbidden to leave. In 1674 the English glassmaker George Ravenscroft patented lead crystal, a brilliant, heavy glass that transformed the market for fine tableware. Industrialisation brought machines: in the early nineteen hundreds the American inventor Michael Owens automated bottle manufacture, multiplying output many times over. The modern era of flat glass began in Britain, where Alastair Pilkington announced the float-glass process in 1959 after seven years of secret experiments; in this method, molten glass flows onto a bath of molten tin and spreads into a perfectly flat sheet, eliminating the laborious grinding and polishing previously required. Glass then found an entirely new purpose. In 1966, Charles Kao and George Hockham proposed that extremely pure glass fibres could carry information as pulses of light, and by 1970 researchers at Corning Glass Works had produced fibre with losses low enough for real telecommunications — the origin of the fibre-optic cables on which today's internet depends. Finally, glass has one environmental virtue rare among modern materials: it can be melted down and recycled endlessly without any loss of quality.",
        questions: [
          {
            q: "Which natural glass did Stone Age peoples use for tools?",
            options: ["Quartz", "Obsidian", "Amber", "Sandstone"],
            answer: 1,
          },
          {
            q: "When did the first deliberately manufactured glass appear?",
            options: ["Around 3500 BCE", "In the Roman era", "Around 1500 BCE", "In 1291"],
            answer: 2,
          },
          {
            q: "What did the invention of glassblowing make possible?",
            options: [
              "Thin-walled vessels produced quickly and cheaply",
              "Stained-glass windows for cathedrals",
              "Early eyeglasses",
              "Glass mirrors",
            ],
            answer: 0,
          },
          {
            q: "Where did glassblowing emerge?",
            options: ["In Venice", "In Egypt", "In England", "On the Syrian coast"],
            answer: 3,
          },
          {
            q: "Why were Venice's glass furnaces moved to Murano in 1291?",
            options: [
              "Because land there was cheaper",
              "Officially because of fire risk, and effectively to protect trade secrets",
              "To be closer to raw materials",
              "To attract wealthy tourists",
            ],
            answer: 1,
          },
          {
            q: "Who patented lead crystal in 1674?",
            options: ["Michael Owens", "Alastair Pilkington", "George Ravenscroft", "Charles Kao"],
            answer: 2,
          },
          {
            q: "What did Michael Owens automate?",
            options: [
              "Window manufacture",
              "Float-glass production",
              "Lens grinding",
              "Bottle manufacture",
            ],
            answer: 3,
          },
          {
            q: "What is the key principle of the float-glass process?",
            options: [
              "Glass is pressed between steel rollers",
              "Glass is cooled slowly in ovens",
              "Glass is floated on liquid mercury",
              "Molten glass spreads onto a bath of molten tin",
            ],
            answer: 3,
          },
          {
            q: "When did Pilkington announce the float-glass process?",
            options: ["In 1952", "In 1959", "In 1966", "In 1970"],
            answer: 1,
          },
          {
            q: "What did Kao and Hockham propose in 1966?",
            options: [
              "That glass fibres could carry information as pulses of light",
              "That glass could be recycled",
              "That glass was ideal for telescope mirrors",
              "That glass could strengthen car windows",
            ],
            answer: 0,
          },
          {
            q: "What had researchers at Corning Glass Works achieved by 1970?",
            options: [
              "The first automatic bottle machine",
              "The patent for lead crystal",
              "Fibre with losses low enough for telecommunications",
              "The invention of glassblowing",
            ],
            answer: 2,
          },
          {
            q: "What environmental quality of glass does the passage stress?",
            options: [
              "It can be recycled endlessly without loss of quality",
              "It must be melted with expensive chemicals",
              "It can be recycled only once",
              "Recycling it halves its quality each time",
            ],
            answer: 0,
          },
          {
            q: "What would be the best title for this passage?",
            options: [
              "The Story of Glass",
              "Venetian Artisans and Their Secrets",
              "The Physics of Light",
              "Recycling in Modern Britain",
            ],
            answer: 0,
          },
        ],
      },
      {
        title: "How Wildlife Adapts to Cities",
        passage:
          "More than half of humanity now lives in cities, and wild animals must either adapt to urban life or retreat from it. Surprisingly, some of nature's most successful urban pioneers began their conquest almost a century ago. Red foxes began moving into British towns in the nineteen thirties, and researchers now estimate that there are around one hundred and fifty thousand urban foxes in Britain, surviving on an omnivorous diet that ranges from insects and fruit to discarded takeaway food. City birds, meanwhile, make remarkable acoustic adjustments. Since the rumble of traffic is low-pitched, great tits in noisy districts have been found to sing at higher frequencies, lifting their songs above the din so that they remain audible to rivals and mates; studies in the Netherlands first documented the pattern. Pigeons and taller buildings have even attracted a rapacious new resident: the peregrine falcon, which nests on skyscrapers and cathedral towers in cities on both sides of the Atlantic, treating the streets below as a limitless hunting ground. Urbanisation brings genetic as well as behavioural change. Because cities are typically several degrees warmer than the surrounding countryside — the 'urban heat island' effect — insects enjoy a longer active season, and some urban moth populations now show coloration less suited to soot-darkened trees than their rural ancestors'. Field studies underline how quickly city life can reshape a species. Chicago's Cook County Coyote Project has tracked more than five hundred individual animals, finding that urban coyotes move confidently through rail yards and quiet suburban streets. Experiments with urban raccoons show they are quicker than rural raccoons at opening latched food bins, a difference researchers attribute to learned problem-solving. Even coastal birds have joined the movement inland: herring gulls now follow the weekly rhythm of landfill sites and school lunch breaks in pursuit of food waste. Taken together, these cases suggest that cities are fast becoming laboratories of evolution, with some changes visible within decades rather than the millennia we usually associate with adaptation.",
        questions: [
          {
            q: "When did red foxes begin moving into British towns?",
            options: ["In the 1930s", "In the 1970s", "In 2000", "In the nineteenth century"],
            answer: 0,
          },
          {
            q: "What is the estimated number of urban foxes in Britain?",
            options: ["Around 15,000", "Around 50,000", "Around 150,000", "Around 1.5 million"],
            answer: 2,
          },
          {
            q: "How do great tits in noisy districts adjust their song?",
            options: [
              "They stop singing altogether",
              "They sing only at dawn",
              "They copy the sound of traffic",
              "They sing at higher frequencies",
            ],
            answer: 3,
          },
          {
            q: "Why does a higher pitch help the birds?",
            options: [
              "Insects can only hear high notes",
              "Low-pitched traffic noise would mask their lower notes",
              "Females always prefer higher-pitched songs",
              "High notes travel further over water",
            ],
            answer: 1,
          },
          {
            q: "Where do urban peregrine falcons nest, according to the passage?",
            options: [
              "In street trees",
              "On power cables",
              "On skyscrapers and cathedral towers",
              "In underground stations",
            ],
            answer: 2,
          },
          {
            q: "What is the 'urban heat island' effect?",
            options: [
              "Cities are several degrees warmer than the countryside",
              "Cities are cooler than the countryside at night",
              "It affects cities only in mid-summer",
              "It shortens the active season of insects",
            ],
            answer: 0,
          },
          {
            q: "What has the Cook County Coyote Project done?",
            options: [
              "Released coyotes into city parks",
              "Tracked more than five hundred individual coyotes",
              "Removed all wild coyotes from Chicago",
              "Studied only rural coyote packs",
            ],
            answer: 1,
          },
          {
            q: "What did experiments with latched food bins show about urban raccoons?",
            options: [
              "They cannot learn new tasks",
              "They avoid human areas entirely",
              "They prefer parks to streets",
              "They open them more quickly than rural raccoons",
            ],
            answer: 3,
          },
          {
            q: "What has drawn herring gulls inland?",
            options: ["Salt deposits", "Cleaner air", "Food waste", "River fishing"],
            answer: 2,
          },
          {
            q: "On what timescale do the passage's examples show adaptation occurring?",
            options: [
              "Within decades rather than millennia",
              "Always more slowly than in rural areas",
              "Never, according to researchers",
              "Over many millennia, as usual",
            ],
            answer: 0,
          },
          {
            q: "Which two kinds of change does the passage explicitly distinguish?",
            options: [
              "Changes in colour and size",
              "Changes in diet and habitat",
              "Morning and evening habits",
              "Behavioural and genetic changes",
            ],
            answer: 3,
          },
          {
            q: "Why do urban insects enjoy a longer active season?",
            options: [
              "Because of street lighting",
              "Because cities are warmer",
              "Because there are fewer predators",
              "Because gardens are watered",
            ],
            answer: 1,
          },
          {
            q: "What would be the best title for this passage?",
            options: [
              "The Lives of European Foxes",
              "A Guide to Urban Architecture",
              "How Wildlife Adapts to Cities",
              "Famous Animal Behaviour Experiments",
            ],
            answer: 2,
          },
        ],
      },
      {
        title: "The Neuroscience of Learning a Second Language",
        passage:
          "The question of what a second language does to the brain has moved from philosophy seminar to brain-scanning laboratory over the past century and a half. The scientific study began in 1861, when the French surgeon Paul Broca examined a long-term patient who could say only the single syllable 'Tan'; after the patient's death, Broca identified damage to a region of the left frontal lobe, now called Broca's area, and linked it to the production of speech. Thirteen years later, Carl Wernicke described a different region associated with understanding language. Modern imaging lets researchers watch the bilingual brain in action, with revealing results. A widely cited 2004 study by Andrea Mechelli and colleagues at University College London found that grey matter density in the left inferior parietal cortex increased with second-language proficiency, and was higher in people who had learned their second language early. Functional scans have also shown that both of a bilingual person's languages remain active in the brain even when only one is being used, producing constant low-level competition. Supervising that competition appears to exercise the brain's executive-control network — much as regular training strengthens a muscle. The possible real-world payoff emerged strikingly in a 2013 study in Hyderabad, India, led by Suvarna Alladi, which found that lifelong bilingualism was associated with symptoms of dementia appearing on average about four and a half years later than in comparable monolingual patients. Age of learning still matters enormously: in 1967 Eric Lenneberg proposed a 'critical period', arguing that acquiring a native-like accent and grammar becomes much harder after puberty, a claim still debated today. Adults do begin with advantages — their existing knowledge lets them master grammar rules faster at first — but rarely reach native-level pronunciation. Intriguingly, researchers have also documented a 'foreign-language effect': work by Boaz Keysar and colleagues in 2012 found that people making decisions in a second language respond more deliberately and are less swayed by emotional wording. The picture that emerges is of a brain permanently reshaped by a second language, in ways mostly for the better.",
        questions: [
          {
            q: "What was notable about Paul Broca's patient?",
            options: [
              "He spoke five languages fluently",
              "He could read but not write",
              "He could say only the syllable 'Tan'",
              "He made a complete recovery",
            ],
            answer: 2,
          },
          {
            q: "What did the 2004 University College London study find?",
            options: [
              "Grey matter density increased with second-language proficiency",
              "Grey matter density decreased with age in bilinguals",
              "Grey matter density was identical in all participants",
              "Language learning affected only young children",
            ],
            answer: 0,
          },
          {
            q: "What have functional scans of bilinguals revealed?",
            options: [
              "Only the language in use is active",
              "The brain barely distinguishes languages",
              "Bilingual brains are usually smaller",
              "Both languages remain active even when one is being used",
            ],
            answer: 3,
          },
          {
            q: "What does supervising competition between languages appear to exercise?",
            options: [
              "Hearing",
              "The brain's executive-control network",
              "Long-term vision",
              "Musical ability",
            ],
            answer: 1,
          },
          {
            q: "By how much did the 2013 study find dementia symptoms delayed in lifelong bilinguals?",
            options: [
              "About one month",
              "About ten years",
              "About four and a half years",
              "It found no delay at all",
            ],
            answer: 2,
          },
          {
            q: "What did Lenneberg's critical period hypothesis claim?",
            options: [
              "Native-like accent and grammar become much harder to acquire after puberty",
              "Children cannot learn foreign languages",
              "Adults always learn languages faster",
              "Puberty improves grammatical ability",
            ],
            answer: 0,
          },
          {
            q: "What is the 'foreign-language effect' reported by Keysar's team?",
            options: [
              "Translators make choices almost at random",
              "Decisions in a second language are more deliberate and less swayed by emotional wording",
              "People think better only in their first language",
              "Second languages damage judgement",
            ],
            answer: 1,
          },
          {
            q: "Why do adult learners often progress faster at first?",
            options: [
              "They have fewer distractions",
              "Children's brains work more slowly",
              "Their existing knowledge helps them master grammar rules",
              "They study for more hours per day",
            ],
            answer: 2,
          },
          {
            q: "What do adult learners rarely achieve, according to the passage?",
            options: [
              "Native-level pronunciation",
              "A large vocabulary",
              "Fast reading speed",
              "Good examination marks",
            ],
            answer: 0,
          },
          {
            q: "With what is Broca's area associated?",
            options: ["The sense of smell", "Balance", "Speech production", "Vision"],
            answer: 2,
          },
          {
            q: "Who led the study carried out in Hyderabad?",
            options: ["Andrea Mechelli", "Suvarna Alladi", "Eric Lenneberg", "Carl Wernicke"],
            answer: 1,
          },
          {
            q: "Which metaphor does the passage use to explain how bilingualism trains the brain?",
            options: [
              "A growing tree",
              "A building under construction",
              "A muscle strengthened by regular training",
              "A musical instrument",
            ],
            answer: 3,
          },
          {
            q: "With what was the region described by Carl Wernicke associated?",
            options: [
              "The production of speech",
              "The recognition of faces",
              "The control of breathing",
              "Understanding language",
            ],
            answer: 3,
          },
          {
            q: "What would be the best title for this passage?",
            options: [
              "The Neuroscience of Learning a Second Language",
              "A Brief History of English",
              "How to Memorise Vocabulary Quickly",
              "Brain Surgery in the 1800s",
            ],
            answer: 0,
          },
        ],
      },
    ],
  },
  listening: {
    sections: [
      {
        title: "Section 1: A phone call about an evening language course",
        transcript:
          "Good afternoon, Mendip College of Adult Education, Karen speaking, how can I help you? Certainly — you'd like to enrol on one of our evening language courses. The Spanish course at Level Two runs on Tuesday evenings from half past six until half past eight, here at the main campus on Station Road, and there's also an online version on Thursday evenings at the same time, taught live over video call. The ten-week course costs one hundred and forty pounds, or ninety-five pounds if you're over sixty or receiving benefits, and the first class is on the fifteenth of September. The coursebook isn't included in the fee — it's called Aula Internacional, and you can buy it new from the college shop for twenty-five pounds, or second-hand from about fifteen. Because Level Two isn't a beginners' class, we ask everyone to complete a short online placement test first; it takes around twenty minutes and the results go straight to the tutor, who confirms you're in the right group. Classes are kept small, with a maximum of twelve students, so as long as you enrol by the end of August there shouldn't be any problem finding a place. If you're hesitating, we're holding a free open evening on the second of September, from six until eight, where you can try a sample lesson and meet the tutors. A couple of practical details: the college café closes at eight, so most students eat before class, and parking on campus is free after half past six. Finally, if your plans change, please bear in mind we can only refund your fees up to seven days before the course starts. Shall I email you the link to the placement test now?",
        questions: [
          {
            q: "The on-campus Spanish class runs on ___ evenings.",
            accepted: ["Tuesday", "Tuesdays"],
          },
          {
            q: "The college's main campus is on ___.",
            accepted: ["Station Road", "Station Rd"],
          },
          {
            q: "The ten-week course costs £___ at the full rate.",
            accepted: [
              "140",
              "140 pounds",
              "a hundred and forty pounds",
              "one hundred and forty pounds",
            ],
          },
          {
            q: "Learners over sixty or on benefits pay a reduced fee of £___.",
            accepted: ["95", "95 pounds", "ninety-five pounds"],
          },
          {
            q: "A new coursebook costs £___ from the college shop.",
            accepted: ["25", "25 pounds", "twenty-five pounds"],
          },
          {
            q: "Before joining Level Two, everyone completes a short online ___ test.",
            accepted: ["placement", "placement test"],
          },
          {
            q: "Classes have a maximum of ___ students.",
            accepted: ["12", "twelve", "12 students", "twelve students"],
          },
          {
            q: "The free open evening is on the ___.",
            accepted: [
              "second of September",
              "2nd of September",
              "2nd September",
              "2 September",
              "second September",
            ],
          },
          {
            q: "Parking on campus is free after ___.",
            accepted: ["6:30", "half past six", "six thirty", "half past 6"],
          },
          {
            q: "Fees can be refunded up to ___ days before the course starts.",
            accepted: ["7", "seven", "7 days", "seven days"],
          },
        ],
      },
      {
        title: "Section 2: A talk about a new sports centre",
        transcript:
          "Hello, everyone, and thank you for coming along tonight. I'm Sarah, manager of the new Riverside Sports Centre, and I'm delighted to say we open to the public on the first of October, so in just under three weeks. Let me walk you through the facilities. Our main attraction is a twenty-five-metre pool with six lanes, and because it has a moveable floor, we can adjust the water depth for everything from diving practice to toddlers' lessons, which run on Saturday mornings in six-week blocks. The gym has one hundred and twenty exercise stations, and next door the studio offers forty classes a week, from yoga to spin. If you're feeling adventurous, our climbing wall is eleven metres high, and our instructor resets the routes every month so regulars never get bored. There's also a sports hall marked out for two badminton courts, which converts for five-a-side football in the evenings. Now, membership. Anytime membership costs thirty-eight pounds a month and covers the gym, pool and all classes; off-peak membership is twenty-eight pounds, but entry with that is restricted to between nine and four on weekdays. There is normally a joining fee of fifteen pounds, but that will be waived for anyone who signs up during October. Not ready to commit? Day passes cost eight pounds. Our opening hours are six in the morning until ten at night on weekdays, and eight until eight at weekends, with last entry an hour before closing. Parking is free for up to three hours as long as you validate your ticket at reception. One final point: before your first gym session you must book an induction at reception — it only takes half an hour, but it is compulsory for everyone's safety.",
        questions: [
          {
            q: "The Riverside Sports Centre opens to the public on the ___.",
            accepted: ["first of October", "1st of October", "1st October", "1 October"],
          },
          {
            q: "The twenty-five-metre pool has ___ lanes.",
            accepted: ["6", "six", "6 lanes", "six lanes"],
          },
          {
            q: "Thanks to a moveable floor, staff can adjust the water ___.",
            accepted: ["depth", "water depth"],
          },
          {
            q: "The gym has ___ exercise stations.",
            accepted: ["120", "a hundred and twenty", "one hundred and twenty", "120 stations"],
          },
          {
            q: "The studio offers ___ classes a week.",
            accepted: ["40", "forty", "40 classes", "forty classes"],
          },
          {
            q: "The climbing wall is ___ metres high.",
            accepted: ["11", "eleven", "11 metres", "eleven metres"],
          },
          {
            q: "Anytime membership costs £___ a month.",
            accepted: ["38", "38 pounds", "thirty-eight pounds"],
          },
          {
            q: "Off-peak entry is restricted to between nine and ___ on weekdays.",
            accepted: ["four", "4", "4 p.m.", "four o'clock"],
          },
          {
            q: "The joining fee is waived for anyone who signs up during ___.",
            accepted: ["October", "Oct"],
          },
          {
            q: "On weekdays the centre closes at ___ at night.",
            accepted: ["10", "ten", "10 p.m.", "ten p.m.", "22:00"],
          },
        ],
      },
      {
        title: "Section 3: Students discussing a statistics project with a tutor",
        transcript:
          "Tutor: So, tell me how your statistics project is coming along. Student A: We're investigating whether the number of hours students study each week relates to their end-of-term test scores. Student B: We've designed an online questionnaire and sent it to the whole year group, and we've had sixty replies so far. Tutor: That's a decent sample. And how will you treat the study hours? Student A: We were going to group them into three bands — under five hours, five to fifteen hours, and over fifteen — and then compare the average test scores in each band. Student B: We are a bit worried that self-reported hours may not be entirely honest, though. Tutor: It's good that you've noticed that — make sure you mention it as a limitation in the report. And whatever patterns you find, avoid claiming that study hours cause the scores. Correlation is not causation, and I do take marks off for that mistake. Student A: Understood. For presentation, we were thinking of pie charts? Tutor: I'd advise against it. A scatter plot showing every student, plus a simple bar chart of the three bands, would be far more convincing. Student B: And should we analyse everything in SPSS? Tutor: It's installed in the computer lab, but honestly, for what you're doing, Excel is quite sufficient. Student A: Right. The brief says the report should be fifteen hundred words and due on Friday of week ten — is the presentation at the same time? Tutor: No — the presentation is in week eleven, twelve minutes per group, and slides aren't required, though you may use them. One more thing, before you collect any more data: even for a low-risk project like this, you must include a consent statement at the start of your questionnaire. Student B: That's already in there. Tutor: Excellent. Anything else? Student A: No, I think we're on track. Tutor: Good — keep your raw data backed up, and I look forward to reading the report.",
        questions: [
          {
            q: "The project examines whether weekly study hours relate to end-of-term ___.",
            accepted: ["test scores", "scores", "test results"],
          },
          {
            q: "The students have received ___ questionnaire replies so far.",
            accepted: ["60", "sixty", "60 replies", "sixty replies"],
          },
          {
            q: "Study hours will be grouped into ___ bands.",
            accepted: ["3", "three", "3 bands", "three bands"],
          },
          {
            q: "The students fear self-reported hours may not be entirely ___.",
            accepted: ["honest", "accurate", "reliable"],
          },
          {
            q: "The tutor warns that correlation is not ___.",
            accepted: ["causation", "cause and effect"],
          },
          {
            q: "The tutor recommends a scatter plot plus a simple ___ chart of the bands.",
            accepted: ["bar", "bar chart"],
          },
          {
            q: "The tutor says ___ is quite sufficient for the analysis.",
            accepted: ["Excel", "Microsoft Excel"],
          },
          {
            q: "The written report should be ___ words.",
            accepted: ["1,500", "1500", "fifteen hundred", "one thousand five hundred"],
          },
          {
            q: "Each group's presentation in week eleven lasts ___ minutes.",
            accepted: ["12", "twelve", "12 minutes", "twelve minutes"],
          },
          {
            q: "The questionnaire must begin with a ___ statement.",
            accepted: ["consent", "consent statement"],
          },
        ],
      },
      {
        title: "Section 4: A lecture on the history of the global coffee trade",
        transcript:
          "Today we're tracing the journey of coffee from a local stimulant to a global commodity. The story begins in the highlands of Ethiopia, where legend credits a goatherd named Kaldi with noticing that his goats became unusually lively after eating berries from a particular shrub. Whatever the truth of the legend, by the fifteenth century coffee was being cultivated deliberately across the Red Sea in Yemen, and exported through the port of Mocha, whose name is still attached to a style of coffee today. Coffee houses spread through Mecca, Cairo and Istanbul, becoming centres of conversation and commerce — and, to the authorities, occasionally of dangerous political talk. England's first coffee house opened in Oxford in 1650, followed two years later by Pasqua Rosée's establishment in London. For a long time Yemen held a practical monopoly, but the Dutch broke it around 1690 by planting coffee on the island of Java. Transplants continued across the tropics: in 1723 the French officer Gabriel de Clieu carried a single coffee plant across the Atlantic to Martinique, reportedly watering it with his own ration on the voyage; within half a century the island supported millions of bushes. Brazil's coffee story began in 1727, when Francisco de Melo Palheta smuggled seeds out of French Guiana, and by the 1850s the country was supplying around half of the world's coffee, a dominance built partly on enslaved labour that we must not overlook. The next consumer revolution was instant coffee, launched by Nestlé under the Nescafé brand in 1938, initially to use up surplus Brazilian beans. Today Brazil remains the largest producer, with Vietnam second thanks to its massive cultivation of robusta, and humanity drinks an estimated two billion cups a day. Yet the industry's future is not secure: climate change is steadily shrinking the land suited to the finicky arabica species.",
        questions: [
          {
            q: "Legend credits a goatherd named ___ with noticing coffee's effect.",
            accepted: ["Kaldi", "a goatherd named Kaldi"],
          },
          {
            q: "By the fifteenth century coffee was being cultivated across the Red Sea in ___.",
            accepted: ["Yemen", "the Yemen"],
          },
          {
            q: "Coffee was exported through the port of ___.",
            accepted: ["Mocha", "Mokha"],
          },
          {
            q: "England's first coffee house opened in Oxford in ___.",
            accepted: ["1650", "sixteen fifty"],
          },
          {
            q: "Around 1690 the Dutch broke the monopoly by planting coffee on ___.",
            accepted: ["Java", "the island of Java"],
          },
          {
            q: "In 1723 Gabriel de Clieu carried a single coffee plant to ___.",
            accepted: ["Martinique", "the island of Martinique"],
          },
          {
            q: "Palheta smuggled Brazil's first seeds out of ___.",
            accepted: ["French Guiana", "Guiana"],
          },
          {
            q: "By the 1850s Brazil supplied around ___ of the world's coffee.",
            accepted: ["half", "a half", "50%", "50 per cent"],
          },
          {
            q: "Nestlé launched the Nescafé instant brand in ___.",
            accepted: ["1938", "nineteen thirty-eight"],
          },
          {
            q: "Today ___ remains the world's largest coffee producer.",
            accepted: ["Brazil", "Brasil"],
          },
        ],
      },
    ],
  },
  writing: {
    task1:
      "The chart below shows the percentage of secondary school students who owned a laptop or tablet in three countries in 2015 and 2023.\n\nUnited Kingdom: 38% in 2015, 84% in 2023\nBrazil: 22% in 2015, 61% in 2023\nJapan: 45% in 2015, 78% in 2023\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    task2:
      "Some people believe that the increasing use of technology such as laptops and tablets in the classroom improves the quality of education. Others think that these devices cause more problems than they solve. To what extent do you agree or disagree? Write at least 250 words.",
  },
  speaking: [
    ...speakingPart1([
      "Let's talk about your daily routine. What part of your day do you enjoy most?",
      "Do you usually follow the same routine every day?",
      "How do you usually plan your day or week ahead?",
    ]),
    speakingPart2(
      "Describe a gift you gave or received. You should say: what the gift was, who gave it to you or who you gave it to, why it was special, and explain how you felt about it.",
    ),
    ...speakingPart3([
      "Why do you think some people spend so much money on gifts?",
      "Do you think advertising influences what gifts people choose to buy?",
      "Is the tradition of gift-giving changing in your country? How?",
    ]),
  ],
};
