import { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Home,
  LockKeyhole,
  LogOut,
  Menu,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  Volume2,
  X,
} from "lucide-react";
import "./style.css";
import { translateChoice, uiText } from "./translations.js";

const env = import.meta.env;
const supabaseKey =
  env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY;
const supabase =
  env.VITE_SUPABASE_URL && supabaseKey
    ? createClient(env.VITE_SUPABASE_URL, supabaseKey)
    : null;
const lessons = [
  {
    id: "animals",
    title: "A day at the zoo",
    category: "Vocabulary",
    level: "Beginner",
    minutes: 8,
    icon: "🦒",
    color: "peach",
    description: "Meet some amazing animals and learn how to describe them.",
    words: ["giraffe", "parrot", "elephant"],
    type: "Words & quiz",
    questions: [
      {
        q: "Which animal has a very long neck?",
        choices: ["Parrot", "Giraffe", "Penguin"],
        answer: 1,
        explain: "A giraffe has a wonderfully long neck!",
      },
      {
        q: "A parrot can…",
        choices: ["talk and fly", "swim fast", "climb trees"],
        answer: 0,
        explain: "Many parrots can copy words and fly.",
      },
      {
        q: "What is the plural of “elephant”?",
        choices: ["Elephants", "Elephanties", "Elephant"],
        answer: 0,
        explain: "We add -s: one elephant, two elephants.",
      },
    ],
  },
  {
    id: "morning",
    title: "My morning routine",
    category: "Reading",
    level: "Beginner",
    minutes: 6,
    icon: "🌞",
    color: "yellow",
    description: "Read about Sam’s morning and put the day in order.",
    words: ["wake up", "brush my teeth", "have breakfast"],
    type: "Reading",
    passage:
      "Sam wakes up at seven o’clock. First, he washes his face and brushes his teeth. Then he has toast and an apple for breakfast. He packs his school bag and walks to school with his sister.",
    questions: [
      {
        q: "What time does Sam wake up?",
        choices: ["At six", "At seven", "At eight"],
        answer: 1,
        explain: "Sam wakes up at seven o’clock.",
      },
      {
        q: "What does Sam eat for breakfast?",
        choices: ["Toast and an apple", "Eggs and rice", "A banana and cereal"],
        answer: 0,
        explain: "He has toast and an apple.",
      },
      {
        q: "Who walks to school with Sam?",
        choices: ["His friend", "His brother", "His sister"],
        answer: 2,
        explain: "Sam walks with his sister.",
      },
    ],
  },
  {
    id: "cafe",
    title: "At the little café",
    category: "Speaking",
    level: "Beginner",
    minutes: 7,
    icon: "🥐",
    color: "mint",
    description: "Practice a friendly conversation when ordering a snack.",
    words: ["please", "would like", "thank you"],
    type: "Fill in the blank",
    questions: [
      {
        q: "“I ___ like an orange juice, please.”",
        fillBlank: true,
        answerText: "would",
        explain: "“I would like…” is a polite way to order.",
      },
      {
        q: "“Here you are!” “___!”",
        choices: ["Sorry", "Thank you", "Good night"],
        answer: 1,
        explain: "Say “Thank you” when someone gives you something.",
      },
      {
        q: "Choose the polite order:",
        choices: ["Give me cake.", "Cake now!", "Can I have a cake, please?"],
        answer: 2,
        explain: "“Can I have… please?” sounds friendly and polite.",
      },
    ],
  },
  {
    id: "weather",
    title: "What’s the weather?",
    category: "Listening",
    level: "Beginner",
    minutes: 5,
    icon: "🌈",
    color: "lavender",
    description: "Listen to a short weather report and pick out the details.",
    words: ["sunny", "cloudy", "umbrella"],
    type: "Listening",
    script:
      "Good morning! Today will be sunny and warm. In the afternoon, some clouds may appear. Take your umbrella because it could rain later.",
    questions: [
      {
        q: "What will the morning be like?",
        choices: ["Snowy", "Sunny and warm", "Windy"],
        answer: 1,
        explain: "The report says it will be sunny and warm.",
      },
      {
        q: "What should you take?",
        choices: ["A hat", "A book", "An umbrella"],
        answer: 2,
        explain: "Take your umbrella because it could rain.",
      },
      {
        q: "When may it rain?",
        choices: ["Later", "In the morning", "At night"],
        answer: 0,
        explain: "It could rain later.",
      },
    ],
  },
  {
    id: "garden",
    title: "The tiny seed",
    category: "Video",
    level: "Beginner",
    minutes: 9,
    icon: "🌱",
    color: "blue",
    description:
      "Watch a mini story about a seed, then check what you noticed.",
    words: ["seed", "soil", "grow"],
    type: "Video comprehension",
    video:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    questions: [
      {
        q: "What does a seed need to start growing?",
        choices: ["Water and sunlight", "A warm coat", "A pair of shoes"],
        answer: 0,
        explain: "Seeds need water, air and light to grow.",
      },
      {
        q: "Where do we plant a seed?",
        choices: ["In the soil", "In a cup of tea", "On a book"],
        answer: 0,
        explain: "Seeds grow in soil.",
      },
      {
        q: "What can a seed become?",
        choices: ["A flower", "A cloud", "A chair"],
        answer: 0,
        explain: "A seed can grow into a plant or flower.",
      },
    ],
  },
  {
    id: "weekend",
    title: "A perfect weekend",
    category: "Reading",
    level: "Beginner",
    minutes: 6,
    icon: "🛼",
    color: "pink",
    description: "Read a cheerful story and find the important details.",
    words: ["Saturday", "friends", "park"],
    type: "Reading",
    passage:
      "On Saturday, Mia meets her friends at the park. They ride their bikes and have a picnic under a big tree. Mia brings strawberries to share. In the evening, she reads a funny book at home.",
    questions: [
      {
        q: "Where do Mia and her friends meet?",
        choices: ["At the library", "At the park", "At school"],
        answer: 1,
        explain: "They meet at the park.",
      },
      {
        q: "What does Mia bring?",
        choices: ["Strawberries", "Sandwiches", "A football"],
        answer: 0,
        explain: "Mia brings strawberries to share.",
      },
      {
        q: "What does Mia do in the evening?",
        choices: [
          "She rides her bike.",
          "She watches a film.",
          "She reads a book.",
        ],
        answer: 2,
        explain: "She reads a funny book at home.",
      },
    ],
  },
  {
    id: "colors",
    title: "The color parade",
    category: "Vocabulary",
    level: "Beginner",
    minutes: 5,
    icon: "🎨",
    color: "lavender",
    description: "Spot colors and match them to things around you.",
    words: ["purple", "green", "orange"],
    type: "Words & quiz",
    questions: [
      {
        q: "A ripe banana is usually…",
        choices: ["Purple", "Yellow", "Blue"],
        answer: 1,
        explain: "A ripe banana is usually yellow.",
      },
      {
        q: "Mix red and yellow paint. What color do you get?",
        choices: ["Orange", "Green", "Pink"],
        answer: 0,
        explain: "Red and yellow make orange.",
      },
      {
        q: "Grass is usually…",
        choices: ["Green", "White", "Black"],
        answer: 0,
        explain: "Healthy grass is usually green.",
      },
    ],
  },
  {
    id: "pets",
    title: "What can pets do?",
    category: "Grammar",
    level: "Beginner",
    minutes: 6,
    icon: "🐾",
    color: "peach",
    description: "Practice “can” and “can’t” with some clever pets.",
    words: ["can", "can’t", "jump"],
    type: "Grammar",
    questions: [
      {
        q: "A fish ___ swim.",
        choices: ["can", "can’t", "is"],
        answer: 0,
        explain: "Fish can swim.",
      },
      {
        q: "A cat can ___ up a tree.",
        choices: ["climb", "climbs", "climbing"],
        answer: 0,
        explain: "After “can,” use the base verb: can climb.",
      },
      {
        q: "Birds ___ fly, but penguins cannot.",
        choices: ["can", "does", "are"],
        answer: 0,
        explain: "“Can” tells us what someone or something is able to do.",
      },
    ],
  },
  {
    id: "bedroom",
    title: "The curious bedroom",
    category: "Prepositions",
    level: "Beginner",
    minutes: 6,
    icon: "🛏️",
    color: "blue",
    description: "Find where things are: on, under, next to and in.",
    words: ["on", "under", "next to"],
    type: "Grammar",
    questions: [
      {
        q: "The teddy bear is ___ the bed. (below it)",
        choices: ["under", "on", "in"],
        answer: 0,
        explain: "“Under” means below something.",
      },
      {
        q: "The lamp is ___ the table.",
        choices: ["on", "between", "behind"],
        answer: 0,
        explain: "The lamp is on top of the table.",
      },
      {
        q: "My shoes are ___ the door and the chair.",
        choices: ["between", "under", "in"],
        answer: 0,
        explain: "“Between” means in the space separating two things.",
      },
    ],
  },
  {
    id: "lunchbox",
    title: "A yummy lunchbox",
    category: "Vocabulary",
    level: "Beginner",
    minutes: 6,
    icon: "🍱",
    color: "yellow",
    description: "Learn food words and sort countable snacks.",
    words: ["sandwich", "grapes", "water"],
    type: "Words & quiz",
    questions: [
      {
        q: "Which food is usually counted one by one?",
        choices: ["Rice", "Bread", "Grapes"],
        answer: 2,
        explain: "We can count grapes: one grape, two grapes.",
      },
      {
        q: "“I’d like ___ apple.”",
        choices: ["a", "an", "some"],
        answer: 1,
        explain: "Use “an” before a vowel sound: an apple.",
      },
      {
        q: "Which drink helps you when you are thirsty?",
        choices: ["Water", "A sandwich", "A carrot"],
        answer: 0,
        explain: "Water is a drink.",
      },
    ],
  },
  {
    id: "yesterday",
    title: "Yesterday was fun",
    category: "Past tense",
    level: "Beginner",
    minutes: 7,
    icon: "🕰️",
    color: "pink",
    description: "Talk about things you did yesterday.",
    words: ["played", "visited", "watched"],
    type: "Grammar",
    questions: [
      {
        q: "Yesterday, we ___ football in the park.",
        choices: ["play", "played", "playing"],
        answer: 1,
        explain: "For a finished action in the past, “play” becomes “played.”",
      },
      {
        q: "She ___ her grandma last Sunday.",
        choices: ["visit", "visited", "visits"],
        answer: 1,
        explain: "“Visited” is the past form of “visit.”",
      },
      {
        q: "They ___ a funny movie last night.",
        choices: ["watch", "watched", "watches"],
        answer: 1,
        explain: "“Watched” is the past form of “watch.”",
      },
    ],
  },
  {
    id: "lostpuppy",
    title: "The puppy at the park",
    category: "Reading",
    level: "Beginner",
    minutes: 7,
    icon: "🐶",
    color: "mint",
    description: "Read a little story and help Ben find a missing puppy.",
    words: ["puppy", "collar", "owner"],
    type: "Reading",
    passage:
      "Ben sees a small brown puppy near the park gate. The puppy has a blue collar with a phone number on it. Ben asks a park helper for help. Soon, a girl named Lily arrives. The puppy runs to Lily and wags its tail.",
    questions: [
      {
        q: "Where does Ben see the puppy?",
        choices: ["Near the park gate", "At the shop", "On the bus"],
        answer: 0,
        explain: "Ben sees the puppy near the park gate.",
      },
      {
        q: "What color is the puppy’s collar?",
        choices: ["Red", "Blue", "Green"],
        answer: 1,
        explain: "The puppy has a blue collar.",
      },
      {
        q: "Who is the puppy’s owner?",
        choices: ["Ben", "The park helper", "Lily"],
        answer: 2,
        explain: "Lily arrives and the puppy runs to her.",
      },
    ],
  },
  {
    id: "town",
    title: "Around our town",
    category: "Fill in the blank",
    level: "Beginner",
    minutes: 6,
    icon: "🏘️",
    color: "blue",
    description: "Complete friendly sentences about places in town.",
    words: ["library", "bakery", "hospital"],
    type: "Fill in the blank",
    questions: [
      {
        q: "You can borrow books at the ___.",
        fillBlank: true,
        answerText: "library",
        explain: "A library is a place where you can borrow books.",
      },
      {
        q: "You can buy fresh bread at the ___.",
        fillBlank: true,
        answerText: "bakery",
        explain: "A bakery makes and sells bread and cakes.",
      },
      {
        q: "A doctor works at a ___.",
        fillBlank: true,
        answerText: "hospital",
        explain: "Doctors help people at a hospital or clinic.",
      },
    ],
  },
  {
    id: "schoolday",
    title: "A busy school day",
    category: "Listening",
    level: "Beginner",
    minutes: 6,
    icon: "🎒",
    color: "yellow",
    description: "Listen to a school-day announcement and catch the times.",
    words: ["Monday", "library", "three o’clock"],
    type: "Listening",
    script:
      "Good morning, class! On Monday, our English lesson starts at nine o’clock. We visit the library after lunch. School finishes at three o’clock. Please bring your reading book.",
    questions: [
      {
        q: "What day is the announcement about?",
        choices: ["Friday", "Monday", "Sunday"],
        answer: 1,
        explain: "The announcement is about Monday.",
      },
      {
        q: "Where do students go after lunch?",
        choices: ["The playground", "The library", "The gym"],
        answer: 1,
        explain: "They visit the library after lunch.",
      },
      {
        q: "What time does school finish?",
        choices: ["Two o’clock", "Three o’clock", "Four o’clock"],
        answer: 1,
        explain: "School finishes at three o’clock.",
      },
    ],
  },
  {
    id: "plantlife",
    title: "From seed to flower",
    category: "Video",
    level: "Beginner",
    minutes: 8,
    icon: "🌻",
    color: "mint",
    description: "Watch a flower grow and remember the steps in its journey.",
    words: ["seed", "sprout", "flower"],
    type: "Video comprehension",
    video:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    questions: [
      {
        q: "What appears first when a seed begins to grow?",
        choices: ["A sprout", "A fruit", "A leaf pile"],
        answer: 0,
        explain: "A tiny sprout is one of the first signs of growth.",
      },
      {
        q: "What helps a plant grow?",
        choices: ["Water and light", "Candy and toys", "Shoes and socks"],
        answer: 0,
        explain: "Plants need water and light to grow.",
      },
      {
        q: "What can a flower make after it blooms?",
        choices: ["Seeds", "Books", "Sand"],
        answer: 0,
        explain: "Many flowers make seeds that can grow into new plants.",
      },
    ],
  },
  {
    id: "feelings",
    title: "How are you feeling?",
    category: "Vocabulary",
    level: "Beginner",
    minutes: 5,
    icon: "🙂",
    color: "peach",
    description: "Name feelings and choose a kind response.",
    words: ["happy", "worried", "excited"],
    type: "Words & quiz",
    questions: [
      {
        q: "You are smiling and laughing. You feel…",
        choices: ["Happy", "Sleepy", "Angry"],
        answer: 0,
        explain: "Smiling and laughing often mean someone feels happy.",
      },
      {
        q: "You have a big show tomorrow and your tummy feels funny. You may feel…",
        choices: ["Worried", "Hungry", "Bored"],
        answer: 0,
        explain: "It is normal to feel worried before something important.",
      },
      {
        q: "Your friend looks sad. What is a kind thing to say?",
        choices: ["“Do you want to talk?”", "“Go away.”", "“That is silly.”"],
        answer: 0,
        explain: "A kind question lets your friend know you care.",
      },
    ],
  },
  {
    id: "g3-greetings-numbers", grade: "Grade 3", series: "Top Stars themes",
    title: "Hello, friends!", category: "Listening", level: "Grade 3", minutes: 6, icon: "👋", color: "lavender",
    description: "Listen for names, greetings and numbers in a new class.", words: ["hello", "classmate", "twelve"], type: "Listening & quiz",
    script: "Hello! My name is Aida. I am nine years old. This is my friend Timur. He is ten. We are in Class 3A.",
    questions: [
      { q: "What is the girl's name?", choices: ["Aida", "Dana", "Mira"], answer: 0, explain: "She says, ‘My name is Aida.’" },
      { q: "How old is Timur?", choices: ["Eight", "Ten", "Twelve"], answer: 1, explain: "Timur is ten years old." },
      { q: "Which class are they in?", choices: ["Class 2A", "Class 3A", "Class 4A"], answer: 1, explain: "They are in Class 3A." },
    ],
  },
  {
    id: "g3-school-spelling", grade: "Grade 3", series: "Top Stars themes",
    title: "Spell it at school", category: "Spelling", level: "Grade 3", minutes: 5, icon: "✏️", color: "yellow",
    description: "Listen to a school word and spell it in English.", words: ["pencil", "ruler", "notebook"], type: "Listen & spell",
    questions: [
      { q: "Listen and spell the school object.", spelling: true, fillBlank: true, answerText: "pencil", explain: "P-E-N-C-I-L spells pencil." },
      { q: "Listen and spell the school object.", spelling: true, fillBlank: true, answerText: "ruler", explain: "R-U-L-E-R spells ruler." },
      { q: "Listen and spell the school object.", spelling: true, fillBlank: true, answerText: "notebook", explain: "N-O-T-E-B-O-O-K spells notebook." },
    ],
  },
  {
    id: "g3-family", grade: "Grade 3", series: "Top Stars themes",
    title: "My lovely family", category: "Fill in the blank", level: "Grade 3", minutes: 6, icon: "👨‍👩‍👧", color: "peach",
    description: "Complete simple sentences about family and friends.", words: ["mother", "brother", "friend"], type: "Grammar & writing",
    questions: [
      { q: "This is my ___. She is my mum.", fillBlank: true, answerText: "mother", explain: "Mother is another word for mum." },
      { q: "I have one sister and two ___.", fillBlank: true, answerText: "brothers", explain: "The plural of brother is brothers." },
      { q: "Ali is my good ___. We play together.", fillBlank: true, answerText: "friend", explain: "A friend is someone you like and spend time with." },
    ],
  },
  {
    id: "g3-actions", grade: "Grade 3", series: "Top Stars themes",
    title: "What are they doing?", category: "Grammar", level: "Grade 3", minutes: 6, icon: "⚽", color: "mint",
    description: "Choose the action that matches each clue.", words: ["running", "reading", "playing"], type: "Present continuous",
    questions: [
      { q: "Look! Dana ___ a book now.", choices: ["reads", "is reading", "read"], answer: 1, explain: "Use is + verb-ing for an action happening now." },
      { q: "The boys ___ football at the moment.", choices: ["are playing", "plays", "played"], answer: 0, explain: "Boys is plural, so use are playing." },
      { q: "I ___ to school now.", choices: ["am walking", "walks", "walked"], answer: 0, explain: "Use am + verb-ing with I for an action happening now." },
    ],
  },
  {
    id: "g3-food", grade: "Grade 3", series: "Top Stars themes",
    title: "A tasty lunch", category: "Vocabulary", level: "Grade 3", minutes: 5, icon: "🥪", color: "peach",
    description: "Learn food words and complete simple meal sentences.", words: ["bread", "cheese", "apple"], type: "Food & fill-in",
    questions: [
      { q: "I eat soup with a ___.", choices: ["spoon", "shoe", "pencil"], answer: 0, explain: "We eat soup with a spoon." },
      { q: "An ___ is a fruit. Choose the correct word.", fillBlank: true, answerText: "apple", explain: "Apple begins with a vowel sound, so we say an apple." },
      { q: "For a sandwich, I put cheese between two slices of ___.", fillBlank: true, answerText: "bread", explain: "A sandwich often has filling between slices of bread." },
    ],
  },
  {
    id: "g4-routine", grade: "Grade 4", series: "Top Stars themes",
    title: "My daily routine", category: "Reading", level: "Grade 4", minutes: 7, icon: "⏰", color: "yellow",
    description: "Read about a school day and practise present simple and time.", words: ["usually", "breakfast", "often"], type: "Reading & grammar",
    passage: "Arman usually gets up at seven. He has breakfast with his family and walks to school. After school, he often plays outside. He goes to bed at nine o’clock.",
    questions: [
      { q: "What time does Arman usually get up?", choices: ["At six", "At seven", "At eight"], answer: 1, explain: "He gets up at seven." },
      { q: "Arman ___ breakfast with his family.", fillBlank: true, answerText: "has", explain: "With he, she or it, have changes to has." },
      { q: "What does he often do after school?", choices: ["Plays outside", "Goes to bed", "Has breakfast"], answer: 0, explain: "He often plays outside after school." },
    ],
  },
  {
    id: "g4-family-friends", grade: "Grade 4", series: "Top Stars themes",
    title: "Family and friends", category: "Grammar", level: "Grade 4", minutes: 6, icon: "🧑‍🤝‍🧑", color: "pink",
    description: "Practise possessives, people words and describing friends.", words: ["whose", "friendly", "cousin"], type: "Grammar & vocabulary",
    questions: [
      { q: "This is Aigerim. ___ brother is eleven.", choices: ["Her", "She", "Hers"], answer: 0, explain: "Her shows that the brother belongs to Aigerim." },
      { q: "___ bag is this? It is Daniyar’s.", choices: ["Who", "Whose", "Where"], answer: 1, explain: "Whose asks who something belongs to." },
      { q: "My friends are kind. They are very ___.", fillBlank: true, answerText: "friendly", explain: "Friendly means kind and pleasant to other people." },
    ],
  },
  {
    id: "g4-hobbies", grade: "Grade 4", series: "Top Stars themes",
    title: "Hobbies and sports", category: "Fill in the blank", level: "Grade 4", minutes: 6, icon: "🏸", color: "blue",
    description: "Talk about hobbies with like, enjoy and action words.", words: ["badminton", "painting", "cycling"], type: "Hobbies & grammar",
    questions: [
      { q: "I enjoy ___ pictures in my free time.", fillBlank: true, answerText: "painting", explain: "After enjoy, use the -ing form of a verb." },
      { q: "My sister likes ___ her bike in the park.", fillBlank: true, answerText: "riding", explain: "After likes, use riding in this sentence." },
      { q: "Which item do you need to play badminton?", choices: ["A racket", "A paintbrush", "A drum"], answer: 0, explain: "Players use a racket to hit the shuttlecock." },
    ],
  },
  {
    id: "g4-jobs-listening", grade: "Grade 4", series: "Top Stars themes",
    title: "People at work", category: "Listening", level: "Grade 4", minutes: 6, icon: "🧑‍⚕️", color: "lavender",
    description: "Listen to a short interview about jobs in the community.", words: ["nurse", "farmer", "artist"], type: "Listening comprehension",
    script: "My aunt is a nurse. She works at a clinic and helps people feel better. My uncle is a farmer. He grows vegetables on his farm.",
    questions: [
      { q: "What is the speaker’s aunt’s job?", choices: ["A nurse", "A farmer", "An artist"], answer: 0, explain: "The speaker says their aunt is a nurse." },
      { q: "Where does the aunt work?", choices: ["At a clinic", "At a school", "At a shop"], answer: 0, explain: "She works at a clinic." },
      { q: "What does the uncle grow?", choices: ["Flowers", "Vegetables", "Apples"], answer: 1, explain: "The farmer grows vegetables." },
    ],
  },
  {
    id: "g4-food-animals", grade: "Grade 4", series: "Top Stars themes",
    title: "Food, animals and habitats", category: "Spelling", level: "Grade 4", minutes: 7, icon: "🐪", color: "mint",
    description: "Spell food words, describe a habitat and learn about animals.", words: ["cheese", "desert", "camel"], type: "Spelling & grammar",
    questions: [
      { q: "Listen and spell this food word.", spelling: true, fillBlank: true, answerText: "cheese", explain: "C-H-E-E-S-E spells cheese." },
      { q: "Camels can live in the ___.", fillBlank: true, answerText: "desert", explain: "A desert is a very dry habitat." },
      { q: "There ___ two cats in the garden.", choices: ["is", "are", "am"], answer: 1, explain: "Use are with the plural noun cats." },
    ],
  },
];
const loadLocal = () => {
  try {
    return JSON.parse(localStorage.getItem("brightsteps-progress") || "{}");
  } catch {
    return {};
  }
};

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState(loadLocal);
  const [page, setPage] = useState("home");
  const [active, setActive] = useState(null);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [checked, setChecked] = useState(false);
  const [done, setDone] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [authMsg, setAuthMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [choiceLanguage, setChoiceLanguage] = useState(() => {
    try { return localStorage.getItem("brightsteps-choice-language") || "en"; } catch { return "en"; }
  });
  const t = (text) => uiText[choiceLanguage]?.[text] || text;
  useEffect(() => {
    try { localStorage.setItem("brightsteps-choice-language", choiceLanguage); } catch { /* storage may be disabled */ }
  }, [choiceLanguage]);
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      const nextUser = data.session?.user || null;
      setUser(nextUser);
      if (nextUser) setProgress({});
      else setProgress(loadLocal());
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user || null;
      setUser(nextUser);
      setProgress(nextUser ? {} : loadLocal());
    });
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!user)
      localStorage.setItem("brightsteps-progress", JSON.stringify(progress));
  }, [progress, user]);
  useEffect(() => {
    if (!user || !supabase) return;
    let live = true;
    (async () => {
      const [{ data: prof }, { data: rows }] = await Promise.all([
        supabase
          .from("profiles")
          .select("display_name")
          .eq("id", user.id)
          .maybeSingle(),
        supabase
          .from("student_progress")
          .select("lesson_id,best_score,completed_at")
          .eq("user_id", user.id),
      ]);
      if (!live) return;
      setProfile(prof);
      setProgress(
        Object.fromEntries(
          (rows || []).map((r) => [
            r.lesson_id,
            { score: r.best_score, completed: true, date: r.completed_at },
          ]),
        ),
      );
    })();
    return () => {
      live = false;
    };
  }, [user]);
  const completed = Object.keys(progress).filter(
    (id) => progress[id]?.completed,
  ).length;
  const totalStars = Object.values(progress).reduce(
    (n, p) =>
      n + (p?.completed ? Math.max(1, Math.round((p.score || 0) / 35)) : 0),
    0,
  );
  const filtered = useMemo(
    () =>
      lessons.filter((l) =>
        (selectedGrade === "All" || l.grade === selectedGrade) &&
        `${l.title} ${l.category} ${l.words.join(" ")}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [search, selectedGrade],
  );
  const begin = (lesson) => {
    setActive(lesson);
    setStep(0);
    setPicked(null);
    setAnswers([]);
    setChecked(false);
    setDone(false);
    setPage("lesson");
  };
  const speak = (text) => {
    if (!("speechSynthesis" in window)) {
      setAuthMsg("Audio playback is not available in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.82;
    window.speechSynthesis.speak(u);
  };
  const isCorrect = (question, answer) =>
    question.fillBlank
      ? String(answer).trim().toLowerCase() === question.answerText.toLowerCase()
      : answer === question.answer;
  const advance = async () => {
    if (picked === null || picked === "") return;
    if (!checked) {
      setChecked(true);
      return;
    }
    const next = [...answers, picked];
    setAnswers(next);
    if (step + 1 < active.questions.length) {
      setStep(step + 1);
      setPicked(null);
      setChecked(false);
      return;
    }
    const correct = next.reduce(
      (n, a, i) => n + (isCorrect(active.questions[i], a) ? 1 : 0),
      0,
    );
    const score = Math.round((correct / active.questions.length) * 100);
    const item = {
      score: Math.max(score, progress[active.id]?.score || 0),
      lastScore: score,
      completed: true,
      date: new Date().toISOString(),
    };
    setProgress((p) => ({ ...p, [active.id]: { ...p[active.id], ...item } }));
    setDone(true);
    if (user && supabase) {
      const { error } = await supabase
        .from("quiz_attempts")
        .insert({
          user_id: user.id,
          lesson_id: active.id,
          score,
          answers: next,
        });
      if (error) console.error("Could not save quiz attempt:", error.message);
      const { error: progressError } = await supabase
        .from("student_progress")
        .upsert(
          {
            user_id: user.id,
            lesson_id: active.id,
            best_score: item.score,
            completed_at: item.date,
          },
          { onConflict: "user_id,lesson_id" },
        );
      if (progressError)
        console.error("Could not sync progress:", progressError.message);
    }
  };
  const reset = () => {
    setStep(0);
    setPicked(null);
    setAnswers([]);
    setChecked(false);
    setDone(false);
  };
  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };
  const submitAuth = async (e) => {
    e.preventDefault();
    setAuthMsg("");
    if (!supabase) {
      setAuthMsg(
        "Create a Supabase project and add the two VITE_SUPABASE_* values in .env.local to enable accounts.",
      );
      return;
    }
    setBusy(true);
    const form = new FormData(e.currentTarget),
      email = form.get("email"),
      password = form.get("password"),
      display_name = form.get("display_name");
    let result;
    if (authMode === "signup")
      result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name },
          emailRedirectTo: env.VITE_SITE_URL || window.location.origin,
        },
      });
    else result = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (result.error) {
      setAuthMsg(result.error.message);
      return;
    }
    if (authMode === "signup" && !result.data.session) {
      setAuthMsg(
        "Check your email for a confirmation link, then come back to sign in.",
      );
      setAuthMode("signin");
    } else {
      setUser(result.data.user);
      setAuthOpen(false);
    }
  };
  const Nav = () => (
    <nav className={`nav ${mobileNav ? "open" : ""}`}>
      <button
        className={page === "home" ? "navitem selected" : "navitem"}
        onClick={() => {
          setPage("home");
          setMobileNav(false);
        }}
      >
        <Home size={19} />
        {t("Home")}
      </button>
      <button
        className={page === "lessons" ? "navitem selected" : "navitem"}
        onClick={() => {
          setPage("lessons");
          setMobileNav(false);
        }}
      >
        <BookOpen size={19} />
        {t("Lessons")} <span className="navcount">{lessons.length}</span>
      </button>
      <button
        className={page === "progress" ? "navitem selected" : "navitem"}
        onClick={() => {
          setPage("progress");
          setMobileNav(false);
        }}
      >
        <Trophy size={19} />
        {t("My progress")}
      </button>
      <div className="navbottom">
        <div className="daily-card">
          <span className="daily-icon">✨</span>
          <div>
            <b>{t("Little steps add up!")}</b>
            <p>{t("Try one short lesson today.")}</p>
          </div>
        </div>
        {user ? (
          <button className="navitem logout" onClick={signOut}>
            <LogOut size={18} />
            {t("Sign out")}
          </button>
        ) : (
          <button
            className="navitem login-link"
            onClick={() => {
              setAuthMode("signup");
              setAuthOpen(true);
            }}
          >
            <LockKeyhole size={18} />
            {t("Create account")}
          </button>
        )}
      </div>
    </nav>
  );
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" onClick={() => setPage("home")}>
          <span className="brandmark">
            b<span>✦</span>
          </span>
          <span>
            brightsteps<span className="brand-sub">{t("ENGLISH CLUB")}</span>
          </span>
        </a>
        <div className="nav-label">{t("YOUR SPACE")}</div>
        <Nav />
        <div className="sidebar-foot">
          <span className="avatar">
            {user
              ? (
                  profile?.display_name?.[0] ||
                  user.email?.[0] ||
                  "S"
                ).toUpperCase()
              : "S"}
          </span>
          <div className="person">
            <b>
              {profile?.display_name || (user ? t("My account") : t("Guest learner"))}
            </b>
            <span>{user ? t("Student account") : t("Your learning space")}</span>
          </div>
          <ChevronRight size={17} color="#9aa2b7" />
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setMobileNav(!mobileNav)}
            aria-label={t("Toggle menu")}
          >
            <Menu />
          </button>
          <div className="crumb">
            {t("English club")} <ChevronRight size={14} />{" "}
            <b>
              {page === "home"
                ? t("Your dashboard")
                : page === "lessons"
                  ? t("Lesson library")
                  : page === "progress"
                    ? t("My progress")
                    : active?.title || "Lesson"}
            </b>
          </div>
          <div className="top-actions">
            <label className="choice-language">
              <span>{t("Language")}</span>
              <select aria-label="Interface and answer choice language" value={choiceLanguage} onChange={(e) => setChoiceLanguage(e.target.value)}>
                <option value="en">English</option><option value="kk">Қазақша</option><option value="ru">Русский</option>
              </select>
            </label>
            <span className="streak">
              <span>🔥</span>{" "}
              {completed
                ? `${completed} ${t(completed === 1 ? "day learning" : "days learning")}`
                : t("Start your streak")}
            </span>
            <button
              className="profile-btn"
              onClick={() =>
                user
                  ? setPage("progress")
                  : (setAuthMode("signup"), setAuthOpen(true))
              }
            >
              <span className="avatar small">
                {user ? (profile?.display_name?.[0] || "S").toUpperCase() : "S"}
              </span>
              <span>{profile?.display_name || t("My space")}</span>
              <ChevronRight size={15} />
            </button>
          </div>
        </header>
        {page === "home" && (
          <>
            <section className="welcome">
              <div className="welcome-copy">
                <div className="eyebrow">
                  <Sparkles size={15} /> {t("YOUR ENGLISH ADVENTURE")}
                </div>
                <h1>
                  {t("Small steps.")}
                  <br />
                  <span>{t("Big confidence.")}</span>
                </h1>
                <p>
                  {t("A little English practice every day goes a long way.")}
                  <br className="desktop-only" /> {t("Ready to learn something new?")}
                </p>
                <button
                  className="primary"
                  onClick={() =>
                    begin(
                      lessons.find((l) => !progress[l.id]?.completed) ||
                        lessons[0],
                    )
                  }
                >
                  {t("Continue learning")} <ArrowRight size={17} />
                </button>
                <div className="welcome-stats">
                  <div>
                    <b>
                      {completed}
                      <small> / {lessons.length}</small>
                    </b>
                    <span>{t("lessons done")}</span>
                  </div>
                  <i></i>
                  <div>
                    <b>
                      {totalStars}
                      <small> ✦</small>
                    </b>
                    <span>{t("stars earned")}</span>
                  </div>
                  <i></i>
                  <div>
                    <b>{t(user ? "Saved" : "Guest")}</b>
                    <span>{t(user ? "progress synced" : "learning mode")}</span>
                  </div>
                </div>
              </div>
              <div className="hero-art">
                <div className="sunburst"></div>
                <div className="floating float-star">✦</div>
                <div className="floating float-heart">♥</div>
                <div className="book-stack">
                  <div className="book book-back"></div>
                  <div className="book book-front">
                    <span>Hi!</span>
                    <div className="book-face">☺</div>
                    <small>
                      ENGLISH
                      <br />
                      IS FUN
                    </small>
                  </div>
                </div>
                <div className="hero-leaf leaf-one">✿</div>
                <div className="hero-leaf leaf-two">✦</div>
                <div className="hero-caption">
                  {t("Your next chapter")}
                  <br />
                  <b>{t("starts right here")}</b>
                </div>
              </div>
            </section>
            <section className="section-head">
              <div>
                <div className="eyebrow muted">{t("PICK UP WHERE YOU LEFT OFF")}</div>
                <h2>{t("Ready when you are")}</h2>
              </div>
              <button className="text-link" onClick={() => setPage("lessons")}>
                {t("See all lessons")} <ArrowRight size={16} />
              </button>
            </section>
            <div className="lesson-grid home-grid">
              {lessons.slice(0, 3).map((l) => (
                <LessonCard
                  key={l.id}
                  lesson={l}
                  completed={progress[l.id]?.completed}
                  t={t}
                  onClick={() => begin(l)}
                />
              ))}
            </div>
            <section className="tip-strip">
              <div className="tip-icon">💡</div>
              <div>
                <b>{t("Today's tiny tip")}</b>
                <p>
                  {t("Say new words out loud. Speaking helps your brain remember them!")}
                </p>
              </div>
              <button
                onClick={() =>
                  speak(
                    "Say new words out loud. Speaking helps your brain remember them!",
                  )
                }
                aria-label={t("Listen to today's tip")}
              >
                <Volume2 size={19} />
              </button>
            </section>
          </>
        )}
        {page === "lessons" && (
          <>
            <div className="page-intro">
              <div className="eyebrow muted">{t("YOUR ENGLISH TOOLBOX")}</div>
              <h1>
                {t("Lesson library")} <span className="intro-emoji">📚</span>
              </h1>
              <p>{t("Choose a short activity and make today a little brighter.")}</p>
            </div>
            <label className="searchbox">
              <span>⌕</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("Search lessons or topics…")}
                aria-label={t("Search lessons or topics…")}
              />
              <kbd>⌘ K</kbd>
            </label>
            <div className="filters">
              <span>{t("GRADE")}</span>
              {["All", "Grade 3", "Grade 4"].map((grade) => <button key={grade} className={"filter-pill " + (selectedGrade === grade ? "active" : "")} onClick={() => setSelectedGrade(grade)}>{t(grade)}</button>)}
              <span className="filter-pill">{filtered.length} {t("activities")}</span>
            </div>
            <div className="lesson-grid">
              {filtered.map((l) => (
                <LessonCard
                  key={l.id}
                  lesson={l}
                  completed={progress[l.id]?.completed}
                  t={t}
                  onClick={() => begin(l)}
                />
              ))}
            </div>
            {!filtered.length && (
              <p className="empty">{t("No lessons found. Try another word.")}</p>
            )}
          </>
        )}
        {page === "progress" && (
          <>
            <div className="page-intro">
              <div className="eyebrow muted">{t("LOOK HOW FAR YOU'VE COME")}</div>
              <h1>
                {t("My progress")} <span className="intro-emoji">🏆</span>
              </h1>
              <p>{t("Every lesson is a little win. Keep collecting them!")}</p>
            </div>
            <div className="progress-overview">
              <div className="progress-big">
                <div
                  className="progress-ring"
                  style={{ "--p": (completed / lessons.length) * 100 }}
                >
                  <b>
                    {Math.round((completed / lessons.length) * 100)}
                    <small>%</small>
                  </b>
                </div>
                <div>
                  <b>{t("You're growing!")}</b>
                  <p>
                    {completed} / {lessons.length} {t("lessons completed")}
                  </p>
                </div>
              </div>
              <div className="score-tile">
                <span>⭐</span>
                <b>{totalStars}</b>
                <small>{t("stars collected")}</small>
              </div>
              <div className="score-tile">
                <span>📖</span>
                <b>{completed}</b>
                <small>{t("lessons finished")}</small>
              </div>
            </div>
            <div className="section-head progress-head">
              <div>
                <div className="eyebrow muted">{t("YOUR LEARNING PATH")}</div>
                <h2>{t("Lessons")}</h2>
              </div>
              <button className="text-link" onClick={() => setPage("lessons")}>
                {t("Explore lessons")} <ArrowRight size={16} />
              </button>
            </div>
            <div className="progress-list">
              {lessons.map((l, i) => (
                <button
                  className="progress-row"
                  key={l.id}
                  onClick={() => begin(l)}
                >
                  <span className={`row-icon ${l.color}`}>{l.icon}</span>
                  <span className="row-title">
                    <b>
                      {i + 1}. {l.title}
                    </b>
                    <small>
                      {t(l.category)} · {l.minutes} {t("min")}
                    </small>
                  </span>
                  <span
                    className={
                      progress[l.id]?.completed ? "status done" : "status"
                    }
                  >
                    {progress[l.id]?.completed ? (
                      <>
                        <CheckCircle2 size={16} /> {progress[l.id].score}%
                      </>
                    ) : (
                      t("Not started")
                    )}
                  </span>
                  <ChevronRight size={18} color="#aab0c0" />
                </button>
              ))}
            </div>
            {!user && (
              <div className="sync-note">
                <LockKeyhole size={19} />
                <span>
                  <b>{t("Keep your progress safe")}</b>
                  <small>
                    {t("Create a student account to sync learning across devices.")}
                  </small>
                </span>
                <button
                  className="primary small-primary"
                  onClick={() => {
                    setAuthMode("signup");
                    setAuthOpen(true);
                  }}
                >
                  {t("Create account")}
                </button>
              </div>
            )}
          </>
        )}
        {page === "lesson" && active && (
          <>
            <button className="back-link" onClick={() => setPage("lessons")}>
              <ArrowLeft size={16} /> {t("Back to lessons")}
            </button>
            {done ? (
              <div className="result-card">
                <div className="result-confetti">🎉</div>
                <div className="eyebrow muted">{t("LESSON COMPLETE")}</div>
                <h1>
                  {answers.filter((a, i) => isCorrect(active.questions[i], a))
                    .length === active.questions.length
                    ? t("Wonderful work!")
                    : t("Great effort!")}
                </h1>
                <p>
                  {t("You finished")} <b>{active.title}</b>. {t("Every try helps you learn.")}
                </p>
                <div className="result-score">
                  <strong>
                    {progress[active.id]?.lastScore ??
                      progress[active.id]?.score}
                    %
                  </strong>
                  <span>{t("your score")}</span>
                </div>
                <div className="result-actions">
                  <button className="secondary" onClick={reset}>
                    <RotateCcw size={17} /> {t("Try again")}
                  </button>
                  <button
                    className="primary"
                    onClick={() => setPage("lessons")}
                  >
                    {t("Choose another lesson")} <ArrowRight size={17} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="exercise">
                <div className="exercise-top">
                  <span className={`lesson-icon ${active.color}`}>
                    {active.icon}
                  </span>
                  <div>
                    <div className="eyebrow muted">
                      {t(active.category).toUpperCase()} · {active.minutes} {t("min").toUpperCase()}
                    </div>
                    <h1>{active.title}</h1>
                  </div>
                  <span className="lesson-level">{t(active.level)}</span>
                </div>
                <div className="step-track">
                  <span>
                    {t("Question")} {step + 1} {t("of")} {active.questions.length}
                  </span>
                  <div className="track">
                    <i
                      style={{
                        width: `${((step + 1) / active.questions.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                {step === 0 && active.passage && (
                  <div className="reading-box">
                    <div className="eyebrow muted">{t("READ THE STORY")}</div>
                    <p>{active.passage}</p>
                    <button
                      className="listen-button"
                      onClick={() => speak(active.passage)}
                    >
                      <Volume2 size={17} /> {t("Listen to the story")}
                    </button>
                  </div>
                )}
                {step === 0 && active.script && (
                  <div className="audio-box">
                    <div className="audio-wave">
                      {Array.from({ length: 30 }, (_, i) => (
                        <i
                          key={i}
                          style={{
                            height: `${15 + Math.abs(Math.sin(i * 2.7)) * 44}px`,
                          }}
                        />
                      ))}
                    </div>
                    <p>{t("Listen to the recording, then answer the questions.")}</p>
                    <button
                      className="primary"
                      onClick={() => speak(active.script)}
                    >
                      <Play size={17} fill="currentColor" /> {t("Play audio")}
                    </button>
                  </div>
                )}
                {step === 0 && active.video && (
                  <div className="video-box">
                    <video
                      controls
                      playsInline
                      preload="metadata"
                      src={active.video}
                      aria-label={t("Short flower growing video")}
                    />
                    <p>
                      Watch the short video. If it doesn't load, try the
                      questions using what you know about plants.
                    </p>
                  </div>
                )}
                {step === 0 && active.type === "Words & quiz" && (
                  <div className="word-chips">
                    {active.words.map((w) => (
                      <button key={w} onClick={() => speak(w)}>
                        {w}
                        <Volume2 size={15} />
                      </button>
                    ))}
                  </div>
                )}
                <div className="question-box">
                  <div className="question-num">
                    Q{String(step + 1).padStart(2, "0")}
                  </div>
                  <h2>{active.questions[step].q}</h2>
                  {active.questions[step].spelling && (
                    <button className="listen-button spelling-listen" onClick={() => speak(active.questions[step].answerText)}>
                      <Volume2 size={16} /> {t("Listen to the word")}
                    </button>
                  )}
                  {active.questions[step].fillBlank ? (
                    <input
                      className="fill-input"
                      type="text"
                      disabled={checked}
                      value={picked ?? ""}
                      onChange={(e) => setPicked(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && !checked && advance()
                      }
                      aria-label={t("Type the missing word")}
                      placeholder={t("Type the missing word…")}
                    />
                  ) : (
                    <div className="answers">
                      {active.questions[step].choices.map((choice, i) => (
                        <button
                          key={choice}
                          disabled={checked}
                          className={`answer ${picked === i ? "picked" : ""} ${checked && i === active.questions[step].answer ? "correct" : ""} ${checked && picked === i && i !== active.questions[step].answer ? "incorrect" : ""}`}
                          onClick={() => setPicked(i)}
                        >
                          <span>{String.fromCharCode(65 + i)}</span>
                          {translateChoice(choice, choiceLanguage)}
                          {checked && i === active.questions[step].answer && (
                            <Check size={17} />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  {checked && (
                    <div
                      className={`answer-feedback ${isCorrect(active.questions[step], picked) ? "right" : "try-again"}`}
                    >
                      <b>
                        {isCorrect(active.questions[step], picked)
                          ? t("That’s right!")
                          : t("Good try!")}
                      </b>
                      <span>{active.questions[step].explain}</span>
                    </div>
                  )}
                </div>
                <div className="exercise-footer">
                  <span>
                    <CircleHelp size={16} /> {t("Take your time — you've got this!")}
                  </span>
                  <button
                    disabled={picked === null || picked === ""}
                    className="primary"
                    onClick={advance}
                  >
                    {checked
                      ? step + 1 === active.questions.length
                        ? t("See my results")
                        : t("Next question")
                      : t("Check answer")}{" "}
                    <ArrowRight size={17} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        <footer className="footer">
          <span>
            Made for curious minds <span>✦</span>
          </span>
          <span>{t("Practice kindly. Grow confidently.")}</span>
        </footer>
      </main>
      {authOpen && (
        <div className="modal-backdrop" onClick={() => setAuthOpen(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-modal"
              onClick={() => setAuthOpen(false)}
              aria-label={t("Close")}
            >
              <X size={20} />
            </button>
            <div className="auth-mark">✦</div>
            <div className="eyebrow muted">{t("YOUR LEARNING JOURNEY")}</div>
            <h2>
              {authMode === "signup" ? t("Create your account") : t("Welcome back!")}
            </h2>
            <p>
              {authMode === "signup"
                ? t("Save your stars and keep learning on any device.")
                : t("Sign in to see your learning progress.")}
            </p>
            <form onSubmit={submitAuth}>
              {authMode === "signup" && (
                <label>
                  {t("Display name")}{" "}
                  <input
                    name="display_name"
                    maxLength="40"
                    placeholder={t("A nickname is fine")}
                    required
                  />
                </label>
              )}
              <label>
                {t("Email address")}
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
              </label>
              <label>
                {t("Password")}
                <input
                  name="password"
                  type="password"
                  autoComplete={
                    authMode === "signup" ? "new-password" : "current-password"
                  }
                  minLength="8"
                  placeholder={t("At least 8 characters")}
                  required
                />
              </label>
              {authMsg && (
                <div className="auth-message" role="status">
                  {authMsg}
                </div>
              )}
              <button className="primary auth-submit" disabled={busy}>
                {busy
                  ? t("One moment…")
                  : authMode === "signup"
                    ? t("Create account")
                    : t("Sign in")}{" "}
                <ArrowRight size={17} />
              </button>
            </form>
            <button
              className="mode-link"
              onClick={() => {
                setAuthMode(authMode === "signup" ? "signin" : "signup");
                setAuthMsg("");
              }}
            >
              {authMode === "signup"
                ? t("Already have an account? Sign in")
                : t("New here? Create an account")}
            </button>
            <small className="privacy-note">
              {t("Use a nickname. For children, set up accounts with a parent or teacher.")}
            </small>
          </div>
        </div>
      )}
    </div>
  );
}
function LessonCard({ lesson, completed, onClick, t }) {
  return (
    <button className="lesson-card" onClick={onClick}>
      <div className={`card-art ${lesson.color}`}>
        <div className="card-orbit"></div>
        <span className="card-emoji">{lesson.icon}</span>
        {completed && (
          <span className="completed-badge">
            <Check size={13} /> {t("DONE")}
          </span>
        )}
        <span className="card-type">{lesson.grade ? `${t(lesson.grade)} · ` : ""}{t(lesson.category)}</span>
      </div>
      <div className="card-body">
        <div className="card-meta">
          <span>{t(lesson.level)}</span>
          <span>
            <Clock3 size={13} />
            {lesson.minutes} {t("min")}
          </span>
        </div>
        <h3>{lesson.title}</h3>
        <p>{lesson.description}</p>
        <div className="card-bottom">
          <span className="word-preview">
            {lesson.words.slice(0, 3).join(" · ")}
          </span>
          <span className="round-arrow">
            <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </button>
  );
}

export default App;
createRoot(document.getElementById("root")).render(<App />);
