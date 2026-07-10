(function () {
  "use strict";

  const CACHE_KEY = "homepage-site-updated";
  const CACHE_TTL_MS = 60 * 60 * 1000;

  let updatedAt = null;
  let readyPromise = null;

  function getRepoConfig() {
    if (typeof SITE === "undefined" || !SITE.repo) return null;
    return SITE.repo;
  }

  function loadCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data.updatedAt || Date.now() - data.cachedAt > CACHE_TTL_MS) return null;
      return data.updatedAt;
    } catch (_) {
      return null;
    }
  }

  function saveCache(iso) {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ updatedAt: iso, cachedAt: Date.now() })
    );
  }

  async function fetchFromGitHub(repo) {
    const url = `https://api.github.com/repos/${repo.owner}/${repo.name}/commits?per_page=1`;
    const res = await fetch(url, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return null;

    const data = await res.json();
    return data[0]?.commit?.committer?.date || null;
  }

  async function fetchFromAsset(repo) {
    const path = repo.metaPath || "assets/site-updated.json";
    const res = await fetch(path);
    if (!res.ok) return null;

    const data = await res.json();
    return data.updatedAt || null;
  }

  async function resolveUpdatedAt() {
    const cached = loadCache();
    if (cached) return cached;

    const repo = getRepoConfig();
    if (!repo) return null;

    let iso = null;

    try {
      iso = await fetchFromGitHub(repo);
    } catch (_) {
      /* GitHub API unavailable */
    }

    if (!iso) {
      try {
        iso = await fetchFromAsset(repo);
      } catch (_) {
        /* Local meta file unavailable */
      }
    }

    if (iso) saveCache(iso);
    return iso;
  }

  function init() {
    if (!readyPromise) {
      readyPromise = resolveUpdatedAt().then((iso) => {
        updatedAt = iso;
        return iso;
      });
    }
    return readyPromise;
  }

  function getUpdatedAt() {
    return updatedAt;
  }

  function formatUpdatedAt(iso, lang) {
    if (!iso) return "";
    const date = new Date(iso);
    const locale = lang === "zh" ? "zh-CN" : "en-US";

    if (lang === "zh") {
      return date.toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getFormatted(lang) {
    if (!updatedAt) return "";
    return formatUpdatedAt(updatedAt, lang);
  }

  window.SiteUpdated = {
    init,
    getUpdatedAt,
    formatUpdatedAt,
    getFormatted,
  };
})();
