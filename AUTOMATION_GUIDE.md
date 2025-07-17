# 自动化工具链使用指南

## 概述

本指南介绍了如何使用PearAI仓库模板中的自动化工具链模板，实现CI/CD流水线、代码质量检查、自动化测试和安全扫描的快速配置。

## 快速开始

### 1. 项目初始化

```bash
# 使用交互式初始化脚本
./init.sh

# 或手动选择模板
cp templates/automation/ci-cd/github-actions.yml.template .github/workflows/ci.yml
```

### 2. AI辅助配置

对PearAI说出你的需求，例如：

**基础配置**
```
"为我的Node.js项目添加GitHub Actions CI/CD"
```

**详细配置**
```
"为Python Django项目配置完整的CI/CD，包括pytest测试、Black代码格式化、安全扫描"
```

**特定技术栈**
```
"添加Java Spring Boot项目的CI配置，包含Maven构建、JUnit测试、SonarQube代码质量检查"
```

## 模板文件说明

### CI/CD 模板

#### GitHub Actions (github-actions.yml.template)
- **自动技术栈识别**: 支持Node.js、Python、Java、Go
- **多阶段构建**: 分析 → 质量检查 → 测试 → 安全扫描 → 部署
- **灵活配置**: 通过环境变量和占位符定制

#### 使用示例
```yaml
# 重命名后根据项目调整
env:
  PROJECT_NAME: my-awesome-app
  NODE_VERSION: 18
  PYTHON_VERSION: 3.9
```

### 代码质量模板

#### ESLint (.eslintrc.template)
- **技术栈适配**: 支持JavaScript、TypeScript、React、Vue
- **规则分级**: 错误、警告、提示
- **可扩展**: 支持自定义规则

#### Prettier (.prettierrc.template)
- **一致格式**: 统一的代码格式化
- **多语言支持**: JavaScript、JSON、Markdown等
- **团队配置**: 支持项目级配置

#### SonarQube (sonar-project.properties.template)
- **多语言支持**: JavaScript、Python、Java、Go
- **质量阈值**: 可配置的代码质量标准
- **覆盖率集成**: 与测试框架无缝集成

### 测试框架模板

#### Jest (jest.config.js.template)
- **覆盖率配置**: 80%代码覆盖率要求
- **多种测试**: 单元测试、集成测试、快照测试
- **TypeScript支持**: 内置TypeScript配置

#### Cypress (cypress.config.js.template)
- **E2E测试**: 端到端测试配置
- **组件测试**: React/Vue组件测试
- **CI集成**: GitHub Actions集成示例

### 安全扫描模板

#### Snyk (.snyk.template)
- **依赖扫描**: 第三方库安全漏洞检测
- **许可证检查**: 开源许可证合规性
- **修复建议**: 自动修复建议

#### 安全扫描工作流 (security-scan.yml.template)
- **多层扫描**: 依赖、代码、密钥、容器
- **定时扫描**: 每日自动安全扫描
- **报告生成**: 自动化安全报告

## 技术栈配置指南

### Node.js 项目

**推荐配置组合:**
- CI/CD: GitHub Actions
- 代码质量: ESLint + Prettier
- 测试: Jest + Cypress
- 安全: npm audit + Snyk

**快速配置命令:**
```bash
# 复制模板
cp templates/automation/ci-cd/github-actions.yml.template .github/workflows/ci.yml
cp templates/automation/quality/.eslintrc.template .eslintrc.js
cp templates/automation/quality/.prettierrc.template .prettierrc
cp templates/automation/testing/jest.config.js.template jest.config.js

# 安装依赖
npm install --save-dev eslint prettier jest cypress
```

### Python 项目

**推荐配置组合:**
- CI/CD: GitHub Actions
- 代码质量: Black + Flake8
- 测试: pytest
- 安全: safety + bandit

**快速配置命令:**
```bash
# 复制模板
cp templates/automation/ci-cd/github-actions.yml.template .github/workflows/ci.yml
cp templates/automation/quality/.flake8.template .flake8  # 需要创建
cp templates/automation/testing/pytest.ini.template pytest.ini

# 安装依赖
pip install black flake8 pytest safety bandit
```

### Java 项目

**推荐配置组合:**
- CI/CD: GitHub Actions
- 代码质量: SonarQube
- 测试: JUnit + TestNG
- 安全: OWASP依赖检查

**快速配置命令:**
```bash
# 复制模板
cp templates/automation/ci-cd/github-actions.yml.template .github/workflows/ci.yml
cp templates/automation/quality/sonar-project.properties.template sonar-project.properties

# Maven配置
mvn org.owasp:dependency-check-maven:check
```

## 环境变量配置

### 必需变量
```bash
# GitHub Secrets配置
SONAR_TOKEN=your_sonar_token
SNYK_TOKEN=your_snyk_token
CODECOV_TOKEN=your_codecov_token
```

### 可选变量
```bash
# 项目特定
PROJECT_NAME=my-project
NODE_VERSION=18
PYTHON_VERSION=3.9
DEPLOY_ENV=staging
```

## 分支策略模板

### GitHub Flow (简单项目)
- `main`: 生产分支
- `feature/*`: 功能分支
- 直接PR到main

### Git Flow (复杂项目)
- `main`: 生产分支
- `develop`: 开发分支
- `feature/*`: 功能分支
- `release/*`: 发布分支
- `hotfix/*`: 热修复分支

### GitLab Flow (企业项目)
- `main`: 稳定分支
- `develop`: 开发分支
- `staging`: 预发布分支
- `feature/*`: 功能分支

## 质量门禁配置

### 代码覆盖率
```yaml
coverageThreshold:
  global:
    branches: 80
    functions: 80
    lines: 80
    statements: 80
```

### 代码质量
- 关键漏洞: 0个
- 主要漏洞: ≤5个
- 技术债务: 不允许增长

### 性能测试
- 响应时间退化: ≤10%
- 内存使用增长: ≤5%

## 故障排除

### 常见问题

1. **模板变量未替换**
   - 检查是否正确设置了占位符
   - 确认环境变量配置

2. **CI/CD运行失败**
   - 检查技术栈识别是否正确
   - 验证依赖安装命令

3. **代码质量检查失败**
   - 检查配置文件格式
   - 确认依赖版本兼容性

4. **测试覆盖率不达标**
   - 调整覆盖率阈值
   - 增加测试用例

### 调试技巧

```bash
# 本地测试GitHub Actions
act push

# 本地运行ESLint
npx eslint src/

# 本地运行测试
npm test
```

## 最佳实践

1. **渐进式实施**: 先配置基础CI，再逐步添加高级功能
2. **团队培训**: 确保团队成员理解工作流
3. **定期更新**: 保持工具和配置的最新状态
4. **监控反馈**: 持续监控CI/CD性能和效果

## 扩展功能

### 自定义模板
1. 在`templates/automation/`下创建新目录
2. 添加模板文件
3. 更新规则文件中的选择逻辑

### 集成第三方服务
- Slack通知
- GitHub Issues自动创建
- 部署状态Webhooks

## 支持

遇到问题？请参考：
- [规则文档](.roo/rules/rules.md) - 详细配置规则
- [模板目录](templates/automation/) - 所有可用模板
- [GitHub Issues](https://github.com/your-repo/issues) - 问题反馈