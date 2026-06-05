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
