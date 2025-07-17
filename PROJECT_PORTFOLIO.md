# 项目集管理模板

## 项目集管理框架

### 管理层次
```
┌─────────────────────────────────────┐
│          项目组合层                    │
│        (Portfolio Management)        │
├─────────────────────────────────────┤
│          项目集层                      │
│        (Program Management)          │
├─────────────────────────────────────┤
│          单项目层                      │
│        (Project Management)          │
├─────────────────────────────────────┤
│          任务层                        │
│        (Task Management)             │
└─────────────────────────────────────┘
```

### 项目集生命周期
- **启动阶段**：项目集定义、目标设定
- **规划阶段**：资源分配、风险评估
- **执行阶段**：项目协调、进度跟踪
- **监控阶段**：性能度量、风险控制
- **收尾阶段**：成果验收、经验总结

## 项目集配置模板

### 1. 项目集定义

```yaml
# project-portfolio.yaml
portfolio:
  name: "企业数字化转型项目集"
  description: "包含多个业务系统的数字化转型计划"
  strategic_objectives:
    - "提升运营效率30%"
    - "降低IT成本20%"
    - "改善客户体验"
    - "增强数据驱动决策能力"
  
  governance:
    sponsor: "CEO"
    program_manager: "CTO"
    steering_committee:
      - "CFO"
      - "COO"
      - "CIO"
    
  budget:
    total: 5000000
    currency: "USD"
    fiscal_year: 2024
    
  timeline:
    start_date: "2024-01-01"
    end_date: "2024-12-31"
    milestones:
      - name: "Q1规划完成"
        date: "2024-03-31"
        deliverables: ["项目计划", "预算批准"]
      - name: "Q2试点项目启动"
        date: "2024-06-30"
        deliverables: ["试点系统上线", "用户培训"]
      - name: "Q3全面推广"
        date: "2024-09-30"
        deliverables: ["核心系统迁移", "性能优化"]
      - name: "Q4项目收尾"
        date: "2024-12-31"
        deliverables: ["项目验收", "经验总结"]
```

### 2. 项目组合管理

#### 2.1 项目分类
```yaml
project_categories:
  - name: "核心业务系统"
    priority: "high"
    budget_allocation: 0.4
    risk_tolerance: "medium"
    
  - name: "客户体验改进"
    priority: "high"
    budget_allocation: 0.3
    risk_tolerance: "high"
    
  - name: "内部效率提升"
    priority: "medium"
    budget_allocation: 0.2
    risk_tolerance: "medium"
    
  - name: "创新实验项目"
    priority: "low"
    budget_allocation: 0.1
    risk_tolerance: "high"
```

#### 2.2 项目评分矩阵
```yaml
scoring_matrix:
  criteria:
    - name: "战略对齐度"
      weight: 0.3
      scale: 1-5
      
    - name: "财务回报"
      weight: 0.25
      scale: 1-5
      
    - name: "实施风险"
      weight: 0.2
      scale: 1-5
      invert: true
      
    - name: "技术可行性"
      weight: 0.15
      scale: 1-5
      
    - name: "资源需求"
      weight: 0.1
      scale: 1-5
      invert: true
      
  thresholds:
    minimum_score: 3.0
    auto_approve: 4.5
    requires_review: 2.5
```

## 项目依赖管理

### 1. 依赖关系图

#### 1.1 依赖类型定义
```yaml
dependencies:
  types:
    - name: "技术依赖"
      description: "共享技术栈或基础设施"
      impact_level: "high"
      
    - name: "资源依赖"
      description: "共享人力资源或预算"
      impact_level: "medium"
      
    - name: "时间依赖"
      description: "项目间里程碑协调"
      impact_level: "medium"
      
    - name: "数据依赖"
      description: "数据共享或接口依赖"
      impact_level: "high"
```

#### 1.2 依赖关系配置
```yaml
project_dependencies:
  - source: "crm_system_upgrade"
    target: "user_authentication_service"
    type: "技术依赖"
    description: "CRM系统需要新的认证服务"
    criticality: "high"
    
  - source: "mobile_app_v2"
    target: "api_gateway_upgrade"
    type: "技术依赖"
    description: "新APP需要升级API网关"
    criticality: "high"
    
  - source: "data_analytics_platform"
    target: "data_warehouse_migration"
    type: "数据依赖"
    description: "分析平台依赖数据仓库"
    criticality: "medium"
    
  - source: "customer_portal"
    target: "payment_system_upgrade"
    type: "时间依赖"
    description: "客户门户需要支付系统先升级"
    criticality: "high"
```

### 2. 影响分析

#### 2.1 变更影响评估
```yaml
impact_analysis:
  project: "api_gateway_upgrade"
  change_type: "breaking_change"
  
  affected_projects:
    - name: "mobile_app_v2"
      impact: "high"
      mitigation: "同步更新API调用"
      timeline: "1-2 weeks"
      
    - name: "crm_system_upgrade"
      impact: "medium"
      mitigation: "增加版本兼容层"
      timeline: "3-5 days"
      
    - name: "web_portal"
      impact: "low"
      mitigation: "无需变更"
      timeline: "immediate"
```

## 资源分配管理

### 1. 人力资源分配

#### 1.1 团队配置模板
```yaml
resource_allocation:
  teams:
    - name: "核心系统团队"
      members:
        - role: "技术负责人"
          count: 1
          allocation: 1.0
          skills: ["架构设计", "微服务", "DevOps"]
          
        - role: "高级开发工程师"
          count: 3
          allocation: 1.0
          skills: ["Java", "Spring", "数据库"]
          
        - role: "测试工程师"
          count: 2
          allocation: 0.8
          skills: ["自动化测试", "性能测试"]
          
        - role: "DevOps工程师"
          count: 1
          allocation: 0.5
          skills: ["Kubernetes", "CI/CD", "监控"]
```

#### 1.2 资源冲突解决
```yaml
resource_conflicts:
  resolution_strategies:
    - name: "优先级排序"
      rule: "高优先级项目优先获得资源"
      
    - name: "时间分片"
      rule: "低优先级项目使用剩余时间"
      
    - name: "技能匹配"
      rule: "根据技能匹配度分配人员"
      
    - name: "负载均衡"
      rule: "避免个别人员过度分配"
```

### 2. 预算管理

#### 2.1 预算分配
```yaml
budget_allocation:
  categories:
    - name: "人力成本"
      percentage: 0.6
      description: "开发、测试、运维人员工资"
      
    - name: "基础设施"
      percentage: 0.2
      description: "云服务、软件许可、硬件"
      
    - name: "第三方服务"
      percentage: 0.1
      description: "API调用、外部集成"
      
    - name: "培训咨询"
      percentage: 0.05
      description: "技能培训、外部咨询"
      
    - name: "应急储备"
      percentage: 0.05
      description: "风险应对、变更处理"
```

#### 2.2 预算跟踪
```yaml
budget_tracking:
  projects:
    - name: "crm_system_upgrade"
      allocated_budget: 1500000
      spent_budget: 750000
      burn_rate: 125000  # 每月
      forecast_completion: "on_track"
      
    - name: "mobile_app_v2"
      allocated_budget: 800000
      spent_budget: 200000
      burn_rate: 80000
      forecast_completion: "under_budget"
```

## 风险管理

### 1. 项目集风险

#### 1.1 风险分类
```yaml
risk_categories:
  - type: "技术风险"
    probability: "medium"
    impact: "high"
    examples:
      - "技术选型错误"
      - "性能瓶颈"
      - "集成失败"
      
  - type: "资源风险"
    probability: "medium"
    impact: "medium"
    examples:
      - "关键人员流失"
      - "预算超支"
      - "供应商延期"
      
  - type: "业务风险"
    probability: "low"
    impact: "high"
    examples:
      - "需求变更"
      - "监管变化"
      - "市场竞争"
```

#### 1.2 风险应对策略
```yaml
risk_mitigation:
  risks:
    - id: "R001"
      description: "核心系统升级可能失败"
      probability: 0.3
      impact: "high"
      
      mitigation:
        - action: "制定详细回滚计划"
          owner: "技术负责人"
          timeline: "2024-02-01"
          
        - action: "建立灰度发布机制"
          owner: "DevOps团队"
          timeline: "2024-01-15"
          
        - action: "增加测试覆盖率"
          owner: "测试团队"
          timeline: "2024-01-30"
          
      contingency:
        trigger: "系统故障率>5%"
        action: "立即回滚到前一版本"
```

### 2. 依赖风险

#### 2.1 依赖风险监控
```yaml
dependency_risks:
  monitoring:
    - dependency: "user_authentication_service"
      risk_level: "high"
      health_checks:
        - name: "API可用性"
          endpoint: "/health"
          expected_status: 200
          frequency: "every_5_minutes"
          
        - name: "响应时间"
          endpoint: "/api/v1/auth/test"
          max_response_time: 500
          frequency: "every_1_minute"
          
      alerts:
        - condition: "availability < 95%"
          severity: "critical"
          notification: ["pagerduty", "slack"]
          
        - condition: "response_time > 1000ms"
          severity: "warning"
          notification: ["slack"]
```

## 进度跟踪

### 1. 里程碑管理

#### 1.1 关键里程碑
```yaml
milestones:
  - id: "M001"
    name: "项目启动"
    date: "2024-01-15"
    status: "completed"
    deliverables:
      - "项目章程"
      - "初始团队组建"
      - "技术架构评审"
    
  - id: "M002"
    name: "核心系统POC"
    date: "2024-03-31"
    status: "in_progress"
    deliverables:
      - "POC环境部署"
      - "功能验证报告"
      - "性能基线测试"
    
  - id: "M003"
    name: "试点项目上线"
    date: "2024-06-30"
    status: "planned"
    deliverables:
      - "试点系统部署"
      - "用户培训完成"
      - "监控配置"
```

### 2. 燃尽图跟踪

#### 2.1 项目进度数据
```yaml
progress_tracking:
  projects:
    - name: "crm_system_upgrade"
      total_scope: 100
      completed_scope: 45
      remaining_scope: 55
      velocity_per_sprint: 8
      estimated_completion: "2024-08-15"
      
    - name: "mobile_app_v2"
      total_scope: 80
      completed_scope: 20
      remaining_scope: 60
      velocity_per_sprint: 10
      estimated_completion: "2024-07-30"
```

## 沟通管理

### 1. 项目集沟通计划

#### 1.1 沟通矩阵
```yaml
communication_plan:
  channels:
    - type: "周报"
      frequency: "weekly"
      audience: ["项目集经理", "项目经理", "技术负责人"]
      format: "邮件+会议"
      topics: ["进度更新", "风险识别", "资源需求"]
      
    - type: "月度评审"
      frequency: "monthly"
      audience: ["指导委员会", "项目集经理", "关键干系人"]
      format: "演示+报告"
      topics: ["里程碑达成", "预算执行", "下月计划"]
      
    - type: "每日站会"
      frequency: "daily"
      audience: ["项目团队"]
      format: "15分钟站会"
      topics: ["昨日完成", "今日计划", "阻塞问题"]
```

### 2. 状态报告模板

#### 2.1 项目集状态报告
```markdown
# 项目集状态报告 - {{REPORT_DATE}}

## 总体状态
- **项目集健康度**: {{OVERALL_HEALTH}}
- **预算执行率**: {{BUDGET_UTILIZATION}}%
- **里程碑达成率**: {{MILESTONE_COMPLETION}}%

## 关键指标
| 指标 | 计划 | 实际 | 偏差 |
|------|------|------|------|
| 项目启动 | 5 | 4 | -20% |
| 进行中 | 8 | 10 | +25% |
| 已完成 | 3 | 2 | -33% |
| 风险项目 | 2 | 3 | +50% |

## 风险与问题
### 高风险项目
1. **CRM系统升级** - 技术架构复杂度超预期
2. **支付系统迁移** - 第三方支付接口延期

### 待解决问题
1. 资源冲突：开发团队A同时支持3个项目
2. 预算超支：基础设施成本增长15%

## 下阶段重点
1. 完成Q2试点项目验收
2. 启动Q3核心系统迁移
3. 优化跨项目资源分配
```

## 工具集成

### 1. 项目管理工具

#### 1.1 Jira配置
```yaml
jira_configuration:
  projects:
    - key: "CRM"
      name: "CRM系统升级"
      lead: "zhangsan"
      components:
        - "前端"
        - "后端"
        - "数据库"
        
    - key: "MOB"
      name: "移动APP V2"
      lead: "lisi"
      components:
        - "iOS"
        - "Android"
        - "API"
        
  workflows:
    - name: "项目集工作流"
      statuses:
        - "To Do"
        - "In Progress"
        - "In Review"
        - "Done"
        
  dashboards:
    - name: "项目集概览"
      widgets:
        - "项目进度"
        - "资源分配"
        - "风险热力图"
```

### 2. 资源管理工具

#### 2.1 资源日历
```yaml
resource_calendar:
  teams:
    - name: "核心开发团队"
      capacity: 8  # FTE
      allocation:
        - project: "crm_system_upgrade"
          percentage: 0.5
          period: "2024-01-15 to 2024-06-30"
          
        - project: "mobile_app_v2"
          percentage: 0.3
          period: "2024-02-01 to 2024-05-31"
          
        - project: "api_gateway_upgrade"
          percentage: 0.2
          period: "2024-03-01 to 2024-04-15"
```

## 质量保障

### 1. 质量标准

#### 1.1 项目集质量门
```yaml
quality_gates:
  gates:
    - name: "设计评审"
      phase: "planning"
      criteria:
        - "架构设计文档评审通过"
        - "技术方案可行性确认"
        - "风险评估完成"
        
    - name: "代码质量"
      phase: "development"
      criteria:
        - "代码覆盖率>80%"
        - "SonarQube等级>A"
        - "安全扫描通过"
        
    - name: "性能基准"
      phase: "testing"
      criteria:
        - "响应时间<P95 500ms"
        - "并发用户>1000"
        - "内存使用<2GB"
```

### 2. 验收标准

#### 2.1 项目验收清单
```yaml
acceptance_criteria:
  categories:
    - name: "功能性"
      items:
        - "所有用户故事完成"
        - "核心业务流程验证通过"
        - "集成测试通过"
        
    - name: "非功能性"
      items:
        - "性能指标达成"
        - "安全扫描无高危漏洞"
        - "监控告警配置完成"
        
    - name: "文档"
      items:
        - "用户手册更新"
        - "运维手册完成"
        - "API文档发布"
```

## 持续改进

### 1. 经验总结

#### 1.1 项目集回顾
```yaml
retrospectives:
  schedule: "monthly"
  participants:
    - "项目集经理"
    - "项目经理"
    - "技术负责人"
    - "产品经理"
    
  topics:
    - "成功经验"
    - "问题分析"
    - "改进建议"
    - "最佳实践"
    
  outputs:
    - "改进行动计划"
    - "知识库更新"
    - "流程优化建议"
```

### 2. 度量指标

#### 2.1 项目集KPI
```yaml
kpis:
  - name: "项目成功率"
    definition: "成功项目数/总项目数"
    target: 0.9
    
  - name: "预算控制率"
    definition: "实际支出/预算"
    target: 1.0
    
  - name: "里程碑达成率"
    definition: "按时达成里程碑数/总里程碑数"
    target: 0.85
    
  - name: "团队满意度"
    definition: "团队满意度调查平均分"
    target: 4.0
    
  - name: "客户满意度"
    definition: "客户满意度调查平均分"
    target: 4.5