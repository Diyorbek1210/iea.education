export interface ChatTurn {
  role: "user" | "model";
  text: string;
}

const TOPICS: { question: string; followUps: string[] }[] = [
  {
    question:
      "Tell me about your hometown — what do you like most about it, and is there anything you would change?",
    followUps: [
      "That's really interesting! Why does that stand out to you the most?",
      "Nice answer. Would you recommend someone to visit your hometown, and why?",
    ],
  },
  {
    question: "What do you usually enjoy doing in your free time? How did you get into it?",
    followUps: [
      "Great! How often do you actually get to do that?",
      "That sounds fun! Did you pick it up recently, or has it been a hobby for a while?",
    ],
  },
  {
    question:
      "Let's talk about work or study. What do you do, and what's the best part about it?",
    followUps: [
      "Good, I like your energy! If you could change one thing about it, what would it be?",
      "And how does that compare to what you imagined you'd be doing?",
    ],
  },
  {
    question: "What kind of food do you like, and do you enjoy cooking?",
    followUps: [
      "Yum! What dish from your country would you recommend to a visitor?",
      "Do you ever cook for friends, or is it mostly a solo thing?",
    ],
  },
  {
    question: "Let's talk about travel. Have you been anywhere interesting recently?",
    followUps: [
      "That sounds memorable! What made it special?",
      "If you could go anywhere next, where would you choose and why?",
    ],
  },
];

const GREETING =
  "Hi there! I'm Emily, your IELTS speaking partner. Let's warm up with an easy question — tell me about your hometown: what do you like most about it?";

const FAREWELL = "Goodbye! It was great chatting with you. See you next time!";

/**
 * Local scripted companion used when the live Gemini model is unreachable or
 * overloaded. Keeps the speaking practice flowing instead of hard-failing.
 */
export function scriptedReply(messages: ChatTurn[]): string {
  const lastText = (messages[messages.length - 1]?.text ?? "").toLowerCase();
  if (/\b(bye|goodbye|see you|that'?s all)\b/.test(lastText)) return FAREWELL;

  const userCount = messages.filter((m) => m.role === "user").length;
  if (userCount === 0) return GREETING;

  const topic = TOPICS[(userCount - 1) % TOPICS.length];
  if (!topic) return GREETING;
  const followUps = topic.followUps;
  return followUps[Math.floor((userCount - 1) / TOPICS.length) % followUps.length] ?? followUps[0] ?? GREETING;
}