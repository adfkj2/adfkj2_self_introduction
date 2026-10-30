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
    subtitle: 'Enterprise IT Service Desk · v1.0',
    description:
      '从报障到关单，再到知识沉淀与只读 AI 助手：一条可追溯、可限流、可压测的企业内网服务台。',
    focus: '幂等与并发 · RAG 召回 · 可观测性',
    summary: [
      { label: '角色', value: '独立完成后端、管理台与部署编排' },
      {
        label: '技术栈',
        value:
          'Java 21 · Spring Boot 3.5 · Spring Session/Redis · MyBatis · MySQL · Spring AI · Vue 3',
      },
      { label: '范围', value: '工单、知识库、站内信、三角色权限与只读 AI 助手' },
      {
        label: '证据',
        value:
          '105 个后端用例 · 25 个前端单测 · JaCoCo 行覆盖 92.01% · E2E 与 k6 冒烟；本站未重新执行',
      },
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
    status: 'v1.0 已发布',
    compact: true,
    tags: ['Java 21', 'Spring Boot 3.5', 'Spring AI', 'MyBatis', 'MySQL', 'Redis', 'Vue 3'],
    github: 'https://github.com/adfkj2/intelligent-service-desk',
    architecture: [
      'Session + Redis',
      'Ticket State Machine',
      'FULLTEXT RAG',
      'Outbox Notifications',
      'MySQL + Flyway',
    ],
    sourceNote:
      '依据公开仓库 v1.0.0 README 整理。用例、覆盖率与压测数字取自仓库「关键数字」表与 perf-report；本站没有重新执行测试或压测，本机实测结果不等于生产容量。',
    sections: [
      {
        id: 'problem',
        label: 'PROBLEM',
        title: '报障散落在私聊里，处理过程就无从追溯。',
        paragraphs: [
          '企业内网的 IT 支持常常从一句私聊开始：谁报的障、谁在处理、卡在哪一步，最后只留在对话记录里；同样的答案也要靠人反复口头传递。',
          'Intelligent Service Desk 把这条链路做成系统：员工提交工单，技术支持接单，管理员指派与管人，状态流转留下操作历史；接单、指派与状态变更还会通过站内信通知相关人。AI 助手只基于当前登录用户自己的数据回答，不执行任何写操作。',
        ],
      },
      {
        id: 'solution',
        label: 'APPROACH',
        title: '一套页面，三种角色，一条完整链路。',
        paragraphs: [
          'v1.0 把能力划为六块：认证与权限、工单、知识库、AI 助手、站内信与管理台。前端是 Vue 3 + Vite 的 SPA，构建产物打进同一个 jar，部署形态仍是模块化单体。',
        ],
        bullets: [
          '员工只看到自己的工单；技术支持接单、维护自己创建的知识条目；管理员指派工单、调整角色、重置密码。',
          '前端按角色裁剪菜单与按钮，数据范围由后端 requireVisible / requireRole 决定：隐藏按钮不等于权限。',
          'AI 助手是右下角的抽屉，两个只读工具（查当前用户工单、检索知识库）加全文召回；身份取自 SecurityContext，每次问答落审计表。',
          '站内信由 Transactional Outbox 投递：事件与业务同事务落库，调度器异步派发，多实例靠唯一索引幂等。',
        ],
      },
      {
        id: 'architecture',
        label: 'ARCHITECTURE',
        title: '模块化单体，按业务分包。',
        paragraphs: [
          'com.isd 下按 auth、ticket、kb、ai 分包，公共能力收在 common/：过滤器链、业务指标、统一响应与全局异常、SPA 路由回退。Controller 只做路由与参数校验，Service 承担业务规则、事务边界、状态机与权限，Mapper 只写 SQL。',
          '会话从进程内存搬到 Spring Session + Redis，多实例下踢人才成立；6 个 Flyway 迁移、8 张业务表在启动时自动升级。前端仍是独立 npm 工程，产物回灌 static 后与后端一起打成 jar。',
          '部署提供三种形态：本机开发（只起 Redis 容器）、全栈 compose，以及 Nginx + TLS 反代的 prod compose（app 不再映射宿主机端口）。',
        ],
      },
      {
        id: 'decisions',
        label: 'ENGINEERING DECISIONS',
        title: '每个取舍都写下了不做的理由。',
        bullets: [
          '会话用 Spring Session + Redis（indexed 仓库）：内存里的 SessionRegistry 只能踢本机会话，多实例下踢人不成立。',
          '创建工单用 Idempotency-Key + 唯一索引：先查后插在并发下仍会双写，唯一索引才是最终裁判。',
          '检索保留两条路径：列表页 LIKE，RAG 走 FULLTEXT ngram；全文检索查不出单字符，直接替换会让现有搜索退化。',
          '通知用 Transactional Outbox 而不是引 MQ：事件与业务同事务落库，靠唯一索引幂等，不增加运维面。',
          'AI 工具签名不带 userId：身份从 SecurityContext 取，从根上堵死提示注入越权；召回内容拼进 user 消息，不污染 system 约束。',
          'AI 成本护栏用 Redis 固定窗口：用户 20/min、IP 60/min，边界误差换实现与排查的简单。',
        ],
      },
      {
        id: 'implementation',
        label: 'IMPLEMENTATION',
        title: '并发、幂等与可观测性，都在实现层面兜住。',
        paragraphs: [
          '接单冲突由 version 条件更新处理：两个线程同时接单恰好一个成功、version 只加 1。管理端还要防两个管理员互相降权导致零管理员，用按 id 排序的跨行锁兜底，后到的一方收到 409。',
          '同 key 重复提交只落一条工单；站内信投递靠 (event_id, user_id) 唯一索引幂等，重试到上限转 FAILED。登录失败按账号 5 次、IP 20 次锁定 15 分钟；AI 超配额返回 429 并带剩余秒数。',
          '指标端点单独开在 8082 且只绑 127.0.0.1：除冲突与状态流转，还统计幂等重放、RAG 召回命中与会话 started/ended（在线数在 Prometheus 侧算差值）。日志全带 traceId，AI 调用跑在 ai-call-* 线程池，由 TaskDecorator 把 MDC 与 SecurityContext 一并带过去。',
          '生产 profile 关闭 Swagger、按 CspPolicy 下发 CSP（script-src 仅 self，不含 unsafe-eval），CSRF 用 Cookie 双提交。',
        ],
      },
      {
        id: 'experiments',
        label: 'VALIDATION',
        title: '105 个后端用例，门禁写进 CI。',
        paragraphs: [
          '后端 ./mvnw verify 覆盖状态机、并发接单、幂等提交、登录限流、越权 403/404、通知与审计清理、Redis 会话、CSRF 与安全响应头，共 105 个用例；JaCoCo 行覆盖 92.01%，门禁要求 ≥ 90%。',
          '前端 25 个 Vitest 单测加 1 条 Playwright 主流程（登录→建单→接单→解决→关闭，同时断言 CSP 无违规）；k6 压工单读路径与 AI 配额，阈值写死在脚本里：列表 p95 < 300ms、详情 p95 < 200ms、AI 5xx 为 0。',
          'CI 五个 job 都是硬门禁：后端 verify 与用例数比对、前端 lint/test/audit/build、镜像构建、E2E、压测冒烟。',
        ],
        note: '数字取自仓库「关键数字」表与 perf-report，本站未重新执行测试或压测。压测是本机环境结果，不代表生产容量与并发 SLA。',
      },
      {
        id: 'limitations',
        label: 'KNOWN LIMITATIONS',
        title: '已知短板写在 README 里，也留在这里。',
        bullets: [
          "列表页检索仍是 LIKE '%kw%'，用不上索引；RAG 已换 FULLTEXT ngram，但没有语义召回，同义词与跨语言查不到。",
          'AI 单轮无会话记忆，降级只返回标题；限流是固定窗口，窗口边界可能瞬时放行接近两倍配额。',
          'CSRF 用 Cookie 双提交，token 必须可被 JS 读取，一旦出现 XSS 这层就失效；CSP 只在 prod 下发，style-src 保留 unsafe-inline。',
          '会话强依赖 Redis：Redis 不可用时应用启动失败（刻意不做内存降级），每次请求多一次 Redis 往返。',
          '幂等键只在同一用户 + 同一 key 下生效，没有服务端过期回收；工单号仍是日期 + 4 位随机数 + 重试。',
          '前端页面级只有 1 条 E2E 主流程，视觉回归与边界态靠手工验收；Element Plus 全量引入，主包 gzip 约 410KB。',
        ],
      },
      {
        id: 'repository',
        label: 'REPOSITORY',
        title: '从发布门禁与压测报告开始复核。',
        paragraphs: [
          '仓库除源码外还有 v1.0 发布门禁（十条 DoD，逐条命令与证据）、架构 ADR、k6 压测报告、演示脚本与学习笔记。本页是工程导航，能力、数字与结论请以对应版本的 README、测试与压测记录为准。',
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
