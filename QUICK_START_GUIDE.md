# PearAI 仓库模板快速开始指南

## 🚀 5分钟快速上手

### 步骤1：环境准备
```bash
# 克隆模板仓库
git clone <your-template-repo> my-new-project
cd my-new-project

# 确保有执行权限
chmod +x init.sh
```

### 步骤2：一键初始化
```bash
./init.sh
```

交互式向导将引导你完成：
- ✅ 技术栈识别（自动检测）
- ✅ 项目配置（个性化定制）
- ✅ 工具链配置（自动化部署）
- ✅ 安全检查（依赖扫描）

### 步骤3：立即开始开发
```bash
# 根据技术栈选择命令
npm run dev      # Node.js项目
python manage.py runserver  # Python项目
./gradlew bootRun  # Java项目
go run main.go   # Go项目
```

## 📋 功能模块快速索引

### 1. 自动化CI/CD
| 功能 | 命令 | 文件位置 |
|------|------|----------|
| GitHub Actions | 自动触发 | `.github/workflows/` |
| 代码质量检查 | `npm run lint` | `.eslintrc.js` |
| 单元测试 | `npm test` | `jest.config.js` |
| E2E测试 | `npm run test:e2e` | `cypress.config.js` |

### 2. 项目管理
| 操作 | 命令 | 示例 |
|------|------|------|
| 创建计划 | 自动生成 | `plan/0.1.0.yaml` |
| 更新任务 | AI协助 | 自然语言描述 |
| 查看进度 | 阅读文件 | `plan/`目录 |

### 3. 安全合规
| 工具 | 命令 | 配置位置 |
|------|------|----------|
| 依赖扫描 | `npm audit` | `package.json` |
| 代码安全 | `snyk test` | `.snyk` |
| 敏感信息 | 自动检测 | `.rooignore` |

### 4. 性能监控
| 指标 | 工具 | 访问地址 |
|------|------|----------|
| 应用性能 | Prometheus | `http://localhost:9090` |
| 系统资源 | Grafana | `http://localhost:3000` |
| 错误日志 | 控制台输出 | 实时查看 |

## 🎯 按技术栈快速配置

### Node.js项目
```bash
# 初始化
./init.sh
# 选择：Node.js + Express + PostgreSQL

# 开发
npm install
npm run dev

# 测试
npm run test
npm run test:e2e

# 构建
npm run build
```

### Python项目
```bash
# 初始化
./init.sh
# 选择：Python + Django + MySQL

# 开发
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# 测试
pytest
```

### Java项目
```bash
# 初始化
./init.sh
# 选择：Java + Spring Boot + PostgreSQL

# 开发
./gradlew bootRun

# 测试
./gradlew test
```

### Go项目
```bash
# 初始化
./init.sh
# 选择：Go + Gin + MySQL

# 开发
go mod tidy
go run main.go

# 测试
go test ./...
```

## 🔧 常用配置模板

### 1. 环境变量配置
```bash
# .env 文件示例
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost/dbname
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
```

### 2. Docker配置
```bash
# 一键容器化
docker-compose up -d

# 包含服务：
# - 应用服务
# - 数据库
# - Redis缓存
# - 监控工具
```

### 3. 生产部署
```bash
# 使用GitHub Actions
git push origin main  # 自动触发部署

# 手动部署
./deploy.sh production
```

## 📊 监控和告警

### 1. 实时监控
访问以下地址查看监控数据：
- **应用指标**: http://localhost:3000 (Grafana)
- **系统资源**: http://localhost:9090 (Prometheus)
- **日志查看**: `docker-compose logs -f`

### 2. 告警配置
```yaml
# 告警规则示例
alerts:
  - name: high_error_rate
    condition: error_rate > 5%
    action: email + slack
    
  - name: high_response_time
    condition: response_time > 500ms
    action: page_oncall
```

## 🚨 常见问题解答

### Q: 初始化失败怎么办？
```bash
# 检查权限
ls -la init.sh
chmod +x init.sh

# 手动安装依赖
npm install  # 或对应技术栈命令
```

### Q: 如何添加新的技术栈支持？
1. 编辑 `init.sh` 添加新选项
2. 创建对应模板文件到 `templates/`
3. 更新规则文件 `.roo/rules/rules.md`

### Q: 如何自定义CI/CD流程？
1. 修改 `.github/workflows/` 下的文件
2. 参考 `templates/automation/` 中的模板
3. 测试配置：`act` 工具本地测试

### Q: 性能问题如何排查？
```bash
# 查看应用性能
curl http://localhost:9090/metrics

# 检查数据库
npm run db:monitor

# 查看日志
docker-compose logs app
```

### Q: 如何升级模板版本？
```bash
# 备份当前配置
cp -r .roo .roo.backup

# 拉取最新模板
git pull origin main

# 运行升级脚本
./upgrade.sh
```

## 📞 获取帮助

### 文档资源
- 📖 [完整文档](README.md)
- 📋 [改进总结](IMPROVEMENT_SUMMARY.md)
- 🔧 [规则说明](.roo/rules/rules.md)

### 社区支持
- 🐛 [报告问题](https://github.com/your-repo/issues)
- 💬 [讨论区](https://github.com/your-repo/discussions)
- 📧 [邮件支持](mailto:support@your-domain.com)

### 快速故障排除
```bash
# 运行诊断脚本
./diagnose.sh

# 查看系统状态
./status.sh

# 重置到初始状态
./reset.sh
```

## 🎉 恭喜！

现在你已经成功配置了完整的开发环境，包含：
- ✅ 自动化CI/CD
- ✅ 代码质量检查
- ✅ 安全扫描
- ✅ 性能监控
- ✅ 容器化部署

开始你的开发之旅吧！