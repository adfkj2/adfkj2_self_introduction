export interface ProjectSection {
  id: string;
  label: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  note?: string;
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
}
export const projects: Project[] = [
  {
    slug: 'dive',
    name: 'D.I.V.E.',
    subtitle: 'Long-term AI Memory System',
    description:
      '让交互沉淀为记忆，让记忆成为下一次推理的起点。探索长期记忆的形成、演化与语义检索。',
    focus: '记忆生命周期 · 一致性边界 · 可复核实验',
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
    name: 'Java 工单管理系统',
    subtitle: 'Spring Boot Backend Engineering Practice',
    description: '从业务边界到数据持久化，认真打磨一个后端系统的基本功。',
    focus: 'RESTful API · 分层架构 · 工程化测试',
    category: 'backend',
    status: '开发中',
    compact: true,
    tags: ['Java', 'Spring Boot', 'MySQL'],
    architecture: ['REST API', 'Service Layer', 'Persistence', 'MySQL'],
    sourceNote: '依据本人提供的项目方向整理，尚未提供可公开复核的仓库和测试报告。',
    sections: [
      {
        id: 'problem',
        label: 'PROBLEM',
        title: '通过完整业务链路，练习后端工程。',
        paragraphs: [
          '工单系统以具体业务对象为中心，适合练习接口契约、业务逻辑、数据持久化和分层组织。项目目前处于持续开发阶段。',
        ],
      },
      {
        id: 'solution',
        label: 'APPROACH',
        title: '先把单体后端的边界做好。',
        paragraphs: [
          '技术方向为 Java、Spring Boot、RESTful API 与 MySQL。以可理解的分层结构推进业务实现，并用工程化测试验证关键行为。这里描述技术方向，不承诺未提供证据的具体模块完成度。',
        ],
      },
      {
        id: 'architecture',
        label: 'ARCHITECTURE',
        title: '清晰的职责，清晰的数据流。',
        paragraphs: [
          '下图展示目标分层方向：请求进入接口层，业务逻辑在 Service 层组织，持久化层负责与数据库交互。具体类和 API 清单待源码公开后补充。',
        ],
      },
      {
        id: 'decisions',
        label: 'ENGINEERING FOCUS',
        title: '让复杂度随需求生长。',
        bullets: [
          '优先审视接口语义、业务规则和数据库约束。',
          '避免在业务边界尚未明确时引入分布式拆分。',
          'Redis、消息队列、权限系统与微服务均不列为已实现能力。',
        ],
      },
      {
        id: 'implementation',
        label: 'IMPLEMENTATION',
        title: '持续开发中。',
        paragraphs: [
          '已确认项目处于开发阶段；具体接口、数据库迁移与测试范围尚未提供可公开核对的材料。后续以源码和运行记录更新本页。',
        ],
      },
      {
        id: 'experiments',
        label: 'VALIDATION',
        title: '测试结果待补充。',
        paragraphs: [
          '工程化测试是项目方向。目前没有可展示的真实报告，因此不提供测试通过数、覆盖率、响应时间或并发性能指标。',
        ],
      },
      {
        id: 'limitations',
        label: 'CURRENT BOUNDARY',
        title: '公开证据尚待完善。',
        bullets: [
          '不展示尚未提供的 GitHub 链接、在线演示或生产部署。',
          '不将基础技术选型描述为全部业务功能已经实现。',
        ],
      },
      {
        id: 'repository',
        label: 'REPOSITORY',
        title: '源码入口准备中。',
        paragraphs: ['公开仓库整理后，这里将提供可复核的源码入口。当前可以先查看其他开源项目。'],
      },
    ],
  },
  {
    slug: 'better-one',
    name: 'Better One',
    subtitle: 'Personal Decision Intelligence System',
    description: '让真实自我与理想自我协作，探索长期记忆驱动的个人决策。',
    focus: '本地优先 · 偏好建模 · 长期决策',
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
