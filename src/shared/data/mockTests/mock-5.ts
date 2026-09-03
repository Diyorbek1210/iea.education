import { speakingPart1, speakingPart2, speakingPart3, type MockTestSet } from "./types";

export const mock5: MockTestSet = {
  id: "mock-5",
  order: 5,
  title: "IELTS Mock Test 5",
  reading: {
    passages: [
      {
        title: "The Development of the Bicycle",
        passage:
          "The bicycle, now so commonplace that it barely attracts a second glance, took more than a century of experimentation to reach its familiar modern form. The first verifiable ancestor of the bicycle was the 'running machine', built in 1817 by the German inventor Karl Drais. Made almost entirely of wood, Drais's contraption had two wheels in line and a steerable front wheel, but no pedals; riders propelled themselves by pushing their feet against the ground. Nevertheless, it allowed a fit adult to travel roughly twice as fast as walking, and Drais demonstrated it successfully near Mannheim that year, covering fourteen kilometres in about an hour. For several decades the design barely advanced, since poor roads and limited metalworking made more sophisticated machines impractical. The crucial breakthrough came in the 1860s in Paris, where the carriage builder Pierre Michaux and his son Ernest fitted cranks and pedals directly to the hub of the front wheel. The resulting machine, later nicknamed the 'boneshaker' for its iron-banded wheels and gruelling ride over cobblestones, became a genuine craze, and in 1869 the first long-distance bicycle race, between Paris and Rouen over one hundred and twenty-three kilometres, was won by the English rider James Moore. The following decade produced the celebrated penny-farthing. Inventors realised that, with pedals fixed directly to the front wheel, a larger wheel meant that each turn of the pedals carried the rider further, so front wheels grew to two metres or more in diameter. Competition clubs such as the Pickwick Bicycle Club in London attracted daring young men, but the riding position, perched directly over the front wheel, made 'headers' — accidents in which a sudden stop threw the rider over the handlebars — a frequent and occasionally fatal occurrence. The remedy arrived in 1885, when John Kemp Starley of Coventry launched the Rover 'safety bicycle'. By using a chain-driven rear wheel and gearing, Starley could place the rider lower and give the bicycle two wheels of equal, manageable size. Three years later, in 1888, the Belfast veterinary surgeon John Boyd Dunlop patented the pneumatic tyre, which dramatically softened the ride. Between 1890 and 1895, during what historians call the 'Bicycle Boom', prices fell sharply and British factories expanded; Raleigh in Nottingham was soon producing more than ten thousand bicycles a year. The social effects were profound. Cheap personal transport let rural workers take jobs in neighbouring towns, and cycling became strongly associated with women's independence; the American reformer Susan B. Anthony declared in 1896 that the bicycle had done more to emancipate women than anything else in the world. Innovation continued throughout the twentieth century: lightweight steel tubing in the 1930s, mass-produced derailleur gears after the Second World War, mountain bikes developed by Californian enthusiasts in the 1970s, and carbon-fibre frames from the 1980s onwards. Today, with thousands of cities operating bicycle-share schemes, the wooden running machine of 1817 has descendants numbering well over one billion worldwide.",
        questions: [
          {
            q: "When did Karl Drais build his 'running machine'?",
            options: ["In 1790", "In 1845", "In 1817", "In 1888"],
            answer: 2,
          },
          {
            q: "How was the running machine propelled?",
            options: [
              "By the rider pushing his feet against the ground",
              "By pedals and cranks attached to the front wheel",
              "By a small steam engine",
              "By coasting downhill wherever possible",
            ],
            answer: 0,
          },
          {
            q: "Who won the first long-distance bicycle race in 1869?",
            options: ["Pierre Michaux", "Karl Drais", "John Boyd Dunlop", "James Moore"],
            answer: 3,
          },
          {
            q: "Why was the penny-farthing's front wheel made so large?",
            options: [
              "To make the bicycle look impressive in competitions",
              "Because a larger wheel carried the rider further with each pedal turn",
              "To clear potholes on poor roads",
              "To allow two riders to sit in line",
            ],
            answer: 1,
          },
          {
            q: "What was a 'header', as described in the passage?",
            options: [
              "A type of bicycle race",
              "A component of the front wheel",
              "An accident in which the rider was thrown over the handlebars",
              "A special riding costume",
            ],
            answer: 2,
          },
          {
            q: "How did Starley's Rover 'safety bicycle' improve safety?",
            options: [
              "It used a chain-driven rear wheel and two equal-sized wheels",
              "It added two extra balancing wheels",
              "It was fitted with a padded seat",
              "It used stronger iron tyres",
            ],
            answer: 0,
          },
          {
            q: "Where did John Kemp Starley launch the Rover bicycle?",
            options: ["In Belfast", "In Nottingham", "In Paris", "In Coventry"],
            answer: 3,
          },
          {
            q: "What did John Boyd Dunlop patent in 1888?",
            options: [
              "The chain drive",
              "The pneumatic tyre",
              "Derailleur gears",
              "The carbon-fibre frame",
            ],
            answer: 1,
          },
          {
            q: "Where was the factory that soon produced over ten thousand bicycles a year?",
            options: [
              "Raleigh, in Coventry",
              "Raleigh, in Belfast",
              "Raleigh, in Nottingham",
              "Raleigh, in London",
            ],
            answer: 2,
          },
          {
            q: "According to Susan B. Anthony in 1896, what had the bicycle done?",
            options: [
              "More to emancipate women than anything else in the world",
              "More damage to rural roads than any other machine",
              "More to harm public health than rail travel",
              "More for professional sport than amateur clubs",
            ],
            answer: 0,
          },
          {
            q: "Where were mountain bikes first developed, according to the passage?",
            options: [
              "In the Scottish Highlands",
              "In Coventry's factories",
              "On European racing circuits",
              "By Californian enthusiasts",
            ],
            answer: 3,
          },
          {
            q: "What characterised the 'Bicycle Boom' of 1890 to 1895?",
            options: [
              "A sharp rise in bicycle prices",
              "Sharply falling prices and expanding production",
              "The return of the penny-farthing",
              "A nationwide ban on racing",
            ],
            answer: 1,
          },
          {
            q: "What would be the best title for this passage?",
            options: [
              "The History of Rail Travel",
              "A Guide to Bicycle Maintenance",
              "The Development of the Bicycle",
              "Famous Bicycle Races of the Nineteenth Century",
            ],
            answer: 2,
          },
        ],
      },
      {
        title: "The Rise of the Sharing Economy",
        passage:
          "The activities now grouped together as the 'sharing economy' — renting a spare room from a stranger, travelling in someone else's car, or paying to use equipment only when it is needed — feel distinctly modern, yet the idea has surprisingly deep academic roots. In 1978, the American sociologists Marcus Felson and Joe Spaeth coined the expression 'collaborative consumption' in a paper describing how students shared goods among themselves. Early internet marketplaces such as eBay, founded in 1995, and Craigslist showed that digital platforms could connect buyers and sellers at almost no cost, but it was not until the following decade that sharing became an industry. Zipcar, a car-sharing company, was founded in 2000 in Cambridge, Massachusetts, on the principle that many households do not need to own a car at all. The best-known example arrived in 2008, when Brian Chesky and two friends, unable to afford their San Francisco rent, let out air mattresses on the floor of their flat to guests attending a design conference; their company, Airbnb, now lists homes in more than two hundred and twenty countries and regions. Uber followed in 2009, connecting passengers with drivers through a smartphone app. The economic logic behind these platforms rests on utilisation: the average privately owned car sits idle for about ninety-five per cent of the time, and many other possessions, from drills to holiday homes, are similarly underused. The consultancy PwC estimated that global revenues in the five main sharing sectors could rise from around fifteen billion dollars in 2013 to three hundred and thirty-five billion dollars by 2025. Supporters also make an environmental case, arguing that when goods are shared, fewer new products need to be manufactured, and noting that car-sharing members drive fewer miles on average than private owners. Critics, however, raise serious objections. Platform drivers and couriers are typically classified as independent contractors rather than employees, and therefore lack sick pay and other protections, while Airbnb has been blamed for draining the supply of long-term rented housing in cities such as Barcelona and Paris. Regulation has followed: Amsterdam, for instance, limited entire-home holiday listings to thirty nights a year. How this fast-growing model should be regulated — and for whose benefit — remains the central question.",
        questions: [
          {
            q: "Who coined the expression 'collaborative consumption', and when?",
            options: [
              "Brian Chesky in 2008",
              "Marcus Felson and Joe Spaeth in 1978",
              "Economists at the World Bank in 2013",
              "City planners in Amsterdam in 2000",
            ],
            answer: 1,
          },
          {
            q: "What event triggered the founding of Airbnb in 2008?",
            options: [
              "A national housing crisis",
              "A government tourism scheme",
              "The founders renting air mattresses to design-conference visitors",
              "A lost hotel booking while on holiday",
            ],
            answer: 2,
          },
          {
            q: "When was the car-sharing company Zipcar founded?",
            options: ["In 2000", "In 1995", "In 2008", "In 2009"],
            answer: 0,
          },
          {
            q: "How much of the time does an average privately owned car sit idle?",
            options: [
              "About 50 per cent",
              "About 65 per cent",
              "About 80 per cent",
              "About 95 per cent",
            ],
            answer: 3,
          },
          {
            q: "What revenue did PwC forecast for the main sharing sectors by 2025?",
            options: [
              "Around 15 billion dollars",
              "Around 100 billion dollars",
              "Around 335 billion dollars",
              "Around 3 trillion dollars",
            ],
            answer: 2,
          },
          {
            q: "Which platform followed Airbnb, launching in 2009?",
            options: ["eBay", "Uber", "Craigslist", "Zipcar"],
            answer: 1,
          },
          {
            q: "What employment-related criticism do critics make of the platforms?",
            options: [
              "Drivers and couriers are classified as independent contractors without full protections",
              "Platforms are unable to make a profit",
              "Drivers are paid too much",
              "The apps are too complicated for workers to use",
            ],
            answer: 0,
          },
          {
            q: "How did Amsterdam respond to the growth of tourist rentals?",
            options: [
              "It banned all short stays",
              "It introduced a tourist tax on airlines",
              "It closed all city-centre hotels",
              "It limited entire-home listings to thirty nights a year",
            ],
            answer: 3,
          },
          {
            q: "What environmental argument do supporters of the sharing economy make?",
            options: [
              "Sharing always increases overall emissions",
              "Sharing goods reduces the demand for newly manufactured products",
              "Sharing has no measurable environmental effect",
              "Sharing only benefits urban transport",
            ],
            answer: 1,
          },
          {
            q: "What do car-sharing members actually do, on average?",
            options: [
              "Buy more cars",
              "Drive more miles than private owners",
              "Drive fewer miles than private owners",
              "Move out of cities",
            ],
            answer: 2,
          },
          {
            q: "What problem has Airbnb been blamed for in cities such as Barcelona?",
            options: [
              "Reducing the supply of long-term rented housing",
              "Increasing profits for luxury hotels",
              "Causing traffic congestion",
              "Pushing up school fees",
            ],
            answer: 0,
          },
          {
            q: "What does the passage identify as the central remaining question?",
            options: [
              "How platforms can raise their fees",
              "Whether users are properly insured",
              "Whether the model can be stopped entirely",
              "How the model should be regulated, and for whose benefit",
            ],
            answer: 3,
          },
          {
            q: "What would be the best title for this passage?",
            options: [
              "The History of eBay",
              "The Rise of the Sharing Economy",
              "How to Rent a Car Abroad",
              "The Problems of Mass Tourism",
            ],
            answer: 1,
          },
        ],
      },
      {
        title: "How Human Memory Works",
        passage:
          "Few abilities are as central to human experience as memory, yet the mechanics of remembering remain only partly understood. Psychologists generally divide the process into three stages: encoding, in which information is taken in and prepared; storage, in which it is maintained over time; and retrieval, in which it is brought back to consciousness. Sensory memory holds fleeting impressions of sights and sounds for a second or two, while short-term, or working, memory holds the information we are actively thinking about. In a famous 1956 paper, the Harvard psychologist George Miller proposed the 'magical number seven', suggesting that short-term memory can hold around seven items, give or take two, which helps to explain why telephone numbers were traditionally designed to that length. In 1974, the British researchers Alan Baddeley and Graham Hitch replaced this single-store view with a multi-component model of working memory, separating verbal information, visual material and a directing 'central executive'. Long-term memory itself divides into declarative memory — knowledge of facts (semantic) and personal events (episodic) — and procedural memory for skills such as riding a bicycle, which can be exercised without any conscious recall. The brain structure most central to forming new long-term memories is the hippocampus, a role dramatised by the case of Henry Molaison, known for decades only by his initials, who lost the ability to form new declarative memories after brain surgery in 1953, while his existing skills and older memories remained largely intact. Forgetting has also been mapped with remarkable precision: in 1885 the German scholar Hermann Ebbinghaus memorised thousands of meaningless syllables and plotted a 'forgetting curve', showing that we lose roughly half of newly learned material within an hour and about two-thirds within a day unless it is reviewed, though spaced revision flattens the curve dramatically. Perhaps most unsettlingly, memory is reconstructive rather than a faithful recording. In the 1970s, the psychologist Elizabeth Loftus showed that witnesses to a filmed car accident estimated higher speeds when asked how fast the cars were going when they 'smashed' into each other, rather than 'hit'; the very wording of a question reshaped what people remembered. Each act of recall, it seems, slightly rewrites the memory itself, while many memories are stabilised during sleep, with deep slow-wave sleep particularly important for consolidating facts and events.",
        questions: [
          {
            q: "Into which three stages do psychologists generally divide memory?",
            options: [
              "Recalling, relearning and repeating",
              "Encoding, keeping and searching",
              "Input, output and feedback",
              "Encoding, storage and retrieval",
            ],
            answer: 3,
          },
          {
            q: "What did Miller's 'magical number seven' refer to?",
            options: [
              "Seven distinct types of memory",
              "The approximate capacity of short-term memory",
              "Seven stages of skill learning",
              "A crucial seven hours of sleep",
            ],
            answer: 1,
          },
          {
            q: "What did Baddeley and Hitch propose in 1974?",
            options: [
              "The forgetting curve",
              "The visual field map",
              "A multi-component model of working memory",
              "The magical number seven",
            ],
            answer: 2,
          },
          {
            q: "What does procedural memory store?",
            options: [
              "Skills such as riding a bicycle",
              "Names, dates and facts",
              "Brief sensory impressions",
              "The content of dreams",
            ],
            answer: 0,
          },
          {
            q: "What happened to Henry Molaison after his brain surgery in 1953?",
            options: [
              "He lost his first language",
              "He forgot his own name",
              "He lost his eyesight",
              "He became unable to form new declarative memories",
            ],
            answer: 3,
          },
          {
            q: "What material did Ebbinghaus use to measure forgetting?",
            options: [
              "German poems",
              "Dates of battles",
              "Meaningless syllables",
              "Foreign vocabulary",
            ],
            answer: 2,
          },
          {
            q: "According to the forgetting curve, how much new material is lost within a day without review?",
            options: ["About a quarter", "About two-thirds", "Nearly all of it", "Very little"],
            answer: 1,
          },
          {
            q: "What does the passage say flattens the forgetting curve dramatically?",
            options: [
              "Spaced revision",
              "Cramming the night before",
              "Typing up notes",
              "Listening to music",
            ],
            answer: 0,
          },
          {
            q: "In Loftus's experiment, witnesses who heard the word 'smashed' tended to give:",
            options: [
              "Lower speed estimates",
              "No estimates at all",
              "Higher speed estimates",
              "More accurate memories overall",
            ],
            answer: 2,
          },
          {
            q: "What does Loftus's research suggest about memory?",
            options: [
              "Memory always improves under stress",
              "Stress destroys all memories",
              "Children remember better than adults",
              "Memory is reconstructive rather than a faithful recording",
            ],
            answer: 3,
          },
          {
            q: "Which type of sleep is described as particularly important for consolidating facts and events?",
            options: [
              "Deep slow-wave sleep",
              "Afternoon naps",
              "Light dozing",
              "Any amount of sleep at all",
            ],
            answer: 0,
          },
          {
            q: "Which brain structure is most central to forming new long-term memories?",
            options: ["The cerebellum", "The hippocampus", "The brainstem", "The frontal lobe"],
            answer: 1,
          },
          {
            q: "How long does sensory memory retain impressions, according to the passage?",
            options: ["Roughly one hour", "A full day", "Several weeks", "A second or two"],
            answer: 3,
          },
          {
            q: "What would be the best title for this passage?",
            options: [
              "How to Sleep Better",
              "The Philosophy of the Mind",
              "How Human Memory Works",
              "Famous Psychology Experiments",
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
        title: "Section 1: A phone call to a car-hire company",
        transcript:
          "Good morning, GoTravel Car Hire, Rachel speaking, how can I help you? Right, so you're landing at Bristol Airport on the fourteenth of July and you need a car for five days. Let me check what we have available. We have two suitable models at the moment: the small hatchback, which is thirty-two pounds a day, and the family saloon, at forty-five pounds a day. Both prices include unlimited mileage and basic insurance, but do be aware that the basic cover carries an excess of six hundred pounds — you'd be fully protected only if you take our comprehensive cover, which costs nine pounds a day and reduces the excess to zero. If you collect from the airport desk there's no surcharge, though you may have to queue in the arrivals hall; the cars are parked in the main car park, a five-minute walk away. Alternatively, you can take the free shuttle bus to our depot — it runs every twenty minutes from bay number four outside the terminal — and collection there is usually quicker at busy times. There's one fee to watch for: pick-up after eight in the evening carries an out-of-hours charge of twenty-five pounds, whichever location you choose. Additional drivers cost seven pounds per day each, and any additional driver must be present with their licence at collection. A child seat is five pounds per day, but you must reserve it in advance, as we can't guarantee one on the day. Fuel works on a full-to-full policy: you receive a full tank and return it full, otherwise there's a thirty-pound refuelling charge on top of the fuel itself. Finally, cancellations are free up to forty-eight hours before collection; after that we have to keep the first day's rental. To confirm the booking I'll need a credit card in the main driver's name, and the same card must be shown at the desk when you collect the car.",
        questions: [
          {
            q: "The family saloon costs £___ a day.",
            accepted: ["45", "45 pounds", "forty-five pounds"],
          },
          {
            q: "Both prices include unlimited mileage and basic ___.",
            accepted: ["insurance", "basic insurance"],
          },
          {
            q: "The excess with basic cover is £___.",
            accepted: ["600", "600 pounds", "six hundred pounds"],
          },
          {
            q: "Comprehensive cover costs £___ a day.",
            accepted: ["9", "9 pounds", "nine pounds"],
          },
          {
            q: "The free shuttle bus runs every ___ minutes.",
            accepted: ["20", "twenty", "20 minutes", "twenty minutes"],
          },
          {
            q: "The shuttle bus leaves from bay number ___ outside the terminal.",
            accepted: ["4", "four", "bay 4", "bay four"],
          },
          {
            q: "Pick-up after 8 p.m. carries an out-of-hours charge of £___.",
            accepted: ["25", "25 pounds", "twenty-five pounds"],
          },
          {
            q: "Any additional driver must be present with their ___ at collection.",
            accepted: ["licence", "driving licence"],
          },
          {
            q: "Fuel works on a ___ policy: receive a full tank and return it full.",
            accepted: ["full-to-full", "full to full"],
          },
          {
            q: "Cancellations are free up to ___ hours before collection.",
            accepted: ["48", "forty-eight", "48 hours", "forty-eight hours"],
          },
        ],
      },
      {
        title: "Section 2: A talk for visitors to a historic castle",
        transcript:
          "Well, good morning, everyone, and welcome to Hartleigh Castle. Before you begin exploring, let me give you a quick overview of the site and what's on today. The castle was first built in 1274 by the Earl of Brantford, mainly to guard the river crossing, and was largely rebuilt in the sixteenth century as a family residence. We open daily at nine thirty, and last admission is at four, although the grounds stay open until six. Admission is eleven pounds for adults, nine pounds fifty for concessions, five pounds for children under sixteen, and free for the under-fives. Your ticket covers the Great Hall and the chapel, but the North Tower needs a separate climbing pass costing two pounds extra. It is worth doing for the view, but be warned: it's a hundred and fifteen narrow spiral steps with no lift, so it's not suitable for anyone with mobility problems. Guided tours of the state rooms leave from the courtyard at eleven, one and three, last about forty minutes, and are free with your entry ticket. Photography is welcome everywhere except the chapel, where flash would damage the medieval wall paintings. If you'd like lunch, our tearoom in the old bakehouse serves hot food from twelve until half past two. Do note that the hourly bus from the market square doesn't run on Sundays, so Sunday visitors usually drive; the car park is two pounds for the whole day. Every August Bank Holiday weekend we stage a medieval fair with archery and falconry displays, which is very popular with families. And finally, if you'd prefer to explore at your own pace, audio guides are available from the ticket desk in five languages, hired at two pounds fifty per handset.",
        questions: [
          {
            q: "Hartleigh Castle was first built by the ___.",
            accepted: ["Earl of Brantford", "the Earl of Brantford"],
          },
          {
            q: "The castle opens daily at ___.",
            accepted: ["9:30", "nine thirty", "half past nine", "half 9"],
          },
          {
            q: "Admission costs £___ for concessions.",
            accepted: ["9.50", "9.5", "nine pounds fifty", "9 pounds 50"],
          },
          {
            q: "The North Tower climbing pass costs £___ extra.",
            accepted: ["2", "2 pounds", "two pounds"],
          },
          {
            q: "The North Tower has ___ narrow spiral steps.",
            accepted: ["115", "a hundred and fifteen", "one hundred and fifteen"],
          },
          {
            q: "Guided tours of the state rooms leave from the ___.",
            accepted: ["courtyard", "the courtyard"],
          },
          {
            q: "Photography is welcome everywhere except the ___.",
            accepted: ["chapel", "the chapel"],
          },
          {
            q: "The tearoom serves hot food from twelve until ___.",
            accepted: ["half past two", "2:30", "two thirty", "half 2"],
          },
          {
            q: "The medieval fair is staged every ___.",
            accepted: [
              "August Bank Holiday weekend",
              "August bank holiday",
              "Bank Holiday weekend",
            ],
          },
          {
            q: "Audio guides are available in ___ languages.",
            accepted: ["5", "five", "5 languages", "five languages"],
          },
        ],
      },
      {
        title: "Section 3: A discussion about a geography field trip",
        transcript:
          "Tutor: Right, let's go through the plans for the geography field trip next month. You've been organising the booking, so can you update us? Student A: Yes. We're going to Snowdonia for three days, leaving on Friday the fourteenth at seven thirty in the morning — from the sports hall car park, not the main gate, because the coach can't turn round at the gate. Student B: And we're staying at the field studies centre in Betws-y-Coed, which comes to a hundred and ten pounds each for the whole trip, including all meals. The department wants a deposit of thirty pounds by the fifteenth of March at the latest to secure the rooms. Tutor: Good. Now, what about the fieldwork itself? Student A: We'll be measuring river discharge along the Afon Llugwy. We've booked the flow meters and we plan to take readings at six sites between the upper course and the confluence. Student B: We're also recording slope angles with the clinometers, and at each site we'll collect thirty pebbles to measure their size and roundness, to test whether they get smaller and rounder downstream. Tutor: That's a solid design, but thirty pebbles per site is the minimum I'd accept — if you can manage fifty, your results will be much more convincing. Also remember that the risk assessment forms must be with me at least two weeks before departure, or the university won't let the trip go ahead. Student A: Right. One practical point — is there wifi at the centre? I was hoping to start analysing the data in the evenings. Tutor: There isn't, I'm afraid, and mobile reception is patchy at best, so take paper recording sheets and plan to enter the data once we're back. Student B: And the report afterwards is two thousand words, due on the twentieth of April — is that correct? Tutor: Correct. And it's an individual report, even though you collect the data in groups, so make sure your write-ups aren't identical.",
        questions: [
          {
            q: "The coach leaves from the sports hall ___, not the main gate.",
            accepted: ["car park", "carpark", "parking area"],
          },
          {
            q: "The trip to Snowdonia lasts ___ days.",
            accepted: ["3", "three", "3 days", "three days"],
          },
          {
            q: "The stay costs £___ per person, including all meals.",
            accepted: [
              "110",
              "110 pounds",
              "a hundred and ten pounds",
              "one hundred and ten pounds",
            ],
          },
          {
            q: "The deposit of £30 must be paid by the ___ at the latest.",
            accepted: [
              "fifteenth of March",
              "15th of March",
              "15th March",
              "15 March",
              "fifteenth March",
            ],
          },
          {
            q: "River readings will be taken at ___ sites.",
            accepted: ["6", "six", "6 sites", "six sites"],
          },
          {
            q: "The tutor would prefer the students to collect ___ pebbles per site.",
            accepted: ["50", "fifty", "50 pebbles", "fifty pebbles"],
          },
          {
            q: "Risk assessment forms must be submitted at least ___ before departure.",
            accepted: ["two weeks", "2 weeks"],
          },
          {
            q: "The field studies centre has no ___ for evening data analysis.",
            accepted: ["wifi", "wi-fi"],
          },
          {
            q: "The follow-up report is due on the ___.",
            accepted: [
              "twentieth of April",
              "20th of April",
              "20th April",
              "20 April",
              "twentieth April",
            ],
          },
          {
            q: "Each report is ___, even though the data is collected in groups.",
            accepted: ["individual", "individually written", "an individual report"],
          },
        ],
      },
      {
        title: "Section 4: A lecture on bird migration",
        transcript:
          "Good morning. In this final lecture of the module, I want to look at bird migration — how far birds travel, how they find their way, and why their journeys are becoming more dangerous. Let's start with distances. The long-distance champion is the Arctic tern, which travels from its breeding grounds in Greenland and northern Canada to spend the southern summer in Antarctic waters: a round trip of over seventy thousand kilometres a year. Over a long life, a single tern may fly the equivalent of three return journeys to the Moon. The record for a non-stop flight belongs to the bar-tailed godwit. In 2007, satellite tags showed one female flying more than eleven thousand kilometres from Alaska to New Zealand in about nine days, without feeding or resting on the way. To fuel flights like this, birds store enormous quantities of fat in the weeks before departure; some small warblers effectively double their body weight, and during flight they may even shrink parts of their digestive organs to save weight, regrowing them when they arrive. Then there is the question of navigation. Experiments indicate that birds use the sun by day and the patterns of the stars at night, and that they sense the Earth's magnetic field, probably through iron-rich structures in the upper beak and possibly through light-sensitive molecules in the eye. Curiously, Italian experiments in which homing pigeons were deprived of their sense of smell lost their way, suggesting that odour maps also play a role, at least over familiar territory. You may also come across the German term Zugunruhe, meaning migratory restlessness: even caged birds born in captivity become restless at migration time, fluttering in the direction their wild relatives travel, which is strong evidence that the urge to migrate, and even its direction, are inherited. Unfortunately the journey is increasingly hazardous. Glass is a far bigger killer than most people realise: collisions with buildings are estimated to claim hundreds of millions of birds a year in North America alone. Equally serious is the destruction of wetland stopover sites, such as the tidal flats of the Wadden Sea in northern Europe, where great numbers of wading birds traditionally stop to refuel.",
        questions: [
          {
            q: "The Arctic tern makes a round trip of over ___ kilometres a year.",
            accepted: ["70,000", "70000", "seventy thousand", "70 thousand"],
          },
          {
            q: "The godwit's record flight was measured using ___.",
            accepted: ["satellite tags", "satellite tag", "a satellite tag"],
          },
          {
            q: "One female godwit flew more than ___ kilometres non-stop.",
            accepted: ["11,000", "11000", "eleven thousand", "11 thousand"],
          },
          {
            q: "Some small warblers effectively ___ their body weight before departure.",
            accepted: ["double", "doubled"],
          },
          {
            q: "Birds may shrink parts of their digestive organs to save ___.",
            accepted: ["weight", "body weight"],
          },
          {
            q: "Iron-rich structures for sensing the magnetic field are in the upper ___.",
            accepted: ["beak", "the beak"],
          },
          {
            q: "The Italian experiments suggest that ___ maps also play a role in navigation.",
            accepted: ["odour", "smell"],
          },
          {
            q: "Zugunruhe is strong evidence that the urge to migrate is ___.",
            accepted: ["inherited", "innate", "inborn"],
          },
          {
            q: "Glass is described as a far bigger ___ than most people realise.",
            accepted: ["killer", "threat"],
          },
          {
            q: "Wading birds stop to refuel on the tidal flats of the ___.",
            accepted: ["Wadden Sea", "the Wadden Sea"],
          },
        ],
      },
    ],
  },
  writing: {
    task1:
      "The chart below shows the number of international overnight visitors to three European cities, in millions, in 2010 and 2020.\n\nLisbon: 4.2 million in 2010, 7.8 million in 2020\nPrague: 5.4 million in 2010, 9.2 million in 2020\nBudapest: 3.6 million in 2010, 5.9 million in 2020\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    task2:
      "Some people believe that international tourism is damaging to local cultures and traditions, while others argue that it brings valuable economic benefits and promotes mutual understanding. Discuss both views and give your own opinion. Write at least 250 words.",
  },
  speaking: [
    ...speakingPart1([
      "Let's talk about reading. Do you enjoy reading books?",
      "What kind of books did you like reading as a child?",
      "Where do you usually like to read?",
    ]),
    speakingPart2(
      "Describe a festival or celebration you enjoyed. You should say: what festival or celebration it was, who you celebrated it with, what you did during the celebration, and explain why you enjoyed it so much.",
    ),
    ...speakingPart3([
      "Why do you think traditional festivals remain popular in many countries?",
      "Do you think globalisation threatens local traditions and customs?",
      "How important are national traditions in shaping a country's identity?",
    ]),
  ],
};
