export interface ExperienceData {
  slug: string;
  title: string;
  location: string;
  heroImage: string;
  heroMobileImage?: string;
  about: string;
  targetAudience: string[];
  specs: {
    location: string;
    distance?: string;
    price: string;
    duration: string;
    difficulty?: string;
    groupSize: string;
  };
  highlights: string[];
  itinerary: { title: string; description: string }[];
  inclusions: string[];
  exclusions: string[];
  whatToBring: string[];
  notToBring: string[];
  gallery: string[];
  faqs: { question: string; answer: string }[];
  testimonials: { text: string; author: string; location: string }[];
  relatedExperiences: {
    slug: string;
    title: string;
    location: string;
    duration: string;
    price: string;
    image: string;
  }[];
}
