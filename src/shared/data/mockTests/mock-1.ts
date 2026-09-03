import { speakingPart1, speakingPart2, speakingPart3, type MockTestSet } from "./types";

export const mock1: MockTestSet = {
  id: "mock-1",
  order: 1,
  title: "IELTS Mock Test 1",
  reading: {
    passages: [
      {
        title: "The Rise of Urban Beekeeping",
        passage:
          "Urban beekeeping has become increasingly popular over the past decade, as city dwellers seek ways to support declining bee populations and produce their own honey. Rooftop hives can now be found in many major cities, from London to New York, often installed on the roofs of hotels, offices and even schools. Enthusiasts argue that cities can actually be surprisingly good habitats for bees, since parks, gardens and street trees provide a longer flowering season than the single-crop fields common in intensive rural farming, where a field may bloom for only a few weeks before being harvested. However, research suggests that hives in cities often produce less honey overall than their rural counterparts, largely because urban environments still offer fewer flowering plants across the full year compared with well-managed countryside apiaries, and because urban forage is scattered across many small gardens rather than concentrated in large meadows. Some scientists have also raised concerns about overcrowding: when too many hives are placed close together in a small area, local honeybees may end up competing with wild bees and other pollinators for the same limited food sources, potentially harming those other pollinator populations rather than helping them. A well-known example occurred in one European capital, where the number of registered hives more than tripled within five years without any corresponding increase in flowering plants, prompting local beekeeping associations to call for a temporary limit on new hive registrations in the city centre. Despite these challenges, most beekeeping associations agree that, if managed responsibly and paired with efforts to plant more flowers in public spaces, urban apiaries can still play a valuable role in raising public awareness about pollinator conservation and the broader threat posed by colony collapse disorder, a phenomenon in which worker bees abruptly disappear from a hive, leaving the queen and immature bees behind. Councils in several cities have begun offering small grants to residents who wish to plant bee-friendly gardens alongside their hives, recognising that a hive alone is not enough to guarantee a thriving colony; the surrounding landscape matters just as much as the hive itself. A handful of businesses have also started to see an economic opportunity in the trend, offering rooftop 'bee tourism' experiences and educational workshops for schoolchildren, which supporters say do more for long-term conservation awareness than the honey production itself. Critics, however, caution that such novelty experiences risk trivialising a serious ecological issue, turning a conservation effort into little more than a fashionable pastime for city residents who may never engage with the harder, less visible work of protecting wild bee habitats outside the city.",
        questions: [
          {
            q: "According to the passage, why do some enthusiasts believe cities can be good habitats for bees?",
            options: [
              "Cities have fewer predators",
              "Urban bees are naturally more productive",
              "Parks and gardens offer a longer flowering season than single-crop fields",
              "Cities have better weather for bees",
            ],
            answer: 2,
          },
          {
            q: "Why do city hives often produce less honey than rural ones overall?",
            options: [
              "Fewer flowering plants year-round and forage scattered across small gardens",
              "Urban bees are less active",
              "City hives are smaller in size",
              "Urban honey is harvested too early",
            ],
            answer: 0,
          },
          {
            q: "What concern do some scientists raise about too many hives in one area?",
            options: [
              "They attract predators",
              "They can crowd out wild pollinators competing for food",
              "They lower property values",
              "They reduce local rainfall",
            ],
            answer: 1,
          },
          {
            q: "What happened in the European capital mentioned in the passage?",
            options: [
              "All hives were banned",
              "Honey production doubled",
              "Hive numbers tripled without more flowering plants",
              "Wild bees disappeared entirely",
            ],
            answer: 2,
          },
          {
            q: "What did local beekeeping associations call for in response?",
            options: [
              "More hives to be registered",
              "A ban on beekeeping",
              "A temporary limit on new hive registrations",
              "Free honey for residents",
            ],
            answer: 2,
          },
          {
            q: "What do beekeeping associations generally agree on?",
            options: [
              "Urban beekeeping should be banned",
              "It can be valuable if managed responsibly",
              "Only rural beekeeping works",
              "Hives should be moved indoors",
            ],
            answer: 1,
          },
          {
            q: "What is colony collapse disorder, as described in the passage?",
            options: [
              "A disease that kills flowers",
              "Worker bees abruptly disappearing from a hive",
              "Overproduction of honey",
              "A type of urban hive design",
            ],
            answer: 1,
          },
          {
            q: "Why are some councils offering grants to residents?",
            options: [
              "To reduce the number of hives",
              "To fund honey factories",
              "To help plant bee-friendly gardens",
              "To pay for pest control",
            ],
            answer: 2,
          },
          {
            q: "What point does the passage make about a hive alone?",
            options: [
              "It guarantees a thriving colony",
              "It is not enough without the surrounding landscape",
              "It is more important than gardens",
              "It requires no maintenance",
            ],
            answer: 1,
          },
          {
            q: "What economic opportunity have some businesses identified?",
            options: [
              "Selling hive equipment only",
              "Exporting urban honey abroad",
              "Rooftop bee tourism and educational workshops",
              "Renting rooftop space to farmers",
            ],
            answer: 2,
          },
          {
            q: "What do supporters say about these educational workshops?",
            options: [
              "They do more for conservation awareness than honey production",
              "They are purely for profit",
              "They are less effective than honey sales",
              "They discourage children from learning about bees",
            ],
            answer: 0,
          },
          {
            q: "What do critics of 'bee tourism' caution?",
            options: [
              "It may trivialise a serious ecological issue",
              "It is too expensive for schools",
              "It harms bee populations directly",
              "It is illegal in most cities",
            ],
            answer: 0,
          },
          {
            q: "What would be the best title for this passage?",
            options: [
              "The decline of rural farming",
              "How to start a garden",
              "Bees in the city: benefits, limits and debate",
              "The history of honey production",
            ],
            answer: 2,
          },
        ],
      },
      {
        title: "The Printing Press and the Spread of Knowledge",
        passage:
          "When Johannes Gutenberg introduced movable-type printing to Europe in the 1440s, few could have predicted how thoroughly it would reshape the continent's intellectual life. Before this innovation, books were copied by hand, a process so slow and expensive that a single volume could take a scribe months to complete, placing books firmly out of reach for all but the wealthiest institutions and individuals. Gutenberg's press, which combined oil-based ink, a wooden press adapted from wine-making equipment, and reusable metal type, allowed multiple identical copies of a text to be produced in a fraction of the time previously required. Within fifty years of Gutenberg's first printed Bible, printing presses had been established in more than 250 European cities, and it is estimated that around twenty million books had been printed, a figure that would rise dramatically over the following century. This rapid expansion did not simply make existing books more available; it changed what kinds of texts were written in the first place. Because printing made it economically viable to produce works in vernacular languages rather than only in Latin, the language of the educated elite, authors increasingly wrote for a broader readership, including merchants, craftsmen and, eventually, women, who had historically been excluded from formal Latin education. Some historians argue that this shift in readership was at least as significant as the increase in the sheer number of books, since it meant that ideas could circulate among people who had previously had no access to written knowledge at all. The press also transformed the way scientific knowledge developed. Where earlier scholars might unknowingly duplicate errors from a single hand-copied manuscript, printed texts could be compared, corrected and reprinted with amendments far more efficiently, allowing errors to be identified and fixed across many more circulating copies. Historians of science often point to this capacity for correction, rather than simple mass production, as the press's most underappreciated contribution to the rise of modern science. Yet the technology's effects were not universally welcomed. Religious and political authorities across Europe quickly recognised that a technology capable of spreading ideas so rapidly could just as easily spread ideas they wished to suppress, and many governments introduced licensing systems requiring printers to obtain official approval before publishing. Despite these restrictions, unlicensed and underground printing persisted throughout the following centuries, often smuggled across borders precisely because it had become so difficult, once a text existed in dozens or hundreds of printed copies, to prevent it from reaching an audience.",
        questions: [
          {
            q: "Before the printing press, how were books typically produced?",
            options: [
              "Printed in small workshops",
              "Carved into stone tablets",
              "Dictated and memorised",
              "Copied by hand by scribes",
            ],
            answer: 3,
          },
          {
            q: "What materials did Gutenberg's press combine?",
            options: [
              "Stone, water and paper",
              "Oil-based ink, a wooden press and reusable metal type",
              "Clay tablets and dye",
              "Silk paper and bronze plates",
            ],
            answer: 1,
          },
          {
            q: "How many European cities had printing presses within fifty years of Gutenberg's Bible?",
            options: ["Around 50", "Around 100", "Over 1,000", "More than 250"],
            answer: 3,
          },
          {
            q: "According to the passage, what changed besides the number of available books?",
            options: [
              "The kinds of texts being written",
              "The price of paper",
              "The size of books",
              "The location of universities",
            ],
            answer: 0,
          },
          {
            q: "Why did authors increasingly write in vernacular languages?",
            options: [
              "Latin was banned",
              "Vernacular languages were required by law",
              "Latin books were too short",
              "Printing made vernacular texts economically viable for a broader readership",
            ],
            answer: 3,
          },
          {
            q: "Who is mentioned as having historically been excluded from Latin education?",
            options: ["Women", "Merchants only", "Craftsmen only", "Religious leaders"],
            answer: 0,
          },
          {
            q: "What do some historians argue was as significant as the increase in book numbers?",
            options: [
              "The cost of ink",
              "The size of the press",
              "The speed of shipping",
              "The shift in readership",
            ],
            answer: 3,
          },
          {
            q: "What problem could occur with hand-copied manuscripts?",
            options: [
              "They were too colourful",
              "Errors could be unknowingly duplicated",
              "They were too short",
              "They were printed too quickly",
            ],
            answer: 1,
          },
          {
            q: "What do historians of science often see as the press's most underappreciated contribution?",
            options: [
              "Mass production of books",
              "The capacity for correction across copies",
              "Cheaper paper",
              "Faster shipping of texts",
            ],
            answer: 1,
          },
          {
            q: "How did authorities react to the printing press?",
            options: [
              "They ignored it completely",
              "They introduced licensing systems to control publishing",
              "They banned all printed material",
              "They funded it fully without restriction",
            ],
            answer: 1,
          },
          {
            q: "What persisted despite official restrictions?",
            options: [
              "Hand-copying of manuscripts",
              "The use of Latin only",
              "Unlicensed and underground printing",
              "A total ban on books",
            ],
            answer: 2,
          },
          {
            q: "Why was it difficult to stop a printed text from reaching an audience?",
            options: [
              "Printers refused to cooperate with smugglers",
              "Governments had no printing laws",
              "Texts were printed in secret languages",
              "Once many copies existed, suppression became very difficult",
            ],
            answer: 3,
          },
          {
            q: "What would be the best title for this passage?",
            options: [
              "A biography of Gutenberg",
              "The history of the Latin language",
              "How modern books are made",
              "The printing press and the spread of knowledge",
            ],
            answer: 3,
          },
        ],
      },
      {
        title: "Coral Reefs Under Threat",
        passage:
          "Coral reefs cover less than one percent of the ocean floor, yet they support an estimated quarter of all marine species, making them among the most biologically rich ecosystems on the planet. This remarkable productivity depends on a delicate partnership between coral polyps, the small animals that build reef structures, and microscopic algae called zooxanthellae that live within the coral's tissue. The algae photosynthesise, providing the coral with the majority of its energy, while the coral in turn offers the algae a protected home and access to sunlight near the water's surface. When ocean temperatures rise even slightly above their normal range for a sustained period, this partnership breaks down: the coral expels its algae, losing both its main food source and its characteristic colour in a process known as bleaching. A bleached coral is not necessarily dead, and can recover if temperatures return to normal quickly enough, but prolonged or repeated bleaching events sharply increase coral mortality. Mass bleaching events, once considered rare, have become dramatically more frequent since the 1980s, with several of the world's largest reef systems experiencing multiple severe bleaching events within a single decade, leaving reefs with less and less time to recover between episodes. Rising temperatures are not the only threat. Ocean acidification, caused by seawater absorbing increasing amounts of atmospheric carbon dioxide, makes it more difficult for coral polyps to build their calcium carbonate skeletons in the first place, slowing reef growth even where bleaching has not occurred. Local pressures compound these global threats: coastal development, overfishing and pollution from agricultural runoff can all weaken a reef's resilience, making it less able to withstand or recover from a bleaching event. Conservationists have experimented with a range of interventions, from breeding heat-resistant coral strains in laboratories to physically transplanting coral fragments onto damaged reefs, and some of these approaches have shown promising early results in small trial areas. However, most marine scientists caution that such interventions, while valuable for research and for preserving genetic diversity, cannot realistically be scaled up to protect reefs across entire ocean basins, and that reducing global carbon emissions remains the only measure capable of addressing the underlying cause of reef decline at a meaningful scale. In the meantime, some coastal communities that depend on reefs for fishing and tourism have begun establishing locally managed marine protected areas, which restrict fishing and anchoring in the hope of giving reefs at least a fighting chance to recover between global heat events.",
        questions: [
          {
            q: "What percentage of marine species do coral reefs support, according to the passage?",
            options: ["About 1%", "About a quarter", "About 10%", "About half"],
            answer: 1,
          },
          {
            q: "What role do zooxanthellae play for coral?",
            options: [
              "They attack the coral",
              "They build the reef structure",
              "They photosynthesise and provide most of the coral's energy",
              "They protect coral from fish",
            ],
            answer: 2,
          },
          {
            q: "What does the coral provide to the algae in return?",
            options: [
              "A protected home and access to sunlight",
              "Food only",
              "Nothing in return",
              "Transportation to new locations",
            ],
            answer: 0,
          },
          {
            q: "What happens during coral bleaching?",
            options: [
              "The coral expels its algae and loses its colour",
              "The coral grows faster",
              "The coral becomes more colourful",
              "The algae multiply rapidly",
            ],
            answer: 0,
          },
          {
            q: "Is a bleached coral necessarily dead?",
            options: [
              "Yes, always",
              "Only if it turns white",
              "No, it can recover if temperatures return to normal quickly",
              "Only in shallow water",
            ],
            answer: 2,
          },
          {
            q: "How have mass bleaching events changed since the 1980s?",
            options: [
              "They have become rarer",
              "They have stayed the same",
              "They have become dramatically more frequent",
              "They have stopped entirely",
            ],
            answer: 2,
          },
          {
            q: "What does ocean acidification make more difficult?",
            options: [
              "Coral building its calcium carbonate skeleton",
              "Fish reproduction",
              "Algae photosynthesis",
              "Ocean currents forming",
            ],
            answer: 0,
          },
          {
            q: "What causes ocean acidification, according to the passage?",
            options: [
              "Overfishing",
              "Coastal development",
              "Coral bleaching itself",
              "Seawater absorbing atmospheric carbon dioxide",
            ],
            answer: 3,
          },
          {
            q: "What local pressures can weaken a reef's resilience?",
            options: [
              "Only tourism",
              "Only shipping traffic",
              "Coastal development, overfishing and pollution",
              "Only sunlight",
            ],
            answer: 2,
          },
          {
            q: "What have some conservationists experimented with?",
            options: [
              "Draining affected reef areas",
              "Removing all fish from reefs",
              "Covering reefs with plastic sheeting",
              "Breeding heat-resistant coral and transplanting fragments",
            ],
            answer: 3,
          },
          {
            q: "What do most marine scientists caution about these interventions?",
            options: [
              "They are completely useless",
              "They should replace emission reduction efforts",
              "They cannot realistically be scaled up across entire ocean basins",
              "They are more effective than reducing emissions",
            ],
            answer: 2,
          },
          {
            q: "What do scientists say is the only measure capable of addressing the underlying cause?",
            options: [
              "Coral transplanting",
              "Banning tourism",
              "Reducing global carbon emissions",
              "Building artificial reefs everywhere",
            ],
            answer: 2,
          },
          {
            q: "What have some coastal communities established?",
            options: [
              "Locally managed marine protected areas",
              "New fishing fleets",
              "Coral export businesses",
              "Underwater hotels",
            ],
            answer: 0,
          },
          {
            q: "What would be the best title for this passage?",
            options: [
              "How to build an aquarium",
              "Coral reefs under threat",
              "The history of ocean exploration",
              "A guide to marine tourism",
            ],
            answer: 1,
          },
        ],
      },
    ],
  },
  listening: {
    sections: [
      {
        title: "Section 1: A phone call to a community library",
        transcript:
          "Hello, thanks for calling the Riverside Community Library. I can help you book a study room for this Saturday. We have two rooms available: the small room on the ground floor holds up to four people, and the large room upstairs holds up to ten. Both are free to book online, but if you book over the phone like you're doing now, there's a small five-pound administration fee. The library closes at half past eight on weekdays, but on Saturdays we close earlier, at six. If you need the room for more than two hours, you'll have to bring your own library card, as guest bookings are limited to two hours. We also ask that groups keep noise to a reasonable level, since the reading area is just next door. If you'd like refreshments, there's a small kitchen on the first floor, though food isn't allowed inside the study rooms themselves, only drinks in closed containers. Parking is available behind the building, but it's limited to two hours during the day, so if your booking runs longer than that, I'd recommend using the car park across the road instead, which charges a flat rate of three pounds after six in the evening. Would you like the small or the large room, and shall I take a payment card number for the administration fee now?",
        questions: [
          { q: "The large room upstairs can hold up to ___ people.", accepted: ["10", "ten"] },
          {
            q: "Booking a room over the phone carries a small administration fee of ___.",
            accepted: ["£5", "5", "5 pounds", "five pounds", "five pound"],
          },
          {
            q: "On Saturdays the library closes at ___.",
            accepted: ["6", "6:00", "6 pm", "6pm", "six", "18:00"],
          },
          {
            q: "For any booking longer than two hours you must bring your own ___.",
            accepted: ["library card", "a library card"],
          },
          {
            q: "The caller wants to book a study room for ___.",
            accepted: ["Saturday", "this Saturday"],
          },
          {
            q: "Groups should keep noise reasonable because the ___ is just next door.",
            accepted: ["reading area", "the reading area"],
          },
          { q: "The small kitchen is on the ___ floor.", accepted: ["first", "1st"] },
          {
            q: "Only drinks in ___ are allowed inside the study rooms themselves.",
            accepted: ["closed containers", "closed container"],
          },
          {
            q: "Parking behind the building is limited to ___ during the day.",
            accepted: ["two hours", "2 hours"],
          },
          {
            q: "Across the road, parking after six in the evening costs a flat rate of ___.",
            accepted: ["£3", "3", "3 pounds", "three pounds", "three pound"],
          },
        ],
      },
      {
        title: "Section 2: A talk about a community allotment scheme",
        transcript:
          "Good evening, everyone, and thank you for coming to find out more about the Greenfield community allotment scheme. We currently have thirty plots available at the site on Mill Lane, each measuring roughly five metres by ten metres, which is enough space for a small family to grow a good variety of vegetables throughout the year. The annual fee is twenty-five pounds for a full plot, or fifteen pounds if you'd prefer to share a half-plot with another household, which is a popular option for beginners who aren't sure how much time they'll have to commit. Water is provided free of charge from four standpipes around the site, but you'll need to bring your own hose or watering can, as none are supplied. New plot-holders are given a three-month trial period, during which the site committee will check that the plot is being kept reasonably tidy; after that, plots are allocated on a rolling annual basis. We do ask that you avoid using chemical pesticides, since the site borders a small nature reserve, and several plot-holders keep bees nearby. If you're interested, the site itself is open every day from dawn until dusk, but the on-site shed, where tools can be borrowed, is only staffed on Wednesday and Saturday mornings between nine and midday. There's also a waiting list at the moment, currently running at around four months, so if you sign up tonight, do expect a short delay before a plot becomes available. Applications can be submitted through the form at the back of the room, or online through the council website afterwards.",
        questions: [
          {
            q: "The site on Mill Lane currently has ___ plots available.",
            accepted: ["30", "thirty"],
          },
          {
            q: "A full plot costs ___ a year.",
            accepted: ["£25", "25", "25 pounds", "twenty-five pounds", "twenty five pounds"],
          },
          {
            q: "Sharing a half-plot with another household costs ___ a year.",
            accepted: ["£15", "15", "15 pounds", "fifteen pounds"],
          },
          {
            q: "Water is provided free of charge from ___ standpipes around the site.",
            accepted: ["4", "four"],
          },
          {
            q: "New plot-holders are given a trial period of ___.",
            accepted: ["three months", "3 months"],
          },
          {
            q: "Plot-holders must avoid chemical pesticides because the site borders a small ___.",
            accepted: ["nature reserve", "the nature reserve"],
          },
          {
            q: "The site itself is open every day from dawn until ___.",
            accepted: ["dusk", "dark"],
          },
          {
            q: "The tool shed is staffed between nine and midday on ___ mornings.",
            accepted: [
              "Wednesday and Saturday",
              "Wednesdays and Saturdays",
              "Wednesday & Saturday",
            ],
          },
          {
            q: "The waiting list for a plot currently runs at around ___.",
            accepted: ["four months", "4 months"],
          },
          {
            q: "Tonight, applications can be submitted using the form at the ___ of the room.",
            accepted: ["back", "back of the room"],
          },
        ],
      },
      {
        title: "Section 3: Two students discussing a research project with their tutor",
        transcript:
          "Tutor: So, how's the research project coming along? You wanted to talk about your survey results today, didn't you? Student A: Yes, we've collected responses from about eighty participants so far, which is more than we expected at this stage. Student B: Although we're a bit worried the sample isn't balanced — most respondents are under thirty, so we might be missing older perspectives. Tutor: That's a fair concern. Have you thought about how you'll address that in your write-up? Student A: We were planning to mention it as a limitation, but Sarah suggested we could also try distributing a few paper copies at the community centre to reach an older age group. Tutor: That's a sensible idea, though be aware it'll take longer to collect and enter that data manually. I'd suggest setting a firm cut-off date, say two weeks from now, so it doesn't delay your final analysis. Student B: That makes sense. We were also unsure whether to present the data as percentages or raw numbers in the report. Tutor: Given your sample size, percentages will be clearer for your reader, but include the raw numbers in a footnote or appendix so anyone checking your work can verify the figures. Student A: Understood. One more thing — our supervisor mentioned we should include a short section on ethical approval. We did apply for that back in October, so I assume we're fine? Tutor: You should still describe the process briefly, even if approval was straightforward, because markers want to see that you understood why it mattered, not just that a form was signed. Student B: Got it. Should the whole write-up be around three thousand words, as stated in the handbook? Tutor: Yes, three thousand is the target, with a ten percent allowance either way, so anywhere between twenty-seven hundred and thirty-three hundred should be acceptable.",
        questions: [
          {
            q: "The students have collected responses from about ___ participants so far.",
            accepted: ["80", "eighty"],
          },
          {
            q: "Most respondents are under ___, so older perspectives may be missing.",
            accepted: ["30", "thirty"],
          },
          {
            q: "Sarah suggested distributing a few paper copies at the ___.",
            accepted: ["community centre", "community center"],
          },
          {
            q: "The tutor suggests setting a firm cut-off date, say ___ from now.",
            accepted: ["two weeks", "2 weeks"],
          },
          {
            q: "Given the sample size, the tutor says the data will be clearer presented as ___.",
            accepted: ["percentages", "percentage", "per cent", "percent"],
          },
          {
            q: "The students applied for ethical approval back in ___.",
            accepted: ["October", "Oct"],
          },
          {
            q: "The write-up should briefly describe the ethical approval ___, even if it was straightforward.",
            accepted: ["process", "approval process", "the process"],
          },
          {
            q: "The target for the write-up is ___ words.",
            accepted: ["3000", "3,000", "three thousand"],
          },
          {
            q: "The word count carries a ___ allowance either way.",
            accepted: ["10%", "10 per cent", "ten per cent", "10 percent", "ten percent"],
          },
          {
            q: "The acceptable word range is between twenty-seven hundred and ___.",
            accepted: ["3300", "3,300", "three thousand three hundred", "thirty-three hundred"],
          },
        ],
      },
      {
        title: "Section 4: A lecture on renewable energy on university campuses",
        transcript:
          "Today I want to look at how universities have approached renewable energy on their own campuses, since they're often large enough to make a meaningful case study of what works at scale. Many universities began, in the early two-thousands, with fairly modest solar installations on single buildings, largely as demonstration projects rather than serious attempts to reduce overall energy use. Over the past fifteen years, though, this has changed considerably. Several universities now generate more than a quarter of their electricity needs from on-site renewable sources, primarily solar, though a smaller number in coastal or hilly regions have also invested in wind turbines. One frequently cited example is a university that converted a disused car park into a solar canopy, which simultaneously generates electricity and provides shaded parking, addressing two problems with a single structure. Interestingly, the financial case for these projects has shifted over time. Where early installations were often funded through grants or donations specifically earmarked for sustainability projects, more recent installations increasingly pay for themselves through reduced electricity bills within seven to ten years, making them attractive even to university finance departments primarily concerned with the bottom line rather than environmental goals. That said, researchers studying this trend caution that campus-based renewable energy, however visible and symbolically important, typically covers only a fraction of a university's total carbon footprint, since research activities, staff and student travel, and the construction of new buildings often account for a much larger share of emissions than electricity use for lighting and heating. Some institutions have responded by publishing detailed annual sustainability reports that separate these different categories, allowing students and staff to see clearly which measures are making the biggest difference and which remain largely symbolic. A few universities have gone further still, tying senior staff performance reviews to measurable progress on these sustainability targets, an approach that early evidence suggests produces faster reductions in emissions than voluntary pledges alone.",
        questions: [
          {
            q: "Universities make meaningful case studies because they are large enough to show what works ___.",
            accepted: ["at scale", "scale"],
          },
          {
            q: "Early campus solar installations were largely ___ projects rather than serious energy measures.",
            accepted: ["demonstration", "demo"],
          },
          {
            q: "Several universities now generate more than ___ of their electricity needs from on-site renewables.",
            accepted: ["a quarter", "one quarter", "25%", "25 per cent", "25 percent"],
          },
          {
            q: "Some universities in coastal or hilly regions have also invested in ___.",
            accepted: ["wind turbines", "wind turbine"],
          },
          {
            q: "One university converted a disused car park into a solar ___.",
            accepted: ["canopy", "solar canopy"],
          },
          {
            q: "Early installations were often funded through grants or ___.",
            accepted: ["donations", "a donation", "donation"],
          },
          {
            q: "More recent installations typically pay for themselves within ___ years.",
            accepted: ["7 to 10", "7-10", "7–10", "seven to ten"],
          },
          {
            q: "Campus renewable energy typically covers only a ___ of a university's total carbon footprint.",
            accepted: ["fraction", "small fraction"],
          },
          {
            q: "Research activities, travel and construction account for a larger share of ___ than electricity use.",
            accepted: ["emissions", "carbon emissions"],
          },
          {
            q: "A few universities tie senior staff ___ to measurable sustainability targets.",
            accepted: ["performance reviews", "performance review"],
          },
        ],
      },
    ],
  },
  writing: {
    task1:
      "The chart below shows the percentage of electricity generated from renewable sources on three university campuses in 2010 and 2025.\n\nGreenfield University: 4%, 27%\nCoastal University: 9%, 34%\nRiverside University: 2%, 19%\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    task2:
      "Some people think that governments should spend more money on environmental projects such as urban beekeeping and green spaces, while others believe this money should be spent on more urgent issues like housing and healthcare. Discuss both views and give your own opinion. Write at least 250 words.",
  },
  speaking: [
    ...speakingPart1([
      "Let's talk about your hometown. What do you like most about it?",
      "Do you work or are you a student?",
      "What do you usually do in your free time?",
    ]),
    speakingPart2(
      "Describe a skill you would like to learn. You should say: what the skill is, why you want to learn it, how you would learn it, and explain how learning it would change your life.",
    ),
    ...speakingPart3([
      "Do you think it's more important for children to learn practical skills or academic knowledge?",
      "How has technology changed the way people learn new skills?",
      "Why do you think some adults are reluctant to learn new skills later in life?",
    ]),
  ],
};
