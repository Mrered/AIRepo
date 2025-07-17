# 🤖 PearAI 项目模板

一个专为 AI 协作设计的项目模板，用结构化计划管理你的开发。

## 🚀 30秒上手

```bash
# 1. 克隆或用这个模板
git clone https://github.com/Mrered/AIRepo.git

# 2. 一键初始化
chmod +x init.sh && ./init.sh
# 回答几个简单问题，AI自动配置

# 3. 开始协作
# 告诉AI你的需求，它会帮你制定计划
"我想添加用户登录功能"
```

## 📁 项目结构

```sh
├── init.sh                   # 初始化脚本
├── plan/
│   ├── template.yaml         # 计划模板
│   └── 1.0.0.yaml            # 当前计划
├── .roo/
│   ├── rules/                # 主规则
│   ├── rules-code/           # Code模式规则
│   ├── rules-orchestrator/   # 协调模式规则
│   └── ...                   # 其他Agent规则
└── LICENSE
```

## 💬 常用对话

### 开始新项目

```txt
"我有需求：____，帮我制定开发计划"
```

### 查看进度

```txt
"显示当前项目状态"
```

### 添加功能

```txt
"在现有计划中添加：____功能"
```

## 🎯 核心特性

- ✅ **AI理解项目** - 自动读取计划和规则
- ✅ **版本化计划** - 每个需求都有版本记录
- ✅ **分Agent管理** - 不同角色有专门规则
- ✅ **一键初始化** - 自动配置技术栈

## 🛡️ 安全提醒

在项目根目录创建 `.rooignore` 文件，排除敏感信息：

```env
.env
secrets/
private/
```

## 📄 许可证

[MIT](LICENSE)
