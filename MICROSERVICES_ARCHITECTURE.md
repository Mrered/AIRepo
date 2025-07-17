# 微服务架构设计指导模板

## 微服务架构概览

### 架构原则
- **单一职责**：每个服务专注于一个业务能力
- **松耦合**：服务间通过定义良好的接口通信
- **独立部署**：每个服务可独立部署和扩展
- **去中心化治理**：团队拥有服务的完整生命周期
- **容错设计**：服务故障不影响整体系统

### 架构层次
```
┌─────────────────────────────────────────┐
│              用户界面层                    │
│         (Web/Mobile/Admin)               │
├─────────────────────────────────────────┤
│              API网关层                    │
│         (路由/认证/限流)                  │
├─────────────────────────────────────────┤
│            业务服务层                     │
├─────────────────────────────────────────┤
│            数据存储层                     │
└─────────────────────────────────────────┘
```

## 服务拆分策略

### 1. 按业务能力拆分

#### 1.1 核心服务
```
services/
├── user-service/          # 用户管理
│   ├── registration/
│   ├── authentication/
│   ├── profile/
│   └── authorization/
├── product-service/       # 商品管理
│   ├── catalog/
│   ├── inventory/
│   ├── pricing/
│   └── search/
├── order-service/         # 订单管理
│   ├── cart/
│   ├── checkout/
│   ├── payment/
│   └── fulfillment/
├── notification-service/  # 通知服务
│   ├── email/
│   ├── sms/
│   ├── push/
│   └── webhook/
└── analytics-service/     # 数据分析
    ├── events/
    ├── metrics/
    └── reports/
```

### 2. 按技术能力拆分

#### 2.1 技术专用服务
```
technical-services/
├── image-service/         # 图像处理
├── search-service/        # 搜索引擎
├── recommendation-service/ # 推荐引擎
├── payment-gateway/       # 支付网关
└── file-storage-service/  # 文件存储
```

## 服务设计规范

### 1. RESTful API设计

#### 1.1 API版本控制
```
/api/v1/users
/api/v2/users
/api/v1/orders
```

#### 1.2 资源命名规范
```
GET    /api/v1/users          # 获取用户列表
GET    /api/v1/users/:id      # 获取特定用户
POST   /api/v1/users          # 创建用户
PUT    /api/v1/users/:id      # 更新用户
DELETE /api/v1/users/:id      # 删除用户
```

### 2. 服务间通信

#### 2.1 同步通信
```yaml
# HTTP/REST
endpoint: https://user-service/api/v1/users
method: GET
headers:
  Authorization: Bearer {token}
  Content-Type: application/json
timeout: 30s
retry: 3
```

#### 2.2 异步通信
```yaml
# 消息队列
queue: order-events
event_type: order.created
payload:
  order_id: "12345"
  user_id: "67890"
  amount: 99.99
```

### 3. 数据管理

#### 3.1 数据库策略
- **每个服务独立数据库**
- **数据所有权明确**
- **避免分布式事务**
- **最终一致性**

#### 3.2 数据同步
```yaml
# 事件溯源模式
events:
  - type: UserRegistered
    data:
      user_id: "123"
      email: "user@example.com"
      timestamp: "2024-01-01T00:00:00Z"
  - type: OrderPlaced
    data:
      order_id: "456"
      user_id: "123"
      items: [...]
```

## 服务治理

### 1. 服务发现

#### 1.1 注册中心配置
```yaml
# Consul配置
service:
  name: user-service
  tags:
    - v1
    - production
  port: 8080
  check:
    http: http://localhost:8080/health
    interval: 10s
```

#### 1.2 Kubernetes服务发现
```yaml
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
  - port: 80
    targetPort: 8080
```

### 2. 负载均衡

#### 2.1 客户端负载均衡
```yaml
# Ribbon配置
user-service:
  ribbon:
    listOfServers: user-service-1:8080,user-service-2:8080,user-service-3:8080
    NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RoundRobinRule
```

#### 2.2 服务端负载均衡
```yaml
# Nginx配置
upstream user_service {
    server user-service-1:8080 weight=3;
    server user-service-2:8080 weight=2;
    server user-service-3:8080 weight=1;
}
```

### 3. 熔断降级

#### 3.1 Hystrix配置
```yaml
hystrix:
  command:
    default:
      execution:
        isolation:
          thread:
            timeoutInMilliseconds: 1000
      circuitBreaker:
        requestVolumeThreshold: 20
        errorThresholdPercentage: 50
        sleepWindowInMilliseconds: 5000
```

#### 3.2 降级策略
```yaml
fallback:
  strategies:
    - timeout: 返回缓存数据
    - circuit_open: 返回默认值
    - exception: 返回错误提示
```

## 部署架构

### 1. 容器化部署

#### 1.1 Dockerfile模板
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

#### 1.2 Kubernetes部署
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: user-service:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
```

### 2. 服务网格

#### 2.1 Istio配置
```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: user-service
spec:
  hosts:
  - user-service
  http:
  - match:
    - uri:
        prefix: /api/v1/users
    route:
    - destination:
        host: user-service
        port:
          number: 80
```

## 监控和可观测性

### 1. 指标收集

#### 1.1 应用指标
```yaml
metrics:
  - name: http_requests_total
    type: counter
    labels:
      - method
      - endpoint
      - status
  - name: http_request_duration_seconds
    type: histogram
    labels:
      - method
      - endpoint
```

#### 1.2 业务指标
```yaml
business_metrics:
  - name: user_registrations_total
    type: counter
  - name: orders_placed_total
    type: counter
  - name: revenue_total
    type: counter
```

### 2. 分布式追踪

#### 2.1 Jaeger配置
```yaml
tracing:
  jaeger:
    endpoint: http://jaeger-collector:14268/api/traces
  sampling:
    type: probabilistic
    param: 0.1
```

### 3. 日志聚合

#### 3.1 日志格式
```json
{
  "timestamp": "2024-01-01T00:00:00Z",
  "level": "INFO",
  "service": "user-service",
  "trace_id": "abc123",
  "span_id": "def456",
  "message": "User registered",
  "metadata": {
    "user_id": "123",
    "email": "user@example.com"
  }
}
```

## 数据一致性

### 1. Saga模式

#### 1.1 订单处理Saga
```yaml
saga:
  name: order_processing
  steps:
    - service: order-service
      action: create_order
      compensate: cancel_order
    - service: payment-service
      action: process_payment
      compensate: refund_payment
    - service: inventory-service
      action: reserve_items
      compensate: release_items
```

### 2. 事件驱动架构

#### 2.1 事件总线配置
```yaml
event_bus:
  type: kafka
  brokers:
    - kafka-1:9092
    - kafka-2:9092
    - kafka-3:9092
  topics:
    - name: user.events
      partitions: 3
      replication: 3
    - name: order.events
      partitions: 6
      replication: 3
```

## 测试策略

### 1. 测试金字塔

#### 1.1 单元测试
```javascript
// 示例单元测试
describe('UserService', () => {
  it('should create user successfully', async () => {
    const user = await userService.createUser({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(user.email).toBe('test@example.com');
  });
});
```

#### 1.2 集成测试
```yaml
# 集成测试配置
integration_test:
  services:
    - database
    - redis
    - message_queue
  test_data:
    - users.sql
    - products.sql
```

#### 1.3 端到端测试
```javascript
// 端到端测试
describe('Order Flow', () => {
  it('should complete order successfully', async () => {
    await page.goto('/products');
    await page.click('[data-testid="add-to-cart"]');
    await page.click('[data-testid="checkout"]');
    await page.fill('[data-testid="payment-form"]', paymentDetails);
    await page.click('[data-testid="place-order"]');
    await expect(page).toHaveText('Order placed successfully');
  });
});
```

## 安全最佳实践

### 1. 认证授权

#### 1.1 JWT配置
```yaml
jwt:
  secret: ${JWT_SECRET}
  expires_in: 3600
  refresh_expires_in: 604800
  issuer: {{PROJECT_NAME}}
```

#### 1.2 API密钥管理
```yaml
api_keys:
  - service: payment-gateway
    key: ${PAYMENT_API_KEY}
    permissions:
      - process_payment
      - refund
```

### 2. 网络安全

#### 2.1 网络策略
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: user-service-netpol
spec:
  podSelector:
    matchLabels:
      app: user-service
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: api-gateway
    ports:
    - protocol: TCP
      port: 3000
```

## 配置管理

### 1. 配置中心

#### 1.1 Consul配置
```yaml
consul:
  host: consul-server:8500
  prefix: {{PROJECT_NAME}}
  profiles:
    - production
    - staging
    - development
```

#### 1.2 Kubernetes ConfigMap
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: user-service-config
data:
  database.url: "postgres://user:pass@db:5432/users"
  redis.url: "redis://redis:6379"
  log.level: "info"
```

## 性能优化

### 1. 缓存策略

#### 1.1 Redis缓存
```yaml
cache:
  type: redis
  ttl: 3600
  key_pattern: "{{service}}:{{resource}}:{{id}}"
  strategies:
    - cache-aside
    - write-through
```

#### 1.2 CDN配置
```yaml
cdn:
  provider: cloudflare
  zones:
    - domain: api.{{PROJECT_NAME}}.com
      cache_level: aggressive
    - domain: static.{{PROJECT_NAME}}.com
      cache_level: cache_everything
```

### 2. 数据库优化

#### 2.1 连接池配置
```yaml
database:
  pool:
    min: 5
    max: 20
    acquire: 30000
    idle: 10000
    evict: 1000
```

## 部署流水线

### 1. CI/CD配置

#### 1.1 GitHub Actions
```yaml
name: Deploy User Service
on:
  push:
    branches: [main]
    paths: ['services/user-service/**']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
    - run: npm ci
    - run: npm test
    
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Deploy to Kubernetes
      run: |
        kubectl apply -f services/user-service/k8s/
```

## 故障排除指南

### 1. 常见问题

#### 1.1 服务发现失败
- 检查Consul/Kubernetes DNS
- 验证服务注册状态
- 检查网络连通性

#### 1.2 高延迟
- 检查数据库查询性能
- 验证缓存命中率
- 分析分布式追踪数据

#### 1.3 内存泄漏
- 检查内存使用情况
- 分析堆转储
- 验证连接池配置

### 2. 诊断工具

#### 2.1 健康检查端点
```javascript
app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      queue: await checkQueue()
    }
  };
  res.json(health);
});