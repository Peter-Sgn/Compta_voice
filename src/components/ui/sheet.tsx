"use client";

import {
  type ReactNode,
  type RefObject,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { fr } from "@/lib/i18n/fr";

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  triggerRef?: RefObject<HTMLElement | null>;
}

const emptySubscribe = () => () => {};

export function Sheet({
  isOpen,
  onClose,
  title,
  children,
  triggerRef,
}: SheetProps) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [isRendered, setIsRendered] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const isDraggingRef = useRef(false);

  // Adjust state during render when isOpen changes (React-compliant pattern)
  if (isOpen && !isRendered) {
    setIsRendered(true);
  }
  if (!isOpen && isVisible) {
    setIsVisible(false);
  }

  // Handle animation timings
  useEffect(() => {
    if (isOpen) {
      const frameId = requestAnimationFrame(() => {
        setIsVisible(true);
      });
      return () => cancelAnimationFrame(frameId);
    } else if (isRendered) {
      const timer = setTimeout(() => {
        setIsRendered(false);
        setDragOffset(0);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isRendered]);

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Focus management: trap focus inside and restore to trigger on close
  useEffect(() => {
    if (!isOpen || !isRendered) return;

    const previouslyFocused =
      triggerRef?.current || (document.activeElement as HTMLElement | null);

    const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements && focusableElements.length > 0) {
      focusableElements[0]?.focus();
    } else {
      dialogRef.current?.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab") {
        const focusables =
          dialogRef.current?.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
        if (!focusables || focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, isRendered, onClose, triggerRef]);

  // Native pointer events for drag-down gesture
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    startYRef.current = e.clientY;
    isDraggingRef.current = true;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const deltaY = e.clientY - startYRef.current;
    if (deltaY > 0) {
      setDragOffset(deltaY);
    } else {
      setDragOffset(0);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture was already lost
    }

    const deltaY = e.clientY - startYRef.current;
    if (deltaY > 80) {
      onClose();
    }
    setDragOffset(0);
  };

  if (!isClient || !isRendered) {
    return null;
  }

  const currentTranslateY = !isVisible
    ? "translate-y-full"
    : dragOffset > 0
    ? `translateY(${dragOffset}px)`
    : "translate-y-0";

  const sheetContent = (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
      {/* Voile / Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 bg-text/40 transition-opacity duration-200 ease-out motion-reduce:transition-none pointer-events-auto ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Sheet Panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`pointer-events-auto fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 flex flex-col bg-surface supports-[backdrop-filter]:bg-surface/72 supports-[backdrop-filter]:backdrop-blur-md rounded-t-3xl border-t border-x border-border shadow-soft max-h-[85dvh] focus:outline-none ${
          isDragging
            ? "transition-none"
            : "transition-transform duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none"
        } ${dragOffset === 0 && !isDragging ? currentTranslateY : ""}`}
        style={{
          transform:
            dragOffset > 0
              ? `translateX(-50%) translateY(${dragOffset}px)`
              : undefined,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {/* Poignée supérieure pour le geste de glissement */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full flex flex-col items-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none select-none"
        >
          <span className="w-12 h-1.5 rounded-full bg-border" aria-hidden="true" />
        </div>

        {/* En-tête de la feuille */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-border">
          <h2 id={titleId} className="text-title font-bold text-brand-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={fr.common.close}
            className="min-h-12 min-w-12 flex items-center justify-center rounded-button text-text-muted hover:text-text hover:bg-bg active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 cursor-pointer select-none"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Corps de la feuille */}
        <div className="flex-1 overflow-y-auto px-4 py-4 text-body text-text">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(sheetContent, document.body);
}
