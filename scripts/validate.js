#!/usr/bin/env node

/**
 * PearAI 仓库模板 - 计划文件验证脚本
 * 用于验证 YAML 计划文件的格式和完整性
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// 颜色输出
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// 验证必需字段
function validateRequiredFields(data, filename) {
    const required = ['version', 'name', 'description', 'goals', 'metadata'];
    const errors = [];
    
    for (const field of required) {
        if (!data[field]) {
            errors.push(`缺少必需字段: ${field}`);
        }
    }
    
    return errors;
}

// 验证版本号格式
function validateVersion(version) {
    const versionRegex = /^\d+\.\d+\.\d+$/;
    if (!versionRegex.test(version)) {
        return `版本号格式无效: ${version}，应该是 x.y.z 格式`;
    }
    return null;
}

// 验证目标结构
function validateGoals(goals) {
    const errors = [];
    
    if (!goals.primary || !Array.isArray(goals.primary)) {
        errors.push('缺少 goals.primary 数组');
    } else {
        goals.primary.forEach((goal, index) => {
            if (!goal.title) errors.push(`goals.primary[${index}] 缺少 title`);
            if (!goal.description) errors.push(`goals.primary[${index}] 缺少 description`);
            if (!goal.status) errors.push(`goals.primary[${index}] 缺少 status`);
            if (!goal.priority) errors.push(`goals.primary[${index}] 缺少 priority`);
            
            // 验证状态值
            const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
            if (goal.status && !validStatuses.includes(goal.status)) {
                errors.push(`goals.primary[${index}] 状态值无效: ${goal.status}`);
            }
            
            // 验证优先级值
            const validPriorities = ['high', 'medium', 'low'];
            if (goal.priority && !validPriorities.includes(goal.priority)) {
                errors.push(`goals.primary[${index}] 优先级值无效: ${goal.priority}`);
            }
        });
    }
    
    if (goals.secondary && Array.isArray(goals.secondary)) {
        goals.secondary.forEach((goal, index) => {
            if (!goal.title) errors.push(`goals.secondary[${index}] 缺少 title`);
            if (!goal.description) errors.push(`goals.secondary[${index}] 缺少 description`);
            if (!goal.status) errors.push(`goals.secondary[${index}] 缺少 status`);
            if (!goal.priority) errors.push(`goals.secondary[${index}] 缺少 priority`);
        });
    }
    
    return errors;
}

// 验证任务结构
function validateTasks(tasks) {
    const errors = [];
    
    if (!tasks || !Array.isArray(tasks)) {
        return errors; // 任务是可选的
    }
    
    const taskIds = new Set();
    
    tasks.forEach((task, index) => {
        if (!task.id) {
            errors.push(`tasks[${index}] 缺少 id`);
        } else if (taskIds.has(task.id)) {
            errors.push(`重复的任务 ID: ${task.id}`);
        } else {
            taskIds.add(task.id);
        }
        
        if (!task.title) errors.push(`tasks[${index}] 缺少 title`);
        if (!task.description) errors.push(`tasks[${index}] 缺少 description`);
        if (!task.status) errors.push(`tasks[${index}] 缺少 status`);
        
        // 验证状态值
        const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
        if (task.status && !validStatuses.includes(task.status)) {
            errors.push(`tasks[${index}] 状态值无效: ${task.status}`);
        }
        
        // 验证优先级值
        const validPriorities = ['high', 'medium', 'low'];
        if (task.priority && !validPriorities.includes(task.priority)) {
            errors.push(`tasks[${index}] 优先级值无效: ${task.priority}`);
        }
        
        // 验证依赖关系
        if (task.dependencies && Array.isArray(task.dependencies)) {
            task.dependencies.forEach(dep => {
                if (!taskIds.has(dep)) {
                    errors.push(`tasks[${index}] 依赖的任务 ID 不存在: ${dep}`);
                }
            });
        }
    });
    
    return errors;
}

// 验证元数据结构
function validateMetadata(metadata) {
    const errors = [];
    
    if (!metadata.created_by) errors.push('metadata 缺少 created_by');
    if (!metadata.created_date) errors.push('metadata 缺少 created_date');
    if (!metadata.last_modified) errors.push('metadata 缺少 last_modified');
    
    // 验证日期格式
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (metadata.created_date && !dateRegex.test(metadata.created_date)) {
        errors.push(`metadata.created_date 日期格式无效: ${metadata.created_date}`);
    }
    if (metadata.last_modified && !dateRegex.test(metadata.last_modified)) {
        errors.push(`metadata.last_modified 日期格式无效: ${metadata.last_modified}`);
    }
    
    return errors;
}

// 验证单个文件
function validateFile(filePath) {
    const filename = path.basename(filePath);
    log(`验证文件: ${filename}`, 'blue');
    
    let data;
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        data = yaml.load(content);
    } catch (error) {
        log(`❌ YAML 解析错误: ${error.message}`, 'red');
        return false;
    }
    
    const errors = [];
    
    // 验证必需字段
    errors.push(...validateRequiredFields(data, filename));
    
    // 验证版本号
    if (data.version) {
        const versionError = validateVersion(data.version);
        if (versionError) errors.push(versionError);
    }
    
    // 验证目标
    if (data.goals) {
        errors.push(...validateGoals(data.goals));
    }
    
    // 验证任务
    if (data.tasks) {
        errors.push(...validateTasks(data.tasks));
    }
    
    // 验证元数据
    if (data.metadata) {
        errors.push(...validateMetadata(data.metadata));
    }
    
    if (errors.length > 0) {
        log(`❌ 验证失败:`, 'red');
        errors.forEach(error => log(`  - ${error}`, 'red'));
        return false;
    } else {
        log(`✅ 验证成功`, 'green');
        return true;
    }
}

// 主函数
function main() {
    const args = process.argv.slice(2);
    const planDir = path.join(process.cwd(), 'plan');
    
    if (!fs.existsSync(planDir)) {
        log('❌ plan 目录不存在', 'red');
        process.exit(1);
    }
    
    let filesToValidate = [];
    
    if (args.length > 0) {
        // 验证指定文件
        filesToValidate = args.map(arg => {
            const filePath = path.isAbsolute(arg) ? arg : path.join(planDir, arg);
            if (!fs.existsSync(filePath)) {
                log(`❌ 文件不存在: ${arg}`, 'red');
                process.exit(1);
            }
            return filePath;
        });
    } else {
        // 验证所有 YAML 文件
        const files = fs.readdirSync(planDir);
        filesToValidate = files
            .filter(file => file.endsWith('.yaml') || file.endsWith('.yml'))
            .filter(file => file !== 'template.yaml') // 跳过模板文件
            .map(file => path.join(planDir, file));
    }
    
    if (filesToValidate.length === 0) {
        log('⚠️  没有找到需要验证的计划文件', 'yellow');
        process.exit(0);
    }
    
    log(`开始验证 ${filesToValidate.length} 个文件...`, 'blue');
    log('='.repeat(50), 'blue');
    
    let allValid = true;
    filesToValidate.forEach(filePath => {
        const isValid = validateFile(filePath);
        if (!isValid) allValid = false;
        console.log();
    });
    
    if (allValid) {
        log('🎉 所有文件验证通过！', 'green');
        process.exit(0);
    } else {
        log('❌ 部分文件验证失败，请修复后重试', 'red');
        process.exit(1);
    }
}

// 检查是否安装了 js-yaml
try {
    require('js-yaml');
} catch (error) {
    log('❌ 缺少依赖: js-yaml', 'red');
    log('请运行: npm install js-yaml', 'yellow');
    process.exit(1);
}

main();