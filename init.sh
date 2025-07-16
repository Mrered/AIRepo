#!/bin/bash

# PearAI 仓库模板初始化脚本
# 此脚本帮助快速初始化新项目并配置基本设置

set -e

echo "🚀 PearAI 仓库模板初始化脚本"
echo "================================="

# 检查是否已经初始化过
if [ -f ".initialized" ]; then
    echo "⚠️  项目已经初始化过，是否重新初始化？(y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "取消初始化"
        exit 0
    fi
fi

# 创建必要的目录
echo "📁 创建必要的目录..."
mkdir -p logs
mkdir -p uploads
mkdir -p tmp
mkdir -p docs

# 复制环境变量文件
echo "🔧 设置环境变量..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ 已创建 .env 文件，请根据需要修改配置"
else
    echo "⚠️  .env 文件已存在，跳过创建"
fi

# 检查并安装依赖
echo "📦 检查项目依赖..."
if [ -f "package.json" ]; then
    echo "检测到 Node.js 项目，正在安装依赖..."
    if command -v npm &> /dev/null; then
        npm install
    elif command -v yarn &> /dev/null; then
        yarn install
    else
        echo "❌ 未找到 npm 或 yarn，请手动安装依赖"
    fi
elif [ -f "requirements.txt" ]; then
    echo "检测到 Python 项目，正在安装依赖..."
    if command -v pip &> /dev/null; then
        pip install -r requirements.txt
    else
        echo "❌ 未找到 pip，请手动安装依赖"
    fi
elif [ -f "Gemfile" ]; then
    echo "检测到 Ruby 项目，正在安装依赖..."
    if command -v bundle &> /dev/null; then
        bundle install
    else
        echo "❌ 未找到 bundle，请手动安装依赖"
    fi
else
    echo "ℹ️  未检测到常见的依赖配置文件"
fi

# 初始化 Git 钩子
echo "🔗 设置 Git 钩子..."
if [ -d ".git" ]; then
    # 创建 pre-commit 钩子
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# 预提交钩子 - 验证计划文件格式
if [ -f "scripts/validate.js" ]; then
    echo "验证计划文件格式..."
    node scripts/validate.js
    if [ $? -ne 0 ]; then
        echo "❌ 计划文件验证失败，请修复后重试"
        exit 1
    fi
fi
EOF
    chmod +x .git/hooks/pre-commit
    echo "✅ Git 预提交钩子已设置"
else
    echo "⚠️  不是 Git 仓库，跳过 Git 钩子设置"
fi

# 创建初始计划文件
echo "📋 创建初始计划文件..."
PROJECT_NAME=$(basename "$(pwd)")
CURRENT_DATE=$(date +%Y-%m-%d)

if [ ! -f "plan/0.0.0.yaml" ]; then
    sed "s/x\.y\.z/0.0.0/g; s/项目计划名称/$PROJECT_NAME/g; s/YYYY-MM-DD/$CURRENT_DATE/g" plan/template.yaml > plan/0.0.0.yaml
    echo "✅ 已创建初始计划文件 plan/0.0.0.yaml"
else
    echo "⚠️  计划文件 plan/0.0.0.yaml 已存在，跳过创建"
fi

# 交互式技术栈配置
echo ""
echo "🛠️  技术栈配置"
echo "================="
echo "请选择您的技术栈配置（可以稍后修改）："

# 读取用户输入
read -p "主要开发语言 (JavaScript/Python/Java/Go/其他): " DEV_LANG
read -p "前端框架 (React/Vue/Angular/其他/无): " FRONTEND
read -p "后端框架 (Express/Django/Spring/其他/无): " BACKEND
read -p "数据库 (MySQL/PostgreSQL/MongoDB/其他/无): " DATABASE
read -p "部署平台 (Docker/Kubernetes/AWS/Vercel/其他): " DEPLOYMENT

# 更新规则文件中的技术栈配置
if [ -f ".roo/rules/rules.md" ]; then
    echo "📝 更新技术栈配置到规则文件..."
    
    # 创建临时文件
    temp_file=$(mktemp)
    
    # 替换技术栈配置
    sed "s/\[待确定 - 如 JavaScript, Python, Java 等\]/$DEV_LANG/g; \
         s/\[待确定 - 如 React, Vue, Angular 等\]/$FRONTEND/g; \
         s/\[待确定 - 如 Express, Django, Spring 等\]/$BACKEND/g; \
         s/\[待确定 - 如 MySQL, PostgreSQL, MongoDB 等\]/$DATABASE/g; \
         s/\[待确定 - 如 Docker, Kubernetes, AWS 等\]/$DEPLOYMENT/g" \
         .roo/rules/rules.md > "$temp_file"
    
    mv "$temp_file" .roo/rules/rules.md
    echo "✅ 技术栈配置已更新到规则文件"
fi

# 创建初始化标记文件
echo "project_name: $PROJECT_NAME
initialized_date: $CURRENT_DATE
dev_language: $DEV_LANG
frontend: $FRONTEND
backend: $BACKEND
database: $DATABASE
deployment: $DEPLOYMENT" > .initialized

echo ""
echo "🎉 初始化完成！"
echo "================="
echo "下一步操作："
echo "1. 检查并修改 .env 文件中的配置"
echo "2. 查看 plan/0.0.0.yaml 文件并调整项目计划"
echo "3. 开始使用 PearAI 进行开发"
echo ""
echo "有用的命令："
echo "- node scripts/validate.js     # 验证计划文件格式"
echo "- node scripts/new-version.js  # 创建新版本计划"
echo "- node scripts/progress.js     # 查看项目进度"
echo ""
echo "📖 更多信息请参考 README.md"