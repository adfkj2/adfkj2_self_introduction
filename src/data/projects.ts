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
    subtitle: 'Enterprise IT Service Desk · v1.1',
    description:
      '员工一句话报障，AI 追问缺失信息；技术支持在工单里协作，解决经验经人工审核变成知识；管理员看清 AI 供应商、调用量与费用。',
    focus: 'AI 辅助报障 · 工单协作 · 知识审核',
    summary: [
      { label: '角色', value: '独立完成后端、管理台与交付' },
      {
        label: '技术栈',
        value: 'Java 21 · Spring Boot 3.5 · MySQL 8 · Redis 7 · Spring AI · Vue 3 · Element Plus',
      },
      { label: '范围', value: '智能报障、工单协作与时限、知识审核、多供应商 AI 配置与用量' },
      {
        label: '证据',
        value:
          '207 个后端用例 · 37 个前端单测 · 行覆盖 94.50% · 69 个接口 · 10 条 E2E；本站未重新执行',
      },
    ],
    shots: [
      {
        src: '/shots/isd-workbench.webp',
        alt: '管理员工作台：待办队列、最近工单、服务效率与人员负荷面板。',
        caption:
          '工作台：按角色展示待接单、分配给我、即将超时与已超时队列，管理员额外看到人员负荷。',
      },
      {
        src: '/shots/isd-ticket-create.webp',
        alt: '智能报障页：左侧是 AI 草稿与追问，右侧是采用后可继续编辑的工单表单。',
        caption: '智能报障：描述现象即可生成草稿，AI 追问缺失信息，草稿只填表单、不自动提交。',
      },
      {
        src: '/shots/isd-ticket-detail.webp',
        alt: '工单详情：公开回复与内部备注分栏，附件、处理时限与操作时间线。',
        caption: '工单协作：公开回复与内部备注分开，附件受控下载，时限在等待员工补充时暂停。',
      },
      {
        src: '/shots/isd-knowledge-review.webp',
        alt: '知识审核页：来源工单、适用环境、处理步骤、复核日期与「审核并发布」按钮。',
        caption: '知识审核：草稿不会直接进知识库，补齐环境与复核日期、人工发布后才对员工可见。',
      },
    ],
    category: 'backend',
    status: 'v1.1 已发布',
    compact: true,
    tags: ['Java 21', 'Spring Boot 3.5', 'Spring AI', 'MyBatis', 'MySQL 8', 'Redis 7', 'Vue 3'],
    github: 'https://github.com/adfkj2/intelligent-service-desk',
    architecture: [
      'AI Intake Draft',
      'Workflow + SLA',
      'Knowledge Review',
      'AI Gateway',
      'MySQL + Redis',
    ],
    sourceNote:
      '依据公开仓库 v1.1.0 README 与「关键数字」表整理。用例、覆盖率与压测数字均引自该表与 perf-report；本站没有重新执行测试或压测，本机结果不代表生产容量。',
    sections: [
      {
        id: 'problem',
        label: 'PROBLEM',
        title: '报障要先学会填表，解决经验也留不下来。',
        paragraphs: [
          '企业内网的 IT 支持常常卡在第一步：员工面对标题、分类、优先级不知道怎么写，只能先发一句「打不开」，来回追问几轮才说清楚；技术支持接手后，公开回复和内部判断混在一条消息里，容易把内部判断发给报障人。',
          '更麻烦的是经验：一个故障解决完就结束了，答案留在某个人脑子里，同样的现象过几个月再来一次，还要重新排查。Intelligent Service Desk 把这些环节拆开：AI 帮着把问题说清楚，工单把协作过程留下来，知识必须经人工审核才对员工可见。',
        ],
      },
      {
        id: 'solution',
        label: 'APPROACH',
        title: '五块能力，一条从报障到知识的链路。',
        paragraphs: [
          'v1.1 的能力落在五处：智能报障、工单协作、知识审核、管理员的 AI 配置与用量、按角色的工作台。前端 Vue 3 + Vite 打进同一个 jar，部署仍是模块化单体；官方提供 demo.cmd 一键演示，Release 页有 jar、源码包与 SHA256 校验文件。',
        ],
        bullets: [
          '员工：直接描述现象，AI 追问发生时间、影响范围、报错文字与已尝试操作；草稿只填表单，不会自动提交。',
          '技术支持：公开回复与内部备注分栏，附件受控下载，首次响应与解决时限按优先级计算，等待员工补充时暂停计时。',
          '管理员：指派与转派可按技能与在办量拿到建议，但要人工确认；后台还能管 AI 供应商、Key、调用量与分币种费用。',
          '知识：从已解决工单生成独立草稿，审核人补适用环境、处理步骤与复核日期，人工发布后才对员工可见。',
        ],
      },
      {
        id: 'architecture',
        label: 'ARCHITECTURE',
        title: '模块化单体，24 张表，13 个迁移。',
        paragraphs: [
          'com.isd 下按 auth、ticket、kb、ai 分包，公共能力收在 common/：过滤器链、业务指标、统一响应与全局异常、SPA 路由回退。Controller 只做路由与参数校验，Service 承担业务规则、事务边界、状态机与权限，Mapper 只写 SQL。',
          '数据侧 24 张业务表由 13 个 Flyway 迁移维护，附件也存数据库；会话与 AI 配额放 Redis 7。交付用三阶段 Dockerfile：前端构建、后端打包、运行镜像，再配 Docker Compose 与 Nginx TLS。',
          '本机演示与生产共用一套镜像：demo.cmd / start.cmd 负责检查 Docker、构建并等待就绪；生产 compose 里 app 不映射宿主机端口，只经 Nginx 反代暴露。',
        ],
      },
      {
        id: 'decisions',
        label: 'ENGINEERING DECISIONS',
        title: 'AI 只做建议，决定权留给人。',
        bullets: [
          'AI 不自动提交：草稿与回复建议只填入表单，创建、回复、改状态必须由人确认，工具签名也不接收 userId。',
          '知识必须人工发布：从工单生成的只是独立草稿，审核人补齐适用环境与复核日期后手动发布，避免把个例当成通用答案。',
          'Key 加密且不即时生效：供应商 Key 用 AES-GCM 加密，界面只显示末四位，保存只产生「待启用版本」，测试通过后才切换。',
          '附件进数据库换简单：受控下载、单文件 ≤5MB、单工单 ≤20 个，代价是容量与备份体积随附件增长。',
          '时限用连续自然小时：不引入工作日与节假日日历，业务上够用，规则也能穷举测试。',
          'AI 侧用 Spring AI 兼容多供应商：DeepSeek、通义千问、OpenAI 与自定义兼容服务共用一套调用与降级逻辑。',
        ],
      },
      {
        id: 'implementation',
        label: 'IMPLEMENTATION',
        title: '降级、密钥与计时，都在实现层面兜住。',
        paragraphs: [
          '模型 30 秒硬超时、返回非法 JSON、未配置 Key 或供应商不可用时，统一降级为知识库/规则建议，接口仍返回 200，报障流程不中断。',
          '主密钥来自环境变量或持久卷里的 master.key，不打进日志与前端；备份必须同时保存数据库与主密钥，否则恢复后 Key 解不开。',
          '用量统计区分调用量、实际上游请求、Token、用户分布与分币种费用，缺失 Token 标为不完整而不是零消耗；DeepSeek 可刷新官方余额，其他供应商给账务入口。',
          '时限按优先级计算，等待员工补充时暂停计时；接单、指派、转派、请求补充、解决、重开都留操作记录，站内信走 Outbox 异步幂等投递。',
        ],
      },
      {
        id: 'experiments',
        label: 'VALIDATION',
        title: '207 个后端用例，五道 CI 门禁。',
        paragraphs: [
          '后端 ./mvnw verify 覆盖状态机、并发接单、幂等提交、附件与时限、知识版本冲突、登录限流、越权 403/404、Redis 会话与安全响应头，共 207 个用例；JaCoCo 行覆盖 94.50%，门禁要求 ≥ 90%。',
          '前端 37 个 Vitest 单测加 10 条浏览器 E2E（2 条真实服务流程、8 条模拟接口流程）；k6 冒烟压工单读路径与 AI 配额，阈值写死在脚本里。',
          'CI 五个并行 job 全绿才算通过：后端 verify 与 @Test 数量比对、前端 lint/单测/构建/依赖审计、镜像构建、E2E、压测冒烟。',
        ],
        note: '数字取自仓库「关键数字」表与 perf-report，本站未重新执行测试或压测。压测是本机环境结果，不代表生产容量与 SLA。',
      },
      {
        id: 'limitations',
        label: 'KNOWN LIMITATIONS',
        title: 'README 写清楚的边界，原样留在这里。',
        bullets: [
          "列表检索仍是 LIKE '%kw%'，数据量大时要换全文或搜索引擎；RAG 用 FULLTEXT ngram，暂无语义召回。",
          'AI 限流是固定窗口，窗口边界可能瞬时放行接近两倍配额。',
          '处理时限按连续自然小时，不含工作日与节假日日历。',
          '附件存数据库，容量与备份体积随附件增长。',
          'CSP 只在生产 profile 启用，style-src 保留 unsafe-inline 以兼容 Element Plus。',
          'OWASP dependency-check 尚未接入，Java 传递依赖的 CVE 靠 Dependabot 提醒。',
          '会话与 AI 配额强依赖 Redis，Redis 故障时应用拒绝启动（刻意不降级）。',
        ],
      },
      {
        id: 'repository',
        label: 'REPOSITORY',
        title: '从发布门禁与升级文档开始复核。',
        paragraphs: [
          '仓库除源码外还有 v1.1.0 发布门禁（十条 DoD，逐条命令与证据）、升级指南（V7–V13 迁移与回滚）、架构 ADR、k6 压测报告、5 分钟演示脚本与 69 个接口摘要。Release 页提供 jar、源码包与 SHA256 校验文件。本页是工程导航，能力与数字请以对应版本的 README 与记录为准。',
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
