#!/usr/bin/env node
/**
 * Commit message validator — AndesWorkforce
 *
 * Rules:
 *  - Subject: 20-50 chars, starts with uppercase, no conventional commit prefixes
 *  - Line 2: blank separator
 *  - Body: ≥3 non-empty lines (excl. footer), each 20-50 chars
 *  - At least one What: block and one Why: block (multiple allowed)
 *  - No duplicate lines (case-insensitive)
 *  - Footer: last non-empty line must be a ticket ref (RM|SDT|KAN)-<number>
 *
 * Expected format:
 *   <Subject (20-50 chars, capitalized, imperative)>
 *
 *   What: <what changed>
 *   <additional detail>
 *   Why: <reason>
 *   <additional detail>
 *
 *   [Repeat What/Why blocks as needed]
 *
 *   KAN-42
 */

import { readFileSync } from 'fs';

const CONVENTIONAL_PREFIX_RE =
  /^(feat|fix|docs?|doc|refactor|test|chore|perf|style|build|ci|revert)\s*[\(:]/i;
const TICKET_LINE_RE = /^(RM|SDT|KAN)-\d+$/;

const MIN_CHARS = 20;
const MAX_CHARS = 50;
const MIN_BODY_LINES = 3;

const commitMsgFile = process.argv[2];

if (!commitMsgFile) {
  console.error('Usage: validate-commit-msg.mjs <commit-msg-file>');
  process.exit(1);
}

const raw = readFileSync(commitMsgFile, 'utf8');

// Strip comment lines (git adds them with #)
const lines = raw.split('\n').filter((l) => !l.startsWith('#'));

// Drop trailing blank lines
while (lines.length > 0 && lines[lines.length - 1].trim() === '') lines.pop();

const subject = lines[0]?.trim() ?? '';

// Body = everything after the first blank line that follows the subject
const rest = lines.slice(1);
const blankIdx = rest.findIndex((l) => l.trim() === '');
const bodyLines = blankIdx > -1 ? rest.slice(blankIdx + 1) : rest;
const contentLines = bodyLines.filter((l) => l.trim() !== '');

const errors = [];

// ── Subject validation ────────────────────────────────────────────────────────

if (!subject) {
  errors.push('Subject line is empty.');
} else {
  if (subject.length < MIN_CHARS || subject.length > MAX_CHARS) {
    errors.push(
      `Subject must be ${MIN_CHARS}-${MAX_CHARS} chars (currently ${subject.length}): "${subject}"`,
    );
  }

  if (!/^[A-Z]/.test(subject)) {
    errors.push(`Subject must start with an uppercase letter: "${subject}"`);
  }

  if (CONVENTIONAL_PREFIX_RE.test(subject)) {
    errors.push(
      `Subject must NOT use conventional commit prefixes (feat:, fix:, docs:, etc.): "${subject}"`,
    );
  }
}

// ── Blank separator line ──────────────────────────────────────────────────────

if (lines.length > 1 && lines[1]?.trim() !== '') {
  errors.push(
    `Line 2 must be blank (separator after subject). Found: "${lines[1]}"`,
  );
}

// ── Body validation ───────────────────────────────────────────────────────────

if (contentLines.length === 0) {
  errors.push('Commit body must not be empty. Add What:/Why: blocks.');
} else {
  // ── Footer / ticket (last non-empty line) ───────────────────────────────────
  const lastLine = contentLines[contentLines.length - 1].trim();
  if (!TICKET_LINE_RE.test(lastLine)) {
    errors.push(
      `Last line must be a ticket reference (RM|SDT|KAN)-<number>. Got: "${lastLine}"`,
    );
  }

  // Body lines = content lines excluding the ticket footer
  const bodyContentLines = TICKET_LINE_RE.test(lastLine)
    ? contentLines.slice(0, -1)
    : contentLines;

  if (bodyContentLines.length < MIN_BODY_LINES) {
    errors.push(
      `Body must have at least ${MIN_BODY_LINES} non-empty lines excluding the ticket (currently ${bodyContentLines.length}).`,
    );
  }

  for (const line of bodyContentLines) {
    if (line.length < MIN_CHARS || line.length > MAX_CHARS) {
      errors.push(
        `Body line must be ${MIN_CHARS}-${MAX_CHARS} chars (currently ${line.length}): "${line}"`,
      );
    }
  }

  const seen = new Set();
  for (const line of bodyContentLines) {
    const key = line.trim().toLowerCase();
    if (seen.has(key)) {
      errors.push(`Duplicate line found: "${line.trim()}"`);
    }
    seen.add(key);
  }

  if (!bodyContentLines.some((l) => /^What:\s+\S/.test(l))) {
    errors.push('Body must contain at least one "What: ..." line.');
  }

  if (!bodyContentLines.some((l) => /^Why:\s+\S/.test(l))) {
    errors.push('Body must contain at least one "Why: ..." line.');
  }
}

// ── Report ────────────────────────────────────────────────────────────────────

if (errors.length > 0) {
  console.error('\n\u2716 Commit message validation failed:\n');
  errors.forEach((e) => console.error(`  \u2022 ${e}`));
  console.error(`
Expected format:
  Add email validation on login

  What: Validate email format before submit
  Prevents invalid data from reaching API
  Why: Backend was rejecting bad addresses
  Reduces error rate at the API layer

  KAN-42

Ticket prefixes allowed: RM, SDT, KAN
`);
  process.exit(1);
}

console.log('\u2714 Commit message is valid.');
process.exit(0);
