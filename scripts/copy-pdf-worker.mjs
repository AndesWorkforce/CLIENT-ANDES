#!/usr/bin/env node
import { existsSync, mkdirSync, copyFileSync } from "fs";
import { dirname, join } from "path";

const candidates = [
  // pnpm hoisted
  "node_modules/.pnpm/pdfjs-dist@4.8.69/node_modules/pdfjs-dist/build/pdf.worker.min.js",
  // npm/yarn classic
  "node_modules/pdfjs-dist/build/pdf.worker.min.js",
];

const out = "public/pdf.worker.min.js";
mkdirSync(dirname(out), { recursive: true });

const found = candidates.find((p) => existsSync(p));
if (!found) {
  console.warn("[copy-pdf-worker] pdf.worker.min.js not found. Skipping.");
  process.exit(0);
}
copyFileSync(found, out);
console.log(`[copy-pdf-worker] Copied from ${found} -> ${out}`);
