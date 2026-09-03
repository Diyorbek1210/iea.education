import { speakingPart1, speakingPart2, speakingPart3, type MockTestSet } from "./types";

export const mock2: MockTestSet = {
  id: "mock-2",
  order: 2,
  title: "IELTS Mock Test 2",
  reading: {
    passages: [
      {
        title: "The History of Tea",
        passage:
          "The story of tea begins, so the legend goes, in China around 2737 BC, when leaves from a wild tea bush drifted into a pot of water being boiled for the Emperor Shen Nong. Whether or not the tale is true, by the Tang dynasty tea drinking was already a refined pleasure: in about 760 AD the scholar Lu Yu composed The Classic of Tea, the first systematic treatise on the plant, covering its cultivation, processing and correct preparation, and elevating tea drinking to something close to an art form. From China, the drink crossed to Japan, carried by Buddhist monks who had studied on the mainland and valued tea because it helped them stay alert through long hours of meditation. Tea reached Europe remarkably late for such an ancient beverage. It was Dutch traders who first brought it to Amsterdam in 1610, and by the 1650s it was being sold in the coffee houses of London as a novelty for the curious. Its breakthrough into polite society came through a marriage: when the Portuguese princess Catherine of Braganza married the English king Charles II in 1662, her love of tea made it instantly fashionable at court, and the fashion soon spread down through the aristocracy. For much of the eighteenth century, however, the British government's tea duties were extraordinarily high, sometimes exceeding one hundred per cent of the leaves' value, which made smuggling a thriving trade and led dealers to adulterate tea with coloured dust and dried leaves from other plants. National tastes nevertheless only grew, and the British East India Company, which held a monopoly on the China trade, grew anxious about depending on Chinese growers. In 1848 it sent the Scottish botanist Robert Fortune into China in disguise; Fortune secretly carried out thousands of tea seedlings along with skilled tea workers, allowing the company to establish its own plantations in Assam and the foothills of the Himalayas. Competition for market speed became fierce in Victorian times. Sleek sailing ships known as tea clippers raced from China to London to deliver the new season's harvest, since the first cargo home fetched the highest prices at auction. The product's political weight is equally legendary: in 1773, angered by being taxed without representation, American colonists threw 342 chests of tea into Boston harbour in the famous Boston Tea Party. Even the humble tea bag arrived by accident: in 1908 a New York merchant named Thomas Sullivan posted out samples in small silk pouches, customers simply dunked the whole pouch into hot water instead of opening it, and the idea proved so popular that Sullivan replaced the silk with gauze and, later, paper. Today tea is the most widely consumed drink on earth after water.",
        questions: [
          {
            q: "According to legend, how was tea first discovered?",
            options: [
              "A monk boiled it as medicine",
              "A trader tasted it in India",
              "Leaves drifted into Emperor Shen Nong's pot of boiling water",
              "It was roasted like coffee beans",
            ],
            answer: 2,
          },
          {
            q: "Who wrote The Classic of Tea around 760 AD?",
            options: ["Lu Yu", "Emperor Shen Nong", "Robert Fortune", "Confucius"],
            answer: 0,
          },
          {
            q: "Why did Buddhist monks find tea valuable?",
            options: [
              "It cured common illnesses",
              "It was easy to sell for profit",
              "It flavoured their plain rice meals",
              "It helped them stay alert through long hours of meditation",
            ],
            answer: 3,
          },
          {
            q: "When did tea first reach Europe?",
            options: ["1492", "1610", "1707", "1805"],
            answer: 1,
          },
          {
            q: "Who is credited with making tea fashionable at the English court?",
            options: [
              "Catherine of Braganza",
              "Queen Elizabeth I",
              "Samuel Pepys",
              "Queen Victoria",
            ],
            answer: 0,
          },
          {
            q: "What effect did high tea duties have in eighteenth-century Britain?",
            options: [
              "They ended tea imports from China",
              "They made tea equally cheap for everyone",
              "They encouraged widespread smuggling and adulteration",
              "They forced tea houses to close",
            ],
            answer: 2,
          },
          {
            q: "Why was Robert Fortune sent to China in 1848?",
            options: [
              "To negotiate a new trade treaty",
              "To secretly obtain tea seedlings and skilled workers for Indian plantations",
              "To study Chinese tea ceremonies",
              "To build Britain's first tea clipper",
            ],
            answer: 1,
          },
          {
            q: "What were tea clippers designed for?",
            options: [
              "Carrying passengers in comfort to India",
              "Defending trade routes from pirate ships",
              "Transporting spices from the West Indies",
              "Speed: racing the new season's harvest from China to London",
            ],
            answer: 3,
          },
          {
            q: "What were the American colonists protesting in the Boston Tea Party?",
            options: [
              "The poor quality of imported tea",
              "Being taxed without representation",
              "A ban on growing tea locally",
              "The price of harbour storage",
            ],
            answer: 1,
          },
          {
            q: "How did Thomas Sullivan contribute to tea history?",
            options: [
              "He invented the tea strainer",
              "He founded the first clipper race",
              "He established tea gardens in Ceylon",
              "He accidentally inspired the tea bag with his silk sample pouches",
            ],
            answer: 3,
          },
          {
            q: "What happened to Sullivan's pouches once they proved popular?",
            options: [
              "They were banned by New York officials",
              "They were doubled in size for families",
              "The silk was replaced by gauze and then paper",
              "They were hand-stitched by customers",
            ],
            answer: 2,
          },
          {
            q: "According to the passage, tea is now the most consumed drink in the world after what?",
            options: ["Water", "Coffee", "Milk", "Beer"],
            answer: 0,
          },
          {
            q: "What would be the best title for this passage?",
            options: [
              "The Boston Tea Party explained",
              "Tea: from Chinese legend to the modern cup",
              "How to grow tea in Assam",
              "Why coffee is replacing tea",
            ],
            answer: 1,
          },
        ],
      },
      {
        title: "The Rise of Electric Vehicles",
        passage:
          "It is tempting to think of the electric car as a twenty-first-century invention, but the idea is far older. Experimenters were building crude battery-powered vehicles as early as the 1830s, and by 1900 electric cars actually outnumbered petrol cars on America's roads. Drivers liked them because they were quiet, produced none of the smell of petrol and, crucially, did not need to be started with a strenuous hand crank. London had its own electric taxi fleet from 1897, the carriages of Walter Bersey, whose gentle whirring sound earned them the nickname 'the hummingbirds'. What destroyed the early electric car was not any fault in its design but three blows in quick succession. In 1908 Henry Ford's Model T entered mass production, cutting the price of a petrol car to a fraction of an electric one's cost. In 1912 the electric starter motor eliminated the hand crank, removing the electric car's most prized advantage. Meanwhile, vast new oilfields in Texas made petrol cheap and abundant, and expanding road networks rewarded long-range driving, which early batteries could not provide. Interest flickered back during the oil crises of the 1970s, but the real revival began in the 1990s. General Motors produced the EV1 from 1996, a sleek two-seat electric car that was leased but never sold, and which the company then controversially withdrew and mostly crushed by 2002. In 1997 the Toyota Prius went on sale in Japan, proving that hybrids combining an electric motor with a petrol engine could succeed commercially. The turning point for fully electric driving came in 2008 with the Tesla Roadster, the first highway-legal production car powered by lithium-ion cells, with a range above two hundred miles — clear evidence that batteries could meet real driving needs. Costs have since tumbled: lithium-ion battery packs fell from around 1,200 dollars per kilowatt-hour in 2010 to well under 150 dollars by the early 2020s, transforming what manufacturers could build at a profit. Policy has moved just as fast; Norway, through tax exemptions, toll waivers and free parking, now sees more than eight in ten new car sales fully electric. Difficulties remain, however. Charging networks are still patchy in rural regions, and the mining of lithium and cobalt, both essential for current batteries, often takes place under harsh conditions with serious human costs. Engineers have pinned their hopes on solid-state batteries, which promise faster charging and longer life, but the road from laboratory to showroom has historically proved slow.",
        questions: [
          {
            q: "Around 1900, which type of car was more numerous on American roads?",
            options: ["Petrol cars", "Electric cars", "Steam cars", "Diesel cars"],
            answer: 1,
          },
          {
            q: "What nickname did Londoners give to Walter Bersey's electric taxis?",
            options: ["The beetles", "The silent knights", "The sparklers", "The hummingbirds"],
            answer: 3,
          },
          {
            q: "What advantage did early electric cars hold over petrol cars?",
            options: [
              "They were quiet and needed no hand crank to start",
              "They were cheaper to buy",
              "They had a longer driving range",
              "They were faster on motorways",
            ],
            answer: 0,
          },
          {
            q: "Which development of 1908 badly damaged the electric car's prospects?",
            options: [
              "The invention of the electric starter",
              "A global shortage of copper",
              "The mass production of Ford's cheap Model T",
              "The collapse of road building",
            ],
            answer: 2,
          },
          {
            q: "What did the 1912 electric starter motor eliminate?",
            options: [
              "The steering wheel",
              "The gearbox",
              "The foot brake",
              "The need to hand-crank petrol engines",
            ],
            answer: 3,
          },
          {
            q: "When did interest in electric vehicles first revive after their early decline?",
            options: [
              "During the 1920s boom",
              "During the oil crises of the 1970s",
              "During the 1950s space race",
              "During the 1980s fuel glut",
            ],
            answer: 1,
          },
          {
            q: "What ultimately happened to General Motors' EV1?",
            options: [
              "It sold millions of units worldwide",
              "It remains on sale today",
              "It was withdrawn and mostly crushed",
              "It was converted to run on petrol",
            ],
            answer: 2,
          },
          {
            q: "Which 1997 car proved hybrids could be commercially successful?",
            options: ["The Toyota Prius", "The Ford Focus", "The Mini Cooper", "The Fiat 500"],
            answer: 0,
          },
          {
            q: "What did the 2008 Tesla Roadster demonstrate?",
            options: [
              "That batteries had become cheap",
              "That hybrids beat pure electric cars",
              "That lithium-ion batteries could meet genuine highway driving needs",
              "That solar cars were practical",
            ],
            answer: 2,
          },
          {
            q: "How did lithium-ion battery prices change between 2010 and the early 2020s?",
            options: [
              "They fell from around $1,200 to well under $150 per kilowatt-hour",
              "They roughly doubled",
              "They stayed essentially level",
              "They rose fivefold due to demand",
            ],
            answer: 0,
          },
          {
            q: "Why do most new car buyers in Norway choose electric vehicles?",
            options: [
              "Petrol is no longer sold there",
              "Electric cars are given away free",
              "Norwegian roads exclude other cars",
              "Government policies such as tax exemptions, toll waivers and free parking",
            ],
            answer: 3,
          },
          {
            q: "What concern does the passage raise about battery raw materials?",
            options: [
              "No lithium mines exist",
              "Lithium and cobalt mining often happens under harsh conditions with human costs",
              "Copper is radioactive",
              "Batteries cannot be recycled at all",
            ],
            answer: 1,
          },
          {
            q: "What would be the best title for this passage?",
            options: [
              "Why petrol engines won the race",
              "A history of the Tesla company",
              "Electric cars: an old idea reborn",
              "How an electric motor works",
            ],
            answer: 2,
          },
        ],
      },
      {
        title: "Exploring the Deep Ocean",
        passage:
          "Humanity has mapped the surface of the Moon more precisely than the floor of its own oceans. The systematic study of the deep sea began with the voyage of HMS Challenger between 1872 and 1876, when scientists sailed nearly seventy thousand nautical miles studying the depths with little more than weighted sounding lines and dredges dragged along the seabed. They catalogued more than four thousand previously unknown species, and one of their soundings near the island of Guam detected the deepest place on Earth, the Mariana Trench; its lowest point is still named the Challenger Deep after the expedition. Pulling a dredge is a blunt instrument compared with going down in person. In the 1930s the naturalist William Beebe and the engineer Otis Barton pioneered the bathysphere, a bare steel sphere lowered on a cable from a support ship; in 1934 they reached a depth of over nine hundred metres, a world record. A generation later the Swiss-designed bathyscaphe Trieste floated rather than hung, using a tank of petrol for buoyancy, and in January 1960 Jacques Piccard and the United States Navy lieutenant Don Walsh took it down nearly eleven thousand metres to the floor of the Challenger Deep. The descent took almost five hours, and because the vessel had to conserve its batteries for the climb back, the two men had only about twenty minutes to observe the seabed, where they glimpsed what appeared to be a fish — suggesting that vertebrates might survive even there. The deep then yielded its greatest surprise. In 1977 the research submarine Alvin, working near the Galápagos Islands, discovered hydrothermal vents on the ocean floor, ringed by giant tube worms, crabs and clams in their thousands. Sunlight never reaches that water, so photosynthesis is impossible; the whole food web runs on bacteria that produce energy from vent chemicals, a process called chemosynthesis — the first ecosystem known to exist entirely without the Sun. Physically, it is a merciless realm: pressure rises by roughly one atmosphere for every ten metres of depth, so the trench floor endures about a thousand times the pressure at the surface. Even today, less than a quarter of the seafloor has been mapped in useful detail, which is why an international venture known as Seabed 2030 is attempting to chart it all. Commercial interest is growing too: mining companies covet the polymetallic nodules, mineral-rich lumps scattered across the abyssal plains, while conservationists note that plastic bags have already been photographed in the deepest trenches — proof that our reach exceeds our knowledge.",
        questions: [
          {
            q: "When did the voyage of HMS Challenger begin?",
            options: ["1872", "1772", "1902", "1960"],
            answer: 0,
          },
          {
            q: "What basic tools did the Challenger scientists use to study the depths?",
            options: [
              "Submarines",
              "Underwater robots",
              "Sounding lines and dredges",
              "Sonar imaging",
            ],
            answer: 2,
          },
          {
            q: "The deepest point of the Mariana Trench is named after what?",
            options: [
              "A Greek sea god",
              "The Challenger expedition",
              "A Japanese diving vessel",
              "A deep-sea fish",
            ],
            answer: 1,
          },
          {
            q: "What record did William Beebe set in 1934?",
            options: [
              "The first solo Atlantic crossing",
              "The first underwater photograph",
              "The first scuba-diving patent",
              "A bathysphere descent to more than nine hundred metres",
            ],
            answer: 3,
          },
          {
            q: "Who descended to the bottom of the Challenger Deep in 1960?",
            options: [
              "William Beebe and Otis Barton",
              "Jacques Cousteau and a film crew",
              "Jacques Piccard and Don Walsh aboard the Trieste",
              "Robert Scott and a Norwegian team",
            ],
            answer: 2,
          },
          {
            q: "How much time did Piccard and Walsh have to observe the seabed?",
            options: [
              "About twenty minutes",
              "Three full hours",
              "A whole day",
              "One entire night",
            ],
            answer: 0,
          },
          {
            q: "What did the crew of Alvin discover near the Galápagos Islands in 1977?",
            options: [
              "A lost continent",
              "A fleet of sunken treasure ships",
              "Frozen freshwater lakes",
              "Hydrothermal vents with life supported by chemosynthesis",
            ],
            answer: 3,
          },
          {
            q: "Why was the discovery of vent communities scientifically important?",
            options: [
              "The water there is fresh",
              "They proved an ecosystem could exist entirely without sunlight",
              "Fish cannot survive there",
              "The pressure there is unusually low",
            ],
            answer: 1,
          },
          {
            q: "Roughly how does pressure increase with ocean depth?",
            options: [
              "It doubles every kilometre",
              "It remains almost unchanged",
              "It rises tenfold per metre",
              "It rises about one atmosphere for every ten metres",
            ],
            answer: 3,
          },
          {
            q: "What is the Seabed 2030 venture trying to achieve?",
            options: [
              "To drain selected areas of the ocean",
              "To map the entire ocean floor in useful detail",
              "To ban fishing in all waters",
              "To construct underwater hotels",
            ],
            answer: 1,
          },
          {
            q: "According to the passage, what are polymetallic nodules?",
            options: [
              "Mineral-rich lumps on the deep seabed that mining companies covet",
              "A rare type of coral",
              "Artificial reefs made of steel",
              "Underwater volcanic islands",
            ],
            answer: 0,
          },
          {
            q: "What evidence of human impact has already been found in the deepest trenches?",
            options: [
              "Abandoned oil refineries",
              "Old farm machinery",
              "Plastic bags and similar litter",
              "Railway carriages",
            ],
            answer: 2,
          },
          {
            q: "How long did the Trieste's descent to the floor of the Challenger Deep take?",
            options: [
              "Almost five hours",
              "About twenty minutes",
              "Just under one hour",
              "Two and a half days",
            ],
            answer: 0,
          },
          {
            q: "What would be the best title for this passage?",
            options: [
              "A history of whale hunting",
              "How submarines are built",
              "The wildlife of the Galápagos Islands",
              "Exploring the deep ocean: challenges and discoveries",
            ],
            answer: 3,
          },
        ],
      },
    ],
  },
  listening: {
    sections: [
      {
        title: "Section 1: A phone call about joining a gym",
        transcript:
          "Good morning, thanks for calling Powerhouse Gym on Cross Street, my name's Carla, and I can take you through the membership options. We've got three plans. The standard membership is forty-two pounds a month and gives you access to the gym floor and the swimming pool at any time. The gold plan costs fifty-eight pounds a month and additionally covers all of our fitness classes, including spin, yoga and pilates. If you're able to pay for a year upfront, the annual plan is four hundred and fifty pounds, which works out about two hundred and forty pounds cheaper than paying month by month at the gold rate. There's normally a twenty-five-pound joining fee, but that's being waived this month as part of our New Year promotion. We also run an off-peak membership at twenty-eight pounds a month for people who can come Monday to Friday between midday and four o'clock. The pool opens at six in the morning on weekdays and closes at a quarter to ten in the evening; at weekends it runs from eight until eight. All new members get a free thirty-minute induction with a trainer, which is compulsory before you use the free weights — it's purely for safety. If you're interested in personal training, a single session costs thirty-five pounds, or you can pre-book a block of ten for three hundred pounds. We don't have our own car park, I'm afraid, but there's free parking for two hours in the shopping centre car park across the road. Members on the gold and annual plans also receive one free guest pass each month. And a final note: if you ever want to cancel a monthly plan, we just need thirty days' notice. Would you like to start on the standard or the gold?",
        questions: [
          {
            q: "The standard membership costs ___ a month.",
            accepted: ["£42", "42", "42 pounds", "forty-two pounds", "forty two pounds"],
          },
          {
            q: "All fitness classes, including spin and yoga, are covered by the ___ plan.",
            accepted: ["gold", "gold plan", "the gold plan"],
          },
          {
            q: "Paying annually works out about ___ cheaper than the gold monthly rate.",
            accepted: [
              "£240",
              "240",
              "240 pounds",
              "two hundred and forty pounds",
              "two hundred forty pounds",
            ],
          },
          {
            q: "This month the joining fee is being waived as part of the ___ promotion.",
            accepted: ["New Year", "new year"],
          },
          {
            q: "On weekdays the pool closes at ___ in the evening.",
            accepted: ["9:45", "9:45 pm", "9:45pm", "quarter to ten", "9.45", "21:45"],
          },
          {
            q: "The off-peak plan allows visits Monday to Friday between ___ and four o'clock.",
            accepted: ["midday", "noon", "12", "12:00", "12 pm", "12pm"],
          },
          {
            q: "A pre-booked block of ten personal-training sessions costs ___.",
            accepted: ["£300", "300", "300 pounds", "three hundred pounds"],
          },
          {
            q: "New members must complete a free ___ induction with a trainer.",
            accepted: ["thirty-minute", "30-minute", "thirty minute", "30 minute", "half-hour"],
          },
          {
            q: "Members can park free for two hours in the ___ car park across the road.",
            accepted: ["shopping centre", "shopping center"],
          },
          {
            q: "To cancel a monthly plan, the gym needs ___ notice.",
            accepted: ["30 days", "thirty days", "thirty days'"],
          },
        ],
      },
      {
        title: "Section 2: A talk about a weekly farmers' market",
        transcript:
          "Good evening everyone, and thank you for coming. I'm delighted to tell you a little about the Castle Square farmers' market, which this year celebrates its twentieth anniversary — it has been running since 2005. The market opens every Saturday from eight in the morning until one in the afternoon, whatever the weather. This season we have about forty stalls, and the rule is that all regular stallholders must grow, rear or make their produce within thirty miles of the market, which is how we keep it genuinely local. The stall fee for regular traders is eighteen pounds, but community groups and school projects can have a pitch for just five pounds. You'll find fresh vegetables, cheese from Hill Farm, sourdough from the bakery stall and three hot food trucks serving breakfast. If you're driving, the Market Street multi-storey car park offers free parking for the first two hours — just remember to have your ticket validated at the information tent. Regular customers can pick up a loyalty card: collect six stamps and you get a free coffee from the café stall. We are always looking for volunteer stewards; the busiest shifts begin at six in the morning for setting up, and we only ask for two hours at a time. Dogs are welcome at the market, but please, keep them on a short lead. One thing to note: in December and January, when the weather turns, the market moves indoors to the Corn Exchange. And finally, on the second Saturday of August we host our annual berry festival — do make a note of that in your diaries.",
        questions: [
          {
            q: "The market takes place every ___ from eight in the morning until one.",
            accepted: ["Saturday", "Saturdays"],
          },
          {
            q: "The Castle Square farmers' market has been running since ___.",
            accepted: ["2005", "two thousand and five"],
          },
          {
            q: "This season the market has about ___ stalls.",
            accepted: ["40", "forty", "about 40", "about forty"],
          },
          {
            q: "Regular stallholders must produce their goods within ___ of the market.",
            accepted: ["thirty miles", "30 miles", "30", "thirty"],
          },
          {
            q: "Community groups and school projects can have a pitch for just ___.",
            accepted: ["£5", "5", "5 pounds", "five pounds"],
          },
          {
            q: "Drivers get two hours of free parking at the ___ multi-storey car park.",
            accepted: ["Market Street", "Market St", "market street"],
          },
          {
            q: "Collect six stamps on the loyalty card and you get a free ___ from the café stall.",
            accepted: ["coffee", "free coffee"],
          },
          {
            q: "The busiest steward shifts, for setting up, begin at ___ in the morning.",
            accepted: ["6", "6:00", "6 am", "6am", "six", "06:00"],
          },
          {
            q: "In December and January the market moves indoors to the ___.",
            accepted: ["Corn Exchange", "corn exchange"],
          },
          {
            q: "Dogs are welcome at the market if they are kept on a ___.",
            accepted: ["short lead", "lead"],
          },
        ],
      },
      {
        title: "Section 3: A tutor and two students planning a group presentation",
        transcript:
          "Tutor: Thanks for coming, you two. Your group presentation is the next big assessment for this module — it's worth twenty-five per cent of your final grade — so today we need to settle your plans. Student A: We were hoping to decide on our topic today, actually. Tutor: Perfect timing. Just remember the topic must come from the approved list I handed out in the lecture, and you can't choose the one we demonstrated together in Week 6, otherwise every group would pick it. Student B: And how long should the presentation run for? Tutor: Fifteen minutes exactly, followed by five minutes of questions. I will stop you at fifteen, so rehearse carefully. Student A: Should one of us do most of the talking? Tutor: I'd much rather you shared the time evenly between you — the mark scheme rewards coordination, not solo brilliance. Student B: What about slides? Tutor: Ten slides is the absolute maximum, and any handout you give out must use the Harvard referencing style. Student A: Is there any peer marking involved? Tutor: Yes — twenty per cent of each person's score comes from anonymised feedback from the rest of the group, so contribute fairly to the preparation. Student B: We've actually already booked a rehearsal slot. We're in the media suite on Tuesday at four for a full run-through. Tutor: Excellent. Bring the handout to that rehearsal and time yourselves. And one last tip: glance at your notes, don't recite from them — examiners can always tell the difference.",
        questions: [
          {
            q: "The topic must come from the tutor's ___ list.",
            accepted: ["approved", "approved list"],
          },
          {
            q: "The group presentation is worth ___ of the final module grade.",
            accepted: [
              "25%",
              "25 per cent",
              "twenty-five per cent",
              "25 percent",
              "twenty-five percent",
            ],
          },
          {
            q: "The presentation itself must last exactly ___.",
            accepted: ["15 minutes", "fifteen minutes"],
          },
          {
            q: "After the presentation there will be five minutes of ___.",
            accepted: ["questions", "question", "questioning"],
          },
          {
            q: "Students may not choose the topic demonstrated together in Week ___.",
            accepted: ["6", "six", "6th"],
          },
          {
            q: "The mark scheme rewards ___, not solo brilliance.",
            accepted: ["coordination", "co-ordination", "cooperation"],
          },
          {
            q: "Presentations may include a maximum of ___ slides.",
            accepted: ["10", "ten"],
          },
          {
            q: "Any handout must use the ___ referencing style.",
            accepted: ["Harvard", "harvard referencing", "harvard style"],
          },
          {
            q: "The group's rehearsal in the media suite is booked for ___ at four.",
            accepted: ["Tuesday", "Tues", "Tuesday afternoon"],
          },
          {
            q: "___ of each person's score comes from anonymised feedback from the group.",
            accepted: ["20%", "20 per cent", "twenty per cent", "20 percent", "twenty percent"],
          },
        ],
      },
      {
        title: "Section 4: A lecture on the history of public museums",
        transcript:
          "Good morning. In this lecture I want to trace how the public museum came to be. The idea grew out of cabinets of curiosities — private collections of natural specimens, antiquities and oddities assembled in the homes of wealthy Europeans during the Renaissance, and shown only to invited guests. The real turning point for public access came in 1683, when the Ashmolean Museum in Oxford opened its doors. It was built around the collection of artefacts and natural objects that Elias Ashmole had given to the university, and it is often described as the world's first university museum open to the public. Seventy years later, the British Museum was established by an Act of Parliament in 1753, founded on the roughly seventy-one thousand books, drawings and specimens left to the nation by the physician Hans Sloane; it opened in 1759 and welcomed, in its own words, all 'studious and curious persons', free of charge. Revolutionary France went further still: in 1793 the royal palace of the Louvre became a public art museum, declaring that national treasures belonged to everyone. The idea crossed the Atlantic in 1846, when the Smithsonian Institution was created with the fortune of James Smithson — an English scientist who never once visited the United States, but left his money for, in his phrase, the 'increase and diffusion of knowledge'. In the twentieth century museums repositioned themselves as centres of popular education, and blockbuster exhibitions proved the appetite was enormous: the 1972 Tutankhamun exhibition in London attracted one point seven million visitors. Today the debates continue — repatriation claims over objects such as the Parthenon Marbles and the Benin Bronzes, the rapid growth of digital collections, and, in Britain, the principle of free general admission to national museums, which has been guaranteed since 2001.",
        questions: [
          {
            q: "Cabinets of curiosities were private collections shown only to invited ___.",
            accepted: ["guests", "guest"],
          },
          {
            q: "The Ashmolean Museum opened its doors to the public in ___.",
            accepted: ["1683", "sixteen eighty-three", "one thousand six hundred and eighty-three"],
          },
          {
            q: "The British Museum was founded on the collection left by the physician ___.",
            accepted: ["Hans Sloane", "Sloane"],
          },
          {
            q: "Hans Sloane left roughly ___ books, drawings and specimens to the nation.",
            accepted: ["71,000", "71000", "seventy-one thousand", "seventy one thousand"],
          },
          {
            q: "In 1793 the royal palace of the Louvre became a public ___ museum.",
            accepted: ["art", "fine art", "arts"],
          },
          {
            q: "James Smithson was an English scientist who never once visited the ___.",
            accepted: ["United States", "USA", "US", "America", "United States of America"],
          },
          {
            q: "Smithson left his money for the 'increase and ___ of knowledge'.",
            accepted: ["diffusion", "spread"],
          },
          {
            q: "The 1972 Tutankhamun exhibition in London attracted ___ visitors.",
            accepted: ["1.7 million", "one point seven million", "1,700,000", "1700000"],
          },
          {
            q: "Repatriation debates cover objects such as the Parthenon Marbles and the ___.",
            accepted: ["Benin Bronzes", "benin bronzes", "Benin bronze"],
          },
          {
            q: "In Britain, free general admission to national museums has been guaranteed since ___.",
            accepted: ["2001", "two thousand and one"],
          },
        ],
      },
    ],
  },
  writing: {
    task1:
      "The table below shows the number of visits per week to three leisure attractions in one town in 2015 and 2025.\n\nFarmers' market: 3,200, 5,100\nLeisure centre: 4,500, 6,800\nCinema: 6,200, 4,400\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    task2:
      "Some people believe that working from home offers employees a better quality of life, while others argue that working in an office is essential for teamwork, productivity and career development. Discuss both views and give your own opinion. Write at least 250 words.",
  },
  speaking: [
    ...speakingPart1([
      "Let's talk about food. Do you enjoy cooking? What dishes can you make?",
      "What food from your childhood do you still enjoy eating?",
      "Do you prefer eating at home or in restaurants? Why?",
    ]),
    speakingPart2(
      "Describe a place you have visited that left a strong impression on you. You should say: where it is, when you visited it, what you did there, and explain why it left such a strong impression on you.",
    ),
    ...speakingPart3([
      "Why do you think people enjoy visiting new places?",
      "What are the benefits and drawbacks of tourism for local communities?",
      "How do you think travel and tourism will change in the future?",
    ]),
  ],
};
