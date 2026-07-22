"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseTimerOptions {
  onComplete?: () => void;
}

/** مؤقت عد تنازلي بسيط يعتمد على الوقت الفعلي لتفادي أي انحراف بسبب تعليق التبويب */
export function useTimer(durationSeconds: number, options?: UseTimerOptions) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const endAtRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const onCompleteRef = useRef(options?.onComplete);
  onCompleteRef.current = options?.onComplete;

  const tick = useCallback(() => {
    if (endAtRef.current == null) return;
    const msLeft = endAtRef.current - Date.now();
    const secondsLeft = Math.max(0, Math.ceil(msLeft / 1000));
    setRemaining(secondsLeft);
    if (msLeft <= 0) {
      setIsRunning(false);
      endAtRef.current = null;
      onCompleteRef.current?.();
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(() => {
    endAtRef.current = Date.now() + durationSeconds * 1000;
    setRemaining(durationSeconds);
    setIsRunning(true);
  }, [durationSeconds]);

  const stop = useCallback(() => {
    setIsRunning(false);
    endAtRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    if (isRunning) {
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning, tick]);

  const progress = 1 - remaining / durationSeconds;

  return { remaining, isRunning, start, stop, progress };
}
