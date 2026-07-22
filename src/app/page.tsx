"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CardsData, GameSettings } from "@/lib/types";
import { loadCards, loadSettings, saveSettings } from "@/lib/storage";
import { useGameEngine } from "@/hooks/useGameEngine";
import { SetupScreen } from "@/components/SetupScreen";
import { GameScreen } from "@/components/GameScreen";
import { EndScreen } from "@/components/EndScreen";

export default function HomePage() {
  const [cards, setCards] = useState<CardsData | null>(null);
  const [initialSettings, setInitialSettings] = useState<GameSettings | null>(null);

  useEffect(() => {
    setCards(loadCards());
    setInitialSettings(loadSettings());
  }, []);

  const engine = useGameEngine(cards ?? { categories: [], words: [] });

  if (!cards || !initialSettings) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <span className="text-mist font-body animate-pulse">جارِ التحميل…</span>
      </div>
    );
  }

  const handleStart = (settings: GameSettings) => {
    saveSettings(settings);
    engine.startGame(settings);
  };

  return (
    <main className="min-h-dvh w-full">
      <AnimatePresence mode="wait">
        {!engine.state && (
          <motion.div key="setup" exit={{ opacity: 0 }}>
            <SetupScreen cards={cards} initialSettings={initialSettings} onStart={handleStart} />
          </motion.div>
        )}

        {engine.state && engine.state.phase !== "finished" && (
          <motion.div key="game" exit={{ opacity: 0 }}>
            <GameScreen
              state={engine.state}
              cards={cards}
              onReveal={engine.revealWord}
              onTimerDone={engine.endTurnTimer}
              onChooseResult={engine.chooseResult}
            />
          </motion.div>
        )}

        {engine.state && engine.state.phase === "finished" && (
          <motion.div key="end" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <EndScreen
              state={engine.state}
              onPlayAgain={engine.restartWithSameSettings}
              onBackToSetup={engine.backToSetup}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
