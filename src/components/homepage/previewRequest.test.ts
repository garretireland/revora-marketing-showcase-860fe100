import { test } from "node:test";
import assert from "node:assert/strict";
import { submitPreviewRequest, EMPTY_REQUEST, validate, normalizeWebsite } from "./previewRequest";

// Phase 7D correctness fix: the honeypot branch must resolve false (no
// real submission happened) without ever touching fetch, so callers can
// tell it apart from a confirmed Netlify success.
test("honeypot: resolves false without making any network request", async () => {
  let fetchCalled = false;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => { fetchCalled = true; throw new Error("fetch should not be called for a honeypot submission"); }) as typeof fetch;
  try {
    const result = await submitPreviewRequest({ ...EMPTY_REQUEST, "bot-field": "spam" });
    assert.equal(result, false);
    assert.equal(fetchCalled, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("validate: requires name, business, email", () => {
  const errors = validate(EMPTY_REQUEST);
  assert.ok(errors.name);
  assert.ok(errors.business);
  assert.ok(errors.email);
});

test("normalizeWebsite: adds https:// only when missing", () => {
  assert.equal(normalizeWebsite("example.com"), "https://example.com");
  assert.equal(normalizeWebsite("https://example.com"), "https://example.com");
  assert.equal(normalizeWebsite(""), "");
});
