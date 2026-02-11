import type mapboxgl from "mapbox-gl";

// Store active animation frame IDs
let lineDrawAnimId: number | null = null;
let directionDotsAnimId: number | null = null;

export function interpolateAlongLine(
  coordinates: number[][],
  fraction: number
): number[] {
  if (fraction <= 0) return coordinates[0];
  if (fraction >= 1) return coordinates[coordinates.length - 1];

  let totalDistance = 0;
  const distances = [0];
  for (let i = 1; i < coordinates.length; i++) {
    const dx = coordinates[i][0] - coordinates[i - 1][0];
    const dy = coordinates[i][1] - coordinates[i - 1][1];
    totalDistance += Math.sqrt(dx * dx + dy * dy);
    distances.push(totalDistance);
  }

  const targetDistance = fraction * totalDistance;

  for (let i = 1; i < distances.length; i++) {
    if (distances[i] >= targetDistance) {
      const segStart = distances[i - 1];
      const segLen = distances[i] - segStart;
      const segFrac = segLen > 0 ? (targetDistance - segStart) / segLen : 0;
      return [
        coordinates[i - 1][0] +
          (coordinates[i][0] - coordinates[i - 1][0]) * segFrac,
        coordinates[i - 1][1] +
          (coordinates[i][1] - coordinates[i - 1][1]) * segFrac,
      ];
    }
  }
  return coordinates[coordinates.length - 1];
}

export function animateLineDrawing(
  map: mapboxgl.Map,
  routeCoords: number[][] | null,
  routeColor: string
) {
  if (!map.getLayer("highlight-line")) return;

  cancelLineDrawing();

  const duration = routeCoords
    ? Math.min(8000, Math.max(2000, routeCoords.length * 30))
    : 2400;

  // Start hidden
  map.setPaintProperty("highlight-line", "line-trim-offset", [0, 1]);

  const startTime = performance.now();

  function animate() {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    map.setPaintProperty("highlight-line", "line-trim-offset", [eased, 1]);

    // Update walking marker
    if (routeCoords && map.getSource("route-markers") && progress < 1) {
      const walkingPos = interpolateAlongLine(routeCoords, eased);
      const startCoord = routeCoords[0];
      const endCoord = routeCoords[routeCoords.length - 1];

      (map.getSource("route-markers") as mapboxgl.GeoJSONSource).setData({
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
          {
            type: "Feature",
            properties: { type: "walking", color: routeColor },
            geometry: { type: "Point", coordinates: walkingPos },
          },
        ],
      });
    }

    if (progress < 1) {
      lineDrawAnimId = requestAnimationFrame(animate);
    } else {
      // Done - show start/end only, start direction dots
      if (routeCoords && map.getSource("route-markers")) {
        (map.getSource("route-markers") as mapboxgl.GeoJSONSource).setData({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: { type: "start" },
              geometry: { type: "Point", coordinates: routeCoords[0] },
            },
            {
              type: "Feature",
              properties: { type: "end" },
              geometry: {
                type: "Point",
                coordinates: routeCoords[routeCoords.length - 1],
              },
            },
          ],
        });
      }
      startDirectionDots(map, routeCoords, routeColor);
      lineDrawAnimId = null;
    }
  }

  lineDrawAnimId = requestAnimationFrame(animate);
}

function startDirectionDots(
  map: mapboxgl.Map,
  routeCoords: number[][] | null,
  routeColor: string
) {
  if (!routeCoords || !map.getSource("direction-dots")) return;
  stopDirectionDots(map);

  const dotCount = 6;
  const cycleDuration = 8000;
  const startTime = performance.now();

  function animateDots() {
    const elapsed = performance.now() - startTime;
    const cycleProgress = (elapsed % cycleDuration) / cycleDuration;

    const features: GeoJSON.Feature[] = [];
    for (let i = 0; i < dotCount; i++) {
      const dotProgress = (cycleProgress + i / dotCount) % 1;
      const pos = interpolateAlongLine(routeCoords!, dotProgress);

      let opacity = 0.8;
      if (dotProgress < 0.1) opacity = dotProgress * 8;
      else if (dotProgress > 0.9) opacity = (1 - dotProgress) * 8;

      features.push({
        type: "Feature",
        properties: { color: routeColor, opacity },
        geometry: { type: "Point", coordinates: pos },
      });
    }

    (map.getSource("direction-dots") as mapboxgl.GeoJSONSource).setData({
      type: "FeatureCollection",
      features,
    });

    directionDotsAnimId = requestAnimationFrame(animateDots);
  }

  directionDotsAnimId = requestAnimationFrame(animateDots);
}

export function stopDirectionDots(map: mapboxgl.Map) {
  if (directionDotsAnimId) {
    cancelAnimationFrame(directionDotsAnimId);
    directionDotsAnimId = null;
  }
  const src = map.getSource("direction-dots") as mapboxgl.GeoJSONSource | undefined;
  if (src) {
    src.setData({ type: "FeatureCollection", features: [] });
  }
}

export function cancelLineDrawing() {
  if (lineDrawAnimId) {
    cancelAnimationFrame(lineDrawAnimId);
    lineDrawAnimId = null;
  }
}

export function cancelAllAnimations(map: mapboxgl.Map) {
  cancelLineDrawing();
  stopDirectionDots(map);
}
