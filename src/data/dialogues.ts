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
  /** Simulated parent reply if Response A is chosen and inserted into the chat. */
  parentReplyA: string;
  /** Simulated parent reply if Response B is chosen and inserted into the chat. */
  parentReplyB: string;
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
  examples: { score: 5 | 4 | 3 | 2 | 1; label: string; example: string }[];
};

export const RUBRIC_GUIDES: Record<Criterion, RubricGuide> = {
  Empathy: {
    description:
      "Empathy captures how clearly the clinician communicates a genuine understanding of the parent's emotional experience and underlying concerns. A strong empathic response names or implies what the parent may be feeling, validates that those feelings make sense in context, and signals warmth without minimizing, judging, or rushing the parent toward a decision. Weak responses overlook emotion entirely, dismiss it as unwarranted, or paper over it with reassurance that does not connect to what the parent actually said.",
    examples: [
      {
        score: 5,
        label: "Strong",
        example:
          "\"It sounds really hard to weigh all of this when you just want to do what's best for your daughter. That care comes through clearly, and there's no rush in this conversation.\"",
      },
      {
        score: 4,
        label: "Good",
        example:
          "\"I can hear that this decision matters a lot to you, and that you want to feel confident about it before moving forward.\"",
      },
      {
        score: 3,
        label: "Adequate",
        example:
          "\"I understand this is a tough decision for many parents. Let's talk through it together.\"",
      },
      {
        score: 2,
        label: "Limited",
        example:
          "\"A lot of parents feel unsure. Here's what the guidelines say.\"",
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
      "Reflective listening measures how accurately the response mirrors the substance and feeling of what the parent just said before the clinician adds anything new. Strong reflections paraphrase the parent's concern, sometimes deepening it slightly to surface the meaning beneath the words, and demonstrate that the parent was truly heard. Weaker responses either skip reflection entirely and pivot to information or advice, or offer a shallow restatement that does not capture the parent's actual concern.",
    examples: [
      {
        score: 5,
        label: "Strong",
        example:
          "\"You're worried about side effects, and eleven feels young to you for something that doesn't seem urgent yet — you want to be careful, not rushed.\"",
      },
      {
        score: 4,
        label: "Good",
        example:
          "\"So part of what's holding you back is the combination of side effect worries and the feeling that there's still time.\"",
      },
      {
        score: 3,
        label: "Adequate",
        example:
          "\"So you have some concerns about side effects and timing.\"",
      },
      {
        score: 2,
        label: "Limited",
        example: "\"Okay, you have some questions. Got it.\"",
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
      "This criterion looks at whether the clinician uses questions that invite the parent to elaborate, reflect, or share priorities, rather than closed questions that can be answered with a single word. Strong open-ended questions are focused, curious, and connected to what the parent has shared; they open the conversation rather than steering it toward a predetermined answer. Weaker responses rely on yes/no prompts, leading questions, or skip questions altogether in favor of statements.",
    examples: [
      {
        score: 5,
        label: "Strong",
        example:
          "\"What would feel most helpful to talk through together before you decide — the safety information, the timing, or something else on your mind?\"",
      },
      {
        score: 4,
        label: "Good",
        example:
          "\"What have you been reading or hearing that's shaped how you're thinking about this?\"",
      },
      {
        score: 3,
        label: "Adequate",
        example: "\"Can you tell me a bit more about what you've read?\"",
      },
      {
        score: 2,
        label: "Limited",
        example: "\"Are you worried about side effects?\"",
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
      "Respect for parent autonomy captures the extent to which the response honors the parent as the decision-maker for their child, without pressure, guilt, or coercion. Strong responses explicitly affirm the parent's right to choose, offer information as a resource rather than a verdict, and remain supportive regardless of the direction the parent leans. Weak responses use scare tactics, moral judgment, or framing that implies there is only one acceptable choice.",
    examples: [
      {
        score: 5,
        label: "Strong",
        example:
          "\"This is your decision, and I want to make sure you have what you need to feel good about it — whatever you choose, I'm here to help you think it through.\"",
      },
      {
        score: 4,
        label: "Good",
        example:
          "\"You know your daughter best. I can share what we know, and you decide what makes sense for your family.\"",
      },
      {
        score: 3,
        label: "Adequate",
        example:
          "\"It's up to you. I can share information if that would help.\"",
      },
      {
        score: 2,
        label: "Limited",
        example:
          "\"I'd really recommend doing it today, but it's your call I guess.\"",
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
      "This criterion assesses overall fidelity to the spirit and core techniques of motivational interviewing: partnership, acceptance, compassion, and evocation. Strong responses resist the righting reflex, draw out the parent's own motivations and values, and balance reflection with collaborative information sharing using approaches like ask-tell-ask. Weak responses lean on persuasion, warnings, or expert-driven monologue that override the parent's perspective.",
    examples: [
      {
        score: 5,
        label: "Strong",
        example:
          "\"You care a lot about getting this right for your daughter. What feels most important to you as you weigh this — and would it be okay if I shared a bit of what we know, and then we talk about how it fits?\"",
      },
      {
        score: 4,
        label: "Good",
        example:
          "\"It sounds like protecting her is what's driving this. Would it help to look at the safety information together so you can see how it lines up with your concerns?\"",
      },
      {
        score: 3,
        label: "Adequate",
        example:
          "\"I hear your concerns. Would it be okay if I shared some information, and then we can talk about what you think?\"",
      },
      {
        score: 2,
        label: "Limited",
        example:
          "\"I get that you have concerns, but the data is really clear that this is the right thing to do.\"",
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
      "Clarity and helpfulness reflect how understandable, concrete, and useful the response is for the parent in the moment. Strong responses are well organized, use plain language, give specific information when relevant, and offer a clear next step or invitation without overwhelming the parent. Weak responses are vague, jargon-heavy, dismissive, or overloaded with information in a way that obscures what the parent should take from the exchange.",
    examples: [
      {
        score: 5,
        label: "Strong",
        example:
          "\"The most common side effects are soreness in the arm and feeling tired for a day or two. Serious reactions are rare. Would it help if I walked through what to watch for and when to call us?\"",
      },
      {
        score: 4,
        label: "Good",
        example:
          "\"Most kids have a sore arm and maybe feel run down for a day. We can go over the specifics if that would be useful.\"",
      },
      {
        score: 3,
        label: "Adequate",
        example:
          "\"Side effects are usually mild. We can go over them if you'd like.\"",
      },
      {
        score: 2,
        label: "Limited",
        example: "\"There can be some side effects, but they're not a big deal.\"",
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
      "This is a holistic judgment of how well the response functions as a motivational interviewing reply in this specific context. Consider whether the response integrates empathy, reflection, autonomy support, and useful information into a coherent whole that moves the conversation forward in a way the parent is likely to experience as respectful and helpful. Weak responses fail on multiple dimensions at once or contain elements that actively undermine the relationship.",
    examples: [
      {
        score: 5,
        label: "Strong",
        example:
          "Reflects the parent's concern in their own terms, affirms their autonomy, asks a focused open question, and offers information collaboratively at a pace the parent can follow.",
      },
      {
        score: 4,
        label: "Good",
        example:
          "Acknowledges the parent's concern and supports autonomy, with a reasonable mix of reflection, question, and information, even if one element is lighter than ideal.",
      },
      {
        score: 3,
        label: "Adequate",
        example:
          "Acknowledges concerns and offers information, but reflection or autonomy support feels generic and the response does not noticeably deepen engagement.",
      },
      {
        score: 2,
        label: "Limited",
        example:
          "Provides some information but leans toward persuasion, with little reflection and only weak acknowledgment of the parent's perspective.",
      },
      {
        score: 1,
        label: "Weak",
        example:
          "Dismisses the parent's concerns and pushes a recommendation without engagement, reflection, or respect for the parent's decision-making role.",
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
    parentReplyA:
      "Yeah… I think what worries me most is the side effects. If we could just talk through what's actually been seen, that would help me feel like I'm not just guessing.",
    parentReplyB:
      "Okay. I guess I do want the real information, not just what I'm reading online. Can you tell me what kind of side effects people actually see?",
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
