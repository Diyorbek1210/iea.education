import { speakingPart1, speakingPart2, speakingPart3, type MockTestSet } from "./types";

export const mock10: MockTestSet = {
  id: "mock-10",
  order: 10,
  title: "IELTS Mock Test 10",
  reading: {
    passages: [
      {
        title: "The Wright Brothers and the Birth of Flight",
        passage:
          "On 17 December 1903, on the wind-swept sand dunes of Kitty Hawk, North Carolina, two bicycle mechanics from Dayton, Ohio, achieved what many learned men had declared impossible. At half past ten in the morning, Orville Wright left the ground aboard their wood-and-fabric Flyer and remained airborne for twelve seconds, covering one hundred and twenty feet — a flight so brief it would have fitted inside a modern airliner. The brothers flew three more times that morning, alternating at the controls, and on the final flight Wilbur stayed up for fifty-nine seconds and travelled eight hundred and fifty-two feet before a gust flipped the machine and damaged it beyond quick repair. Their success was no lucky accident. Self-taught and without formal engineering training, the Wrights attacked flight's real problem, which was not power but control: while rivals bolted ever-larger engines onto unstable machines, the brothers developed 'wing-warping' to roll the aircraft, a movable rudder for turning and a forward elevator for climbing, giving their pilot authority over all three axes of movement at once. Their Dayton bicycle shop served as both factory and laboratory, and a homemade wind tunnel, built from a wooden box and a fan, let them test two hundred wing shapes and expose the published lift tables of the era as dangerously wrong. Kitty Hawk itself had been chosen with care: the brothers wrote to the US Weather Bureau, which recommended the site for its reliable breezes and soft, forgiving sand. Frustratingly, the world took years to believe them. The US Army rejected their offer of an aircraft in 1905, and it was only in 1908, when Wilbur flew graceful circles near Le Mans in France while Orville conducted trials at Fort Myer in Virginia, that scepticism collapsed and fame finally arrived. Ironically, the brothers' obsessively guarded patents then embroiled them in lawsuits with rival aviators, notably Glenn Curtiss, and when Wilbur died of typhoid fever in 1912, aged just forty-five, the Wright brothers' company was already losing its technical lead. A final injustice cast its shadow for decades: the Smithsonian Institution claimed, falsely, that the machine of its former secretary Samuel Langley had been the first 'capable' of flight, and only in 1948 was the record formally corrected, when the original Flyer at last took its place in the Smithsonian as the first powered aeroplane to carry a human being.",
        questions: [
          {
            q: "On what date did the first powered flight take place?",
            options: ["17 December 1901", "17 December 1903", "3 July 1905", "17 November 1908"],
            answer: 1,
          },
          {
            q: "How long did Orville Wright's first flight last?",
            options: ["Two minutes", "Fifty-nine seconds", "Twelve seconds", "One hour"],
            answer: 2,
          },
          {
            q: "What happened at the end of the fourth and final flight of the day?",
            options: [
              "A gust flipped the machine and damaged it beyond quick repair",
              "The Flyer landed smoothly for the night",
              "Wilbur sold the machine to the army",
              "Orville set a world altitude record",
            ],
            answer: 0,
          },
          {
            q: "According to the Wright brothers, what was flight's real problem?",
            options: [
              "Fuel was too expensive",
              "Propellers were too weak",
              "Engines were too heavy",
              "Control, not power",
            ],
            answer: 3,
          },
          {
            q: "What was the purpose of the Wrights' 'wing-warping' technique?",
            options: [
              "Increasing engine speed",
              "Rolling the aircraft",
              "Softening the landing",
              "Cooling the pilot",
            ],
            answer: 1,
          },
          {
            q: "Where did the brothers test their two hundred wing shapes?",
            options: [
              "A professional wind tunnel in New York",
              "The Kitty Hawk dunes at night",
              "A homemade wind tunnel in their Dayton bicycle shop",
              "A borrowed university laboratory",
            ],
            answer: 2,
          },
          {
            q: "Why was Kitty Hawk chosen as the flying site?",
            options: [
              "The US Weather Bureau recommended it for breezes and soft sand",
              "It was the Wrights' home town",
              "The army demanded a coastal base",
              "It had the tallest hills in America",
            ],
            answer: 0,
          },
          {
            q: "How did the US Army respond to the brothers' offer in 1905?",
            options: [
              "It ordered forty aircraft immediately",
              "It sent financial advisers to Dayton",
              "It arrested the brothers",
              "It rejected the offer",
            ],
            answer: 3,
          },
          {
            q: "What finally broke public scepticism in 1908?",
            options: [
              "Wilbur's demonstrations in France and Orville's trials at Fort Myer",
              "A Hollywood film about the brothers",
              "Lindbergh's solo Atlantic crossing",
              "A letter of apology from the army",
            ],
            answer: 1,
          },
          {
            q: "What followed the brothers' rise to fame?",
            options: [
              "They retired to France",
              "Lawsuits over their patents against rivals such as Glenn Curtiss",
              "A second first flight at Kitty Hawk",
              "Complete rejection of powered flight",
            ],
            answer: 2,
          },
          {
            q: "How did Wilbur Wright die?",
            options: [
              "Typhoid fever in 1912, aged forty-five",
              "In a crash over France",
              "Of old age in 1948",
              "In a factory explosion in Dayton",
            ],
            answer: 0,
          },
          {
            q: "What did the Smithsonian Institution wrongly claim for decades?",
            options: [
              "That flight was impossible before 1914",
              "That balloons were safer than aeroplanes",
              "That it had financed the Flyer",
              "That Samuel Langley's machine was the first 'capable' of flight",
            ],
            answer: 3,
          },
          {
            q: "What would be the best title for this passage?",
            options: [
              "The Wright brothers and the birth of flight",
              "A history of the US Weather Bureau",
              "Typhoid fever in early America",
              "Balloons and bicycles of the 1890s",
            ],
            answer: 0,
          },
        ],
      },
      {
        title: "The Growth of the Gig Economy",
        passage:
          "The journalist Tina Brown is generally credited with coining the phrase 'gig economy' in a 2009 essay for The New Yorker magazine, describing workers stitching together 'a bunch of free-floating projects, consultancies, and part-time bits and pieces' after the financial crisis had shredded full-time jobs. Since then the phenomenon has ballooned. The ride-hailing firm Uber, founded in San Francisco in that same year, became its emblem, and by the mid-2010s platforms such as Deliveroo in Britain and TaskRabbit in the United States were matching hundreds of thousands of workers to short jobs — 'gigs' — without ever employing them. Estimates vary wildly by definition, but a survey conducted in the United States in 2022 found that roughly one in six adults had earned money through an online gig platform, often for a few hours a week on top of other work. Defenders of the model emphasise autonomy. Riders and drivers can choose their own hours, combine several platforms, and fit work around study or caring for children; academic surveys consistently find that most gig workers value that flexibility. Critics reply that the flexibility is largely an illusion: platform algorithms set pay rates unilaterally, can deactivate workers without appeal, and the whole framework depends on classifying everyone as an 'independent contractor', which in most countries means no sick pay, no holiday entitlement, no minimum wage and no pension. That classification has become the great legal battleground. In February 2021 the UK Supreme Court ruled that Uber drivers were not self-employed contractors but 'workers' — an intermediate category entitled to the minimum wage and paid holiday — noting that Uber fixed the fares and penalised drivers who declined too many rides. Two months later Spain went further, passing Europe's first law presuming all food-delivery riders to be employees. California moved in the opposite direction: after a 2019 state law would have reclassified drivers as employees, voters passed Proposition 22 in November 2020, keeping app-based drivers as contractors. The financial stakes are not trivial, since converting contractors into employees typically raises a platform's labour costs by twenty to thirty per cent — one reason platforms spend so heavily on lawyers and lobbying. Researchers add a quieter warning: the line between a gig and a career can be dangerously thin, because years of piecemeal work rarely build the skills, pension contributions or references that a salaried job provides almost by accident.",
        questions: [
          {
            q: "Who is generally credited with coining the term 'gig economy'?",
            options: [
              "A government committee in 2015",
              "The journalist Tina Brown, in a 2009 essay",
              "The founders of Uber",
              "A British employment judge",
            ],
            answer: 1,
          },
          {
            q: "When and where was Uber founded?",
            options: [
              "1999 in New York",
              "2014 in London",
              "2003 in Seattle",
              "2009 in San Francisco",
            ],
            answer: 3,
          },
          {
            q: "What did the 2022 US survey find?",
            options: [
              "Roughly one in six adults had earned money via an online gig platform",
              "Half of all adults drove for Uber",
              "Gig work had completely disappeared by 2022",
              "Only students ever used gig platforms",
            ],
            answer: 0,
          },
          {
            q: "What do defenders of the gig model emphasise?",
            options: [
              "Its superior long-term pensions",
              "The shortness of the average ride",
              "The autonomy to choose hours and combine platforms",
              "The company car provided to every driver",
            ],
            answer: 2,
          },
          {
            q: "How do critics characterise gig work's famous flexibility?",
            options: [
              "Superior to salaried work in every way",
              "Largely an illusion, since algorithms set pay and deactivate workers",
              "Guaranteed by international law",
              "Available only on public holidays",
            ],
            answer: 1,
          },
          {
            q: "Which rights does 'independent contractor' status generally deny in most countries?",
            options: [
              "Free speech and voting rights",
              "The right to choose platforms",
              "Access to smartphones",
              "Sick pay, holiday entitlement, the minimum wage and a pension",
            ],
            answer: 3,
          },
          {
            q: "What did the UK Supreme Court decide in February 2021?",
            options: [
              "Uber drivers were banned from London",
              "Gig work was unconstitutional",
              "Uber drivers were 'workers' entitled to minimum wage and paid holiday",
              "All platforms had to merge into one",
            ],
            answer: 2,
          },
          {
            q: "What evidence did the UK court note in reaching its verdict?",
            options: [
              "Uber fixed the fares and penalised drivers who declined too many rides",
              "Drivers set their own wages weekly",
              "Drivers could ignore all ride requests",
              "Uber had never published its algorithm",
            ],
            answer: 0,
          },
          {
            q: "What did Spain pass two months after the UK ruling?",
            options: [
              "A total ban on food delivery",
              "Europe's biggest petrol subsidy",
              "A new motorcycle licence for couriers",
              "Europe's first law presuming all food-delivery riders to be employees",
            ],
            answer: 3,
          },
          {
            q: "What did California voters pass in November 2020?",
            options: [
              "A law taxing every gig journey",
              "Proposition 22, keeping app-based drivers as contractors",
              "A bill granting drivers free fuel",
              "A complete takeover of ride-hailing by the state",
            ],
            answer: 1,
          },
          {
            q: "By how much does conversion from contractor to employee typically raise a platform's labour costs?",
            options: [
              "Five to ten per cent",
              "Over ninety per cent",
              "Twenty to thirty per cent",
              "Nothing at all",
            ],
            answer: 2,
          },
          {
            q: "What 'quiet warning' do researchers add about gig work?",
            options: [
              "It does not build the skills, pensions or references a salaried job provides",
              "It is always more pay than factory work",
              "Smartphones cannot survive delivery bags",
              "Algorithms always favour older workers",
            ],
            answer: 0,
          },
          {
            q: "What would be the best title for this passage?",
            options: [
              "Why delivery apps are closing down",
              "A travel guide to San Francisco",
              "The growth of the gig economy: flexibility and its discontents",
              "How to become a taxi driver",
            ],
            answer: 2,
          },
        ],
      },
      {
        title: "The Exploration of the Amazon",
        passage:
          "The Amazon river system carries a fifth of all the fresh water that flows into the world's oceans — more than the next seven largest rivers combined — yet for centuries the interior of its basin, an expanse roughly the size of Australia, remained almost unknown to outsiders. The first European journey along its length was unintended. In 1541 Gonzalo Pizarro led an expedition east from Peru in search of the mythical gold land of El Dorado, and when supplies ran out he sent a party of fifty-seven men under Francisco de Orellana ahead by boat to find food. Unable to row back against the powerful current, Orellana instead drifted and fought his way down the full length of the river, finally reaching the Atlantic in August 1542 after eight months. His chaplain's account described densely settled riverbank villages and, most memorably, attacks by warriors led by women, prompting Orellana to name the river after the Amazons of Greek legend. For centuries the chaplain's description of populous riverbank cities was dismissed as fantasy, although modern archaeologists now believe it was substantially true — the populations having been destroyed by smallpox carried up the tributaries by later visitors. Three centuries passed before science returned. The English naturalist Henry Walter Bates arrived at Belém in 1848 and spent eleven years collecting insects in the forests, gathering more than fourteen thousand species, around eight thousand of them new to science. The rubber boom of the late 1800s made the river port of Manaus briefly astonishingly rich — it installed electric trams before most European capitals — but the boom collapsed after seeds smuggled out by Henry Wickham in 1876 allowed plantations in Asia to produce rubber far more cheaply. Exploration still ended in mystery. Colonel Percy Fawcett, an experienced surveyor, walked into the Mato Grosso jungle in 1925 with his son Jack and his son's best friend Raleigh Rimell, searching for a lost city he called simply 'Z', and was never seen again. More than a dozen expeditions have subsequently gone in search of him, and it has been estimated that a hundred people may have died in the attempt. Modern exploration is conducted largely from above: airborne lidar surveys reveal hundreds of geometric earthworks beneath the forest canopy, the footprints of the civilisation Orellana described. The Amazon basin today contains some five and a half million square kilometres of forest and an estimated sixteen thousand native tree species — and scientists believe roughly half of its plant species have yet even to be named.",
        questions: [
          {
            q: "What share of the world's fresh water flowing into the oceans does the Amazon carry?",
            options: ["A tenth", "A fifth", "A half", "All of it"],
            answer: 1,
          },
          {
            q: "How does the passage describe the size of the Amazon basin's expanse?",
            options: [
              "Roughly the size of Australia",
              "Bigger than Europe and Asia together",
              "About the size of Great Britain",
              "Smaller than Peru",
            ],
            answer: 0,
          },
          {
            q: "Why did Gonzalo Pizarro's expedition enter the Amazon region?",
            options: [
              "To photograph rare birds",
              "To escape from the Portuguese navy",
              "To build the first bridge across the river",
              "To hunt for the mythical gold land of El Dorado",
            ],
            answer: 3,
          },
          {
            q: "Why did Orellana continue down the river instead of returning?",
            options: [
              "His maps were stolen",
              "He had been ordered never to return",
              "He could not row back against the powerful current",
              "His entire crew had deserted",
            ],
            answer: 2,
          },
          {
            q: "When did Orellana's journey reach the Atlantic?",
            options: ["May 1540", "August 1542", "January 1545", "December 1550"],
            answer: 1,
          },
          {
            q: "Where does the river's name come from?",
            options: [
              "A local word for 'great water'",
              "Orellana's own family name",
              "A Spanish king's mistress",
              "Warriors led by women, recalling the Amazons of Greek legend",
            ],
            answer: 3,
          },
          {
            q: "What do modern archaeologists believe about the chaplain's account of riverbank cities?",
            options: [
              "It was substantially true, with populations later destroyed by smallpox",
              "It was a deliberate fictional story",
              "It described a different continent entirely",
              "It was translated wrongly and never checked",
            ],
            answer: 0,
          },
          {
            q: "How long did Henry Walter Bates spend collecting in the Amazon?",
            options: ["Two months", "Three years", "Eleven years", "Forty years"],
            answer: 2,
          },
          {
            q: "Why did the rubber boom in Manaus collapse?",
            options: [
              "Seeds smuggled out by Henry Wickham let Asian plantations produce rubber more cheaply",
              "Rubber was replaced by plastic almost overnight",
              "A flood destroyed every plantation in Brazil",
              "Customers suddenly preferred leather",
            ],
            answer: 1,
          },
          {
            q: "What was Percy Fawcett searching for in 1925?",
            options: [
              "The source of the Nile",
              "Gold coins left by the Spanish crown",
              "The annual tree-ring records",
              "A lost city he called 'Z'",
            ],
            answer: 3,
          },
          {
            q: "What does the passage say about later searches for Fawcett?",
            options: [
              "His son survived and returned home",
              "Perhaps a hundred people have died in the attempt",
              "The jungle was searched only once",
              "He was discovered alive in 1930",
            ],
            answer: 1,
          },
          {
            q: "What have airborne lidar surveys revealed?",
            options: [
              "A lost pyramid near Belém",
              "Orellana's own gravestone",
              "Hundreds of geometric earthworks beneath the forest canopy",
              "A second river beneath the Amazon",
            ],
            answer: 2,
          },
          {
            q: "What did Manaus install during the rubber boom, ahead of most European capitals?",
            options: [
              "Underground railways",
              "Public libraries",
              "Telephone exchanges",
              "Electric trams",
            ],
            answer: 3,
          },
          {
            q: "What would be the best title for this passage?",
            options: [
              "The exploration of the Amazon: from Orellana to lidar",
              "The rubber barons of Manaus",
              "Birds and insects of South America",
              "How the Aztecs used smallpox",
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
        title: "Section 1: A phone call to a removals company about moving house",
        transcript:
          "Good afternoon, Strongbox Removals, you're speaking to Tony. ... Right, so a two-bedroom flat, moving on Saturday the twelfth of March. Just a heads-up: Saturdays are our busiest and most expensive day, so if you can possibly move on a weekday, you'll save money — the same move on a Wednesday would come to four hundred and eighty pounds instead of six hundred. Now, about access. You said you're on the third floor with no lift? That adds a surcharge of sixty pounds, I'm afraid, because it means carrying everything down the stairs and the crew needs longer. If you want us to pack up your kitchen for you, the full packing service works out at a hundred and twenty pounds and includes boxes, paper and tape. If you'd rather pack yourself, the materials alone are sixty pounds for a two-bedroom kit, which we'd drop off about a week before the move. All moves include basic insurance covering loss or damage up to ten thousand pounds, but individual items worth more than five hundred pounds each need to be listed separately, and extending to full-cover insurance is an extra thirty pounds. Glad to hear there's no piano — that would have been another charge entirely. On the day, the crew will arrive around half past eight and we'd expect to be loaded by half past eleven, traffic permitting. We take a fifty-pound deposit when you book, which is refundable up to seven days before the move, and the balance is due on the day by card or bank transfer — we no longer take cash, I'm afraid. If you need storage between properties, our warehouse charges twenty-two pounds per container per week, with the first week free. Shall I pencil you in for the Wednesday, then, and email you the quote?",
        questions: [
          {
            q: "The caller wants to arrange the removal of a two-bedroom ___.",
            accepted: ["flat"],
          },
          {
            q: "The company's busiest and most expensive moving day is ___.",
            accepted: ["Saturday", "Saturdays"],
          },
          {
            q: "The same move on a Wednesday would cost £___.",
            accepted: [
              "480",
              "480 pounds",
              "£480",
              "four hundred and eighty",
              "four hundred and eighty pounds",
              "four hundred eighty",
            ],
          },
          {
            q: "There is a £60 surcharge because the flat is on the third floor with no ___.",
            accepted: ["lift", "elevator"],
          },
          {
            q: "The full packing service, including boxes, paper and tape, costs £___.",
            accepted: [
              "120",
              "120 pounds",
              "£120",
              "one hundred and twenty",
              "a hundred and twenty",
              "one hundred and twenty pounds",
            ],
          },
          {
            q: "Basic insurance covers loss or damage up to a value of £___.",
            accepted: [
              "10000",
              "10,000",
              "£10,000",
              "ten thousand",
              "10000 pounds",
              "ten thousand pounds",
            ],
          },
          {
            q: "Individual items worth more than £___ each must be listed separately.",
            accepted: ["500", "500 pounds", "£500", "five hundred", "five hundred pounds"],
          },
          {
            q: "The crew expects to be fully loaded by ___ past eleven.",
            accepted: ["half", "half past", "30", "thirty"],
          },
          {
            q: "The £50 deposit is refundable up to ___ days before the move.",
            accepted: ["7", "seven", "7 days", "seven days"],
          },
          {
            q: "The company no longer accepts payment by ___.",
            accepted: ["cash"],
          },
        ],
      },
      {
        title: "Section 2: A talk giving information about a careers fair",
        transcript:
          "Can I have your attention please, everyone? A few crucial announcements before the doors of this year's Careers Fair open at ten o'clock. This year we have sixty employers here — the largest fair this university has ever hosted — filling both halls of the Sports Centre. The main sports hall holds the engineering and technology employers, while the smaller hall next door, just past the swimming pool, is where you'll find banking, consulting and the public sector. A few practical points. You must wear your student ID card at all times: employers will scan it when you hand over a CV, which is how you will hear later about interview invitations, so please make sure the email address on your student record is current. The university print shop has set up a pop-up stand by the main entrance where you can print ten free copies of your CV; after that it's ten pence a page. Workshops begin at eleven o'clock in the seminar rooms upstairs. Two sessions to highlight: at eleven-thirty there's a thirty-minute crash course, 'What employers actually look for in a CV', run by a recruiter from Vantage Bank; and at two-thirty, a session on handling video interviews, which includes a chance to record yourself and receive instant feedback. Mock interviews with careers advisers run all day, but they must be booked in advance at the yellow desk in the lobby — last year all forty slots went in the first hour, so book the moment you walk in. On refreshments: there is no full canteen near the Sports Centre, but a sandwich van will be outside from midday and water dispensers are available in both halls. The fair closes at four o'clock, though please note that the Vantage Bank stand itself closes an hour early, at three, for packing. Finally, pick up a purple feedback card on your way out — completed cards go into a prize draw for a pair of wireless headphones.",
        questions: [
          {
            q: "The Careers Fair fills both halls of the university ___ Centre.",
            accepted: ["Sports", "Sport"],
          },
          {
            q: "This year's fair is hosting ___ employers.",
            accepted: ["60", "sixty"],
          },
          {
            q: "Banking employers are in the smaller hall, just past the swimming ___.",
            accepted: ["pool", "swimming pool"],
          },
          {
            q: "Employers scan a student's ___ card when a CV is handed over.",
            accepted: ["ID", "id", "student ID"],
          },
          {
            q: "After ten free copies, extra CV printing costs ___ pence a page.",
            accepted: ["10", "ten", "10p", "ten pence"],
          },
          {
            q: "The two-thirty workshop covers handling ___ interviews.",
            accepted: ["video"],
          },
          {
            q: "Mock interviews must be booked in advance at the ___ desk in the lobby.",
            accepted: ["yellow"],
          },
          {
            q: "Last year all ___ mock-interview slots went in the first hour.",
            accepted: ["40", "forty"],
          },
          {
            q: "The ___ Bank stand closes an hour early, at three o'clock.",
            accepted: ["Vantage"],
          },
          {
            q: "Completed feedback cards go into a prize draw for wireless ___.",
            accepted: ["headphones", "a pair of wireless headphones"],
          },
        ],
      },
      {
        title: "Section 3: Students and tutor reflecting on a completed group project",
        transcript:
          "Tutor: Right, marks for the group consultancy project are out — you got sixty-eight per cent, a strong 2:1, and I wanted to talk through the feedback with you all. Student A: We're pleased, though honestly we hoped for seventy. Tutor: Understandable. Your written final report was the strongest piece of assessment; the panel lost you marks mainly on the live pitch, where you overran by four minutes and had to rush the recommendations slide. Student B: We knew the timing was a risk. We rehearsed the full pitch just once, the night before, because scheduling everyone's part-time shifts was really difficult. Student A: Honestly, our best decision was swapping roles in week three. Once Marcus took over the financial model and I moved onto client liaison, everything fell into place. Tutor: I noticed — role clarity was one of the assessors' compliments. What about your research process? Student B: We'd planned to survey sixty local businesses and we ended up with twenty-three, which felt like a failure at the time. Student A: But the feedback said the follow-up interviews with five of them added the depth that the survey lacked. Tutor: Exactly — pivots like that show research maturity. If you could start the project again, what would you do differently? Student A: Start the client brief earlier. We spent the first two weeks reading theory, and in hindsight we could have done that alongside the client meetings rather than before them. Student B: And I'd write the reflection log weekly instead of reconstructing it at the end from old emails. We promised ourselves we would and we didn't. Tutor: Both fair observations. One last thing: the peer-review forms are confidential, but I can tell you the collaboration scores for your group were among the highest in the cohort. That matters — employers ask specifically about teamwork when they ring for references.",
        questions: [
          {
            q: "The group received ___ per cent for the group consultancy project.",
            accepted: ["68", "sixty-eight", "sixty eight", "68%"],
          },
          {
            q: "The strongest piece of assessment was the written final ___.",
            accepted: ["report"],
          },
          {
            q: "The live pitch overran by ___ minutes.",
            accepted: ["4", "four"],
          },
          {
            q: "The group rehearsed the full pitch just ___, the night before.",
            accepted: ["once", "one time", "1 time"],
          },
          {
            q: "The group's best decision was swapping roles in week ___.",
            accepted: ["3", "three"],
          },
          {
            q: "___ took over the financial model after the role swap.",
            accepted: ["Marcus"],
          },
          {
            q: "Out of the sixty businesses planned, ___ actually responded to the survey.",
            accepted: ["23", "twenty-three", "twenty three"],
          },
          {
            q: "The follow-up interviews with ___ businesses added the depth the survey lacked.",
            accepted: ["5", "five"],
          },
          {
            q: "The group spent the first ___ weeks reading theory instead of starting the client brief.",
            accepted: ["2", "two"],
          },
          {
            q: "The group's collaboration scores were among the highest in the ___.",
            accepted: ["cohort"],
          },
        ],
      },
      {
        title: "Section 4: A lecture on artificial intelligence and the future of work",
        transcript:
          "In 2013, two Oxford economists, Carl Benedikt Frey and Michael Osborne, published a study estimating that forty-seven per cent of jobs in the United States were at high risk of computerisation — a single number splashed across newspapers worldwide, frightening readers everywhere. It is worth remembering what the study actually claimed, though: a probability, not a timetable, and risk does not mean certainty. Three years later, economists at the OECD revisited the question using a task-based approach, arguing that jobs are bundles of tasks and very few can be automated entire; their recalculation for the most advanced economies produced a far lower figure, around nine per cent. History offers perspective. The Luddites of 1811 smashed the mechanical looms they believed would destroy their livelihoods. In the long run those looms created new and better-paid kinds of factory work, although the displaced weavers themselves gained little: it took roughly fifty years for average wages to recover their former purchasing power — a sobering lesson for us today, because technology enriches society eventually, but 'eventually' can last a lifetime. Today's debate hinges on a technical distinction. Analyses that assume AI merely substitutes for workers predict mass unemployment; analyses that allow AI to complement workers — a doctor given better diagnostic software sees more patients and offloads the drudgery — predict something different: higher output, growing demand and entirely new job titles we haven't invented yet. The World Economic Forum, in a 2020 estimate that is much quoted and much disputed, forecast that ninety-seven million new roles would emerge even as eighty-five million disappeared. What nearly all economists do agree on is the premium on adaptability. Routine jobs, whether manual or clerical, are the most exposed, while roles combining technical judgement with human contact — the nurse, the plumber, the teacher — remain remarkably safe. As one economist drily put it: it's not AI that will take your job; it's someone who is better at using AI.",
        questions: [
          {
            q: "Frey and Osborne estimated that ___ per cent of US jobs were at high risk of computerisation.",
            accepted: ["47", "forty-seven", "forty seven", "47%"],
          },
          {
            q: "The 47% figure describes a ___, not a timetable.",
            accepted: ["probability"],
          },
          {
            q: "The OECD's task-based recalculation produced a figure of around ___ per cent.",
            accepted: ["9", "nine", "9%", "nine per cent"],
          },
          {
            q: "The OECD argued that jobs are bundles of ___, few of which can be automated entire.",
            accepted: ["tasks"],
          },
          {
            q: "The Luddites of 1811 smashed mechanical ___.",
            accepted: ["looms"],
          },
          {
            q: "Average wages took roughly ___ years to recover their former purchasing power.",
            accepted: ["50", "fifty"],
          },
          {
            q: "The debate hinges on whether AI substitutes for workers or ___ them.",
            accepted: ["complements"],
          },
          {
            q: "The World Economic Forum forecast that ___ million new roles would emerge.",
            accepted: ["97", "ninety-seven", "ninety seven"],
          },
          {
            q: "___ jobs, whether manual or clerical, are the most exposed to automation.",
            accepted: ["Routine", "routine"],
          },
          {
            q: "Roles combining technical judgement with human ___ remain remarkably safe.",
            accepted: ["contact"],
          },
        ],
      },
    ],
  },
  writing: {
    task1:
      "The chart below shows the percentage of employees working from home at least once a week in four US industry sectors in 2015 and 2025.\n\nInformation technology: 18%, 47%\nFinance and insurance: 12%, 38%\nEducation: 6%, 22%\nRetail: 3%, 9%\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    task2:
      "Some people believe that success in life depends mainly on hard work and determination. Others, however, argue that luck and circumstances — such as family background or being in the right place at the right time — play a greater role. In your opinion, which matters more for success in life? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
  },
  speaking: [
    ...speakingPart1([
      "What are your plans for the next few years — work, study or travel?",
      "Do you prefer to plan things in detail or take them as they come?",
      "What kind of job would you like to be doing in ten years' time?",
    ]),
    speakingPart2(
      "Describe an achievement you are proud of. You should say: what the achievement was, how you achieved it, what difficulties you faced, and explain why you are proud of it.",
    ),
    ...speakingPart3([
      "Do you think it is better to be ambitious or to be content with what you have?",
      "Do you think society measures success mainly by money? Is that healthy?",
      "How do definitions of success differ between older and younger generations?",
    ]),
  ],
};
