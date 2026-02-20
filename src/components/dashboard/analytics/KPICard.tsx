"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  trend: number | null;
  /** Label for trend context, e.g. "vs last period" */
  trendLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  /** If true, a decrease is good (e.g., response time) */
  invertTrend?: boolean;
  suffix?: string;
}

export function KPICard({
  title,
  value,
  trend,
  trendLabel = "vs last period",
  icon: Icon,
  invertTrend = false,
  suffix,
}: KPICardProps) {
  const isPositive = trend !== null && trend > 0;
  const isNegative = trend !== null && trend < 0;
  const isGood = invertTrend ? isNegative : isPositive;
  const isBad = invertTrend ? isPositive : isNegative;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          {suffix && (
            <span className="text-sm font-normal text-muted-foreground ml-1">
              {suffix}
            </span>
          )}
        </div>
        {trend !== null && (
          <div className="flex items-center gap-1 mt-1">
            {isPositive ? (
              <TrendingUp
                className={`size-3.5 ${isGood ? "text-emerald-500" : "text-red-500"}`}
              />
            ) : isNegative ? (
              <TrendingDown
                className={`size-3.5 ${isGood ? "text-emerald-500" : "text-red-500"}`}
              />
            ) : (
              <Minus className="size-3.5 text-muted-foreground" />
            )}
            <span
              className={`text-xs ${
                isGood
                  ? "text-emerald-500"
                  : isBad
                    ? "text-red-500"
                    : "text-muted-foreground"
              }`}
            >
              {trend > 0 ? "+" : ""}
              {trend}%
            </span>
            <span className="text-xs text-muted-foreground">{trendLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
