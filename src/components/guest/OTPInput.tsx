"use client";

import { useRef, useCallback, type KeyboardEvent, type ClipboardEvent } from "react";

const DIGIT_COUNT = 6;

export function OTPInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (code: string) => void;
  disabled?: boolean;
}) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.split("").concat(Array(DIGIT_COUNT).fill("")).slice(0, DIGIT_COUNT);

  const focusInput = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(idx, DIGIT_COUNT - 1));
    inputsRef.current[clamped]?.focus();
  }, []);

  const handleInput = useCallback(
    (idx: number, char: string) => {
      if (!/^\d$/.test(char)) return;
      const arr = digits.slice();
      arr[idx] = char;
      const next = arr.join("");
      onChange(next);
      if (idx < DIGIT_COUNT - 1) focusInput(idx + 1);
    },
    [digits, onChange, focusInput],
  );

  const handleKeyDown = useCallback(
    (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        const arr = digits.slice();
        if (arr[idx]) {
          arr[idx] = "";
          onChange(arr.join(""));
        } else if (idx > 0) {
          arr[idx - 1] = "";
          onChange(arr.join(""));
          focusInput(idx - 1);
        }
      } else if (e.key === "ArrowLeft") {
        focusInput(idx - 1);
      } else if (e.key === "ArrowRight") {
        focusInput(idx + 1);
      }
    },
    [digits, onChange, focusInput],
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, DIGIT_COUNT);
      if (pasted) {
        onChange(pasted.padEnd(DIGIT_COUNT, "").slice(0, DIGIT_COUNT));
        focusInput(Math.min(pasted.length, DIGIT_COUNT - 1));
      }
    },
    [onChange, focusInput],
  );

  return (
    <div className="flex gap-1.5 sm:gap-2 justify-center">
      {/* Hidden input for autocomplete="one-time-code" */}
      <input
        type="text"
        autoComplete="one-time-code"
        className="sr-only"
        tabIndex={-1}
        value={value}
        onChange={(e) => {
          const cleaned = e.target.value.replace(/\D/g, "").slice(0, DIGIT_COUNT);
          onChange(cleaned);
        }}
      />

      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { inputsRef.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          className="size-10 sm:size-12 text-center text-base sm:text-lg font-semibold rounded-xl border-2 transition-colors focus:outline-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2"
          style={{
            borderColor: digit
              ? "var(--brand-accent)"
              : "color-mix(in oklch, var(--brand-primary) 30%, transparent)",
            color: "var(--brand-primary)",
            backgroundColor: "color-mix(in oklch, var(--brand-primary) 5%, transparent)",
          }}
          onFocus={(e) => e.target.select()}
          onInput={(e) => {
            const char = (e.target as HTMLInputElement).value.slice(-1);
            handleInput(i, char);
          }}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
}
