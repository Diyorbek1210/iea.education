import { speakingPart1, speakingPart2, speakingPart3, type MockTestSet } from "./types";

export const mock3: MockTestSet = {
  id: "mock-3",
  order: 3,
  title: "IELTS Mock Test 3",
  reading: {
    passages: [
      {
        title: "The Story of Maps",
        passage:
          "Some of the oldest surviving maps are not paper at all but baked clay. A Babylonian tablet from around 700 BC shows the world as a disc, with the city of Babylon at its heart, encircled by a circular ocean labelled the 'Bitter River'. For such early civilisations, a map was as much a statement of beliefs as a guide for travel. Greek thinkers transformed the practice. Around 240 BC the scholar Eratosthenes compared the noon shadows cast in two Egyptian cities and used the difference to estimate the Earth's circumference, arriving at a figure within a few per cent of the true value. Three centuries later, in Alexandria, the geographer Claudius Ptolemy compiled the Geographia, an atlas listing around eight thousand places with coordinates and instructions for drawing a map of the known world. His geometry was superb but his data imperfect: he placed Asia far too far to the east, an error which, centuries later, made Columbus's idea of sailing west to Asia look deceptively short. Medieval European maps often blurred accuracy on purpose. The Hereford mappa mundi, drawn around 1300, placed Jerusalem at the centre of the world and filled its margins with biblical scenes; guiding pilgrims in faith mattered more than guiding them in miles. Sailors needed something else, and found it in the portolan charts of the thirteenth century — practical sea charts drawn from compass bearings, with coastlines so startlingly accurate that historians still puzzle over how they were surveyed. The next breakthrough belongs to Gerardus Mercator, whose world map of 1569 projected the globe so that a line of constant compass bearing appeared straight, an enormous gift to ocean navigation, though it flatters the northern continents badly: on a Mercator map Greenland looks the size of Africa when the real continent is fourteen times larger. Governments then entered the business. Britain's Ordnance Survey was founded in 1791 amid military fears of invasion, mapping the south coast in fine detail; aerial photography during the First World War carried the surveyor's eye into the sky, and from the 1970s satellites carried it into orbit. The first NAVSTAR navigation satellite was launched in 1978, and the full GPS constellation was completed in 1993, handing everyone a pocket map that updates by the second. Modern quarrels over maps are not entirely new: in the 1970s the historian Arno Peters championed a projection that showed developing countries at their true size, proving that arguments about maps are really arguments about whose world we choose to draw.",
        questions: [
          {
            q: "What did the ancient Babylonian tablet place at the centre of the world?",
            options: ["Jerusalem", "Babylon", "Athens", "The rising sun"],
            answer: 1,
          },
          {
            q: "How did Eratosthenes estimate the Earth's circumference?",
            options: [
              "By sailing around the known world",
              "By timing the phases of the moon",
              "By comparing noon shadows in two Egyptian cities",
              "By counting the days of a caravan journey",
            ],
            answer: 2,
          },
          {
            q: "What did Ptolemy's Geographia contain?",
            options: [
              "Coordinates for around eight thousand places",
              "A list of road tolls across Rome",
              "Stories of sea monsters for sailors",
              "Poems about distant continents",
            ],
            answer: 0,
          },
          {
            q: "Why did Ptolemy's error about Asia matter much later?",
            options: [
              "It sank several trading fleets",
              "It led to the invention of the compass",
              "It caused the mapping of Atlantis",
              "It made Columbus's planned westward crossing look deceptively short",
            ],
            answer: 3,
          },
          {
            q: "What was the main purpose of the Hereford mappa mundi?",
            options: [
              "Planning military campaigns",
              "Collecting agricultural taxes",
              "Religious instruction, with Jerusalem at the centre",
              "Charting fishing grounds in the North Sea",
            ],
            answer: 2,
          },
          {
            q: "Why do historians still marvel at portolan charts?",
            options: [
              "Their coastlines are startlingly accurate for their day",
              "They show the outline of Australia",
              "They were richly painted in gold",
              "They were extremely cheap to produce",
            ],
            answer: 1,
          },
          {
            q: "What property does the Mercator projection preserve?",
            options: [
              "The true areas of continents",
              "True distances from the equator",
              "The real size of Greenland",
              "Straight lines of constant compass bearing",
            ],
            answer: 3,
          },
          {
            q: "What famous distortion does the Mercator projection produce?",
            options: [
              "Greenland appears as large as Africa",
              "The oceans almost disappear",
              "Europe looks smaller than reality",
              "The two polar regions merge",
            ],
            answer: 0,
          },
          {
            q: "Why was Britain's Ordnance Survey founded in 1791?",
            options: [
              "To serve a growing postal service",
              "To plan the first railway network",
              "Military fears of an invasion of the south coast",
              "A royal interest in landscape painting",
            ],
            answer: 2,
          },
          {
            q: "When was the full GPS satellite constellation completed?",
            options: ["1993", "1918", "2001", "It has never been completed"],
            answer: 0,
          },
          {
            q: "What did Arno Peters argue in the 1970s?",
            options: [
              "That paper maps should be banned",
              "That north should always point downwards",
              "That GPS was fundamentally unreliable",
              "That projections should show developing countries at their true size",
            ],
            answer: 3,
          },
          {
            q: "Which development carried the surveyor's work into orbit from the 1970s?",
            options: ["Hot-air balloons", "Satellites", "Research submarines", "Radio telescopes"],
            answer: 1,
          },
          {
            q: "What would be the best title for this passage?",
            options: [
              "Why GPS is dangerous",
              "The life of Claudius Ptolemy",
              "Mapping the world: from clay tablets to satellites",
              "How to read a compass at sea",
            ],
            answer: 2,
          },
        ],
      },
      {
        title: "Vertical Farming",
        passage:
          "Of all the ideas for feeding the cities of the future, vertical farming sounds the most like science fiction: not open fields, but towers and warehouses in which trays of crops are stacked floor upon floor under artificial light. The term was popularised in 1999 by Dickson Despommier, a professor at Columbia University, who argued that a rising, urbanising population should grow its food indoors. In a vertical farm there is no soil at all. Plant roots sit in shallow channels of nutrient-enriched water — a technique known as hydroponics — or are misted with fine sprays as in aeroponics, while banks of LED lamps shine with the pink-purple blend of red and blue light that green leaves absorb most efficiently. Because the growing water is captured, filtered and recirculated, vertical farms can use up to ninety-five per cent less water than conventional agriculture, and because the buildings are sealed against the outside world, pests are excluded and chemical pesticides can be abandoned altogether. Rain, frost and drought become somebody else's problem: lettuces can be harvested about every thirty days, all year round. Advocates point to uncomfortable geographies. Singapore imports over ninety per cent of its food, and has responded with a '30 by 30' target of producing thirty per cent of its nutritional needs locally by 2030, spreading vertical farms across rooftops and warehouses. In Japan, after the 2011 earthquake, shuttered electronics factories were converted into spotless, LED-lit lettuce farms. Locating production inside cities also slashes 'food miles', since salad can be picked, packed and on shop shelves within a single morning. Yet the economics remain harsh. Replacing the free energy of the sun with electricity devours money: lighting and climate control dominate a farm's running costs. In practice, nearly every profitable vertical farm grows only fast, high-value crops — leafy greens, herbs and microgreens — because staples such as rice, wheat and potatoes can never cover the electricity bill; one analysis estimated that a loaf made from vertical-farm wheat would cost several times more than a conventional loaf even if everything ran perfectly. Several well-funded start-ups have already collapsed under that arithmetic. Nor can an indoor farm call itself automatically 'green': powered by a coal-heavy grid, indoor spinach may carry a larger carbon footprint than field-grown spinach shipped from abroad. The considered verdict is modest but optimistic: with cheap renewable electricity and ever more efficient LEDs, the industry sees itself as a complement to traditional farming rather than a replacement.",
        questions: [
          {
            q: "Who popularised the term 'vertical farming' in 1999?",
            options: [
              "Dickson Despommier, a Columbia University professor",
              "Gerardus Mercator, a Flemish cartographer",
              "An unnamed Japanese engineer",
              "A Singapore government minister",
            ],
            answer: 0,
          },
          {
            q: "In hydroponics, where do plant roots grow?",
            options: [
              "In boxes of sterilised earth",
              "In ordinary garden pots",
              "In sealed bags of compost",
              "In shallow channels of nutrient-rich water, with no soil",
            ],
            answer: 3,
          },
          {
            q: "Why do vertical farms' LED lamps glow pink-purple?",
            options: [
              "They are designed to look attractive to visitors",
              "Red and blue light is what green leaves absorb most efficiently",
              "They are simply the cheapest bulbs available",
              "City regulations require that colour",
            ],
            answer: 1,
          },
          {
            q: "How much water can vertical farms save compared with conventional agriculture?",
            options: ["About half", "None at all", "Up to ninety-five per cent", "Five per cent"],
            answer: 2,
          },
          {
            q: "How often can lettuces be harvested in a vertical farm?",
            options: [
              "About every thirty days, all year round",
              "Once every year",
              "Only every three years",
              "Every single hour",
            ],
            answer: 0,
          },
          {
            q: "Why does sealing the building matter for crop protection?",
            options: [
              "It keeps out heavy rain",
              "It reduces noise pollution",
              "It keeps pests out, making chemical pesticides unnecessary",
              "It satisfies the insurance companies",
            ],
            answer: 2,
          },
          {
            q: "What is Singapore's '30 by 30' target?",
            options: [
              "Producing thirty per cent of its nutritional needs locally by 2030",
              "Building thirty new farms each year",
              "Cutting food waste by thirty per cent",
              "Doubling its food imports by 2030",
            ],
            answer: 1,
          },
          {
            q: "What did Japan do after the 2011 earthquake, according to the passage?",
            options: [
              "It banned hydroponic farming",
              "It moved all farming offshore",
              "It rebuilt farms using draught animals",
              "It converted closed electronics factories into LED-lit lettuce farms",
            ],
            answer: 3,
          },
          {
            q: "What dominates a vertical farm's running costs?",
            options: [
              "Soil replacement",
              "Electricity for lighting and climate control",
              "The price of seeds",
              "Leasing tractors",
            ],
            answer: 1,
          },
          {
            q: "Why are staple crops like rice, wheat and potatoes unsuitable for vertical farming?",
            options: [
              "They grow poorly under LED light",
              "They attract too many pests indoors",
              "They grow too tall for warehouse shelves",
              "They can never generate enough value to cover the electricity bill",
            ],
            answer: 3,
          },
          {
            q: "What caveat does the passage give about the industry's 'green' reputation?",
            options: [
              "LED lamps cannot be recycled",
              "Water cannot actually be reused",
              "On a coal-heavy grid, indoor spinach may have a larger carbon footprint than imported field-grown spinach",
              "Vertical farms burn crop waste daily",
            ],
            answer: 2,
          },
          {
            q: "How does the industry ultimately see its own role?",
            options: [
              "As a complement to traditional farming, not a replacement",
              "As the quick end of outdoor agriculture",
              "As a passing fashion without consequence",
              "As an expensive failure",
            ],
            answer: 0,
          },
          {
            q: "What would be the best title for this passage?",
            options: [
              "Why traditional soil is dying",
              "Japan's lettuce factories",
              "How to water a vegetable garden",
              "Vertical farming: promise and its limits",
            ],
            answer: 3,
          },
        ],
      },
      {
        title: "The Science of Sleep",
        passage:
          "That we spend a third of our lives asleep is one of life's stranger facts, and science is still catching up with the reasons why. The modern understanding of sleep began in 1953, when the researcher Eugene Aserinsky watched sleeping babies and noticed their eyes darting about beneath closed lids; with his supervisor Nathaniel Kleitman he showed that these periods of rapid eye movement, known as REM, pair with vivid dreaming. Healthy sleep is now understood as a repeating cycle of light sleep, deep sleep and REM, each cycle lasting about ninety minutes and repeating several times a night. What drives us into sleep is partly chemistry. From the moment we wake, a substance called adenosine accumulates in the brain, and the more of it we harbour, the sleepier we feel. Caffeine works by blocking adenosine receptors rather than by removing adenosine, so when the caffeine wears off, the pent-up sleepiness comes flooding back. Running in parallel is the circadian rhythm, an internal clock of roughly twenty-four hours that anticipates sunrise and sunset and instructs the pineal gland to release the hormone melatonin towards evening, preparing the body for rest. Some of what we know comes from celebrated experiments. In 1964 a seventeen-year-old American student, Randy Gardner, stayed awake for 264 hours — eleven days — under researchers' supervision. He suffered no lasting harm, which reassured doctors, but his attention, mood and memory all crumbled visibly during the ordeal, a vivid demonstration of sleep's worth. Modern research explains why: during deep sleep the hippocampus replays the day's experiences many times faster than real time, transferring what matters into long-term storage, which is why students who sleep after studying retain more than students who cram through the night. Sleep science has also produced practical warnings. Seventeen hours of wakefulness degrades performance to a level comparable to mild alcohol intoxication, a finding that has reshaped hospital shift patterns. Screens are a nightly enemy, since their blue-rich light suppresses melatonin and tells the brain it is still daytime. Even the common habit of getting up early on workdays but sleeping late at weekends imposes what researchers call 'social jet lag', a repeated disorientation of the body clock. The experts' advice is unglamorous but constant: seven to nine hours for most adults, kept at regular times, in a cool, dark room — with a twenty-minute afternoon nap permitted, since controlled studies have found short naps boost alertness substantially, provided they are taken early enough not to disturb the coming night.",
        questions: [
          {
            q: "When was REM sleep first identified?",
            options: ["1863", "1993", "2016", "1953"],
            answer: 3,
          },
          {
            q: "Who first noticed rapid eye movements during sleep?",
            options: [
              "Eugene Aserinsky, watching sleeping babies",
              "Randy Gardner, during his vigil",
              "Claudius Ptolemy, in Alexandria",
              "A team of NASA pilots",
            ],
            answer: 0,
          },
          {
            q: "How long does a typical sleep cycle last?",
            options: ["Exactly one hour", "Six hours", "About ninety minutes", "A single minute"],
            answer: 2,
          },
          {
            q: "What role does adenosine play?",
            options: [
              "It wakes the brain each morning",
              "It accumulates while we are awake and creates sleepiness",
              "It helps wounds to heal overnight",
              "It breaks down caffeine in the blood",
            ],
            answer: 1,
          },
          {
            q: "How does caffeine actually make us feel less sleepy?",
            options: [
              "It dissolves adenosine in the blood",
              "It blocks adenosine receptors rather than removing adenosine",
              "It replaces melatonin entirely",
              "It destroys tired neurons",
            ],
            answer: 1,
          },
          {
            q: "Where does melatonin come from?",
            options: [
              "The stomach lining",
              "The surface of the skin",
              "The inside of the eyelids",
              "The pineal gland, released towards evening",
            ],
            answer: 3,
          },
          {
            q: "How long did Randy Gardner stay awake in 1964?",
            options: ["264 hours", "A single night", "Forty days", "96 hours"],
            answer: 0,
          },
          {
            q: "What happened to Gardner's mental abilities during the experiment?",
            options: [
              "Nothing measurable changed",
              "He never slept normally again",
              "Attention, mood and memory crumbled, though he recovered afterwards",
              "His memory noticeably improved",
            ],
            answer: 2,
          },
          {
            q: "What does the brain do during deep sleep, according to the passage?",
            options: [
              "It deletes negative emotions",
              "It becomes almost completely inactive",
              "It processes only physical growth",
              "It replays the day's experiences at high speed to store important memories",
            ],
            answer: 3,
          },
          {
            q: "What does seventeen hours of wakefulness do to performance?",
            options: [
              "It triples concentration",
              "It causes tension headaches",
              "It degrades performance to a level comparable to mild alcohol intoxication",
              "It has no measurable effect",
            ],
            answer: 2,
          },
          {
            q: "Why do screens delay sleep?",
            options: [
              "Their hum disturbs light sleepers",
              "Their blue-rich light suppresses melatonin",
              "Their brightness damages eyesight",
              "They warm up the bedroom",
            ],
            answer: 1,
          },
          {
            q: "What is 'social jet lag'?",
            options: [
              "Body-clock disorientation caused by differing weekday and weekend schedules",
              "Fear of international travel",
              "A cure for travel sickness",
              "Insomnia caused by skipping breakfast",
            ],
            answer: 0,
          },
          {
            q: "What do the experts permit as a genuinely helpful habit?",
            options: [
              "Sleeping late at weekends to catch up",
              "A twenty-minute afternoon nap taken early enough",
              "Drinking coffee shortly before bedtime",
              "Checking a bright screen in bed",
            ],
            answer: 1,
          },
          {
            q: "What would be the best title for this passage?",
            options: [
              "Famous dreams in history",
              "The design of the perfect pillow",
              "Why we sleep: what science has learned",
              "How to stay awake for eleven days",
            ],
            answer: 2,
          },
        ],
      },
    ],
  },
  listening: {
    sections: [
      {
        title: "Section 1: A hotel booking phone call",
        transcript:
          "Good afternoon, thanks for calling the Clarendon Hotel, this is Emma speaking. Certainly, I can check your dates for you — that's the twelfth and thirteenth of September, so two nights in total. Good news: we do have availability. A standard single is seventy-five pounds per night and a standard double is ninety-five, but I'd recommend our superior double at one hundred and twenty; it's on the top floor with a direct sea view. All of our rates include breakfast, which we serve from seven until ten on weekdays and from eight until eleven at weekends. If you're driving, we have parking spaces behind the hotel at eight pounds per night — the public car park next door charges more, so do reserve a space with us in advance. Our policy allows free cancellation up to forty-eight hours before arrival. Check-in is from two o'clock on your arrival day, and departure is normally at noon, although you can keep the room until two in the afternoon for fifteen pounds. The gym is open daily from six in the morning until ten at night, and the spa operates on an appointment-only basis at weekends. Yes, we do run an airport shuttle: it leaves at half past each hour from bay three outside the hotel entrance, and tickets are four pounds per person. To hold a room I'll just take a credit card number, but nothing is charged today — the card simply guarantees the booking and you pay when you arrive. May I take your full name, please?",
        questions: [
          {
            q: "The caller's booking is for two nights, on the twelfth and thirteenth of ___.",
            accepted: ["September", "september"],
          },
          {
            q: "A standard double room costs ___ per night.",
            accepted: ["£95", "95", "95 pounds", "ninety-five pounds", "ninety five pounds"],
          },
          {
            q: "The superior double is on the top floor and has a direct ___ view.",
            accepted: ["sea", "ocean"],
          },
          {
            q: "At weekends breakfast is served from eight until ___.",
            accepted: ["11", "11:00", "11 am", "11am", "eleven"],
          },
          {
            q: "Parking behind the hotel costs ___ per night.",
            accepted: ["£8", "8", "8 pounds", "eight pounds"],
          },
          {
            q: "The booking can be cancelled free of charge up to ___ before arrival.",
            accepted: ["48 hours", "forty-eight hours", "forty eight hours", "two days"],
          },
          {
            q: "Guests may check in from ___ o'clock on arrival day.",
            accepted: ["2", "two", "2:00", "2 pm", "2pm", "14:00"],
          },
          {
            q: "Keeping the room until two in the afternoon costs ___.",
            accepted: ["£15", "15", "15 pounds", "fifteen pounds"],
          },
          {
            q: "The airport shuttle leaves from bay three at ___ past each hour.",
            accepted: ["half", "thirty"],
          },
          {
            q: "The caller's credit card will only be charged on ___.",
            accepted: ["arrival", "check-in"],
          },
        ],
      },
      {
        title: "Section 2: A talk recruiting volunteers for a community theatre",
        transcript:
          "Hello everyone, and thank you for coming along tonight to hear about volunteering with the Harbourside Players, our town's community theatre company. The theatre itself is a converted chapel — the building dates from 1860, though it only became our performance home in 1998 — and it seats an audience of one hundred and twenty. Our autumn production, The Importance of Being Earnest, opens on the fourteenth of October and will run for three weeks. But I should say straight away: we are not recruiting actors this evening. What we desperately need are volunteers behind the scenes. Front-of-house stewards welcome the audience and show people to their seats; those shifts run on show nights from a quarter past six until about ten. Our costume team meets on Wednesday afternoons to sew, mend and press, and set painting happens on Sunday mornings, supervised by our resident designer. Full training is provided for every role — nobody expects you to arrive already knowing anything. The rewards, besides the excellent company, are that volunteers watch every production free of charge and receive two guest tickets per season to bring family or friends. We do ask for a minimum commitment of about three hours a week during production months, though we can always be flexible around exams or holidays. If any of this appeals, we are holding an open evening here at the theatre on Tuesday the third of September at half past seven, with tea and biscuits provided. Every volunteer over the age of sixteen is covered by our insurance; only those helping with our youth theatre will need a background check, which we arrange and pay for ourselves. Sign-up sheets are by the door, and our box office takes calls every morning. We would genuinely love to see you.",
        questions: [
          {
            q: "The theatre is housed in a converted ___, which dates from 1860.",
            accepted: ["chapel", "church"],
          },
          {
            q: "The theatre seats an audience of ___.",
            accepted: ["120", "one hundred and twenty", "one hundred twenty"],
          },
          {
            q: "The autumn production is Oscar Wilde's play, The ___ of Being Earnest.",
            accepted: ["importance", "Importance of Being Earnest"],
          },
          {
            q: "The autumn production opens on the ___ of October.",
            accepted: ["14th", "fourteenth", "14"],
          },
          {
            q: "The costume team meets on ___ afternoons.",
            accepted: ["Wednesday", "Wed", "wednesdays"],
          },
          {
            q: "Set painting happens on ___ mornings.",
            accepted: ["Sunday", "Sun", "sundays"],
          },
          {
            q: "Besides watching productions free, volunteers receive ___ guest tickets per season.",
            accepted: ["2", "two"],
          },
          {
            q: "During production months the minimum commitment is about ___ hours a week.",
            accepted: ["3", "three"],
          },
          {
            q: "The open evening is at half past seven on Tuesday the ___ of September.",
            accepted: ["3rd", "third", "3"],
          },
          {
            q: "Only volunteers helping with the ___ theatre will need a background check.",
            accepted: ["youth", "young", "young people"],
          },
        ],
      },
      {
        title: "Section 3: A tutor discussing essay feedback with two students",
        transcript:
          "Tutor: Right, you've both got your essay marks back now, so let's talk through the feedback. Alex, looking at yours first: you used only four sources, and the expectation on this assignment is around ten, so that cost you heavily. Remember, forty per cent of the marks on this module come from critical evaluation — weighing sources against each other — and you can't weigh what you haven't read. Student A: I suppose I started too late, really. Tutor: Then let's make sure we plan better next time. Priya, your essay was much better supported, but your conclusion introduced entirely new material. A conclusion should weigh up what you have already argued; brand-new points at the end simply confuse the marker. Student B: Noted. And what about the referencing? Tutor: Both of you must use APA style on this module — the handbook is completely clear about that. Alex, I noticed the similarity score on your draft. Student A: It was eighteen per cent. Should I be worried? Tutor: Not necessarily. Eighteen per cent can be entirely proper if those matches are correctly quoted and referenced material. The report needs careful interpretation — it is not an automatic penalty. Now, some dates for your diaries. The word limit is two thousand with a ten per cent allowance either way. Resubmissions are due by five o'clock on Friday of week eleven, and marks appear on the online portal two weeks later, released anonymously so nobody sees anyone else's. And finally: if referencing still feels hazy, the library runs a workshop next Monday morning at ten o'clock — I would strongly encourage you both to attend.",
        questions: [
          {
            q: "Alex's essay used only ___ sources.",
            accepted: ["4", "four"],
          },
          {
            q: "For this assignment the expectation is around ___ sources.",
            accepted: ["10", "ten"],
          },
          {
            q: "___ of the module marks come from critical evaluation.",
            accepted: ["40%", "40 per cent", "forty per cent", "40 percent", "forty percent"],
          },
          {
            q: "Priya's conclusion wrongly introduced entirely new ___.",
            accepted: ["material", "points", "new material", "ideas"],
          },
          {
            q: "Both students must use ___ referencing style on this module.",
            accepted: ["APA", "apa"],
          },
          {
            q: "Alex's similarity score on the draft was ___.",
            accepted: ["18%", "eighteen per cent", "18 per cent", "eighteen percent", "18 percent"],
          },
          {
            q: "The word limit for the essay is ___, with a ten per cent allowance either way.",
            accepted: ["2000", "2,000", "two thousand"],
          },
          {
            q: "Resubmissions are due at five o'clock on Friday of week ___.",
            accepted: ["11", "eleven"],
          },
          {
            q: "Marks appear on the online portal ___ later, released anonymously.",
            accepted: ["two weeks", "2 weeks"],
          },
          {
            q: "The library's referencing workshop is next Monday at ___ o'clock.",
            accepted: ["10", "ten", "10:00", "10 am", "10am"],
          },
        ],
      },
      {
        title: "Section 4: A lecture on bilingualism and the brain",
        transcript:
          "Let us begin with definitions: a bilingual is simply someone who uses two languages regularly, whatever their level in each. The surprising thing is how recently bilingualism had a bad name. For much of the twentieth century, experts warned parents that two languages would confuse children and hold them back at school. Those early studies, however, were badly designed: they typically compared bilingual children from poor immigrant families with monolingual children from comfortable backgrounds, so what they measured was poverty as much as vocabulary. In 1962, the Canadian psychologists Elizabeth Peal and Wallace Lambert redid the work properly in Montreal, carefully matching children for background, and found that bilingual children often outperformed monolinguals, especially on tasks demanding flexible thought. Today's explanation runs like this: because both of a bilingual person's languages are always active, the brain must constantly select one and suppress the other. That routine suppression trains what psychologists call executive control — our capacity to direct attention and ignore distractions. One researcher summed it up neatly: for the brain, juggling two languages is like going to the gym. The most talked-about result comes from Ellen Bialystok and her colleagues, who reported that bilingual patients developed the symptoms of dementia some four to five years later than otherwise similar monolingual patients. On the other hand, bilingualism does have documented costs: each language typically holds a slightly smaller vocabulary, and finding exactly the right word can take a split second longer — the familiar tip-of-the-tongue moment. Brain scanning studies even report denser grey matter in the regions handling language control. And code-switching — slipping from one language into the other in a single sentence — is no sign of laziness: it follows strict, shared grammatical rules that only the genuinely fluent can manage. The overall picture, then, is positive but should not be exaggerated in the press: bilingualism offers real, though modest, advantages — and its richest dividend may be cultural rather than medical.",
        questions: [
          {
            q: "For much of the twentieth century experts warned that two languages would hold children back at ___.",
            accepted: ["school", "schools"],
          },
          {
            q: "Early bilingualism studies were badly designed and measured ___ as much as vocabulary.",
            accepted: ["poverty", "class"],
          },
          {
            q: "The properly designed 1962 study by Peal and Lambert was carried out in ___.",
            accepted: ["Montreal", "Canada"],
          },
          {
            q: "Executive control is the capacity to direct attention and ignore ___.",
            accepted: ["distractions", "distraction"],
          },
          {
            q: "For the brain, juggling two languages is like going to the ___.",
            accepted: ["gym", "gymnasium"],
          },
          {
            q: "Bialystok found bilingual patients developed dementia symptoms some ___ to five years later.",
            accepted: ["4", "four"],
          },
          {
            q: "Code-switching follows strict shared ___ rules.",
            accepted: ["grammatical", "grammar"],
          },
          {
            q: "Each of a bilingual person's languages typically holds a slightly smaller ___.",
            accepted: ["vocabulary", "word stock"],
          },
          {
            q: "Brain scans show bilinguals have denser ___ matter in language-control regions.",
            accepted: ["grey", "gray"],
          },
          {
            q: "The lecturer concludes bilingualism's richest dividend may be ___ rather than medical.",
            accepted: ["cultural", "culture"],
          },
        ],
      },
    ],
  },
  writing: {
    task1:
      "The chart below shows the different career routes chosen by school leavers in one country in 2005 and 2025.\n\nUniversity degree: 42%, 55%\nVocational training: 20%, 18%\nImmediate employment: 38%, 27%\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    task2:
      "Some people believe that a university education is the best route to a successful career, while others think that vocational training provides better preparation for today's workplace. Give your opinion and support it with reasons and examples from your own knowledge or experience. Write at least 250 words.",
  },
  speaking: [
    ...speakingPart1([
      "Let's talk about the weather. What is the weather like in your country at this time of year?",
      "Do you prefer hot or cold weather? Why?",
      "How does the weather affect your mood or your daily routine?",
    ]),
    speakingPart2(
      "Describe a person who has inspired you. You should say: who this person is, how you know them, what they have done, and explain why they inspire you.",
    ),
    ...speakingPart3([
      "What qualities do you think make someone a good role model?",
      "Do celebrities have a responsibility to behave well in public? Why or why not?",
      "For children, are parents or famous people more important as role models?",
    ]),
  ],
};
