import { useEffect } from "react";

/**
 * Preload and decode images in the background to avoid jank when a section comes into view.
 * No UI changes, just performance.
 */
export function usePreloadImages(urls: string[] = [], timeoutMs = 2500) {
  useEffect(() => {
    if (!urls || urls.length === 0) return;

    const unique = Array.from(new Set(urls.filter(Boolean)));
    let cancelled = false;
    let timer: number | undefined;

    // Kick off preloading in an idle frame if available
    const start = () => {
      unique.forEach((url) => {
        try {
          const img = new Image();
          // Hint async decode to the browser
          // @ts-ignore - not all browsers expose these as settable properties
          img.decoding = "async";
          // @ts-ignore
          img.loading = "eager";
          img.src = url as string;
          if (img.decode) {
            img.decode().catch(() => {});
          }
        } catch {
          // Ignore individual image errors
        }
      });
    };

    const w = window as any;
    if (typeof w.requestIdleCallback === "function") {
      const idleId = w.requestIdleCallback(() => !cancelled && start(), { timeout: 500 });
      timer = window.setTimeout(() => {
        // Fallback if idle never fires
        if (w.cancelIdleCallback) w.cancelIdleCallback(idleId);
        if (!cancelled) start();
      }, 600);
    } else {
      // Fallback
      timer = window.setTimeout(() => !cancelled && start(), 0);
    }

    // Hard timeout to avoid keeping the page busy
    const hardTimeout = window.setTimeout(() => {
      // nothing to clean here – images are GC'd when not referenced further
    }, timeoutMs);

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
      window.clearTimeout(hardTimeout);
    };
    // We only care about the list content, not reference equality
  }, [JSON.stringify(urls), timeoutMs]);
}
