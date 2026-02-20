"use client";

import { useEffect, useState } from "react";
import type { DateRange, DateRangeParams } from "@/lib/analytics-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const PRESET_OPTIONS: { value: Exclude<DateRange, "custom">; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

interface DateRangeSelectorProps {
  value: DateRangeParams;
  onChange: (params: DateRangeParams) => void;
}

function localDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function todayStr(): string {
  return localDateStr(new Date());
}

function nDaysAgoStr(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return localDateStr(d);
}

export function DateRangeSelector({ value, onChange }: DateRangeSelectorProps) {
  const isCustom =
    value.range === "custom" || (!value.range && !!value.start && !!value.end);
  const current = isCustom ? "custom" : (value.range ?? "7d");

  const [showCustom, setShowCustom] = useState(isCustom);
  const [startInput, setStartInput] = useState(value.start ?? nDaysAgoStr(6));
  const [endInput, setEndInput] = useState(value.end ?? todayStr());

  // Sync local state when parent changes value externally
  useEffect(() => {
    setShowCustom(isCustom);
    if (isCustom && value.start && value.end) {
      setStartInput(value.start);
      setEndInput(value.end);
    }
  }, [isCustom, value.start, value.end]);

  function handlePresetChange(v: string) {
    if (v === "custom") {
      setShowCustom(true);
    } else {
      setShowCustom(false);
      onChange({ range: v as DateRange });
    }
  }

  function daysBetween(a: string, b: string): number {
    const ms = new Date(b).getTime() - new Date(a).getTime();
    return Math.round(ms / 86_400_000);
  }

  const rangeValid =
    !!startInput && !!endInput && startInput <= endInput && daysBetween(startInput, endInput) < 90;

  function handleApply() {
    if (rangeValid) {
      onChange({ range: "custom", start: startInput, end: endInput });
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={current} onValueChange={handlePresetChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PRESET_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
          <SelectItem value="custom">Custom range</SelectItem>
        </SelectContent>
      </Select>

      {showCustom && (
        <>
          <input
            type="date"
            value={startInput}
            max={endInput || todayStr()}
            onChange={(e) => setStartInput(e.target.value)}
            className="h-9 rounded-md border bg-background px-2 text-sm"
          />
          <span className="text-sm text-muted-foreground">–</span>
          <input
            type="date"
            value={endInput}
            min={startInput}
            max={todayStr()}
            onChange={(e) => setEndInput(e.target.value)}
            className="h-9 rounded-md border bg-background px-2 text-sm"
          />
          <Button
            size="sm"
            variant="secondary"
            onClick={handleApply}
            disabled={!rangeValid}
          >
            Apply
          </Button>
          {startInput && endInput && startInput <= endInput && daysBetween(startInput, endInput) >= 90 && (
            <span className="text-xs text-destructive">Max 90 days</span>
          )}
        </>
      )}
    </div>
  );
}
