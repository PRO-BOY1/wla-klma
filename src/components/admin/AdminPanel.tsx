"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { CardsData } from "@/lib/types";
import { loadCards, resetCardsToSeed, saveCards } from "@/lib/storage";
import { generateId } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { WordForm } from "@/components/admin/WordForm";
import { WordList } from "@/components/admin/WordList";

export function AdminPanel() {
  const [cards, setCards] = useState<CardsData | null>(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [toast, setToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCards(loadCards());
  }, []);

  useEffect(() => {
    if (cards) saveCards(cards);
  }, [cards]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const filteredWords = useMemo(() => {
    if (!cards) return [];
    return cards.words.filter((w) => {
      const matchesCategory = filterCategory === "all" || w.categoryId === filterCategory;
      const matchesSearch = w.text.toLowerCase().includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [cards, search, filterCategory]);

  if (!cards) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <span className="text-mist font-body animate-pulse">جارِ التحميل…</span>
      </div>
    );
  }

  const addWord = (categoryId: string, text: string) => {
    setCards((prev) =>
      prev ? { ...prev, words: [...prev.words, { id: generateId("w"), categoryId, text }] } : prev
    );
    showToast("تمت إضافة الكلمة");
  };

  const addCategory = (name: string, icon: string) => {
    setCards((prev) =>
      prev
        ? { ...prev, categories: [...prev.categories, { id: generateId("cat"), name, icon }] }
        : prev
    );
    showToast("تم إنشاء التصنيف");
  };

  const updateWord = (id: string, text: string) => {
    setCards((prev) =>
      prev ? { ...prev, words: prev.words.map((w) => (w.id === id ? { ...w, text } : w)) } : prev
    );
  };

  const deleteWord = (id: string) => {
    setCards((prev) => (prev ? { ...prev, words: prev.words.filter((w) => w.id !== id) } : prev));
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(cards, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cards.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as CardsData;
        if (!parsed.categories || !parsed.words) throw new Error("invalid");
        setCards(parsed);
        showToast("تم استيراد الملف بنجاح");
      } catch {
        showToast("تعذر قراءة الملف، تأكد من صيغة JSON");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleResetSeed = () => {
    if (!confirm("هل أنت متأكد من استعادة الكلمات الافتراضية؟ سيتم فقدان أي تعديلات.")) return;
    setCards(resetCardsToSeed());
    showToast("تمت استعادة الكلمات الافتراضية");
  };

  return (
    <div className="min-h-dvh w-full px-4 py-8 max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-3xl text-paper">لوحة الإدارة</h1>
          <p className="text-mist font-body text-sm mt-1">إدارة الكلمات والتصنيفات</p>
        </div>
        <Link href="/" className="text-gold font-body text-sm underline underline-offset-4">
          ⬅ العودة للعبة
        </Link>
      </div>

      <WordForm categories={cards.categories} onAddWord={addWord} onAddCategory={addCategory} />

      <div className="glass rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 ابحث داخل الكلمات..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-paper font-body focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-paper font-body focus:outline-none focus:ring-2 focus:ring-gold sm:w-48"
          >
            <option value="all" className="bg-ink2">كل التصنيفات</option>
            {cards.categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-ink2">
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>
        <span className="text-xs text-mist font-body">{filteredWords.length} كلمة</span>
      </div>

      <WordList cards={cards} words={filteredWords} onUpdate={updateWord} onDelete={deleteWord} />

      <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3 justify-between">
        <span className="text-sm text-mist font-body">{cards.words.length} كلمة إجمالًا في {cards.categories.length} تصنيف</span>
        <div className="flex gap-2 flex-wrap justify-center">
          <Button variant="ghost" size="md" onClick={handleImportClick}>📥 استيراد JSON</Button>
          <Button variant="ghost" size="md" onClick={handleExport}>📤 تصدير JSON</Button>
          <Button variant="danger" size="md" onClick={handleResetSeed}>↺ استعادة الافتراضي</Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={handleImportFile}
        />
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-strong rounded-full px-5 py-2.5 text-paper font-body text-sm shadow-glow shadow-gold z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
