"use client";

import { useState, useCallback } from "react";

export function useGeolocation() {
  const [permissionDenied, setPermissionDenied] = useState(false);

  const handlePermissionDenied = useCallback(() => {
    setPermissionDenied(true);
  }, []);

  const dismiss = useCallback(() => {
    setPermissionDenied(false);
  }, []);

  return { permissionDenied, handlePermissionDenied, dismiss };
}
