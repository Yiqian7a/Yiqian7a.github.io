const SITE = {
  name: "Yuhao Liu",
  nameZh: "刘宇昊",
  email: "Yiqian7a@qq.com",
  photo: "assets/photo.webp",
  cvUrl: "assets/cv.pdf",
  cvAvailable: false,
  links: {
    github: "https://github.com/Yiqian7a",
    scholar: "https://scholar.google.com/citations?user=bjwmUaQAAAAJ&hl=zh-CN",
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
      affiliation: "Research Assistant · ShanghaiTech University",
      bio: "From LLMs to embodied agents — pushing AI toward real-world impact.",
      cvLabel: "Download CV",
    },
    about: {
      text: "Hello, I am Yuhao Liu. I received my bachelor's degree in Statistics from Shandong University through the Data Science and Artificial Intelligence Experimental Program. I am currently a research assistant working with Prof. Yuexin Ma at ShanghaiTech University. My research interests focus on embodied AI, multimodal large models, and world models, exploring how intelligent agents understand their environments and act upon them.",
      opportunity: "I am seeking Ph.D. opportunities in these research areas. Please feel free to get in touch!",
      tagsLabel: "Research Interests",
      tags: ["Embodied AI", "Multimodal Large Models", "World Models"],
    },
    education: [
      {
        title: "B.S. in Statistics",
        institution: "Shandong University",
        logo: "assets/sdu-logo.svg",
        date: "2022 — 2026",
      },
    ],
    publications: [
      {
        year: "2026",
        title: "UniAfford: Token-Routed Multitask Learning for Generalizable 2D-3D Affordance Perception",
        authors: "Yuhao Liu, Yiming Zhong, Hanqing Wang, Shaocheng Yan, Yuhang Zhang, Wenzhou Lyu, Ziyang Ding, Wei Zhang, Xue Zhao, Jin Pan, Yuexin Ma†, Xinge Zhu",
        tldr: "A token-routed multitask framework for generalizable 2D-3D affordance perception, unifying multiple affordance tasks within a single model.",
        figure: "assets/pubs/UniAfford.png",
        figureThumb: "assets/pubs/UniAfford.thumb.webp",
        figureSize: [640, 290],
        preprint: true,
        badges: [
          { text: "Preprint", type: "status" },
        ],
        links: [
          { label: "Page", url: "https://4dvlab.github.io/UniAfford" },
          { label: "arXiv", url: "https://arxiv.org/abs/2609.37264" },
        ],
        citations: 0,
      },
      // 录用信息见 arXiv 与作者主页；保留论文原始作者顺序。
      {
        year: "2026",
        title: "CoLVR: Enhancing Exploratory Latent Visual Reasoning via Contrastive Optimization",
        authors: "Ziyang Ding, Linjian Meng, Yiming Wu, Yuhan Li, Yuhao Liu, Zhen Zhao",
        tldr: "Latent contrastive training and trajectory-level reinforcement learning improve exploratory visual reasoning in multimodal large language models.",
        preprint: false,
        // 原图来自 https://raw.githubusercontent.com/Oscar-dzy/CoLVR/main/assets/framework.png
        figure: "assets/pubs/CoLVR.png",
        figureThumb: "assets/pubs/CoLVR.thumb.webp",
        figureSize: [640, 449],
        badges: [
          { text: "NeurIPS", type: "venue" },
        ],
        links: [
          { label: "arXiv", url: "https://arxiv.org/abs/2605.08802" },
          { label: "Code", url: "https://github.com/Oscar-dzy/CoLVR" },
        ],
      },
      {
        year: "2026",
        title: "VideoAfford: Grounding 3D Affordance from Human-Object-Interaction Videos via Multimodal Large Language Model",
        authors: "Hanqing Wang, Mingyu Liu, Xiaoyu Chen, Chengwei MA, Yiming Zhong, Wenti Yin, Yuhao Liu, Zhiqing Cui, Jiahao Yuan, Lu Dai, Zhiyuan Ma†, Hui Xiong†",
        tldr: "Introduces the VIDA dataset and a multimodal framework that learns 3D affordance grounding from human-object interaction videos using latent action priors and a spatial-aware loss.",
        preprint: false,
        // 原图来自 https://hq-king.github.io/images/videoafford.png
        figure: "assets/pubs/VideoAfford.png",
        figureThumb: "assets/pubs/VideoAfford.thumb.webp",
        figureSize: [640, 220],
        badges: [
          { text: "NeurIPS", type: "venue" },
        ],
        links: [
          { label: "arXiv", url: "https://arxiv.org/abs/2602.09638" },
        ],
      },
    ],
    news: [
      {
        date: "2026",
        parts: [
          { text: "🎉 " },
          { text: "CoLVR", url: "https://arxiv.org/abs/2605.08802" },
          { text: " and " },
          { text: "VideoAfford", url: "https://arxiv.org/abs/2602.09638" },
          { text: " were accepted by NeurIPS 2026!" },
        ],
      },
    ],
    experience: [
      {
        title: "Research Assistant Intern",
        company: "4DVLab",
        // 官网原始图标：https://4dvlab.github.io/imgs/logo.png
        logo: "assets/4dvlab-logo.webp",
        logoTheme: "dark",
        url: "https://4dvlab.github.io/",
        date: "2026.07 — Present",
      },
      // 每条内容独立配置国家黑名单；这是展示偏好，不代表政策适用判断。
      {
        title: "Research Intern",
        company: "Yinwang",
        // 官网导航原始图标：https://www.yinwang.com/marketingcloud/pep/asset/20000004/yinwang/img/g.png
        logo: "assets/yinwang-logo.png",
        url: "https://www.yinwang.com/cn/",
        date: "2025.11 — 2026.06",
        // 按已核实的华为相关限制设置展示偏好，非个人申请限制或完整制裁名单。
        // 美国、英国、加拿大、澳大利亚、德国、瑞典；中英文条目保持一致。
        blockedCountries: ["US", "GB", "CA", "AU", "DE", "SE"],
      },
    ],
    projects: [
      {
        name: "AI Cat Feeder",
        year: "2023",
        description: "An outdoor smart feeder that automatically detects stray cats and dispenses food. Built with NanoDet, ncnn, and OpenCV on an Orange Pi 3 LTS running Ubuntu 22.04, integrating embedded visual recognition with sensors and feeding control.",
        image: "assets/projects/ai-cat-feeder.png",
        imageThumb: "assets/projects/ai-cat-feeder.thumb.webp",
        imageSize: [640, 360],
        imageAlt: "AI Cat Feeder project poster",
        url: "https://github.com/Yiqian7a/AI-Cat-Feeder",
        urlLabel: "GitHub",
      },
    ],
    awards: [
      { year: "2026", text: "Outstanding Graduate, Shandong University, Class of 2026" },
      { year: "2024", text: "Second Prize, ASC24 Student Supercomputer Challenge" },
      { year: "2024", text: "National Second Prize, 14th MathorCup Mathematical Application Challenge" },
    ],
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
      affiliation: "研究助理 · 上海科技大学",
      bio: "从大模型到具身智能——让AI走向现实世界",
      cvLabel: "下载简历",
    },
    about: {
      text: "你好，我是刘宇昊，本科毕业于山东大学统计学专业（数据科学与人工智能实验班），目前在上海科技大学担任马月昕教授的研究助理。我的研究兴趣集中在具身智能、多模态大模型与世界模型，探索智能体如何理解环境并据此采取行动。",
      opportunity: "正在寻找相关研究方向的博士机会，欢迎联系！",
      tagsLabel: "研究方向",
      tags: ["具身智能", "多模态大模型", "世界模型"],
    },
    education: [
      {
        title: "统计学学士",
        institution: "山东大学",
        logo: "assets/sdu-logo.svg",
        date: "2022 — 2026",
      },
    ],
    publications: [
      {
        year: "2026",
        title: "UniAfford: Token-Routed Multitask Learning for Generalizable 2D-3D Affordance Perception",
        authors: "刘宇昊, 钟奕鸣, 王涵情, 颜绍程, 张宇航, 吕文周, 丁子杨, 张伟, 赵雪, 潘津, 马月昕†, 祝新革",
        tldr: "提出一种基于 token 路由的多任务学习框架，实现可泛化的 2D-3D 可供性感知，统一跨任务与跨模态学习。",
        figure: "assets/pubs/UniAfford.png",
        figureThumb: "assets/pubs/UniAfford.thumb.webp",
        figureSize: [640, 290],
        preprint: true,
        badges: [
          { text: "Preprint", type: "status" },
        ],
        links: [
          { label: "Page", url: "https://4dvlab.github.io/UniAfford" },
          { label: "arXiv", url: "https://arxiv.org/abs/2609.37264" },
        ],
        citations: 0,
      },
      // 已确认的中文姓名沿用现有条目；其余作者保留英文姓名，避免按拼音猜测。
      {
        year: "2026",
        title: "CoLVR: Enhancing Exploratory Latent Visual Reasoning via Contrastive Optimization",
        authors: "丁子杨, Linjian Meng, Yiming Wu, Yuhan Li, 刘宇昊, Zhen Zhao",
        tldr: "通过潜在空间对比训练与轨迹级强化学习，增强多模态大语言模型在潜在视觉推理中的探索能力。",
        preprint: false,
        figure: "assets/pubs/CoLVR.png",
        figureThumb: "assets/pubs/CoLVR.thumb.webp",
        figureSize: [640, 449],
        badges: [
          { text: "NeurIPS", type: "venue" },
        ],
        links: [
          { label: "arXiv", url: "https://arxiv.org/abs/2605.08802" },
          { label: "Code", url: "https://github.com/Oscar-dzy/CoLVR" },
        ],
      },
      {
        year: "2026",
        title: "VideoAfford: Grounding 3D Affordance from Human-Object-Interaction Videos via Multimodal Large Language Model",
        authors: "王涵情, Mingyu Liu, Xiaoyu Chen, Chengwei MA, 钟奕鸣, Wenti Yin, 刘宇昊, Zhiqing Cui, Jiahao Yuan, Lu Dai, Zhiyuan Ma†, Hui Xiong†",
        tldr: "构建 VIDA 数据集，结合潜在动作先验与空间感知损失，使多模态大语言模型能够从人–物交互视频中学习三维可供性定位与推理。",
        figure: "assets/pubs/VideoAfford.png",
        figureThumb: "assets/pubs/VideoAfford.thumb.webp",
        figureSize: [640, 220],
        preprint: false,
        badges: [
          { text: "NeurIPS", type: "venue" },
        ],
        links: [
          { label: "arXiv", url: "https://arxiv.org/abs/2602.09638" },
        ],
      },
    ],
    news: [
      {
        date: "2026",
        parts: [
          { text: "🎉 " },
          { text: "CoLVR", url: "https://arxiv.org/abs/2605.08802" },
          { text: " 和 " },
          { text: "VideoAfford", url: "https://arxiv.org/abs/2602.09638" },
          { text: " 被 NeurIPS 2026 录用！" },
        ],
      },
    ],
    experience: [
      {
        title: "科研助理实习生",
        company: "4DVLab",
        logo: "assets/4dvlab-logo.webp",
        logoTheme: "dark",
        url: "https://4dvlab.github.io/",
        date: "2026.07 — 至今",
      },
      // 与英文条目保持一致；地区筛选同时作用于页面和搜索。
      {
        title: "科研实习生",
        company: "引望",
        logo: "assets/yinwang-logo.png",
        url: "https://www.yinwang.com/cn/",
        date: "2025.11 — 2026.06",
        blockedCountries: ["US", "GB", "CA", "AU", "DE", "SE"],
      },
    ],
    projects: [
      {
        name: "人工智能自动喂猫机",
        year: "2023",
        description: "面向流浪猫的户外智能喂食设备，可自动识别猫咪并投放猫粮。基于 NanoDet、ncnn 与 OpenCV，在搭载 Ubuntu 22.04 的 Orange Pi 3 LTS 开发板上部署视觉识别，结合传感器与投喂控制，实现嵌入式 AI 的实际应用。",
        image: "assets/projects/ai-cat-feeder.png",
        imageThumb: "assets/projects/ai-cat-feeder.thumb.webp",
        imageSize: [640, 360],
        imageAlt: "人工智能自动喂猫机项目展示海报",
        url: "https://github.com/Yiqian7a/AI-Cat-Feeder",
        urlLabel: "GitHub",
      },
    ],
    awards: [
      { year: "2026", text: "山东大学2026届优秀毕业生" },
      { year: "2024", text: "ASC24世界大学生超级计算机竞赛二等奖" },
      { year: "2024", text: "第十四届MathorCup数学应用挑战赛全国二等奖" },
    ],
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
