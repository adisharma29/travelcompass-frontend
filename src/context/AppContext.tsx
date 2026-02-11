"use client";

import {
  createContext,
  useContext,
  useReducer,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import type mapboxgl from "mapbox-gl";
import type {
  AppState,
  AppAction,
  Destination,
  ExperienceListItem,
  ExperienceDetail,
  GeoJSONCollection,
} from "@/lib/types";

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "GO_HOME":
      return {
        ...state,
        view: "home",
        currentMoodSlug: null,
        currentExperienceCode: null,
        nearbyVisible: false,
      };
    case "OPEN_MOOD":
      return {
        ...state,
        view: "mood",
        currentMoodSlug: action.moodSlug,
        currentExperienceCode: null,
        nearbyVisible: false,
      };
    case "OPEN_EXPERIENCE":
      return {
        ...state,
        view: "experience",
        currentExperienceCode: action.experienceCode,
        nearbyVisible: false,
      };
    case "GO_BACK":
      if (state.view === "experience") {
        return {
          ...state,
          view: "mood",
          currentExperienceCode: null,
          nearbyVisible: false,
        };
      }
      if (state.view === "mood") {
        return {
          ...state,
          view: "home",
          currentMoodSlug: null,
          nearbyVisible: false,
        };
      }
      return state;
    case "TOGGLE_NEARBY":
      return { ...state, nearbyVisible: !state.nearbyVisible };
    case "SET_NEARBY":
      return { ...state, nearbyVisible: action.visible };
    default:
      return state;
  }
}

const initialState: AppState = {
  view: "home",
  currentMoodSlug: null,
  currentExperienceCode: null,
  nearbyVisible: false,
};

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  destination: Destination;
  experiences: ExperienceListItem[];
  mapRef: React.RefObject<mapboxgl.Map | null>;
  geojsonRef: React.RefObject<GeoJSONCollection | null>;
  detailCache: React.RefObject<Map<string, ExperienceDetail>>;
  setGeojson: (data: GeoJSONCollection) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({
  children,
  destination,
  experiences,
}: {
  children: ReactNode;
  destination: Destination;
  experiences: ExperienceListItem[];
}) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const geojsonRef = useRef<GeoJSONCollection | null>(null);
  const detailCache = useRef<Map<string, ExperienceDetail>>(new Map());

  const setGeojson = useCallback((data: GeoJSONCollection) => {
    geojsonRef.current = data;
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        destination,
        experiences,
        mapRef,
        geojsonRef,
        detailCache,
        setGeojson,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
