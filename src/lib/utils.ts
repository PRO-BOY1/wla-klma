import type { CardsData, WordCard } from "./types";

/** يختار كلمة عشوائية من التصنيفات المفعّلة، مع تفادي الكلمات المستخدمة سابقًا إن أمكن */
export function pickRandomWord(
  cards: CardsData,
  categoryIds: string[],
  usedWordIds: string[]
): WordCard | null {
  const pool = cards.words.filter((w) => categoryIds.includes(w.categoryId));
  if (pool.length === 0) return null;

  const fresh = pool.filter((w) => !usedWordIds.includes(w.id));
  const finalPool = fresh.length > 0 ? fresh : pool; // إذا انتهت كل الكلمات، أعد الدورة

  const index = Math.floor(Math.random() * finalPool.length);
  return finalPool[index];
}

export function formatSeconds(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function findCategoryName(cards: CardsData, categoryId: string): string {
  return cards.categories.find((c) => c.id === categoryId)?.name ?? "";
}

export function findCategoryIcon(cards: CardsData, categoryId: string): string {
  return cards.categories.find((c) => c.id === categoryId)?.icon ?? "🎯";
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
