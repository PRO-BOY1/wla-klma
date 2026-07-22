import type { CardsData, GameSettings } from "./types";
import seedData from "@data/cards.json";

const CARDS_KEY = "kalimat-arena:cards";
const SETTINGS_KEY = "kalimat-arena:settings";

const DEFAULT_SETTINGS: GameSettings = {
  redName: "الفريق الأحمر",
  blueName: "الفريق الأزرق",
  totalRounds: 10,
  roundSeconds: 60,
  targetScore: null,
  selectedCategoryIds: (seedData as CardsData).categories.map((c) => c.id),
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadCards(): CardsData {
  if (!isBrowser()) return seedData as CardsData;
  try {
    const raw = window.localStorage.getItem(CARDS_KEY);
    if (!raw) return seedData as CardsData;
    const parsed = JSON.parse(raw) as CardsData;
    if (!parsed.categories || !parsed.words) return seedData as CardsData;
    return parsed;
  } catch {
    return seedData as CardsData;
  }
}

export function saveCards(data: CardsData) {
  if (!isBrowser()) return;
  window.localStorage.setItem(CARDS_KEY, JSON.stringify(data));
}

export function resetCardsToSeed(): CardsData {
  const fresh = seedData as CardsData;
  saveCards(fresh);
  return fresh;
}

export function loadSettings(): GameSettings {
  if (!isBrowser()) return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as GameSettings;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: GameSettings) {
  if (!isBrowser()) return;
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export { DEFAULT_SETTINGS };
