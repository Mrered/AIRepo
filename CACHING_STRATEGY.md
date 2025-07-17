# 缓存策略模板

## 缓存架构概览

### 多级缓存层次
```
┌─────────────────────────────────────┐
│          CDN边缘节点                  │
├─────────────────────────────────────┤
│        反向代理缓存                    │
├─────────────────────────────────────┤
│        应用层缓存                      │
├─────────────────────────────────────┤
│        分布式缓存                      │
├─────────────────────────────────────┤
│        数据库缓存                      │
└─────────────────────────────────────┘
```

### 缓存类型对比

| 缓存类型 | 延迟 | 容量 | 适用场景 | 示例 |
|----------|------|------|----------|------|
| L1缓存 | <1ms | 小 | 热点数据 | CPU寄存器 |
| L2缓存 | 1-10ms | 中 | 会话数据 | Redis |
| L3缓存 | 10-100ms | 大 | 静态资源 | CDN |
| L4缓存 | 100ms-1s | 极大 | 归档数据 | 对象存储 |

## 缓存模式

### 1. Cache-Aside（旁路缓存）

#### 1.1 读取流程
```python
class CacheAsidePattern:
    def __init__(self, cache, database):
        self.cache = cache
        self.db = database
    
    def get_user(self, user_id):
        # 1. 先查缓存
        cache_key = f"user:{user_id}"
        user_data = self.cache.get(cache_key)
        
        if user_data:
            return json.loads(user_data)
        
        # 2. 缓存未命中，查数据库
        user = self.db.query("SELECT * FROM users WHERE id = %s", user_id)
        if user:
            # 3. 写入缓存
            self.cache.setex(cache_key, 3600, json.dumps(user))
            return user
        
        return None
    
    def update_user(self, user_id, user_data):
        # 1. 更新数据库
        self.db.execute("UPDATE users SET ... WHERE id = %s", user_id)
        
        # 2. 删除缓存（而非更新）
        cache_key = f"user:{user_id}"
        self.cache.delete(cache_key)
```

#### 1.2 配置示例
```yaml
cache_aside:
  enabled: true
  cache_name: "redis"
  ttl: 3600
  max_entries: 10000
  eviction_policy: "lru"
```

### 2. Read-Through（读穿透）

#### 2.1 实现原理
```python
class ReadThroughCache:
    def __init__(self, cache, loader):
        self.cache = cache
        self.loader = loader
    
    def get(self, key):
        value = self.cache.get(key)
        if value is None:
            # 缓存未命中，自动加载
            value = self.loader.load(key)
            if value:
                self.cache.set(key, value)
        return value
```

#### 2.2 配置模板
```yaml
read_through:
  cache_provider: "redis"
  loader:
    type: "database"
    query: "SELECT * FROM users WHERE id = ?"
  ttl: 1800
  refresh_ahead: 0.2  # 提前20%时间刷新
```

### 3. Write-Through（写穿透）

#### 3.1 实现模式
```python
class WriteThroughCache:
    def __init__(self, cache, database):
        self.cache = cache
        self.db = database
    
    def save_user(self, user):
        # 1. 先写缓存
        cache_key = f"user:{user['id']}"
        self.cache.set(cache_key, json.dumps(user))
        
        # 2. 再写数据库
        self.db.execute("INSERT INTO users ...", user)
        
        # 3. 确认成功
        return True
```

### 4. Write-Behind（写回）

#### 4.1 异步写入
```python
class WriteBehindCache:
    def __init__(self, cache, database, batch_size=100):
        self.cache = cache
        self.db = database
        self.batch_size = batch_size
        self.write_queue = asyncio.Queue()
    
    async def save_user(self, user):
        cache_key = f"user:{user['id']}"
        self.cache.set(cache_key, json.dumps(user))
        
        await self.write_queue.put(user)
        
        if self.write_queue.qsize() >= self.batch_size:
            await self.flush_writes()
    
    async def flush_writes(self):
        batch = []
        while not self.write_queue.empty() and len(batch) < self.batch_size:
            batch.append(await self.write_queue.get())
        
        if batch:
            self.db.batch_insert("users", batch)
```

## 缓存策略配置

### 1. Redis集群配置

#### 1.1 主从+哨兵模式
```yaml
redis_sentinel:
  masters:
    - name: "cache-master"
      host: "redis-master-1"
      port: 6379
  sentinels:
    - host: "sentinel-1"
      port: 26379
    - host: "sentinel-2"
      port: 26379
    - host: "sentinel-3"
      port: 26379
  password: ${REDIS_PASSWORD}
  database: 0
  max_connections: 100
  socket_timeout: 5
```

#### 1.2 Redis集群模式
```yaml
redis_cluster:
  startup_nodes:
    - host: "redis-node-1"
      port: 7000
    - host: "redis-node-2"
      port: 7001
    - host: "redis-node-3"
      port: 7002
  max_connections: 50
  retry_on_timeout: true
  skip_full_coverage_check: true
```

### 2. Memcached配置

```yaml
memcached:
  servers:
    - host: "memcached-1"
      port: 11211
      weight: 1
    - host: "memcached-2"
      port: 11211
      weight: 1
    - host: "memcached-3"
      port: 11211
      weight: 1
  options:
    connect_timeout: 1000
    send_timeout: 1000
    receive_timeout: 1000
    poll_timeout: 1000
    retry_timeout: 5000
```

### 3. 本地缓存配置

#### 3.1 Guava Cache（Java）
```java
Cache<String, User> userCache = CacheBuilder.newBuilder()
    .maximumSize(1000)
    .expireAfterWrite(10, TimeUnit.MINUTES)
    .refreshAfterWrite(5, TimeUnit.MINUTES)
    .recordStats()
    .build(new CacheLoader<String, User>() {
        @Override
        public User load(String userId) {
            return database.findUserById(userId);
        }
    });
```

#### 3.2 Caffeine Cache（Java）
```java
Cache<String, User> cache = Caffeine.newBuilder()
    .maximumSize(10_000)
    .expireAfterWrite(5, TimeUnit.MINUTES)
    .refreshAfterWrite(1, TimeUnit.MINUTES)
    .recordStats()
    .build(key -> database.findUserById(key));
```

## 缓存失效策略

### 1. 过期策略

#### 1.1 TTL设置
```yaml
cache_ttl:
  user_profile: 3600        # 1小时
  user_sessions: 1800       # 30分钟
  product_catalog: 7200     # 2小时
  pricing: 300              # 5分钟
  recommendations: 600      # 10分钟
```

#### 1.2 动态TTL
```python
def calculate_ttl(key_type, access_frequency):
    """根据访问频率动态调整TTL"""
    base_ttl = {
        'user_profile': 3600,
        'product_catalog': 7200,
        'recommendations': 600
    }
    
    ttl = base_ttl.get(key_type, 1800)
    
    # 高频访问延长TTL
    if access_frequency > 100:
        ttl *= 2
    
    # 低频访问缩短TTL
    elif access_frequency < 10:
        ttl /= 2
    
    return max(300, min(ttl, 86400))  # 限制在5分钟到24小时之间
```

### 2. 淘汰策略

#### 2.1 LRU（最近最少使用）
```yaml
lru_config:
  max_size: 10000
  max_memory: "1GB"
  sample_count: 5
  ttl: 3600
```

#### 2.2 LFU（最不经常使用）
```yaml
lfu_config:
  max_size: 10000
  counter_bits: 8
  decay_time: 600
```

#### 2.3 混合策略
```yaml
mixed_eviction:
  strategy: "lru_with_ttl"
  max_size: 10000
  max_memory: "2GB"
  hot_data_ratio: 0.2
  cold_data_ttl: 1800
```

## 缓存预热

### 1. 启动预热

#### 1.1 配置预热
```python
class CacheWarmer:
    def __init__(self, cache, database):
        self.cache = cache
        self.db = database
    
    def warm_cache(self):
        """启动时预热缓存"""
        # 预热热门用户
        hot_users = self.db.query("""
            SELECT * FROM users 
            WHERE last_login > NOW() - INTERVAL '7 days'
            ORDER BY login_frequency DESC
            LIMIT 1000
        """)
        
        for user in hot_users:
            cache_key = f"user:{user['id']}"
            self.cache.setex(cache_key, 3600, json.dumps(user))
        
        # 预热热门商品
        hot_products = self.db.query("""
            SELECT * FROM products 
            WHERE view_count > 1000
            ORDER BY view_count DESC
            LIMIT 500
        """)
        
        for product in hot_products:
            cache_key = f"product:{product['id']}"
            self.cache.setex(cache_key, 7200, json.dumps(product))
```

### 2. 定时预热

#### 2.1 Cron任务配置
```yaml
cache_warming:
  schedules:
    - name: "user_cache_warm"
      cron: "0 */6 * * *"  # 每6小时
      query: "SELECT * FROM active_users LIMIT 1000"
      ttl: 21600
    
    - name: "product_cache_warm"
      cron: "0 2 * * *"    # 每天2点
      query: "SELECT * FROM featured_products LIMIT 500"
      ttl: 86400
```

## 缓存雪崩防护

### 1. 随机过期时间

#### 1.1 时间随机化
```python
def get_ttl_with_jitter(base_ttl, jitter_percent=0.2):
    """添加随机时间偏移避免同时失效"""
    jitter = base_ttl * jitter_percent
    return base_ttl + random.uniform(-jitter, jitter)

# 使用示例
ttl = get_ttl_with_jitter(3600)  # 2880-4320秒之间随机
```

### 2. 互斥锁机制

#### 2.1 分布式锁
```python
class CacheMutex:
    def __init__(self, redis_client):
        self.redis = redis_client
    
    def get_with_lock(self, key, loader_func, lock_timeout=5):
        value = self.redis.get(key)
        if value:
            return json.loads(value)
        
        lock_key = f"lock:{key}"
        lock_id = str(uuid.uuid4())
        
        # 获取锁
        if self.redis.set(lock_key, lock_id, nx=True, ex=lock_timeout):
            try:
                # 双重检查
                value = self.redis.get(key)
                if value:
                    return json.loads(value)
                
                # 加载数据
                data = loader_func()
                if data:
                    self.redis.setex(key, 3600, json.dumps(data))
                return data
            finally:
                # 释放锁
                lua_script = """
                if redis.call("get", KEYS[1]) == ARGV[1] then
                    return redis.call("del", KEYS[1])
                else
                    return 0
                end
                """
                self.redis.eval(lua_script, 1, lock_key, lock_id)
        else:
            # 等待锁释放
            time.sleep(0.1)
            return self.get_with_lock(key, loader_func)
```

## 缓存一致性

### 1. 最终一致性

#### 1.1 消息队列同步
```python
class CacheConsistencyManager:
    def __init__(self, cache, message_queue):
        self.cache = cache
        self.queue = message_queue
    
    def update_user(self, user_id, user_data):
        # 更新数据库
        self.db.update_user(user_id, user_data)
        
        # 发布更新消息
        self.queue.publish('user.updated', {
            'user_id': user_id,
            'operation': 'update',
            'data': user_data
        })
    
    def handle_cache_invalidation(self, message):
        """处理缓存失效消息"""
        data = json.loads(message.body)
        cache_key = f"user:{data['user_id']}"
        
        if data['operation'] == 'update':
            self.cache.delete(cache_key)
        elif data['operation'] == 'delete':
            self.cache.delete(cache_key)
```

### 2. 强一致性

#### 2.1 事务性缓存
```python
class TransactionalCache:
    def __init__(self, cache, database):
        self.cache = cache
        self.db = database
    
    def update_user_with_cache(self, user_id, updates):
        """保证缓存和数据库的一致性"""
        with self.db.transaction():
            # 1. 更新数据库
            self.db.update_user(user_id, updates)
            
            # 2. 更新缓存
            cache_key = f"user:{user_id}"
            user_data = self.db.get_user(user_id)
            self.cache.set(cache_key, json.dumps(user_data))
```

## CDN配置

### 1. CloudFlare配置

#### 1.1 缓存规则
```yaml
cloudflare:
  zones:
    - domain: "api.{{PROJECT_NAME}}.com"
      cache_level: "bypass"
      rules:
        - pattern: "/api/v1/users/*"
          cache_level: "standard"
          ttl: 300
        - pattern: "/api/v1/products/*"
          cache_level: "cache_everything"
          ttl: 3600
    - domain: "static.{{PROJECT_NAME}}.com"
      cache_level: "cache_everything"
      ttl: 86400
```

### 2. AWS CloudFront配置

#### 2.1 行为配置
```yaml
cloudfront:
  distributions:
    - domain: "{{PROJECT_NAME}}.cloudfront.net"
      origins:
        - domain: "api.{{PROJECT_NAME}}.com"
          origin_path: ""
          custom_headers:
            - name: "X-API-Key"
              value: "${API_KEY}"
      behaviors:
        - path_pattern: "/api/*"
          allowed_methods: ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
          cached_methods: ["GET", "HEAD"]
          compress: true
          ttl: 300
          forwarded_values:
            - "Authorization"
            - "Accept"
```

## 性能监控

### 1. 缓存指标

#### 1.1 Redis监控
```yaml
redis_metrics:
  - name: "cache_hit_ratio"
    query: "keyspace_hits/(keyspace_hits+keyspace_misses)"
    threshold: 0.8
    
  - name: "memory_usage"
    query: "used_memory/maxmemory"
    threshold: 0.9
    
  - name: "evicted_keys"
    query: "evicted_keys"
    threshold: 100
    
  - name: "connected_clients"
    query: "connected_clients"
    threshold: 1000
```

#### 1.2 应用层监控
```python
# 缓存性能监控
class CacheMetrics:
    def __init__(self):
        self.hit_count = Counter('cache_hits_total', 'Cache hits')
        self.miss_count = Counter('cache_misses_total', 'Cache misses')
        self.latency = Histogram('cache_operation_duration_seconds', 'Cache operation latency')
    
    def record_hit(self):
        self.hit_count.inc()
    
    def record_miss(self):
        self.miss_count.inc()
    
    def record_latency(self, duration):
        self.latency.observe(duration)
    
    def get_hit_ratio(self):
        hits = self.hit_count._value.get()
        misses = self.miss_count._value.get()
        return hits / (hits + misses) if (hits + misses) > 0 else 0
```

## 配置模板

### 1. 综合缓存配置
```yaml
# caching-config.yaml
caching:
  enabled: true
  provider: "redis"
  
  layers:
    l1:
      type: "local"
      provider: "caffeine"
      max_size: 1000
      ttl: 300
      
    l2:
      type: "distributed"
      provider: "redis"
      cluster:
        nodes:
          - host: "redis-1"
            port: 6379
          - host: "redis-2"
            port: 6379
          - host: "redis-3"
            port: 6379
      
    l3:
      type: "cdn"
      provider: "cloudflare"
      zone: "api.{{PROJECT_NAME}}.com"
  
  strategies:
    read:
      pattern: "cache-aside"
      lock_timeout: 5
    write:
      pattern: "write-through"
      batch_size: 100
      
  ttl:
    default: 3600
    rules:
      - pattern: "user:*"
        ttl: 1800
      - pattern: "product:*"
        ttl: 7200
      - pattern: "session:*"
        ttl: 1800
        
  monitoring:
    enabled: true
    metrics:
      - "hit_ratio"
      - "latency"
      - "memory_usage"
    alerts:
      - name: "low_hit_ratio"
        condition: "hit_ratio < 0.8"
        action: "email"
```

### 2. 缓存测试配置
```yaml
# cache-test.yaml
tests:
  - name: "cache_performance"
    type: "load"
    concurrent_users: 100
    duration: 60
    operations:
      - type: "get"
        ratio: 0.8
        key_pattern: "user:{id}"
      - type: "set"
        ratio: 0.2
        key_pattern: "user:{id}"
        value_size: 1024
        
  - name: "cache_scenarios"
    scenarios:
      - name: "cache_miss"
        description: "Test cache miss behavior"
        steps:
          - clear_cache
          - measure_response_time
          - verify_cache_population
          
      - name: "cache_stampede"
        description: "Test cache stampede prevention"
        steps:
          - expire_key
          - concurrent_requests
          - verify_single_backend_call