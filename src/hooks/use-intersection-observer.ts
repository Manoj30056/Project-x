"use client";

import { useState, useEffect, useRef, type RefObject } from "react";

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

/**
 * Observe element intersection with viewport
 */
export function useIntersectionObserver<T extends Element>(
  options: UseIntersectionObserverOptions = {}
): [RefObject<T | null>, boolean, IntersectionObserverEntry | null] {
  const {
    threshold = 0,
    root = null,
    rootMargin = "0px",
    freezeOnceVisible = false,
  } = options;

  const elementRef = useRef<T | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const frozen = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    if (frozen.current && freezeOnceVisible) return;

    const observer = new IntersectionObserver(
      ([observerEntry]) => {
        const isVisible = observerEntry.isIntersecting;
        setIsIntersecting(isVisible);
        setEntry(observerEntry);

        if (isVisible && freezeOnceVisible) {
          frozen.current = true;
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, freezeOnceVisible]);

  return [elementRef, isIntersecting, entry];
}

/**
 * Simple visibility check
 */
export function useIsVisible<T extends Element>(
  options: Omit<UseIntersectionObserverOptions, "freezeOnceVisible"> & {
    once?: boolean;
  } = {}
): [RefObject<T | null>, boolean] {
  const { once = false, ...observerOptions } = options;
  const [ref, isIntersecting] = useIntersectionObserver<T>({
    ...observerOptions,
    freezeOnceVisible: once,
  });

  return [ref, isIntersecting];
}
