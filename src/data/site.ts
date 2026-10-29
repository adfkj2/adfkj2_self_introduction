/** Only public profile information belongs here. Empty values stay hidden. */
export const profile = {
  handle: 'adfkj2',
  name: '李鹏',
  email: '3574089451@qq.com',
  phone: '19115858670',
  github: 'https://github.com/adfkj2',
  university: '四川大学',
  major: '计算机科学与技术',
  role: 'Java Backend Engineer & AI Agent Builder',
  resume: '', // Add a real PDF to public/ and set its site path here.
  icpNumber: '蜀ICP备2026064847号-1',
  icpUrl: 'https://beian.miit.gov.cn/',
};
export const site = {
  title: `${profile.handle} — Systems, memory & everything between.`,
  description: 'Java 后端与 AI Agent 开发者,记录可靠系统、长期记忆与检索增强生成的工程实践',
};
/** 首页状态条：只写可核实的信息，改这里即可更新展示。 */
export const availability = [
  { label: 'Now', value: '在读 · 四川大学 计算机科学与技术' },
  { label: 'Focus', value: 'Java 后端 & AI Agent' },
  { label: 'Open', value: '开放实习与校招交流' },
];
export const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'Writing', href: '/writing/' },
  { label: 'About', href: '/about/' },
];
export const topics = [
  {
    slug: 'backend',
    label: 'Backend Engineering',
    description: 'Java、Spring Boot 与业务系统的设计和实现。',
  },
  {
    slug: 'database',
    label: 'Database & Storage',
    description: 'MySQL、PostgreSQL、向量存储与一致性边界。',
  },
  { slug: 'ai', label: 'AI Agents & RAG', description: '长期记忆、语义检索和有证据的智能体系统。' },
  {
    slug: 'systems',
    label: 'Systems & Infrastructure',
    description: 'Linux、系统设计、部署与可复现的工程验证。',
  },
];
