import type mapboxgl from "mapbox-gl";
import type { GeoJSONCollection, NearbyPlace } from "@/lib/types";

const HIDE_FILTER: mapboxgl.ExpressionSpecification = [
  "==",
  ["get", "name"],
  "___none___",
];

export function addAllLayers(map: mapboxgl.Map, data: GeoJSONCollection) {
  // Main GeoJSON source
  map.addSource("shimla-routes", {
    type: "geojson",
    data: data as GeoJSON.GeoJSON,
    lineMetrics: true,
  });

  addZoneLayers(map);
  addRouteLayers(map);
  addHighlightLayers(map);
  addMarkerLayers(map);

  // Route click handler
  map.on("click", "routes-line", (e) => {
    if (e.features && e.features.length > 0) {
      const name = e.features[0].properties?.name;
      if (name) {
        map.fire("route-click", { experienceName: name });
      }
    }
  });

  map.on("mouseenter", "routes-line", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", "routes-line", () => {
    map.getCanvas().style.cursor = "";
  });
}

function addZoneLayers(map: mapboxgl.Map) {
  const zoneFilter: mapboxgl.ExpressionSpecification = [
    "all",
    ["==", ["get", "category"], "zone"],
    ["!=", ["get", "name"], "Heritage Zone Shimla"],
  ];

  map.addLayer({
    id: "zones-fill",
    type: "fill",
    source: "shimla-routes",
    filter: zoneFilter,
    paint: {
      "fill-color": "#D9B99A",
      "fill-opacity": 0.5,
    },
  });

  map.addLayer({
    id: "zones-outline",
    type: "line",
    source: "shimla-routes",
    filter: zoneFilter,
    paint: {
      "line-color": "#A07040",
      "line-width": [
        "case",
        [
          "any",
          ["==", ["get", "name"], "Mall Road Shimla"],
          ["==", ["get", "name"], "Jakhoo Hill"],
        ],
        2.5,
        1.5,
      ],
      "line-opacity": 0.6,
    },
  });

  map.addLayer({
    id: "zones-label",
    type: "symbol",
    source: "shimla-routes",
    filter: zoneFilter,
    layout: {
      "text-field": ["get", "name"],
      "text-font": ["DIN Pro Medium", "Arial Unicode MS Bold"],
      "text-size": [
        "case",
        [
          "any",
          ["==", ["get", "name"], "Mall Road Shimla"],
          ["==", ["get", "name"], "Jakhoo Hill"],
        ],
        13,
        11,
      ],
      "text-transform": "uppercase",
      "text-letter-spacing": 0.08,
    },
    paint: {
      "text-color": "#434431",
      "text-halo-color": "#FFFAF3",
      "text-halo-width": 2,
      "text-opacity": [
        "case",
        [
          "any",
          ["==", ["get", "name"], "Mall Road Shimla"],
          ["==", ["get", "name"], "Jakhoo Hill"],
        ],
        1,
        0.7,
      ],
    },
  });
}

function addRouteLayers(map: mapboxgl.Map) {
  map.addLayer({
    id: "routes-line",
    type: "line",
    source: "shimla-routes",
    filter: ["==", ["geometry-type"], "LineString"],
    paint: {
      "line-color": [
        "coalesce",
        ["get", "color"],
        "#434431",
      ],
      "line-width": 1.5,
      "line-opacity": 1,
    },
    layout: {
      "line-cap": "round",
      "line-join": "round",
      visibility: "none",
    },
  });
}

function addHighlightLayers(map: mapboxgl.Map) {
  map.addLayer({
    id: "highlight-line",
    type: "line",
    source: "shimla-routes",
    filter: HIDE_FILTER,
    paint: {
      "line-color": "#3D7A68",
      "line-width": 2.5,
      "line-opacity": 1,
      "line-trim-offset": [0, 1],
    },
    layout: {
      "line-cap": "butt",
      "line-join": "round",
    },
  });

  map.addLayer({
    id: "highlight-circle",
    type: "circle",
    source: "shimla-routes",
    filter: HIDE_FILTER,
    paint: {
      "circle-color": "#3D7A68",
      "circle-radius": 8,
      "circle-opacity": 0.9,
      "circle-stroke-width": 2,
      "circle-stroke-color": "#FFE9CF",
      "circle-stroke-opacity": 1,
    },
  });
}

function addMarkerLayers(map: mapboxgl.Map) {
  // Route markers source
  map.addSource("route-markers", {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] },
  });

  // Load flag images
  loadFlagImage(
    map,
    "start-flag",
    `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <rect x="6" y="4" width="3" height="26" rx="1.5" fill="#434431"/>
      <path d="M9 4 L26 4 L22 11 L26 18 L9 18 Z" fill="#22C55E"/>
      <path d="M9 4 L26 4 L22 11 L26 18 L9 18 Z" fill="none" stroke="#1a9d4a" stroke-width="1"/>
    </svg>`
  );

  loadFlagImage(
    map,
    "end-flag",
    `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <rect x="6" y="4" width="3" height="26" rx="1.5" fill="#434431"/>
      <path d="M9 4 L26 4 L22 11 L26 18 L9 18 Z" fill="#EF4444"/>
      <rect x="9" y="4" width="4.25" height="3.5" fill="#fff"/>
      <rect x="17.5" y="4" width="4.25" height="3.5" fill="#fff"/>
      <rect x="13.25" y="7.5" width="4.25" height="3.5" fill="#fff"/>
      <rect x="9" y="11" width="4.25" height="3.5" fill="#fff"/>
      <rect x="17.5" y="11" width="4.25" height="3.5" fill="#fff"/>
      <rect x="13.25" y="14.5" width="4.25" height="3.5" fill="#fff"/>
    </svg>`
  );

  // Start marker
  map.addLayer({
    id: "start-marker",
    type: "symbol",
    source: "route-markers",
    filter: ["==", ["get", "type"], "start"],
    layout: {
      "icon-image": "start-flag",
      "icon-size": 1,
      "icon-anchor": "bottom-left",
      "icon-allow-overlap": true,
    },
  });

  // End marker
  map.addLayer({
    id: "end-marker",
    type: "symbol",
    source: "route-markers",
    filter: ["==", ["get", "type"], "end"],
    layout: {
      "icon-image": "end-flag",
      "icon-size": 1,
      "icon-anchor": "bottom-left",
      "icon-allow-overlap": true,
    },
  });

  // Walking marker
  map.addLayer({
    id: "walking-marker",
    type: "circle",
    source: "route-markers",
    filter: ["==", ["get", "type"], "walking"],
    paint: {
      "circle-radius": 8,
      "circle-color": "#FFFFFF",
      "circle-stroke-width": 4,
      "circle-stroke-color": ["get", "color"],
    },
  });

  // Location marker for point-based experiences
  map.addLayer({
    id: "location-marker",
    type: "circle",
    source: "route-markers",
    filter: ["==", ["get", "type"], "location"],
    paint: {
      "circle-radius": 18,
      "circle-color": ["coalesce", ["get", "color"], "#7C3AED"],
      "circle-stroke-width": 4,
      "circle-stroke-color": "#FFFFFF",
      "circle-opacity": 1,
    },
  });

  // Direction dots
  map.addSource("direction-dots", {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] },
  });

  map.addLayer({
    id: "direction-dots",
    type: "circle",
    source: "direction-dots",
    paint: {
      "circle-radius": 4,
      "circle-color": ["get", "color"],
      "circle-opacity": ["get", "opacity"],
    },
  });
}

function loadFlagImage(map: mapboxgl.Map, name: string, svg: string) {
  const img = new Image(32, 32);
  img.onload = () => {
    if (!map.hasImage(name)) {
      map.addImage(name, img);
    }
  };
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

// ── Public layer control functions ──

export function showZones(map: mapboxgl.Map) {
  if (map.getLayer("zones-fill"))
    map.setLayoutProperty("zones-fill", "visibility", "visible");
  if (map.getLayer("zones-outline"))
    map.setLayoutProperty("zones-outline", "visibility", "visible");
  if (map.getLayer("zones-label"))
    map.setLayoutProperty("zones-label", "visibility", "visible");
}

export function hideZones(map: mapboxgl.Map) {
  if (map.getLayer("zones-fill"))
    map.setLayoutProperty("zones-fill", "visibility", "none");
  if (map.getLayer("zones-outline"))
    map.setLayoutProperty("zones-outline", "visibility", "none");
  if (map.getLayer("zones-label"))
    map.setLayoutProperty("zones-label", "visibility", "none");
}

export function showRoutes(map: mapboxgl.Map) {
  if (map.getLayer("routes-line"))
    map.setLayoutProperty("routes-line", "visibility", "visible");
}

export function hideRoutes(map: mapboxgl.Map) {
  if (map.getLayer("routes-line"))
    map.setLayoutProperty("routes-line", "visibility", "none");
}

export function filterRoutesByNames(map: mapboxgl.Map, names: string[]) {
  const nameFilter: mapboxgl.ExpressionSpecification = [
    "in",
    ["get", "name"],
    ["literal", names],
  ];
  if (map.getLayer("routes-line")) {
    map.setFilter("routes-line", nameFilter);
  }
}

export function resetRouteFilter(map: mapboxgl.Map) {
  if (map.getLayer("routes-line")) {
    map.setFilter("routes-line", ["==", ["geometry-type"], "LineString"]);
  }
}

export function hideHighlights(map: mapboxgl.Map) {
  if (map.getLayer("highlight-line"))
    map.setFilter("highlight-line", HIDE_FILTER);
  if (map.getLayer("highlight-circle"))
    map.setFilter("highlight-circle", HIDE_FILTER);
}

export function clearRouteMarkers(map: mapboxgl.Map) {
  const src = map.getSource("route-markers") as mapboxgl.GeoJSONSource | undefined;
  if (src) {
    src.setData({ type: "FeatureCollection", features: [] });
  }
}

export function clearDirectionDots(map: mapboxgl.Map) {
  const src = map.getSource("direction-dots") as mapboxgl.GeoJSONSource | undefined;
  if (src) {
    src.setData({ type: "FeatureCollection", features: [] });
  }
}

// ── Nearby Places ──

const NEARBY_TOP_LIMIT = 5;

export function showNearbyPlacesOnMap(
  map: mapboxgl.Map,
  places: NearbyPlace[],
  expanded: boolean
) {
  const restaurants = places
    .filter((p) => p.place_type === "restaurant")
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));
  const attractions = places
    .filter((p) => p.place_type !== "restaurant")
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));

  const topIds = new Set([
    ...restaurants.slice(0, NEARBY_TOP_LIMIT).map((p) => p.google_place_id),
    ...attractions.slice(0, NEARBY_TOP_LIMIT).map((p) => p.google_place_id),
  ]);

  const visiblePlaces = expanded
    ? places
    : places.filter((p) => topIds.has(p.google_place_id));

  const geojson: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: visiblePlaces.map((p) => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [p.lng, p.lat] },
      properties: {
        name: p.name,
        type: p.place_type,
        rating: p.rating || 0,
        primaryType: (p.primary_type || "").replace(/_/g, " "),
        tier: topIds.has(p.google_place_id) ? "top" : "rest",
      },
    })),
  };

  if (map.getSource("nearby-places")) {
    (map.getSource("nearby-places") as mapboxgl.GeoJSONSource).setData(geojson);
  } else {
    map.addSource("nearby-places", { type: "geojson", data: geojson });

    // Top places — always visible with maki icons + labels
    map.addLayer({
      id: "nearby-top",
      type: "symbol",
      source: "nearby-places",
      filter: ["==", ["get", "tier"], "top"],
      layout: {
        "icon-image": [
          "match",
          ["get", "type"],
          "restaurant",
          "restaurant",
          "attraction",
        ],
        "icon-size": 1,
        "icon-allow-overlap": true,
        "text-field": ["get", "name"],
        "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
        "text-size": 11,
        "text-anchor": "top",
        "text-offset": [0, 0.8],
        "text-max-width": 8,
        "text-allow-overlap": false,
        "text-optional": true,
      },
      paint: {
        "text-color": "#434431",
        "text-halo-color": "#fff",
        "text-halo-width": 1.5,
      },
    });

    // Rest — visible when expanded, with maki icons + labels
    map.addLayer({
      id: "nearby-rest",
      type: "symbol",
      source: "nearby-places",
      filter: ["==", ["get", "tier"], "rest"],
      layout: {
        "icon-image": [
          "match",
          ["get", "type"],
          "restaurant",
          "restaurant",
          "attraction",
        ],
        "icon-size": 0.85,
        "icon-allow-overlap": true,
        "text-field": ["get", "name"],
        "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
        "text-size": 10,
        "text-anchor": "top",
        "text-offset": [0, 0.7],
        "text-max-width": 7,
        "text-allow-overlap": false,
        "text-optional": true,
      },
      paint: {
        "text-color": "#5c5c44",
        "text-halo-color": "#fff",
        "text-halo-width": 1.5,
      },
    });

    // Cursor and click handlers for nearby places
    ["nearby-top", "nearby-rest"].forEach((layer) => {
      map.on("mouseenter", layer, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", layer, () => {
        map.getCanvas().style.cursor = "";
      });
      map.on("click", layer, (e) => {
        if (!e.features?.length) return;
        const f = e.features[0];
        const coords = (f.geometry as GeoJSON.Point).coordinates as [number, number];
        const name = f.properties?.name || "";
        map.flyTo({ center: coords, zoom: 17, duration: 600 });
      });
    });
  }
}

export function hideNearbyPlaces(map: mapboxgl.Map) {
  if (map.getSource("nearby-places")) {
    (map.getSource("nearby-places") as mapboxgl.GeoJSONSource).setData({
      type: "FeatureCollection",
      features: [],
    });
  }
}
