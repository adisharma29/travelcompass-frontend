import type { ExperienceData } from "./types";
import { theCalmCircuit } from "./the-calm-circuit";
import { rideIntoTheStillness } from "./ride-into-the-stillness";
import { sanglaHoli } from "./sangla-holi";
import { brunchInAppleOrchard } from "./brunch-in-apple-orchard";
import { sundownerInAppleOrchard } from "./sundowner-in-apple-orchard";

const experiences: Record<string, ExperienceData> = {
  "the-calm-circuit": theCalmCircuit,
  "ride-into-the-stillness": rideIntoTheStillness,
  "sangla-holi": sanglaHoli,
  "brunch-in-apple-orchard": brunchInAppleOrchard,
  "sundowner-in-apple-orchard": sundownerInAppleOrchard,
};

export function getExperience(slug: string): ExperienceData | null {
  return experiences[slug] ?? null;
}

export function getAllExperienceSlugs(): string[] {
  return Object.keys(experiences);
}

export type { ExperienceData };
