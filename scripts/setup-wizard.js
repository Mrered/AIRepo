#!/usr/bin/env node

/**
 * PearAI 仓库模板 - 交互式配置向导
 * 帮助用户快速配置技术栈和项目设置
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 颜色输出
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// 创建交互式输入接口
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 询问用户输入
function askQuestion(question, defaultValue = '') {
    return new Promise((resolve) => {
        const prompt = defaultValue ? `${question} (默认: ${defaultValue}): ` : `${question}: `;
        rl.question(prompt, (answer) => {
            resolve(answer.trim() || defaultValue);
        });
    });
}

// 选择列表
function askChoice(question, choices, defaultChoice = 0) {
    return new Promise((resolve) => {
        log(`\n${question}`, 'cyan');
        choices.forEach((choice, index) => {
            const marker = index === defaultChoice ? '●' : '○';
            log(`  ${marker} ${index + 1}. ${choice}`, index === defaultChoice ? 'green' : 'white');
        });
        
        rl.question(`\n请选择 (1-${choices.length}, 默认: ${defaultChoice + 1}): `, (answer) => {
            const choice = parseInt(answer) - 1;
            if (choice >= 0 && choice < choices.length) {
                resolve(choices[choice]);
            } else {
                resolve(choices[defaultChoice]);
            }
        });
    });
}

// 确认问题
function askConfirm(question, defaultValue = false) {
    return new Promise((resolve) => {
        const defaultText = defaultValue ? 'Y/n' : 'y/N';
        rl.question(`${question} (${defaultText}): `, (answer) => {
            const response = answer.toLowerCase().trim();
            if (response === '') {
                resolve(defaultValue);
            } else {
                resolve(response === 'y' || response === 'yes');
            }
        });
    });
}

// 技术栈选项
const techStackOptions = {
    languages: [
        'JavaScript/TypeScript',
        'Python',
        'Java',
        'Go',
        'Rust',
        'C#',
        'PHP',
        'Ruby',
        'Swift',
        'Kotlin',
        '其他'
    ],
    frontendFrameworks: [
        'React',
        'Vue.js',
        'Angular',
        'Svelte',
        'Next.js',
        'Nuxt.js',
        'Vite',
        'Webpack',
        '原生 HTML/CSS/JS',
        '无前端',
        '其他'
    ],
    backendFrameworks: [
        'Node.js (Express)',
        'Node.js (Fastify)',
        'Node.js (Koa)',
        'Django',
        'Flask',
        'FastAPI',
        'Spring Boot',
        'Spring MVC',
        'Gin',
        'Fiber',
        'ASP.NET Core',
        'Laravel',
        'Symfony',
        'Ruby on Rails',
        'Phoenix',
        '无后端',
        '其他'
    ],
    databases: [
        'PostgreSQL',
        'MySQL',
        'MongoDB',
        'Redis',
        'SQLite',
        'Microsoft SQL Server',
        'Oracle',
        'Cassandra',
        'DynamoDB',
        'Firebase',
        'Supabase',
        '无数据库',
        '其他'
    ],
    deploymentPlatforms: [
        'Docker',
        'Kubernetes',
        'AWS',
        'Google Cloud',
        'Microsoft Azure',
        'Vercel',
        'Netlify',
        'Heroku',
        'DigitalOcean',
        'Railway',
        'Render',
        '本地部署',
        '其他'
    ]
};

// 项目类型模板
const projectTemplates = {
    'web-app': {
        name: 'Web 应用',
        description: '全栈 Web 应用项目',
        suggestedStack: {
            language: 'JavaScript/TypeScript',
            frontend: 'React',
            backend: 'Node.js (Express)',
            database: 'PostgreSQL',
            deployment: 'Docker'
        }
    },
    'api-service': {
        name: 'API 服务',
        description: '后端 API 服务项目',
        suggestedStack: {
            language: 'Python',
            frontend: '无前端',
            backend: 'FastAPI',
            database: 'PostgreSQL',
            deployment: 'Docker'
        }
    },
    'mobile-app': {
        name: '移动应用',
        description: '移动应用开发项目',
        suggestedStack: {
            language: 'JavaScript/TypeScript',
            frontend: 'React Native',
            backend: 'Node.js (Express)',
            database: 'MongoDB',
            deployment: 'AWS'
        }
    },
    'data-science': {
        name: '数据科学',
        description: '数据分析和机器学习项目',
        suggestedStack: {
            language: 'Python',
            frontend: 'Jupyter',
            backend: 'Flask',
            database: 'PostgreSQL',
            deployment: 'Docker'
        }
    },
    'cli-tool': {
        name: '命令行工具',
        description: '命令行工具或脚本项目',
        suggestedStack: {
            language: 'Go',
            frontend: '无前端',
            backend: '无后端',
            database: 'SQLite',
            deployment: 'GitHub Releases'
        }
    },
    'library': {
        name: '库/包',
        description: '开源库或包项目',
        suggestedStack: {
            language: 'JavaScript/TypeScript',
            frontend: '无前端',
            backend: '无后端',
            database: '无数据库',
            deployment: 'npm'
        }
    },
    'custom': {
        name: '自定义',
        description: '自定义项目配置',
        suggestedStack: null
    }
};

// 更新规则文件
function updateRulesFile(config) {
    const rulesFile = path.join(process.cwd(), '.roo', 'rules', 'rules.md');
    if (!fs.existsSync(rulesFile)) {
        log('⚠️  规则文件不存在，跳过更新', 'yellow');
        return;
    }
    
    try {
        let content = fs.readFileSync(rulesFile, 'utf8');
        
        // 替换技术栈配置
        content = content.replace(
            /- \*\*主要开发语言\*\*: \[待确定[^\]]*\]/g,
            `- **主要开发语言**: ${config.language}`
        );
        content = content.replace(
            /- \*\*前端框架\*\*: \[待确定[^\]]*\]/g,
            `- **前端框架**: ${config.frontend}`
        );
        content = content.replace(
            /- \*\*后端框架\*\*: \[待确定[^\]]*\]/g,
            `- **后端框架**: ${config.backend}`
        );
        content = content.replace(
            /- \*\*数据库\*\*: \[待确定[^\]]*\]/g,
            `- **数据库**: ${config.database}`
        );
        content = content.replace(
            /- \*\*部署平台\*\*: \[待确定[^\]]*\]/g,
            `- **部署平台**: ${config.deployment}`
        );
        
        // 添加其他工具配置
        if (config.otherTools) {
            content = content.replace(
                /- \*\*其他工具\*\*: \[待确定[^\]]*\]/g,
                `- **其他工具**: ${config.otherTools}`
            );
        }
        
        fs.writeFileSync(rulesFile, content, 'utf8');
        log('✅ 规则文件已更新', 'green');
    } catch (error) {
        log(`❌ 更新规则文件失败: ${error.message}`, 'red');
    }
}

// 创建项目特定的配置文件
function createProjectConfig(config) {
    const configFile = path.join(process.cwd(), '.project-config.json');
    
    const projectConfig = {
        name: config.projectName,
        type: config.projectType,
        techStack: {
            language: config.language,
            frontend: config.frontend,
            backend: config.backend,
            database: config.database,
            deployment: config.deployment,
            otherTools: config.otherTools
        },
        setup: {
            hasDocker: config.hasDocker,
            hasCI: config.hasCI,
            hasLinting: config.hasLinting,
            hasTesting: config.hasTesting
        },
        createdAt: new Date().toISOString(),
        configuredBy: 'PearAI Setup Wizard'
    };
    
    fs.writeFileSync(configFile, JSON.stringify(projectConfig, null, 2), 'utf8');
    log('✅ 项目配置文件已创建', 'green');
}

// 生成推荐的依赖包
function generateDependencies(config) {
    const suggestions = [];
    
    // 根据技术栈推荐依赖
    if (config.language.includes('JavaScript') || config.language.includes('TypeScript')) {
        suggestions.push('Node.js 项目推荐包:');
        suggestions.push('  - js-yaml (YAML 文件处理)');
        suggestions.push('  - dotenv (环境变量管理)');
        if (config.hasLinting) {
            suggestions.push('  - eslint (代码检查)');
            suggestions.push('  - prettier (代码格式化)');
        }
        if (config.hasTesting) {
            suggestions.push('  - jest (测试框架)');
            suggestions.push('  - supertest (API 测试)');
        }
    }
    
    if (config.language === 'Python') {
        suggestions.push('Python 项目推荐包:');
        suggestions.push('  - pyyaml (YAML 文件处理)');
        suggestions.push('  - python-dotenv (环境变量管理)');
        if (config.hasLinting) {
            suggestions.push('  - black (代码格式化)');
            suggestions.push('  - flake8 (代码检查)');
        }
        if (config.hasTesting) {
            suggestions.push('  - pytest (测试框架)');
            suggestions.push('  - pytest-cov (测试覆盖率)');
        }
    }
    
    if (suggestions.length > 0) {
        log('\n📦 推荐的依赖包:', 'blue');
        suggestions.forEach(suggestion => log(suggestion, 'cyan'));
    }
}

// 生成 package.json 脚本建议
function generatePackageScripts(config) {
    if (!config.language.includes('JavaScript') && !config.language.includes('TypeScript')) {
        return;
    }
    
    const scripts = {
        "validate": "node scripts/validate.js",
        "new-version": "node scripts/new-version.js",
        "progress": "node scripts/progress.js"
    };
    
    if (config.hasLinting) {
        scripts.lint = "eslint . --ext .js,.ts,.tsx";
        scripts["lint:fix"] = "eslint . --ext .js,.ts,.tsx --fix";
    }
    
    if (config.hasTesting) {
        scripts.test = "jest";
        scripts["test:watch"] = "jest --watch";
        scripts["test:coverage"] = "jest --coverage";
    }
    
    if (config.frontend.includes('React')) {
        scripts.dev = "vite";
        scripts.build = "vite build";
        scripts.preview = "vite preview";
    }
    
    log('\n📝 推荐的 package.json 脚本:', 'blue');
    Object.entries(scripts).forEach(([key, value]) => {
        log(`  "${key}": "${value}"`, 'cyan');
    });
}

// 主函数
async function main() {
    log('🚀 PearAI 仓库模板 - 交互式配置向导', 'blue');
    log('=' .repeat(60), 'blue');
    log('此向导将帮助您快速配置项目的技术栈和基本设置\n', 'white');
    
    const config = {};
    
    // 项目基本信息
    config.projectName = await askQuestion('项目名称', path.basename(process.cwd()));
    config.projectDescription = await askQuestion('项目描述', '使用 PearAI 模板的项目');
    
    // 选择项目类型
    const templateNames = Object.keys(projectTemplates);
    const templateDescs = templateNames.map(key => 
        `${projectTemplates[key].name} - ${projectTemplates[key].description}`
    );
    
    const selectedTemplate = await askChoice('选择项目类型', templateDescs, 0);
    const templateKey = templateNames[templateDescs.indexOf(selectedTemplate)];
    config.projectType = templateKey;
    
    const template = projectTemplates[templateKey];
    if (template.suggestedStack) {
        log(`\n💡 ${template.name} 项目的推荐技术栈:`, 'yellow');
        log(`  语言: ${template.suggestedStack.language}`, 'cyan');
        log(`  前端: ${template.suggestedStack.frontend}`, 'cyan');
        log(`  后端: ${template.suggestedStack.backend}`, 'cyan');
        log(`  数据库: ${template.suggestedStack.database}`, 'cyan');
        log(`  部署: ${template.suggestedStack.deployment}`, 'cyan');
        
        const useSuggested = await askConfirm('使用推荐的技术栈配置？', true);
        if (useSuggested) {
            config.language = template.suggestedStack.language;
            config.frontend = template.suggestedStack.frontend;
            config.backend = template.suggestedStack.backend;
            config.database = template.suggestedStack.database;
            config.deployment = template.suggestedStack.deployment;
        }
    }
    
    // 如果没有使用推荐配置，或者是自定义项目，则手动选择
    if (!config.language) {
        config.language = await askChoice('选择主要开发语言', techStackOptions.languages);
        config.frontend = await askChoice('选择前端框架', techStackOptions.frontendFrameworks);
        config.backend = await askChoice('选择后端框架', techStackOptions.backendFrameworks);
        config.database = await askChoice('选择数据库', techStackOptions.databases);
        config.deployment = await askChoice('选择部署平台', techStackOptions.deploymentPlatforms);
    }
    
    // 其他工具
    config.otherTools = await askQuestion('其他工具和依赖 (用逗号分隔)', '');
    
    // 项目设置
    log('\n🔧 项目设置选项:', 'blue');
    config.hasDocker = await askConfirm('是否使用 Docker？', true);
    config.hasCI = await askConfirm('是否设置 CI/CD？', true);
    config.hasLinting = await askConfirm('是否设置代码检查 (Linting)？', true);
    config.hasTesting = await askConfirm('是否设置测试框架？', true);
    
    // 显示配置摘要
    log('\n📋 配置摘要:', 'green');
    log('=' .repeat(30), 'green');
    log(`项目名称: ${config.projectName}`, 'white');
    log(`项目类型: ${projectTemplates[config.projectType].name}`, 'white');
    log(`开发语言: ${config.language}`, 'white');
    log(`前端框架: ${config.frontend}`, 'white');
    log(`后端框架: ${config.backend}`, 'white');
    log(`数据库: ${config.database}`, 'white');
    log(`部署平台: ${config.deployment}`, 'white');
    if (config.otherTools) log(`其他工具: ${config.otherTools}`, 'white');
    log(`Docker: ${config.hasDocker ? '是' : '否'}`, 'white');
    log(`CI/CD: ${config.hasCI ? '是' : '否'}`, 'white');
    log(`代码检查: ${config.hasLinting ? '是' : '否'}`, 'white');
    log(`测试框架: ${config.hasTesting ? '是' : '否'}`, 'white');
    
    // 确认配置
    const confirmed = await askConfirm('\n确认以上配置？', true);
    if (!confirmed) {
        log('配置已取消', 'yellow');
        rl.close();
        return;
    }
    
    // 应用配置
    log('\n🔄 应用配置...', 'blue');
    updateRulesFile(config);
    createProjectConfig(config);
    
    // 生成建议
    generateDependencies(config);
    generatePackageScripts(config);
    
    log('\n🎉 配置完成！', 'green');
    log('=' .repeat(30), 'green');
    log('下一步操作:', 'blue');
    log('1. 查看并修改 .roo/rules/rules.md 文件', 'yellow');
    log('2. 根据推荐安装相关依赖包', 'yellow');
    log('3. 运行 ./init.sh 完成项目初始化', 'yellow');
    log('4. 开始使用 PearAI 进行开发', 'yellow');
    
    rl.close();
}

// 错误处理
process.on('SIGINT', () => {
    log('\n\n👋 配置已取消', 'yellow');
    rl.close();
    process.exit(0);
});

main().catch(error => {
    log(`❌ 执行错误: ${error.message}`, 'red');
    rl.close();
    process.exit(1);
});