/**
 * 论文链接图标（inline SVG）
 * content.js 中 links 可通过 icon 字段手动指定，否则按 label / url 自动匹配
 */
const PUB_LINK_ICONS = {
  pdf: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 1.5H4.5A1.5 1.5 0 003 3v10a1.5 1.5 0 001.5 1.5h7A1.5 1.5 0 0013 13V6L9 1.5z"/><path d="M9 1.5V6H13M5.5 8.5h5M5.5 11h5"/></svg>`,
  page: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.25"/><path d="M2.5 8h11M8 2.5a10.5 10.5 0 010 11M8 2.5a10.5 10.5 0 000 11"/></svg>`,
  code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 4.5L2.5 8l3 3.5M10.5 4.5l3 3.5-3 3.5"/></svg>`,
  openreview: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 3.5h11v9h-11z"/><path d="M5 7h6M5 9.5h4"/><circle cx="11.5" cy="9.5" r="1" fill="currentColor" stroke="none"/></svg>`,
  arxiv: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 1.5H4.5A1.5 1.5 0 003 3v10a1.5 1.5 0 001.5 1.5h7A1.5 1.5 0 0013 13V6L9 1.5z"/><path d="M9 1.5V6H13M5 8l2 2.5L5 13"/></svg>`,
  video: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="8.5" height="8" rx="1.2"/><path d="M10.5 6.5l3.5-2v7l-3.5-2"/></svg>`,
  external: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 3.5H3.5v9h9v-3M8.5 2.5h5v5M7 9l6.5-6.5"/></svg>`,
};

function resolvePubLinkIcon(link) {
  if (link.icon && PUB_LINK_ICONS[link.icon]) return link.icon;

  const label = (link.label || "").toLowerCase();
  const url = (link.url || "").toLowerCase();

  if (label === "pdf" || url.endsWith(".pdf")) return "pdf";
  if (label === "page" || label === "project" || label === "homepage") return "page";
  if (label === "code" || label === "github") return "code";
  if (label.includes("openreview") || url.includes("openreview.net")) return "openreview";
  if (label.includes("arxiv") || url.includes("arxiv.org")) return "arxiv";
  if (label === "video" || url.includes("youtube.com") || url.includes("youtu.be")) return "video";
  if (url.includes("github.com")) return "code";

  return "external";
}

function getPubLinkIconHtml(link) {
  const key = resolvePubLinkIcon(link);
  return PUB_LINK_ICONS[key] || PUB_LINK_ICONS.external;
}
