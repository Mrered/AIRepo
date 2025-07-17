# 性能监控脚本配置文档

## 监控脚本概览

### 脚本分类
- **系统监控脚本**：CPU、内存、磁盘、网络
- **应用监控脚本**：API性能、数据库性能、缓存性能
- **业务监控脚本**：用户行为、业务指标
- **告警脚本**：阈值监控、异常检测

## 1. 系统性能监控脚本

### 1.1 资源使用率监控
```bash
#!/bin/bash
# system-monitor.sh - 系统资源监控脚本

LOG_FILE="/var/log/performance/system-$(date +%Y%m%d).log"
METRICS_FILE="/var/log/performance/metrics.json"

# 创建日志目录
mkdir -p /var/log/performance

# 获取系统指标
get_system_metrics() {
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    # CPU使用率
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//')
    
    # 内存使用率
    local memory_info=$(free | grep Mem)
    local memory_total=$(echo $memory_info | awk '{print $2}')
    local memory_used=$(echo $memory_info | awk '{print $3}')
    local memory_usage=$(echo "scale=2; $memory_used * 100 / $memory_total" | bc)
    
    # 磁盘使用率
    local disk_usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    # 网络流量
    local network_rx=$(cat /proc/net/dev | grep eth0 | awk '{print $2}')
    local network_tx=$(cat /proc/net/dev | grep eth0 | awk '{print $10}')
    
    # 负载平均值
    local load_avg=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')
    
    # 构建JSON数据
    cat <<EOF > $METRICS_FILE
{
  "timestamp": "$timestamp",
  "system": {
    "cpu_usage": $cpu_usage,
    "memory_usage": $memory_usage,
    "disk_usage": $disk_usage,
    "load_avg": $load_avg,
    "network": {
      "rx_bytes": $network_rx,
      "tx_bytes": $network_tx
    }
  }
}
EOF
    
    # 记录到日志
    echo "[$timestamp] CPU:${cpu_usage}% MEM:${memory_usage}% DISK:${disk_usage}% LOAD:${load_avg}" >> $LOG_FILE
}

# 主监控循环
while true; do
    get_system_metrics
    sleep 60  # 每分钟收集一次
done
```

### 1.2 Docker容器监控
```bash
#!/bin/bash
# docker-monitor.sh - Docker容器性能监控

CONTAINER_METRICS_FILE="/var/log/performance/docker-metrics.json"

get_container_metrics() {
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    # 获取所有运行中的容器
    local containers=$(docker ps --format "{{.Names}}")
    
    local container_data="{\"timestamp\": \"$timestamp\", \"containers\": ["
    local first=true
    
    for container in $containers; do
        if [ "$first" = true ]; then
            first=false
        else
            container_data+=","
        fi
        
        # 获取容器统计信息
        local stats=$(docker stats --no-stream --format "{{.CPUPerc}},{{.MemUsage}},{{.NetIO}},{{.BlockIO}}" $container)
        IFS=',' read -r cpu mem net block <<< "$stats"
        
        # 解析内存使用
        local mem_used=$(echo $mem | awk '{print $1}')
        local mem_total=$(echo $mem | awk '{print $3}')
        
        container_data+="{\"name\": \"$container\", \"cpu\": \"$cpu\", \"memory\": {\"used\": \"$mem_used\", \"total\": \"$mem_total\"}}"
    done
    
    container_data+="]}"
    
    echo $container_data > $CONTAINER_METRICS_FILE
}

# 每30秒收集一次
while true; do
    get_container_metrics
    sleep 30
done
```

## 2. 应用性能监控脚本

### 2.1 API性能监控
```python
#!/usr/bin/env python3
# api-monitor.py - API性能监控脚本

import requests
import json
import time
import statistics
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class APIMonitor:
    def __init__(self, base_url, endpoints):
        self.base_url = base_url
        self.endpoints = endpoints
        self.metrics = []
        
    def test_endpoint(self, endpoint, method='GET', data=None):
        """测试单个端点性能"""
        url = f"{self.base_url}{endpoint['path']}"
        start_time = time.time()
        
        try:
            if method == 'GET':
                response = requests.get(url, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, timeout=10)
            
            end_time = time.time()
            response_time = (end_time - start_time) * 1000  # 转换为毫秒
            
            return {
                'endpoint': endpoint['path'],
                'method': method,
                'status_code': response.status_code,
                'response_time_ms': response_time,
                'timestamp': datetime.utcnow().isoformat()
            }
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Error testing {url}: {e}")
            return {
                'endpoint': endpoint['path'],
                'method': method,
                'status_code': 0,
                'response_time_ms': 0,
                'error': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }
    
    def run_performance_test(self, duration_minutes=5, concurrent_users=10):
        """运行性能测试"""
        logger.info(f"Starting performance test for {duration_minutes} minutes")
        
        results = []
        end_time = time.time() + (duration_minutes * 60)
        
        while time.time() < end_time:
            for endpoint in self.endpoints:
                result = self.test_endpoint(endpoint)
                results.append(result)
            
            time.sleep(1)  # 每秒测试一次
        
        # 生成报告
        self.generate_report(results)
    
    def generate_report(self, results):
        """生成性能报告"""
        report = {
            'summary': {
                'total_requests': len(results),
                'successful_requests': len([r for r in results if r['status_code'] == 200]),
                'failed_requests': len([r for r in results if r['status_code'] != 200]),
                'test_duration': '5 minutes'
            },
            'metrics': {}
        }
        
        # 按端点分组统计
        endpoints = set(r['endpoint'] for r in results)
        for endpoint in endpoints:
            endpoint_results = [r for r in results if r['endpoint'] == endpoint]
            response_times = [r['response_time_ms'] for r in endpoint_results if r['response_time_ms'] > 0]
            
            if response_times:
                report['metrics'][endpoint] = {
                    'requests': len(endpoint_results),
                    'avg_response_time': statistics.mean(response_times),
                    'min_response_time': min(response_times),
                    'max_response_time': max(response_times),
                    'p95_response_time': statistics.quantiles(response_times, n=20)[18],
                    'error_rate': len([r for r in endpoint_results if r['status_code'] != 200]) / len(endpoint_results)
                }
        
        # 保存报告
        with open('/var/log/performance/api-report.json', 'w') as f:
            json.dump(report, f, indent=2)
        
        logger.info("Performance test completed. Report saved to api-report.json")

# 配置
BASE_URL = "http://localhost:8080"
ENDPOINTS = [
    {"path": "/api/v1/health"},
    {"path": "/api/v1/users/1"},
    {"path": "/api/v1/products"},
    {"path": "/api/v1/orders"}
]

if __name__ == "__main__":
    monitor = APIMonitor(BASE_URL, ENDPOINTS)
    monitor.run_performance_test(duration_minutes=5, concurrent_users=1)
```

### 2.2 数据库性能监控
```python
#!/usr/bin/env python3
# db-monitor.py - 数据库性能监控

import psycopg2
import json
import time
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DatabaseMonitor:
    def __init__(self, connection_params):
        self.connection_params = connection_params
        
    def get_connection(self):
        """获取数据库连接"""
        return psycopg2.connect(**self.connection_params)
    
    def collect_metrics(self):
        """收集数据库性能指标"""
        metrics = {
            'timestamp': datetime.utcnow().isoformat(),
            'database': {}
        }
        
        try:
            conn = self.get_connection()
            cur = conn.cursor()
            
            # 连接数
            cur.execute("""
                SELECT count(*) as active_connections
                FROM pg_stat_activity
                WHERE state = 'active'
            """)
            active_connections = cur.fetchone()[0]
            metrics['database']['active_connections'] = active_connections
            
            # 数据库大小
            cur.execute("""
                SELECT pg_database_size(current_database()) as db_size_bytes
            """)
            db_size = cur.fetchone()[0]
            metrics['database']['database_size_bytes'] = db_size
            
            # 慢查询数量
            cur.execute("""
                SELECT count(*) as slow_queries
                FROM pg_stat_activity
                WHERE state = 'active'
                AND query_start < now() - interval '1 second'
            """)
            slow_queries = cur.fetchone()[0]
            metrics['database']['slow_queries'] = slow_queries
            
            # 缓存命中率
            cur.execute("""
                SELECT 
                    blks_hit::float / (blks_hit + blks_read) * 100 as cache_hit_ratio
                FROM pg_stat_database
                WHERE datname = current_database()
            """)
            cache_hit_ratio = cur.fetchone()[0]
            metrics['database']['cache_hit_ratio'] = round(cache_hit_ratio, 2)
            
            # 事务统计
            cur.execute("""
                SELECT 
                    xact_commit,
                    xact_rollback,
                    tup_returned,
                    tup_fetched,
                    tup_inserted,
                    tup_updated,
                    tup_deleted
                FROM pg_stat_database
                WHERE datname = current_database()
            """)
            stats = cur.fetchone()
            metrics['database']['transactions'] = {
                'commits': stats[0],
                'rollbacks': stats[1],
                'tuples_returned': stats[2],
                'tuples_fetched': stats[3],
                'tuples_inserted': stats[4],
                'tuples_updated': stats[5],
                'tuples_deleted': stats[6]
            }
            
            cur.close()
            conn.close()
            
        except Exception as e:
            logger.error(f"Error collecting database metrics: {e}")
            metrics['error'] = str(e)
        
        return metrics
    
    def collect_slow_queries(self):
        """收集慢查询信息"""
        slow_queries = []
        
        try:
            conn = self.get_connection()
            cur = conn.cursor()
            
            cur.execute("""
                SELECT 
                    pid,
                    usename,
                    application_name,
                    client_addr,
                    state,
                    query_start,
                    now() - query_start as duration,
                    query
                FROM pg_stat_activity
                WHERE state = 'active'
                AND query_start < now() - interval '1 second'
                ORDER BY query_start
            """)
            
            for row in cur.fetchall():
                slow_queries.append({
                    'pid': row[0],
                    'username': row[1],
                    'application': row[2],
                    'client_ip': str(row[3]),
                    'state': row[4],
                    'query_start': row[5].isoformat(),
                    'duration_seconds': str(row[6]),
                    'query': row[7][:200]  # 截断长查询
                })
            
            cur.close()
            conn.close()
            
        except Exception as e:
            logger.error(f"Error collecting slow queries: {e}")
        
        return slow_queries
    
    def run_monitoring(self, interval_seconds=60):
        """运行持续监控"""
        logger.info("Starting database monitoring...")
        
        while True:
            metrics = self.collect_metrics()
            slow_queries = self.collect_slow_queries()
            
            # 保存指标
            with open('/var/log/performance/db-metrics.json', 'w') as f:
                json.dump(metrics, f, indent=2)
            
            # 保存慢查询
            with open('/var/log/performance/slow-queries.json', 'w') as f:
                json.dump(slow_queries, f, indent=2)
            
            logger.info(f"Collected metrics at {metrics['timestamp']}")
            time.sleep(interval_seconds)

# 配置
DB_CONFIG = {
    'host': 'localhost',
    'database': 'testdb',
    'user': 'testuser',
    'password': 'testpass'
}

if __name__ == "__main__":
    monitor = DatabaseMonitor(DB_CONFIG)
    monitor.run_monitoring(interval_seconds=60)
```

## 3. 缓存性能监控

### 3.1 Redis监控
```python
#!/usr/bin/env python3
# redis-monitor.py - Redis性能监控

import redis
import json
import time
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RedisMonitor:
    def __init__(self, host='localhost', port=6379, db=0):
        self.redis_client = redis.Redis(host=host, port=port, db=db)
        
    def collect_info(self):
        """收集Redis信息"""
        try:
            info = self.redis_client.info()
            return {
                'timestamp': datetime.utcnow().isoformat(),
                'redis': {
                    'version': info.get('redis_version'),
                    'uptime_seconds': info.get('uptime_in_seconds'),
                    'connected_clients': info.get('connected_clients'),
                    'used_memory': info.get('used_memory'),
                    'used_memory_human': info.get('used_memory_human'),
                    'memory_fragmentation_ratio': info.get('mem_fragmentation_ratio'),
                    'hits': info.get('keyspace_hits', 0),
                    'misses': info.get('keyspace_misses', 0),
                    'hit_rate': self.calculate_hit_rate(info),
                    'expired_keys': info.get('expired_keys', 0),
                    'evicted_keys': info.get('evicted_keys', 0),
                    'keyspace': info.get('db0', {})
                }
            }
        except Exception as e:
            logger.error(f"Error collecting Redis info: {e}")
            return {'error': str(e)}
    
    def calculate_hit_rate(self, info):
        """计算缓存命中率"""
        hits = info.get('keyspace_hits', 0)
        misses = info.get('keyspace_misses', 0)
        total = hits + misses
        
        return round((hits / total * 100), 2) if total > 0 else 0
    
    def collect_command_stats(self):
        """收集命令统计"""
        try:
            command_stats = self.redis_client.info('commandstats')
            return {
                'timestamp': datetime.utcnow().isoformat(),
                'commands': command_stats
            }
        except Exception as e:
            logger.error(f"Error collecting command stats: {e}")
            return {'error': str(e)}
    
    def monitor_slowlog(self):
        """监控慢查询"""
        try:
            slowlog = self.redis_client.slowlog_get(10)
            slow_queries = []
            
            for entry in slowlog:
                slow_queries.append({
                    'id': entry['id'],
                    'timestamp': datetime.fromtimestamp(entry['time']).isoformat(),
                    'duration_microseconds': entry['duration'],
                    'duration_ms': entry['duration'] / 1000,
                    'command': ' '.join(entry['command'])
                })
            
            return {
                'timestamp': datetime.utcnow().isoformat(),
                'slow_queries': slow_queries
            }
        except Exception as e:
            logger.error(f"Error collecting slow log: {e}")
            return {'error': str(e)}
    
    def run_monitoring(self, interval_seconds=30):
        """运行持续监控"""
        logger.info("Starting Redis monitoring...")
        
        while True:
            # 收集基础信息
            info = self.collect_info()
            with open('/var/log/performance/redis-info.json', 'w') as f:
                json.dump(info, f, indent=2)
            
            # 收集命令统计
            command_stats = self.collect_command_stats()
            with open('/var/log/performance/redis-commands.json', 'w') as f:
                json.dump(command_stats, f, indent=2)
            
            # 收集慢查询
            slowlog = self.monitor_slowlog()
            with open('/var/log/performance/redis-slowlog.json', 'w') as f:
                json.dump(slowlog, f, indent=2)
            
            logger.info(f"Collected Redis metrics at {info.get('timestamp')}")
            time.sleep(interval_seconds)

if __name__ == "__main__":
    monitor = RedisMonitor(host='localhost', port=6379)
    monitor.run_monitoring(interval_seconds=30)
```

## 4. 告警配置脚本

### 4.1 阈值告警
```bash
#!/bin/bash
# alert-manager.sh - 阈值告警管理

ALERT_CONFIG="/etc/monitoring/alerts.json"
LOG_FILE="/var/log/monitoring/alerts.log"

# 告警配置
cat > $ALERT_CONFIG << 'EOF'
{
  "thresholds": {
    "cpu": 80,
    "memory": 85,
    "disk": 90,
    "response_time": 1000,
    "error_rate": 5
  },
  "notifications": {
    "slack": {
      "webhook_url": "${SLACK_WEBHOOK_URL}",
      "channel": "#alerts"
    },
    "email": {
      "smtp_server": "smtp.gmail.com",
      "smtp_port": 587,
      "username": "${ALERT_EMAIL}",
      "password": "${ALERT_PASSWORD}"
    }
  }
}
EOF

# 检查阈值并发送告警
check_threshold() {
    local metric=$1
    local value=$2
    local threshold=$3
    
    if (( $(echo "$value > $threshold" | bc -l) )); then
        local message="ALERT: $metric is ${value}% (threshold: ${threshold}%)"
        echo "$(date): $message" >> $LOG_FILE
        
        # 发送Slack通知
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$message\"}" \
            "${SLACK_WEBHOOK_URL}"
    fi
}

# 主监控循环
while true; do
    # 获取当前指标
    cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//')
    memory_usage=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
    disk_usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    # 检查告警
    check_threshold "CPU" "$cpu_usage" "$(jq -r '.thresholds.cpu' $ALERT_CONFIG)"
    check_threshold "Memory" "$memory_usage" "$(jq -r '.thresholds.memory' $ALERT_CONFIG)"
    check_threshold "Disk" "$disk_usage" "$(jq -r '.thresholds.disk' $ALERT_CONFIG)"
    
    sleep 60
done
```

## 5. 性能报告生成脚本

### 5.1 综合性能报告
```python
#!/usr/bin/env python3
# performance-reporter.py - 性能报告生成器

import json
import pandas as pd
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
import seaborn as sns
import os

class PerformanceReporter:
    def __init__(self, metrics_dir="/var/log/performance"):
        self.metrics_dir = metrics_dir
        self.report_dir = "/var/reports/performance"
        os.makedirs(self.report_dir, exist_ok=True)
    
    def load_metrics(self):
        """加载所有性能指标"""
        metrics = {}
        
        # 系统指标
        try:
            with open(f"{self.metrics_dir}/system-metrics.json") as f:
                metrics['system'] = json.load(f)
        except FileNotFoundError:
            metrics['system'] = {}
        
        # 数据库指标
        try:
            with open(f"{self.metrics_dir}/db-metrics.json") as f:
                metrics['database'] = json.load(f)
        except FileNotFoundError:
            metrics['database'] = {}
        
        # Redis指标
        try:
            with open(f"{self.metrics_dir}/redis-info.json") as f:
                metrics['redis'] = json.load(f)
        except FileNotFoundError:
            metrics['redis'] = {}
        
        return metrics
    
    def generate_summary_report(self):
        """生成性能摘要报告"""
        metrics = self.load_metrics()
        
        report = {
            'generated_at': datetime.now().isoformat(),
            'summary': {
                'system_health': self.assess_system_health(metrics),
                'database_health': self.assess_database_health(metrics),
                'redis_health': self.assess_redis_health(metrics)
            }
        }
        
        # 保存报告
        report_path = f"{self.report_dir}/summary-{datetime.now().strftime('%Y%m%d')}.json"
        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2)
        
        return report
    
    def assess_system_health(self, metrics):
        """评估系统健康状态"""
        if not metrics.get('system'):
            return {'status': 'unknown', 'issues': ['No system metrics available']}
        
        issues = []
        system = metrics['system'].get('system', {})
        
        # 检查CPU使用率
        cpu_usage = system.get('cpu_usage', 0)
        if cpu_usage > 80:
            issues.append(f"High CPU usage: {cpu_usage}%")
        
        # 检查内存使用率
        memory_usage = system.get('memory_usage', 0)
        if memory_usage > 85:
            issues.append(f"High memory usage: {memory_usage}%")
        
        # 检查磁盘使用率
        disk_usage = system.get('disk_usage', 0)
        if disk_usage > 90:
            issues.append(f"High disk usage: {disk_usage}%")
        
        return {
            'status': 'healthy' if not issues else 'warning',
            'issues': issues
        }
    
    def assess_database_health(self, metrics):
        """评估数据库健康状态"""
        if not metrics.get('database'):
            return {'status': 'unknown', 'issues': ['No database metrics available']}
        
        issues = []
        db = metrics['database'].get('database', {})
        
        # 检查连接数
        connections = db.get('active_connections', 0)
        if connections > 100:  # 假设最大连接数为100
            issues.append(f"High connection count: {connections}")
        
        # 检查缓存命中率
        hit_ratio = db.get('cache_hit_ratio', 0)
        if hit_ratio < 80:
            issues.append(f"Low cache hit ratio: {hit_ratio}%")
        
        # 检查慢查询
        if db.get('slow_queries', 0) > 10:
            issues.append(f"High slow query count: {db.get('slow_queries', 0)}")
        
        return {
            'status': 'healthy' if not issues else 'warning',
            'issues': issues
        }
    
    def assess_redis_health(self, metrics):
        """评估Redis健康状态"""
        if not metrics.get('redis'):
            return {'status': 'unknown', 'issues': ['No Redis metrics available']}
        
        issues = []
        redis = metrics['redis'].get('redis', {})
        
        # 检查内存使用
        if redis.get('used_memory', 0) > 1000000000:  # 1GB
            issues.append(f"High memory usage: {redis.get('used_memory_human', 'N/A')}")
        
        # 检查缓存命中率
        hit_rate = redis.get('hit_rate', 0)
        if hit_rate < 85:
            issues.append(f"Low cache hit rate: {hit_rate}%")
        
        return {
            'status': 'healthy' if not issues else 'warning',
            'issues': issues
        }

if __name__ == "__main__":
    reporter = PerformanceReporter()
    report = reporter.generate_summary_report()
    
    print(f"Performance report generated at {report['generated_at']}")
    print(f"System status: {report['summary']['system_health']['status']}")
    print(f"Database status: {report['summary']['database_health']['status']}")
    print(f"Redis status: {report['summary']['redis_health']['status']}")
```

## 6. 部署和配置

### 6.1 系统服务配置
```bash
# /etc/systemd/system/performance-monitor.service
[Unit]
Description=Performance Monitoring Service
After=network.target

[Service]
Type=simple
User=monitoring
Group=monitoring
WorkingDirectory=/opt/monitoring
ExecStart=/opt/monitoring/performance-monitor.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### 6.2 Docker部署配置
```yaml
# docker-compose.monitoring.yml
version: '3.8'
services:
  performance-monitor:
    build:
      context: .
      dockerfile: Dockerfile.monitoring
    container_name: performance-monitor
    restart: unless-stopped
    volumes:
      - ./config:/opt/monitoring/config
      - ./logs:/var/log/performance
      - ./reports:/var/reports/performance
    environment:
      - REDIS_HOST=redis
      - POSTGRES_HOST=postgres
      - SLACK_WEBHOOK_URL=${SLACK_WEBHOOK_URL}
    depends_on:
      - redis
      - postgres
    networks:
      - monitoring

  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    networks:
      - monitoring

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3000:3000"
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana-dashboards:/etc/grafana/provisioning/dashboards
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    networks:
      - monitoring

volumes:
  prometheus_data:
  grafana_data:

networks:
  monitoring:
    driver: bridge
```

## 7. 配置管理

### 7.1 配置文件模板
```yaml
# config/monitoring.yml
monitoring:
  # 系统监控
  system:
    enabled: true
    interval: 60
    metrics:
      - cpu
      - memory
      - disk
      - network
      
  # 数据库监控
  database:
    enabled: true
    interval: 30
    connection:
      host: localhost
      port: 5432
      database: testdb
      user: monitor
      password: ${DB_PASSWORD}
      
  # Redis监控
  redis:
    enabled: true
    interval: 30
    connection:
      host: localhost
      port: 6379
      
  # 告警配置
  alerts:
    enabled: true
    thresholds:
      cpu: 80
      memory: 85
      disk: 90
      response_time: 1000
      error_rate: 5
      
  # 报告配置
  reporting:
    enabled: true
    schedule: "0 9 * * *"  # 每天9点生成报告
    retention_days: 30
```

以上脚本可以组合使用，形成完整的性能监控体系。每个脚本都可以独立运行，也可以通过Docker容器化部署。