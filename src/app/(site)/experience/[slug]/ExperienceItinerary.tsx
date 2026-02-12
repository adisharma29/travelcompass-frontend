"use client";

import { AccordionSection } from "@/components/site/AccordionSection";

interface ExperienceItineraryProps {
  items: { title: string; description: string }[];
}

export function ExperienceItinerary({ items }: ExperienceItineraryProps) {
  return (
    <AccordionSection
      items={items.map((item) => ({
        title: item.title,
        content: item.description,
      }))}
    />
  );
}
