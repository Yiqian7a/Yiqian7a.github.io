(function () {
  "use strict";
  let country = "";
  let resolved = false;
  let pending = null;
  let provider = "";
  let errors = [];

  /**
   * 根据条目自己的国家黑名单决定展示；查询失败或地区未知时隐藏受限条目。
   *
   * Args:
   *   item (Object): 可选含 blockedCountries 国家代码数组的内容条目。
   *
   * Returns:
   *   boolean: 是否允许在页面和搜索结果中展示。
   */
  function allows(item) {
    if (item.blockedCountries === undefined) return true;
    if (!Array.isArray(item.blockedCountries)) return false;
    if (item.blockedCountries.length === 0) return true;
    // 配置非空黑名单后，必须先确认地区；未知地区不能按未命中黑名单放行。
    return resolved && /^[A-Z]{2}$/.test(country)
      && !item.blockedCountries.includes(country);
  }

  /**
   * 通过访客出口 IP 获取国家代码，不使用语言或时区猜测地区。
   *
   * Returns:
   *   Promise<void>: 查询完成后通知页面更新；失败保持受限条目隐藏。
   */
  async function queryCountry() {
    country = "";
    resolved = false;
    provider = "";
    errors = [];
    document.dispatchEvent(new Event("homepage:region-ready"));
    // 备用接口仅在主接口失败时调用，不保存或输出返回的 IP。
    // 文档：https://ipapi.co/api/ 和 https://country.is/
    for (const source of [
      { name: "ipapi", url: "https://ipapi.co/country/", json: false },
      { name: "country.is", url: "https://api.country.is/", json: true },
    ]) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4000);
      try {
        const response = await fetch(source.url, {
          signal: controller.signal, credentials: "omit", referrerPolicy: "no-referrer", cache: "no-store",
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const raw = source.json ? (await response.json()).country : await response.text();
        const value = String(raw || "").trim().toUpperCase();
        if (!/^[A-Z]{2}$/.test(value) || ["XX", "ZZ", "EU", "T1"].includes(value)) throw new Error("Unknown country");
        country = value;
        provider = source.name;
        break;
      } catch (error) {
        errors.push({ provider: source.name, reason: error.name === "AbortError" ? "Timeout" : error.message });
      } finally {
        clearTimeout(timer);
      }
    }
    resolved = true;
    document.dispatchEvent(new Event("homepage:region-ready"));
  }

  /**
   * 合并并发查询；可手动再次调用以更新切换 VPN 后的地区。
   *
   * Returns:
   *   Promise<void>: 当前查询完成的 Promise。
   */
  function resolveCountry() {
    if (!pending) pending = queryCountry().finally(() => { pending = null; });
    return pending;
  }

  /**
   * 提供只读诊断快照，便于排查接口错误或出口地区误判。
   *
   * Returns:
   *   Object: 国家代码、查询状态、来源和错误，不包含访客 IP。
   */
  function getStatus() {
    return { country, resolved, provider, errors: errors.map((error) => ({ ...error })) };
  }

  window.SiteVisibility = { allows, resolveCountry, getStatus };
})();
