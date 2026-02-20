"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const HEADING_FONTS = [
  "Playfair Display",
  "Cormorant Garamond",
  "Libre Baskerville",
  "Lora",
  "Merriweather",
  "EB Garamond",
  "Crimson Text",
  "DM Serif Display",
  "Fraunces",
  "Spectral",
  "Bitter",
  "Vollkorn",
  "Noto Serif",
  "Source Serif 4",
  "Bodoni Moda",
];

const BODY_FONTS = [
  "Inter",
  "DM Sans",
  "Source Sans 3",
  "Nunito Sans",
  "Work Sans",
  "Outfit",
  "Plus Jakarta Sans",
  "Instrument Sans",
  "Rubik",
  "Raleway",
  "Open Sans",
  "Lato",
  "Poppins",
  "Montserrat",
  "Cabin",
];

interface FontComboboxProps {
  value: string;
  onChange: (font: string) => void;
  variant?: "heading" | "body";
  placeholder?: string;
}

export function FontCombobox({
  value,
  onChange,
  variant = "heading",
  placeholder = "Select font...",
}: FontComboboxProps) {
  const [open, setOpen] = useState(false);
  const fonts = variant === "heading" ? HEADING_FONTS : BODY_FONTS;
  const groupLabel = variant === "heading" ? "Serif / Display" : "Sans-Serif";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search fonts..." />
          <CommandList>
            <CommandEmpty>No font found.</CommandEmpty>
            <CommandGroup heading={groupLabel}>
              {value && (
                <CommandItem
                  value="__clear__"
                  onSelect={() => {
                    onChange("");
                    setOpen(false);
                  }}
                >
                  <Check className="mr-2 h-4 w-4 opacity-0" />
                  <span className="text-muted-foreground italic">
                    Use default
                  </span>
                </CommandItem>
              )}
              {fonts.map((font) => (
                <CommandItem
                  key={font}
                  value={font}
                  onSelect={() => {
                    onChange(font);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === font ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {font}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
