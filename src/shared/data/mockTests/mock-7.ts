import { speakingPart1, speakingPart2, speakingPart3, type MockTestSet } from "./types";

export const mock7: MockTestSet = {
  id: "mock-7",
  order: 7,
  title: "IELTS Mock Test 7",
  reading: {
    passages: [
      {
        title: "The Race to the South Pole",
        passage:
          "On the fourteenth of December 1911, five Norwegians led by Roald Amundsen planted their country's flag at the South Pole, becoming the first people to stand at the southernmost point on Earth. Just over a month later, on the seventeenth of January 1912, a British party under Captain Robert Falcon Scott reached the same spot, only to find Amundsen's tent and the Norwegian flag already there. The contrasting fates of the two expeditions have fascinated historians ever since, and much of the explanation lies in preparation. Amundsen was a veteran of the Arctic who had led the first successful voyage through the Northwest Passage in 1906, and he chose his Antarctic base at the Bay of Whales, almost a hundred kilometres closer to the Pole than Scott's base on Ross Island. Before the sledging season he laid three supply depots in advance, at eighty, eighty-one and eighty-two degrees south, marking each with lines of flags so that his men could find them even in poor visibility. Most importantly, he took ninety-seven Greenland dogs and adopted Inuit polar clothing and techniques, reasoning that proven native methods were safer than untested machinery. Scott, by contrast, relied on a mixture of motor sledges — which broke down quickly — and Siberian ponies that proved unsuited to the ice, with man-hauling as the eventual fallback. The results in daily travel were stark: Amundsen's men regularly covered forty kilometres a day on skis pulled by dogs, reaching the Pole and returning without the death of a single man, while Scott's party of five — Scott, Wilson, Bowers, Oates and Evans — struggled homeward as the weather closed in. Evans died in mid-February after a fall; Oates, badly frostbitten, famously walked out of the tent into the snow saying he was 'just going outside' and might be some time; and the remaining three perished in their tent at the end of March, only eleven miles short of the supply cache at One Ton Depot. A search party found the bodies and Scott's diaries eight months later, in November 1912. Opinion remains divided over how much blame Scott bears, but most scholars agree that Amundsen's triumph was the product of meticulous planning and a willingness to learn from indigenous polar expertise.",
        questions: [
          {
            q: "When did Amundsen reach the South Pole?",
            options: [
              "The seventeenth of January 1912",
              "The fourteenth of December 1911",
              "The first of November 1911",
              "The fifteenth of February 1912",
            ],
            answer: 1,
          },
          {
            q: "Where did Amundsen establish his Antarctic base?",
            options: [
              "On Ross Island",
              "At Cape Evans",
              "In McMurdo Sound",
              "At the Bay of Whales",
            ],
            answer: 3,
          },
          {
            q: "How did Amundsen's and Scott's bases differ?",
            options: [
              "Amundsen's was almost a hundred kilometres closer to the Pole",
              "Scott's was supplied throughout the winter",
              "Amundsen's was built of stone",
              "Scott's was beside open water all year",
            ],
            answer: 0,
          },
          {
            q: "How did Amundsen mark his supply depots?",
            options: [
              "With radio beacons",
              "With stone cairns only",
              "With lines of flags",
              "With coloured dye on the snow",
            ],
            answer: 2,
          },
          {
            q: "What happened to Scott's motor sledges?",
            options: [
              "They proved essential to the journey",
              "They broke down quickly",
              "They were never delivered",
              "They only worked on hills",
            ],
            answer: 1,
          },
          {
            q: "What did the passage say about Scott's Siberian ponies?",
            options: [
              "They proved unsuited to the ice",
              "They were too fast",
              "They were stolen",
              "They stayed healthy throughout",
            ],
            answer: 0,
          },
          {
            q: "What daily distance did Amundsen's team regularly cover?",
            options: [
              "Ten kilometres",
              "Twenty kilometres",
              "Fifty kilometres",
              "Around forty kilometres",
            ],
            answer: 3,
          },
          {
            q: "How many men were in Scott's polar party?",
            options: ["Three", "Seven", "Five", "Eight"],
            answer: 2,
          },
          {
            q: "What did Lawrence Oates do as the party's situation worsened?",
            options: [
              "He walked out of the tent, saying he might be gone some time",
              "He reached One Ton Depot alone",
              "He was lost earlier on a glacier",
              "He survived to be rescued",
            ],
            answer: 0,
          },
          {
            q: "How far short of One Ton Depot was the final camp?",
            options: ["110 miles", "11 miles", "80 miles", "23 miles"],
            answer: 1,
          },
          {
            q: "When were the bodies found?",
            options: ["In January 1912", "In March 1912", "In October 1913", "In November 1912"],
            answer: 3,
          },
          {
            q: "According to most scholars, what lay behind Amundsen's success?",
            options: [
              "Simply better weather luck",
              "A much larger expedition budget",
              "Meticulous planning and learning from indigenous polar expertise",
              "Superior maps of the coastline",
            ],
            answer: 2,
          },
          {
            q: "What would be the best title for this passage?",
            options: [
              "The Race to the South Pole",
              "The History of Dog-Sledging",
              "Exploring the Arctic Ocean",
              "A Biography of Robert Falcon Scott",
            ],
            answer: 0,
          },
        ],
      },
      {
        title: "The Growth of Online Education",
        passage:
          "Over the past two decades, higher education has been reshaped by the internet more profoundly than by any development since the spread of mass universities. The transformation began quietly in 2002, when the Massachusetts Institute of Technology launched OpenCourseWare, placing its teaching materials online free for anyone in the world to use. The idea of free instruction for all was taken further by Salman Khan, who began tutoring a cousin in mathematics using online videos and in 2008 founded the Khan Academy, whose short lessons have since been viewed by hundreds of millions of learners. The watershed moment came in 2011, when two Stanford professors, Sebastian Thrun and Peter Norvig, put their artificial-intelligence course online expecting a few thousand sign-ups; about one hundred and sixty thousand students enrolled. The following year — which the New York Times christened the 'Year of the MOOC', or massive open online course — Harvard and MIT jointly founded the non-profit platform edX, while the Stanford-based academics Andrew Ng and Daphne Koller launched Coursera as a commercial rival. Enrolments soared into the millions, but the revolution had an awkward secret: completion rates for courses were routinely below ten per cent, suggesting that while the curious signed up freely, relatively few had the time or discipline to finish. The advantages, where they bite, are real — courses can be fitted around work and family commitments, and few charge anything like traditional tuition — but the digital divide remains a serious barrier, with around forty per cent of the world's population still lacking a reliable internet connection. Opinions in the employment market are also mixed, and many employers continue to value traditional in-person degrees more highly for numerous roles. The COVID-19 pandemic then turned experiment into necessity: in 2020 more than one point six billion learners worldwide were affected by school and university closures, and institutions switched teaching online almost overnight. What has survived the crisis is a blended model, mixing online material with face-to-face teaching, which many analysts now regard as the likeliest long-term future of the lecture hall.",
        questions: [
          {
            q: "What did MIT launch in 2002?",
            options: [
              "A degree delivered by post",
              "Its own commercial tutoring service",
              "OpenCourseWare, making teaching materials freely available online",
              "The Coursera platform",
            ],
            answer: 2,
          },
          {
            q: "How did the Khan Academy begin?",
            options: [
              "With Salman Khan tutoring his cousin using online videos",
              "As a university research project",
              "As a television programme",
              "As an investment company",
            ],
            answer: 0,
          },
          {
            q: "How many students enrolled on Thrun and Norvig's 2011 online course?",
            options: ["1,600", "16,000", "60,000", "About 160,000"],
            answer: 3,
          },
          {
            q: "What did the New York Times call 2012?",
            options: [
              "'The Year of the MOOC'",
              "'The Year of the Tablet'",
              "'The Digital Decade'",
              "'The Broadband Boom'",
            ],
            answer: 0,
          },
          {
            q: "Who founded the edX platform?",
            options: [
              "Harvard and MIT in 2012",
              "Stanford and Google",
              "The United Nations",
              "A single private billionaire",
            ],
            answer: 0,
          },
          {
            q: "What were typical completion rates for MOOCs?",
            options: ["Over 80 per cent", "About half", "Below ten per cent", "Exactly a quarter"],
            answer: 2,
          },
          {
            q: "Which practical advantage of online courses does the passage name?",
            options: [
              "Cheaper textbooks",
              "Faster internet connections",
              "Smaller class sizes",
              "Flexibility to study around work and family",
            ],
            answer: 3,
          },
          {
            q: "What does the passage say about the digital divide?",
            options: [
              "Around forty per cent of the world's population lacks a reliable internet connection",
              "Fewer than a thousand people remain offline",
              "It affects only schools",
              "It was resolved by 2015",
            ],
            answer: 0,
          },
          {
            q: "How many learners were affected by closures in 2020?",
            options: ["16 million", "160 million", "More than 1.6 billion", "About 2 billion"],
            answer: 2,
          },
          {
            q: "What do many employers still tend to do?",
            options: [
              "Treat all online degrees as equal to traditional ones",
              "Refuse to hire online graduates at all",
              "Value traditional in-person degrees more highly for numerous roles",
              "Ignore qualifications entirely",
            ],
            answer: 2,
          },
          {
            q: "What model do many analysts now see as the likeliest long-term future?",
            options: [
              "A return solely to lecture halls",
              "The abolition of university campuses",
              "A large reduction in online resources",
              "A blended model mixing online and face-to-face teaching",
            ],
            answer: 3,
          },
          {
            q: "Who founded Coursera?",
            options: [
              "Salman Khan",
              "Andrew Ng and Daphne Koller",
              "Bill Gates",
              "Sebastian Thrun",
            ],
            answer: 1,
          },
          {
            q: "What would be the best title for this passage?",
            options: [
              "How to Choose a Laptop for Study",
              "The Growth of Online Education",
              "A History of Harvard University",
              "Why University Exams Are Unfair",
            ],
            answer: 1,
          },
        ],
      },
      {
        title: "The Science of Taste and Flavour",
        passage:
          "Taste seems the simplest of the senses, yet scientists have spent more than a century unpicking it. Most people once learned from textbooks that the tongue is divided into zones — sweet at the tip, bitter at the back — but this famous 'tongue map' is a myth, arising largely from a mistranslation in 1901 of a German thesis; in fact, all five basic tastes can be detected over most of the tongue. The fifth of those tastes, umami, was only formally identified in 1908, when the Tokyo chemist Kikunae Ikeda isolated it from kombu seaweed and named it after the word for savouriness. Flavour, moreover, is much more than taste alone. Researchers estimate that the greater part of what we describe as flavour comes from smell travelling from the mouth to the nose — so-called retronasal olfaction — as the classic experiment of comparing apple and raw onion while pinching one's nose readily shows. Individuals also differ biologically. About a quarter of the population are 'supertasters', born with more fungiform papillae and usually carrying variants of the TAS2R38 gene, which makes bitter compounds taste especially intense; supertasters often find cruciferous vegetables such as broccoli and Brussels sprouts unpleasantly bitter. The environment, too, alters perception. Research associated with the Fraunhofer Institute in Germany found that the dry air and low pressure of an aircraft cabin reduce sensitivity to sweet and salty tastes by as much as thirty per cent — one reason airline meals are seasoned far more heavily than the same dishes served on the ground. Perhaps most striking of all is the power of expectation. In a celebrated 2001 experiment at the University of Bordeaux, fifty-four wine students were given a white wine that had been dyed red, and described it using vocabulary normally reserved for red wine — notes of berries and cherries — showing how vision and belief can overrule the tongue. Taken together, the evidence suggests that flavour is constructed in the brain rather than simply received from the food, with eyesight, memory, altitude, price and even wording all quietly shaping what we believe we taste.",
        questions: [
          {
            q: "Including umami, how many basic tastes are recognised?",
            options: ["Four", "Five", "Six", "Seven"],
            answer: 1,
          },
          {
            q: "Where did the 'tongue map' idea come from?",
            options: [
              "An experiment involving lemons",
              "A government nutrition survey",
              "A mistranslation of a German thesis in 1901",
              "Ancient Greek medicine",
            ],
            answer: 2,
          },
          {
            q: "Who identified umami, and from what?",
            options: [
              "A French chef, from beef stock",
              "A German doctor, from honey",
              "A British sailor, from sea salt",
              "The Tokyo chemist Kikunae Ikeda, from kombu seaweed",
            ],
            answer: 3,
          },
          {
            q: "According to the passage, what is flavour largely made of?",
            options: [
              "Taste combined with retronasal smell",
              "Taste alone",
              "Smell combined with sound",
              "The temperature of food",
            ],
            answer: 0,
          },
          {
            q: "Roughly what proportion of people are supertasters?",
            options: ["5 per cent", "10 per cent", "About 25 per cent", "Nearly 60 per cent"],
            answer: 2,
          },
          {
            q: "What do supertasters commonly find?",
            options: [
              "That all food is delicious",
              "Cruciferous vegetables intensely bitter",
              "That they cannot taste salt",
              "That only bland food is acceptable",
            ],
            answer: 1,
          },
          {
            q: "Which gene is associated with supertasting?",
            options: ["TAS2R38", "BRCA1", "A1C2", "DNA7"],
            answer: 0,
          },
          {
            q: "Why does airline food often seem bland?",
            options: [
              "Because the food is frozen at sea level",
              "Because chefs are required to use less sugar",
              "Because passengers eat their meals too quickly",
              "Because dry air and low pressure cut sensitivity to sweet and salty tastes by up to thirty per cent",
            ],
            answer: 3,
          },
          {
            q: "In the 2001 Bordeaux experiment, how did students describe the dyed white wine?",
            options: [
              "Correctly, as a white wine",
              "Using vocabulary normally reserved for red wine",
              "As completely undrinkable",
              "As a sparkling wine",
            ],
            answer: 1,
          },
          {
            q: "What does the Bordeaux experiment suggest?",
            options: [
              "Colour has no influence on tasting",
              "Expert tasters are always honest",
              "Expectations can shape perceived flavour",
              "French wine students are superior tasters",
            ],
            answer: 2,
          },
          {
            q: "What does the pinch-your-nose test with apple and onion demonstrate?",
            options: [
              "That smell contributes heavily to what we call flavour",
              "That apples naturally taste like onions",
              "That taste buds die quickly",
              "That the tongue genuinely has five zones",
            ],
            answer: 0,
          },
          {
            q: "Which institution is linked to the cabin-pressure research on airline food?",
            options: [
              "NASA",
              "The University of Tokyo",
              "Heathrow Airport",
              "The Fraunhofer Institute in Germany",
            ],
            answer: 3,
          },
          {
            q: "How many wine students took part in the 2001 Bordeaux experiment?",
            options: ["Twelve", "Twenty-four", "One hundred and four", "Fifty-four"],
            answer: 3,
          },
          {
            q: "What would be the best title for this passage?",
            options: [
              "Airline Food Recipes",
              "The Science of Taste and Flavour",
              "A History of Cooking",
              "The Biology of the Ear",
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
        title: "Section 1: A phone call to book a wedding reception venue",
        transcript:
          "Good afternoon, The Old Mill Hotel, events office, Sophie speaking. Hello, yes, we do host wedding receptions. You're looking at Saturday the twenty-first of June, for about ninety guests — let me check the diary for you. Good news: both of our function rooms are free that day. Our largest room, the Riverside Suite, holds up to a hundred and twenty seated guests, and the hire fee for that is seven hundred and fifty pounds. The Garden Room is a more intimate space for up to sixty guests, at five hundred pounds for the day. For catering, most couples choose our three-course sit-down menu, which is forty-five pounds per head, while an evening buffet for guests arriving later costs thirty-two pounds per person. Drinks packages start at fifteen pounds per guest, or if you'd rather supply your own wine we charge a corkage fee of ten pounds per bottle. To confirm the date we take a deposit of five hundred pounds, with the balance due one month before the wedding. Once you're booked, we offer a free menu-tasting evening for two people, so you can choose your dishes with the chef. We will need your final numbers no later than two weeks before the day, so we can plan the seating properly. A few practicalities: we have free overnight parking for eighty cars, and the nearest train station, Marshfield, is about two miles away. Entertainment is fine within limits — DJs may play until midnight, but live bands have to finish by half past eleven under the terms of our noise licence. And finally, the Riverside Suite is also licensed for civil ceremonies, for an additional two hundred pounds, in case you'd like everything under one roof. Shall I pencil in the date and email you our brochure and sample menus?",
        questions: [
          {
            q: "The reception is planned for Saturday the ___.",
            accepted: [
              "twenty-first of June",
              "21st of June",
              "21st June",
              "21 June",
              "twenty-first June",
            ],
          },
          {
            q: "The couple are expecting about ___ guests.",
            accepted: ["90", "ninety", "90 guests", "ninety guests"],
          },
          {
            q: "The Riverside Suite holds up to ___ seated guests.",
            accepted: ["120", "a hundred and twenty", "one hundred and twenty", "120 guests"],
          },
          {
            q: "The Garden Room takes up to ___ guests.",
            accepted: ["60", "sixty", "60 guests", "sixty guests"],
          },
          {
            q: "Hiring the Garden Room costs £___ for the day.",
            accepted: ["500", "500 pounds", "five hundred pounds"],
          },
          {
            q: "The three-course sit-down menu costs £___ per head.",
            accepted: ["45", "45 pounds", "forty-five pounds"],
          },
          {
            q: "Corkage is charged at £___ per bottle.",
            accepted: ["10", "10 pounds", "ten pounds"],
          },
          {
            q: "A deposit of £___ is taken to confirm the date.",
            accepted: ["500", "500 pounds", "five hundred pounds"],
          },
          {
            q: "Live bands must finish by ___.",
            accepted: ["half past eleven", "11:30", "eleven thirty", "half 11"],
          },
          {
            q: "Final numbers are required no later than ___ before the day.",
            accepted: ["two weeks", "2 weeks"],
          },
        ],
      },
      {
        title: "Section 2: A radio interview about volunteering abroad",
        transcript:
          "Presenter: Tonight we're talking about gap years and volunteering abroad. My guest is Helen Carter from the charity Global Reach. Helen, what does Global Reach offer? Helen: We run placements of between four and twelve weeks for school leavers and students. There are three main programmes: teaching English in Nepal, conservation work in Costa Rica, and healthcare support in Uganda. Presenter: And what does it cost to take part? Helen: The programme fee for an eight-week placement is one thousand eight hundred pounds. That covers accommodation, meals and training, but not flights or insurance. Most of our volunteers fundraise towards it, and we give everyone a step-by-step fundraising guide plus a mentor who has been on placement themselves. Presenter: Are there any age limits? Helen: Volunteers must be at least eighteen by the date they fly. There's no upper limit, but the majority are between eighteen and twenty-two. Presenter: How do you prepare people for the experience? Helen: Everyone attends a mandatory briefing weekend in Birmingham, held in April, which covers safety, cultural expectations and emergency procedures. Presenter: Some listeners might worry this is really 'voluntourism' — tourism dressed up as charity. Helen: It's a fair concern, and it's why we only partner with projects that have existed locally for more than five years. Volunteers do real work — teaching classes of up to thirty children, for example — and it is not a holiday: accommodation is basic, usually a shared room with a host family, and the working day often starts at seven. Presenter: And for anyone tempted to apply? Helen: Applications for the summer programme close on the first of March. Do note that the Nepal programme usually fills earlier, by around mid-February, so don't leave it to the last minute. Presenter: Helen Carter of Global Reach, thank you very much.",
        questions: [
          {
            q: "Helen Carter works for the charity ___.",
            accepted: ["Global Reach", "the charity Global Reach"],
          },
          {
            q: "Placements last between ___ and twelve weeks.",
            accepted: ["4", "four"],
          },
          {
            q: "The English-teaching programme is based in ___.",
            accepted: ["Nepal", "in Nepal"],
          },
          {
            q: "The fee covers accommodation, meals and ___.",
            accepted: ["training", "training sessions"],
          },
          {
            q: "An eight-week placement costs £___.",
            accepted: ["1,800", "1800", "1800 pounds", "one thousand eight hundred pounds"],
          },
          {
            q: "Every volunteer receives a fundraising guide plus a ___.",
            accepted: ["mentor", "a mentor"],
          },
          {
            q: "Volunteers must be at least ___ years old by the date they fly.",
            accepted: ["18", "eighteen"],
          },
          {
            q: "The mandatory briefing weekend is held in ___.",
            accepted: ["Birmingham", "the city of Birmingham"],
          },
          {
            q: "Partner projects must have existed locally for more than ___ years.",
            accepted: ["5", "five", "5 years", "five years"],
          },
          {
            q: "Applications for the summer programme close on the ___.",
            accepted: ["first of March", "1st of March", "1st March", "1 March"],
          },
        ],
      },
      {
        title: "Section 3: Students and a tutor discussing a marketing case study",
        transcript:
          "Tutor: Let's discuss your marketing case study on Zest Drinks, the company launching a new low-sugar sparkling water. What approach are you taking? Student A: We're structuring it around the four P's — product, price, place and promotion — and we've surveyed two hundred consumers aged eighteen to thirty-five, which is the target market the company specified in its brief. Student B: The most striking finding was that sixty-eight per cent of them said the flavour range mattered more to them than the price, which surprised us, because the company's brief assumed price would be the main driver of sales. Tutor: An interesting result — so what are you recommending? Student A: We're advising them to reposition around three unusual flavours instead of cutting prices, and to launch first in independent gyms and health-food shops rather than supermarkets, in order to build a premium image. Student B: For the promotion section we compared television with social media advertising, and with a launch budget of only fifty thousand pounds, television is simply unrealistic — a single thirty-second slot would consume most of that money. So we're recommending partnerships with online fitness influencers, which can reach exactly the same age group for a fraction of the cost. Tutor: There's solid reasoning there, but one weakness. You need to acknowledge the trade-off openly: supermarkets would give Zest far wider distribution than independent gyms, so your report must justify why the premium channel is still the better choice. Student A: Understood. And is the final output the report or the presentation? Tutor: Both. The presentation is twelve minutes per group, delivered in week twelve, and the written report — two and a half thousand words — is due on the Monday after the presentations. One last point: include a proper limitations section. A survey of two hundred people, all from one town, cannot be presented as a national picture. Present it honestly, and qualify your conclusions accordingly.",
        questions: [
          {
            q: "Zest Drinks is launching a new low-sugar ___ water.",
            accepted: ["sparkling", "fizzy"],
          },
          {
            q: "The students surveyed ___ consumers in the target age group.",
            accepted: ["200", "two hundred", "200 consumers", "two hundred consumers"],
          },
          {
            q: "___ per cent of respondents said flavour mattered more than price.",
            accepted: ["68", "68 per cent", "68%", "sixty-eight", "sixty-eight per cent"],
          },
          {
            q: "The students advise launching first in independent gyms and ___ shops.",
            accepted: ["health-food", "health food", "health food shops", "health-food shops"],
          },
          {
            q: "The launch budget is only £___.",
            accepted: ["50,000", "50000", "fifty thousand pounds", "fifty thousand"],
          },
          {
            q: "A single thirty-second television slot would consume most of the ___.",
            accepted: ["budget", "money", "launch budget"],
          },
          {
            q: "For promotion, the students recommend partnerships with online fitness ___.",
            accepted: ["influencers", "online influencers", "fitness influencers"],
          },
          {
            q: "Supermarkets would give Zest far wider ___ than independent gyms.",
            accepted: ["distribution", "reach"],
          },
          {
            q: "The group presentation lasts ___ minutes.",
            accepted: ["12", "twelve", "12 minutes", "twelve minutes"],
          },
          {
            q: "The written report is ___ words long.",
            accepted: ["2,500", "2500", "two and a half thousand", "two thousand five hundred"],
          },
        ],
      },
      {
        title: "Section 4: A lecture on designing walkable cities",
        transcript:
          "In this final lecture, I want to ask what makes a city walkable, and why urban planners increasingly treat walking not as an afterthought but as the foundation of good design. The modern argument begins, as so often in urbanism, with Jane Jacobs, whose 1961 book The Death and Life of Great American Cities insisted that safe, lively streets depend on what she memorably called 'eyes on the street' — the constant informal supervision provided by residents and shopkeepers. A year later, in 1962, Copenhagen closed its main shopping street, Strøget, to cars. Shopkeepers predicted disaster; instead the street, now 1.1 kilometres long and one of the longest pedestrian thoroughfares in Europe, became the model for a radical redesign of the city centre. Copenhagen went on to hire the Danish architect Jan Gehl, who spent decades systematically measuring how people actually use public space, coining the discipline of 'public life studies'. Later examples followed the same principle. Melbourne revived its neglected laneways in the 1990s, and Barcelona introduced its 'superblocks' in the Eixample district in 2016, funnelling through-traffic to the perimeter of nine-block areas so that the streets within effectively belong to residents. The German district of Vauban, near Freiburg, designed from scratch in the late 1990s, permits car parking only at the community's edge, and around seventy per cent of households live without a car at all. The health case for walkability is well documented: just thirty minutes of daily walking is associated with substantially reduced risk of several chronic diseases, which is why planners work to a rule of thumb that daily amenities — shops, schools, parks — should lie within four hundred to eight hundred metres of home, roughly a five-to-ten-minute walk. There is even a financial argument: property values in highly walkable neighbourhoods consistently command a premium over car-dependent suburbs. The lesson of the past sixty years is that cities designed around the pedestrian do not merely function better; they prove, time and again, to be places where people actually want to live.",
        questions: [
          {
            q: "Jane Jacobs called informal supervision by residents '___ on the street'.",
            accepted: ["eyes", "eyes on the street"],
          },
          {
            q: "Copenhagen closed its main shopping street, Strøget, to cars in ___.",
            accepted: ["1962", "nineteen sixty-two"],
          },
          {
            q: "Strøget is now ___ kilometres long.",
            accepted: ["1.1", "1.1 kilometres", "one point one kilometres"],
          },
          {
            q: "Jan Gehl coined the discipline of 'public life ___'.",
            accepted: ["studies", "research"],
          },
          {
            q: "Barcelona's superblocks funnel through-traffic around ___-block areas.",
            accepted: ["9", "nine", "9-block", "nine-block"],
          },
          {
            q: "In Vauban, car parking is permitted only at the community's ___.",
            accepted: ["edge", "edges"],
          },
          {
            q: "Around ___ per cent of Vauban households live without a car.",
            accepted: ["70", "seventy", "70%", "70 per cent", "seventy per cent"],
          },
          {
            q: "Just ___ minutes of daily walking reduces the risk of chronic disease.",
            accepted: ["30", "thirty", "30 minutes", "thirty minutes"],
          },
          {
            q: "Planners want daily amenities within four hundred to ___ metres of home.",
            accepted: ["800", "eight hundred", "800 metres", "eight hundred metres"],
          },
          {
            q: "Highly walkable neighbourhoods command a property-value ___ over suburbs.",
            accepted: ["premium", "price premium"],
          },
        ],
      },
    ],
  },
  writing: {
    task1:
      "The chart below shows the number of satellites launched per year in 2015 and 2023, by sector.\n\nCommercial: 62 satellites in 2015, 1,930 in 2023\nGovernment: 98 in 2015, 460 in 2023\nMilitary: 45 in 2015, 182 in 2023\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    task2:
      "Some people believe that governments should continue to spend large amounts of money on space exploration, while others think this money would be better spent solving problems such as poverty, disease and climate change here on Earth. To what extent do you agree or disagree? Write at least 250 words.",
  },
  speaking: [
    ...speakingPart1([
      "Let's talk about transport. How do you usually travel to work or college?",
      "How long does your daily journey usually take?",
      "What do you think of public transport in your area?",
    ]),
    speakingPart2(
      "Describe a skill you taught to another person. You should say: what the skill was, who you taught it to, how you taught them, and explain how you felt about the experience.",
    ),
    ...speakingPart3([
      "Do you think people learn better through practice or through studying theory?",
      "How has technology changed the way skills are taught and learned?",
      "Why do some people find it difficult to learn new skills as they get older?",
    ]),
  ],
};
