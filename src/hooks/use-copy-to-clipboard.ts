"use client";

import { useState, useCallback } from "react";

interface UseCopyToClipboardReturn {
  copy: (text: string) => Promise<boolean>;
  copied: boolean;
  error: Error | null;
  reset: () => void;
}

/**
 * Copy text to clipboard
 */
export function useCopyToClipboard(
  resetDelay: number = 2000
): UseCopyToClipboardReturn {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!navigator?.clipboard) {
        setError(new Error("Clipboard API not available"));
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setError(null);

        if (resetDelay > 0) {
          setTimeout(() => setCopied(false), resetDelay);
        }

        return true;
      } catch (err) {
        const copyError =
          err instanceof Error ? err : new Error("Failed to copy");
        setError(copyError);
        setCopied(false);
        return false;
      }
    },
    [resetDelay]
  );

  const reset = useCallback(() => {
    setCopied(false);
    setError(null);
  }, []);

  return { copy, copied, error, reset };
}
