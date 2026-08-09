import { speakingPart1, speakingPart2, speakingPart3, type MockTestSet } from "./types";

export const mock8: MockTestSet = {
  id: "mock-8",
  order: 8,
  title: "IELTS Mock Test 8",
  reading: {
    passages: [
      {
        title: "From Telegraph to Internet",
        passage:
          "On 24 May 1844, Samuel Morse demonstrated the electric telegraph by transmitting the words 'What hath God wrought' from the Supreme Court chamber in Washington to his assistant Alfred Vail in Baltimore, some sixty kilometres away. For the first time in human history, a message could travel faster than the person or horse carrying it. The commercial consequences were dramatic: a letter from New York to London normally spent ten days or more in the hold of a steamship, whereas a telegraphic message crossed the country in minutes. Within a decade, wires linked most of the eastern United States and much of northern Europe. The boldest engineering project of the century followed. In 1858 the entrepreneur Cyrus Field oversaw the laying of a cable across the floor of the Atlantic Ocean between Valentia in Ireland and Heart's Content in Newfoundland. The first cable worked for only three weeks before its insulation failed, but a second attempt, completed in 1866, worked permanently. The service was ruinously expensive — a message of twenty words could cost roughly a farm labourer's weekly wage — yet newspapers, merchants and governments paid willingly, because the cable collapsed a ten-day ocean crossing into a handful of minutes. The telephone, patented by Alexander Graham Bell in 1876, removed the need for trained operators who translated messages into Morse code, and by the early twentieth century ordinary households could speak directly to one another across a city. Meanwhile, in 1901, the Italian inventor Guglielmo Marconi received the first radio signal sent across the Atlantic — the letter S repeated in Morse code — proving that communication needed no wires at all. The internet grew from a very different concern: military researchers in the United States wanted a network able to survive the destruction of any single office. The result, ARPANET, linked its first four university computers in 1969, and in 1983 the network standardised the protocols, known as TCP/IP, still used to direct data around the world today. Many historians of technology date the true birth of the modern internet to 1989, when the British computer scientist Tim Berners-Lee, working at the CERN physics laboratory in Switzerland, proposed a system of documents linked by 'hypertext' — the World Wide Web. His aim was modest: to help physicists share research papers without posting floppy disks to one another. The arrival of the Mosaic browser in 1993, which could display pictures as well as text, turned the web into a mass medium. In 1995 the web had fewer than twenty thousand commercial websites; within a single decade the internet reached its one billionth user, a milestone the telephone had taken more than a century to achieve.",
        questions: [
          {
            q: "Who received the first demonstration telegram from Samuel Morse?",
            options: [
              "President Tyler in Washington",
              "Cyrus Field in Newfoundland",
              "His assistant Alfred Vail in Baltimore",
              "Alexander Graham Bell in New York",
            ],
            answer: 2,
          },
          {
            q: "How long did a letter from New York to London normally take by steamship?",
            options: ["Ten days or more", "Two days", "One month", "Six weeks"],
            answer: 0,
          },
          {
            q: "What happened to the first transatlantic cable, laid in 1858?",
            options: [
              "It was never connected to Ireland",
              "It still carries messages today",
              "It was pulled up within a week",
              "It worked for only three weeks before its insulation failed",
            ],
            answer: 3,
          },
          {
            q: "Why did businesses and governments pay high prices for telegrams?",
            options: [
              "There was a government tax on ordinary letters",
              "Prices and political news arrived within minutes rather than weeks",
              "The cable company refused all other customers",
              "Telegrams were considered more fashionable than letters",
            ],
            answer: 1,
          },
          {
            q: "What did the invention of the telephone remove the need for?",
            options: [
              "Trained operators translating messages into Morse code",
              "Copper wires between cities",
              "A general postal service",
              "Newspapers entirely",
            ],
            answer: 0,
          },
          {
            q: "What did Guglielmo Marconi receive in 1901?",
            options: [
              "The first telephone call across the Atlantic Ocean",
              "A full spoken sentence broadcast across Europe",
              "The first transatlantic radio signal — the letter S in Morse code",
              "A radio signal from a ship in distress",
            ],
            answer: 2,
          },
          {
            q: "What concern lay behind the design of ARPANET?",
            options: [
              "Reducing the cost of telephone calls",
              "Selling computers to universities",
              "Connecting every household in America",
              "Keeping a network running despite the destruction of any single office",
            ],
            answer: 3,
          },
          {
            q: "When did ARPANET standardise the TCP/IP protocols?",
            options: ["1969", "1983", "1989", "1993"],
            answer: 1,
          },
          {
            q: "What was Tim Berners-Lee's original aim in proposing the World Wide Web?",
            options: [
              "To create a global shopping platform",
              "To replace the telephone network",
              "To help physicists share research papers without posting floppy disks",
              "To hide military research from rival countries",
            ],
            answer: 2,
          },
          {
            q: "What did the Mosaic browser of 1993 add to the web?",
            options: [
              "The ability to display pictures as well as text",
              "A government licensing system",
              "The first online payment system",
              "Automatic translation between languages",
            ],
            answer: 0,
          },
          {
            q: "When did the internet reach one billion users?",
            options: [
              "In 1995",
              "Before the year 2000",
              "A century after its invention",
              "Within about ten years of 1995",
            ],
            answer: 3,
          },
          {
            q: "According to the passage, how long did the telephone take to reach one billion users?",
            options: [
              "About ten years",
              "More than a century",
              "About twenty years",
              "It has not reached that figure yet",
            ],
            answer: 1,
          },
          {
            q: "What would be the best title for this passage?",
            options: [
              "Why the internet replaced newspapers",
              "A biography of Samuel Morse",
              "From telegraph to internet: the accelerating history of long-distance communication",
              "The failure of early submarine cables",
            ],
            answer: 2,
          },
        ],
      },
      {
        title: "The Rise of Plant-Based Diets",
        passage:
          "The word 'vegan' did not exist until 1944, when a British woodworker named Donald Watson founded the Vegan Society to distinguish those who avoided all animal products from vegetarians, who continued to consume eggs and dairy. Britain's Vegetarian Society itself had been founded almost a century earlier, in 1847, but for most of the twentieth century avoiding meat remained a small, slightly eccentric minority pursuit. That picture has changed with remarkable speed. Surveys in the United Kingdom suggest the number of people identifying as vegan quadrupled between 2014 and 2019, and large supermarket chains have responded by multiplying their ranges of plant-based products, from oat milk to burgers built from pea protein and soya. The most widely cited argument for reducing meat consumption is environmental. In 2013 the United Nations Food and Agriculture Organisation estimated that livestock generate around 14.5 per cent of the greenhouse gases attributable to human activity — a share larger than every plane, car and ship combined. Beef is by far the most costly common food in climate terms: producing a kilogram of beef generates many times the emissions of the same weight of tofu, and cattle pasture is the single largest driver of deforestation in the Amazon basin. Health arguments run alongside environmental ones. Diets heavy in red and processed meat are linked to heart disease and certain cancers, and doctors increasingly advise patients, in the phrase popularised by campaigners, to make plants the main event rather than the side dish. In 2019, the EAT-Lancet Commission, a panel of thirty-seven scientists, published a 'planetary health diet' recommending that the average person halve their consumption of red meat and sugar while doubling their intake of nuts, pulses, fruit and vegetables. Nutritionists add one important caution. Vitamin B12, essential for nerve function, is found almost exclusively in animal products, so people who exclude them entirely must take a supplement or eat fortified foods. Critics of the modern plant-based industry also note that not all of its products are necessarily healthy: some highly processed meat substitutes contain as much salt and saturated fat as the burgers they imitate, a fact the small print on the packaging sometimes reveals. Food businesses, meanwhile, sense a historic opportunity. The first plant-based burger engineered to 'bleed', using a protein compound derived from soya roots, launched in the United States in 2016, and the market for meat alternatives has since grown into one worth billions of pounds a year. Whether the fashion endures or fades, few industry analysts now expect the menus of the future to look like those of the past.",
        questions: [
          {
            q: "Why did Donald Watson found the Vegan Society in 1944?",
            options: [
              "To campaign against rabbit hunting",
              "To distinguish people avoiding all animal products from vegetarians",
              "To promote organic vegetable farming",
              "To protest against rationing of meat",
            ],
            answer: 1,
          },
          {
            q: "When was Britain's Vegetarian Society founded?",
            options: ["1911", "1944", "1901", "1847"],
            answer: 3,
          },
          {
            q: "What did UK surveys suggest happened between 2014 and 2019?",
            options: [
              "The number of vegans quadrupled",
              "Meat sales collapsed completely",
              "Supermarkets removed all dairy products",
              "The Vegetarian Society was relaunched",
            ],
            answer: 0,
          },
          {
            q: "What share of human-caused greenhouse gases did the FAO attribute to livestock?",
            options: ["Around 5%", "Around 29%", "Around 14.5%", "Around 50%"],
            answer: 2,
          },
          {
            q: "Which common food is described as the most costly in climate terms?",
            options: ["Beef", "Tofu", "Chicken", "Cheese"],
            answer: 0,
          },
          {
            q: "According to the passage, what is the single largest driver of deforestation in the Amazon basin?",
            options: ["Road building", "Cattle pasture", "Gold mining", "Coffee planting"],
            answer: 1,
          },
          {
            q: "What did the EAT-Lancet Commission recommend in 2019?",
            options: [
              "That everyone become fully vegan immediately",
              "Vegetarianism only for adults over fifty",
              "A worldwide ban on beef production",
              "Halving red meat and sugar while doubling nuts, pulses, fruit and vegetables",
            ],
            answer: 3,
          },
          {
            q: "Why must people who exclude animal products entirely take care?",
            options: [
              "Plant foods contain dangerous toxins",
              "Vegetables are always more expensive",
              "Vitamin B12 is found almost exclusively in animal products",
              "They will automatically gain weight",
            ],
            answer: 2,
          },
          {
            q: "What warning do critics give about highly processed meat substitutes?",
            options: [
              "They can contain as much salt and saturated fat as the burgers they imitate",
              "They are banned in most countries",
              "They always taste worse than meat",
              "They contain no protein at all",
            ],
            answer: 0,
          },
          {
            q: "When was the first 'bleeding' plant-based burger launched in the United States?",
            options: ["2019", "2016", "2013", "2006"],
            answer: 1,
          },
          {
            q: "Where does the 'bleeding' compound in that burger come from?",
            options: [
              "Beetroot juice",
              "Artificial food colouring",
              "Crushed insects",
              "A protein compound derived from soya roots",
            ],
            answer: 3,
          },
          {
            q: "What do industry analysts now expect about future menus?",
            options: [
              "Meat will fall below the price of vegetables",
              "Restaurants will stop serving vegetables",
              "They will not look like the menus of the past",
              "Plant-based products will disappear completely",
            ],
            answer: 2,
          },
          {
            q: "What would be the best title for this passage?",
            options: [
              "Why supermarkets are closing their meat counters",
              "The history of Donald Watson",
              "The dangers of vegetarian diets",
              "The rise of plant-based diets: climate, health and opportunity",
            ],
            answer: 3,
          },
        ],
      },
      {
        title: "The Rediscovery of Pompeii",
        passage:
          "When Mount Vesuvius erupted in the autumn of the year 79 AD, it buried the Roman town of Pompeii under a blanket of ash and pumice four to six metres deep, entombing streets, houses, shops and people almost where they stood. The catastrophe is recorded in two remarkable letters by the young lawyer Pliny the Younger, who watched the disaster from across the Bay of Naples; his uncle, the admiral Pliny the Elder, sailed towards the eruption to attempt a rescue and died on the beach. Within a century the town's precise location had been forgotten: new inhabitants farmed the fields above the ruins and marked their maps with only the vague phrase 'the city'. The rediscovery was accidental and slow. In 1599, while cutting a channel to divert the River Sarno, the architect Domenico Fontana uncovered painted walls and inscriptions, but the finds attracted little attention. Serious excavation began at the neighbouring town of Herculaneum in 1738 and at Pompeii itself in 1748, led by the Spanish military engineer Rocque de Alcubierre under the Bourbon king of Naples, Charles III. For fifteen years scholars argued about the identity of the emerging ruins; only in 1763 did excavators unearth an inscription bearing the town's name, confirming beyond doubt that they had found Pompeii. Early digging resembled treasure-hunting, with walls stripped of their finest paintings for the royal museum. The turning point came in 1863, when the archaeologist Giuseppe Fiorelli introduced systematic techniques: he divided the town into regions, numbered its doorways and, most famously, poured plaster into the voids left by decomposed bodies in the hardened ash, producing haunting casts of people and even pets in their final moments. About two-thirds of Pompeii's sixty-six hectares have now been uncovered, and modern policy is deliberately conservative: archaeologists excavate almost no new ground, concentrating instead on preserving what nearly three centuries of exposure to weather and visitors have damaged. The rewards can still be spectacular — the 2020 uncovering of a thermopolium, or hot-food counter, its counter painted with images of the dishes once sold there, made headlines around the world. The whole site was named a UNESCO World Heritage Site in 1997 and receives around two and a half million visitors a year, a level of fame that would have astonished Pliny himself.",
        questions: [
          {
            q: "How deep was the blanket of ash and pumice over Pompeii?",
            options: [
              "About one metre",
              "Four to six metres",
              "Over twenty metres",
              "Less than a centimetre",
            ],
            answer: 1,
          },
          {
            q: "Who wrote the two letters recording the eruption?",
            options: [
              "Domenico Fontana",
              "Rocque de Alcubierre",
              "Giuseppe Fiorelli",
              "Pliny the Younger",
            ],
            answer: 3,
          },
          {
            q: "What did Pliny the Elder do during the eruption?",
            options: [
              "Sailed towards it to attempt a rescue and died",
              "Hid in a cellar until it finished",
              "Drew the first map of the ruins",
              "Ordered the town to be rebuilt immediately",
            ],
            answer: 0,
          },
          {
            q: "How did the town's exact location come to be forgotten?",
            options: [
              "All written records were destroyed by fire",
              "Maps were confiscated by the government",
              "New inhabitants farmed above the ruins and knew it only as 'the city'",
              "The coastline moved thirty kilometres inland",
            ],
            answer: 2,
          },
          {
            q: "What was Domenico Fontana doing when he uncovered painted walls in 1599?",
            options: [
              "Building a church",
              "Cutting a channel to divert the River Sarno",
              "Planting a vineyard",
              "Digging a well for drinking water",
            ],
            answer: 1,
          },
          {
            q: "Under which king did the first major excavation at Pompeii begin in 1748?",
            options: [
              "Napoleon Bonaparte of France",
              "King George III of Britain",
              "King Philip II of Spain",
              "Charles III, the Bourbon king of Naples",
            ],
            answer: 3,
          },
          {
            q: "How was the ruins' identity finally confirmed?",
            options: [
              "An inscription bearing the town's name was unearthed in 1763",
              "A Roman coin was found on the beach",
              "A visitor recognised the town from a painting",
              "Satellite photographs revealed the whole street plan",
            ],
            answer: 0,
          },
          {
            q: "What did the earliest phase of excavation resemble?",
            options: [
              "A military campaign",
              "Treasure-hunting for the royal museum",
              "A university examination",
              "A religious pilgrimage",
            ],
            answer: 2,
          },
          {
            q: "What is Giuseppe Fiorelli most famous for introducing in 1863?",
            options: [
              "Steel scaffolding over the ruins",
              "A museum of Roman coins",
              "The first visitor entrance fee",
              "Pouring plaster into body-shaped voids to make casts",
            ],
            answer: 3,
          },
          {
            q: "Roughly what share of Pompeii has been uncovered?",
            options: [
              "About ten per cent",
              "About two-thirds",
              "About ninety per cent",
              "The entire site",
            ],
            answer: 1,
          },
          {
            q: "What is modern archaeological policy at Pompeii?",
            options: [
              "Digging the entire site within ten years",
              "Reburying everything already found",
              "Preserving exposed areas rather than excavating new ground",
              "Allowing visitors to take small souvenirs home",
            ],
            answer: 2,
          },
          {
            q: "What discovery in 2020 made headlines around the world?",
            options: [
              "A painted hot-food counter known as a thermopolium",
              "A second, entirely unknown town",
              "The tomb of Pliny the Elder",
              "A cargo of Roman gold coins",
            ],
            answer: 0,
          },
          {
            q: "Roughly how many visitors does the site of Pompeii receive each year?",
            options: [
              "About twenty-five thousand",
              "About two and a half million",
              "About ten million",
              "About one million",
            ],
            answer: 1,
          },
          {
            q: "What would be the best title for this passage?",
            options: [
              "The volcanic eruptions of modern Italy",
              "The buried city: the loss and rediscovery of Pompeii",
              "A biography of Giuseppe Fiorelli",
              "Roman architecture in southern Europe",
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
        title: "Section 1: A phone call to a travel insurance company",
        transcript:
          "Good morning, thank you for calling Horizon Travel Insurance, you're speaking to Priya. I can run through our travel cover options for you today. We sell three levels of policy. The Bronze policy covers medical expenses up to two million pounds, but it doesn't include cover for your baggage or for cancelling your trip, so most travellers find it suitable only for short breaks within the UK. The Silver policy, which is our most popular, covers medical costs up to five million pounds, includes cancellation cover of three thousand pounds, and protects baggage up to one thousand five hundred pounds. The Gold policy raises medical cover to ten million pounds and cancellation to the full cost of the trip, up to eight thousand pounds, and it also includes gadget cover for two items, such as a laptop and a phone. If you're travelling within Europe only, prices are considerably lower: a Silver policy for a single trip of up to ten days costs thirty-two pounds, whereas worldwide cover for the same trip, which you'll need for Thailand, is fifty-eight pounds. One important point: if you take more than three foreign trips a year, an annual multi-trip policy at one hundred and twenty pounds works out cheaper than buying separate policies, and the annual policy covers trips of up to thirty days each. There's an excess of fifty pounds on claims for lost baggage, though no excess at all on medical claims. If you have any existing medical condition, such as asthma, you must declare it before you buy, or the insurer can reject a later claim. Finally, if you change your mind after purchasing, you can cancel for a full refund within fourteen days, provided you haven't travelled. Would you like me to set up the Silver worldwide policy for you now?",
        questions: [
          {
            q: "The caller has rung ___ Travel Insurance.",
            accepted: ["Horizon", "Horizon Travel Insurance"],
          },
          {
            q: "The Bronze policy doesn't include cover for ___ or for cancelling your trip.",
            accepted: ["baggage", "your baggage", "luggage"],
          },
          {
            q: "The most popular level of cover is the ___ policy.",
            accepted: ["Silver", "Silver policy", "the Silver policy"],
          },
          {
            q: "The Silver policy protects baggage up to £___.",
            accepted: [
              "1500",
              "1,500",
              "1500 pounds",
              "£1500",
              "one thousand five hundred",
              "one thousand five hundred pounds",
            ],
          },
          {
            q: "The Gold policy includes ___ cover for two items.",
            accepted: ["gadget"],
          },
          {
            q: "Worldwide Silver cover for a trip of up to ten days costs £___.",
            accepted: [
              "58",
              "58 pounds",
              "£58",
              "fifty-eight",
              "fifty eight",
              "fifty-eight pounds",
            ],
          },
          {
            q: "An annual multi-trip policy works out cheaper if you take more than ___ foreign trips a year.",
            accepted: ["3", "three"],
          },
          {
            q: "Under the annual policy, each trip can last up to ___ days.",
            accepted: ["30", "thirty", "30 days", "thirty days"],
          },
          {
            q: "The excess on claims for lost baggage is £___.",
            accepted: ["50", "50 pounds", "£50", "fifty", "fifty pounds"],
          },
          {
            q: "You can cancel for a full refund within ___ days, provided you haven't travelled.",
            accepted: ["14", "fourteen", "14 days", "fourteen days"],
          },
        ],
      },
      {
        title: "Section 2: A talk about a local history festival programme",
        transcript:
          "Good evening everyone, and welcome to the launch of this year's King's Meadow History Festival, which will take place over the weekend of the twelfth and thirteenth of July. The festival opens at ten o'clock on the Saturday morning with a talk in the Assembly Halls on George Street, where Dr Margaret Ellis will present some of the Roman coins discovered during last year's excavation of the market car park. Entry to the talk is free, but you will need a ticket from the tourist information office, because the hall seats only a hundred and forty people. On Saturday afternoon, from half past one, a team of re-enactors in period dress will set up a Roman military camp on the playing fields behind the leisure centre. The children particularly enjoyed the weapons display last year, and this time visitors can also try on replica armour, which costs one pound, with the money going to support the restoration fund. The museum on Castle Hill will stay open late on the Saturday, until nine o'clock, with half-price admission after six. Sunday is focused on the town's maritime past: at eleven, historian David Kim leads a guided walk along the old harbour, finishing at the old fish market, which is being opened to the public for one day only. The walk lasts about ninety minutes and sturdy footwear is recommended, as the paths are uneven. Adult tickets for most events cost six pounds and children's tickets three pounds, with under-fives free; a weekend pass, which covers everything including the guided walk, is twelve pounds per adult if bought in advance, or fifteen pounds on the day. Refreshments will be available all weekend at the festival village in the abbey gardens. Please note that all proceeds this year go towards restoring the medieval wall paintings in St Aidan's Church.",
        questions: [
          {
            q: "The festival takes place on the weekend of the twelfth and thirteenth of ___.",
            accepted: ["July"],
          },
          {
            q: "The opening talk is held in the Assembly Halls on ___ Street.",
            accepted: ["George", "George Street"],
          },
          {
            q: "Free tickets are needed because the hall seats only ___ people.",
            accepted: [
              "140",
              "a hundred and forty",
              "one hundred and forty",
              "hundred and forty",
              "one hundred forty",
            ],
          },
          {
            q: "This year visitors can try on replica ___ at the Roman camp.",
            accepted: ["armour"],
          },
          {
            q: "The £1 charge for the armour goes to support the ___ fund.",
            accepted: ["restoration", "the restoration"],
          },
          {
            q: "On Saturday, the museum offers half-price admission after ___ o'clock.",
            accepted: ["6", "six", "six o'clock", "6 pm"],
          },
          {
            q: "Sunday's programme focuses on the town's ___ past.",
            accepted: ["maritime"],
          },
          {
            q: "Sturdy footwear is recommended for the guided walk because the paths are ___.",
            accepted: ["uneven"],
          },
          {
            q: "A weekend pass bought in advance costs £___ per adult.",
            accepted: ["12", "12 pounds", "£12", "twelve", "twelve pounds"],
          },
          {
            q: "All proceeds go towards restoring the medieval wall paintings in ___ Church.",
            accepted: [
              "St Aidan's",
              "St Aidan's Church",
              "St Aidans",
              "St Aidans Church",
              "Saint Aidan's",
              "St Aidan",
            ],
          },
        ],
      },
      {
        title: "Section 3: Two students planning a psychology experiment with their tutor",
        transcript:
          "Tutor: So, you wanted to run your ideas for the practical past me. Remind me of your research question. Student A: We want to test whether background music affects people's ability to remember a list of words — specifically, whether music with lyrics is more distracting than instrumental music. Tutor: Good, that's a nicely focused question. How are you planning to recruit participants? Student B: We thought we'd put a notice up in the psychology department and aim for sixty first-year students — thirty in each condition. Tutor: Sixty is sensible. But be careful about how you allocate people to groups. Student A: We were actually going to let them choose their own group. Tutor: I'd advise against that. If volunteers who like music all choose the music condition, your results will be very hard to interpret. Randomly assign them instead — it takes two minutes with a random number table. Student B: Right. We're planning to use twenty common nouns, shown on a screen for one second each, then a five-minute delay, then written recall. Tutor: Reasonable, but one second per word makes the task quite easy for most students. You may find nearly everyone gets almost top marks and you can't tell the two conditions apart. Student A: We could add a short maths task during the delay to fill their minds. Tutor: That's a classic interference task — much better. Two other things. First, ethics: your proposal must go to the department ethics committee before you collect any data, and the deadline this term is Friday the seventeenth. Student B: Right, got it. Tutor: Second, remember to debrief participants afterwards — tell them the real purpose of the experiment and that they can withdraw their data at any point within a week. And finally, pilot the whole procedure on two friends first. Pilot studies catch problems like words being too long or the screen timing confusing people. Once you've run the pilot, book another slot with me and we'll go through your data sheet together.",
        questions: [
          {
            q: "The students are testing whether music with ___ is more distracting than instrumental music.",
            accepted: ["lyrics"],
          },
          {
            q: "The students hope to recruit ___ first-year students, thirty in each condition.",
            accepted: ["60", "sixty"],
          },
          {
            q: "Initially, the students planned to let participants ___ their own group.",
            accepted: ["choose", "pick", "select"],
          },
          {
            q: "The tutor recommends assigning people randomly using a random number ___.",
            accepted: ["table"],
          },
          {
            q: "Each word will appear on the screen for one ___ before a five-minute delay.",
            accepted: ["second"],
          },
          {
            q: "The tutor warns that a too-easy task may leave nearly everyone scoring almost ___ marks.",
            accepted: ["top"],
          },
          {
            q: "As an interference task, the students will add a short ___ task during the delay.",
            accepted: ["maths", "math", "mathematics", "maths task"],
          },
          {
            q: "This term's ethics committee deadline is Friday the ___.",
            accepted: ["17th", "seventeenth", "17"],
          },
          {
            q: "At the debrief, participants must be told they can withdraw their data within a ___.",
            accepted: ["week", "a week", "one week"],
          },
          {
            q: "The tutor recommends piloting the whole procedure on ___ friends first.",
            accepted: ["2", "two"],
          },
        ],
      },
      {
        title: "Section 4: A lecture on earthquake-resistant engineering",
        transcript:
          "Today we're looking at how engineers keep buildings standing when the ground itself starts to move. The first principle to grasp is that earthquakes kill surprisingly few people directly; it is almost always the buildings that fall on them. Structural engineers put it bluntly: earthquakes don't kill people, buildings do. Early attempts at earthquake-resistant design concentrated on strength alone, but the Great Kanto earthquake of 1923, which destroyed much of Tokyo and killed more than a hundred thousand people, persuaded Japanese engineers that strength had to be combined with flexibility, because a rigid building simply shatters while a flexible one can sway and survive. Modern design uses three main strategies. The first is base isolation. Instead of fixing a building's foundations rigidly to the ground, engineers place the structure on flexible bearings — typically pads of alternating rubber and steel — which absorb much of the shaking before it reaches the frame, reducing the movement felt in the upper floors by as much as eighty per cent. The second strategy is the damper: think of the shock absorbers in a car. These devices, fitted within the structure itself, convert the earthquake's energy into heat. The third strategy applies to very tall buildings, which need extra help. Taipei 101 in Taiwan, for example, carries a giant steel ball weighing six hundred and sixty tonnes, suspended between its eighty-seventh and ninety-second floors; as the tower sways one way, the pendulum swings the other, actively pulling the structure back towards stability. In California, older concrete buildings pose a particular problem. So-called 'soft-storey' buildings, with open parking areas on the ground floor, lack walls exactly where they most need them, and can pancake downwards in a major shock, as happened tragically in the 1994 Northridge earthquake. The city of Los Angeles has since required the retrofitting of thousands of such buildings, often by inserting steel braces around the ground storey. The lesson of a century of earthquake engineering is elegantly simple: we cannot stop the ground moving, but we can design buildings that move with it.",
        questions: [
          {
            q: "Engineers put it bluntly: earthquakes don't kill people, ___ do.",
            accepted: ["buildings"],
          },
          {
            q: "The Great Kanto earthquake destroyed much of Tokyo in ___.",
            accepted: ["1923"],
          },
          {
            q: "Japanese engineers learnt that strength had to be combined with ___.",
            accepted: ["flexibility"],
          },
          {
            q: "Base-isolation bearings are typically pads of alternating rubber and ___.",
            accepted: ["steel"],
          },
          {
            q: "Base isolation can reduce movement in the upper floors by as much as ___ per cent.",
            accepted: ["80", "eighty", "80 per cent", "80%", "eighty per cent"],
          },
          {
            q: "Dampers convert the earthquake's energy into ___.",
            accepted: ["heat"],
          },
          {
            q: "Taipei 101 carries a suspended steel ball weighing ___ tonnes.",
            accepted: ["660", "six hundred and sixty", "six hundred sixty", "660 tonnes"],
          },
          {
            q: "Soft-storey buildings have open ___ areas on the ground floor.",
            accepted: ["parking", "car parking"],
          },
          {
            q: "Soft-storey buildings pancaked tragically in the 1994 ___ earthquake.",
            accepted: ["Northridge", "the Northridge"],
          },
          {
            q: "Los Angeles has since required the ___ of thousands of such buildings.",
            accepted: ["retrofitting", "retrofit"],
          },
        ],
      },
    ],
  },
  writing: {
    task1:
      "The chart below shows the percentage of clothes bought online rather than in shops by UK adults in different age groups in 2014 and 2024.\n\n18-24: 38%, 71%\n25-44: 31%, 66%\n45-64: 19%, 51%\n65 and over: 7%, 24%\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    task2:
      "The fashion industry produces more clothing than ever before, yet much of it is worn only a few times and then discarded, causing severe environmental damage. Some people believe that governments should regulate or heavily tax the fast fashion industry, while others think responsibility lies mainly with consumers, who should change their buying habits. Discuss both views and give your own opinion. Write at least 250 words.",
  },
  speaking: [
    ...speakingPart1([
      "Let's talk about clothes. Do you enjoy shopping for clothes?",
      "Do you prefer comfortable clothes or fashionable ones?",
      "Has your taste in clothing changed since you were younger?",
    ]),
    speakingPart2(
      "Describe a memorable meal you have had. You should say: what the meal was, who you shared it with, why it was so memorable, and explain how it made you feel.",
    ),
    ...speakingPart3([
      "How has globalisation changed the food people eat in your country?",
      "Do you think traditional dishes will survive the spread of international fast food?",
      "Why do you think sharing meals is important in so many cultures?",
    ]),
  ],
};
