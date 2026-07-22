"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { CardsData, GameSettings } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { cx } from "@/lib/utils";

interface SetupScreenProps {
  cards: CardsData;
  initialSettings: GameSettings;
  onStart: (settings: GameSettings) => void;
}

export function SetupScreen({ cards, initialSettings, onStart }: SetupScreenProps) {
  const [settings, setSettings] = useState<GameSettings>(initialSettings);

  const toggleCategory = (id: string) => {
    setSettings((prev) => {
      const has = prev.selectedCategoryIds.includes(id);
      const next = has
        ? prev.selectedCategoryIds.filter((c) => c !== id)
        : [...prev.selectedCategoryIds, id];
      return { ...prev, selectedCategoryIds: next };
    });
  };

  const canStart = settings.selectedCategoryIds.length > 0 && settings.redName.trim() && settings.blueName.trim();

  return (
    <div className="min-h-dvh w-full flex flex-col items-center px-4 py-8 gap-6 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-display font-black text-4xl sm:text-5xl bg-gradient-to-l from-team-red via-gold to-team-blue bg-clip-text text-transparent">
          ولا كلمة
        </h1>
        <p className="text-mist mt-2 font-body">مثّل، خمّن، واكسب الجولة لفريقك</p>
      </motion.div>

      <section className="glass rounded-3xl p-5 w-full flex flex-col gap-4">
        <h2 className="font-display font-bold text-lg text-paper">الفرق</h2>
        <div className="grid grid-cols-2 gap-3">
          <TeamNameInput
            label="🔴 الفريق الأحمر"
            value={settings.redName}
            colorClass="focus:ring-team-red"
            onChange={(v) => setSettings((p) => ({ ...p, redName: v }))}
          />
          <TeamNameInput
            label="🔵 الفريق الأزرق"
            value={settings.blueName}
            colorClass="focus:ring-team-blue"
            onChange={(v) => setSettings((p) => ({ ...p, blueName: v }))}
          />
        </div>
      </section>

      <section className="glass rounded-3xl p-5 w-full flex flex-col gap-4">
        <h2 className="font-display font-bold text-lg text-paper">إعدادات المباراة</h2>

        <NumberField
          label="عدد الجولات"
          value={settings.totalRounds}
          min={2}
          max={60}
          onChange={(v) => setSettings((p) => ({ ...p, totalRounds: v }))}
        />
        <NumberField
          label="مدة كل جولة (ثانية)"
          value={settings.roundSeconds}
          min={10}
          max={180}
          step={5}
          onChange={(v) => setSettings((p) => ({ ...p, roundSeconds: v }))}
        />
        <div className="flex items-center justify-between gap-3">
          <span className="font-body text-paper">نقاط الفوز (اختياري)</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              placeholder="بدون حد"
              value={settings.targetScore ?? ""}
              onChange={(e) =>
                setSettings((p) => ({
                  ...p,
                  targetScore: e.target.value === "" ? null : Number(e.target.value),
                }))
              }
              className="w-28 text-center bg-white/5 border border-white/10 rounded-xl py-2 px-3 font-display font-bold text-paper focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>
      </section>

      <section className="glass rounded-3xl p-5 w-full flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-paper">التصنيفات</h2>
          <span className="text-xs text-mist">{settings.selectedCategoryIds.length} مختارة</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {cards.categories.map((cat) => {
            const active = settings.selectedCategoryIds.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={cx(
                  "flex items-center gap-2 rounded-xl px-3 py-3 font-body text-sm transition-all border",
                  active
                    ? "bg-gold/15 border-gold text-gold"
                    : "bg-white/5 border-white/10 text-mist hover:bg-white/10"
                )}
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="truncate">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      <Button
        variant="gold"
        size="xl"
        disabled={!canStart}
        onClick={() => onStart(settings)}
        className={cx("w-full mt-2", !canStart && "opacity-40 pointer-events-none")}
      >
        🚀 ابدأ اللعبة
      </Button>

      <Link
        href="/admin"
        className="text-mist text-sm font-body underline underline-offset-4 hover:text-paper transition-colors"
      >
        إدارة الكلمات والتصنيفات
      </Link>
    </div>
  );
}

function TeamNameInput({
  label,
  value,
  onChange,
  colorClass,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  colorClass: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-mist font-body">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={20}
        className={cx(
          "bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 font-display font-bold text-paper focus:outline-none focus:ring-2",
          colorClass
        )}
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-body text-paper">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-paper text-lg font-bold"
        >
          −
        </button>
        <span className="w-12 text-center font-display font-black text-paper tabular-nums">
          {value}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + step))}
          className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-paper text-lg font-bold"
        >
          +
        </button>
      </div>
    </div>
  );
}
