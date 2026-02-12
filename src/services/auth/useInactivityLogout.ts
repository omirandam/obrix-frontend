// src/components/auth/useInactivityLogout.ts
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../app/store/auth.store";

const DEFAULT_IDLE_MS = 30 * 60 * 1000; // 30 min
const DEFAULT_COUNTDOWN_SECONDS = 10;

export function useInactivityLogout(
  idleMs: number = DEFAULT_IDLE_MS,
  countdownSeconds: number = DEFAULT_COUNTDOWN_SECONDS
) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.clearSession);

  const idleTimerRef = useRef<number | null>(null);
  const countdownTimerRef = useRef<number | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(countdownSeconds);

  const clearIdleTimer = () => {
    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  };

  const clearCountdownTimer = () => {
    if (countdownTimerRef.current) {
      window.clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  };

  const startIdleTimer = () => {
    clearIdleTimer();
    idleTimerRef.current = window.setTimeout(() => {
      setShowModal(true);
    }, idleMs);
  };

  const startCountdown = () => {
    clearCountdownTimer();
    setSecondsLeft(countdownSeconds);

    countdownTimerRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearCountdownTimer();
          // logout automático
          logout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetIdleTimer = () => {
    if (showModal) return; // si ya está el modal, no reinicies por actividad
    startIdleTimer();
  };

  const confirmLogout = () => {
    clearCountdownTimer();
    setShowModal(false);
    logout();
  };

  const cancelAndContinue = () => {
    clearCountdownTimer();
    setShowModal(false);
    startIdleTimer(); // reinicia contador de 30 min
  };

  // Cuando se abre el modal, arranca el countdown de 10s
  useEffect(() => {
    if (showModal) startCountdown();
    else clearCountdownTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

  useEffect(() => {
    if (!isAuthenticated) {
      clearIdleTimer();
      clearCountdownTimer();
      setShowModal(false);
      return;
    }

    startIdleTimer();

    const events: Array<keyof WindowEventMap> = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "wheel",
    ];

    const handler = () => resetIdleTimer();

    events.forEach((evt) =>
      window.addEventListener(evt, handler, { passive: true })
    );

    const onVisibility = () => {
      if (document.visibilityState === "visible") resetIdleTimer();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearIdleTimer();
      clearCountdownTimer();
      events.forEach((evt) => window.removeEventListener(evt, handler));
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, idleMs, showModal]);

  return {
    showModal,
    secondsLeft,
    confirmLogout,
    cancelAndContinue,
  };
}
