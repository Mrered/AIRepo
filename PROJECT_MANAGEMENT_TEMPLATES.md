# 项目管理模板和脚本集合

## 1. 进度报告模板

### 1.1 周进度报告模板

```markdown
# 项目周进度报告
**项目名称：** {{PROJECT_NAME}}
**报告周期：** {{START_DATE}} - {{END_DATE}}
**报告日期：** {{REPORT_DATE}}

## 📊 总体概览
- **总体进度：** {{OVERALL_PROGRESS}}%
- **已完成任务：** {{COMPLETED_TASKS}}/{{TOTAL_TASKS}}
- **进行中任务：** {{IN_PROGRESS_TASKS}}
- **阻塞任务：** {{BLOCKED_TASKS}}

## 🎯 本周目标完成情况
| 目标 | 计划完成度 | 实际完成度 | 状态 |
|------|------------|------------|------|
{{#each WEEKLY_GOALS}}
| {{title}} | {{planned_progress}}% | {{actual_progress}}% | {{status}} |
{{/each}}

## 📈 燃尽图数据
```json
{
  "ideal_burndown": {{IDEAL_BURNDOWN}},
  "actual_burndown": {{ACTUAL_BURNDOWN}},
  "scope_changes": {{SCOPE_CHANGES}}
}
```

## ⚠️ 风险状态
{{#each RISKS}}
- **{{description}}** - 风险等级：{{risk_level}} - 状态：{{status}}
{{/each}}

## 👥 团队状态
- **团队速率：** {{TEAM_VELOCITY}} 故事点/迭代
- **个人工作量分布：**
{{#each TEAM_MEMBERS}}
  - {{name}}: {{assigned_hours}}/{{capacity}} 小时 ({{utilization}}%)
{{/each}}

## 📋 下周计划
{{#each NEXT_WEEK_PLANS}}
- [ ] {{task}} - 负责人：{{assignee}} - 预计工时：{{estimated_hours}}
{{/each}}
```

### 1.2 月度里程碑报告模板

```markdown
# 月度里程碑报告
**报告月份：** {{MONTH_YEAR}}
**项目名称：** {{PROJECT_NAME}}

## 🎯 里程碑完成情况
{{#each MILESTONES}}
### {{name}}
- **目标日期：** {{target_date}}
- **实际完成日期：** {{actual_date}}
- **完成度：** {{completion_percentage}}%
- **主要交付物：**
{{#each deliverables}}
  - {{name}}: {{status}}
{{/each}}
{{/each}}

## 📊 关键指标
| 指标 | 目标值 | 实际值 | 状态 |
|------|--------|--------|------|
| 计划完成率 | ≥90% | {{COMPLETION_RATE}}% | {{COMPLETION_STATUS}} |
| 代码覆盖率 | ≥80% | {{TEST_COVERAGE}}% | {{COVERAGE_STATUS}} |
| 团队满意度 | ≥4.0/5.0 | {{TEAM_SATISFACTION}}/5.0 | {{SATISFACTION_STATUS}} |

## 🔄 迭代总结
**Sprint {{SPRINT_NUMBER}} 总结：**
- **计划故事点：** {{PLANNED_POINTS}}
- **完成故事点：** {{COMPLETED_POINTS}}
- **团队速率：** {{VELOCITY}}
- **预估准确率：** {{ESTIMATION_ACCURACY}}%

## 🚀 下月重点
{{#each NEXT_MONTH_PRIORITIES}}
1. **{{priority}}** - 预计完成日期：{{due_date}}
{{/each}}
```

## 2. 团队协作模板

### 2.1 每日站会模板

```markdown
# 每日站会记录
**日期：** {{DATE}}
**时间：** {{TIME}}
**参与者：** {{PARTICIPANTS}}

## 🔄 昨日完成
{{#each YESTERDAY_UPDATES}}
**{{member}}:**
- ✅ {{completed_task}}
- 📝 进度：{{progress}}%
{{/each}}

## 📅 今日计划
{{#each TODAY_PLANS}}
**{{member}}:**
- 🎯 {{planned_task}}
- ⏰ 预计工时：{{estimated_hours}}小时
{{/each}}

## ⚠️ 阻碍和风险
{{#each BLOCKERS}}
- **{{reporter}}**: {{description}}
  - 影响：{{impact}}
  - 需要支持：{{support_needed}}
{{/each}}

## 📊 燃尽图更新
- **剩余故事点：** {{REMAINING_POINTS}}
- **昨日完成：** {{COMPLETED_POINTS}}
- **预计完成日期：** {{FORECAST_DATE}}
```

### 2.2 迭代回顾模板

```markdown
# Sprint {{SPRINT_NUMBER}} 回顾
**Sprint周期：** {{START_DATE}} - {{END_DATE}}
**团队：** {{TEAM_NAME}}

## 🎯 Sprint目标
{{SPRINT_GOAL}}

## 📊 Sprint数据
| 指标 | 数值 | 备注 |
|------|------|------|
| 计划故事点 | {{PLANNED_POINTS}} | - |
| 完成故事点 | {{COMPLETED_POINTS}} | - |
| 完成率 | {{COMPLETION_RATE}}% | {{COMPLETION_NOTE}} |
| 新增故事点 | {{ADDED_POINTS}} | {{ADDITION_NOTE}} |
| 团队速率 | {{VELOCITY}} | 基于最近3个Sprint |

## 👍 做得好的地方
{{#each GOOD_THINGS}}
- {{.}}
{{/each}}

## 👎 需要改进的地方
{{#each IMPROVEMENTS}}
- {{.}}
{{/each}}

## 🎯 行动计划
{{#each ACTION_ITEMS}}
- [ ] {{action}} - 负责人：{{owner}} - 截止日期：{{due_date}}
{{/each}}

## 📈 团队情绪
- 团队士气：{{MORALE}}/5
- 工作压力：{{STRESS_LEVEL}}/5
- 工作满意度：{{SATISFACTION}}/5
```

## 3. 风险管理模板

### 3.1 风险评估模板

```markdown
# 项目风险评估报告
**评估日期：** {{ASSESSMENT_DATE}}
**项目名称：** {{PROJECT_NAME}}

## 📊 风险概览
| 风险等级 | 数量 | 占比 |
|----------|------|------|
| 高风险 | {{HIGH_COUNT}} | {{HIGH_PERCENTAGE}}% |
| 中风险 | {{MEDIUM_COUNT}} | {{MEDIUM_PERCENTAGE}}% |
| 低风险 | {{LOW_COUNT}} | {{LOW_PERCENTAGE}}% |

## ⚠️ 高风险项目
{{#each HIGH_RISKS}}
### {{id}} - {{description}}
- **类别：** {{category}}
- **概率：** {{probability}}
- **影响：** {{impact}}
- **严重度：** {{severity}}
- **负责人：** {{owner}}
- **缓解措施：** {{mitigation_plan}}
- **应急计划：** {{contingency_plan}}
- **状态：** {{status}}
- **下次审查：** {{review_date}}
{{/each}}

## 📈 风险趋势
```json
{
  "risk_trend_over_time": {{RISK_TREND_DATA}},
  "mitigation_effectiveness": {{MITIGATION_EFFECTIVENESS}}
}
```

## 🎯 缓解措施进展
{{#each MITIGATION_ACTIONS}}
- [{{status}}] {{action}} - 负责人：{{owner}} - 截止日期：{{due_date}}
{{/each}}
```

### 3.2 风险检查清单

```markdown
# 项目风险检查清单

## 技术风险
- [ ] **技术选型风险**
  - [ ] 新技术成熟度评估
  - [ ] 团队技能匹配度
  - [ ] 技术替代方案准备

- [ ] **架构风险**
  - [ ] 系统扩展性评估
  - [ ] 性能瓶颈识别
  - [ ] 安全漏洞扫描

- [ ] **集成风险**
  - [ ] 第三方API稳定性
  - [ ] 数据兼容性检查
  - [ ] 部署环境一致性

## 进度风险
- [ ] **估算风险**
  - [ ] 任务复杂度评估
  - [ ] 历史数据参考
  - [ ] 缓冲时间设置

- [ ] **依赖风险**
  - [ ] 外部依赖识别
  - [ ] 关键路径分析
  - [ ] 备用方案制定

- [ ] **资源风险**
  - [ ] 人员可用性
  - [ ] 技能匹配度
  - [ ] 工作负载均衡

## 团队风险
- [ ] **人员风险**
  - [ ] 关键人员备份
  - [ ] 团队稳定性
  - [ ] 知识共享机制

- [ ] **沟通风险**
  - [ ] 信息同步机制
  - [ ] 决策效率
  - [ ] 跨团队协作
```

## 4. 自动化脚本示例

### 4.1 进度报告生成器

```javascript
#!/usr/bin/env node
/**
 * 项目进度报告自动生成器
 * Usage: node generate-progress-report.js [plan-file] [output-format]
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class ProgressReportGenerator {
  constructor(planFile) {
    this.planFile = planFile;
    this.plan = this.loadPlan();
    this.reportDate = new Date();
  }

  loadPlan() {
    try {
      const content = fs.readFileSync(this.planFile, 'utf8');
      return yaml.load(content);
    } catch (error) {
      console.error('Error loading plan file:', error.message);
      process.exit(1);
    }
  }

  generateWeeklyReport() {
    const tasks = this.plan.tasks || [];
    const risks = this.plan.risks || [];
    
    const completedTasks = tasks.filter(t => t.status === 'completed');
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
    const blockedTasks = tasks.filter(t => t.status === 'blocked');
    
    const totalEstimatedHours = tasks.reduce((sum, t) => sum + (t.estimated_hours || 0), 0);
    const totalActualHours = tasks.reduce((sum, t) => sum + (t.actual_hours || 0), 0);
    
    const highRisks = risks.filter(r => r.severity === 'high');
    const mediumRisks = risks.filter(r => r.severity === 'medium');
    
    return {
      period: this.getCurrentWeek(),
      summary: {
        totalTasks: tasks.length,
        completedTasks: completedTasks.length,
        inProgressTasks: inProgressTasks.length,
        blockedTasks: blockedTasks.length,
        completionRate: (completedTasks.length / tasks.length * 100).toFixed(1)
      },
      timeTracking: {
        totalEstimatedHours,
        totalActualHours,
        efficiency: totalEstimatedHours > 0 ? ((totalEstimatedHours / totalActualHours) * 100).toFixed(1) : 0
      },
      riskStatus: {
        totalRisks: risks.length,
        highRisks: highRisks.length,
        mediumRisks: mediumRisks.length,
        lowRisks: risks.length - highRisks.length - mediumRisks.length
      },
      teamMetrics: this.calculateTeamMetrics(),
      burndownData: this.generateBurndownData(),
      nextWeekFocus: this.identifyNextFocus()
    };
  }

  calculateTeamMetrics() {
    const team = this.plan.team || { members: [] };
    const tasks = this.plan.tasks || [];
    
    return team.members.map(member => {
      const memberTasks = tasks.filter(t => t.assignee === member.name);
      const assignedHours = memberTasks.reduce((sum, t) => sum + (t.estimated_hours || 0), 0);
      
      return {
        name: member.name,
        role: member.role,
        assignedTasks: memberTasks.length,
        assignedHours,
        capacity: member.capacity || 40,
        utilization: ((assignedHours / (member.capacity || 40)) * 100).toFixed(1)
      };
    });
  }

  generateBurndownData() {
    // 简化的燃尽图数据生成
    const tasks = this.plan.tasks || [];
    const totalPoints = tasks.reduce((sum, t) => sum + (t.story_points || 0), 0);
    
    return {
      totalPoints,
      idealBurndown: this.generateIdealBurndown(totalPoints),
      actualBurndown: this.generateActualBurndown()
    };
  }

  generateIdealBurndown(totalPoints) {
    // 生成理想燃尽线
    const days = 14; // 假设2周迭代
    const dailyBurn = totalPoints / days;
    const data = [];
    
    for (let i = 0; i <= days; i++) {
      data.push({
        day: i,
        remaining: Math.max(0, totalPoints - (dailyBurn * i))
      });
    }
    
    return data;
  }

  generateActualBurndown() {
    // 实际燃尽数据（需要历史数据支持）
    return [];
  }

  identifyNextFocus() {
    const tasks = this.plan.tasks || [];
    const nextTasks = tasks
      .filter(t => t.status === 'pending')
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority || 'medium'] - priorityOrder[a.priority || 'medium'];
      })
      .slice(0, 5);
    
    return nextTasks.map(task => ({
      title: task.title,
      assignee: task.assignee || '未分配',
      estimatedHours: task.estimated_hours || 0,
      priority: task.priority || 'medium'
    }));
  }

  getCurrentWeek() {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return {
      start: startOfWeek.toISOString().split('T')[0],
      end: endOfWeek.toISOString().split('T')[0]
    };
  }

  generateReport(format = 'markdown') {
    const report = this.generateWeeklyReport();
    
    if (format === 'json') {
      return JSON.stringify(report, null, 2);
    }
    
    return this.formatAsMarkdown(report);
  }

  formatAsMarkdown(report) {
    return `# 项目周进度报告
**项目名称：** ${this.plan.name}
**报告周期：** ${report.period.start} - ${report.period.end}

## 📊 总体概览
- **任务完成率：** ${report.summary.completionRate}%
- **已完成任务：** ${report.summary.completedTasks}/${report.summary.totalTasks}
- **进行中任务：** ${report.summary.inProgressTasks}
- **阻塞任务：** ${report.summary.blockedTasks}

## ⏰ 时间追踪
- **总估算工时：** ${report.timeTracking.totalEstimatedHours}小时
- **总实际工时：** ${report.timeTracking.totalActualHours}小时
- **效率：** ${report.timeTracking.efficiency}%

## ⚠️ 风险状态
- **总风险数：** ${report.riskStatus.totalRisks}
- **高风险：** ${report.riskStatus.highRisks}
- **中风险：** ${report.riskStatus.mediumRisks}
- **低风险：** ${report.riskStatus.lowRisks}

## 👥 团队状态
${report.teamMetrics.map(member => 
  `- **${member.name}** (${member.role}): ${member.assignedHours}/${member.capacity}小时 (${member.utilization}%)`
).join('\n')}

## 📋 下周重点
${report.nextWeekFocus.map(task => 
  `- **${task.title}** - ${task.assignee} - ${task.estimatedHours}小时`
).join('\n')}
`;
  }
}

// CLI使用
if (require.main === module) {
  const planFile = process.argv[2] || 'plan.yaml';
  const format = process.argv[3] || 'markdown';
  
  const generator = new ProgressReportGenerator(planFile);
  const report = generator.generateReport(format);
  
  if (format === 'json') {
    console.log(report);
  } else {
    const outputFile = `progress-report-${new Date().toISOString().split('T')[0]}.md`;
    fs.writeFileSync(outputFile, report);
    console.log(`Progress report generated: ${outputFile}`);
  }
}

module.exports = ProgressReportGenerator;
```

### 4.2 风险评估工具

```javascript
#!/usr/bin/env node
/**
 * 项目风险评估工具
 * Usage: node risk-analyzer.js [plan-file]
 */

const fs = require('fs');
const yaml = require('js-yaml');

class RiskAnalyzer {
  constructor(planFile) {
    this.plan = this.loadPlan(planFile);
  }

  loadPlan(planFile) {
    try {
      const content = fs.readFileSync(planFile, 'utf8');
      return yaml.load(content);
    } catch (error) {
      console.error('Error loading plan file:', error.message);
      process.exit(1);
    }
  }

  analyzeRisks() {
    const risks = this.plan.risks || [];
    
    return {
      summary: this.generateRiskSummary(risks),
      matrix: this.generateRiskMatrix(risks),
      trends: this.analyzeRiskTrends(risks),
      recommendations: this.generateRecommendations(risks)
    };
  }

  generateRiskSummary(risks) {
    const riskCounts = {
      high: 0,
      medium: 0,
      low: 0
    };
    
    const categoryCounts = {};
    
    risks.forEach(risk => {
      riskCounts[risk.severity || 'medium']++;
      
      const category = risk.category || 'general';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    return {
      totalRisks: risks.length,
      riskCounts,
      categoryCounts,
      openRisks: risks.filter(r => r.status === 'open').length,
      mitigatedRisks: risks.filter(r => r.status === 'mitigated').length
    };
  }

  generateRiskMatrix(risks) {
    const matrix = {
      high: { high: [], medium: [], low: [] },
      medium: { high: [], medium: [], low: [] },
      low: { high: [], medium: [], low: [] }
    };
    
    risks.forEach(risk => {
      const probability = risk.probability || 'medium';
      const impact = risk.impact || 'medium';
      
      if (matrix[probability] && matrix[probability][impact]) {
        matrix[probability][impact].push(risk);
      }
    });
    
    return matrix;
  }

  analyzeRiskTrends(risks) {
    // 简化的趋势分析
    return {
      increasingRisks: risks.filter(r => this.isRiskIncreasing(r)).length,
      decreasingRisks: risks.filter(r => this.isRiskDecreasing(r)).length,
      stableRisks: risks.filter(r => this.isRiskStable(r)).length
    };
  }

  generateRecommendations(risks) {
    const highRiskCount = risks.filter(r => r.severity === 'high').length;
    const openRisks = risks.filter(r => r.status === 'open');
    
    const recommendations = [];
    
    if (highRiskCount > 0) {
      recommendations.push({
        type: 'urgent',
        message: `发现 ${highRiskCount} 个高风险项目，需要立即制定缓解措施`,
        actions: ['召开风险评估会议', '制定详细缓解计划', '分配专门负责人']
      });
    }
    
    if (openRisks.length > 5) {
      recommendations.push({
        type: 'warning',
        message: '未处理风险过多，建议优先处理',
        actions: ['风险优先级排序', '资源重新分配', '定期跟踪会议']
      });
    }
    
    return recommendations;
  }

  isRiskIncreasing(risk) {
    // 简化的判断逻辑
    return risk.trend === 'increasing';
  }

  isRiskDecreasing(risk) {
    return risk.trend === 'decreasing';
  }

  isRiskStable(risk) {
    return !risk.trend || risk.trend === 'stable';
  }

  generateReport() {
    const analysis = this.analyzeRisks();
    
    return `## 项目风险评估报告
**评估日期：** ${new Date().toISOString().split('T')[0]}
**项目名称：** ${this.plan.name}

### 📊 风险概览
- **总风险数：** ${analysis.summary.totalRisks}
- **高风险：** ${analysis.summary.riskCounts.high}
- **中风险：** ${analysis.summary.riskCounts.medium}
- **低风险：** ${analysis.summary.riskCounts.low}

### 📈 风险趋势
- **增加中：** ${analysis.trends.increasingRisks}
- **减少中：** ${analysis.trends.decreasingRisks}
- **稳定：** ${analysis.trends.stableRisks}

### 💡 建议行动
${analysis.recommendations.map(rec => 
  `- **${rec.type.toUpperCase()}**: ${rec.message}\n  行动：${rec.actions.join(', ')}`
).join('\n')}`;
  }
}

// CLI使用
if (require.main === module) {
  const planFile = process.argv[2] || 'plan.yaml';
  const analyzer = new RiskAnalyzer(planFile);
  const report = analyzer.generateReport();
  
  const outputFile = `risk-analysis-${new Date().toISOString().split('T')[0]}.md`;
  fs.writeFileSync(outputFile, report);
  console.log(`Risk analysis report generated: ${outputFile}`);
}

module.exports = RiskAnalyzer;
```

### 4.3 工作量计算器

```javascript
#!/usr/bin/env node
/**
 * 团队工作量计算和优化工具
 * Usage: node workload-calculator.js [plan-file]
 */

const fs = require('fs');
const yaml = require('js-yaml');

class WorkloadCalculator {
  constructor(planFile) {
    this.plan = this.loadPlan(planFile);
  }

  loadPlan(planFile) {
    try {
      const content = fs.readFileSync(planFile, 'utf8');
      return yaml.load(content);
    } catch (error) {
      console.error('Error loading plan file:', error.message);
      process.exit(1);
    }
  }

  calculateWorkload() {
    const team = this.plan.team || { members: [] };
    const tasks = this.plan.tasks || [];
    
    return {
      teamOverview: this.calculateTeamOverview(team, tasks),
      individualWorkload: this.calculateIndividualWorkload(team, tasks),
      recommendations: this.generateRecommendations(team, tasks),
      capacityPlanning: this.calculateCapacityPlanning(team, tasks)
    };
  }

  calculateTeamOverview(team, tasks) {
    const totalCapacity = team.members.reduce((sum, member) => sum + (member.capacity || 40), 0);
    const totalAssignedHours = tasks.reduce((sum, task) => sum + (task.estimated_hours || 0), 0);
    
    return {
      totalMembers: team.members.length,
      totalCapacity,
      totalAssignedHours,
      overallUtilization: (totalAssignedHours / totalCapacity * 100).toFixed(1),
      averageUtilization: this.calculateAverageUtilization(team, tasks)
    };
  }

  calculateIndividualWorkload(team, tasks) {
    return team.members.map(member => {
      const memberTasks = tasks.filter(t => t.assignee === member.name);
      const assignedHours = memberTasks.reduce((sum, t) => sum + (t.estimated_hours || 0), 0);
      const assignedStoryPoints = memberTasks.reduce((sum, t) => sum + (t.story_points || 0), 0);
      
      const skillMatchScore = this.calculateSkillMatch(member, memberTasks);
      
      return {
        name: member.name,
        role: member.role,
        capacity: member.capacity || 40,
        assignedHours,
        assignedStoryPoints,
        utilization: (assignedHours / (member.capacity || 40) * 100).toFixed(1),
        skillMatchScore: skillMatchScore.toFixed(1),
        taskCount: memberTasks.length,
        riskLevel: this.assessWorkloadRisk(assignedHours, member.capacity || 40)
      };
    });
  }

  calculateSkillMatch(member, tasks) {
    if (tasks.length === 0) return 100;
    
    const memberSkills = member.skills || [];
    let totalMatchScore = 0;
    
    tasks.forEach(task => {
      const taskTags = task.tags || [];
      const matchingSkills = taskTags.filter(tag => memberSkills.includes(tag)).length;
      const taskScore = matchingSkills > 0 ? (matchingSkills / taskTags.length) * 100 : 50;
      totalMatchScore += taskScore;
    });
    
    return totalMatchScore / tasks.length;
  }

  assessWorkloadRisk(assignedHours, capacity) {
    const utilization = assignedHours / capacity;
    
    if (utilization > 1.1) return 'high';
    if (utilization > 0.9) return 'medium';
    return 'low';
  }

  generateRecommendations(team, tasks) {
    const individualWorkload = this.calculateIndividualWorkload(team, tasks);
    const recommendations = [];
    
    // 识别过载成员
    const overloadedMembers = individualWorkload.filter(w => w.riskLevel === 'high');
    if (overloadedMembers.length > 0) {
      recommendations.push({
        type: 'rebalance',
        message: '以下成员工作负载过高，建议重新分配任务',
        members: overloadedMembers.map(m => m.name),
        actions: ['重新分配任务', '增加人手', '调整优先级']
      });
    }
    
    // 识别技能不匹配
    const lowSkillMatch = individualWorkload.filter(w => w.skillMatchScore < 70);
    if (lowSkillMatch.length > 0) {
      recommendations.push({
        type: 'skill',
        message: '发现技能匹配度较低的情况',
        members: lowSkillMatch.map(m => ({
          name: m.name,
          score: m.skillMatchScore,
          suggestion: '考虑培训或任务调整'
        }))
      });
    }
    
    return recommendations;
  }

  calculateCapacityPlanning(team, tasks) {
    const totalRemainingHours = tasks
      .filter(t => t.status !== 'completed')
      .reduce((sum, t) => sum + (t.estimated_hours || 0), 0);
    
    const totalCapacity = team.members.reduce((sum, m) => sum + (m.capacity || 40), 0);
    const weeksNeeded = Math.ceil(totalRemainingHours / totalCapacity);
    
    return {
      totalRemainingHours,
      totalCapacity,
      weeksNeeded,
      completionDate: this.calculateCompletionDate(weeksNeeded)
    };
  }

  calculateCompletionDate(weeks) {
    const date = new Date();
    date.setDate(date.getDate() + (weeks * 7));
    return date.toISOString().split('T')[0];
  }

  generateReport() {
    const workload = this.calculateWorkload();
    
    return `## 团队工作量分析报告
**分析日期：** ${new Date().toISOString().split('T')[0]}
**项目名称：** ${this.plan.name}

### 📊 团队概览
- **团队规模：** ${workload.teamOverview.totalMembers}人
- **总容量：** ${workload.teamOverview.totalCapacity}小时/周
- **总分配：** ${workload.teamOverview.totalAssignedHours}小时
- **整体利用率：** ${workload.teamOverview.overallUtilization}%

### 👥 个人工作量
${workload.individualWorkload.map(member => 
  `- **${member.name}** (${member.role}): ${member.assignedHours}/${member.capacity}小时 (${member.utilization}%) - 风险等级：${member.riskLevel}`
).join('\n')}

### 💡 优化建议
${workload.recommendations.map(rec => 
  `- **${rec.type}**: ${rec.message}\n  建议行动：${rec.actions ? rec.actions.join(', ') : rec.members.map(m => `${m.name} - ${m.suggestion}`).join('; ')}`
).join('\n')}

### 📅 完成预测
- **剩余工时：** ${workload.capacityPlanning.totalRemainingHours}小时
- **预计完成：** ${workload.capacityPlanning.completionDate}
- **需要周数：** ${workload.capacityPlanning.weeksNeeded}周
`;
  }
}

// CLI使用
if (require.main === module) {
  const planFile = process.argv[2] || 'plan.yaml';
  const calculator = new WorkloadCalculator(planFile);
  const report = calculator.generateReport();
  
  const outputFile = `workload-analysis-${new Date().toISOString().split('T')[0]}.md`;
  fs.writeFileSync(outputFile, report);
  console.log(`Workload analysis report generated: ${outputFile}`);
}

module.exports = WorkloadCalculator;
```

## 5. 使用说明

### 5.1 安装依赖
```bash
npm install js-yaml commander chalk
```

### 5.2 使用方法
```bash
# 生成进度报告
node scripts/project-management/progress-report-generator.js plan.yaml

# 风险评估
node scripts/project-management/risk-analyzer.js plan.yaml

# 工作量分析
node scripts/project-management/workload-calculator.js plan.yaml
```

### 5.3 集成到CI/CD
可以将脚本集成到GitHub Actions工作流中，实现自动化报告生成：

```yaml
name: 项目管理报告
on:
  schedule:
    - cron: '0 9 * * 1'  # 每周一早9点
  workflow_dispatch:

jobs:
  generate-reports:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm install
      - name: Generate reports
        run: |
          node scripts/project-management/progress-report-generator.js plan.yaml
          node scripts/project-management/risk-analyzer.js plan.yaml
          node scripts/project-management/workload-calculator.js plan.yaml
      - name: Upload reports
        uses: actions/upload-artifact@v2
        with:
          name: project-reports
          path: |
            *-report-*.md
            *-analysis-*.md