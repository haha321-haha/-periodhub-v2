
export interface LunaLink {
  label: string;
  url: string;
}

export interface LunaResponse {
  text: string;
  links?: LunaLink[];
}

interface LunaRule {
  keywords: string[];
  response: LunaResponse;
}

const RULES: LunaRule[] = [
  {
    keywords: ['pain', 'cramp', 'hurt', 'ache', 'sore', 'discomfort'],
    response: {
      text: "I'm sorry you're in pain. 😔 Have you tried using our Pain Tracker to log your symptoms? It helps identify patterns. Heat pads and hydration often help too.",
      links: [{ label: "Open Pain Tracker", url: "#pain-tracker" }]
    }
  },
  {
    keywords: ['cycle', 'period', 'late', 'bleeding', 'flow', 'menstruation'],
    response: {
      text: "Tracking your cycle helps predict your next period and ovulation. Our Cycle Tracker is perfect for this.",
      links: [{ label: "Open Cycle Tracker", url: "#cycle-tracker" }]
    }
  },
  {
    keywords: ['privacy', 'data', 'store', 'save', 'security'],
    response: {
      text: "Your privacy is our top priority. 🛡️ All your data is stored LOCALLY on your device. We do not send it to any servers.",
    }
  },
  {
    keywords: ['guide', 'article', 'read', 'info', 'learn', 'download'],
    response: {
      text: "We have 43 evidence-based medical guides available. You can download them or read them online.",
      links: [{ label: "View Guides", url: "#downloads" }]
    }
  },
  {
    keywords: ['hello', 'hi', 'hey', 'start'],
    response: {
      text: "Hi there! 👋 I'm Luna. I can help you navigate the app or answer basic questions about period health."
    }
  },
  {
    keywords: ['mood', 'sad', 'angry', 'happy', 'emotion'],
    response: {
      text: "Mood swings are common during your cycle due to hormonal changes. Logging them in the Pain Tracker can help you prepare for them.",
      links: [{ label: "Log Mood", url: "#pain-tracker" }]
    }
  }
];

const DEFAULT_RESPONSES: LunaResponse[] = [
  { text: "I'm still learning! 🧠 Could you try rephrasing that? You can ask about 'pain', 'cycles', or 'privacy'." },
  { text: "I'm not sure about that specific medical detail. Please check our Health Guides for verified information.", links: [{ label: "Health Guides", url: "#downloads" }] },
  { text: "I can help you find tools on this website. Try asking 'where is the tracker?'" }
];

export const processLunaQuery = (query: string): LunaResponse => {
  const normalizedQuery = query.toLowerCase();

  // Check for keyword matches
  for (const rule of RULES) {
    if (rule.keywords.some(keyword => normalizedQuery.includes(keyword))) {
      return rule.response;
    }
  }

  // Return a random default response if no match found
  return DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)];
};
