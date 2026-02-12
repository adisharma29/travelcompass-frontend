// Matches Django serializers

export interface Mood {
  slug: string;
  name: string;
  tagline: string;
  tip: string;
  support_line: string;
  color: string;
  card_background: string;
  illustration: string | null;
  is_special: boolean;
  sort_order: number;
  experience_codes: string[];
}

export interface Destination {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  center_lng: number;
  center_lat: number;
  default_zoom: number;
  default_pitch: number;
  default_bearing: number;
  mapbox_style: string;
  bounds_sw_lng: number | null;
  bounds_sw_lat: number | null;
  bounds_ne_lng: number | null;
  bounds_ne_lat: number | null;
  background_color: string;
  text_color: string;
  moods: Mood[];
}

export interface ExperienceImage {
  image: string;
  alt_text: string;
  sort_order: number;
}

export interface ExperienceListItem {
  code: string;
  name: string;
  display_name: string;
  tagline: string;
  experience_type: string;
  color: string;
  duration: string;
  effort: string;
  distance: string;
  mood_slug: string;
  thumbnail: string | null;
}

export interface ExperienceDetail {
  code: string;
  name: string;
  display_name: string;
  slug: string;
  tagline: string;
  experience_type: string;
  color: string;
  duration: string;
  effort: string;
  distance: string;
  best_time: string;
  about: string | string[];
  what_you_get: string | string[];
  why_we_chose_this: string;
  golden_way: string;
  breakdown: Record<string, string | string[]> | null;
  center_lng: number;
  center_lat: number;
  zoom: number;
  mood_slug: string;
  images: ExperienceImage[];
  related_experience_codes: string[];
}

export interface NearbyPlace {
  google_place_id: string;
  name: string;
  place_type: string;
  primary_type: string;
  rating: number;
  user_rating_count: number;
  address: string;
  lat: number;
  lng: number;
}

export interface GeoJSONFeature {
  type: "Feature";
  geometry: {
    type: "Point" | "LineString" | "MultiLineString" | "Polygon";
    coordinates: number[] | number[][] | number[][][];
  };
  properties: {
    name: string;
    description: string;
    feature_type: string;
    category: string;
    experience_code?: string;
    color?: string;
    fillOpacity?: number;
    poiType?: string;
    folder?: string;
    folderCategory?: string;
  };
}

export interface GeoJSONCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

// App state types
export type ViewLevel = "home" | "mood" | "experience";

export interface AppState {
  view: ViewLevel;
  currentMoodSlug: string | null;
  currentExperienceCode: string | null;
  nearbyVisible: boolean;
}

export type AppAction =
  | { type: "GO_HOME" }
  | { type: "OPEN_MOOD"; moodSlug: string }
  | { type: "OPEN_EXPERIENCE"; experienceCode: string }
  | { type: "GO_BACK" }
  | { type: "TOGGLE_NEARBY" }
  | { type: "SET_NEARBY"; visible: boolean };
