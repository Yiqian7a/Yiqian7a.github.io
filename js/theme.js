// 在样式加载前恢复主题，避免深色模式下闪现白色页面。
{
  let theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  try {
    const saved = localStorage.getItem("homepage-theme");
    if (saved === "dark" || saved === "light") theme = saved;
  } catch (_) { /* 禁用存储时仍可使用系统主题。 */ }
  document.documentElement.dataset.theme = theme;
}
