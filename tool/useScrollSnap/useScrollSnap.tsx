"use client"
import { useEffect, useRef } from "react";
import createScrollSnap, { ScrollSnapSettings } from "scroll-snap";

type Callback = () => void;

export default function useScrollSnap(
  ref: React.RefObject<HTMLElement>,
  settings: ScrollSnapSettings,
  callback: Callback
): [() => void, () => void] {
  const bindRef = useRef<() => void>(() => {});
  const unbindRef = useRef<() => void>(() => {});

  useEffect(() => {
    const element = ref.current;

    if (element) {
      const { bind, unbind } = createScrollSnap(element, settings, callback);
      bindRef.current = bind;
      unbindRef.current = unbind;
    }

    return () => {
      if (unbindRef.current) {
        unbindRef.current();
      }
    };
  }, [ref, settings, callback]);

  return [bindRef.current, unbindRef.current];
}
