"use client";

import { useGuest } from "@/context/GuestContext";
import { MessageCircle } from "lucide-react";

export function WhatsAppFAB() {
  const { hotel } = useGuest();

  const cleanNumber = (hotel.whatsapp_number || "").replace(/\D/g, "");

  // Need a truthy raw value AND at least one digit after stripping
  if (!cleanNumber) return null;

  return (
    <a
      href={`https://wa.me/${cleanNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed z-30 bottom-20 right-4 md:bottom-6 md:right-6 flex items-center justify-center size-14 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2"
      style={{ backgroundColor: "#25D366" }}
    >
      <MessageCircle className="size-6 text-white" />
    </a>
  );
}
