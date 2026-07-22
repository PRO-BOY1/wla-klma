"use client";

import { useState } from "react";
import type { Category } from "@/lib/types";
import { Button } from "@/components/ui/Button";

interface WordFormProps {
  categories: Category[];
  onAddWord: (categoryId: string, text: string) => void;
  onAddCategory: (name: string, icon: string) => void;
}

export function WordForm({ categories, onAddWord, onAddCategory }: WordFormProps) {
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [text, setText] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("🎯");

  const submitWord = () => {
    if (!text.trim() || !categoryId) return;
    onAddWord(categoryId, text.trim());
    setText("");
  };

  const submitCategory = () => {
    if (!newCatName.trim()) return;
    onAddCategory(newCatName.trim(), newCatIcon.trim() || "🎯");
    setNewCatName("");
    setNewCatIcon("🎯");
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="glass rounded-2xl p-4 flex flex-col gap-3">
        <h3 className="font-display font-bold text-paper text-sm">إضافة كلمة جديدة</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-paper font-body focus:outline-none focus:ring-2 focus:ring-gold sm:w-40"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-ink2">
                {c.icon} {c.name}
              </option>
            ))}
          </select>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitWord()}
            placeholder="اكتب الكلمة هنا..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-paper font-body focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <Button variant="gold" size="md" onClick={submitWord}>
            إضافة
          </Button>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 flex flex-col gap-3">
        <h3 className="font-display font-bold text-paper text-sm">إنشاء تصنيف جديد</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={newCatIcon}
            onChange={(e) => setNewCatIcon(e.target.value)}
            placeholder="🎯"
            className="bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-paper font-body text-center focus:outline-none focus:ring-2 focus:ring-gold sm:w-16"
          />
          <input
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitCategory()}
            placeholder="اسم التصنيف الجديد..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-paper font-body focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <Button variant="ghost" size="md" onClick={submitCategory}>
            إنشاء
          </Button>
        </div>
      </div>
    </div>
  );
}
