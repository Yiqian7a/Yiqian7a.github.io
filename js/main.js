(function () {
  "use strict";

  const LANG_KEY = "homepage-lang";
  const PUB_CONTROLS_KEY = "homepage-pub-controls";
  let currentLang = localStorage.getItem(LANG_KEY) || "en";
  let pubControlsState = loadPubControlsState();
  let pubMenuBound = false;
  let newsExpanded = false;

  function loadPubControlsState() {
    const defaults = { filter: "all", sort: "default" };
    try {
      const raw = localStorage.getItem(PUB_CONTROLS_KEY);
      if (!raw) return defaults;
      return { ...defaults, ...JSON.parse(raw) };
    } catch (_) {
      return defaults;
    }
  }

  function savePubControlsState() {
    localStorage.setItem(PUB_CONTROLS_KEY, JSON.stringify(pubControlsState));
  }

  function t(key) {
    const parts = key.split(".");
    let obj = CONTENT[currentLang];
    for (const p of parts) {
      obj = obj[p];
      if (obj === undefined) return key;
    }
    return obj;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function renderNav() {
    const nav = CONTENT[currentLang].nav;
    const brand = document.getElementById("nav-brand");
    brand.textContent = nav.brand;

    const items = [
      { id: "about", label: nav.about },
      { id: "publications", label: nav.publications },
      { id: "education", label: nav.education },
      { id: "news", label: nav.news },
      { id: "experience", label: nav.experience },
      { id: "projects", label: nav.projects },
      { id: "awards", label: nav.awards },
    ];

    document.getElementById("nav-links").innerHTML = items
      .filter((item) => item.id !== "experience" || CONTENT[currentLang].experience.some((entry) => window.SiteVisibility.allows(entry)))
      .filter((item) => item.id !== "news" || CONTENT[currentLang].news.some((entry) => window.SiteVisibility.allows(entry)))
      .map(
        (item) =>
          `<li><a href="#${item.id}">${escapeHtml(item.label)}</a></li>`
      )
      .join("");
  }

  /**
   * 生成联系方式的装饰图标，链接名称仍由可见文字提供。
   *
   * Args:
   *   key (string): 联系方式类型。
   *
   * Returns:
   *   string: 不参与无障碍朗读的 SVG 标记。
   */
  function renderContactIcon(key) {
    const paths = {
      email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
      github: '<path d="M9 19c-4 1-4-2-6-2m12 5v-4a3.5 3.5 0 0 0-1-3c3-.3 6-1.5 6-6a4.7 4.7 0 0 0-1.3-3.3A4.3 4.3 0 0 0 18.6 2S17.4 1.7 15 3a13.4 13.4 0 0 0-6 0C6.6 1.7 5.4 2 5.4 2a4.3 4.3 0 0 0-.1 3.7A4.7 4.7 0 0 0 4 9c0 4.5 3 5.7 6 6a3.5 3.5 0 0 0-1 3v4"/>',
      scholar: '<path d="m2 9 10-6 10 6-10 6-10-6Zm4 3v6c4 3 8 3 12 0v-6m4-3v8"/>',
      orcid: '<circle cx="12" cy="12" r="9"/><path d="M8 10v7m0-10v.1M12 7h2a5 5 0 0 1 0 10h-2V7Z"/>',
      linkedin: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10v7m0-10v.1m5 10v-7m0 3a3 3 0 0 1 6 0v4"/>',
    };
    return `<svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[key] || paths.email}</svg>`;
  }

  /**
   * 生成左侧简介下方的联系方式和可用简历入口。
   *
   * Returns:
   *   string: 联系方式列表的 HTML。
   */
  function renderProfileLinks() {
    const hero = CONTENT[currentLang].hero;
    const labels = CONTENT[currentLang].linkLabels;

    const linkItems = [
      { key: "email", url: `mailto:${SITE.email}`, label: labels.email },
      { key: "github", url: SITE.links.github, label: labels.github },
      { key: "scholar", url: SITE.links.scholar, label: labels.scholar },
      { key: "orcid", url: SITE.links.orcid, label: labels.orcid },
      { key: "linkedin", url: SITE.links.linkedin, label: labels.linkedin },
    ]
      .filter((l) => l.url && !l.url.endsWith("/"))
      .map(
        (l) =>
          `<li><a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${renderContactIcon(l.key)}<span>${escapeHtml(l.label)}</span></a></li>`
      )
      .join("");

    const cvBtn =
      SITE.cvAvailable
        ? `<div class="hero-cv"><a class="btn-cv" href="${escapeHtml(SITE.cvUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(hero.cvLabel)}</a></div>`
        : "";

    return `<ul class="hero-links">${linkItems}</ul>${cvBtn}`;
  }

  /**
   * 集中渲染左侧个人介绍和博士意向，右侧仅保留照片。
   *
   * Returns:
   *   void: 更新简介和照片区域。
   */
  function renderAbout() {
    const data = CONTENT[currentLang].about;
    const hero = CONTENT[currentLang].hero;
    const name = currentLang === "zh" ? SITE.nameZh : SITE.name;
    const otherName = currentLang === "zh" ? SITE.name : SITE.nameZh;

    document.getElementById("hero").innerHTML = `<img class="hero-photo" src="${escapeHtml(SITE.photo)}" alt="${escapeHtml(name)}" width="460" height="618" fetchpriority="high" decoding="async">`;
    document.getElementById("about").innerHTML = `
      <h1 class="profile-name">${escapeHtml(name)} <span>/ ${escapeHtml(otherName)}</span></h1>
      <p class="profile-role">${escapeHtml(hero.affiliation)}</p>
      <p class="about-text">${linkPeopleInText(data.text)}</p>
      <div class="interest-tags" aria-label="${escapeHtml(data.tagsLabel)}">
        ${data.tags.map((tag) => `<span class="interest-tag">${escapeHtml(tag)}</span>`).join("")}
      </div>
      <p class="opportunity"><span class="opportunity-dot" aria-hidden="true"></span><span>${escapeHtml(data.opportunity)}</span></p>
      ${renderProfileLinks()}`;
  }

  /**
   * 渲染简洁的图标、机构、身份与时间，保留地区展示条件。
   *
   * Args:
   *   sectionId (string): 目标区域的元素 ID。
   *   dataKey (string): 对应的双语内容字段。
   *
   * Returns:
   *   void: 更新区域内容和可见性。
   */
  function renderTimeline(sectionId, dataKey) {
    const items = CONTENT[currentLang][dataKey].filter((item) => window.SiteVisibility.allows(item));
    const title = CONTENT[currentLang].sections[dataKey];
    const section = document.getElementById(sectionId);
    section.hidden = dataKey === "experience" && items.length === 0;
    if (section.hidden) {
      section.innerHTML = "";
      return;
    }

    if (!items || items.length === 0) {
      document.getElementById(sectionId).innerHTML = `
        <h2 class="section-title">${escapeHtml(title)}</h2>
        <p class="placeholder-msg">${escapeHtml(CONTENT[currentLang].placeholder)}</p>`;
      return;
    }

    document.getElementById(sectionId).innerHTML = `
      <h2 class="section-title">${escapeHtml(title)}</h2>
      <ul class="timeline">
        ${items
          .map(
            (item) => `
          <li class="timeline-item${item.logo ? " timeline-item-with-logo" : ""}">
            ${item.logo ? `<img class="institution-logo${item.logoTheme === "dark" ? " institution-logo-dark" : ""}" src="${escapeHtml(item.logo)}" alt="${escapeHtml(item.institution || item.company || "")}" width="100" height="56" loading="lazy">` : ""}
            <div class="timeline-content">
            <div class="timeline-header">
              <p class="timeline-title">${item.url ? `<a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.institution || item.company || "")}</a>` : escapeHtml(item.institution || item.company || "")}</p>
              ${item.date ? `<span class="timeline-date">${escapeHtml(item.date)}</span>` : ""}
            </div>
            <p class="timeline-subtitle">${escapeHtml(item.title)}</p>
            ${item.detail ? `<p class="timeline-detail">${linkPeopleInText(item.detail)}</p>` : ""}
            </div>
          </li>`
          )
          .join("")}
      </ul>`;
  }

  function isPubPreprint(pub) {
    return Boolean(pub.preprint);
  }

  function getVisiblePubBadges(pub) {
    const badges = pub.badges || [];
    if (!isPubPreprint(pub)) return badges;
    return badges.filter((badge) => badge.type !== "venue");
  }

  function getVisiblePubLinks(pub) {
    const links = pub.links || [];
    if (!isPubPreprint(pub)) return links;
    return links.filter((link) => {
      const label = String(link.label || "").toLowerCase();
      const url = String(link.url || "").toLowerCase();
      return !label.includes("openreview") && !url.includes("openreview.net");
    });
  }

  function renderPubBadges(badges) {
    if (!badges || !badges.length) return "";
    return `<div class="pub-badges">${badges
      .map((badge) => {
        const type = badge.type ? ` pub-badge-${badge.type}` : "";
        return `<span class="pub-badge${type}">${escapeHtml(badge.text)}</span>`;
      })
      .join("")}</div>`;
  }

  function stripAuthorMarkers(name) {
    const markers = name.match(/[\*†‡§]+$/);
    return {
      base: name.replace(/[\*†‡§]+$/g, "").trim(),
      markers: markers ? markers[0] : "",
    };
  }

  function findPerson(baseName) {
    if (typeof PEOPLE === "undefined") return null;
    return PEOPLE.find((p) => p.en === baseName || p.zh === baseName) || null;
  }

  function isSelfAuthor(baseName) {
    if (baseName === SITE.name || baseName === SITE.nameZh) return true;
    const person = findPerson(baseName);
    return Boolean(person && person.isSelf);
  }

  function renderAuthorName(rawName) {
    const { base, markers } = stripAuthorMarkers(rawName);
    const person = findPerson(base);
    const self = isSelfAuthor(base);

    let inner;
    if (person && person.url) {
      inner = `<a href="${escapeHtml(person.url)}" class="pub-author-link" target="_blank" rel="noopener noreferrer">${escapeHtml(base)}</a>`;
    } else {
      inner = escapeHtml(base);
    }

    if (self) {
      inner = `<strong class="pub-author-self">${inner}</strong>`;
    }

    return `${inner}${escapeHtml(markers)}`;
  }

  /**
   * 折叠长作者列表，同时保留首位、本人和末位作者及原始顺序。
   *
   * Args:
   *   authorsStr (string): 逗号分隔的作者名单。
   *
   * Returns:
   *   string: 带原生展开交互的作者标记。
   */
  function renderAuthors(authorsStr) {
    const names = authorsStr
      .split(/[,，]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const full = names.map(renderAuthorName).join(", ");
    if (names.length <= 5) return full;
    const preview = [];
    let omitted = false;
    names.forEach((name, index) => {
      if (index < 2 || index === names.length - 1 || isSelfAuthor(stripAuthorMarkers(name).base)) {
        if (omitted) preview.push("…");
        preview.push(renderAuthorName(name));
        omitted = false;
      } else omitted = true;
    });
    const count = names.filter((name, index) => !(index < 2 || index === names.length - 1 || isSelfAuthor(stripAuthorMarkers(name).base))).length;
    const label = currentLang === "zh" ? `展开其余 ${count} 位` : `Show ${count} more`;
    return `<span class="authors-preview">${preview.join(", ")}</span><span class="authors-full" hidden>${full}</span> <button type="button" class="text-toggle" data-authors-toggle data-more="${escapeHtml(label)}" aria-expanded="false">${label}</button>`;
  }

  function linkPeopleInText(text) {
    if (typeof PEOPLE === "undefined" || !PEOPLE.length) {
      return escapeHtml(text);
    }

    const names = PEOPLE.map((p) => (currentLang === "zh" ? p.zh : p.en)).filter(Boolean);
    if (!names.length) return escapeHtml(text);

    const pattern = [...names]
      .sort((a, b) => b.length - a.length)
      .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|");
    const re = new RegExp(`(${pattern})`, "g");

    return text
      .split(re)
      .map((part, index) => (index % 2 === 1 ? renderAuthorName(part) : escapeHtml(part)))
      .join("");
  }

  function renderPubLinks(links) {
    if (!links || !links.length) return "";
    const items = links.filter((l) => l.url && l.url !== "#");
    if (!items.length) return "";

    return `<div class="pub-links">${items
      .map((l) => {
        const iconHtml = getPubLinkIconHtml(l);
        return `<a class="pub-link" href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">
          <span class="pub-link-icon" aria-hidden="true">${iconHtml}</span>
          <span class="pub-link-label">${escapeHtml(l.label)}</span>
        </a>`;
      })
      .join("")}</div>`;
  }

  function renderPubHeader(pub) {
    return `
      <div class="pub-header">
        <span class="pub-year">${escapeHtml(pub.year)}</span>
        ${renderPubBadges(getVisiblePubBadges(pub))}
      </div>`;
  }

  /**
   * 在缩略图上方展示年份与发表状态，利用宽幅配图列的垂直空间。
   *
   * Args:
   *   pub (Object): 论文数据。
   *
   * Returns:
   *   string: 保留点击放大功能的配图标记。
   */
  function renderPubAside(pub) {
    if (!pub.figure) return "";
    const alt = pub.title ? `${pub.title} pipeline` : "Publication figure";
    return `
      <div class="pub-aside">
        ${renderPubHeader(pub)}
        <div class="pub-figure">
          <img class="pub-figure-zoomable" src="${escapeHtml(pub.figureThumb || pub.figure)}" data-full-src="${escapeHtml(pub.figure)}"${pub.figureSize ? ` width="${pub.figureSize[0]}" height="${pub.figureSize[1]}"` : ""} alt="${escapeHtml(alt)}" loading="lazy" decoding="async" draggable="false" tabindex="0" title="${currentLang === "zh" ? "点击查看大图" : "Click to enlarge"}">
        </div>
      </div>`;
  }

  function getSelfAuthorRoles(authorsStr) {
    const names = authorsStr
      .split(/[,，]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const roles = new Set();

    for (let i = 0; i < names.length; i++) {
      const { base, markers } = stripAuthorMarkers(names[i]);
      if (!isSelfAuthor(base)) continue;

      if (i === 0) roles.add("first");
      if (markers.includes("*")) roles.add("co-first");
      if (/[†‡]/.test(markers)) roles.add("corresponding");
      if (i > 0 && !markers.includes("*")) roles.add("coauthor");
    }

    return [...roles];
  }

  function parsePubYear(pub) {
    const y = parseInt(String(pub.year).split(/[.\-/]/)[0], 10);
    return Number.isFinite(y) ? y : 0;
  }

  function pubCitations(pub) {
    if (window.PubCitations) return PubCitations.getEffective(pub);
    const c = pub.citations;
    return typeof c === "number" && Number.isFinite(c) ? c : -1;
  }

  function getSiteUpdatedLabel(lang) {
    const time = window.SiteUpdated?.getFormatted(lang);
    if (!time) return "";
    return CONTENT[lang].siteMeta.lastUpdated.replace("{time}", time);
  }

  function getCitationStatusText(labels) {
    const updated = getSiteUpdatedLabel(currentLang);
    if (!updated) return labels.citationsNote;
    const gap = currentLang === "zh" ? "" : " ";
    return `${labels.citationsNote}${gap}${updated}`;
  }

  function updatePubCitationStatus() {
    const status = document.querySelector("[data-pub-citation-status]");
    if (status) {
      status.textContent = getCitationStatusText(CONTENT[currentLang].pubControls);
    }
  }

  function pubMatchesFilter(pub, filter) {
    if (!window.SiteVisibility.allows(pub)) return false;
    if (filter === "all") return true;
    const roles = getSelfAuthorRoles(pub.authors);
    return roles.includes(filter);
  }

  function filterAndSortPublications(pubs, state) {
    const filtered = pubs.filter((pub) => pubMatchesFilter(pub, state.filter));
    const sorted = [...filtered];

    switch (state.sort) {
      case "year-desc":
        sorted.sort(
          (a, b) => parsePubYear(b) - parsePubYear(a) || a._idx - b._idx
        );
        break;
      case "year-asc":
        sorted.sort(
          (a, b) => parsePubYear(a) - parsePubYear(b) || a._idx - b._idx
        );
        break;
      case "citations-desc":
        sorted.sort((a, b) => {
          const diff = pubCitations(b) - pubCitations(a);
          if (diff !== 0) return diff;
          return parsePubYear(b) - parsePubYear(a) || a._idx - b._idx;
        });
        break;
      default:
        sorted.sort((a, b) => a._idx - b._idx);
    }

    return sorted;
  }

  function renderPubItem(pub) {
    const tldrLabel = CONTENT[currentLang].pubLabels.tldr;
    const hasFigure = Boolean(pub.figure);

    return `
      <li id="publication-${pub._idx}" class="pub-item${hasFigure ? " pub-item-has-figure" : ""}">
        <div class="pub-layout">
          ${hasFigure ? renderPubAside(pub) : ""}
          <div class="pub-body">
            ${hasFigure ? "" : renderPubHeader(pub)}
            <p class="pub-title">${escapeHtml(pub.title)}</p>
            <div class="pub-authors">${renderAuthors(pub.authors)}</div>
            ${
              pub.tldr
                ? `<p class="pub-tldr"><span class="pub-tldr-label">${escapeHtml(tldrLabel)}</span> ${escapeHtml(pub.tldr)}</p>`
                : ""
            }
            ${renderPubLinks(getVisiblePubLinks(pub))}
          </div>
        </div>
      </li>`;
  }

  function renderPubListHtml(pubs, labels) {
    if (!pubs.length) {
      return `<p class="pub-empty-msg">${escapeHtml(labels.emptyResult)}</p>`;
    }

    return `<ul class="pub-list">${pubs.map(renderPubItem).join("")}</ul>`;
  }

  function renderPubMenu(labels) {
    const { filter, sort } = pubControlsState;

    return `
      <div class="pub-menu">
        <button type="button" class="pub-menu-btn" aria-label="${escapeHtml(labels.menuLabel)}" aria-expanded="false" aria-haspopup="true">···</button>
        <div class="pub-menu-panel" hidden>
          <label class="pub-menu-field">
            <span class="pub-menu-label">${escapeHtml(labels.filterLabel)}</span>
            <select data-pub-control="filter">
              <option value="all"${filter === "all" ? " selected" : ""}>${escapeHtml(labels.filterAll)}</option>
              <option value="first"${filter === "first" ? " selected" : ""}>${escapeHtml(labels.filterFirst)}</option>
              <option value="co-first"${filter === "co-first" ? " selected" : ""}>${escapeHtml(labels.filterCoFirst)}</option>
              <option value="corresponding"${filter === "corresponding" ? " selected" : ""}>${escapeHtml(labels.filterCorresponding)}</option>
              <option value="coauthor"${filter === "coauthor" ? " selected" : ""}>${escapeHtml(labels.filterCoauthor)}</option>
            </select>
          </label>
          <label class="pub-menu-field">
            <span class="pub-menu-label">${escapeHtml(labels.sortLabel)}</span>
            <select data-pub-control="sort">
              <option value="default"${sort === "default" ? " selected" : ""}>${escapeHtml(labels.sortDefault)}</option>
              <option value="year-desc"${sort === "year-desc" ? " selected" : ""}>${escapeHtml(labels.sortYearDesc)}</option>
              <option value="year-asc"${sort === "year-asc" ? " selected" : ""}>${escapeHtml(labels.sortYearAsc)}</option>
              <option value="citations-desc"${sort === "citations-desc" ? " selected" : ""}>${escapeHtml(labels.sortCitationsDesc)}</option>
            </select>
          </label>
          <div class="pub-menu-actions">
            <button type="button" class="pub-menu-refresh" data-pub-refresh>${escapeHtml(labels.refreshCitations)}</button>
          </div>
          <p class="pub-menu-note" data-pub-citation-status>${escapeHtml(getCitationStatusText(labels))}</p>
        </div>
      </div>`;
  }

  async function refreshPublicationCitations() {
    const labels = CONTENT[currentLang].pubControls;
    const btn = document.querySelector("[data-pub-refresh]");
    const status = document.querySelector("[data-pub-citation-status]");
    if (!btn || !window.PubCitations) return;

    const pubs = CONTENT.en.publications.map((pub, idx) => ({ ...pub, _idx: idx }));
    btn.disabled = true;
    btn.textContent = labels.refreshingCitations;
    if (status) status.textContent = labels.refreshingCitations;

    try {
      const result = await PubCitations.refreshAll(pubs);
      updatePubList();
      if (status) {
        status.textContent = labels.refreshDone
          .replace("{n}", String(result.updated))
          .replace("{total}", String(result.total));
        window.setTimeout(updatePubCitationStatus, 3000);
      }
    } catch (_) {
      if (status) status.textContent = labels.refreshFailed;
      window.setTimeout(updatePubCitationStatus, 3000);
    } finally {
      btn.disabled = false;
      btn.textContent = labels.refreshCitations;
    }
  }

  function closePubMenu() {
    const panel = document.querySelector("#publications .pub-menu-panel");
    const btn = document.querySelector("#publications .pub-menu-btn");
    if (panel && !panel.hidden) {
      panel.hidden = true;
      btn?.setAttribute("aria-expanded", "false");
    }
  }

  function updatePubList() {
    const pubs = CONTENT[currentLang].publications.map((pub, idx) => ({
      ...pub,
      _idx: idx,
    }));
    const labels = CONTENT[currentLang].pubControls;
    const filtered = filterAndSortPublications(pubs, pubControlsState);
    const wrap = document.querySelector("#publications .pub-list-wrap");
    if (wrap) wrap.innerHTML = renderPubListHtml(filtered, labels);
  }

  function bindPubMenuEvents() {
    if (pubMenuBound) return;
    pubMenuBound = true;

    const section = document.getElementById("publications");
    if (!section) return;

    section.addEventListener("click", (e) => {
      if (e.target.closest("[data-pub-refresh]")) {
        e.stopPropagation();
        refreshPublicationCitations();
        return;
      }

      const btn = e.target.closest(".pub-menu-btn");
      if (btn) {
        e.stopPropagation();
        const panel = btn.closest(".pub-menu").querySelector(".pub-menu-panel");
        const opening = panel.hidden;
        panel.hidden = !opening;
        btn.setAttribute("aria-expanded", opening ? "true" : "false");
        return;
      }

      if (!e.target.closest(".pub-menu-panel")) {
        closePubMenu();
      }
    });

    section.addEventListener("change", (e) => {
      const control = e.target.closest("[data-pub-control]");
      if (!control) return;
      pubControlsState[control.dataset.pubControl] = control.value;
      savePubControlsState();
      updatePubList();
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".pub-menu")) closePubMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closePubMenu();
    });
  }

  function renderPublications() {
    const pubs = CONTENT[currentLang].publications.map((pub, idx) => ({
      ...pub,
      _idx: idx,
    }));
    const title = CONTENT[currentLang].sections.publications;
    const labels = CONTENT[currentLang].pubControls;
    const filtered = filterAndSortPublications(pubs, pubControlsState);

    document.getElementById("publications").innerHTML = `
      <div class="pub-section-head">
        <h2 class="section-title">${escapeHtml(title)}</h2>
        ${renderPubMenu(labels)}
      </div>
      <div class="pub-list-wrap">
        ${renderPubListHtml(filtered, labels)}
      </div>`;

    bindPubMenuEvents();
  }

  /**
   * 将动态日期转换为时间戳；仅有年月时按该时段末日判断新旧。
   *
   * Args:
   *   value (string): YYYY、YYYY-MM 或 YYYY-MM-DD 格式日期。
   *
   * Returns:
   *   number: UTC 时间戳；未知日期返回零。
   */
  function newsTimestamp(value) {
    const parts = String(value).replaceAll(".", "-").split("-").map(Number);
    if (!parts[0] || parts.some((part) => !Number.isFinite(part))) return 0;
    return parts.length === 1 ? Date.UTC(parts[0], 11, 31)
      : parts.length === 2 ? Date.UTC(parts[0], parts[1], 0)
      : Date.UTC(parts[0], parts[1] - 1, parts[2]);
  }

  /**
   * 渲染近三个月动态，较早内容自动折叠并至少保留最新一条。
   *
   * Returns:
   *   void: 更新动态区域的页面内容。
   */
  function renderNews() {
    const items = CONTENT[currentLang].news.filter((item) => window.SiteVisibility.allows(item)).sort((a, b) => newsTimestamp(b.date) - newsTimestamp(a.date));
    const title = CONTENT[currentLang].sections.news;
    const section = document.getElementById("news");
    section.hidden = items.length === 0;

    if (!items || items.length === 0) {
      section.innerHTML = "";
      return;
    }

    // 以日历月计算阈值；月底向前推三个月时限制到目标月份末日。
    const now = new Date();
    const cutoff = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 3, 1));
    const lastDay = new Date(Date.UTC(cutoff.getUTCFullYear(), cutoff.getUTCMonth() + 1, 0)).getUTCDate();
    cutoff.setUTCDate(Math.min(now.getUTCDate(), lastDay));
    const visibleCount = Math.max(1, items.filter((item) => newsTimestamp(item.date) >= cutoff.getTime()).length);
    const hiddenCount = items.length - visibleCount;
    document.getElementById("news").innerHTML = `
      <h2 class="section-title">${escapeHtml(title)}</h2>
      <ul class="news-list">
        ${items
          .map(
            (n, index) => `
          <li class="news-item"${!newsExpanded && index >= visibleCount ? " hidden" : ""}>
            <span class="news-date">${escapeHtml(n.date)}</span>
            <div class="news-content">
              ${n.parts?.length
                ? `<strong>${n.parts.map((part) => part.url ? `<a href="${escapeHtml(part.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(part.text)}</a>` : escapeHtml(part.text)).join("")}</strong>`
                : `<span>${n.url ? `<a href="${escapeHtml(n.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(n.text)}</a>` : escapeHtml(n.text)}</span>`}
            </div>
          </li>`
          )
          .join("")}
      </ul>
      ${hiddenCount > 0 ? `<button type="button" class="text-toggle news-toggle" data-news-toggle aria-expanded="${newsExpanded}">${newsExpanded ? (currentLang === "zh" ? "收起" : "Show less") : (currentLang === "zh" ? `展开其余 ${hiddenCount} 条` : `Show ${hiddenCount} more`)}</button>` : ""}`;
  }

  /**
   * 渲染项目年份、配图与简介，仓库入口复用论文链接的图标样式。
   *
   * Returns:
   *   void: 更新项目区域的页面内容。
   */
  function renderProjects() {
    const items = CONTENT[currentLang].projects.filter((item) => window.SiteVisibility.allows(item));
    const title = CONTENT[currentLang].sections.projects;

    if (!items || items.length === 0) {
      document.getElementById("projects").innerHTML = `
        <h2 class="section-title">${escapeHtml(title)}</h2>
        <p class="placeholder-msg">${escapeHtml(CONTENT[currentLang].placeholder)}</p>`;
      return;
    }

    document.getElementById("projects").innerHTML = `
      <h2 class="section-title">${escapeHtml(title)}</h2>
      <ul class="project-list">
        ${items
          .map(
            (p) => `
          <li class="project-item${p.image ? " project-item-with-image" : ""}">
            ${p.image ? `<div class="project-aside">${p.year ? `<span class="pub-year project-year">${escapeHtml(p.year)}</span>` : ""}<img class="project-image pub-figure-zoomable" src="${escapeHtml(p.imageThumb || p.image)}" data-full-src="${escapeHtml(p.image)}"${p.imageSize ? ` width="${p.imageSize[0]}" height="${p.imageSize[1]}"` : ""} alt="${escapeHtml(p.imageAlt || p.name)}" loading="lazy" decoding="async" draggable="false" tabindex="0" title="${currentLang === "zh" ? "点击查看大图" : "Click to enlarge"}"></div>` : ""}
            <div class="project-content">
            ${!p.image && p.year ? `<span class="pub-year project-year">${escapeHtml(p.year)}</span>` : ""}
            <p class="project-name">${escapeHtml(p.name)}</p>
            <p class="project-desc">${escapeHtml(p.description)}</p>
            ${
              p.url
                ? `<div class="project-links">${renderPubLinks([{ label: p.urlLabel || "Link", url: p.url }])}</div>`
                : ""
            }
            </div>
          </li>`
          )
          .join("")}
      </ul>`;
  }

  function renderAwards() {
    const items = CONTENT[currentLang].awards.filter((item) => window.SiteVisibility.allows(item));
    const title = CONTENT[currentLang].sections.awards;

    if (!items || items.length === 0) {
      document.getElementById("awards").innerHTML = `
        <h2 class="section-title">${escapeHtml(title)}</h2>
        <p class="placeholder-msg">${escapeHtml(CONTENT[currentLang].placeholder)}</p>`;
      return;
    }

    document.getElementById("awards").innerHTML = `
      <h2 class="section-title">${escapeHtml(title)}</h2>
      <ul class="award-list">
        ${items
          .map(
            (a) => `
          <li class="award-item">
            <span class="award-year">${escapeHtml(a.year)}</span>
            ${escapeHtml(a.text)}
          </li>`
          )
          .join("")}
      </ul>`;
  }

  function renderFooter() {
    const footer = CONTENT[currentLang].footer;
    const updated = getSiteUpdatedLabel(currentLang);
    let text;
    if (!updated) {
      text = footer.fallback || footer.prefix;
    } else if (currentLang === "zh") {
      text = `${footer.prefix}${updated}`;
    } else {
      text = `${footer.prefix} ${updated}`;
    }
    document.getElementById("footer-text").textContent = text;
  }

  function updateMeta() {
    const meta = CONTENT[currentLang].meta;
    document.title = meta.title;
    document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
    document
      .querySelector('meta[name="description"]')
      .setAttribute("content", meta.description);
  }

  function renderAll() {
    updateMeta();
    renderNav();
    renderAbout();
    renderPublications();
    renderTimeline("education", "education");
    renderNews();
    renderTimeline("experience", "experience");
    renderProjects();
    renderAwards();
    renderFooter();
    window.PageUI?.refresh();
  }

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    renderAll();
  }

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });

  /**
   * 立即渲染主页，独立启动地区和更新时间查询，避免外部请求阻塞内容。
   *
   * Returns:
   *   void: 启动互不依赖的异步更新。
   */
  function bootstrap() {
    setLang(currentLang);
    window.SiteVisibility.resolveCountry();
    if (window.SiteUpdated) {
      window.SiteUpdated.init().then(() => {
        renderFooter();
        updatePubCitationStatus();
      }).catch(() => { /* 更新时间不可用时保留已有页脚，不影响地区判断。 */ });
    }
  }

  // 展开按钮始终位于作者名单之后，不因切换状态跳到列表上方。
  document.addEventListener("click", (event) => {
    const authorButton = event.target.closest?.("[data-authors-toggle]");
    if (authorButton) {
      const parent = authorButton.closest(".pub-authors");
      const expanded = authorButton.getAttribute("aria-expanded") !== "true";
      parent.querySelector(".authors-preview").hidden = expanded;
      parent.querySelector(".authors-full").hidden = !expanded;
      authorButton.setAttribute("aria-expanded", String(expanded));
      authorButton.textContent = expanded ? (currentLang === "zh" ? "收起" : "Show less") : authorButton.dataset.more;
    }
    if (event.target.closest?.("[data-news-toggle]")) {
      newsExpanded = !newsExpanded;
      renderNews();
      document.querySelector("[data-news-toggle]")?.focus();
    }
  });
  document.addEventListener("homepage:reveal-news", () => {
    newsExpanded = true;
    renderNews();
  });
  document.addEventListener("homepage:region-ready", () => {
    renderAll();
  });

  // 搜索定位论文时清除位次筛选，使目标论文一定可见。
  document.addEventListener("homepage:reveal-publication", () => {
    pubControlsState.filter = "all";
    savePubControlsState();
    renderPublications();
  });

  bootstrap();
})();
