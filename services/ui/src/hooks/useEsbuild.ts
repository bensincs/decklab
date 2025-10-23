import { useCallback } from "react";
import * as esbuild from "esbuild-wasm";

const DEFAULT_WASM_URL = "https://unpkg.com/esbuild-wasm@0.23.1/esbuild.wasm";

let esbuildInitPromise: Promise<void> | null = null;
let esbuildReady = false;

/**
 * Small helper hook that returns an initializer which lazily boots esbuild-wasm once.
 * Subsequent callers reuse the same initialization promise so we don't hit the
 * "initialize more than once" error when React remounts components.
 */
export function useEsbuild(wasmURL: string = DEFAULT_WASM_URL) {
  const ensureEsbuild = useCallback(async () => {
    if (esbuildReady) {
      return;
    }

    if (!esbuildInitPromise) {
      esbuildInitPromise = esbuild
        .initialize({
          wasmURL,
          worker: true,
        })
        .then(() => {
          esbuildReady = true;
        })
        .catch((error) => {
          esbuildInitPromise = null;
          throw error;
        });
    }

    await esbuildInitPromise;
  }, [wasmURL]);

  return { ensureEsbuild };
}
