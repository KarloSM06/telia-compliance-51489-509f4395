import { useEffect, useState, useMemo } from "react";

type Options = { concurrency?: number };

function runIdle(cb: () => void) {
  if (typeof (window as any).requestIdleCallback === "function") {
    (window as any).requestIdleCallback(cb, { timeout: 2000 });
  } else {
    setTimeout(cb, 0);
  }
}

export function useImagePreloader(urls: string[], options: Options = {}) {
  useEffect(() => {
    const unique = Array.from(new Set(urls.filter(Boolean)));
    if (unique.length === 0) return;

    let cancelled = false;
    const concurrency = Math.max(1, Math.min(options.concurrency ?? 2, 4));
    let index = 0;
    let active = 0;

    const startNext = () => {
      if (cancelled) return;
      while (active < concurrency && index < unique.length) {
        const url = unique[index++];
        active++;
        runIdle(async () => {
          try {
            const img = new Image();
            img.src = url!;
            if (img.decode) {
              await img.decode().catch(() => {});
            }
          } catch {}
          finally {
            active--;
            if (!cancelled) startNext();
          }
        });
      }
    };

    startNext();
    return () => { cancelled = true; };
  }, [urls, options.concurrency]);
}

export function useImagesReady(urls: string[], options: { concurrency?: number; timeoutMs?: number } = {}) {
  const { concurrency = 2, timeoutMs = 2500 } = options;
  const [ready, setReady] = useState(false);
  const total = useMemo(() => Array.from(new Set(urls.filter(Boolean))).length, [urls]);

  useEffect(() => {
    if (total === 0) { setReady(true); return; }
    let cancelled = false;
    let loaded = 0;
    let timer: any;
    const unique = Array.from(new Set(urls.filter(Boolean)));
    const limit = Math.max(1, Math.min(concurrency, 4));
    let index = 0;
    let active = 0;

    const startNext = () => {
      if (cancelled) return;
      while (active < limit && index < unique.length) {
        const url = unique[index++];
        active++;
        runIdle(async () => {
          try {
            const img = new Image();
            img.src = url!;
            if (img.decode) await img.decode().catch(() => {});
          } catch {}
          finally {
            active--;
            loaded++;
            if (!cancelled) {
              if (loaded >= unique.length) setReady(true);
              else startNext();
            }
          }
        });
      }
    };

    startNext();
    timer = setTimeout(() => { if (!cancelled) setReady(true); }, timeoutMs);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [total, concurrency, timeoutMs]);

  return { ready };
}
