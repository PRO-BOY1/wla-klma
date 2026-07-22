import confetti from "canvas-confetti";

/** يطلق دفعات كونفيتي احتفالية بألوان الفريق الفائز */
export function fireVictoryConfetti(colors: string[]) {
  const duration = 2200;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 65,
      origin: { x: 0 },
      colors,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 65,
      origin: { x: 1 },
      colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();

  confetti({
    particleCount: 120,
    spread: 100,
    origin: { y: 0.4 },
    colors,
  });
}
