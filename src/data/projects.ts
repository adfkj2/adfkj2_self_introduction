export interface ProjectSection {
  id: string;
  label: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  note?: string;
}
/** 真实界面截图：放在 public/shots/ 下，caption 说明画面内容与脱敏处理。 */
export interface ProjectShot {
  src: string;
  alt: string;
  caption?: string;
}
/** 详情页摘要：只写能对照源码与文档确认的内容。 */
export interface ProjectSummaryItem {
  label: string;
  value: string;
}
export interface Project {
  slug: 'dive' | 'medical' | 'tickets' | 'better-one';
  name: string;
  subtitle: string;
  description: string;
  focus: string;
  category: 'ai' | 'backend' | 'exploration';
  status: string;
  statusKind?: string;
  tags: string[];
  github?: string;
  compact?: boolean;
  architecture: string[];
  sections: ProjectSection[];
  sourceNote: string;
  shots?: ProjectShot[];
  summary?: ProjectSummaryItem[];
}
export const projects: Project[] = [
  {
    slug: 'dive',
    name: 'D.I.V.E.',
    subtitle: 'Long-term AI Memory System',
    description:
      '让交互沉淀为记忆，让记忆成为下一次推理的起点。探索长期记忆的形成、演化与语义检索。',
    focus: '记忆生命周期 · 一致性边界 · 可复核实验',
    summary: [
      { label: '角色', value: '独立设计与实现' },
      { label: '技术栈', value: 'Python · 本地存储 · 记忆与检索模块' },
      { label: '范围', value: '记忆的形成、演化与语义检索，服务本地项目协作' },
      { label: '证据', value: '100K 规模实验记录；性能与并发结论未逐项复核' },
    ],
    category: 'ai',
    status: '持续迭代',
    tags: ['Python', 'PostgreSQL', 'pgvector', 'AI Memory'],
    github: 'https://github.com/adfkj2/D.I.V.E.Program_Sanofi',
    architecture: ['Interaction', 'Memory Formation', 'Semantic Retrieval', 'Context Packing'],
    sourceNote:
      '依据项目需求与公开仓库 README 整理。当前本地助手默认采用 SQLite；PostgreSQL / pgvector 属于存储与检索工程方向，具体适用范围以仓库文档为准。',
    sections: [
      {
        id: 'problem',
        label: 'PROBLEM',
        title: '对话会结束，项目上下文不应该归零。',
        paragraphs: [
          '跨越多次交互的开发任务，需要保留已确认的事实、决策依据和项目进展。仅仅累加聊天历史，会遇到上下文窗口、信息过期和来源难以追溯的问题。',
          'D.I.V.E. 围绕一个更具体的问题展开：如何让记忆成为可写入、可更新、可检索，也可审阅的系统状态？',
        ],
      },
      {
        id: 'solution',
        label: 'SOLUTION',
        title: '将记忆当作基础设施。',
        paragraphs: [
          '把交互、记忆形成、版本演化、检索和上下文打包拆为独立环节。当前公开仓库已演进为本地项目助手：读取项目资料、提出变更、确认执行，再保存进展，供下一次协作使用。',
        ],
        bullets: [
          'Memory Formation：区分对话内容与已确认事实，保留来源。',
          'Memory Evolution：围绕更新、删除、版本和时间边界管理长期状态。',
          'Semantic Retrieval：为当前请求检索相关证据，而非搬运全部历史。',
          'Context Packing：在有限上下文中组织记忆、来源与近期交互。',
        ],
      },
      {
        id: 'architecture',
        label: 'ARCHITECTURE',
        title: '从一次交互，到可延续的上下文。',
        paragraphs: [
          '下图是核心记忆链路的概念视图，不代表在线服务部署拓扑。公开仓库中的助手按模型接口、工具循环、项目工具适配和记忆存储分层；助手编排与评测链路独立迭代。',
        ],
      },
      {
        id: 'decisions',
        label: 'ENGINEERING DECISIONS',
        title: '可解释的边界，比堆叠能力更重要。',
        bullets: [
          '将事实、来源与版本关联，避免检索结果脱离其形成过程。',
          '将提案与执行分离；公开助手在用户确认后写入并读回核验。',
          '将本地优先的助手存储，与 PostgreSQL 等服务端验证场景区分。',
          'Embedding Lifecycle 涉及模型版本、重建和失效管理；具体支持情况须核对对应实现与实验记录。',
        ],
      },
      {
        id: 'implementation',
        label: 'IMPLEMENTATION',
        title: '记忆、工具与验证，各自有清晰职责。',
        paragraphs: [
          '当前 README 描述了持久对话、项目待办、记忆版本、来源与交接资料。模型连接失败保留输入并暴露原因，助手操作限定在本地个人项目工具范围内。',
          '工程审阅重点包括记忆更新与删除的一致性、重复确认的幂等性、检索可见性，以及存储故障如何传递到调用层。并发正确性与性能属于需要独立验证的范围。',
        ],
      },
      {
        id: 'experiments',
        label: 'EXPERIMENTS',
        title: '记录实验，也记录实验不能证明的事。',
        paragraphs: [
          '项目曾开展 100K 数据规模实验。这里的 100K 指实验记录规模，不是在线用户数，也不表示所有并发与性能测试通过。',
          '本网站不展示未经逐项核对的耗时、吞吐量或准确率。复核指标时，需要同时读取数据集、硬件与模型、代码版本、命令、原始产物和失败记录。',
        ],
        note: '100K = 实验数据规模。当前页面没有足够的完整测试条件来给出可比较的性能结论。历史实验与当前产品默认实现须分别理解。',
      },
      {
        id: 'limitations',
        label: 'LIMITATIONS',
        title: '真实使用的可靠性，仍需持续验证。',
        bullets: [
          '当前助手面向本地个人项目；没有云同步与多人权限。',
          '尚不执行代码、联网搜索或修改用户仓库文件。',
          '有来源不等于回答正确；开发集自评不能替代独立保留集与真实用户观察。',
          '100K 实验不能推导为生产容量，也不能外推为并发 SLA。',
        ],
      },
      {
        id: 'repository',
        label: 'REPOSITORY',
        title: '从源码与证据开始复核。',
        paragraphs: [
          '实现、架构决策、运行手册和实验原始记录集中维护在 GitHub 仓库。本页是工程导航，最新状态与具体结论请以对应版本的源码和记录为准。',
        ],
      },
    ],
  },
  {
    slug: 'medical',
    name: 'Medical QA Agent',
    subtitle: 'Medical Knowledge QA Agent',
    description: '将文档检索与知识图谱路径连接起来。让每一次生成，都能回到可追溯的证据。',
    focus: '混合检索 · 证据重排 · 受约束生成',
    summary: [
      { label: '角色', value: '独立实现的研究 Demo' },
      { label: '技术栈', value: 'Python · FAISS / BGE-M3 可选 · 规则重排' },
      { label: '范围', value: '药品标签检索与图谱路径，受约束生成并返回来源' },
      { label: '证据', value: 'README 给出离线验收方法；本站未重跑模型与外部接口' },
    ],
    category: 'ai',
    status: 'Research demo',
    tags: ['RAG', 'FAISS', 'BGE-M3', 'Knowledge Graph'],
    github: 'https://github.com/adfkj2/medical-qa-agent',
    architecture: ['Retrieval', 'Reranking', 'Generation'],
    sourceNote: '依据公开仓库 README 整理。BGE-M3 与 FAISS 是可选适配；内置数据为小型演示子集。',
    sections: [
      {
        id: 'problem',
        label: 'PROBLEM',
        title: '回答流畅，不等于证据充分。',
        paragraphs: [
          '医药知识问答需要区分药品标签事实、关系路径与模型生成。脱离检索来源的答案难以核验，证据不足时继续生成还可能补出不存在的事实。',
          '这个研究 Demo 探索：如何把答案、证据、来源和关系路径作为同一个响应的一部分。',
        ],
      },
      {
        id: 'solution',
        label: 'SOLUTION',
        title: '先找到证据，再组织回答。',
        paragraphs: [
          '以 Graph-Augmented RAG 为思路，并行获取药品标签文本与知识图谱路径，融合候选后执行规则重排，只基于可用证据生成回答。',
        ],
        bullets: [
          '公开 DailyMed / openFDA 标签信息作为演示文档来源。',
          'RTX-KG2 风格三元组用于关系路径演示，不等于接入完整图谱。',
          '证据不足明确返回 insufficient evidence。',
        ],
      },
      {
        id: 'architecture',
        label: 'ARCHITECTURE',
        title: 'Retrieval → Reranking → Generation',
        paragraphs: [
          '查询分析后，向量检索与图谱检索共同提供候选；重排按语义、实体命中、来源和标签 section 组织证据，再进入受约束生成。',
        ],
      },
      {
        id: 'decisions',
        label: 'ENGINEERING DECISIONS',
        title: '让系统的实际运行方式可见。',
        bullets: [
          'FAISS 与 BGE-M3 适配可选；缺少依赖时提供 NumPy cosine search 与确定性 hash embedding 后备。',
          '配置兼容 LLM 接口后可调用模型；请求失败降级为抽取式回答。',
          'generation_mode 区分模型生成、离线摘要、失败降级与证据不足。',
          'LangChain 属于相关技术方向；当前 README 所述链路为模块化 Python 工程，不将其列为已验证核心依赖。',
        ],
      },
      {
        id: 'implementation',
        label: 'IMPLEMENTATION',
        title: '把可核查的响应放在接口中心。',
        paragraphs: [
          '仓库提供 CLI、中文桌面 GUI 和可选 FastAPI 接口。响应包含 answer、evidence、sources、reasoning_path 和 generation_mode。',
          '文档清洗、分块、混合检索、候选融合和规则重排分开组织。外部文档与三元组可以通过 JSONL 文件导入。',
        ],
      },
      {
        id: 'experiments',
        label: 'VALIDATION',
        title: '离线可复现，与真实接口验证分开。',
        paragraphs: [
          '公开 README 给出了内置问题、离线抽取模式、证据不足和模型失败降级的验收方法。网站本身没有重新运行模型或外部 API，因而不把这些方法描述为本次通过的测试。',
        ],
        note: '本项目是研究 / Demo 系统，未经临床验证，不用于医疗诊断、处方或个体用药决策。',
      },
      {
        id: 'limitations',
        label: 'LIMITATIONS',
        title: '小型证据集的边界必须清楚。',
        bullets: [
          '内置数据仅覆盖少量药品，不是完整 openFDA 数据库或完整 RTX-KG2。',
          '存在引用不意味着医学结论正确；来源覆盖、时效与关系质量仍需独立评估。',
          '不提供临床效果、线上用户量或真实医疗环境验证的声明。',
        ],
      },
      {
        id: 'repository',
        label: 'REPOSITORY',
        title: '查看链路、数据格式与降级行为。',
        paragraphs: [
          '仓库 README 提供模块结构、运行方式、配置说明与验收步骤。阅读时请同时检查可选依赖与实际 generation_mode。',
        ],
      },
    ],
  },
  {
    slug: 'tickets',
    name: 'Intelligent Service Desk',
    subtitle: 'Enterprise IT Service Desk · Spring Boot + Spring AI',
    description: '把报障、接单、指派、知识沉淀与只读 AI 助手，收进同一条可追溯的业务链路。',
    focus: '模块化单体 · 状态机 · 只读 AI 工具',
    summary: [
      { label: '角色', value: '独立完成后端与管理台' },
      { label: '技术栈', value: 'Java 21 · Spring Boot 3.5 · Spring AI · MyBatis · MySQL · Vue 3' },
      { label: '范围', value: '工单全流程、知识库、三角色权限与只读 AI 助手' },
      { label: '证据', value: 'README 声明 68 个自动化用例；本站未重新执行' },
    ],
    shots: [
      {
        src: '/shots/isd-workbench.webp',
        alt: '智能服务台工作台：四张状态统计卡与最近工单列表，左侧是工作台、工单池、知识库、用户管理菜单。',
        caption: '工作台：待接单、处理中、已解决、已关闭的统计与最近工单，菜单按角色裁剪。',
      },
      {
        src: '/shots/isd-ai-assistant.webp',
        alt: '右下角 AI 助手抽屉：回答「我的工单处理到哪了？」，列出当前用户处理中与已关闭的工单。',
        caption: 'AI 助手：只读取当前登录用户的数据，回答里带工单号与状态，不执行任何写操作。',
      },
    ],
    category: 'backend',
    status: '持续迭代',
    compact: true,
    tags: ['Java 21', 'Spring Boot', 'Spring AI', 'MyBatis', 'MySQL', 'Vue 3'],
    github: 'https://github.com/adfkj2/intelligent-service-desk',
    architecture: [
      'Session / RBAC',
      'Ticket State Machine',
      'Knowledge Base',
      'Read-only AI Tools',
      'MySQL + Flyway',
    ],
    sourceNote:
      '依据公开仓库 README 整理。模块能力与用例数量取自文档声明；本站没有重新运行测试或部署实例，响应时间、吞吐量与容量均未验证。',
    sections: [
      {
        id: 'problem',
        label: 'PROBLEM',
        title: '报障散落在私聊里，处理过程就无从追溯。',
        paragraphs: [
          '企业内网的 IT 支持常常从一句私聊开始：谁报的障、谁在处理、卡在哪一步，最后只留在对话记录里；同样的答案也要靠人反复口头传递。',
          'Intelligent Service Desk 把这条链路做成系统：员工提交工单，技术支持接单，管理员指派与管人，状态流转留下操作历史。AI 助手只基于当前登录用户自己的数据回答，不执行任何写操作。',
        ],
      },
      {
        id: 'solution',
        label: 'APPROACH',
        title: '一套页面，三种角色，一条完整链路。',
        paragraphs: [
          'README 把能力划为五块：认证与权限、工单、知识库、AI 助手与管理台。前端是 Vue 3 + Vite 的 SPA，构建产物打进同一个 jar，部署形态仍是单体。',
        ],
        bullets: [
          '员工提交工单并只看得到自己的数据；技术支持接单、维护自己创建的知识条目；管理员指派工单、调整角色、重置密码。',
          '前端按角色裁剪菜单与按钮，但数据范围由后端 Service 的 requireVisible / requireRole 决定：隐藏按钮不等于权限。',
          'AI 助手是任意页面右下角的抽屉，暴露两个只读工具——查当前用户工单、检索知识库，身份从 SecurityContext 取。',
        ],
      },
      {
        id: 'architecture',
        label: 'ARCHITECTURE',
        title: '模块化单体，按业务分包。',
        paragraphs: [
          'com.isd 下按 auth、ticket、kb、ai 四个业务模块分包，公共能力收在 common/：过滤器链、业务指标、统一响应与全局异常、SPA 路由回退。Controller 只做路由与参数校验，Service 承担业务规则、事务边界、状态机与权限，Mapper 只写 SQL。',
          'web/ 是独立的 npm 工程，npm run build 把产物输出到 src/main/resources/static，再与 Spring Boot 一起打成一个 jar。开发期由 Vite 把 /api 代理到 8081，浏览器只看到一个源，Session Cookie 天然同源。',
        ],
      },
      {
        id: 'decisions',
        label: 'ENGINEERING DECISIONS',
        title: '每个取舍都写下了不做的理由。',
        bullets: [
          '认证用 Session 而非 JWT：单体没有多端诉求，注销即失效，还能在服务端踢人，不必自己实现吊销。',
          '持久层用 MyBatis 而非 JPA：手写 SQL 能直接利用索引并查看执行计划。',
          '状态机用枚举 + 迁移白名单：四个状态不值得引框架，规则集中且可穷举测试。',
          '接单用乐观锁 version：短事务、冲突可重试，比悲观锁划算。',
          'AI 工具签名不带 userId：身份从 SecurityContext 取，从源头堵死提示注入越权。',
          'history 路由配后端 7 条显式白名单转发，不用 /** 通配，以免吞掉 /api。',
        ],
      },
      {
        id: 'implementation',
        label: 'IMPLEMENTATION',
        title: '并发、权限与可观测性，都在实现层面兜住。',
        paragraphs: [
          '接单冲突由 version 条件更新处理：两个线程同时接单恰好一个成功、version 只加 1。管理端还要防两个管理员互相降权导致零管理员，用按 id 排序的跨行锁兜底，后到的一方收到 409。',
          '密码重置走一次性临时密码：明文只在响应里出现一次，对方已有会话立即失效；未改密前 /api/** 只放行改密、me 与 logout。',
          '指标端点单独开在 8082 且只绑 127.0.0.1，8081 完全不暴露 actuator。日志全带 traceId，AI 调用跑在 ai-call-* 线程池，由 TaskDecorator 把 MDC 与 SecurityContext 一并带过去。',
        ],
      },
      {
        id: 'experiments',
        label: 'VALIDATION',
        title: '68 个自动化用例，并发场景单独验证。',
        paragraphs: [
          'mvn test 覆盖工单创建与状态流转、越权 403/404、角色并发修改、密码重置与强制改密、指标计数、Flyway 迁移与 AI 降级，README 声明合计 68 个用例。',
          '并发用例刻意不加 @Transactional：事务是连接级的，两个线程各自提交才能测出真实冲突。测试库优先起 MySQL 容器，本机没有 Docker 时回退本机实例。',
        ],
        note: '以上数字来自仓库 README 与用例清单，本站未重新执行测试。响应时间、吞吐量与线上容量没有可复核的测量结果，因此不在此声明。',
      },
      {
        id: 'limitations',
        label: 'KNOWN LIMITATIONS',
        title: '已知短板写在 README 里，也留在这里。',
        bullets: [
          "检索用 LIKE '%kw%'，前缀通配符用不上索引；v2 计划换 FULLTEXT ngram。",
          '知识库分类不支持改与删，条目为硬删除，删除后不可恢复。',
          'AI 单轮无会话记忆；降级时用整句做关键词，长句命中率低。',
          'AI 接口没有频率限制，生产必须加配额；CSRF 关闭，目前依赖 SameSite=Lax。',
          '工单号仍是「日期 + 4 位随机数 + 重试」，未换雪花或序列；前端没有单元测试，靠后端用例与手工验收清单兜底。',
          'Element Plus 全量引入，主包 gzip 约 410KB，内网场景可接受，按需引入留作优化项。',
        ],
      },
      {
        id: 'repository',
        label: 'REPOSITORY',
        title: '从 README 与 ADR 开始复核。',
        paragraphs: [
          '仓库里除源码外还有架构取舍记录（ADR）、5 分钟演示脚本、面试问答速查与学习笔记。本页是工程导航，能力与数字请以对应版本的 README、测试与运行记录为准。',
        ],
      },
    ],
  },
  {
    slug: 'better-one',
    name: 'Better One',
    subtitle: 'Personal Decision Intelligence System',
    description: '让真实自我与理想自我协作，探索长期记忆驱动的个人决策。',
    focus: '本地优先 · 偏好建模 · 长期决策',
    summary: [
      { label: '角色', value: '产品构想与技术探索' },
      { label: '技术栈', value: '计划复用 D.I.V.E. 的记忆能力' },
      { label: '范围', value: '个人情境、偏好建模与决策反思' },
      { label: '证据', value: '尚无原型、用户研究或效果指标' },
    ],
    category: 'exploration',
    status: '产品探索',
    statusKind: 'exploration',
    compact: true,
    tags: ['Product Thinking', 'Local-first', 'AI Memory'],
    architecture: [
      'Personal Context',
      'Long-term Memory',
      'Preference Model',
      'Decision Reflection',
    ],
    sourceNote: '依据本人提供的产品构想整理。架构属于探索方向，没有已验证产品能力或效果指标。',
    sections: [
      {
        id: 'problem',
        label: 'PROBLEM',
        title: '今天的选择，如何与长期目标对齐？',
        paragraphs: [
          '真实偏好、短期情境与理想自我的长期目标之间，常常存在张力。Better One 探索用长期记忆保留这些背景，帮助个体反思自己的选择。',
        ],
      },
      {
        id: 'solution',
        label: 'PRODUCT CONCEPT',
        title: '让两个视角展开协作。',
        paragraphs: [
          '“真实自我”提供当下处境与偏好，“理想自我”帮助检视长期方向。系统构想是支持反思与决策增强，而非替用户做决定。',
        ],
      },
      {
        id: 'architecture',
        label: 'PROPOSED ARCHITECTURE',
        title: '以记忆承接个体情境。',
        paragraphs: [
          '计划复用 D.I.V.E. 的记忆能力，连接个人情境、偏好建模和决策回顾。下图是概念结构，不代表已运行的产品链路。',
        ],
      },
      {
        id: 'decisions',
        label: 'DESIGN PRINCIPLES',
        title: '隐私与自主性，应该从起点考虑。',
        bullets: [
          '本地优先，尽量减少个人敏感信息的外传。',
          '偏好模型应能被本人理解、修改和撤回。',
          '保留不同选择的依据，而非只给出一个看似确定的推荐。',
        ],
      },
      {
        id: 'implementation',
        label: 'CURRENT STAGE',
        title: '产品设计与研发探索阶段。',
        paragraphs: [
          '当前可确认的是产品理念与技术探索方向。没有可公开演示的已验证完整原型，也不展示虚构的产品截图、用户评价或使用数据。',
        ],
      },
      {
        id: 'experiments',
        label: 'VALIDATION PLAN',
        title: '先验证问题，再验证方案。',
        paragraphs: [
          '后续需要验证真实决策场景、个体偏好的表达方式，以及记忆对反思过程是否有帮助。目前尚无可报告的用户研究或量化效果。',
        ],
      },
      {
        id: 'limitations',
        label: 'OPEN QUESTIONS',
        title: '仍在探索的问题。',
        bullets: [
          '如何区分稳定偏好和短期情绪？',
          '如何避免系统过度塑造个人价值判断？',
          '如何评估决策支持的质量，同时保护隐私与自主性？',
        ],
      },
      {
        id: 'repository',
        label: 'FUTURE WORK',
        title: '随探索逐步公开。',
        paragraphs: ['暂无独立公开仓库。已有记忆引擎的工程实现可从 D.I.V.E. 项目开始了解。'],
      },
    ],
  },
];
