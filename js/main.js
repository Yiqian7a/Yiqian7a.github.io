(function () {
  "use strict";

  const LANG_KEY = "homepage-lang";
  let currentLang = localStorage.getItem(LANG_KEY) || "en";

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
      { id: "contact", label: nav.contact },
    ];

    document.getElementById("nav-links").innerHTML = items
      .map(
        (item) =>
          `<li><a href="#${item.id}">${escapeHtml(item.label)}</a></li>`
      )
      .join("");
  }

  function renderHero() {
    const hero = CONTENT[currentLang].hero;
    const labels = CONTENT[currentLang].linkLabels;
    const name = currentLang === "zh" ? SITE.nameZh : SITE.name;

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
          `<li><a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label)}</a></li>`
      )
      .join("");

    const cvBtn =
      SITE.cvAvailable
        ? `<div class="hero-cv"><a class="btn-cv" href="${escapeHtml(SITE.cvUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(hero.cvLabel)}</a></div>`
        : "";

    document.getElementById("hero").innerHTML = `
      <img class="hero-photo" src="${escapeHtml(SITE.photo)}" alt="${escapeHtml(name)}" width="180" height="180">
      <div class="hero-body">
        <h1 class="hero-name">${escapeHtml(name)}</h1>
        <p class="hero-affiliation">${escapeHtml(hero.affiliation)}</p>
        <p class="hero-bio">${escapeHtml(hero.bio)}</p>
        <ul class="hero-links">${linkItems}</ul>
        ${cvBtn}
      </div>`;
  }

  function renderAbout() {
    const data = CONTENT[currentLang].about;
    const title = CONTENT[currentLang].sections.about;

    document.getElementById("about").innerHTML = `
      <h2 class="section-title">${escapeHtml(title)}</h2>
      <p class="about-text">${linkPeopleInText(data.text)}</p>
      <p class="about-tags-label">${escapeHtml(data.tagsLabel)}</p>
      <div class="interest-tags">
        ${data.tags.map((tag) => `<span class="interest-tag">${escapeHtml(tag)}</span>`).join("")}
      </div>`;
  }

  function renderTimeline(sectionId, dataKey) {
    const items = CONTENT[currentLang][dataKey];
    const title = CONTENT[currentLang].sections[dataKey];

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
          <li class="timeline-item">
            <div class="timeline-header">
              <p class="timeline-title">${escapeHtml(item.title)}</p>
              <span class="timeline-date">${escapeHtml(item.date)}</span>
            </div>
            <p class="timeline-subtitle">${escapeHtml(item.institution || item.company || "")}</p>
            ${item.detail ? `<p class="timeline-detail">${escapeHtml(item.detail)}</p>` : ""}
          </li>`
          )
          .join("")}
      </ul>`;
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

  function renderAuthors(authorsStr) {
    const names = authorsStr
      .split(/[,，]/)
      .map((s) => s.trim())
      .filter(Boolean);

    return names.map(renderAuthorName).join(", ");
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
        ${renderPubBadges(pub.badges)}
      </div>`;
  }

  function renderPubAside(pub) {
    if (!pub.figure) return "";
    const alt = pub.title ? `${pub.title} pipeline` : "Publication figure";
    return `
      <div class="pub-aside">
        ${renderPubHeader(pub)}
        <div class="pub-figure">
          <img class="pub-figure-zoomable" src="${escapeHtml(pub.figure)}" alt="${escapeHtml(alt)}" loading="lazy" draggable="false" tabindex="0" title="${currentLang === "zh" ? "点击查看大图" : "Click to enlarge"}">
        </div>
        ${renderPubLinks(pub.links)}
      </div>`;
  }

  function renderPublications() {
    const pubs = CONTENT[currentLang].publications;
    const title = CONTENT[currentLang].sections.publications;
    const tldrLabel = CONTENT[currentLang].pubLabels.tldr;

    document.getElementById("publications").innerHTML = `
      <h2 class="section-title">${escapeHtml(title)}</h2>
      <ul class="pub-list">
        ${pubs
          .map((pub) => {
            const hasFigure = Boolean(pub.figure);
            return `
          <li class="pub-item${hasFigure ? " pub-item-has-figure" : ""}">
            <div class="pub-layout">
              ${hasFigure ? renderPubAside(pub) : ""}
              <div class="pub-body">
                ${hasFigure ? "" : renderPubHeader(pub)}
                <p class="pub-title">${escapeHtml(pub.title)}</p>
                <p class="pub-authors">${renderAuthors(pub.authors)}</p>
                ${
                  pub.tldr
                    ? `<p class="pub-tldr"><span class="pub-tldr-label">${escapeHtml(tldrLabel)}</span> ${escapeHtml(pub.tldr)}</p>`
                    : ""
                }
                ${hasFigure ? "" : renderPubLinks(pub.links)}
              </div>
            </div>
          </li>`;
          })
          .join("")}
      </ul>`;
  }

  function renderNews() {
    const items = CONTENT[currentLang].news;
    const title = CONTENT[currentLang].sections.news;

    if (!items || items.length === 0) {
      document.getElementById("news").innerHTML = `
        <h2 class="section-title">${escapeHtml(title)}</h2>
        <p class="placeholder-msg">${escapeHtml(CONTENT[currentLang].placeholder)}</p>`;
      return;
    }

    document.getElementById("news").innerHTML = `
      <h2 class="section-title">${escapeHtml(title)}</h2>
      <ul class="news-list">
        ${items
          .map(
            (n) => `
          <li class="news-item">
            <span class="news-date">${escapeHtml(n.date)}</span>
            <span>${escapeHtml(n.text)}</span>
          </li>`
          )
          .join("")}
      </ul>`;
  }

  function renderProjects() {
    const items = CONTENT[currentLang].projects;
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
          <li class="project-item">
            <p class="project-name">${escapeHtml(p.name)}</p>
            <p class="project-desc">${escapeHtml(p.description)}</p>
            ${
              p.url
                ? `<div class="project-links"><a href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(p.urlLabel || "Link")}</a></div>`
                : ""
            }
          </li>`
          )
          .join("")}
      </ul>`;
  }

  function renderAwards() {
    const items = CONTENT[currentLang].awards;
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

  function renderContact() {
    const contact = CONTENT[currentLang].contact;
    const labels = CONTENT[currentLang].linkLabels;
    const title = CONTENT[currentLang].sections.contact;

    const links = [
      { url: `mailto:${SITE.email}`, label: `${labels.email}: ${SITE.email}` },
      { url: SITE.links.github, label: labels.github },
      { url: SITE.links.scholar, label: labels.scholar },
      { url: SITE.links.orcid, label: labels.orcid },
      { url: SITE.links.linkedin, label: labels.linkedin },
    ].filter((l) => l.url && !l.url.endsWith("/"));

    document.getElementById("contact").innerHTML = `
      <h2 class="section-title">${escapeHtml(title)}</h2>
      <p>${escapeHtml(contact.intro)}</p>
      <ul class="contact-links">
        ${links
          .map(
            (l) =>
              `<li><a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label)}</a></li>`
          )
          .join("")}
      </ul>`;
  }

  function renderFooter() {
    document.getElementById("footer-text").textContent =
      CONTENT[currentLang].footer;
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
    renderHero();
    renderAbout();
    renderPublications();
    renderTimeline("education", "education");
    renderNews();
    renderTimeline("experience", "experience");
    renderProjects();
    renderAwards();
    renderContact();
    renderFooter();
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

  setLang(currentLang);
})();
