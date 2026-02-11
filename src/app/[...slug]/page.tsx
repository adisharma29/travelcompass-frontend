import type { Metadata } from "next";
import { fetchDestination, fetchExperiences } from "@/lib/api";
import { ClientShell } from "@/components/ClientShell";
import { slugify } from "@/lib/utils";
import type { AppState } from "@/lib/types";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destinationSlug = slug[0];

  try {
    const [destination, experiences] = await Promise.all([
      fetchDestination(destinationSlug),
      fetchExperiences(destinationSlug),
    ]);

    const destName = destination.name;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fieldguide.travel";
    const canonicalPath = `/${slug.join("/")}`;

    // Mood page: /shimla/mood/calm-nature
    if (slug[1] === "mood" && slug[2]) {
      const mood = destination.moods.find((m) => m.slug === slug[2]);
      if (mood) {
        const title = `${mood.name} in ${destName}`;
        const description = mood.tagline || `${mood.name} experiences in ${destName}`;
        return {
          title,
          description,
          alternates: { canonical: canonicalPath },
          openGraph: {
            title: `${title} | Field Guide`,
            description,
            url: `${baseUrl}${canonicalPath}`,
            siteName: "Field Guide",
            type: "website",
          },
          twitter: {
            card: "summary",
            title: `${title} | Field Guide`,
            description,
          },
        };
      }
    }

    // Experience page: /shimla/experience/glen-hiking-trail-1
    if (slug[1] === "experience" && slug[2]) {
      const exp = experiences.find((e) => slugify(e.name) === slug[2]);
      if (exp) {
        const title = `${exp.display_name || exp.name} — ${destName}`;
        const description = exp.tagline || `Experience ${exp.name} in ${destName}`;
        const ogImage = exp.thumbnail || undefined;
        return {
          title,
          description,
          alternates: { canonical: canonicalPath },
          openGraph: {
            title: `${title} | Field Guide`,
            description,
            url: `${baseUrl}${canonicalPath}`,
            siteName: "Field Guide",
            type: "article",
            ...(ogImage && { images: [{ url: ogImage }] }),
          },
          twitter: {
            card: ogImage ? "summary_large_image" : "summary",
            title: `${title} | Field Guide`,
            description,
            ...(ogImage && { images: [ogImage] }),
          },
        };
      }
    }

    // Home page: /shimla
    const title = `Field Guide to ${destName}`;
    const description = destination.tagline || `Curated experiences in ${destName}. Not places to see — ways to spend time.`;
    return {
      title,
      description,
      alternates: { canonical: canonicalPath },
      openGraph: {
        title: `${title} | Field Guide`,
        description,
        url: `${baseUrl}${canonicalPath}`,
        siteName: "Field Guide",
        type: "website",
      },
      twitter: {
        card: "summary",
        title: `${title} | Field Guide`,
        description,
      },
    };
  } catch {
    return { title: "Field Guide" };
  }
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const destinationSlug = slug[0];
  const [destination, experiences] = await Promise.all([
    fetchDestination(destinationSlug),
    fetchExperiences(destinationSlug),
  ]);

  // Resolve initial view state from URL segments
  let initialState: AppState = {
    view: "home",
    currentMoodSlug: null,
    currentExperienceCode: null,
    nearbyVisible: false,
  };

  if (slug[1] === "mood" && slug[2]) {
    const moodSlug = slug[2];
    const mood = destination.moods.find((m) => m.slug === moodSlug);
    if (mood) {
      initialState = {
        ...initialState,
        view: "mood",
        currentMoodSlug: moodSlug,
      };
    }
  } else if (slug[1] === "experience" && slug[2]) {
    const expSlug = slug[2];
    const exp = experiences.find((e) => slugify(e.name) === expSlug);
    if (exp) {
      initialState = {
        ...initialState,
        view: "experience",
        currentMoodSlug: exp.mood_slug,
        currentExperienceCode: exp.code,
      };
    }
  }

  return (
    <ClientShell
      destination={destination}
      experiences={experiences}
      initialState={initialState}
    />
  );
}
