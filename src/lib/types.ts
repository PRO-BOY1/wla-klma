// أنواع البيانات الأساسية المستخدمة في اللعبة بالكامل

export type TeamId = "red" | "blue";

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface WordCard {
  id: string;
  categoryId: string;
  text: string;
}

export interface CardsData {
  categories: Category[];
  words: WordCard[];
}

export interface GameSettings {
  redName: string;
  blueName: string;
  totalRounds: number; // عدد الجولات الكلي (لكل الفريقين مجتمعين)
  roundSeconds: number; // مدة الدور الواحد بالثواني
  targetScore: number | null; // نقاط الفوز الاختيارية، null تعني بدون حد
  selectedCategoryIds: string[]; // التصنيفات المفعّلة لهذه المباراة
}

export type TurnResultChoice = "mine" | "opponent" | "none";

export interface TurnRecord {
  team: TeamId;
  categoryId: string;
  wordId: string;
  result: TurnResultChoice | null;
}

export type GamePhase =
  | "setup"
  | "turn-intro" // عرض الكلمة قبل الضغط على "قرأت الكلمة"
  | "turn-active" // المؤقت يعمل والكلمة مخفية
  | "turn-result" // اختيار نتيجة الدور
  | "finished";

export interface GameState {
  phase: GamePhase;
  settings: GameSettings;
  currentTeam: TeamId;
  scores: Record<TeamId, number>;
  wordsGuessed: Record<TeamId, number>;
  roundNumber: number; // الدور الحالي (1-based) بين كل الأدوار المجتمعة
  currentWord: WordCard | null;
  usedWordIds: string[];
  history: TurnRecord[];
}

export interface PersistedGameData {
  cards: CardsData;
}
