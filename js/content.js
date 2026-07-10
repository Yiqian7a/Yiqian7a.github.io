const SITE = {
  name: "Yuhao Liu",
  nameZh: "刘宇昊",
  email: "Yiqian7a@qq.com",
  photo: "assets/photo.jpg",
  cvUrl: "assets/cv.pdf",
  cvAvailable: false,
  links: {
    github: "https://github.com/Yiqian7a",
    scholar: "https://scholar.google.com/",
    orcid: "https://orcid.org/",
    linkedin: "https://linkedin.com/in/",
  },
  repo: {
    owner: "Yiqian7a",
    name: "Yiqian7a.github.io",
    metaPath: "assets/site-updated.json",
  },
};

const CONTENT = {
  en: {
    meta: {
      title: "Yuhao Liu — Academic Homepage",
      description: "Research interests, publications, education, and contact.",
    },
    nav: {
      brand: "Yuhao Liu",
      about: "About",
      education: "Education",
      publications: "Publications",
      news: "News",
      experience: "Experience",
      projects: "Projects",
      awards: "Awards",
      contact: "Contact",
    },
    sections: {
      about: "About Me",
      education: "Education",
      publications: "Publications",
      news: "News",
      experience: "Experience",
      projects: "Projects",
      awards: "Awards & Honors",
      contact: "Contact",
    },
    hero: {
      affiliation: "Shandong University",
      bio: "From LLMs to embodied agents — pushing AI toward real-world impact.",
      cvLabel: "Download CV",
    },
    about: {
      text: "Hello, I am Yuhao Liu. I am currently working as a research assistant to Prof. Yuexin Ma at Shanghai University of Science and Technology, and I am preparing to apply for a Ph.D. program. I completed my undergraduate studies in statistics at Shandong University, within the program dedicated to data science and artificial intelligence. My research interests include computer vision, large language models, and embodied intelligence. I have one first-author preprint, and two additional papers available as preprints. I also completed a six-month research internship at Huawei’s automotive division, during which I worked on the research aspects related to that paper. I have led several end-to-end AI projects and have won numerous awards in competitions. I am committed to bridging the gap between cutting-edge AI research and its practical application, and I am actively seeking doctoral opportunities to further explore areas such as embodied intelligence, world models, and efficient AI systems.",
      tagsLabel: "Research Interests",
      tags: ["Embodied AI", "MLLMs", "World Model"],
    },
    education: [
      {
        title: "B.S. in Statistics (Data Science and AI Program)",
        institution: "Shandong University (Weihai)",
        date: "2022 — 2026",
        detail: "GPA：86.06 / 100",
      },
    ],
    publications: [
      {
        year: "2026",
        title: "UniAfford: Token-Routed Multitask Learning for Generalizable 2D-3D Affordance Perception",
        authors: "Yuhao Liu, Yiming Zhong, Hanqing Wang, Shaocheng Yan, Yuhang Zhang, Wenzhou Lyu, Ziyang Ding, Wei Zhang, Xue Zhao, Jin Pan, Yuexin Ma†, Xinge Zhu",
        tldr: "A token-routed multitask framework for generalizable 2D-3D affordance perception, unifying multiple affordance tasks within a single model.",
        figure: "assets/pubs/UniAfford.png",
        badges: [

          { text: "Preprint", type: "status" },
        ],
        links: [
          { label: "PDF", url: "" },
          { label: "Page", url: "https://4dvlab.github.io/UniAfford" },

        ],
        citations: 0,
      },
    ],
    news: [],
    experience: [],
    projects: [],
    awards: [],
    placeholder: "Coming soon — content to be added.",
    contact: {
      intro: "Feel free to reach out via email or the links below.",
    },
    footer: {
      prefix: "© 2026 Yuhao Liu.",
      fallback: "© 2026 Yuhao Liu.",
    },
    siteMeta: {
      lastUpdated: "Last updated: {time}.",
    },
    linkLabels: {
      github: "GitHub",
      scholar: "Google Scholar",
      orcid: "ORCID",
      linkedin: "LinkedIn",
      email: "Email",
    },
    pubLabels: {
      tldr: "TL;DR",
    },
    pubControls: {
      menuLabel: "Filter and sort publications",
      filterLabel: "Author role",
      sortLabel: "Sort by",
      filterAll: "All",
      filterFirst: "First author",
      filterCoFirst: "Co-first author",
      filterCorresponding: "Corresponding author",
      filterCoauthor: "Co-author",
      sortDefault: "Default",
      sortYearDesc: "Year (newest first)",
      sortYearAsc: "Year (oldest first)",
      sortCitationsDesc: "Citations (high → low)",
      citationsNote:
        "Use Refresh to manually query OpenAlex / Semantic Scholar (counts may differ from Scholar).",
      refreshCitations: "Refresh citations",
      refreshingCitations: "Refreshing…",
      refreshDone: "Updated {n}/{total} papers.",
      refreshFailed: "Could not refresh citations. Try again later.",
      emptyResult: "No publications match this filter.",
    },
  },

  zh: {
    meta: {
      title: "刘宇昊 — 学术主页",
      description: "研究方向、论文发表、教育背景与联系方式。",
    },
    nav: {
      brand: "刘宇昊",
      about: "关于",
      education: "教育背景",
      publications: "论文发表",
      news: "动态",
      experience: "经历",
      projects: "项目",
      awards: "荣誉",
      contact: "联系",
    },
    sections: {
      about: "关于我",
      education: "教育背景",
      publications: "论文发表",
      news: "最新动态",
      experience: "工作与研究经历",
      projects: "项目",
      awards: "荣誉与奖项",
      contact: "联系方式",
    },
    hero: {
      affiliation: "山东大学",
      bio: "从大模型到具身智能——让AI走向现实世界",
      cvLabel: "下载简历",
    },
    about: {
      text: "你好，我是刘宇昊。我目前在上海科技大学担任马月昕教授的研究助理，正在准备申请学术型博士。本科毕业于山东大学统计学专业（数据科学与人工智能实验班）。我的研究方向涵盖计算机视觉、大语言模型和具身智能。目前有一篇一作预印本，另有两篇非一作预印本。曾在华为车 BU 进行了为期六个月的科研实习，期间主要围绕一作论文的核心研究工作展开。我曾主导了多个全栈AI的工程项目，也获得了多项竞赛奖项。我致力于弥合前沿AI研究与实际部署之间的鸿沟，正在积极寻找博士机会，进一步探索具身智能、世界模型和高效AI系统方向。",
      tagsLabel: "研究方向",
      tags: ["具身智能", "多模态大模型", "世界模型"],
    },
    education: [
      {
        title: "统计学（数据科学与人工智能实验班） 学士",
        institution: "山东大学（威海）",
        date: "2022 — 2026",
        detail: "GPA：86.06 / 100",
      },
    ],
    publications: [
      {
        year: "2026",
        title: "UniAfford: Token-Routed Multitask Learning for Generalizable 2D-3D Affordance Perception",
        authors: "刘宇昊, 钟奕鸣, 王涵情, 颜绍程, 张宇航, 吕文周, 丁子杨, 张伟, 赵雪, 潘津, 马月昕†, 祝新革",
        tldr: "提出一种基于 token 路由的多任务学习框架，实现可泛化的 2D-3D 可供性感知，统一跨任务与跨模态学习。",
        figure: "assets/pubs/UniAfford.png",
        badges: [

          { text: "Preprint", type: "status" },
        ],
        links: [
          { label: "PDF", url: "" },
          { label: "Page", url: "https://4dvlab.github.io/UniAfford" },

        ],
        citations: 0,
      },
    ],
    news: [],
    experience: [],
    projects: [],
    awards: [],
    placeholder: "即将更新 — 内容待补充。",
    contact: {
      intro: "欢迎通过邮件或以下链接与我联系。",
    },
    footer: {
      prefix: "© 2026 刘宇昊。",
      fallback: "© 2026 刘宇昊。",
    },
    siteMeta: {
      lastUpdated: "最后更新：{time}。",
    },
    linkLabels: {
      github: "GitHub",
      scholar: "Google Scholar",
      orcid: "ORCID",
      linkedin: "LinkedIn",
      email: "邮箱",
    },
    pubLabels: {
      tldr: "TL;DR",
    },
    pubControls: {
      menuLabel: "筛选与排序论文",
      filterLabel: "作者位次",
      sortLabel: "排序",
      filterAll: "全部",
      filterFirst: "第一作者",
      filterCoFirst: "共同第一作者",
      filterCorresponding: "通讯作者",
      filterCoauthor: "合作作者",
      sortDefault: "默认顺序",
      sortYearDesc: "年份（新→旧）",
      sortYearAsc: "年份（旧→新）",
      sortCitationsDesc: "引用量（高→低）",
      citationsNote:
        "点击「更新引用量」手动从 OpenAlex / Semantic Scholar 获取（数值可能与 Google 学术不同）",
      refreshCitations: "更新引用量",
      refreshingCitations: "正在更新…",
      refreshDone: "已更新 {n}/{total} 篇论文。",
      refreshFailed: "引用量更新失败，请稍后再试。",
      emptyResult: "当前筛选条件下暂无论文。",
    },
  },
};
