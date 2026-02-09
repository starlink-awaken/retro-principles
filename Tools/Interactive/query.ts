#!/usr/bin/env bun

/**
 * RetroPrinciples Interactive Tool - 交互式复盘知识查询
 *
 * 支持自然语言查询、场景推荐、案例展示
 *
 * 用法:
 *   bun Tools/Interactive/query.ts            # 交互模式
 *   bun Tools/Interactive/query.ts "问题"     # 直接查询
 */

interface Principle {
  id: number;
  name: string;
  summary: string;
  level: "铁律" | "金律" | "建议";
  tags: string[];
  content: string;
  scenarios: string[];
}

interface Case {
  id: string;
  title: string;
  project: string;
  lesson: string;
  outcome: string;
  principles: string[];
}

interface ScenarioRecommendation {
  scenario: string;
  principles: string[];
  questions: string[];
  warnings: string[];
}

// 核心知识库
const PRINCIPLES: Principle[] = [
  {
    id: 1,
    name: "用户需求验证定律",
    summary: "没问过用户 = 猜",
    level: "铁律",
    tags: ["用户", "需求", "调研", "验证", "访谈"],
    content: `**级别**: 铁律 (必须遵守)
**描述**: 没有被验证的用户需求 = 假设 = 可能是错的

**置信度层次**:
| 置信度 | 条件 |
|--------|------|
| 0% | 假设（"我觉得用户需要..."） |
| 30% | 调研（1-3 个访谈） |
| 60% | 验证（5-10 个访谈 + 数据） |
| 90% | 确认（30+ 问卷 + 支付验证）`,
    scenarios: ["启动新项目", "功能规划", "需求变更"],
  },
  {
    id: 2,
    name: "ROI 保守主义",
    summary: "乐观是幻想，保守是智慧",
    level: "铁律",
    tags: ["ROI", "成本", "估算", "收益", "预算"],
    content: `**级别**: 铁律
**描述**: 永远用保守情景做决策，乐观情景是给投资人看的

**修正因子**:
| 估算类型 | 修正因子 |
|----------|----------|
| 开发时间 | ×1.5 |
| 开发成本 | ×1.3 |
| 收益 | ×0.7 |
| ROI | ×0.5`,
    scenarios: ["项目预算", "技术选型", "团队规划"],
  },
  {
    id: 3,
    name: "XY Problem 警惕机制",
    summary: "问 5 次'为什么'再动手",
    level: "金律",
    tags: ["XY Problem", "问题定义", "根因", "分析"],
    content: `**级别**: 金律
**描述**: 每解决一个问题之前，问三次"为什么"

**问题链**:
Q1: 为什么需要优化 Token？
A1: 因为 Token 成本高

Q2: 为什么 Token 成本高？
A2: 因为上下文太大

Q3: 为什么上下文太大？
A3: 因为...（这才是真正的问题）`,
    scenarios: ["问题解决", "需求分析", "方案设计"],
  },
  {
    id: 4,
    name: "多代理分析 ROI",
    summary: "花小钱防大祸",
    level: "建议",
    tags: ["多代理", "分析", "风险", "决策"],
    content: `**级别**: 建议
**描述**: 分析成本是固定的，遗漏风险的代价是无限的

**成本收益**:
| 方法 | 成本 | 遗漏风险代价 |
|------|------|-------------|
| 单代理分析 | $10 | 可能遗漏 10+ 风险 |
| 多代理分析 (12 代理) | $80 | 遗漏风险 < 2`,
    scenarios: ["重大决策", "方案评估", "风险识别"],
  },
  {
    id: 5,
    name: "竞品沉默 = 警告",
    summary: "90% 有原因",
    level: "银律",
    tags: ["竞品", "对标", "行业", "调研"],
    content: `**级别**: 银律
**描述**: 如果所有竞品都不做某件事，要么是他们错了，要么是你错了

**竞品沉默原因可能性**:
| 原因 | 概率 |
|------|------|
| 已经试过，失败了 | 40% |
| 数据不支持，ROI 为负 | 30% |
| 用户不想要 | 20% |
| 还没想到 | 10%`,
    scenarios: ["产品规划", "技术选型", "功能设计"],
  },
  {
    id: 6,
    name: "文档金字塔法则",
    summary: "5% 结论，20% 方案，75% 细节",
    level: "建议",
    tags: ["文档", "结构", "沟通", "汇报"],
    content: `**级别**: 建议
**描述**: 80% 的人只会看执行摘要，19% 会看详细方案，1% 会看技术细节

**篇幅分配**:
| 层级 | 内容 | 篇幅占比 | 受众 |
|------|------|----------|------|
| 执行摘要 | 结论 + 建议 | 5% | 决策者 |
| 详细方案 | 方案对比 | 20% | 项目经理 |
| 技术文档 | 实施细节 | 75% | 开发者`,
    scenarios: ["文档编写", "汇报演示", "知识传递"],
  },
  {
    id: 7,
    name: "隐性成本倍增器",
    summary: "算到的成本只是冰山",
    level: "银律",
    tags: ["隐性成本", "维护", "TCO", "预算"],
    content: `**级别**: 银律
**描述**: 显性成本是冰山一角，隐性成本是水下巨兽

**成本分解**:
显性: 隐性 = 1 : 2~3

**常见隐性成本**:
- 维护时间
- 培训成本
- 迁移成本
- 技术债务`,
    scenarios: ["项目预算", "技术选型", "供应商评估"],
  },
  {
    id: 8,
    name: "可测量 = 可管理",
    summary: "模糊 = 无效",
    level: "金律",
    tags: ["指标", "测量", "KPI", "验收", "OKR"],
    content: `**级别**: 金律
**描述**: 模糊的指标 = 没有指标

**指标定义模板**:
❌ 模糊: "Token 节省 ≥ 30%"
✅ 清晰: "Token 节省 ≥ 30%"
   测量方法: 对比优化前后 SKILL.md 加载 token 数
   测量工具: Claude Token Counter
   验收阈值: 连续 10 次测试 ≥ 30%`,
    scenarios: ["目标设定", "验收标准", "进度追踪"],
  },
  {
    id: 9,
    name: "技术选型验证律",
    summary: "先 POC 再上车",
    level: "铁律",
    tags: ["技术选型", "POC", "验证", "工具"],
    content: `**级别**: 铁律
**描述**: 未经验证的生产工具 = 定时炸弹

**验证清单**:
[ ] 最小 POC 完成 (2 小时内)
[ ] 依赖健康检查 (stars, issues, maintenance)
[ ] 替代方案备选
[ ] 失败回滚计划
[ ] 社区活跃度验证`,
    scenarios: ["技术选型", "工具引入", "框架评估"],
  },
  {
    id: 10,
    name: "分阶段决策框架",
    summary: "每个阶段必须有退出点",
    level: "银律",
    tags: ["分阶段", "决策", "Go/No-Go", "止损"],
    content: `**级别**: 银律
**描述**: 每个阶段必须有明确的 Go/No-Go 决策点

**决策点模板**:
阶段          决策问题              Go 条件
─────────────────────────────────────────────────
调研后        是否继续？          ≥70% 用户支持
MVP 后       是否扩展？          Token 节省 ≥30%
阶段末        是否回滚？          ROI < 0`,
    scenarios: ["项目启动", "阶段评审", "风险管控"],
  },
];

// 案例库
const CASES: Case[] = [
  {
    id: "context-compression",
    title: "Context Compression 项目",
    project: "PAI Context 优化",
    lesson: "用户需求未验证",
    outcome: "写了 2,813 行文档，但 0 个用户访谈",
    principles: ["用户需求验证", "ROI 保守主义", "文档金字塔"],
  },
  {
    id: "bmad-fail",
    title: "BMad 安装失败",
    project: "BMad-Method 框架",
    lesson: "技术选型未验证",
    outcome: "尝试 4 种方法，浪费 30 分钟，clack/prompts 库 bug",
    principles: ["技术选型验证律"],
  },
  {
    id: "roi-overestimate",
    title: "ROI 计算过度乐观",
    project: "Context Compression 方案",
    lesson: "成本估算过于乐观",
    outcome: "声称 ROI 654%，实际保守情景 -8%",
    principles: ["ROI 保守主义", "隐性成本倍增器"],
  },
];

// 场景推荐
const SCENARIO_RECOMMENDATIONS: ScenarioRecommendation[] = [
  {
    scenario: "启动新项目",
    principles: ["用户需求验证", "分阶段决策框架", "可测量 = 可管理"],
    questions: [
      "用户真正需要什么？",
      "如何验证我们的假设？",
      "什么时候是 Go/No-Go 点？",
    ],
    warnings: [
      "⚠️ 不要跳过用户调研",
      "⚠️ 设置明确的决策点",
      "⚠️ 定义可测量的成功指标",
    ],
  },
  {
    scenario: "技术选型",
    principles: ["技术选型验证律", "竞品沉默 = 警告", "ROI 保守主义"],
    questions: [
      "为什么竞品不做这个选择？",
      "做了 POC 吗？",
      "隐性成本算了吗？",
    ],
    warnings: [
      "⚠️ 先做 POC",
      "⚠️ 检查竞品选择",
      "⚠️ 计算 3 年 TCO",
    ],
  },
  {
    scenario: "重大决策",
    principles: ["多代理分析 ROI", "XY Problem 警惕", "分阶段决策框架"],
    questions: [
      "我们在解决正确的问题吗？",
      "有没有遗漏的风险？",
      "什么时候止损？",
    ],
    warnings: [
      "⚠️ 多角度分析",
      "⚠️ 问 5 次为什么",
      "⚠️ 准备回滚方案",
    ],
  },
];

// 主函数
async function run(args: string[]): Promise<string> {
  const query = args.join(" ");

  if (!query || query === "--help" || query === "help") {
    return showHelp();
  }

  if (query === "--list" || query === "list") {
    return listAllPrinciples();
  }

  if (query === "--cases" || query === "cases") {
    return showCases();
  }

  if (query === "--scenarios" || query === "scenarios") {
    return showScenarios();
  }

  if (query.startsWith("--scenario ") || query.startsWith("scenario ")) {
    const scenario = query.replace(/^--scenario\s+|^scenario\s+/, "");
    return showScenario(scenario);
  }

  if (query.startsWith("--case ") || query.startsWith("case ")) {
    const caseId = query.replace(/^--case\s+|^case\s+/, "");
    return showCase(caseId);
  }

  // 智能搜索
  return search(query);
}

function search(query: string): string {
  const keywords = query.toLowerCase().split(/\s+/);
  const results = PRINCIPLES.filter((p) =>
    keywords.some(
      (k) =>
        p.name.toLowerCase().includes(k) ||
        p.summary.toLowerCase().includes(k) ||
        p.tags.some((t) => t.toLowerCase().includes(k)) ||
        p.scenarios.some((s) => s.toLowerCase().includes(k))
    )
  );

  if (results.length === 0) {
    // 尝试场景推荐
    const scenarioMatch = SCENARIO_RECOMMENDATIONS.find(
      (s) => query.toLowerCase().includes(s.scenario.toLowerCase())
    );

    if (scenarioMatch) {
      return showScenario(scenarioMatch.scenario);
    }

    return `❌ 未找到相关原则

搜索: "${query}"

试试:
- /principles "用户需求"
- /principles "技术选型"
- /scenario "启动新项目"
- /cases (查看案例库)`;
  }

  return `🔍 搜索: "${query}"

找到 ${results.length} 条原则:

${results.map((p, i) => formatPrinciple(p, i + 1)).join("\n\n")}

💡 完整检查清单: /checklist`;
}

function listAllPrinciples(): string {
  return `📚 10 条核心原则

${PRINCIPLES.map((p) => `**${p.id}. ${p.name}** [${p.level}]
   ${p.summary}`).join("\n\n")}

💡 查询详情: /principles "原则名"
💡 场景推荐: /scenario "场景名"`;
}

function formatPrinciple(p: Principle, index: number): string {
  return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**${index}. ${p.name}** [${p.level}]

📝 ${p.summary}

${p.content}

🏷️ 适用场景: ${p.scenarios.join(", ")}`;
}

function showCases(): string {
  return `📖 案例库 (${CASES.length} 个案例)

${CASES.map((c, i) => formatCase(c, i + 1)).join("\n\n")}

💡 查看详情: /case "案例ID"`;
}

function formatCase(c: Case, index: number): string {
  return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**${index}. ${c.title}**

📂 项目: ${c.project}
💥 教训: ${c.lesson}
📊 结果: ${c.outcome}
🏷️ 关联原则: ${c.principles.join(", ")}`;
}

function showCase(caseId: string): string {
  const foundCase = CASES.find((c) => c.id === caseId || c.title.toLowerCase().includes(caseId.toLowerCase()));

  if (!foundCase) {
    return `❌ 未找到案例: "${caseId}"

可用案例: ${CASES.map((c) => c.id).join(", ")}`;
  }

  return `📖 案例详情

**${foundCase.title}**
📂 项目: ${foundCase.project}
💥 教训: ${foundCase.lesson}
📊 结果: ${foundCase.outcome}
🏷️ 关联原则: ${foundCase.principles.join(", ")}`;
}

function showScenarios(): string {
  return `🎯 场景推荐

${SCENARIO_RECOMMENDATIONS.map((s, i) => `**${i + 1}. ${s.scenario}**
   原则: ${s.principles.join(", ")}
   问题: ${s.questions.length} 个`).join("\n\n")}

💡 查看详情: /scenario "场景名"`;
}

function showScenario(scenario: string): string {
  const found = SCENARIO_RECOMMENDATIONS.find(
    (s) => s.scenario.toLowerCase().includes(scenario.toLowerCase())
  );

  if (!found) {
    return `❌ 未找到场景: "${scenario}"

可用场景: ${SCENARIO_RECOMMENDATIONS.map((s) => s.scenario).join(", ")}`;
  }

  return `🎯 场景: ${found.scenario}

**推荐原则**:
${found.principles.map((p) => `- ${p}`).join("\n")}

**关键问题**:
${found.questions.map((q) => `- ${q}`).join("\n")}

**⚠️ 警告**:
${found.warnings.map((w) => `- ${w}`).join("\n")}`;
}

function showHelp(): string {
  return `
╔══════════════════════════════════════════════════════════════╗
║              📚 RetroPrinciples Interactive 帮助          ║
╚══════════════════════════════════════════════════════════════╝

用法:
  bun Tools/Interactive/query.ts "查询"       # 搜索原则
  bun Tools/Interactive/query.ts --list     # 列出所有原则
  bun Tools/Interactive/query.ts --cases     # 查看案例库
  bun Tools/Interactive/query.ts --scenarios # 查看场景推荐
  bun Tools/Interactive/query.ts --scenario "场景"  # 场景详情
  bun Tools/Interactive/query.ts --case "案例"     # 案例详情

交互式用法:
  bun Tools/Interactive/query.ts "我想启动一个新项目"
  ↓
  自动推荐: 用户需求验证 + 分阶段决策框架 + 可测量 = 可管理

示例:
  bun Tools/Interactive/query.ts "用户调研"
  bun Tools/Interactive/query.ts "技术选型"
  bun Tools/Interactive/query.ts "重大决策"
`;
}

export { run, PRINCIPLES, CASES, SCENARIO_RECOMMENDATIONS };
