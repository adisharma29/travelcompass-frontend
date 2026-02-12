"use client";

import { AccordionSection } from "@/components/site/AccordionSection";

interface ExperienceFaqsProps {
  faqs: { question: string; answer: string }[];
}

export function ExperienceFaqs({ faqs }: ExperienceFaqsProps) {
  return (
    <AccordionSection
      items={faqs.map((faq) => ({
        title: faq.question,
        content: faq.answer,
      }))}
    />
  );
}
