// ── Exa web search ───────────────────────────────────────────────────────────
// Server-side only: the official Exa SDK reads EXA_API_KEY from the process
// environment, so the key is never bundled into the browser build. The SPA
// reaches this module through GET /api/search?q=<query>.
const { Exa } = require('exa-js');

const DEFAULT_NUM_RESULTS = 5;
const MAX_NUM_RESULTS = 10;
const MAX_QUERY_LENGTH = 400;

let client = null;

function hasExaKey() {
  return Boolean(process.env.EXA_API_KEY);
}

function getClient() {
  if (!hasExaKey()) {
    const err = new Error('EXA_API_KEY is not configured');
    err.code = 'EXA_KEY_MISSING';
    throw err;
  }
  if (!client) {
    client = new Exa(process.env.EXA_API_KEY);
  }
  return client;
}

// Input sanitization: strip control characters, collapse whitespace, cap length.
function sanitizeQuery(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_QUERY_LENGTH);
}

function clampNumResults(value) {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n)) return DEFAULT_NUM_RESULTS;
  return Math.min(Math.max(n, 1), MAX_NUM_RESULTS);
}

function normalizeResult(result) {
  return {
    title: result.title || result.url,
    url: result.url,
    publishedDate: result.publishedDate || null,
    author: result.author || null,
    highlights: Array.isArray(result.highlights) ? result.highlights : [],
  };
}

/**
 * Search the web with Exa and return relevant pages with extracted highlights.
 * @param {string} rawQuery
 * @param {{ numResults?: number }} [options]
 */
async function searchWeb(rawQuery, options = {}) {
  const query = sanitizeQuery(rawQuery);
  if (query.length < 2) {
    const err = new Error('Query must be at least 2 characters');
    err.code = 'EXA_QUERY_INVALID';
    throw err;
  }

  const exa = getClient();
  const response = await exa.search(query, {
    type: 'auto',
    numResults: clampNumResults(options.numResults),
    contents: { highlights: true },
  });

  return {
    query,
    requestId: response.requestId || null,
    results: Array.isArray(response.results) ? response.results.map(normalizeResult) : [],
  };
}

module.exports = { searchWeb, sanitizeQuery, hasExaKey, DEFAULT_NUM_RESULTS, MAX_NUM_RESULTS };
