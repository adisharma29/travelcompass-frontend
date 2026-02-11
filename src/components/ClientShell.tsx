"use client";

import { AppProvider } from "@/context/AppContext";
import { MapContainer } from "@/components/map/MapContainer";
import { BottomSheet } from "@/components/sheet/BottomSheet";
import { TabBar } from "@/components/shared/TabBar";
import { useHashRouter } from "@/hooks/useHashRouter";
import type { Destination, ExperienceListItem } from "@/lib/types";

function AppShell() {
  useHashRouter();

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <MapContainer />
      <BottomSheet />
      <TabBar />
    </div>
  );
}

export function ClientShell({
  destination,
  experiences,
}: {
  destination: Destination;
  experiences: ExperienceListItem[];
}) {
  return (
    <AppProvider destination={destination} experiences={experiences}>
      <AppShell />
    </AppProvider>
  );
}
