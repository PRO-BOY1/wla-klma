"use client";

import { useState } from "react";
import type { CardsData, WordCard } from "@/lib/types";
import { findCategoryIcon, findCategoryName } from "@/lib/utils";

interface WordListProps {
  cards: CardsData;
  words: WordCard[];
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

export function WordList({ cards, words, onUpdate, onDelete }: WordListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  if (words.length === 0) {
    return (
      <div className="text-center py-10 text-mist font-body">لا توجد كلمات مطابقة</div>
    );
  }

  return (
    <div className="flex flex-col gap-2 max-h-[520px] overflow-y-auto pe-1">
      {words.map((w) => (
        <div
          key={w.id}
          className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5"
        >
          <span className="text-lg shrink-0">{findCategoryIcon(cards, w.categoryId)}</span>
          <span className="text-xs text-mist shrink-0 hidden sm:inline w-20 truncate">
            {findCategoryName(cards, w.categoryId)}
          </span>

          {editingId === w.id ? (
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onUpdate(w.id, draft);
                  setEditingId(null);
                }
                if (e.key === "Escape") setEditingId(null);
              }}
              className="flex-1 bg-transparent border-b border-gold text-paper font-body focus:outline-none min-w-0"
            />
          ) : (
            <span className="flex-1 text-paper font-body truncate">{w.text}</span>
          )}

          {editingId === w.id ? (
            <button
              onClick={() => {
                onUpdate(w.id, draft);
                setEditingId(null);
              }}
              className="text-gold text-sm font-body shrink-0"
            >
              حفظ
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingId(w.id);
                setDraft(w.text);
              }}
              className="text-mist hover:text-paper text-sm font-body shrink-0"
            >
              تعديل
            </button>
          )}
          <button
            onClick={() => onDelete(w.id)}
            className="text-team-red hover:opacity-80 text-sm font-body shrink-0"
          >
            حذف
          </button>
        </div>
      ))}
    </div>
  );
}
