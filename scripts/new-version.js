#!/usr/bin/env node

/**
 * PearAI 仓库模板 - 版本管理脚本
 * 用于自动创建新版本的计划文件
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const readline = require('readline');

// 颜色输出
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
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
function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

// 解析版本号
function parseVersion(version) {
    const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
    if (!match) return null;
    
    return {
        major: parseInt(match[1]),
        minor: parseInt(match[2]),
        patch: parseInt(match[3])
    };
}

// 生成新版本号
function generateNewVersion(currentVersion, type) {
    const parsed = parseVersion(currentVersion);
    if (!parsed) return null;
    
    switch (type) {
        case 'major':
            return `${parsed.major + 1}.0.0`;
        case 'minor':
            return `${parsed.major}.${parsed.minor + 1}.0`;
        case 'patch':
            return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`;
        default:
            return null;
    }
}

// 获取当前最新版本
function getCurrentVersion() {
    const planDir = path.join(process.cwd(), 'plan');
    if (!fs.existsSync(planDir)) return null;
    
    const files = fs.readdirSync(planDir);
    const versionFiles = files
        .filter(file => file.endsWith('.yaml') || file.endsWith('.yml'))
        .filter(file => file !== 'template.yaml')
        .map(file => file.replace(/\.ya?ml$/, ''))
        .filter(file => /^\d+\.\d+\.\d+$/.test(file))
        .sort((a, b) => {
            const aVer = parseVersion(a);
            const bVer = parseVersion(b);
            
            if (aVer.major !== bVer.major) return bVer.major - aVer.major;
            if (aVer.minor !== bVer.minor) return bVer.minor - aVer.minor;
            return bVer.patch - aVer.patch;
        });
    
    return versionFiles.length > 0 ? versionFiles[0] : null;
}

// 复制并更新计划文件
function createNewPlanFile(sourceVersion, targetVersion, changes) {
    const planDir = path.join(process.cwd(), 'plan');
    const sourceFile = path.join(planDir, `${sourceVersion}.yaml`);
    const targetFile = path.join(planDir, `${targetVersion}.yaml`);
    
    if (!fs.existsSync(sourceFile)) {
        log(`❌ 源文件不存在: ${sourceFile}`, 'red');
        return false;
    }
    
    if (fs.existsSync(targetFile)) {
        log(`❌ 目标文件已存在: ${targetFile}`, 'red');
        return false;
    }
    
    try {
        // 读取源文件
        const sourceContent = fs.readFileSync(sourceFile, 'utf8');
        const sourceData = yaml.load(sourceContent);
        
        // 更新基本信息
        sourceData.version = targetVersion;
        sourceData.metadata.last_modified = new Date().toISOString().split('T')[0];
        
        // 如果有变更描述，添加到描述中
        if (changes) {
            sourceData.description = `${sourceData.description}\n\n版本 ${targetVersion} 更新:\n${changes}`;
        }
        
        // 重置所有任务状态为 pending（可选）
        if (sourceData.tasks) {
            sourceData.tasks.forEach(task => {
                if (task.status === 'completed') {
                    task.status = 'pending';
                }
            });
        }
        
        // 写入新文件
        const newContent = yaml.dump(sourceData, {
            indent: 2,
            lineWidth: 120,
            quotingType: '"',
            forceQuotes: false
        });
        
        // 保持原有的 yaml-language-server 注释
        const finalContent = `# yaml-language-server: $schema=\n${newContent}`;
        
        fs.writeFileSync(targetFile, finalContent, 'utf8');
        
        log(`✅ 成功创建新版本文件: ${targetFile}`, 'green');
        return true;
        
    } catch (error) {
        log(`❌ 创建新版本文件失败: ${error.message}`, 'red');
        return false;
    }
}

// 显示版本升级建议
function suggestVersionType() {
    log('\n版本升级类型选择指南:', 'cyan');
    log('1. major (主版本) - 重大功能变更或架构调整', 'yellow');
    log('2. minor (次版本) - 新功能添加，向后兼容', 'yellow');
    log('3. patch (修订版) - 错误修复和小幅改进', 'yellow');
    log('4. custom (自定义) - 手动指定版本号', 'yellow');
    log('5. auto (自动) - 根据变更描述自动判断', 'yellow');
}

// 自动判断版本类型
function autoDetectVersionType(changes) {
    const lowerChanges = changes.toLowerCase();
    
    // 主版本关键词
    const majorKeywords = ['重大', '架构', '重构', '不兼容', '破坏性', '全新'];
    if (majorKeywords.some(keyword => lowerChanges.includes(keyword))) {
        return 'major';
    }
    
    // 次版本关键词
    const minorKeywords = ['新功能', '新特性', '增加', '添加', '扩展', '改进'];
    if (minorKeywords.some(keyword => lowerChanges.includes(keyword))) {
        return 'minor';
    }
    
    // 默认为修订版
    return 'patch';
}

// 主函数
async function main() {
    log('🚀 PearAI 仓库模板 - 版本管理工具', 'blue');
    log('=' .repeat(50), 'blue');
    
    // 获取当前版本
    const currentVersion = getCurrentVersion();
    if (!currentVersion) {
        log('❌ 没有找到当前版本，请先创建初始版本', 'red');
        process.exit(1);
    }
    
    log(`当前版本: ${currentVersion}`, 'green');
    
    // 询问变更描述
    const changes = await askQuestion('请描述此次变更的内容: ');
    
    if (!changes) {
        log('❌ 变更描述不能为空', 'red');
        process.exit(1);
    }
    
    // 显示版本升级建议
    suggestVersionType();
    
    // 询问版本类型
    const versionType = await askQuestion('\n请选择版本升级类型 (major/minor/patch/custom/auto): ');
    
    let newVersion;
    
    if (versionType === 'custom') {
        // 自定义版本号
        const customVersion = await askQuestion('请输入新版本号 (x.y.z): ');
        if (!parseVersion(customVersion)) {
            log('❌ 版本号格式无效', 'red');
            process.exit(1);
        }
        newVersion = customVersion;
    } else if (versionType === 'auto') {
        // 自动判断
        const detectedType = autoDetectVersionType(changes);
        log(`自动检测到版本类型: ${detectedType}`, 'yellow');
        newVersion = generateNewVersion(currentVersion, detectedType);
    } else if (['major', 'minor', 'patch'].includes(versionType)) {
        // 标准版本类型
        newVersion = generateNewVersion(currentVersion, versionType);
    } else {
        log('❌ 无效的版本类型', 'red');
        process.exit(1);
    }
    
    if (!newVersion) {
        log('❌ 无法生成新版本号', 'red');
        process.exit(1);
    }
    
    log(`新版本号: ${newVersion}`, 'green');
    
    // 确认创建
    const confirm = await askQuestion(`确认创建新版本 ${newVersion}? (y/N): `);
    if (!confirm.toLowerCase().startsWith('y')) {
        log('取消操作', 'yellow');
        process.exit(0);
    }
    
    // 创建新版本文件
    const success = createNewPlanFile(currentVersion, newVersion, changes);
    
    if (success) {
        log('\n🎉 版本创建成功！', 'green');
        log(`新版本文件: plan/${newVersion}.yaml`, 'cyan');
        log('下一步操作:', 'blue');
        log('1. 编辑新版本文件以添加具体的目标和任务', 'yellow');
        log('2. 运行验证脚本检查文件格式: node scripts/validate.js', 'yellow');
        log('3. 开始新版本的开发工作', 'yellow');
    } else {
        log('❌ 版本创建失败', 'red');
        process.exit(1);
    }
    
    rl.close();
}

// 检查是否安装了 js-yaml
try {
    require('js-yaml');
} catch (error) {
    log('❌ 缺少依赖: js-yaml', 'red');
    log('请运行: npm install js-yaml', 'yellow');
    process.exit(1);
}

main().catch(error => {
    log(`❌ 执行错误: ${error.message}`, 'red');
    process.exit(1);
});