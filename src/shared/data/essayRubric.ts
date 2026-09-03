export interface RubricCriterion {
  band: number;
  description: string;
  descriptors: string[];
}

export interface EssayRubric {
  criterion: string;
  shortName: string;
  bands: RubricCriterion[];
}

export const WRITING_TASK2_RUBRIC: EssayRubric[] = [
  {
    criterion: "Task Response",
    shortName: "TR",
    bands: [
      {
        band: 9,
        description: "Fully addresses all parts of the task",
        descriptors: [
          "Presents a fully developed position with relevant, fully extended and well-supported ideas",
        ],
      },
      {
        band: 8,
        description: "Addresses all parts of the task",
        descriptors: [
          "Presents a well-developed response with relevant, extended and supported ideas",
        ],
      },
      {
        band: 7,
        description: "Addresses all parts of the task",
        descriptors: [
          "Presents a clear position throughout the response",
          "Presents, extends and supports main ideas, but there may be a tendency to over-generalise",
        ],
      },
      {
        band: 6,
        description: "Addresses all parts of the task",
        descriptors: [
          "Presents a relevant position, although conclusions may become unclear or repetitive",
          "Presents relevant main ideas but some may be inadequately developed/unclear",
        ],
      },
      {
        band: 5,
        description: "Addresses all parts of the task",
        descriptors: [
          "Presents a position but the development may not always be clear",
          "Presents relevant main ideas but some may be inadequately developed/unclear",
        ],
      },
      {
        band: 4,
        description: "Addresses the task only partially",
        descriptors: [
          "The format may be inappropriate in places",
          "Position may not be clear",
          "Main ideas are limited and not sufficiently developed",
        ],
      },
    ],
  },
  {
    criterion: "Coherence and Cohesion",
    shortName: "CC",
    bands: [
      {
        band: 9,
        description: "Uses cohesion in such a way that it attracts no attention",
        descriptors: [
          "Skilfully manages paragraphing",
        ],
      },
      {
        band: 8,
        description: "Sequences information and ideas logically",
        descriptors: [
          "Manages all aspects of cohesion well",
          "Uses paragraphing sufficiently and appropriately",
        ],
      },
      {
        band: 7,
        description: "Logically organises information and ideas",
        descriptors: [
          "There is clear progression throughout",
          "Uses a range of cohesive devices appropriately, although there may be some under-/over-use",
          "Presents a clear central topic within each paragraph",
        ],
      },
      {
        band: 6,
        description: "Arranges information and ideas coherently",
        descriptors: [
          "There is a clear overall progression",
          "Uses cohesive devices effectively, but cohesion within and/or between sentences may be faulty or mechanical",
          "May not always use referencing clearly or appropriately",
        ],
      },
      {
        band: 5,
        description: "Presents information with some organisation",
        descriptors: [
          "There may be a lack of overall progression",
          "Makes inadequate, inaccurate or over-use of cohesive devices",
        ],
      },
    ],
  },
  {
    criterion: "Lexical Resource",
    shortName: "LR",
    bands: [
      {
        band: 9,
        description: "Uses a wide vocabulary fluently and flexibly",
        descriptors: [
          "Uses uncommon lexical items skillfully with occasional inaccuracies in word choice and collocation",
          "Produces rare errors in spelling and/or word formation",
        ],
      },
      {
        band: 8,
        description: "Uses a wide range of vocabulary",
        descriptors: [
          "Uses uncommon lexical items with some accuracy and sophistication in context",
          "Makes rare errors in spelling and/or word formation",
        ],
      },
      {
        band: 7,
        description: "Uses a sufficient range of vocabulary",
        descriptors: [
          "Uses some less common lexical items with some awareness of style and collocation",
          "May produce occasional errors in word choice, spelling and/or word formation",
        ],
      },
      {
        band: 6,
        description: "Uses an adequate range of vocabulary",
        descriptors: [
          "Attempts to use less common vocabulary but with some inaccuracy",
          "Makes some errors in spelling and/or word formation, but they do not impede communication",
        ],
      },
      {
        band: 5,
        description: "Uses a limited range of vocabulary",
        descriptors: [
          "Attempts to use less common vocabulary but with frequent inaccuracy",
          "Spelling and/or word formation errors may cause some difficulty for the reader",
        ],
      },
    ],
  },
  {
    criterion: "Grammatical Range and Accuracy",
    shortName: "GRA",
    bands: [
      {
        band: 9,
        description: "Uses a wide range of structures",
        descriptors: [
          "The majority of sentences are error-free",
          "Makes only very occasional errors or inappropriacies",
        ],
      },
      {
        band: 8,
        description: "Uses a wide range of structures",
        descriptors: [
          "The majority of sentences are error-free",
          "Makes only occasional errors or inappropriacies",
        ],
      },
      {
        band: 7,
        description: "Uses a variety of complex structures",
        descriptors: [
          "Produces frequent error-free sentences",
          "Has good control of grammar and punctuation but may make a few errors",
        ],
      },
      {
        band: 6,
        description: "Uses a mix of simple and complex sentence forms",
        descriptors: [
          "Makes some errors in grammar and punctuation but they rarely reduce communication",
        ],
      },
      {
        band: 5,
        description: "Uses only a limited range of structures",
        descriptors: [
          "Makes frequent errors in grammar and punctuation",
          "Errors may cause some difficulty for the reader",
        ],
      },
    ],
  },
];

export const SPEAKING_RUBRIC: EssayRubric[] = [
  {
    criterion: "Fluency and Coherence",
    shortName: "FC",
    bands: [
      {
        band: 9,
        description: "Speaks fluently with only rare repetition or self-correction",
        descriptors: [
          "Any hesitation is content-related rather than language-related",
          "Sequences ideas and themes coherently",
        ],
      },
      {
        band: 8,
        description: "Speaks fluently with only occasional repetition or self-correction",
        descriptors: [
          "Hesitation is usually content-related and only rarely to search for language",
          "Develops topics coherently and appropriately",
        ],
      },
      {
        band: 7,
        description: "Speaks at length without noticeable effort or loss of coherence",
        descriptors: [
          "May demonstrate language-related hesitation at times",
          "Uses a range of connectives and discourse markers with some flexibility",
        ],
      },
      {
        band: 6,
        description: "Is willing to speak at length, though may lose coherence at times",
        descriptors: [
          "Uses a range of connectives and discourse markers but not always appropriately",
        ],
      },
    ],
  },
  {
    criterion: "Lexical Resource",
    shortName: "LR",
    bands: [
      {
        band: 9,
        description: "Uses vocabulary with full flexibility and precision in all topics",
        descriptors: [
          "Uses idiomatic language naturally and accurately",
        ],
      },
      {
        band: 8,
        description: "Uses vocabulary flexibly and precisely to discuss a variety of topics",
        descriptors: [
          "Uses some less common and idiomatic vocabulary and shows awareness of style and collocation",
          "Paraphrases effectively",
        ],
      },
      {
        band: 7,
        description: "Uses a sufficient vocabulary range to allow some flexibility and precision",
        descriptors: [
          "Uses some less common vocabulary and idiomatic expressions",
          "Paraphrases effectively",
        ],
      },
      {
        band: 6,
        description: "Uses vocabulary adequately for the topic",
        descriptors: [
          "Uses some less common vocabulary but with some inaccuracy",
          "Paraphrases with some success",
        ],
      },
    ],
  },
  {
    criterion: "Grammatical Range and Accuracy",
    shortName: "GRA",
    bands: [
      {
        band: 9,
        description: "Uses a wide range of grammatical structures accurately",
        descriptors: [
          "Uses grammar and structures appropriately",
        ],
      },
      {
        band: 8,
        description: "Uses a wide range of grammatical structures accurately",
        descriptors: [
          "Produces error-free sentences almost all the time",
        ],
      },
      {
        band: 7,
        description: "Uses a range of complex structures with flexibility",
        descriptors: [
          "Frequently produces error-free sentences",
          "Has good control of grammar and punctuation",
        ],
      },
      {
        band: 6,
        description: "Uses a mix of simple and complex forms effectively",
        descriptors: [
          "Makes frequent errors in grammar and punctuation but these rarely cause communication problems",
        ],
      },
    ],
  },
];

export const ESSAY_CHECKLIST = [
  { id: "task", label: "Task Response", items: [
    "Have I answered ALL parts of the question?",
    "Is my position clear throughout the essay?",
    "Are my main ideas relevant and well-developed?",
    "Have I provided specific examples to support my points?",
    "Have I avoided going off-topic?",
  ]},
  { id: "cohesion", label: "Coherence and Cohesion", items: [
    "Does each paragraph have a clear topic sentence?",
    "Are my paragraphs logically ordered?",
    "Have I used cohesive devices (however, moreover, for example) appropriately?",
    "Is there a clear introduction, body, and conclusion?",
    "Do my ideas flow naturally from one to the next?",
  ]},
  { id: "vocabulary", label: "Lexical Resource", items: [
    "Have I used a range of vocabulary (not just basic words)?",
    "Are my word choices accurate and natural?",
    "Have I used some less common or idiomatic vocabulary?",
    "Have I avoided repeating the same words/phrases?",
    "Have I used appropriate collocations?",
  ]},
  { id: "grammar", label: "Grammatical Range and Accuracy", items: [
    "Have I used a mix of simple and complex sentences?",
    "Is my grammar accurate (tenses, articles, prepositions)?",
    "Have I used passive voice where appropriate?",
    "Are my sentences varied in structure?",
    "Have I checked for common errors (subject-verb agreement, etc.)?",
  ]},
  { id: "word-count", label: "Word Count", items: [
    "Is my essay at least 250 words?",
    "Is it not significantly longer than 300 words?",
  ]},
];
