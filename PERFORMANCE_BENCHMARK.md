# 性能基准测试模板

## 测试策略概览

### 测试金字塔
```
┌─────────────────────────────────────┐
│          端到端测试                    │
├─────────────────────────────────────┤
│          集成测试                      │
├─────────────────────────────────────┤
│          单元测试                      │
├─────────────────────────────────────┤
│          基准测试                      │
└─────────────────────────────────────┘
```

### 性能测试类型

| 测试类型 | 目标 | 频率 | 环境 | 持续时间 |
|----------|------|------|------|----------|
| 基准测试 | 建立性能基线 | 每次发布前 | 测试环境 | 30-60分钟 |
| 负载测试 | 验证预期负载 | 每周 | 测试环境 | 1-2小时 |
| 压力测试 | 找到性能极限 | 每月 | 预生产环境 | 2-4小时 |
| 稳定性测试 | 验证长期运行 | 每季度 | 预生产环境 | 24-48小时 |

## 测试环境配置

### 1. 环境规格

#### 1.1 测试环境配置
```yaml
environment:
  name: "performance_test"
  infrastructure:
    servers:
      - name: "api-server"
        cpu: "8 cores"
        memory: "16GB"
        storage: "100GB SSD"
        os: "Ubuntu 20.04"
        
      - name: "database"
        cpu: "8 cores"
        memory: "32GB"
        storage: "500GB SSD"
        os: "Ubuntu 20.04"
        
      - name: "cache"
        cpu: "4 cores"
        memory: "8GB"
        storage: "50GB SSD"
        os: "Ubuntu 20.04"
        
    network:
      bandwidth: "1Gbps"
      latency: "< 5ms"
      
  monitoring:
    tools:
      - "Prometheus"
      - "Grafana"
      - "Jaeger"
      - "ELK Stack"
```

#### 1.2 容器化配置
```yaml
# docker-compose.perf.yml
version: '3.8'
services:
  api-service:
    image: api-service:latest
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=performance
      - DB_URL=jdbc:postgresql://postgres:5432/testdb
    deploy:
      resources:
        limits:
          cpus: '4.0'
          memory: 8G
        reservations:
          cpus: '2.0'
          memory: 4G
          
  postgres:
    image: postgres:13
    environment:
      - POSTGRES_DB=testdb
      - POSTGRES_USER=testuser
      - POSTGRES_PASSWORD=testpass
    volumes:
      - ./init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 4G
          
  redis:
    image: redis:6-alpine
    command: redis-server --maxmemory 2gb --maxmemory-policy allkeys-lru
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 2G
```

## 测试场景设计

### 1. API性能测试

#### 1.1 REST API基准测试
```javascript
// k6性能测试脚本
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '2m', target: 100 },   // 渐进增加负载
    { duration: '5m', target: 100 },   // 稳定负载
    { duration: '2m', target: 200 },   // 增加负载
    { duration: '5m', target: 200 },   // 稳定负载
    { duration: '2m', target: 300 },   // 峰值负载
    { duration: '5m', target: 300 },   // 峰值稳定
    { duration: '2m', target: 0 },     // 逐步减少
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95%请求在500ms内
    http_req_failed: ['rate<0.1'],     // 错误率低于10%
    errors: ['rate<0.1'],              // 自定义错误率
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

export default function() {
  // 测试用户查询API
  const userId = Math.floor(Math.random() * 10000) + 1;
  const userResponse = http.get(`${BASE_URL}/api/v1/users/${userId}`);
  
  check(userResponse, {
    'user API status is 200': (r) => r.status === 200,
    'user API response time < 200ms': (r) => r.timings.duration < 200,
  });
  
  errorRate.add(userResponse.status !== 200);
  
  // 测试订单创建API
  const orderPayload = JSON.stringify({
    userId: userId,
    items: [
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 1 }
    ]
  });
  
  const orderResponse = http.post(
    `${BASE_URL}/api/v1/orders`,
    orderPayload,
    { headers: { 'Content-Type': 'application/json' } }
  );
  
  check(orderResponse, {
    'order API status is 201': (r) => r.status === 201,
    'order API response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

#### 1.2 GraphQL性能测试
```javascript
// GraphQL性能测试
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    graphql_query: {
      executor: 'constant-vus',
      vus: 50,
      duration: '5m',
    },
  },
};

const GRAPHQL_ENDPOINT = 'http://localhost:8080/graphql';

const queries = [
  `query { users(limit: 10) { id name email } }`,
  `query { products(limit: 20) { id name price category } }`,
  `query { orders(limit: 5) { id userId totalAmount status } }`,
];

export default function() {
  const query = queries[Math.floor(Math.random() * queries.length)];
  
  const response = http.post(
    GRAPHQL_ENDPOINT,
    JSON.stringify({ query }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  
  check(response, {
    'GraphQL status is 200': (r) => r.status === 200,
    'GraphQL response time < 300ms': (r) => r.timings.duration < 300,
    'GraphQL no errors': (r) => {
      const body = JSON.parse(r.body);
      return !body.errors;
    },
  });
}
```

### 2. 数据库性能测试

#### 2.1 数据库查询性能
```sql
-- 性能测试数据准备
CREATE OR REPLACE FUNCTION generate_test_data()
RETURNS void AS $$
BEGIN
  -- 生成用户数据
  INSERT INTO users (username, email, created_at)
  SELECT 
    'user_' || i,
    'user_' || i || '@example.com',
    NOW() - (random() * 365 * INTERVAL '1 day')
  FROM generate_series(1, 100000) i;
  
  -- 生成订单数据
  INSERT INTO orders (user_id, total_amount, status, created_at)
  SELECT 
    (random() * 99999 + 1)::int,
    (random() * 1000 + 10)::numeric(10,2),
    (ARRAY['pending', 'processing', 'shipped', 'delivered'])[floor(random() * 4 + 1)],
    NOW() - (random() * 90 * INTERVAL '1 day')
  FROM generate_series(1, 500000);
  
  -- 创建索引
  CREATE INDEX idx_users_email ON users(email);
  CREATE INDEX idx_orders_user_id ON orders(user_id);
  CREATE INDEX idx_orders_created_at ON orders(created_at);
END;
$$ LANGUAGE plpgsql;

-- 性能测试查询
-- 测试1：用户查询性能
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'user_12345@example.com';

-- 测试2：订单聚合查询
EXPLAIN ANALYZE 
SELECT u.username, COUNT(o.id) as order_count, SUM(o.total_amount) as total_spent
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.created_at > NOW() - INTERVAL '30 days'
GROUP BY u.username
ORDER BY total_spent DESC
LIMIT 100;

-- 测试3：复杂查询性能
EXPLAIN ANALYZE
SELECT 
  DATE_TRUNC('day', created_at) as order_date,
  COUNT(*) as daily_orders,
  SUM(total_amount) as daily_revenue,
  AVG(total_amount) as avg_order_value
FROM orders
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY order_date;
```

#### 2.2 数据库连接池测试
```java
// 数据库连接池性能测试
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicLong;

public class DatabasePerformanceTest {
    private static final String DB_URL = "jdbc:postgresql://localhost:5432/testdb";
    private static final String USERNAME = "testuser";
    private static final String PASSWORD = "testpass";
    
    public static void main(String[] args) throws InterruptedException {
        // 配置连接池
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(DB_URL);
        config.setUsername(USERNAME);
        config.setPassword(PASSWORD);
        config.setMaximumPoolSize(50);
        config.setMinimumIdle(10);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);
        
        HikariDataSource dataSource = new HikariDataSource(config);
        
        // 性能测试
        int threadCount = 100;
        int requestsPerThread = 1000;
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        CountDownLatch latch = new CountDownLatch(threadCount);
        AtomicLong totalQueries = new AtomicLong(0);
        AtomicLong totalTime = new AtomicLong(0);
        
        long startTime = System.currentTimeMillis();
        
        for (int i = 0; i < threadCount; i++) {
            executor.submit(() -> {
                try {
                    for (int j = 0; j < requestsPerThread; j++) {
                        long queryStart = System.nanoTime();
                        
                        try (Connection conn = dataSource.getConnection();
                             PreparedStatement stmt = conn.prepareStatement(
                                 "SELECT * FROM users WHERE id = ?")) {
                             
                            stmt.setInt(1, (int)(Math.random() * 100000) + 1);
                            try (ResultSet rs = stmt.executeQuery()) {
                                if (rs.next()) {
                                    // Process result
                                }
                            }
                        }
                        
                        long queryEnd = System.nanoTime();
                        totalQueries.incrementAndGet();
                        totalTime.addAndGet(queryEnd - queryStart);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    latch.countDown();
                }
            });
        }
        
        latch.await();
        executor.shutdown();
        
        long endTime = System.currentTimeMillis();
        long totalTestTime = endTime - startTime;
        
        System.out.println("Database Performance Results:");
        System.out.println("Total Queries: " + totalQueries.get());
        System.out.println("Total Time: " + totalTestTime + "ms");
        System.out.println("Queries per second: " + (totalQueries.get() * 1000.0 / totalTestTime));
        System.out.println("Average query time: " + (totalTime.get() / 1000000.0 / totalQueries.get()) + "ms");
        
        dataSource.close();
    }
}
```

### 3. 缓存性能测试

#### 3.1 Redis性能测试
```bash
#!/bin/bash
# redis-benchmark测试脚本

# 基本性能测试
redis-benchmark -h localhost -p 6379 -c 50 -n 100000 \
  -q -d 100 \
  -t set,get,lpush,lpop,sadd,spop

# 管道性能测试
redis-benchmark -h localhost -p 6379 -c 50 -n 100000 \
  -P 16 \
  -q -d 100 \
  -t set,get

# 特定场景测试
redis-benchmark -h localhost -p 6379 -c 100 -n 100000 \
  -r 100000 \
  -q \
  -t set,get \
  -d 1000
```

#### 3.2 Redis集群测试
```python
# Python Redis集群性能测试
import redis
import time
import threading
from concurrent.futures import ThreadPoolExecutor
import statistics

class RedisPerformanceTest:
    def __init__(self, host='localhost', port=6379):
        self.redis_client = redis.Redis(host=host, port=port, decode_responses=True)
        self.results = []
    
    def test_set_performance(self, num_operations=10000, num_threads=10):
        def worker(thread_id):
            local_results = []
            for i in range(num_operations // num_threads):
                key = f"test_key_{thread_id}_{i}"
                value = f"test_value_{i}" * 100  # 100字节数据
                
                start_time = time.time()
                self.redis_client.set(key, value)
                end_time = time.time()
                
                local_results.append((end_time - start_time) * 1000)  # 转换为毫秒
            
            return local_results
        
        with ThreadPoolExecutor(max_workers=num_threads) as executor:
            futures = [executor.submit(worker, i) for i in range(num_threads)]
            
            for future in futures:
                self.results.extend(future.result())
    
    def test_get_performance(self, num_operations=10000, num_threads=10):
        # 先准备数据
        for i in range(num_operations):
            key = f"test_key_get_{i}"
            value = f"test_value_{i}" * 100
            self.redis_client.set(key, value)
        
        def worker(thread_id):
            local_results = []
            for i in range(num_operations // num_threads):
                key = f"test_key_get_{(thread_id * 1000 + i) % num_operations}"
                
                start_time = time.time()
                self.redis_client.get(key)
                end_time = time.time()
                
                local_results.append((end_time - start_time) * 1000)
            
            return local_results
        
        with ThreadPoolExecutor(max_workers=num_threads) as executor:
            futures = [executor.submit(worker, i) for i in range(num_threads)]
            
            for future in futures:
                self.results.extend(future.result())
    
    def print_results(self):
        if not self.results:
            print("No test results available")
            return
        
        avg_time = statistics.mean(self.results)
        min_time = min(self.results)
        max_time = max(self.results)
        p95_time = statistics.quantiles(self.results, n=20)[18]  # 95th percentile
        
        print("Redis Performance Results:")
        print(f"Average response time: {avg_time:.2f}ms")
        print(f"Min response time: {min_time:.2f}ms")
        print(f"Max response time: {max_time:.2f}ms")
        print(f"95th percentile: {p95_time:.2f}ms")
        print(f"Operations per second: {1000/avg_time:.2f}")

if __name__ == "__main__":
    tester = RedisPerformanceTest()
    
    print("Testing SET performance...")
    tester.test_set_performance(10000, 10)
    tester.print_results()
    tester.results.clear()
    
    print("\nTesting GET performance...")
    tester.test_get_performance(10000, 10)
    tester.print_results()
```

## 性能基准指标

### 1. API性能基准

#### 1.1 响应时间基准
```yaml
api_performance_baseline:
  endpoints:
    - path: "/api/v1/users/{id}"
      method: "GET"
      expected_performance:
        p50: 50ms
        p95: 200ms
        p99: 500ms
        error_rate: <0.1%
        
    - path: "/api/v1/users"
      method: "POST"
      expected_performance:
        p50: 100ms
        p95: 300ms
        p99: 800ms
        error_rate: <0.5%
        
    - path: "/api/v1/orders"
      method: "GET"
      expected_performance:
        p50: 75ms
        p95: 250ms
        p99: 600ms
        error_rate: <0.2%
```

#### 1.2 吞吐量基准
```yaml
throughput_baseline:
  scenarios:
    - name: "正常负载"
      concurrent_users: 100
      rps: 1000
      duration: 300s
      
    - name: "峰值负载"
      concurrent_users: 500
      rps: 5000
      duration: 60s
      
    - name: "压力测试"
      concurrent_users: 1000
      rps: 10000
      duration: 30s
```

### 2. 数据库性能基准

#### 2.1 查询性能基准
```yaml
database_performance_baseline:
  query_types:
    - type: "单表查询"
      complexity: "简单"
      expected_time: "< 10ms"
      
    - type: "连接查询"
      complexity: "中等"
      expected_time: "< 50ms"
      
    - type: "聚合查询"
      complexity: "复杂"
      expected_time: "< 200ms"
      
    - type: "批量插入"
      complexity: "批量"
      expected_rate: "> 1000 rows/sec"
```

#### 2.2 连接池基准
```yaml
connection_pool_baseline:
  pool_size: 20
  metrics:
    - name: "连接获取时间"
      expected: "< 100ms"
      
    - name: "连接利用率"
      expected: "70-90%"
      
    - name: "等待队列长度"
      expected: "< 5"
```

### 3. 缓存性能基准

#### 3.1 Redis性能基准
```yaml
redis_performance_baseline:
  operations:
    - operation: "SET"
      expected_latency: "< 1ms"
      expected_throughput: "> 100,000 ops/sec"
      
    - operation: "GET"
      expected_latency: "< 1ms"
      expected_throughput: "> 100,000 ops/sec"
      
    - operation: "LPUSH"
      expected_latency: "< 1ms"
      expected_throughput: "> 50,000 ops/sec"
      
    - operation: "LRANGE"
      expected_latency: "< 5ms"
      expected_throughput: "> 10,000 ops/sec"
```

## 性能测试自动化

### 1. CI/CD集成

#### 1.1 GitHub Actions配置
```yaml
# .github/workflows/performance-test.yml
name: Performance Tests

on:
  pull_request:
    types: [opened, synchronize]
    paths:
      - 'src/**'
      - 'tests/performance/**'
  schedule:
    - cron: '0 2 * * 1'  # 每周一早2点运行

jobs:
  performance-test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
          
      redis:
        image: redis:6-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build application
      run: npm run build
      
    - name: Start application
      run: |
        npm start &
        sleep 30
        
    - name: Run k6 performance tests
      uses: grafana/k6-action@v0.3.0
      with:
        filename: tests/performance/api-load-test.js
        
    - name: Upload performance results
      uses: actions/upload-artifact@v3
      with:
        name: performance-results
        path: |
          performance-summary.json
          k6-results.html
```

### 2. 性能报告模板

#### 2.1 性能测试报告
```markdown
# 性能测试报告 - {{TEST_DATE}}

## 测试概览
- **测试类型**: API负载测试
- **测试环境**: {{ENVIRONMENT}}
- **测试时长**: {{DURATION}}
- **并发用户**: {{CONCURRENT_USERS}}

## 性能指标

### 响应时间
| 指标 | 实际值 | 基准值 | 状态 |
|------|--------|--------|------|
| 平均响应时间 | {{AVG_RESPONSE_TIME}}ms | < 100ms | ✅/❌ |
| P95响应时间 | {{P95_RESPONSE_TIME}}ms | < 200ms | ✅/❌ |
| P99响应时间 | {{P99_RESPONSE_TIME}}ms | < 500ms | ✅/❌ |

### 吞吐量
| 指标 | 实际值 | 基准值 | 状态 |
|------|--------|--------|------|
| 峰值RPS | {{PEAK_RPS}} | > 1000 | ✅/❌ |
| 平均RPS | {{AVG_RPS}} | > 500 | ✅/❌ |

### 错误率
| 指标 | 实际值 | 基准值 | 状态 |
|------|--------|--------|------|
| 错误率 | {{ERROR_RATE}}% | < 0.1% | ✅/❌ |

## 资源使用
- **CPU使用率**: {{CPU_USAGE}}%
- **内存使用率**: {{MEMORY_USAGE}}%
- **数据库连接数**: {{DB_CONNECTIONS}}
- **Redis命中率**: {{CACHE_HIT_RATE}}%

## 瓶颈分析
### 发现的问题
1. **数据库查询慢**
   - 问题：订单查询缺少索引
   - 影响：P95响应时间增加200ms
   - 建议：添加复合索引

2. **内存泄漏**
   - 问题：长时间运行后内存持续增长
   - 影响：可能导致OOM
   - 建议：检查连接池配置

## 优化建议
### 短期优化（1-2周）
1. 增加数据库连接池大小
2. 优化Redis缓存策略
3. 添加CDN缓存

### 长期优化（1个月）
1. 数据库分片
2. 引入消息队列
3. 微服务拆分

## 测试数据
[详细测试数据和图表]
```

## 性能监控集成

### 1. Prometheus指标收集

#### 1.1 应用指标
```python
# 性能指标收集
from prometheus_client import Counter, Histogram, Gauge, start_http_server
import time

# 定义指标
request_count = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint', 'status'])
request_duration = Histogram('http_request_duration_seconds', 'HTTP request duration', ['method', 'endpoint'])
active_connections = Gauge('active_database_connections', 'Active database connections')
cache_hit_rate = Gauge('redis_cache_hit_rate', 'Redis cache hit rate')

# 中间件示例
class PerformanceMiddleware:
    def __init__(self, app):
        self.app = app
    
    async def __call__(self, scope, receive, send):
        if scope['type'] == 'http':
            method = scope['method']
            path = scope['path']
            
            start_time = time.time()
            
            async def send_wrapper(message):
                if message['type'] == 'http.response.start':
                    status = message['status']
                    duration = time.time() - start_time
                    
                    request_count.labels(method=method, endpoint=path, status=status).inc()
                    request_duration.labels(method=method, endpoint=path).observe(duration)
                
                await send(message)
            
            await self.app(scope, receive, send_wrapper)
        else:
            await self.app(scope, receive, send)
```

### 2. 性能告警配置

#### 2.1 Prometheus告警规则
```yaml
# prometheus-alerts.yml
groups:
  - name: performance_alerts
    rules:
      - alert: HighResponseTime
        expr: histogram_quantile(0.95, http_request_duration_seconds_bucket) > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
          description: "95th percentile response time is {{ $value }}s"
          
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value | humanizePercentage }}"
          
      - alert: LowCacheHitRate
        expr: redis_cache_hit_rate < 0.8
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Low cache hit rate"
          description: "Cache hit rate is {{ $value | humanizePercentage }}"
          
      - alert: HighDatabaseConnections
        expr: active_database_connections > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High database connection usage"
          description: "{{ $value }} active connections"
```

## 性能基准更新

### 1. 基准更新流程

#### 1.1 更新触发条件
```yaml
baseline_update_triggers:
  - condition: "性能提升>20%"
    action: "更新基准值"
    
  - condition: "架构重大变更"
    action: "重新建立基准"
    
  - condition: "季度性能回顾"
    action: "评估基准合理性"
    
  - condition: "用户量增长>50%"
    action: "调整基准预期"
```

#### 1.2 基准版本管理
```yaml
baseline_versions:
  - version: "v1.0"
    date: "2024-01-01"
    description: "初始性能基准"
    
  - version: "v1.1"
    date: "2024-03-15"
    description: "优化数据库查询后更新"
    changes:
      - "平均响应时间减少30%"
      - "数据库查询优化"
      
  - version: "v2.0"
    date: "2024-06-01"
    description: "微服务架构调整后更新"
    changes:
      - "服务拆分完成"
      - "新增缓存层"
      - "CDN集成"