#!/usr/bin/env bun

/**
 * RetroPrinciples Scenario Engine - 场景引擎
 *
 * 根据用户场景动态推荐原则和行动建议
 *
 * 用法:
 *   bun Tools/scenario.ts "你想做什么？"
 */

interface ScenarioConfig {
  keywords: string[];
  principles: string[];
  questions: string[];
  actions: string[];
  warnings: string[];
}

// 场景配置
const SCENARIOS: ScenarioConfig[] = [
  {
    keywords: ["新项目", "启动", "开始", "立项"],
    principles: ["用户需求验证", "分阶段决策框架", "可测量 = 可管理"],
    questions: [
      "用户真正需要什么？",
      "如何验证我们的假设？",
      "什么时候是 Go/No-Go 点？",
      "如何定义成功？",
    ],
    actions: [
      "制定用户调研计划",
      "设置里程碑和决策点",
      "定义成功指标",
      "准备回滚方案",
    ],
    warnings: [
      "⚠️ 不要跳过用户调研",
      "⚠️ 设置明确的决策点",
      "⚠️ 定义可测量的成功指标",
    ],
  },
  {
    keywords: ["技术选型", "选框架", "选工具", "选库"],
    principles: ["技术选型验证律", "竞品沉默 = 警告", "ROI 保守主义"],
    questions: [
      "为什么竞品不做这个选择？",
      "做了 POC 吗？",
      "隐性成本算了吗？",
      "有备选方案吗？",
    ],
    actions: [
      "完成最小 POC",
      "检查竞品选择",
      "计算 3 年 TCO",
      "准备回滚方案",
    ],
    warnings: [
      "⚠️ 先做 POC 再上生产",
      "⚠️ 检查竞品为什么不选这个",
      "⚠️ 隐性成本可能是显性的 2-3 倍",
    ],
  },
  {
    keywords: ["用户调研", "访谈", "问卷", "需求"],
    principles: ["用户需求验证", "可测量 = 可管理"],
    questions: [
      "目标用户是谁？",
      "需要多少样本？",
      "如何验证假设？",
      "如何量化结果？",
    ],
    actions: [
      "确定目标用户画像",
      "设计访谈/问卷",
      "执行调研计划",
      "分析并验证假设",
    ],
    warnings: [
      "⚠️ 样本量要足够 (5-10 个访谈)",
      "⚠️ 问题是开放式的",
      "⚠️ 不仅听用户说什么，更要看他做什么",
    ],
  },
  {
    keywords: ["成本", "预算", "ROI", "估算"],
    principles: ["ROI 保守主义", "隐性成本倍增器", "可测量 = 可管理"],
    questions: [
      "我的估算有多乐观？",
      "隐性成本算了吗？",
      "有 50% 缓冲吗？",
      "如何测量 ROI？",
    ],
    actions: [
      "应用修正因子 (×1.5 时间)",
      "列出所有隐性成本",
      "设置保守收益预期",
      "定义 ROI 测量方法",
    ],
    warnings: [
      "⚠️ 永远使用保守情景做决策",
      "⚠️ 隐性成本是显性的 2-3 倍",
      "⚠️ 模糊的指标 = 无效",
    ],
  },
  {
    keywords: ["决策", "选择", "评估", "比较"],
    principles: ["多代理分析 ROI", "XY Problem 警惕", "分阶段决策框架"],
    questions: [
      "我们在解决正确的问题吗？",
      "有没有遗漏的风险？",
      "什么时候止损？",
      "需要多角度分析吗？",
    ],
    actions: [
      "执行 FirstPrinciples 分析",
      "使用多代理分析",
      "设置止损点",
      "准备替代方案",
    ],
    warnings: [
      "⚠️ 问 5 次为什么",
      "⚠️ 多角度分析避免盲区",
      "⚠️ 每个阶段必须有退出点",
    ],
  },
  {
    keywords: ["文档", "写文档", "汇报", "总结"],
    principles: ["文档金字塔法则", "可测量 = 可管理"],
    questions: [
      "受众是谁？",
      "他们需要知道什么？",
      "如何结构化呈现？",
      "核心结论是什么？",
    ],
    actions: [
      "先写执行摘要 (5%)",
      "再写方案对比 (20%)",
      "最后补技术细节 (75%)",
      "突出核心结论",
    ],
    warnings: [
      "⚠️ 80% 的人只看执行摘要",
      "⚠️ 结论先行",
      "⚠️ 结构化呈现",
    ],
  },
  {
    keywords: ["风险", "问题", "挑战", "困难"],
    principles: ["多代理分析 ROI", "分阶段决策框架", "XY Problem 警惕"],
    questions: [
      "根本问题是什么？",
      "风险概率和影响？",
      "缓解措施？",
      "什么时候触发回滚？",
    ],
    actions: [
      "执行根因分析",
      "量化风险 (概率 × 影响)",
      "制定缓解计划",
      "设置预警阈值",
    ],
    warnings: [
      "⚠️ 不要只解决表面问题",
      "⚠️ 量化风险",
      "⚠️ 准备回滚方案",
    ],
  },
  {
    keywords: ["验证", "测试", "检查", "确认"],
    principles: ["技术选型验证律", "用户需求验证", "可测量 = 可管理"],
    questions: [
      "验证标准是什么？",
      "如何测量结果？",
      "样本量够吗？",
      "结果可信吗？",
    ],
    actions: [
      "定义验收标准",
      "设计验证方法",
      "执行验证测试",
      "分析并确认",
    ],
    warnings: [
      "⚠️ 标准要量化",
      "⚠️ 样本量要统计显著",
      "⚠️ 结论要有数据支撑",
    ],
  },
];

async function run(args: string[]): Promise<string> {
  const input = args.join(" ");

  if (!input || input === "--help" || input === "help") {
    return showHelp();
  }

  return analyzeScenario(input);
}

function analyzeScenario(input: string): string {
  const keywords = input.toLowerCase();

  // 匹配场景
  let matched = SCENARIOS.find((s) =>
    s.keywords.some((k) => keywords.includes(k.toLowerCase()))
  );

  // 如果没有匹配，返回通用建议
  if (!matched) {
    return analyzeWithAI(input);
  }

  return formatScenarioAdvice(matched, input);
}

function formatScenarioAdvice(scenario: ScenarioConfig, input: string): string {
  return `
╔══════════════════════════════════════════════════════════════╗
║              🎯 场景分析结果                          ║
╚══════════════════════════════════════════════════════════════╝

输入: "${input}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 推荐原则

${scenario.principles.map((p) => `**${p}**`).join(", ")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ 关键问题

${scenario.questions.map((q) => `- ${q}`).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 建议行动

${scenario.actions.map((a) => `- ${a}`).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ 警告

${scenario.warnings.map((w) => `- ${w}`).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 还想了解:
- 查看原则详情: /principles "${scenario.principles[0]}"
- 查看检查清单: /checklist
- 查看案例: /case "相关案例"
`;
}

// 模拟 AI 分析（实际可以调用 LLM）
function analyzeWithAI(input: string): string {
  return `
╔══════════════════════════════════════════════════════════════╗
║              🎯 通用分析结果                          ║
╚══════════════════════════════════════════════════════════════╝

输入: "${input}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 基于你的描述，建议你思考以下问题：

1. **用户视角**: 谁是用户？他们真正需要什么？
2. **风险视角**: 可能出错的地方有哪些？
3. **成本视角**: 隐性成本算了吗？
4. **决策视角**: 什么时候是 Go/No-Go 点？

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 通用原则

- **用户需求验证**: 没问过用户 = 猜
- **XY Problem 警惕**: 问 5 次为什么
- **分阶段决策**: 每个阶段必须有退出点

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 还想了解:
- 查看所有原则: /principles --list
- 查看检查清单: /checklist
- 查看案例: /case "context-compression"
`;
}

function showHelp(): string {
  return `
╔══════════════════════════════════════════════════════════════╗
║              🎯 RetroPrinciples 场景引擎帮助          ║
╚══════════════════════════════════════════════════════════════╝

用法:
  bun Tools/scenario.ts "你想做什么？"
  bun Tools/scenario.ts "新项目启动"
  bun Tools/scenario.ts "技术选型"
  bun Tools/scenario.ts "用户调研"

示例:
  bun Tools/scenario.ts "我想启动一个新项目"
  ↓
  推荐: 用户需求验证 + 分阶段决策框架 + 可测量 = 可管理

支持场景:
  - 新项目启动
  - 技术选型
  - 用户调研
  - 成本预算
  - 决策评估
  - 文档编写
  - 风险管理
  - 验证测试

输出:
  - 推荐原则
  - 关键问题
  - 建议行动
  - 警告提示
`;
}

export { run, SCENARIOS };
