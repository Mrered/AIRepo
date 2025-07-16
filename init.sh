#!/bin/bash

# AI模板仓库初始化脚本
# 用于收集项目信息并配置AI开发环境

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m'

# 清屏并显示标题
clear
echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗"
echo -e "║                    AI模板仓库初始化工具                   ║"
echo -e "║                 PearAI Repository Init Tool               ║"
echo -e "╚═══════════════════════════════════════════════════════════╝${NC}"
echo -e "${GREEN}初始化时间: $(date '+%Y-%m-%d %H:%M:%S')${NC}\n"

# 全局变量
PROJECT_NAME=""
PROJECT_DESC=""
PROJECT_AUTHOR=""
PROJECT_VERSION="0.0.0"
PROJECT_LICENSE="MIT"
LANGUAGE=""
FRONTEND=""
BACKEND=""
DATABASE=""
DEPLOYMENT=""

# 简单输入函数
ask_question() {
    local question="$1"
    local default="$2"
    local var_name="$3"
    
    while true; do
        if [[ -n "$default" ]]; then
            echo -ne "${YELLOW}📝 $question [${default}]: ${NC}"
        else
            echo -ne "${YELLOW}📝 $question: ${NC}"
        fi
        
        read -r input
        
        # 如果为空且有默认值，使用默认值
        if [[ -z "$input" && -n "$default" ]]; then
            input="$default"
        fi
        
        # 验证输入不为空
        if [[ -n "$input" ]]; then
            eval "$var_name=\"$input\""
            break
        else
            echo -e "${RED}❌ 输入不能为空，请重试${NC}"
        fi
    done
}

# 选择菜单函数
select_from_list() {
    local question="$1"
    local var_name="$2"
    shift 2
    local options=("$@")
    
    echo -e "\n${BLUE}📋 $question:${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # 显示选项
    for i in "${!options[@]}"; do
        echo -e "  ${GREEN}$((i+1)).${NC} ${options[$i]}"
    done
    
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    while true; do
        echo -ne "${YELLOW}请选择 (1-${#options[@]}): ${NC}"
        read -r choice
        
        # 验证输入是数字且在范围内
        if [[ "$choice" =~ ^[0-9]+$ ]] && [[ $choice -ge 1 ]] && [[ $choice -le ${#options[@]} ]]; then
            local selected="${options[$((choice-1))]}"
            
            # 处理"其他"选项
            if [[ "$selected" == "其他" ]]; then
                echo -ne "${YELLOW}请输入自定义值: ${NC}"
                read -r custom_value
                if [[ -n "$custom_value" ]]; then
                    echo -e "${GREEN}✅ 已选择: $custom_value${NC}"
                    eval "$var_name=\"$custom_value\""
                    break
                else
                    echo -e "${RED}❌ 输入不能为空${NC}"
                    continue
                fi
            else
                echo -e "${GREEN}✅ 已选择: $selected${NC}"
                eval "$var_name=\"$selected\""
                break
            fi
        else
            echo -e "${RED}❌ 请输入 1-${#options[@]} 之间的数字${NC}"
        fi
    done
}

# 确认函数
confirm() {
    local message="$1"
    while true; do
        echo -ne "${YELLOW}$message [y/N]: ${NC}"
        read -r response
        case $response in
            [yY][eE][sS]|[yY])
                return 0
                ;;
            [nN][oO]|[nN]|"")
                return 1
                ;;
            *)
                echo -e "${RED}❌ 请输入 y 或 n${NC}"
                ;;
        esac
    done
}

# 收集基础信息
collect_basic_info() {
    echo -e "${CYAN}═══════════════ 项目基础信息 ═══════════════${NC}\n"
    
    ask_question "项目名称" "" "PROJECT_NAME"
    ask_question "项目描述" "" "PROJECT_DESC"
    ask_question "作者姓名" "" "PROJECT_AUTHOR"
    ask_question "版本号" "0.0.0" "PROJECT_VERSION"
    ask_question "许可证" "MIT" "PROJECT_LICENSE"
    
    echo -e "\n${GREEN}✅ 基础信息收集完成${NC}"
}

# 收集技术栈信息
collect_tech_stack() {
    echo -e "\n${CYAN}═══════════════ 技术栈配置 ═══════════════${NC}"
    
    # 开发语言选择
    select_from_list "选择主要开发语言" "LANGUAGE" \
        "JavaScript" "Python" "Java" "Go" "TypeScript" "Rust" "C#" "PHP" "其他"
    
    # 前端框架选择
    select_from_list "选择前端框架" "FRONTEND" \
        "React" "Vue" "Angular" "Svelte" "Next.js" "Nuxt.js" "原生HTML/CSS/JS" "无" "其他"
    
    # 后端框架选择
    select_from_list "选择后端框架" "BACKEND" \
        "Supabase" "Express" "Django" "Spring Boot" "Flask" "FastAPI" "Gin" "ASP.NET" "Laravel" "无" "其他"
    
    # 数据库选择
    select_from_list "选择数据库" "DATABASE" \
        "Supabase" "MySQL" "PostgreSQL" "MongoDB" "Redis" "SQLite" "Oracle" "无" "其他"
    
    # 部署平台选择
    select_from_list "选择部署平台" "DEPLOYMENT" \
        "Docker" "Kubernetes" "AWS" "Vercel" "Netlify" "Heroku" "本地部署" "无" "其他"
    
    echo -e "\n${GREEN}✅ 技术栈配置完成${NC}"
}

# 显示配置摘要
show_summary() {
    echo -e "\n${CYAN}═══════════════ 配置摘要 ═══════════════${NC}"
    echo -e "${WHITE}项目名称:${NC} ${GREEN}$PROJECT_NAME${NC}"
    echo -e "${WHITE}项目描述:${NC} ${GREEN}$PROJECT_DESC${NC}"
    echo -e "${WHITE}作者:${NC} ${GREEN}$PROJECT_AUTHOR${NC}"
    echo -e "${WHITE}版本:${NC} ${GREEN}$PROJECT_VERSION${NC}"
    echo -e "${WHITE}许可证:${NC} ${GREEN}$PROJECT_LICENSE${NC}"
    echo -e "${WHITE}开发语言:${NC} ${GREEN}$LANGUAGE${NC}"
    echo -e "${WHITE}前端框架:${NC} ${GREEN}$FRONTEND${NC}"
    echo -e "${WHITE}后端框架:${NC} ${GREEN}$BACKEND${NC}"
    echo -e "${WHITE}数据库:${NC} ${GREEN}$DATABASE${NC}"
    echo -e "${WHITE}部署平台:${NC} ${GREEN}$DEPLOYMENT${NC}"
    echo ""
}

# 保存配置到rules.md
save_to_rules() {
    echo -e "${CYAN}正在保存配置...${NC}"
    
    # 确保目录存在
    mkdir -p .roo/rules
    
    # 创建临时文件
    local temp_file=$(mktemp)
    
    # 生成配置内容
    cat > "$temp_file" << EOF
---
生成时间: $(date '+%Y-%m-%d %H:%M:%S')
项目信息:
    - 项目名称: $PROJECT_NAME
    - 项目描述: $PROJECT_DESC
    - 作者: $PROJECT_AUTHOR
    - 版本: $PROJECT_VERSION
    - 许可证: $PROJECT_LICENSE
技术栈配置:
    - 主要开发语言: $LANGUAGE
    - 前端框架: $FRONTEND
    - 后端框架: $BACKEND
    - 数据库: $DATABASE
    - 部署平台: $DEPLOYMENT
---

EOF
    
    # 如果已存在rules.md，将其内容追加到新配置后面
    if [[ -f ".roo/rules/rules.md" ]]; then
        cat ".roo/rules/rules.md" >> "$temp_file"
    fi
    
    # 替换原文件
    mv "$temp_file" ".roo/rules/rules.md"
    
    echo -e "${GREEN}✅ 配置已保存到 .roo/rules/rules.md${NC}"
}

# 显示AI提示词
show_ai_prompt() {
    echo -e "\n${CYAN}═══════════════ AI提示词 ═══════════════${NC}"
    echo -e "${WHITE}请复制以下内容发送给AI助手:${NC}\n"
    
echo "根据以下项目配置创建完整的项目脚手架：

项目信息：
- 项目名称: $PROJECT_NAME
- 项目描述: $PROJECT_DESC
- 作者: $PROJECT_AUTHOR
- 版本: $PROJECT_VERSION
- 许可证: $PROJECT_LICENSE

技术栈：
- 开发语言: $LANGUAGE
- 前端框架: $FRONTEND
- 后端框架: $BACKEND
- 数据库: $DATABASE
- 部署平台: $DEPLOYMENT

请执行以下任务：

1. 创建符合技术栈的标准项目目录结构
2. 生成相应的依赖管理文件
3. 创建环境变量模板文件（.env.example）
4. 生成基础代码框架和启动文件
5. 创建详细的README.md文档
6. 根据部署平台创建相应的配置文件
7. 添加合适的.gitignore文件

要求：
- 遵循最佳实践和编码规范
- 确保代码质量和可维护性
- 提供清晰的注释和文档
- 考虑安全性和性能优化"
}

# 主程序
main() {
    echo -e "${GREEN}欢迎使用AI模板仓库初始化工具！${NC}"
    echo -e "${WHITE}这个工具将帮助您配置AI开发项目${NC}\n"
    
    # 检查是否已有配置
    if [[ -f ".roo/rules/rules.md" ]] && grep -q "AI项目配置" ".roo/rules/rules.md"; then
        echo -e "${YELLOW}⚠️  检测到已存在配置${NC}"
        if ! confirm "是否重新配置？"; then
            echo -e "${GREEN}保留现有配置，退出${NC}"
            exit 0
        fi
    fi
    
    # 收集信息
    collect_basic_info
    collect_tech_stack
    
    # 显示摘要并确认
    show_summary
    
    if confirm "确认以上配置并保存？"; then
        save_to_rules
        show_ai_prompt
    else
        echo -e "\n${YELLOW}❌ 初始化已取消${NC}"
        exit 1
    fi
}

# 错误处理
trap 'echo -e "\n${RED}❌ 脚本执行中断${NC}"; exit 1' INT TERM

# 执行主程序
main