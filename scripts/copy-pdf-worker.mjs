#!/usr/bin/env node
import { existsSync, mkdirSync, copyFileSync } from "fs";
import { dirname } from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

function resolveWorker() {
  const candidates = [
    // Preferred UMD/min build
    "pdfjs-dist/build/pdf.worker.min.js",
    // Legacy build (some versions expose both)
    "pdfjs-dist/legacy/build/pdf.worker.min.js",
    // Non-minified fallbacks
    "pdfjs-dist/build/pdf.worker.js",
    "pdfjs-dist/legacy/build/pdf.worker.js",
  ];
  for (const spec of candidates) {
    try {
      const p = require.resolve(spec);
      if (existsSync(p)) return p;
    } catch {}
  }
  return null;
}

const out = "public/pdf.worker.min.js";
mkdirSync(dirname(out), { recursive: true });

const src = resolveWorker();
if (!src) {
  console.warn(
    "[copy-pdf-worker] Could not locate pdf.worker.* in pdfjs-dist. Skipping."
  );
  process.exit(0);
}
copyFileSync(src, out);
console.log(`[copy-pdf-worker] Copied from ${src} -> ${out}`);
