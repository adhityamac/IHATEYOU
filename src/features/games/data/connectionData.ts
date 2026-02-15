// Connection Activities — Question Banks & Prompt Data
// Philosophy: invitations, not obligations. Growth over ego.

// ─── Truth or Depth ───────────────────────────────────────────

export interface DepthQuestion {
    text: string;
    followUp?: string;
}

export const DEPTH_QUESTIONS: Record<'light' | 'personal' | 'vulnerable', DepthQuestion[]> = {
    light: [
        { text: "What's one small thing that made you smile today?" },
        { text: "What song's been stuck in your head lately?" },
        { text: "If you could eat only one meal forever, what would it be?" },
        { text: "What's the last thing that made you laugh out loud?" },
        { text: "What's a place that instantly calms you?" },
        { text: "What's a compliment you received that you still think about?" },
        { text: "What small act of kindness do you remember from a stranger?" },
        { text: "What's a skill you wish you had?" },
        { text: "What does your ideal lazy day look like?" },
        { text: "What's a memory that always makes you nostalgic?" },
        { text: "What show or movie can you rewatch endlessly?" },
        { text: "What's the most random thing you've Googled recently?" },
    ],
    personal: [
        { text: "What's something you're afraid to admit?", followUp: "What makes it hard to say out loud?" },
        { text: "What do you wish people understood about you without having to explain?" },
        { text: "What's a belief you held strongly that you've since changed?" },
        { text: "When did you last feel truly proud of yourself?" },
        { text: "What's a boundary you wish you'd set sooner?" },
        { text: "What's the hardest lesson you've learned about love?" },
        { text: "What do you need most right now that you haven't asked for?" },
        { text: "What part of your past still influences your decisions?" },
        { text: "What's something you pretend doesn't bother you, but it does?" },
        { text: "What's a promise you made to yourself that you've actually kept?" },
        { text: "When was the last time you cried? What triggered it?" },
        { text: "What's a part of yourself you're still learning to accept?" },
    ],
    vulnerable: [
        { text: "When do you feel most alone?", followUp: "What would help in that moment?" },
        { text: "What's the thing you're most afraid of losing?" },
        { text: "What's a wound that still hasn't fully healed?" },
        { text: "When did you first learn that love could hurt?" },
        { text: "What do you hide from the people closest to you?" },
        { text: "What's the version of yourself you're most afraid to show?" },
        { text: "If you could hear one truth about yourself, what would you want to know?" },
        { text: "What's a fear you have about us that you haven't voiced?" },
        { text: "When do you feel safest? When do you feel least safe?" },
        { text: "What's something you forgave but never forgot?" },
        { text: "What part of your childhood do you still carry with you?" },
        { text: "What would you say to the younger version of yourself?" },
    ],
};

export const DEPTH_LEVEL_THRESHOLDS = {
    personal: 5,    // sessions needed to unlock
    vulnerable: 15, // sessions needed to unlock
} as const;

// ─── How Well Do You Know Me ──────────────────────────────────

export interface KnowMeQuestion {
    question: string;
    category: string;
    placeholder: string;
}

export const KNOW_ME_QUESTIONS: KnowMeQuestion[] = [
    { question: "What's my comfort food?", category: "Favorites", placeholder: "e.g., Mac and cheese" },
    { question: "What's my biggest pet peeve?", category: "Personality", placeholder: "e.g., Being interrupted" },
    { question: "What do I do when I'm stressed?", category: "Habits", placeholder: "e.g., Go for a walk" },
    { question: "What's my dream travel destination?", category: "Dreams", placeholder: "e.g., Japan" },
    { question: "What song always puts me in a good mood?", category: "Favorites", placeholder: "e.g., Here Comes the Sun" },
    { question: "What's my biggest insecurity?", category: "Deep", placeholder: "Be thoughtful here..." },
    { question: "What do I value most in a friendship?", category: "Values", placeholder: "e.g., Loyalty" },
    { question: "What's my love language?", category: "Love", placeholder: "e.g., Quality time" },
    { question: "What time of day am I most energetic?", category: "Habits", placeholder: "e.g., Morning" },
    { question: "What's a movie that made me cry?", category: "Favorites", placeholder: "e.g., The Notebook" },
    { question: "What's my go-to order at a café?", category: "Favorites", placeholder: "e.g., Iced latte" },
    { question: "What makes me feel appreciated?", category: "Love", placeholder: "e.g., A handwritten note" },
    { question: "What's a fear I've never told most people?", category: "Deep", placeholder: "Be gentle..." },
    { question: "What's the first thing I notice about a person?", category: "Personality", placeholder: "e.g., Their energy" },
    { question: "What would I do with a free weekend and no obligations?", category: "Dreams", placeholder: "e.g., Binge a show in bed" },
];

// ─── Mood Sync ────────────────────────────────────────────────

export interface MoodOption {
    emoji: string;
    label: string;
    color: string;
}

export const MOOD_OPTIONS: MoodOption[] = [
    { emoji: '😌', label: 'Calm', color: '#6ee7b7' },
    { emoji: '😰', label: 'Anxious', color: '#fbbf24' },
    { emoji: '😊', label: 'Happy', color: '#fb923c' },
    { emoji: '😴', label: 'Tired', color: '#94a3b8' },
    { emoji: '🙏', label: 'Grateful', color: '#c084fc' },
    { emoji: '😶', label: 'Disconnected', color: '#64748b' },
    { emoji: '🤸', label: 'Playful', color: '#f472b6' },
    { emoji: '😮‍💨', label: 'Overwhelmed', color: '#ef4444' },
];

// ─── Conflict Simulator ──────────────────────────────────────

export interface ConflictScenario {
    situation: string;
    context: string;
    responses: ConflictResponse[];
}

export interface ConflictResponse {
    text: string;
    style: 'defensive' | 'curious' | 'dismissive' | 'empathetic' | 'solution';
    label: string;
}

export const CONFLICT_SCENARIOS: ConflictScenario[] = [
    {
        situation: "You forgot our plan.",
        context: "You had agreed to do something together, but one of you forgot completely.",
        responses: [
            { text: "You should have reminded me.", style: 'defensive', label: 'Defensive' },
            { text: "I'm sorry. What did it mean to you?", style: 'curious', label: 'Curious' },
            { text: "It's not a big deal, we'll do it another time.", style: 'dismissive', label: 'Dismissive' },
            { text: "I can see that hurt you. I'm sorry.", style: 'empathetic', label: 'Empathetic' },
            { text: "Let me set a reminder so this doesn't happen again.", style: 'solution', label: 'Solution-Focused' },
        ],
    },
    {
        situation: "You've been distant lately.",
        context: "One partner feels the other has been emotionally unavailable for a few days.",
        responses: [
            { text: "I've been busy, it's not about you.", style: 'defensive', label: 'Defensive' },
            { text: "Can you tell me what distant looks like to you?", style: 'curious', label: 'Curious' },
            { text: "You're overthinking this.", style: 'dismissive', label: 'Dismissive' },
            { text: "You're right. I've been in my head. I didn't mean to shut you out.", style: 'empathetic', label: 'Empathetic' },
            { text: "Let's set aside time tonight to reconnect.", style: 'solution', label: 'Solution-Focused' },
        ],
    },
    {
        situation: "You shared something private about me.",
        context: "One partner told a friend something the other shared in confidence.",
        responses: [
            { text: "It wasn't that serious, you're overreacting.", style: 'defensive', label: 'Defensive' },
            { text: "What part felt like a violation to you?", style: 'curious', label: 'Curious' },
            { text: "Everyone shares things, it's normal.", style: 'dismissive', label: 'Dismissive' },
            { text: "I broke your trust. I understand why you're upset.", style: 'empathetic', label: 'Empathetic' },
            { text: "Let's agree on what's off-limits going forward.", style: 'solution', label: 'Solution-Focused' },
        ],
    },
    {
        situation: "You said you'd change, but haven't.",
        context: "A recurring issue where promises were made but not followed through.",
        responses: [
            { text: "I'm trying. You don't see my effort.", style: 'defensive', label: 'Defensive' },
            { text: "What would change look like to you specifically?", style: 'curious', label: 'Curious' },
            { text: "Nobody changes overnight.", style: 'dismissive', label: 'Dismissive' },
            { text: "I hear you. I know my words haven't matched my actions.", style: 'empathetic', label: 'Empathetic' },
            { text: "Can we break this down into smaller steps I can actually commit to?", style: 'solution', label: 'Solution-Focused' },
        ],
    },
    {
        situation: "You spent more time with friends than with me this week.",
        context: "One partner feels deprioritized after the other had a busy social week.",
        responses: [
            { text: "I'm allowed to have a social life.", style: 'defensive', label: 'Defensive' },
            { text: "Are you feeling neglected, or is it more about quality time?", style: 'curious', label: 'Curious' },
            { text: "Don't you have your own friends too?", style: 'dismissive', label: 'Dismissive' },
            { text: "I didn't realize it came across that way. You matter to me.", style: 'empathetic', label: 'Empathetic' },
            { text: "Let's block out our time first this week, then I'll plan around it.", style: 'solution', label: 'Solution-Focused' },
        ],
    },
];

export const CONFLICT_STYLE_INSIGHTS: Record<ConflictResponse['style'], string> = {
    defensive: "Tendency to protect yourself. Try pausing before reacting — the threat might not be real.",
    curious: "You lead with questions. This opens space for understanding, not assumptions.",
    dismissive: "Minimizing can feel safe, but it often invalidates the other person's experience.",
    empathetic: "You prioritize emotional connection. Make sure you don't lose your own needs in the process.",
    solution: "Action-oriented. Just make sure you validate feelings before jumping to fixes.",
};

// ─── Future Map ───────────────────────────────────────────────

export const FUTURE_PROMPTS = {
    dreams: [
        "Travel somewhere that changes my perspective",
        "Build something meaningful with my hands",
        "Learn a language fluently",
        "Live somewhere new for a year",
        "Write something that matters",
        "Start a passion project",
        "Have a home that feels like sanctuary",
        "Experience a different culture deeply",
        "Create art that moves someone",
        "Mentor someone younger",
    ],
    fears: [
        "Growing apart without noticing",
        "Losing someone I love suddenly",
        "Never finding what I'm truly meant to do",
        "Becoming someone I don't recognize",
        "Being misunderstood by those closest to me",
        "Settling for comfortable instead of meaningful",
        "Running out of time for what matters",
        "Repeating my parents' mistakes",
    ],
    goals: [
        "Be more present in daily moments",
        "Build financial stability",
        "Develop deeper emotional intelligence",
        "Create a morning routine that energizes me",
        "Read more books that challenge my thinking",
        "Be the kind of partner I'd want to have",
        "Take better care of my mental health",
        "Build a stronger relationship with my family",
        "Say 'no' to things that drain me",
        "Travel to Japan",
    ],
} as const;

// ─── Memory Builder ───────────────────────────────────────────

export const STORY_STARTERS: string[] = [
    "We met on a rainy day.",
    "The first thing I noticed was...",
    "It all started with a question.",
    "There was a place neither of us had been.",
    "The night was quiet until...",
    "We didn't plan for this.",
    "Somewhere between hello and goodbye...",
    "It began with a playlist.",
];
