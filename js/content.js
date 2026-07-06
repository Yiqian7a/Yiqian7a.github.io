const SITE = {
  name: "Yuhao Liu",
  nameZh: "刘宇昊",
  email: "Yiqian7a@qq.com",
  photo: "assets/photo.svg",
  cvUrl: "assets/cv.pdf",
  cvAvailable: false,
  links: {
    github: "https://github.com/Yiqian7a",
    scholar: "https://scholar.google.com/",
    orcid: "https://orcid.org/",
    linkedin: "https://linkedin.com/in/",
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
      affiliation: "M.S. Candidate, Example University",
      bio: "I am a graduate student interested in machine learning and systems. My research focuses on building efficient and reliable AI systems.",
      cvLabel: "Download CV",
    },
    about: {
      text: "I am an undergraduate student interested in embodied AI and large language models, currently conducting research under the supervision of Prof. Yuexin Ma. I explore the intersection of machine learning and intelligent systems, with a focus on scalable training and deployment.",
      tagsLabel: "Research Interests",
      tags: ["Embodied AI", "Large Language Models", "Machine Learning"],
    },
    education: [
      {
        title: "B.S. in Statistics (Data Science and AI Program)",
        institution: "Shandong University (Weihai)",
        date: "2022 — 2026",
        detail: "GPA: X.XX / 4.0",
      },
    ],
    publications: [
      {
        year: "2026",
        title: "UniAfford: Token-Routed Multitask Learning for Generalizable 2D-3D Affordance Perception",
        authors: "Yuhao Liu, Yiming Zhong, Hanqing Wang, Shaocheng Yan, Yuhang Zhang, Wenzhou Lyu, Ziyang Ding, Wei Zhang, Xue Zhao, Jin Pan, Yuexin Ma*, Xinge Zhu",
        tldr: "A token-routed multitask framework for generalizable 2D-3D affordance perception, unifying multiple affordance tasks within a single model.",
        badges: [
          { text: "CVPR 2026", type: "venue" },
          { text: "Preprint", type: "status" },
        ],
        links: [
          { label: "PDF", url: "#" },
          { label: "Code", url: "https://github.com/Yiqian7a" },
        ],
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
    footer: "© 2026 Yuhao Liu. Last updated: July 2026.",
    linkLabels: {
      github: "GitHub",
      scholar: "Google Scholar",
      orcid: "ORCID",
      linkedin: "LinkedIn",
      email: "Email",
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
      bio: "我是一名对具身智能与大预言模型感兴趣的本科生，目前在马月昕老师的指导下进行研究。",
      cvLabel: "下载简历",
    },
    about: {
      text: "我是一名对具身智能与大语言模型感兴趣的本科生，目前在马月昕老师的指导下进行研究。我探索机器学习与智能系统的交叉领域，关注可扩展的训练与部署方法。",
      tagsLabel: "研究方向",
      tags: ["具身智能", "大语言模型", "机器学习"],
    },
    education: [
      {
        title: "统计学（数据科学与人工智能实验班） 学士",
        institution: "山东大学（威海）",
        date: "2022 — 2026",
        detail: "GPA：X.XX / 4.0",
      },
    ],
    publications: [
      {
        year: "2026",
        title: "UniAfford: Token-Routed Multitask Learning for Generalizable 2D-3D Affordance Perception",
        authors: "刘宇昊, 钟奕鸣, 王涵情, 颜绍程, 张宇航, 吕文周, 丁子杨, 张伟, 赵雪, 潘津, 马月昕*, 祝新革",
        tldr: "提出一种基于 token 路由的多任务学习框架，实现可泛化的 2D-3D 可供性感知，统一跨任务与跨模态学习。",
        badges: [

          { text: "投稿中", type: "status" },
        ],
        links: [
          { label: "PDF", url: "#" },
          { label: "Page", url: "https://4dvlab.github.io/UniAfford" },
        ],
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
    footer: "© 2026 刘宇昊。最后更新：2026 年 7 月。",
    linkLabels: {
      github: "GitHub",
      scholar: "Google Scholar",
      orcid: "ORCID",
      linkedin: "LinkedIn",
      email: "邮箱",
    },
  },
};
