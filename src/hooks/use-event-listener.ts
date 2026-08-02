"use client";

import { useEffect, useRef } from "react";

type EventMap = WindowEventMap & DocumentEventMap & HTMLElementEventMap;

/**
 * Add event listener to window, document, or element
 */
export function useEventListener<K extends keyof EventMap>(
  eventName: K,
  handler: (event: EventMap[K]) => void,
  element?: HTMLElement | Window | Document | null,
  options?: boolean | AddEventListenerOptions
): void {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const targetElement = element ?? window;
    
    if (!targetElement?.addEventListener) return;

    const eventListener = (event: Event) => {
      savedHandler.current(event as EventMap[K]);
    };

    targetElement.addEventListener(eventName, eventListener, options);

    return () => {
      targetElement.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, element, options]);
}

/**
 * Listen for keyboard shortcuts
 */
export function useKeyboardShortcut(
  keys: string[],
  callback: (event: KeyboardEvent) => void,
  options: {
    ctrlKey?: boolean;
    metaKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    preventDefault?: boolean;
  } = {}
): void {
  const {
    ctrlKey = false,
    metaKey = false,
    shiftKey = false,
    altKey = false,
    preventDefault = true,
  } = options;

  useEventListener("keydown", (event) => {
    const pressedKey = event.key.toLowerCase();
    const matchesKey = keys.some((key) => key.toLowerCase() === pressedKey);
    const matchesCtrl = ctrlKey ? event.ctrlKey : true;
    const matchesMeta = metaKey ? event.metaKey : true;
    const matchesShift = shiftKey ? event.shiftKey : true;
    const matchesAlt = altKey ? event.altKey : true;

    if (matchesKey && matchesCtrl && matchesMeta && matchesShift && matchesAlt) {
      if (preventDefault) {
        event.preventDefault();
      }
      callback(event);
    }
  });
}
