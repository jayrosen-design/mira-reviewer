export type Speaker = "parent" | "clinician";

export type DialogueTurn = {
  speaker: Speaker;
  text: string;
};

export type Response = {
  title: string;
  text: string;
  /** Hidden from the reviewer in the UI. */
  source: "human" | "ai";
};

export type DialogueItem = {
  id: string;
  reviewSet: string;
  scenario: string;
  dialogue: DialogueTurn[];
  responseA: Response;
  responseB: Response;
};

export const RUBRIC_CRITERIA = [
  "Empathy",
  "Reflective listening",
  "Open-ended question use",
  "Respect for parent autonomy",
  "Motivational interviewing consistency",
  "Clarity and helpfulness",
  "Overall response quality",
] as const;

export type Criterion = (typeof RUBRIC_CRITERIA)[number];

export type RubricGuide = {
  description: string;
  examples: { score: 5 | 3 | 1; label: string; example: string }[];
};

export const RUBRIC_GUIDES: Record<Criterion, RubricGuide> = {
  Empathy: {
    description:
      "The degree to which the response conveys genuine understanding of, and care for, the parent's feelings and perspective.",
    examples: [
      {
        score: 5,
        label: "Strong",
        example:
          "\"It sounds really hard to weigh all of this when you just want to do what's best for your daughter. That care comes through clearly.\"",
      },
      {
        score: 3,
        label: "Adequate",
        example:
          "\"I understand this is a tough decision for many parents. Let's talk through it.\"",
      },
      {
        score: 1,
        label: "Weak",
        example:
          "\"The vaccine is safe and recommended. There's no real reason to wait.\"",
      },
    ],
  },
  "Reflective listening": {
    description:
      "The response accurately mirrors what the parent said or felt, showing the clinician heard them before moving forward.",
    examples: [
      {
        score: 5,
        label: "Strong",
        example:
          "\"You're worried about side effects, and eleven feels young to you for something that doesn't seem urgent yet.\"",
      },
      {
        score: 3,
        label: "Adequate",
        example: "\"So you have some concerns about side effects and timing.\"",
      },
      {
        score: 1,
        label: "Weak",
        example: "\"Let me explain how the vaccine works.\"",
      },
    ],
  },
  "Open-ended question use": {
    description:
      "Use of questions that invite the parent to share more rather than answer yes/no, supporting exploration and engagement.",
    examples: [
      {
        score: 5,
        label: "Strong",
        example:
          "\"What would feel most helpful to talk through together before you decide?\"",
      },
      {
        score: 3,
        label: "Adequate",
        example: "\"Can you tell me a bit more about what you've read?\"",
      },
      {
        score: 1,
        label: "Weak",
        example: "\"Do you want the vaccine today, yes or no?\"",
      },
    ],
  },
  "Respect for parent autonomy": {
    description:
      "The response affirms the parent's right to make the decision and avoids pressure, judgment, or coercion.",
    examples: [
      {
        score: 5,
        label: "Strong",
        example:
          "\"This is your decision, and I want to make sure you have what you need to feel good about it, whatever you choose.\"",
      },
      {
        score: 3,
        label: "Adequate",
        example:
          "\"It's up to you. I can share information if that would help.\"",
      },
      {
        score: 1,
        label: "Weak",
        example:
          "\"You really need to do this now. Waiting isn't a responsible choice.\"",
      },
    ],
  },
  "Motivational interviewing consistency": {
    description:
      "Alignment with MI spirit and techniques: partnership, acceptance, compassion, evocation, and avoiding the righting reflex.",
    examples: [
      {
        score: 5,
        label: "Strong",
        example:
          "\"You care a lot about getting this right. What feels most important to you as you think it through?\"",
      },
      {
        score: 3,
        label: "Adequate",
        example:
          "\"I hear your concerns. Would it be okay if I shared some information, and then we can talk about what you think?\"",
      },
      {
        score: 1,
        label: "Weak",
        example:
          "\"You shouldn't rely on what you read online. The right answer is to vaccinate now.\"",
      },
    ],
  },
  "Clarity and helpfulness": {
    description:
      "How clearly and usefully the response communicates, including being concrete, well-organized, and easy to follow.",
    examples: [
      {
        score: 5,
        label: "Strong",
        example:
          "\"The most common side effects are soreness and tiredness for a day or two. Would it help if I walked through what to expect?\"",
      },
      {
        score: 3,
        label: "Adequate",
        example:
          "\"Side effects are usually mild. We can go over them if you'd like.\"",
      },
      {
        score: 1,
        label: "Weak",
        example: "\"It's fine. Everyone gets it.\"",
      },
    ],
  },
  "Overall response quality": {
    description:
      "Holistic judgment of how well the response works as a motivational interviewing reply in this context.",
    examples: [
      {
        score: 5,
        label: "Strong",
        example:
          "Reflects the parent's concern, affirms autonomy, asks an open question, and offers information collaboratively.",
      },
      {
        score: 3,
        label: "Adequate",
        example:
          "Acknowledges concerns and offers information, but reflection or autonomy support feels generic.",
      },
      {
        score: 1,
        label: "Weak",
        example:
          "Dismisses the parent's concerns and pushes a recommendation without engagement.",
      },
    ],
  },
};


export const DIALOGUES: DialogueItem[] = [
  {
    id: "MIRA-001",
    reviewSet: "Pilot Set A",
    scenario:
      "A parent is unsure about whether their child should receive the HPV vaccine and is expressing concerns about safety and timing.",
    dialogue: [
      {
        speaker: "clinician",
        text: "Today I wanted to talk with you about the HPV vaccine for your daughter. Is that something you've been thinking about?",
      },
      {
        speaker: "parent",
        text: "Honestly, yes. I've heard a lot of things online and I'm not sure she needs it right now. She's only eleven.",
      },
      {
        speaker: "clinician",
        text: "It sounds like you've been doing your own reading and want to be careful about timing. Can you tell me more about what's worrying you?",
      },
      {
        speaker: "parent",
        text: "Mostly side effects. And it feels early. I don't want to rush something we don't fully need yet.",
      },
    ],
    responseA: {
      title: "Response A",
      text: "I hear that you want to make the safest choice for your child, and it makes sense to ask questions before deciding. Would it be helpful if we talked through what is known about the vaccine and what concerns matter most to you?",
      source: "human",
    },
    responseB: {
      title: "Response B",
      text: "The HPV vaccine is recommended for children at this age because it can help prevent certain cancers later in life. Many parents have questions about safety, and we can review the information together so you can make a decision that feels informed.",
      source: "ai",
    },
  },
  {
    id: "MIRA-002",
    reviewSet: "Pilot Set A",
    scenario:
      "A parent has discovered that their teenager has been vaping and is unsure how to respond without pushing the teen away.",
    dialogue: [
      {
        speaker: "parent",
        text: "I found a vape in my son's backpack last week. I don't even know how to bring it up without him shutting down on me.",
      },
      {
        speaker: "clinician",
        text: "That sounds really hard. You care about him and you also don't want to lose the connection. What feels most important to you in how you approach this?",
      },
      {
        speaker: "parent",
        text: "I want him to be honest with me. I just don't want to lecture him and make it worse.",
      },
    ],
    responseA: {
      title: "Response A",
      text: "It sounds like keeping that trust open matters as much to you as the vaping itself. What do you think it would look like to start the conversation in a way that protects both?",
      source: "human",
    },
    responseB: {
      title: "Response B",
      text: "Many parents in your situation find it helpful to lead with curiosity rather than consequences. You could begin by asking what he likes or doesn't like about vaping, and listen before sharing your concerns.",
      source: "ai",
    },
  },
  {
    id: "MIRA-003",
    reviewSet: "Pilot Set A",
    scenario:
      "A parent is struggling to get their child to consistently take a daily asthma medication and feels frustrated.",
    dialogue: [
      {
        speaker: "parent",
        text: "We've tried everything. Reminders, charts, rewards. He still forgets the inhaler half the week.",
      },
      {
        speaker: "clinician",
        text: "It sounds exhausting to be the one carrying all of that. What part of the routine feels like it falls apart most?",
      },
      {
        speaker: "parent",
        text: "Mornings. He's rushing, I'm rushing, and it just slips. I feel like I'm nagging all the time.",
      },
    ],
    responseA: {
      title: "Response A",
      text: "Mornings sound like the pinch point, and you're tired of feeling like the reminder system. If we could make one small change there together, what would feel realistic to try this week?",
      source: "human",
    },
    responseB: {
      title: "Response B",
      text: "Mornings are a common challenge for families managing daily medications. Pairing the inhaler with an existing habit, like brushing teeth, can reduce the need for reminders. Would you like to explore options that fit your routine?",
      source: "ai",
    },
  },
];
