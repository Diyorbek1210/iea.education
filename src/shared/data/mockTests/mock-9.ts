import { speakingPart1, speakingPart2, speakingPart3, type MockTestSet } from "./types";

export const mock9: MockTestSet = {
  id: "mock-9",
  order: 9,
  title: "IELTS Mock Test 9",
  reading: {
    passages: [
      {
        title: "A Brief History of Anaesthesia",
        passage:
          "Until the middle of the nineteenth century, surgery was a horror that patients endured fully conscious, held down by muscular assistants while the surgeon worked at terrifying speed; the Scottish surgeon Robert Liston was famously credited with amputating a leg in under thirty seconds. The first hint of a different future came from the young English chemist Humphry Davy, who in 1800 published his experiments with nitrous oxide — 'laughing gas' — and suggested, almost in a footnote, that the gas might be used with advantage in surgical operations. For more than forty years nobody acted on the suggestion. In Hartford, Connecticut, the American dentist Horace Wells attended a laughing-gas exhibition in 1844 and, after using the gas successfully for a painless tooth extraction, attempted a public demonstration in Boston that failed embarrassingly when the patient cried out. Wells's former partner, William Morton, had better luck. On 16 October 1846, at the Massachusetts General Hospital, he administered diethyl ether to a young printer named Edward Gilbert Abbott, and the surgeon John Collins Warren removed a tumour from the patient's neck with no sign of pain, announcing afterwards, 'Gentlemen, this is no humbug.' News of the 'Ether Dome' demonstration travelled around the world within months. In Scotland, James Young Simpson sought a less unpleasant agent than ether, and in November 1847 he tested chloroform by inhaling it with two colleagues at his dinner table; they awoke under their chairs, and within a week Simpson was using the drug in maternity wards. The greatest advertisement came in 1853, when the physician John Snow administered chloroform to Queen Victoria during the birth of her eighth child, Prince Leopold, after which most religious objections to painless childbirth faded away. The final piece arrived in 1884, when the Viennese ophthalmologist Carl Koller discovered that a solution of cocaine could numb the surface of the eye, inaugurating the era of local anaesthesia. Early anaesthesia remained dangerous — chloroform in particular could stop the heart, and roughly one patient in several thousand died from the drug itself — but the twentieth century replaced improvised cloths with precise vaporisers, added muscle relaxants from the 1930s, and introduced continuous monitoring of oxygen levels, so that death from anaesthesia in a healthy patient is now extraordinarily rare. From agony and thirty-second amputations to today's blend of general, regional and local techniques, anaesthesia has arguably contributed more to human welfare than any other single discovery of the nineteenth century.",
        questions: [
          {
            q: "What was the Scottish surgeon Robert Liston famous for?",
            options: [
              "Inventing the stethoscope",
              "Administering the first anaesthetic",
              "Amputating a leg in under thirty seconds",
              "Founding the Royal Society",
            ],
            answer: 2,
          },
          {
            q: "What did Humphry Davy suggest in 1800?",
            options: [
              "Nitrous oxide might be useful in surgical operations",
              "Ether should be banned entirely",
              "Chloroform was too dangerous to test",
              "Surgery should be performed only at night",
            ],
            answer: 0,
          },
          {
            q: "How long did it take before anyone acted on Davy's suggestion?",
            options: [
              "About five years",
              "More than forty years",
              "Exactly one year",
              "Two centuries",
            ],
            answer: 1,
          },
          {
            q: "Why did Horace Wells's public demonstration in Boston fail?",
            options: [
              "The theatre lost all its lighting",
              "He ran out of laughing gas",
              "The patient died during it",
              "The patient cried out in pain",
            ],
            answer: 3,
          },
          {
            q: "Where did William Morton's successful 1846 demonstration take place?",
            options: [
              "The Edinburgh Royal Infirmary",
              "The Massachusetts General Hospital",
              "St Thomas's Hospital in London",
              "A private clinic in Vienna",
            ],
            answer: 1,
          },
          {
            q: "What did surgeon John Collins Warren announce after Morton's demonstration?",
            options: [
              "'Gentlemen, this is no humbug.'",
              "'This can never work again.'",
              "'Ether is too dangerous.'",
              "'The patient felt everything.'",
            ],
            answer: 0,
          },
          {
            q: "Which drug did James Young Simpson first test at his dinner table in November 1847?",
            options: ["Nitrous oxide", "Diethyl ether", "Chloroform", "Cocaine"],
            answer: 2,
          },
          {
            q: "What finally quietened religious objections to painless childbirth?",
            options: [
              "A law passed by parliament",
              "The invention of the syringe",
              "Simpson's textbook on midwifery",
              "Queen Victoria receiving chloroform in 1853",
            ],
            answer: 3,
          },
          {
            q: "Which physician gave chloroform to Queen Victoria?",
            options: ["Joseph Lister", "John Snow", "James Simpson", "William Morton"],
            answer: 1,
          },
          {
            q: "What did Carl Koller discover in 1884?",
            options: [
              "A cocaine solution could numb the surface of the eye",
              "Ethyl ether prevented infections",
              "Morphine could be safely inhaled",
              "Nitrous oxide could replace blood transfusions",
            ],
            answer: 0,
          },
          {
            q: "Why was chloroform particularly dangerous?",
            options: [
              "It left permanent scars",
              "It was extremely expensive",
              "It could stop the patient's heart",
              "It caught fire too easily",
            ],
            answer: 2,
          },
          {
            q: "What made twentieth-century anaesthesia much safer?",
            options: [
              "Using only homeopathic remedies",
              "Removing every hospital from cities",
              "Performing operations more quickly",
              "Precise vaporisers, muscle relaxants and continuous monitoring",
            ],
            answer: 3,
          },
          {
            q: "What would be the best title for this passage?",
            options: [
              "The dangers of modern surgery",
              "From agony to anaesthesia: how surgery lost its pain",
              "A biography of Queen Victoria",
              "The discovery of radioactivity",
            ],
            answer: 1,
          },
        ],
      },
      {
        title: "Smart Cities and Urban Data",
        passage:
          "The United Nations projects that by 2050 nearly seventy per cent of humanity will live in cities, and that prospect has driven enormous investment in 'smart city' technology — the attempt to run urban environments using data collected in real time. The poster child of the movement is Songdo, a purpose-built business district near Seoul in South Korea, where sensors are embedded in roads, electricity grids and even in a pneumatic waste-disposal system that sucks household rubbish through underground pipes, allowing the city to dispense with most refuse lorries. Barcelona, by contrast, has grafted digital management onto an old city of bright stone: its street lights brighten when pedestrians approach and dim again when they leave, its parking bays report empty spaces to a driver app, and thousands of wireless sensors track air quality and the watering needs of its parks. In Copenhagen, the most carefully measured traffic is on two wheels: dozens of bicycle counters across the city log every rider, and planners use the numbers to decide where to widen the cycle lanes. Some cities take the idea further by building a single control room. Rio de Janeiro's Operations Centre, opened in 2010, gathers feeds from around five hundred traffic cameras and some thirty municipal agencies; officials there once compared their job to flying the city like an aeroplane. The justification for all this instrumentation is efficiency. Smart traffic lights that adapt instantly to congestion, water pipes that report their own leaks, and rubbish bins that call for collection when full can cut costs and emissions at the same time; Barcelona claims its smart water, lighting and parking systems save it more than forty million euros a year. Yet the smart city raises awkward questions about who watches the watchers. The most famous cautionary tale unfolded in Toronto, where Sidewalk Labs, a sister company of Google, won approval in 2017 to build a sensor-filled neighbourhood called Quayside, whose pavement tiles would have logged almost everything people did. After fierce criticism of its data-collection plans, the company cancelled the project in May 2020, citing economic uncertainty. Critics such as the writer Evgeny Morozov argued that the smart city too often uses technical fixes to dodge genuinely political problems. Supporters reply that anonymised, openly published data need not compromise privacy, and that the alternative — flying blind in cities of ten million people — is far worse. The debate over the smart city is, in the end, a debate over how much information a community can trust its authorities to hold.",
        questions: [
          {
            q: "According to the United Nations, what share of humanity will live in cities by 2050?",
            options: ["About 30%", "About 50%", "Nearly 70%", "About 90%"],
            answer: 2,
          },
          {
            q: "How does Songdo remove much of its household rubbish?",
            options: [
              "Pneumatic pipes suck it away underground",
              "It is carried out by bicycle couriers",
              "Residents burn it at home",
              "Drones collect it from rooftops",
            ],
            answer: 0,
          },
          {
            q: "How do Barcelona's street lights work?",
            options: [
              "They stay at full brightness all night",
              "They are switched off to save money",
              "They change colour to signal air quality",
              "They brighten when pedestrians approach and dim when they leave",
            ],
            answer: 3,
          },
          {
            q: "Which kind of traffic does Copenhagen measure most carefully?",
            options: ["Delivery vans", "Tourist buses", "Bicycles", "Electric cars"],
            answer: 2,
          },
          {
            q: "What did Rio de Janeiro open in 2010?",
            options: [
              "An Operations Centre combining cameras and municipal agencies",
              "The world's first underground city",
              "A museum of surveillance",
              "South America's first smart airport",
            ],
            answer: 0,
          },
          {
            q: "To what did Rio officials compare their job?",
            options: [
              "Conducting an orchestra",
              "Running a restaurant kitchen",
              "Fighting medieval battles",
              "Flying the city like an aeroplane",
            ],
            answer: 3,
          },
          {
            q: "What double benefit do self-reporting water pipes and bins promise?",
            options: [
              "Lower costs and lower emissions at the same time",
              "Higher taxes and better views",
              "Faster broadband and cheaper rent",
              "Less crime and more parking",
            ],
            answer: 1,
          },
          {
            q: "How much does Barcelona claim its smart systems save it annually?",
            options: [
              "About four million euros",
              "Fifty thousand euros",
              "More than forty million euros",
              "Half a billion euros",
            ],
            answer: 2,
          },
          {
            q: "What was Sidewalk Labs' proposal for Toronto's Quayside district?",
            options: [
              "A sensor-filled neighbourhood whose tiles logged people's movements",
              "A car-free national park in the harbour",
              "A new airport on the waterfront",
              "A data-free gated community",
            ],
            answer: 0,
          },
          {
            q: "Why was the Quayside project cancelled in May 2020?",
            options: [
              "The sensors proved technically impossible to build",
              "Toronto ran out of electricity",
              "Fierce criticism over data collection, with economic uncertainty cited",
              "A rival company bought the land first",
            ],
            answer: 3,
          },
          {
            q: "What did critics such as Evgeny Morozov argue?",
            options: [
              "Sensors are too expensive to install",
              "The smart city uses technical fixes to dodge genuinely political problems",
              "Cities should ban all new technology",
              "Only Google should run modern cities",
            ],
            answer: 1,
          },
          {
            q: "What do supporters of smart cities reply about anonymised, openly published data?",
            options: [
              "It is always easy to identify individuals from it",
              "It need not compromise privacy, and flying blind is worse",
              "It should be sold exclusively to advertisers",
              "It removes the need for elections",
            ],
            answer: 3,
          },
          {
            q: "What would be the best title for this passage?",
            options: [
              "Smart cities: urban efficiency versus personal privacy",
              "Why everyone should move to the countryside",
              "A short history of street lighting",
              "The bicycle revolution in Copenhagen",
            ],
            answer: 0,
          },
        ],
      },
      {
        title: "How Trees Communicate",
        passage:
          "In 1997 the journal Nature published an experiment that quietly upended botany. The Canadian ecologist Suzanne Simard had planted Douglas fir and paper birch seedlings in a forest in British Columbia, sealed them inside plastic bags containing tracer forms of carbon, and tracked where that carbon flowed. She found that the two species were trading food: in summer, when the birch stood in full leaf and the young fir in shade, the birch passed carbon to the fir, and in autumn, when the birch dropped its leaves, the fir paid some of the carbon back. The carbon was not travelling through the air. It moved along a web of fungal threads — mycorrhizal fungi, the name literally meaning 'fungus-root' — linking tree to tree underground. Around ninety per cent of land plants live in partnership with these fungi, exchanging sugars made in their leaves for phosphorus and other minerals the fungi draw from the soil, a trade that began some four hundred and fifty million years ago, when the first plants crept onto land and lacked true roots at all. Simard and her colleagues went on to show that forests are networked in non-random ways. The oldest, largest trees — she calls them 'mother trees' — act as hubs: a single old Douglas fir may be linked by fungi to dozens of neighbours, including its own seedlings, to which it funnels extra sugar and even chemical warning signals. Trees also send messages through the air. Acacia trees browsed by giraffes pump bitter tannins into their leaves, and, crucially, their neighbours downwind begin making tannins within minutes, leading researchers to conclude that the browsed tree releases ethylene gas as an airborne alarm. Laboratory studies have shown a related effect underground: an aphid-attacked bean plant sharing fungal links with unattacked plants causes those neighbours to raise their own chemical defences before the insects arrive. Critics caution against romantic metaphors of endless generosity. The ecologist David George Haskell warns that the image of a forest of reciprocal gifts oversimplifies things: trees also compete fiercely, stealing each other's light and water, and laboratory pot experiments may exaggerate what happens among wild giants of the forest. Still, the practical implications are serious. If clear-felling removes the hub trees, newly planted seedlings may inherit woodland without its underground infrastructure — which may help explain why some replanted forests grow so slowly compared with ancient woodland.",
        questions: [
          {
            q: "What did the journal Nature publish in 1997?",
            options: [
              "A study of giraffe feeding habits",
              "Simard's experiment tracing carbon moving between tree species",
              "The first photograph of a fungal spore",
              "A map of the Amazon forest",
            ],
            answer: 1,
          },
          {
            q: "Which two tree species featured in Simard's experiment?",
            options: [
              "Douglas fir and paper birch",
              "Oak and beech",
              "Redwood and ash",
              "Acacia and eucalyptus",
            ],
            answer: 0,
          },
          {
            q: "What did the experiment show happening in summer?",
            options: [
              "The fir shaded the birch to death",
              "Both species stopped exchanging carbon entirely",
              "The fir's roots ate the birch",
              "The leafy birch passed carbon to the shaded young fir",
            ],
            answer: 3,
          },
          {
            q: "Through what did the carbon travel between the trees?",
            options: [
              "Birds carrying it in their beaks",
              "The wind",
              "A web of mycorrhizal fungal threads underground",
              "Rainwater channels",
            ],
            answer: 2,
          },
          {
            q: "Roughly what share of land plants live in partnership with these fungi?",
            options: ["Around 30%", "Around 90%", "Around 50%", "Around 10%"],
            answer: 1,
          },
          {
            q: "How old, approximately, is the trade between plants and fungi?",
            options: [
              "Two hundred years",
              "Three million years",
              "Four hundred and fifty million years",
              "Fifty thousand years",
            ],
            answer: 2,
          },
          {
            q: "Why did the very first land plants rely on fungi?",
            options: [
              "They lacked true roots",
              "They had no leaves",
              "They lived entirely underwater",
              "They were poisonous to the fungi",
            ],
            answer: 0,
          },
          {
            q: "What does Simard call the oldest, largest trees that act as network hubs?",
            options: ["Elder trees", "Harvest trees", "Signal trees", "Mother trees"],
            answer: 3,
          },
          {
            q: "What do acacia trees produce when browsed by giraffes?",
            options: [
              "Extra sweet nectar",
              "Thicker bark immediately",
              "Bitter tannins in their leaves",
              "Brighter flowers",
            ],
            answer: 2,
          },
          {
            q: "What do acacias downwind of a browsed tree do within minutes?",
            options: [
              "Begin making tannins themselves",
              "Drop all their leaves at once",
              "Stop producing water",
              "Release giraffe repellent into the soil",
            ],
            answer: 0,
          },
          {
            q: "What does the ecologist David George Haskell caution against?",
            options: [
              "Planting any new forests",
              "Romantic metaphors that ignore how fiercely trees also compete",
              "Using fungicides in laboratories",
              "Breeding giraffes in captivity",
            ],
            answer: 1,
          },
          {
            q: "Why might replanted forests grow slowly, according to the passage?",
            options: [
              "The soil is always contaminated with salt",
              "New seedlings receive too much sunlight",
              "Rainfall has declined worldwide",
              "Clear-felling removes hub trees and their underground network",
            ],
            answer: 3,
          },
          {
            q: "What airborne alarm do browsed acacia trees release to warn their neighbours?",
            options: ["Oxygen", "Carbon dioxide", "Ethylene gas", "Methane"],
            answer: 2,
          },
          {
            q: "What would be the best title for this passage?",
            options: [
              "The hidden conversation of the forest",
              "How to protect acacias from giraffes",
              "The life cycle of a Douglas fir",
              "Why fungi destroy woodland",
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
        title: "Section 1: A phone call to a dental surgery",
        transcript:
          "Good morning, Mill Road Dental Surgery, you're speaking to Karen. How can I help you? ... I can see from your record that your last check-up was in February, so you're due one now. The dentist you usually see, Dr Shah, is on holiday until the middle of next month, but Dr Kemp has some availability sooner. We actually have a short-notice appointment tomorrow, Tuesday, at half past four, which another patient has just cancelled — would that suit you? If not, Dr Kemp's next routine slot is a week on Friday at ten past ten in the morning. The check-up itself costs twenty-six pounds; if you would also like a clean and polish with the hygienist, that's an additional forty-two pounds, and we normally book that directly after the examination so you only need to attend once. You'll need to arrive about ten minutes early tomorrow, because we ask all patients to confirm their contact details on a tablet at reception. If you're exempt from NHS charges — for instance if you're pregnant or receiving certain benefits — please bring proof, either your exemption certificate or a recent official letter, because we're required to keep that on file. One thing I should mention is that we operate a missed-appointment policy: if you cancel with less than twenty-four hours' notice, or simply don't attend, there's a charge of twenty-five pounds before we can rebook you. If you ever have a dental emergency, the emergency line opens at eight-thirty on weekday mornings, and those slots go very quickly. We do send a text reminder two days before your appointment, so please make sure the mobile number on your record is still current. Parking is available behind the surgery, but spaces are limited; the on-street bays nearby stop charging after six in the evening. Shall I book you in for tomorrow at half past four, then?",
        questions: [
          {
            q: "The caller's usual dentist, Dr ___, is on holiday until the middle of next month.",
            accepted: ["Shah", "Dr Shah"],
          },
          {
            q: "Tomorrow's short-notice appointment is free because another patient has just ___ it.",
            accepted: ["cancelled", "canceled"],
          },
          {
            q: "Dr Kemp's next routine slot is a week on Friday at ___ in the morning.",
            accepted: ["ten past ten", "10 past ten", "10:10", "10.10"],
          },
          {
            q: "A clean and polish with the hygienist costs an additional £___.",
            accepted: ["42", "42 pounds", "£42", "forty-two", "forty two", "forty-two pounds"],
          },
          {
            q: "Patients confirm their contact details on a ___ at reception.",
            accepted: ["tablet"],
          },
          {
            q: "Exempt patients must bring proof, such as an exemption ___ or a recent official letter.",
            accepted: ["certificate"],
          },
          {
            q: "Cancelling with less than 24 hours' notice means a charge of £___ before rebooking.",
            accepted: [
              "25",
              "25 pounds",
              "£25",
              "twenty-five",
              "twenty five",
              "twenty-five pounds",
            ],
          },
          {
            q: "The emergency line opens at ___ on weekday mornings.",
            accepted: ["eight-thirty", "8:30", "8.30", "half past eight", "8:30 am"],
          },
          {
            q: "The surgery sends a text reminder ___ days before each appointment.",
            accepted: ["2", "two", "2 days", "two days"],
          },
          {
            q: "On-street parking bays stop charging after ___ in the evening.",
            accepted: ["6", "six", "6 pm", "six o'clock"],
          },
        ],
      },
      {
        title: "Section 2: A park ranger's talk on hiking trails and safety",
        transcript:
          "Good morning and welcome to Kestrel Valley Country Park. I'm Dave, one of the rangers, and before you set off I'll run you through the trails and a few important points on safety. We have three waymarked routes. The Riverside Walk follows the valley floor for three kilometres; it's flat, pushchair-friendly and takes about forty minutes at a gentle pace. The Woodland Loop is a six-kilometre circuit through the beech wood, waymarked with red discs; it includes one short steep climb, so allow about an hour and a half. The longest route is the Ridge Trail, a twelve-kilometre loop up onto the moor top, marked with yellow arrows. That one takes a good four hours and should not be attempted after two in the afternoon, because sections of it are very exposed and you don't want to be caught up there as darkness falls. A few safety notes. Mobile phone coverage in the park is extremely patchy: you'll pick up a signal at the visitor centre and on top of the ridge, but the valley floor is essentially a dead zone, so please don't rely on your phone if you get into difficulty. There is an emergency shelter beside the stile at Ling Gate, which you'll find marked on the free map. On water: none of the streams in the park is guaranteed safe to drink, so carry at least a litre per person, and more on a warm day like today. The weather on the moor changes fast — the forecast this morning has rain arriving from three o'clock, so waterproofs are advisable even if it looks fine right now. Dogs must be kept on leads until the end of July, because ground-nesting birds are raising their chicks out on the moor. Finally, please tell us your route at the visitor centre desk by filling in the white trip sheet, and call the ranger office number printed on your map if you haven't returned by closing time — which tonight is six o'clock.",
        questions: [
          {
            q: "The talk is given by Dave, one of the park ___.",
            accepted: ["rangers", "ranger"],
          },
          {
            q: "The pushchair-friendly route is the ___ Walk.",
            accepted: ["Riverside", "Riverside Walk"],
          },
          {
            q: "The Woodland Loop is a circuit of ___ kilometres through the beech wood.",
            accepted: ["6", "six", "6 kilometres", "6 km", "six kilometres"],
          },
          {
            q: "The Ridge Trail is waymarked with ___ arrows.",
            accepted: ["yellow"],
          },
          {
            q: "The Ridge Trail should not be attempted after ___ in the afternoon.",
            accepted: ["2", "two", "2 pm", "two o'clock"],
          },
          {
            q: "Walkers can get a mobile signal at the visitor centre and on top of the ___.",
            accepted: ["ridge", "the ridge"],
          },
          {
            q: "An emergency shelter stands beside the stile at ___ Gate.",
            accepted: ["Ling", "Ling Gate"],
          },
          {
            q: "Walkers should carry at least one ___ of water per person.",
            accepted: ["litre", "liter", "1 litre", "a litre"],
          },
          {
            q: "Dogs must be kept on leads until the end of ___.",
            accepted: ["July"],
          },
          {
            q: "Walkers register their route by filling in the white ___ sheet.",
            accepted: ["trip"],
          },
        ],
      },
      {
        title: "Section 3: Students discussing a robotics project with their professor",
        transcript:
          "Professor: Come in, both of you. So, the recycling-sorting robot — how are we doing with three weeks to the demonstration? Student A: The good news is the arm is finally picking up objects reliably. The trigger we were missing was a loose cable on the gripper sensor, which we replaced on Monday, and it's been fine ever since. Student B: Sorting accuracy is the remaining problem. The robot recognises cans almost perfectly — about ninety-four per cent — but it's labelling around a third of the plastic bottles as glass, which is obviously no good for recycling. Professor: Interesting. Is the camera at fault, or the training data? Student B: We think the problem is the training images. We downloaded them from an online dataset, and they were all photographed on white backgrounds. Our test bench is under fluorescent lighting and casts dark shadows, so the model is learning the wrong cues. Professor: Very plausible diagnosis. Rather than spending days rephotographing everything, try data augmentation — programmatically vary the background in your existing images. It will take maybe a day to implement and usually fixes that kind of lighting dependence. Student A: Brilliant, we'll do that today. There's also the budget question. The new camera mount we need costs a hundred and sixty pounds, but our remaining budget is only two hundred, and we promised to keep fifty pounds in reserve for spare parts. Professor: Then submit a small funding request to the department by Thursday. They'll usually release up to a hundred pounds for final-year project consumables, provided you attach receipts. One more point: in your demonstration, plan to show a failure case and how you handled it. The marking panel gives explicit credit for honest treatment of errors — a flawless-looking demo that hides mistakes scores lower than a real one. Student B: Good to know. Professor: And do book the robotics lab for the Friday before the demonstration for a full rehearsal — the lab gets extremely busy in the final week.",
        questions: [
          {
            q: "The robot demonstration takes place in ___ weeks' time.",
            accepted: ["3", "three"],
          },
          {
            q: "The gripper problem was caused by a loose ___ on the sensor.",
            accepted: ["cable"],
          },
          {
            q: "The robot recognises cans with about ___ per cent accuracy.",
            accepted: ["94", "ninety-four", "ninety four", "94%"],
          },
          {
            q: "Around a third of the plastic bottles are being labelled as ___.",
            accepted: ["glass"],
          },
          {
            q: "The training images were all photographed on ___ backgrounds.",
            accepted: ["white"],
          },
          {
            q: "The professor recommends fixing the problem with data ___.",
            accepted: ["augmentation"],
          },
          {
            q: "The new camera mount costs £___.",
            accepted: [
              "160",
              "160 pounds",
              "£160",
              "one hundred and sixty",
              "a hundred and sixty",
              "one hundred and sixty pounds",
            ],
          },
          {
            q: "The students promised to keep £___ in reserve for spare parts.",
            accepted: ["50", "50 pounds", "£50", "fifty", "fifty pounds"],
          },
          {
            q: "The department usually releases up to £___ for final-year project consumables.",
            accepted: [
              "100",
              "100 pounds",
              "£100",
              "one hundred",
              "a hundred",
              "one hundred pounds",
            ],
          },
          {
            q: "The professor advises showing a ___ case and how the students handled it in the demo.",
            accepted: ["failure"],
          },
        ],
      },
      {
        title: "Section 4: A lecture on the economics of ageing populations",
        transcript:
          "In 1950, barely eight per cent of the world's population was over the age of sixty-five. Today the figure is approaching ten per cent, and by 2050 the United Nations expects it to reach sixteen per cent — one person in six. Nowhere is the shift more visible than in Japan, where almost thirty per cent of people are now aged sixty-five or over, and where, famously, adult nappies have outsold baby nappies since 2011. Economists describe the resulting pressure using the 'dependency ratio' — the number of non-working people supported by every hundred workers. In the European Union that ratio stood at roughly fifty in the early 1990s and is projected to pass seventy-five by the middle of this century. Fewer workers per pensioner strains the classic pay-as-you-go pension system, in which the contributions of today's workers pay the pensions of today's retired. Governments respond in three broad ways. First, they raise the retirement age: France's 2023 reform moving the minimum age from sixty-two to sixty-four triggered months of protest, because few policies are less popular politically. Second, they attempt to increase the birth rate: Hungary spends a larger share of its national income on family benefits than almost any other country, though with mixed results. Third, they substitute machines for missing workers. Japan leads here too, deploying robots in care homes to lift patients, and even furry robotic seals to comfort people with dementia. The economist's deeper worry, however, is healthcare. Medical spending rises steeply with age: in most developed countries, roughly half of all the money a person will spend on healthcare in their lifetime is spent after they turn sixty-five. Some economists are more optimistic, pointing out that it is health, not age alone, that predicts spending, and highlighting the 'silver economy' — the enormous market formed by active, affluent older consumers. The lesson of the data, in my view, is that ageing populations are not a disaster to be feared so much as a success to be managed: longevity is the consequence of nearly everything else getting better.",
        questions: [
          {
            q: "In 1950, barely ___ per cent of the world's population was over sixty-five.",
            accepted: ["8", "eight", "8%", "eight per cent"],
          },
          {
            q: "The United Nations expects the figure to reach ___ per cent by 2050.",
            accepted: ["16", "sixteen", "16%", "sixteen per cent"],
          },
          {
            q: "Almost ___ per cent of Japan's population is now aged sixty-five or over.",
            accepted: ["30", "thirty", "30%", "thirty per cent"],
          },
          {
            q: "In Japan, adult nappies have outsold ___ nappies since 2011.",
            accepted: ["baby"],
          },
          {
            q: "The dependency ratio is the number of non-working people supported by every ___ workers.",
            accepted: ["100", "hundred", "one hundred", "a hundred"],
          },
          {
            q: "The EU dependency ratio is projected to pass ___ by the middle of this century.",
            accepted: ["75", "seventy-five", "seventy five"],
          },
          {
            q: "France's 2023 reform moved the minimum retirement age from sixty-two to ___.",
            accepted: ["64", "sixty-four", "sixty four"],
          },
          {
            q: "Hungary spends a huge share of national income on ___ benefits.",
            accepted: ["family"],
          },
          {
            q: "Japanese care homes deploy robots to ___ patients.",
            accepted: ["lift"],
          },
          {
            q: "Roughly ___ of a person's lifetime healthcare spending occurs after they turn sixty-five.",
            accepted: ["half", "50%", "50 per cent", "fifty per cent", "a half"],
          },
        ],
      },
    ],
  },
  writing: {
    task1:
      "The chart below shows the percentage of GDP spent on healthcare in three countries in 2000 and 2020.\n\nUnited States: 13.3%, 16.9%\nGermany: 9.8%, 11.3%\nUnited Kingdom: 6.6%, 10.0%\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    task2:
      "Some people believe that all healthcare should be free for everyone and funded entirely by the government through taxation, while others argue that individuals should pay at least part of the cost of their own medical treatment. Discuss both views and give your own opinion. Write at least 250 words.",
  },
  speaking: [
    ...speakingPart1([
      "Do you do any regular exercise? What kind, and how often?",
      "Do you think people in your country are healthier than they used to be?",
      "What do you do to relax and look after your health after a busy day?",
    ]),
    speakingPart2(
      "Describe a time when you helped someone. You should say: who you helped, what you did, why they needed help, and explain how you felt about it.",
    ),
    ...speakingPart3([
      "Why do you think some people choose to volunteer in their communities while others do not?",
      "Do you think volunteering should be a compulsory part of school education?",
      "How have communities changed compared with the past, and what effect has this had on volunteering?",
    ]),
  ],
};
