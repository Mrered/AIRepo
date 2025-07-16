#!/usr/bin/env node

/**
 * PearAI 仓库模板 - 进度跟踪工具
 * 生成项目进度报告和可视化
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
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// 进度条
function createProgressBar(percentage, width = 30) {
    const filled = Math.round(percentage * width / 100);
    const empty = width - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    return `${bar} ${percentage.toFixed(1)}%`;
}

// 获取所有计划文件
function getAllPlanFiles() {
    const planDir = path.join(process.cwd(), 'plan');
    if (!fs.existsSync(planDir)) {
        return [];
    }
    
    const files = fs.readdirSync(planDir);
    return files
        .filter(file => (file.endsWith('.yaml') || file.endsWith('.yml')) && file !== 'template.yaml')
        .map(file => path.join(planDir, file))
        .sort();
}

// 解析计划文件
function parsePlanFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = yaml.load(content);
        return {
            file: path.basename(filePath),
            version: data.version,
            name: data.name,
            data: data
        };
    } catch (error) {
        log(`⚠️  解析文件失败: ${filePath} - ${error.message}`, 'yellow');
        return null;
    }
}

// 计算目标进度
function calculateGoalProgress(goals) {
    if (!goals) return { total: 0, completed: 0, percentage: 0 };
    
    const allGoals = [...(goals.primary || []), ...(goals.secondary || [])];
    const total = allGoals.length;
    const completed = allGoals.filter(goal => goal.status === 'completed').length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    return { total, completed, percentage };
}

// 计算任务进度
function calculateTaskProgress(tasks) {
    if (!tasks || !Array.isArray(tasks)) return { total: 0, completed: 0, percentage: 0 };
    
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    return { total, completed, percentage };
}

// 计算里程碑进度
function calculateMilestoneProgress(milestones) {
    if (!milestones || !Array.isArray(milestones)) return { total: 0, completed: 0, percentage: 0 };
    
    const total = milestones.length;
    const completed = milestones.filter(milestone => milestone.status === 'completed').length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    return { total, completed, percentage };
}

// 分析任务状态分布
function analyzeTaskDistribution(tasks) {
    if (!tasks || !Array.isArray(tasks)) return {};
    
    const distribution = {
        pending: 0,
        in_progress: 0,
        completed: 0,
        cancelled: 0
    };
    
    tasks.forEach(task => {
        if (distribution.hasOwnProperty(task.status)) {
            distribution[task.status]++;
        }
    });
    
    return distribution;
}

// 分析优先级分布
function analyzePriorityDistribution(items) {
    if (!items || !Array.isArray(items)) return {};
    
    const distribution = {
        high: 0,
        medium: 0,
        low: 0
    };
    
    items.forEach(item => {
        if (item.priority && distribution.hasOwnProperty(item.priority)) {
            distribution[item.priority]++;
        }
    });
    
    return distribution;
}

// 生成单个计划文件报告
function generatePlanReport(plan) {
    log(`\n📋 计划文件: ${plan.file} (v${plan.version})`, 'blue');
    log(`📝 名称: ${plan.name}`, 'white');
    log('─'.repeat(60), 'gray');
    
    // 目标进度
    const goalProgress = calculateGoalProgress(plan.data.goals);
    log(`🎯 目标进度: ${goalProgress.completed}/${goalProgress.total} (${goalProgress.percentage.toFixed(1)}%)`, 'cyan');
    log(`   ${createProgressBar(goalProgress.percentage)}`, 'cyan');
    
    // 任务进度
    const taskProgress = calculateTaskProgress(plan.data.tasks);
    log(`📋 任务进度: ${taskProgress.completed}/${taskProgress.total} (${taskProgress.percentage.toFixed(1)}%)`, 'cyan');
    log(`   ${createProgressBar(taskProgress.percentage)}`, 'cyan');
    
    // 里程碑进度
    const milestoneProgress = calculateMilestoneProgress(plan.data.milestones);
    if (milestoneProgress.total > 0) {
        log(`🚩 里程碑进度: ${milestoneProgress.completed}/${milestoneProgress.total} (${milestoneProgress.percentage.toFixed(1)}%)`, 'cyan');
        log(`   ${createProgressBar(milestoneProgress.percentage)}`, 'cyan');
    }
    
    // 任务状态分布
    const taskDistribution = analyzeTaskDistribution(plan.data.tasks);
    if (Object.values(taskDistribution).some(v => v > 0)) {
        log('\n📊 任务状态分布:', 'yellow');
        Object.entries(taskDistribution).forEach(([status, count]) => {
            if (count > 0) {
                const statusColors = {
                    pending: 'yellow',
                    in_progress: 'blue',
                    completed: 'green',
                    cancelled: 'red'
                };
                const statusNames = {
                    pending: '待处理',
                    in_progress: '进行中',
                    completed: '已完成',
                    cancelled: '已取消'
                };
                log(`   ${statusNames[status]}: ${count}`, statusColors[status]);
            }
        });
    }
    
    // 优先级分布
    const allItems = [
        ...(plan.data.goals?.primary || []),
        ...(plan.data.goals?.secondary || []),
        ...(plan.data.tasks || [])
    ];
    const priorityDistribution = analyzePriorityDistribution(allItems);
    if (Object.values(priorityDistribution).some(v => v > 0)) {
        log('\n⚡ 优先级分布:', 'yellow');
        Object.entries(priorityDistribution).forEach(([priority, count]) => {
            if (count > 0) {
                const priorityColors = {
                    high: 'red',
                    medium: 'yellow',
                    low: 'green'
                };
                const priorityNames = {
                    high: '高',
                    medium: '中',
                    low: '低'
                };
                log(`   ${priorityNames[priority]}: ${count}`, priorityColors[priority]);
            }
        });
    }
    
    // 即将到期的任务
    const today = new Date();
    const upcomingTasks = (plan.data.tasks || []).filter(task => {
        if (!task.due_date || task.status === 'completed') return false;
        const dueDate = new Date(task.due_date);
        const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        return daysUntilDue <= 7 && daysUntilDue >= 0;
    });
    
    if (upcomingTasks.length > 0) {
        log('\n⏰ 即将到期的任务:', 'red');
        upcomingTasks.forEach(task => {
            const dueDate = new Date(task.due_date);
            const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
            log(`   • ${task.title} (${daysUntilDue} 天后到期)`, 'red');
        });
    }
    
    // 阻塞任务
    const blockedTasks = (plan.data.tasks || []).filter(task => {
        if (!task.dependencies || task.dependencies.length === 0) return false;
        return task.dependencies.some(depId => {
            const depTask = plan.data.tasks.find(t => t.id === depId);
            return depTask && depTask.status !== 'completed';
        });
    });
    
    if (blockedTasks.length > 0) {
        log('\n🚫 被阻塞的任务:', 'red');
        blockedTasks.forEach(task => {
            const pendingDeps = task.dependencies.filter(depId => {
                const depTask = plan.data.tasks.find(t => t.id === depId);
                return depTask && depTask.status !== 'completed';
            });
            log(`   • ${task.title} (等待: ${pendingDeps.join(', ')})`, 'red');
        });
    }
    
    return {
        version: plan.version,
        goalProgress,
        taskProgress,
        milestoneProgress,
        taskDistribution,
        priorityDistribution,
        upcomingTasks: upcomingTasks.length,
        blockedTasks: blockedTasks.length
    };
}

// 生成总体报告
function generateOverallReport(reports) {
    log('\n🎯 总体进度报告', 'green');
    log('='.repeat(60), 'green');
    
    const totalGoals = reports.reduce((sum, r) => sum + r.goalProgress.total, 0);
    const completedGoals = reports.reduce((sum, r) => sum + r.goalProgress.completed, 0);
    const goalPercentage = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
    
    const totalTasks = reports.reduce((sum, r) => sum + r.taskProgress.total, 0);
    const completedTasks = reports.reduce((sum, r) => sum + r.taskProgress.completed, 0);
    const taskPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    log(`📊 总体目标完成度: ${completedGoals}/${totalGoals} (${goalPercentage.toFixed(1)}%)`, 'white');
    log(`   ${createProgressBar(goalPercentage)}`, 'green');
    
    log(`📊 总体任务完成度: ${completedTasks}/${totalTasks} (${taskPercentage.toFixed(1)}%)`, 'white');
    log(`   ${createProgressBar(taskPercentage)}`, 'green');
    
    // 版本进度比较
    if (reports.length > 1) {
        log('\n📈 版本进度比较:', 'blue');
        reports.forEach((report, index) => {
            log(`   v${report.version}: 目标 ${report.goalProgress.percentage.toFixed(1)}%, 任务 ${report.taskProgress.percentage.toFixed(1)}%`, 'cyan');
        });
    }
    
    // 风险指标
    const totalUpcoming = reports.reduce((sum, r) => sum + r.upcomingTasks, 0);
    const totalBlocked = reports.reduce((sum, r) => sum + r.blockedTasks, 0);
    
    if (totalUpcoming > 0 || totalBlocked > 0) {
        log('\n⚠️  风险指标:', 'yellow');
        if (totalUpcoming > 0) {
            log(`   📅 即将到期任务: ${totalUpcoming}`, 'yellow');
        }
        if (totalBlocked > 0) {
            log(`   🚫 被阻塞任务: ${totalBlocked}`, 'red');
        }
    }
}

// 生成 Markdown 报告
function generateMarkdownReport(reports) {
    const today = new Date().toISOString().split('T')[0];
    
    let markdown = `# 项目进度报告\n\n`;
    markdown += `生成时间: ${today}\n\n`;
    
    // 总体进度
    const totalGoals = reports.reduce((sum, r) => sum + r.goalProgress.total, 0);
    const completedGoals = reports.reduce((sum, r) => sum + r.goalProgress.completed, 0);
    const goalPercentage = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
    
    const totalTasks = reports.reduce((sum, r) => sum + r.taskProgress.total, 0);
    const completedTasks = reports.reduce((sum, r) => sum + r.taskProgress.completed, 0);
    const taskPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    markdown += `## 总体进度\n\n`;
    markdown += `- **目标完成度**: ${completedGoals}/${totalGoals} (${goalPercentage.toFixed(1)}%)\n`;
    markdown += `- **任务完成度**: ${completedTasks}/${totalTasks} (${taskPercentage.toFixed(1)}%)\n\n`;
    
    // 各版本详情
    markdown += `## 版本详情\n\n`;
    reports.forEach(report => {
        markdown += `### 版本 ${report.version}\n\n`;
        markdown += `- 目标进度: ${report.goalProgress.completed}/${report.goalProgress.total} (${report.goalProgress.percentage.toFixed(1)}%)\n`;
        markdown += `- 任务进度: ${report.taskProgress.completed}/${report.taskProgress.total} (${report.taskProgress.percentage.toFixed(1)}%)\n`;
        
        if (report.milestoneProgress.total > 0) {
            markdown += `- 里程碑进度: ${report.milestoneProgress.completed}/${report.milestoneProgress.total} (${report.milestoneProgress.percentage.toFixed(1)}%)\n`;
        }
        
        markdown += `\n`;
    });
    
    // 风险指标
    const totalUpcoming = reports.reduce((sum, r) => sum + r.upcomingTasks, 0);
    const totalBlocked = reports.reduce((sum, r) => sum + r.blockedTasks, 0);
    
    if (totalUpcoming > 0 || totalBlocked > 0) {
        markdown += `## 风险指标\n\n`;
        if (totalUpcoming > 0) {
            markdown += `- 即将到期任务: ${totalUpcoming}\n`;
        }
        if (totalBlocked > 0) {
            markdown += `- 被阻塞任务: ${totalBlocked}\n`;
        }
        markdown += `\n`;
    }
    
    return markdown;
}

// 主函数
function main() {
    const args = process.argv.slice(2);
    const outputFormat = args.includes('--markdown') ? 'markdown' : 'console';
    const outputFile = args.find(arg => arg.startsWith('--output='))?.split('=')[1];
    
    log('📊 PearAI 仓库模板 - 进度跟踪工具', 'blue');
    log('='.repeat(60), 'blue');
    
    // 获取所有计划文件
    const planFiles = getAllPlanFiles();
    if (planFiles.length === 0) {
        log('❌ 没有找到计划文件', 'red');
        process.exit(1);
    }
    
    // 解析计划文件
    const plans = planFiles.map(parsePlanFile).filter(plan => plan !== null);
    if (plans.length === 0) {
        log('❌ 没有有效的计划文件', 'red');
        process.exit(1);
    }
    
    // 生成报告
    const reports = plans.map(generatePlanReport);
    
    if (outputFormat === 'console') {
        // 生成总体报告
        generateOverallReport(reports);
        
        log('\n💡 提示:', 'blue');
        log('   使用 --markdown 参数生成 Markdown 格式报告', 'gray');
        log('   使用 --output=文件名 参数保存报告到文件', 'gray');
    } else {
        // 生成 Markdown 报告
        const markdownReport = generateMarkdownReport(reports);
        
        if (outputFile) {
            fs.writeFileSync(outputFile, markdownReport, 'utf8');
            log(`✅ 报告已保存到: ${outputFile}`, 'green');
        } else {
            console.log(markdownReport);
        }
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