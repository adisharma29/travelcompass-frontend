"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import {
  SNAP_COLLAPSED,
  SNAP_HALF,
  SNAP_EXPANDED,
  TRANSITION_STYLE,
  DRAG_THRESHOLD,
} from "@/lib/constants";
import { isDesktop } from "@/lib/utils";

export function useBottomSheet() {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [sheetHeight, setSheetHeightState] = useState(SNAP_HALF);
  const heightRef = useRef(SNAP_HALF);

  // Drag handle state
  const handleDragging = useRef(false);
  const handleStartY = useRef(0);
  const handleStartHeight = useRef(0);

  const setSheetHeight = useCallback((percent: number) => {
    if (isDesktop()) {
      if (sheetRef.current) sheetRef.current.style.height = "";
      return;
    }
    const clamped = Math.max(SNAP_COLLAPSED, Math.min(SNAP_EXPANDED, percent));
    heightRef.current = clamped;
    setSheetHeightState(clamped);
    if (sheetRef.current) {
      sheetRef.current.style.height = `${clamped}dvh`;
    }
  }, []);

  const snapToNearest = useCallback(
    (dragStartHeight: number) => {
      if (isDesktop()) return;
      if (sheetRef.current) {
        sheetRef.current.style.transition = TRANSITION_STYLE;
      }

      const snapPoints = [SNAP_COLLAPSED, SNAP_HALF, SNAP_EXPANDED];
      const current = heightRef.current;
      const dragDelta = current - dragStartHeight;

      let target: number;
      if (Math.abs(dragDelta) > DRAG_THRESHOLD) {
        if (dragDelta > 0) {
          target =
            snapPoints.find((p) => p > dragStartHeight) || SNAP_EXPANDED;
        } else {
          target =
            [...snapPoints].reverse().find((p) => p < dragStartHeight) ||
            SNAP_COLLAPSED;
        }
      } else {
        let minDist = Infinity;
        target = SNAP_HALF;
        for (const point of snapPoints) {
          const dist = Math.abs(current - point);
          if (dist < minDist) {
            minDist = dist;
            target = point;
          }
        }
      }

      heightRef.current = target;
      setSheetHeightState(target);
      if (sheetRef.current) {
        sheetRef.current.style.height = `${target}dvh`;
      }
    },
    []
  );

  const resetSheet = useCallback(() => {
    if (sheetRef.current) {
      sheetRef.current.style.transition = TRANSITION_STYLE;
    }
    setSheetHeight(SNAP_HALF);
  }, [setSheetHeight]);

  // Handle drag events
  const onHandleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (isDesktop()) return;
      handleDragging.current = true;
      if (sheetRef.current) sheetRef.current.style.transition = "none";
      handleStartY.current = e.touches[0].clientY;
      handleStartHeight.current = heightRef.current;
    },
    []
  );

  const onHandleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isDesktop()) return;
      handleDragging.current = true;
      if (sheetRef.current) sheetRef.current.style.transition = "none";
      handleStartY.current = e.clientY;
      handleStartHeight.current = heightRef.current;
    },
    []
  );

  // Global move/up handlers
  useEffect(() => {
    function onTouchMove(e: TouchEvent) {
      if (!handleDragging.current || isDesktop()) return;
      const deltaY = handleStartY.current - e.touches[0].clientY;
      const deltaPercent = (deltaY / window.innerHeight) * 100;
      setSheetHeight(handleStartHeight.current + deltaPercent);
    }

    function onMouseMove(e: MouseEvent) {
      if (!handleDragging.current || isDesktop()) return;
      const deltaY = handleStartY.current - e.clientY;
      const deltaPercent = (deltaY / window.innerHeight) * 100;
      setSheetHeight(handleStartHeight.current + deltaPercent);
    }

    function onEnd() {
      if (handleDragging.current) {
        handleDragging.current = false;
        snapToNearest(handleStartHeight.current);
      }
    }

    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchend", onEnd);
    document.addEventListener("mouseup", onEnd);

    return () => {
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchend", onEnd);
      document.removeEventListener("mouseup", onEnd);
    };
  }, [setSheetHeight, snapToNearest]);

  // Handle resize
  useEffect(() => {
    function onResize() {
      if (isDesktop()) {
        if (sheetRef.current) sheetRef.current.style.height = "";
      } else if (!sheetRef.current?.style.height) {
        setSheetHeight(SNAP_HALF);
      }
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [setSheetHeight]);

  // Scroll-to-expand for a view element
  const setupScrollBehavior = useCallback(
    (viewEl: HTMLElement | null) => {
      if (!viewEl) return;
      const el = viewEl;

      let touchStartY = 0;
      let scrollStartH = 0;
      let isScrollDragging = false;
      let wasAtTop = false;

      function onTouchStart(e: TouchEvent) {
        if (isDesktop()) return;
        touchStartY = e.touches[0].clientY;
        scrollStartH = heightRef.current;
        wasAtTop = el.scrollTop <= 0;
        isScrollDragging = false;
      }

      function onTouchMove(e: TouchEvent) {
        if (isDesktop() || handleDragging.current) return;
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY;
        const isAtTop = el.scrollTop <= 0;

        if (wasAtTop && isAtTop && deltaY < 0) {
          e.preventDefault();
          if (!isScrollDragging) {
            isScrollDragging = true;
            if (sheetRef.current) sheetRef.current.style.transition = "none";
          }
          const deltaPercent = (deltaY / window.innerHeight) * 100;
          setSheetHeight(scrollStartH + deltaPercent);
        } else if (
          wasAtTop &&
          isAtTop &&
          deltaY > 0 &&
          heightRef.current < SNAP_EXPANDED
        ) {
          e.preventDefault();
          if (!isScrollDragging) {
            isScrollDragging = true;
            if (sheetRef.current) sheetRef.current.style.transition = "none";
          }
          const deltaPercent = (deltaY / window.innerHeight) * 100;
          setSheetHeight(scrollStartH + deltaPercent);
        }
      }

      function onTouchEnd() {
        if (isScrollDragging) {
          isScrollDragging = false;
          snapToNearest(scrollStartH);
        }
      }

      el.addEventListener("touchstart", onTouchStart, { passive: true });
      el.addEventListener("touchmove", onTouchMove, { passive: false });
      el.addEventListener("touchend", onTouchEnd);

      return () => {
        el.removeEventListener("touchstart", onTouchStart);
        el.removeEventListener("touchmove", onTouchMove);
        el.removeEventListener("touchend", onTouchEnd);
      };
    },
    [setSheetHeight, snapToNearest]
  );

  return {
    sheetRef,
    sheetHeight,
    resetSheet,
    onHandleTouchStart,
    onHandleMouseDown,
    setupScrollBehavior,
  };
}
