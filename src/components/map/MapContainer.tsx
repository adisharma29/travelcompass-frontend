"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useApp } from "@/context/AppContext";
import { MAPBOX_TOKEN } from "@/lib/constants";
import { fetchGeoJSON } from "@/lib/api";
import { getMapPadding, isDesktop } from "@/lib/utils";
import { addAllLayers } from "./MapLayers";
import { useMapActions } from "./useMapActions";
import { LocationBanner } from "../shared/LocationBanner";
import { useGeolocation } from "@/hooks/useGeolocation";

mapboxgl.accessToken = MAPBOX_TOKEN;

export function MapContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const { destination, mapRef, setGeojson } = useApp();
  const { permissionDenied, handlePermissionDenied, dismiss } = useGeolocation();

  useEffect(() => {
    if (!containerRef.current || initialized.current) return;
    initialized.current = true;

    const style =
      destination.mapbox_style ||
      process.env.NEXT_PUBLIC_MAPBOX_STYLE ||
      "mapbox://styles/adisharma29/cmksp8la3000c01sh8l085gaf";

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style,
      center: [destination.center_lng, destination.center_lat],
      zoom: destination.default_zoom || 13,
      pitch: destination.default_pitch || 45,
      bearing: destination.default_bearing || -15,
      antialias: true,
    });

    mapRef.current = map;

    map.on("load", () => {
      // 3D terrain
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

      // Initial fitBounds to destination area
      map.fitBounds(
        [
          [77.168, 31.097],
          [77.188, 31.108],
        ],
        {
          padding: getMapPadding(),
          duration: 0,
          pitch: 45,
          bearing: -15,
        }
      );

      // Geolocation control
      const geoCtrl = new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true,
      });

      geoCtrl.on("error", (e: { code: number }) => {
        if (e.code === 1) handlePermissionDenied();
      });

      map.addControl(geoCtrl, "top-left");

      // Fetch and add GeoJSON layers
      fetchGeoJSON(destination.slug)
        .then((data) => {
          setGeojson(data);
          addAllLayers(map, data);
        })
        .catch((err) => console.error("GeoJSON load error:", err));
    });

    // Resize on window resize
    const handleResize = () => map.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      map.remove();
      mapRef.current = null;
      initialized.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Map reactions to state changes
  useMapActions();

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-14 z-[1] lg:left-[420px] lg:bottom-0">
        <div ref={containerRef} className="w-full h-full" />
      </div>
      {permissionDenied && <LocationBanner onDismiss={dismiss} />}
    </>
  );
}
