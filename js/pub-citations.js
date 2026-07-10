(function () {
  "use strict";

  const CACHE_KEY = "homepage-citation-cache";
  const REQUEST_GAP_MS = 350;

  function loadCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return { entries: {}, updatedAt: null };
      const parsed = JSON.parse(raw);
      return {
        entries: parsed.entries && typeof parsed.entries === "object" ? parsed.entries : {},
        updatedAt: parsed.updatedAt || null,
      };
    } catch (_) {
      return { entries: {}, updatedAt: null };
    }
  }

  function saveCache(cache) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  }

  function pubKey(pub) {
    return String(pub._idx);
  }

  function normalizeTitle(title) {
    return String(title || "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function titleSimilarity(a, b) {
    const wordsA = new Set(
      normalizeTitle(a)
        .split(" ")
        .filter((w) => w.length > 2)
    );
    const wordsB = new Set(
      normalizeTitle(b)
        .split(" ")
        .filter((w) => w.length > 2)
    );
    if (!wordsA.size || !wordsB.size) return 0;

    let overlap = 0;
    wordsA.forEach((word) => {
      if (wordsB.has(word)) overlap += 1;
    });
    return overlap / Math.max(wordsA.size, wordsB.size);
  }

  function normalizeDoi(doi) {
    if (!doi) return "";
    return String(doi)
      .trim()
      .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
      .replace(/^doi:/i, "");
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function fetchJson(url) {
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return res.json();
  }

  async function fetchFromOpenAlex(pub) {
    const doi = normalizeDoi(pub.doi);
    if (doi) {
      const data = await fetchJson(
        `https://api.openalex.org/works/https://doi.org/${encodeURIComponent(doi)}?select=cited_by_count,display_name`
      );
      if (data && typeof data.cited_by_count === "number") {
        return { count: data.cited_by_count, source: "openalex" };
      }
    }

    if (pub.openAlexId) {
      const id = String(pub.openAlexId).replace(/^https?:\/\/openalex\.org\//i, "");
      const data = await fetchJson(
        `https://api.openalex.org/works/${encodeURIComponent(id)}?select=cited_by_count,display_name`
      );
      if (data && typeof data.cited_by_count === "number") {
        return { count: data.cited_by_count, source: "openalex" };
      }
    }

    if (!pub.title) return null;

    const data = await fetchJson(
      `https://api.openalex.org/works?search=${encodeURIComponent(pub.title)}&select=display_name,cited_by_count&per_page=5`
    );
    const results = data && Array.isArray(data.results) ? data.results : [];
    const match = results.find((item) => titleSimilarity(pub.title, item.display_name) >= 0.55);
    if (match && typeof match.cited_by_count === "number") {
      return { count: match.cited_by_count, source: "openalex" };
    }

    return null;
  }

  async function fetchFromSemanticScholar(pub) {
    if (pub.semanticScholarId) {
      const data = await fetchJson(
        `https://api.semanticscholar.org/graph/v1/paper/${encodeURIComponent(pub.semanticScholarId)}?fields=citationCount,title`
      );
      if (data && typeof data.citationCount === "number") {
        return { count: data.citationCount, source: "semanticscholar" };
      }
    }

    if (!pub.title) return null;

    const data = await fetchJson(
      `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(pub.title)}&limit=5&fields=title,citationCount,year`
    );
    const results = data && Array.isArray(data.data) ? data.data : [];
    const match = results.find((item) => titleSimilarity(pub.title, item.title) >= 0.55);
    if (match && typeof match.citationCount === "number") {
      return { count: match.citationCount, source: "semanticscholar" };
    }

    return null;
  }

  async function fetchCitationForPub(pub) {
    try {
      const fromOpenAlex = await fetchFromOpenAlex(pub);
      if (fromOpenAlex) return fromOpenAlex;
    } catch (_) {
      /* OpenAlex unavailable — try fallback */
    }

    await sleep(REQUEST_GAP_MS);

    try {
      const fromS2 = await fetchFromSemanticScholar(pub);
      if (fromS2) return fromS2;
    } catch (_) {
      /* Semantic Scholar may be blocked by CORS in some browsers */
    }

    return null;
  }

  function getCached(pub) {
    const cache = loadCache();
    return cache.entries[pubKey(pub)] || null;
  }

  function getEffective(pub) {
    const cached = getCached(pub);
    if (cached && typeof cached.count === "number") return cached.count;

    const manual = pub.citations;
    return typeof manual === "number" && Number.isFinite(manual) ? manual : -1;
  }

  function getCacheMeta() {
    const cache = loadCache();
    return { updatedAt: cache.updatedAt, count: Object.keys(cache.entries).length };
  }

  async function refreshAll(pubs) {
    const cache = loadCache();
    let updated = 0;

    for (let i = 0; i < pubs.length; i++) {
      const pub = pubs[i];
      const result = await fetchCitationForPub(pub);
      if (result) {
        cache.entries[pubKey(pub)] = {
          count: result.count,
          source: result.source,
          fetchedAt: Date.now(),
        };
        updated += 1;
      }
      if (i < pubs.length - 1) await sleep(REQUEST_GAP_MS);
    }

    cache.updatedAt = Date.now();
    saveCache(cache);
    return { updated, total: pubs.length };
  }

  window.PubCitations = {
    getEffective,
    getCached,
    getCacheMeta,
    refreshAll,
  };
})();
