# PearAI 仓库模板规则文件 v0.1.0

这是一个规则文件，用于定义与 PearAI 交互时的行为准则和项目管理规范。

## 工作流程

### 基本工作方式

1. **首先读取规则文件** - PearAI应该首先读取`.roo/rules/rules.md`文件，了解项目的规则和约定
2. **确定技术栈** - 在项目开始时，明确开发语言、框架和技术栈，并记录在此规则文件中
3. **根据规则进行编码** - 严格按照规则文件中的要求进行所有开发和编码工作
4. **计划驱动开发** - 所有开发工作都应基于计划文件中定义的目标和任务
5. **分块编码** - 每次编码长度不要过长，采用分块分步的方式进行开发
6. **环境变量处理** - 查看本地是否有 `.env` 或类似的环境变量文件，从中获取环境变量用于测试和配置

### 计划管理流程

1. **创建/修改计划** - 根据用户的意见和需求，创建新的计划文件或修改现有计划
2. **智能版本控制** - 由 AI 根据用户改动的大小自动判断版本号如何增加：
   - 重大功能变更或架构调整：主版本号+1 (如1.0.0 → 2.0.0)
   - 新功能添加：次版本号+1 (如1.0.0 → 1.1.0)
   - 错误修复或小幅改进：修订版本号+1 (如1.0.0 → 1.0.1)
3. **对话整合** - 可以将用户在一个对话中的多个要求整合到一个计划文件中
4. **模块化编码** - 根据计划文件进行模块化的编码实现

## 项目结构规则

### 文件组织

- `.roo/rules/rules.md` - 项目规则和约定文档
- `plan/x.y.z.yaml` - 版本化的计划文件，其中 `x.y.z` 为语义化版本号
- `templates/` - 各类模板文件目录
- `docs/` - 项目文档目录
- 所有模板文件应保持清晰的目录结构

### 版本管理

- 计划文件使用语义化版本号（如0.0.0, 1.0.0, 1.1.0, 2.0.0）
- 主版本号：重大功能变更或不兼容更新
- 次版本号：新功能添加，向后兼容
- 修订版本号：错误修复和小幅改进

## 项目技术栈配置

### 开发语言和技术栈

- **主要开发语言**: [支持多种语言 - 自动识别]
- **前端框架**: [根据项目类型自动配置]
- **后端框架**: [根据技术栈自动选择]
- **数据库**: [支持多种数据库 - 自动配置]
- **部署平台**: [Docker/Kubernetes/AWS/阿里云]
- **其他工具**: [Redis, Nginx, 监控工具等]

### 环境配置

- 项目应包含适当的环境变量配置文件（如 `.env` ）
- AI 会自动读取环境变量文件以获取配置信息
- 敏感信息应通过 `.rooignore` 文件排除 AI 读取

## PearAI交互规则

### 编码规范

- **分块开发** - 每次编码任务应控制在合理长度，避免一次性生成过长代码，单次单个文件修改最多不要超过400行
- **逐步实现** - 复杂功能应分解为多个小步骤，逐步完成
- **环境感知** - 自动检查并使用项目中的环境变量配置
- **成本控制** - 开发时注意AI请求的成本，不要说没用的废话，说话要简练精确

### 测试规范

- 测试时检查有无环境变量，如果有，从其中获取测试用户名和密码
- 测试完无论是正常还是报错，记得释放端口，不要让测试实例一直运行，不结束测试实例不允许结束任务

### 计划修改

- PearAI 可以根据用户需求自动修改计划目标
- 修改时应保持 YAML 文件的结构完整性
- 新目标应包含 title 、 description 、 status 、 priority 字段

### 任务管理

- 每个任务必须有唯一的 ID 标识
- 任务状态包括： pending （待处理）、 in_progress （进行中）、 completed （已完成）、 cancelled （已取消）
- 优先级分为： high （高）、 medium （中）、 low （低）

### 文档维护

- 规则文件应定期更新以反映最新需求
- 计划文件的 metadata 部分应记录修改历史
- 所有变更应有明确的说明和时间戳

## 使用指南

### 创建新计划

1. **使用模板文件** - 根据`/plan/template.yaml`文件创建新的计划文件
2. **复制并重命名** - 将 template.yaml 复制为新的版本号文件（如1.0.0.yaml ）
3. **更新版本信息** - 修改文件中的 version 字段和基本信息
4. **调整计划内容** - 根据项目需求调整目标、任务和里程碑
5. **完善元数据** - 更新 metadata 中的创建信息和标签

### 项目初始化

**推荐使用 init.sh 脚本：**

项目提供了 `init.sh` 交互式初始化脚本，可以自动完成以下任务：

1. **收集项目信息** - 项目名称、描述、作者等基础信息
2. **选择技术栈** - 开发语言、前端框架、后端框架、数据库、部署平台
3. **生成配置文件** - 自动更新 `.roo/rules/rules.md` 中的技术栈配置
4. **创建AI提示词** - 生成用于AI项目初始化的完整提示词

**使用方法：**

```bash
chmod +x init.sh
./init.sh
```

**脚本特点：**

- 🎯 交互式命令行界面
- 📝 支持默认值和自定义输入
- 🔄 可重新配置已有项目
- 🤖 自动生成AI友好的配置

### 与 PearAI 协作

- 使用自然语言描述需求， PearAI 会自动解析并更新计划
- 可以直接要求 PearAI 读取当前计划状态
- 支持批量修改多个目标或任务的状态

## 质量标准

- 所有目标必须具有可衡量的成功标准
- 任务描述应清晰明确，避免歧义
- 时间节点应合理可达成
- 优先级设置应符合项目实际需求

## 自动化工具链规则

### 工具链选择原则

1. **技术栈识别**：根据项目文件自动识别技术栈
   - 存在 `package.json` → Node.js项目
   - 存在 `requirements.txt` 或 `pyproject.toml` → Python项目
   - 存在 `pom.xml` 或 `build.gradle` → Java项目
   - 存在 `go.mod` → Go项目

2. **CI/CD平台选择优先级**：
   - 有 `.github/workflows/` → 使用GitHub Actions
   - 有 `.gitlab-ci.yml` → 使用GitLab CI
   - 有 `Jenkinsfile` → 使用Jenkins
   - 无配置 → 推荐GitHub Actions

3. **代码质量工具选择**：
   - **JavaScript/TypeScript**：ESLint + Prettier
   - **Python**：Black + Flake8
   - **Java**：Checkstyle + SonarQube
   - **通用**：SonarQube适用于所有语言

4. **测试框架选择**：
   - **Node.js**：Jest（单元测试）+ Cypress（E2E）
   - **Python**：pytest（单元测试）+ Selenium（E2E）
   - **Java**：JUnit（单元测试）+ TestNG（集成测试）

### 自动化配置流程

1. **项目分析阶段**
   - 扫描项目根目录识别技术栈
   - 检查现有CI/CD配置
   - 分析依赖文件确定需要的工具

2. **模板选择阶段**
   - 根据技术栈选择对应模板
   - 根据项目复杂度调整配置
   - 考虑团队规模选择适当策略

3. **配置定制阶段**
   - 替换模板中的占位符
   - 调整触发条件和分支策略
   - 配置环境变量和密钥

### 模板使用规范

1. **模板文件位置**：`templates/automation/`
2. **文件命名**：`*.template` 格式
3. **占位符规范**：
   - `{{PROJECT_NAME}}` - 项目名称
   - `{{NODE_VERSION}}` - Node.js版本
   - `{{PYTHON_VERSION}}` - Python版本
   - `{{DEPLOY_ENV}}` - 部署环境

### 质量门禁规则

1. **代码覆盖率**：新代码覆盖率 ≥ 80%
2. **代码质量**：关键漏洞0个，主要漏洞≤5个
3. **性能测试**：响应时间退化≤10%

### 部署策略模板

1. **蓝绿部署**：零停机，快速回滚
2. **金丝雀发布**：渐进式发布，风险可控
3. **滚动更新**：资源利用率高，适合无状态服务

## 安全合规规则

### 安全扫描原则

1. **依赖漏洞扫描**
   - 每次构建自动执行安全扫描
   - 发现高危漏洞时构建失败
   - 支持Snyk、OWASP等主流工具

2. **代码安全审计**
   - 静态代码分析检查安全漏洞
   - 敏感信息泄露检测
   - 不安全的编码实践识别

3. **合规性检查**
   - OWASP Top 10 安全检查
   - 数据保护合规(GDPR/CCPA)
   - 行业特定合规要求

### 安全配置模板

1. **安全扫描配置**
   - `templates/security/.snyk` - Snyk配置文件
   - `templates/security/security-scan.yml` - GitHub Actions安全扫描

2. **敏感信息保护**
   - `.env` 文件自动加入 `.gitignore`
   - 密钥和令牌自动检测和保护
   - 代码提交前敏感信息检查

3. **访问控制**
   - 基于角色的权限管理
   - API密钥和环境变量安全存储
   - 最小权限原则实施

### 安全最佳实践

1. **开发阶段**
   - 安全编码规范遵循
   - 依赖库定期更新
   - 代码审查包含安全检查

2. **部署阶段**
   - 容器镜像安全扫描
   - 基础设施即代码安全审查
   - 运行时安全监控

## 性能规模化规则

### 架构扩展原则

1. **微服务架构**
   - 服务拆分基于业务边界
   - 独立部署和扩展能力
   - 服务间通信优化

2. **数据库扩展**
   - 读写分离架构
   - 分库分表策略
   - 缓存层优化

3. **缓存策略**
   - 多级缓存架构
   - 缓存失效策略
   - 缓存一致性保证

### 性能监控指标

1. **应用性能**
   - 响应时间 < 200ms (P95)
   - 错误率 < 0.1%
   - 吞吐量 > 1000 RPS

2. **系统资源**
   - CPU使用率 < 70%
   - 内存使用率 < 80%
   - 磁盘I/O < 50MB/s

3. **业务指标**
   - 用户满意度 > 95%
   - 系统可用性 > 99.9%
   - 数据一致性 > 99.99%

### 容量规划模板

1. **增长预测**
   - 用户增长率：月增长20%
   - 数据增长率：日增长1GB
   - 计算资源需求：季度增长50%

2. **扩展策略**
   - 水平扩展优先
   - 自动扩缩容配置
   - 资源预留和弹性

### 监控告警规则

1. **告警级别**
   - 致命(Critical)：系统不可用
   - 严重(High)：性能严重下降
   - 警告(Medium)：资源接近瓶颈
   - 信息(Info)：一般状态变化

2. **告警通道**
   - 邮件通知
   - 钉钉/企业微信
   - 短信通知
   - 系统日志

## 模板文件索引

### 自动化模板
- `templates/automation/ci-cd/github-actions.yml.template` - GitHub Actions配置
- `templates/automation/quality/.eslintrc.template` - ESLint配置
- `templates/automation/quality/.prettierrc.template` - Prettier配置
- `templates/automation/quality/sonar-project.properties.template` - SonarQube配置
- `templates/automation/testing/jest.config.js.template` - Jest测试配置
- `templates/automation/testing/cypress.config.js.template` - Cypress配置
- `templates/automation/security/.snyk.template` - Snyk安全扫描
- `templates/automation/security/security-scan.yml.template` - 安全扫描工作流

### 性能模板
- `templates/performance/monitoring/prometheus.yml.template` - Prometheus监控
- `templates/performance/monitoring/grafana-dashboard.json.template` - Grafana仪表板
- `templates/performance/cache/redis.conf.template` - Redis缓存配置
- `templates/performance/database/mysql.cnf.template` - MySQL优化配置

### 部署模板
- `templates/deployment/docker/Dockerfile.template` - Docker容器配置
- `templates/deployment/kubernetes/deployment.yaml.template` - K8s部署
- `templates/deployment/terraform/main.tf.template` - 基础设施即代码

## 版本历史

### v0.1.0 (2025-07-18)
- ✅ 完成自动化工具链架构设计
- ✅ 实现项目管理扩展功能
- ✅ 集成安全合规检查
- ✅ 建立性能规模化框架
- ✅ 创建完整的模板体系

### v0.0.0 (2025-07-15)
- ✅ 基础项目结构建立
- ✅ 规则文件初始化
- ✅ 计划管理框架
- ✅ 模板系统基础
