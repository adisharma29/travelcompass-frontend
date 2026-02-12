"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { useApp } from "@/context/AppContext";
import { getMapPadding } from "@/lib/utils";
import {
  showZones,
  hideZones,
  showRoutes,
  hideRoutes,
  filterRoutesByNames,
  hideHighlights,
  clearRouteMarkers,
  showNearbyPlacesOnMap,
  hideNearbyPlaces,
} from "./MapLayers";
import { animateLineDrawing, cancelAllAnimations } from "./MapAnimations";
import { fetchNearbyPlaces } from "@/lib/api";
import type { NearbyPlace } from "@/lib/types";

export function useMapActions() {
  const { state, dispatch, destination, experiences, mapRef, geojsonRef, mapReady } = useApp();
  const prevView = useRef(state.view);
  const prevMood = useRef(state.currentMoodSlug);
  const prevExp = useRef(state.currentExperienceCode);
  const moodMarkers = useRef<mapboxgl.Marker[]>([]);
  const nearbyCache = useRef<Map<string, NearbyPlace[]>>(new Map());

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    const geojson = geojsonRef.current;
    const view = state.view;
    const moodSlug = state.currentMoodSlug;
    const expCode = state.currentExperienceCode;

    // Clean up mood markers
    function clearMoodMarkers() {
      moodMarkers.current.forEach((m) => m.remove());
      moodMarkers.current = [];
    }

    // ── HOME VIEW ──
    if (view === "home") {
      cancelAllAnimations(map);
      clearMoodMarkers();
      clearRouteMarkers(map);
      hideHighlights(map);
      hideRoutes(map);
      showZones(map);

      // Re-enable terrain
      if (map.getSource("mapbox-dem")) {
        map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
      }

      if (destination.bounds_sw_lng != null && destination.bounds_sw_lat != null &&
          destination.bounds_ne_lng != null && destination.bounds_ne_lat != null) {
        map.fitBounds(
          [
            [destination.bounds_sw_lng, destination.bounds_sw_lat],
            [destination.bounds_ne_lng, destination.bounds_ne_lat],
          ],
          {
            padding: getMapPadding(),
            pitch: destination.default_pitch || 45,
            bearing: destination.default_bearing || -15,
            duration: 800,
          }
        );
      }
    }

    // ── MOOD VIEW ──
    else if (view === "mood" && moodSlug) {
      cancelAllAnimations(map);
      clearRouteMarkers(map);
      hideHighlights(map);
      hideZones(map);

      // Disable terrain for mood
      map.setTerrain(null);

      // Get experience names for this mood
      const mood = destination.moods.find((m) => m.slug === moodSlug);
      if (!mood || !geojson) return;

      const moodExps = experiences.filter((e) => e.mood_slug === moodSlug);
      const expNames = moodExps.map((e) => e.name);

      // Filter routes and show
      filterRoutesByNames(map, expNames);
      showRoutes(map);

      // Add point markers for non-route experiences
      clearMoodMarkers();
      if (geojson) {
        moodExps.forEach((exp) => {
          const hasRoute = geojson.features.some(
            (f) =>
              f.properties.name === exp.name &&
              f.geometry.type === "LineString"
          );
          if (hasRoute) return;

          const pointFeat = geojson.features.find(
            (f) =>
              f.properties.name === exp.name && f.geometry.type === "Point"
          );
          if (!pointFeat) return;

          const coords = pointFeat.geometry.coordinates as [number, number];
          const marker = new mapboxgl.Marker({
            color: exp.color || "#3D7A68",
            scale: 1.0,
          })
            .setLngLat(coords)
            .addTo(map);
          moodMarkers.current.push(marker);
        });
      }

      // Fit bounds to mood's experiences
      const bounds = new mapboxgl.LngLatBounds();
      expNames.forEach((name) => {
        const feature = geojson.features.find((f) => f.properties.name === name);
        if (!feature?.geometry) return;
        const geom = feature.geometry;
        if (geom.type === "LineString") {
          (geom.coordinates as number[][]).forEach((c) =>
            bounds.extend(c as [number, number])
          );
        } else if (geom.type === "Point") {
          bounds.extend(geom.coordinates as [number, number]);
        }
      });

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, {
          padding: {
            top: 80,
            bottom: Math.round(window.innerHeight * 0.5) + 20,
            left: 50,
            right: 50,
          },
          pitch: 0,
          duration: 800,
          maxZoom: 14,
        });
      }
    }

    // ── EXPERIENCE VIEW ──
    else if (view === "experience" && expCode) {
      cancelAllAnimations(map);
      clearMoodMarkers();
      hideZones(map);
      hideRoutes(map);
      hideHighlights(map);

      // Disable terrain
      map.setTerrain(null);

      const exp = experiences.find((e) => e.code === expCode);
      if (!exp || !geojson) return;

      // Find route feature
      const routeFeature = geojson.features.find(
        (f) =>
          f.properties.name === exp.name && f.geometry.type === "LineString"
      );

      if (routeFeature) {
        const coords = routeFeature.geometry.coordinates as number[][];
        const bounds = new mapboxgl.LngLatBounds();
        coords.forEach((c) => bounds.extend(c as [number, number]));

        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, {
            padding: getMapPadding(),
            pitch: 0,
            duration: 800,
            maxZoom: 16,
          });
        }

        // Set highlight filter and animate
        const nameFilter: mapboxgl.ExpressionSpecification = [
          "==",
          ["get", "name"],
          exp.name,
        ];
        if (map.getLayer("highlight-line")) {
          map.setFilter("highlight-line", nameFilter);
          map.setPaintProperty("highlight-line", "line-color", exp.color);
          map.setPaintProperty("highlight-line", "line-width", 2.5);
          map.setPaintProperty("highlight-line", "line-opacity", 1);
        }

        // Start/end markers
        const startCoord = coords[0];
        const endCoord = coords[coords.length - 1];
        const src = map.getSource("route-markers") as mapboxgl.GeoJSONSource | undefined;
        if (src) {
          src.setData({
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: { type: "start" },
                geometry: { type: "Point", coordinates: startCoord },
              },
              {
                type: "Feature",
                properties: { type: "end" },
                geometry: { type: "Point", coordinates: endCoord },
              },
            ],
          });
        }

        // Animate after delay
        setTimeout(() => {
          animateLineDrawing(map, coords, exp.color);
        }, 400);
      } else {
        // Point-based experience
        const pointFeat = geojson.features.find(
          (f) =>
            f.properties.name === exp.name && f.geometry.type === "Point"
        );
        const coord = pointFeat
          ? (pointFeat.geometry.coordinates as [number, number])
          : null;

        if (coord && coord[0] != null && coord[1] != null) {
          map.flyTo({
            center: coord,
            zoom: 16,
            pitch: 0,
            padding: getMapPadding(),
            duration: 800,
          });

          // Add location marker
          const src = map.getSource("route-markers") as mapboxgl.GeoJSONSource | undefined;
          if (src) {
            src.setData({
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: { type: "location", color: exp.color },
                  geometry: { type: "Point", coordinates: coord },
                },
              ],
            });
          }
        }
      }
    }

    prevView.current = view;
    prevMood.current = moodSlug;
    prevExp.current = expCode;
  }, [
    state.view,
    state.currentMoodSlug,
    state.currentExperienceCode,
    mapRef,
    geojsonRef,
    destination.moods,
    experiences,
    dispatch,
    mapReady,
  ]);

  // ── NEARBY PLACES ON MAP ──
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    // Only show nearby when in experience view
    if (state.view !== "experience" || !state.currentExperienceCode) {
      hideNearbyPlaces(map);
      return;
    }

    const expCode = state.currentExperienceCode;

    // Fetch and show nearby places
    async function loadAndShow() {
      if (!map) return;

      let places = nearbyCache.current.get(expCode);
      if (!places) {
        try {
          places = await fetchNearbyPlaces(destination.slug, expCode);
          nearbyCache.current.set(expCode, places);
        } catch {
          return;
        }
      }

      if (places.length > 0) {
        showNearbyPlacesOnMap(map, places, state.nearbyVisible);
      }
    }

    loadAndShow();
  }, [
    state.view,
    state.currentExperienceCode,
    state.nearbyVisible,
    mapRef,
    mapReady,
    destination.slug,
  ]);

  // ── ROUTE CLICK → OPEN EXPERIENCE ──
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    function onRouteClick(e: mapboxgl.MapboxEvent & { experienceName?: string }) {
      const name = e.experienceName;
      if (!name) return;
      const exp = experiences.find((ex) => ex.name === name);
      if (exp) {
        dispatch({ type: "OPEN_EXPERIENCE", experienceCode: exp.code });
      }
    }

    map.on("route-click", onRouteClick as (e: mapboxgl.MapboxEvent) => void);
    return () => {
      map.off("route-click", onRouteClick as (e: mapboxgl.MapboxEvent) => void);
    };
  }, [mapRef, mapReady, experiences, dispatch]);
}
