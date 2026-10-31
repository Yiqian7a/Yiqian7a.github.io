(function () {
  "use strict";
  const dialog = document.createElement("dialog");
  dialog.className = "search-dialog";
  dialog.setAttribute("aria-labelledby", "search-title");
  dialog.innerHTML = `<div class="search-heading"><label id="search-title" for="page-search-input"></label><button type="button" class="search-close">Esc</button></div><input id="page-search-input" type="search" autocomplete="off"><p class="search-status" role="status"></p><div class="search-results"></div>`;
  document.body.appendChild(dialog);
  const input = dialog.querySelector("input");
  const results = dialog.querySelector(".search-results");
  let previousFocus;

  /**
   * 判断当前页面语言。
   *
   * Returns:
   *   boolean: 页面是否使用中文。
   */
  function isChinese() { return document.documentElement.lang.startsWith("zh"); }

  /**
   * 从现有双语内容构建搜索索引，不添加新的页面内容。
   *
   * Returns:
   *   Array: 包含显示文字、检索文本和目标锚点的结果集合。
   */
  function collectEntries() {
    const lang = isChinese() ? "zh" : "en";
    const data = CONTENT[lang];
    const entries = Object.entries(data.sections).filter(([key]) => document.getElementById(key) && !document.getElementById(key).hidden).map(([key, title]) => ({ title, target: key, group: isChinese() ? "栏目" : "Section", text: `${title} ${CONTENT.en.sections[key]} ${CONTENT.zh.sections[key]} ${key === "about" ? data.about.text + data.about.opportunity : ""}` }));
    for (const key of ["publications", "news", "education", "experience", "projects", "awards"]) {
      data[key].forEach((item, index) => {
        if (!window.SiteVisibility.allows(item)) return;
        const title = item.title || item.name || item.text || (item.parts || []).map((part) => part.text).join("");
        entries.push({ title, group: data.sections[key], target: key === "publications" ? `publication-${index}` : key, text: JSON.stringify([item, CONTENT.en[key][index], CONTENT.zh[key][index]]) });
      });
    }
    return entries;
  }

  /**
   * 关闭搜索并恢复触发控件的焦点。
   *
   * Returns:
   *   void: 更新对话框与焦点。
   */
  function closeSearch() { dialog.close(); previousFocus?.focus(); }

  /**
   * 定位搜索结果，必要时展开动态或恢复论文列表。
   *
   * Args:
   *   entry (Object): 搜索结果及其目标锚点。
   *
   * Returns:
   *   void: 将目标内容滚动到视口并赋予焦点。
   */
  function revealEntry(entry) {
    closeSearch();
    if (entry.target.startsWith("publication-")) document.dispatchEvent(new Event("homepage:reveal-publication"));
    if (entry.target === "news") document.dispatchEvent(new Event("homepage:reveal-news"));
    const target = document.getElementById(entry.target);
    if (!target) return;
    target.querySelectorAll("[data-authors-toggle][aria-expanded='false']").forEach((button) => button.click());
    target.querySelectorAll("details").forEach((item) => { item.open = true; });
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  /**
   * 根据关键词绘制结果；使用文本节点避免内容被作为 HTML 执行。
   *
   * Returns:
   *   void: 更新结果按钮和无障碍状态提示。
   */
  function drawResults() {
    const words = input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    const matches = collectEntries().filter((entry) => words.every((word) => entry.text.toLocaleLowerCase().includes(word)));
    results.replaceChildren();
    matches.forEach((entry) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "search-result";
      const title = document.createElement("span");
      title.textContent = entry.title;
      const group = document.createElement("small");
      group.textContent = entry.group;
      button.append(title, group);
      button.addEventListener("click", () => revealEntry(entry));
      results.appendChild(button);
    });
    dialog.querySelector(".search-status").textContent = matches.length ? (isChinese() ? `${matches.length} 条结果` : `${matches.length} results`) : (isChinese() ? "没有找到相关内容" : "No matching content");
  }

  /**
   * 更新双语控件名称与主题按钮状态。
   *
   * Returns:
   *   void: 同步页面工具栏和搜索框。
   */
  function refresh() {
    const zh = isChinese();
    const dark = document.documentElement.dataset.theme === "dark";
    document.querySelector("[data-search-label]").textContent = zh ? "搜索" : "Search";
    document.getElementById("search-toggle").setAttribute("aria-label", zh ? "搜索本站（Ctrl+K）" : "Search this site (Ctrl+K)");
    const themeButton = document.getElementById("theme-toggle");
    themeButton.textContent = dark ? "☀" : "☾";
    themeButton.setAttribute("aria-label", zh ? (dark ? "切换浅色主题" : "切换深色主题") : (dark ? "Switch to light theme" : "Switch to dark theme"));
    themeButton.title = themeButton.getAttribute("aria-label");
    dialog.querySelector("label").textContent = zh ? "搜索本站" : "Search this site";
    dialog.querySelector(".search-close").setAttribute("aria-label", zh ? "关闭搜索" : "Close search");
    input.placeholder = zh ? "搜索论文、作者、项目或经历…" : "Search papers, authors, projects or experience…";
    if (dialog.open) drawResults();
  }

  /**
   * 打开原生模态搜索框，浏览器负责焦点约束和 Escape 关闭。
   *
   * Returns:
   *   void: 显示搜索框并聚焦输入。
   */
  function openSearch() {
    if (dialog.open) return;
    previousFocus = document.activeElement;
    input.value = "";
    refresh();
    drawResults();
    dialog.showModal();
    input.focus();
  }

  document.getElementById("search-toggle").addEventListener("click", openSearch);
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("homepage-theme", theme); } catch (_) { /* 存储不可用时保留本次切换。 */ }
    refresh();
  });
  input.addEventListener("input", drawResults);
  dialog.querySelector(".search-close").addEventListener("click", closeSearch);
  dialog.addEventListener("click", (event) => { if (event.target === dialog) closeSearch(); });
  dialog.addEventListener("keydown", (event) => {
    const buttons = Array.from(results.querySelectorAll("button"));
    const index = buttons.indexOf(document.activeElement);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (buttons.length) buttons[(index + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length].focus();
    } else if (event.key === "Enter" && event.target === input) {
      event.preventDefault();
      buttons[0]?.click();
    }
  });
  document.addEventListener("keydown", (event) => {
    const editing = event.target.closest?.("input, textarea, select, [contenteditable='true']");
    if (((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") || (event.key === "/" && !editing)) {
      event.preventDefault();
      openSearch();
    }
  });
  window.PageUI = { refresh };
})();
