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
    name: 'We Once Talked',
    subtitle: 'Local-first Chat & Digital Twin · D.I.V.E. Memory Core',
    description:
      '把长期记忆内核装进一个本机聊天应用：只有你授权过的话才成为证据，删掉就是真的删掉。',
    focus: '授权记忆 · 三轨画像 · 删除传播',
    summary: [
      { label: '角色', value: '独立完成产品设计、后端与前端' },
      {
        label: '技术栈',
        value: 'Python 3.11 · FastAPI · React/TypeScript · SQLite · D.I.V.E. 记忆内核（vendored）',
      },
      { label: '范围', value: '真聊与人物、授权记忆、严格个人校验与虚拟空间' },
      { label: '证据', value: '仓库记录后端 779 个用例通过；人格拟真度尚未验证' },
    ],
    category: 'ai',
    status: '研究预览',
    tags: ['Python', 'FastAPI', 'React', 'SQLite', 'Local-first'],
    github: 'https://github.com/adfkj2/D.I.V.E.Program_Sanofi',
    architecture: [
      'Authorized Evidence',
      'D.I.V.E. Core',
      'Three-track Profile',
      'Strict Check',
      'Local SQLite',
    ],
    sourceNote:
      '依据仓库 README（We Once Talked）与实施说明整理。用例数量与验收结论取自文档声明；本站没有重新运行测试或安装包，也没有验证人格拟真度。',
    sections: [
      {
        id: 'problem',
        label: 'PROBLEM',
        title: '聊过的话，最后都消失了。',
        paragraphs: [
          '我们每天和 AI 聊很多，但会话结束，上下文就归零：它记住的往往是几句模型自己总结的摘要，而不是你说过什么、什么时候说的、为什么后来改了口。',
          'We Once Talked（我们曾聊过）把问题反过来问：如果只记录本人明确授权、并确实说过的话，而且删掉就真的删掉，长期记忆能否成为一件属于自己的基础设施？',
        ],
      },
      {
        id: 'solution',
        label: 'SOLUTION',
        title: '一个本机应用，内核是一个记忆引擎。',
        paragraphs: [
          '产品形态是本地运行的聊天与个人数字分身：微信式聊天界面、内置人物、授权后才写入的长期记忆；先完成严格个人校验并确认报告，才会解锁虚拟空间。长期记忆内核固定为 D.I.V.E. 的一个版本，前后端与产品领域独立重建。',
        ],
        bullets: [
          '记忆只来自本人主动勾选的聊天、自报与确认更正，三轨分开存储；模拟台词与「只改本轮」的反馈不进入真实画像。',
          '删除会传播：撤证据会清正文、断引用、写墓碑，并让依赖它的画像与许可失效；仍有在用记忆的会话会拒绝删除。',
          '解锁虚拟空间要求综合 ≥85、每项 ≥75，且严格超过三个基线；报告只说明本轮样本内的表现。',
          '模型支持八家供应商、四种原生协议；Key 存操作系统凭据库，调用账本只记用途、状态、模型与用量。',
        ],
      },
      {
        id: 'architecture',
        label: 'ARCHITECTURE',
        title: '模块化前端，加一个固定版本的记忆内核。',
        paragraphs: [
          '应用侧是 FastAPI 加直写 SQLite 的单进程服务，前端为 React / TypeScript / Vite；三个库物理分开：应用库 wot.db、记忆库 memory.db、私有评估库 assessment-private.db。',
          'D.I.V.E. 以固定版本 vendored 在 vendor/dive-memory（0.4.0+wot.core），零第三方依赖、只用标准库；backend/wot/dive_adapter.py 是唯一调用边界，产品侧不直接读写记忆表。',
          '内核以事件为中心：events 是写入事实，outbox 区分「事件已落库」与「记忆已生成」，memories 带证据状态与版本，memory_sources 把每条记忆回指原话，tombstones 保证删掉的内容不会被重试复活。',
        ],
      },
      {
        id: 'decisions',
        label: 'ENGINEERING DECISIONS',
        title: '只存原话，把边界写死在代码里。',
        bullets: [
          '只存原话、不做语义升级：适配器用 _VerbatimObservationExtractor 替掉内核抽取器，证据状态固定为 OBSERVATION。',
          '三轨命名空间物理隔离：只接受 real、self_reports、corrections 三种命名空间，越界直接报错，真聊写不进自报轨。',
          '固定策略而不是让模型决定记什么：写入的接受与权重取固定值，策略版本 wot-verbatim-observation-v1，决策落 write_decisions 供审计。',
          '能力保留、行为冻结：画像、记忆合并、遗忘曲线与任务调度都留在内核里，但本产品不启用——把对话升级成性格与第一条理念相反。',
          '召回不止一条路径：bm25 / dense / predicate / temporal / entity / relation 六通道 + RRF(k=60) 融合，再用六分量 ScoringPolicy 重排；未接嵌入模型时 dense 在融合前被过滤。',
          '虚拟空间不引消息队列：本机单进程，后台调度器按公平规则推进，最多两个模型请求并发，发言间隔 12–25 秒。',
        ],
      },
      {
        id: 'implementation',
        label: 'IMPLEMENTATION',
        title: '写入、读取、遗忘，三条链路都能讲清楚。',
        paragraphs: [
          '写入：授权后应用库写证据与 outbox，处理时用 stable_id 派生事件 id 并先查墓碑；内核同事务写 events 与 outbox，worker 投影成 memories，适配器轮询到 DONE 才回写 core_event_id 与 memory_ids。',
          '读取：plan_query 拆出意图、时间模式与预算，多通道召回后 RRF 融合；重排会用乘性权重压低已被取代与已归档的条目，所以问历史仍能看见旧版本；空结果显式 abstain 并留下 retrieval-trace。',
          '遗忘：撤回证据先排 DELETE 任务，命中就 forget_event(hard=True) 删事件、投影与向量；删除总是先于写入执行，迟到的 ingest 会被墓碑拒绝。',
        ],
      },
      {
        id: 'experiments',
        label: 'VALIDATION',
        title: '779 个后端用例，验证契约而不是拟真度。',
        paragraphs: [
          '仓库记录后端全量 779 个用例通过，仅剩一条 Starlette/httpx 弃用警告；Ruff、TypeScript 检查与前端构建均无错误。模型的契约测试与后台运行测试使用隔离数据与模拟供应商，没有开发者发起的真实付费调用。',
          '浏览器验收与桌面、手机截图记录在 docs/implementation 的交付记录里；Windows 安装包已在本机完成安装与卸载验收，但未做代码签名，安卓打包与 Release 发布仍是暂停状态。',
        ],
        note: '以上数字与结论来自仓库 README 与交付记录，本站未重新运行测试或安装包。用例数量只说明契约覆盖，不等于人格拟真度；本项目明确未验证人格忠实度。',
      },
      {
        id: 'limitations',
        label: 'LIMITATIONS',
        title: '研究预览：未验证人格忠实度。',
        bullets: [
          '内置人物的表达与档案仍待真实模型试聊验证；人物只是解释视角，不冒充本人。',
          '严格校验只报告本轮样本内的表现，不是普遍的人格准确率，也不能当作能力认证。',
          '本机单进程：服务停止后虚拟会话暂停，重启不会自动恢复付费生成，也不支持多机同步。',
          '安装包未做代码签名，首次运行需手动放行；安卓打包与 Release 发布暂停。',
          'Key 存系统凭据库，但推理内容仍会发往所选供应商；缺少可靠资料时费用显示为「未估算」。',
          '旧 D.I.V.E. 库与早期交付快照只作历史保存，新应用不读取旧 memory.db，也没有自动迁入旧项目事实。',
        ],
      },
      {
        id: 'repository',
        label: 'REPOSITORY',
        title: '从实施说明与交付记录开始复核。',
        paragraphs: [
          '仓库除源码外还有实际架构、基线审计、严格评估、虚拟空间与联网查证的实施说明，以及每轮交付记录。本页是工程导航，行为与数字请以对应版本的 README、测试与交付记录为准。',
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
