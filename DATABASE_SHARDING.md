# 数据库分片策略模板

## 分片策略概览

### 分片类型
- **水平分片（Horizontal Sharding）**：按行分割数据
- **垂直分片（Vertical Sharding）**：按列分割数据
- **混合分片**：水平和垂直分片结合

### 分片策略选择矩阵

| 数据特征 | 推荐策略 | 适用场景 |
|----------|----------|----------|
| 数据量大 | 水平分片 | 用户表、订单表 |
| 列数多 | 垂直分片 | 商品详情表 |
| 地理分布 | 地理分片 | 用户地理位置 |
| 时间序列 | 时间分片 | 日志表、事件表 |

## 水平分片策略

### 1. 范围分片（Range Sharding）

#### 1.1 用户ID范围分片
```sql
-- 分片规则：按用户ID范围划分
-- 分片0：用户ID 1-1000000
-- 分片1：用户ID 1000001-2000000
-- 分片2：用户ID 2000001-3000000

-- 创建分片表
CREATE TABLE users_shard_0 (
    id BIGINT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    CHECK (id BETWEEN 1 AND 1000000)
);

CREATE TABLE users_shard_1 (
    id BIGINT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    CHECK (id BETWEEN 1000001 AND 2000000)
);

CREATE TABLE users_shard_2 (
    id BIGINT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    CHECK (id BETWEEN 2000001 AND 3000000)
);

-- 创建分片视图
CREATE VIEW users_distributed AS
SELECT * FROM users_shard_0
UNION ALL
SELECT * FROM users_shard_1
UNION ALL
SELECT * FROM users_shard_2;
```

#### 1.2 时间范围分片
```sql
-- 按订单创建时间分片
CREATE TABLE orders_2024_01 (
    LIKE orders INCLUDING ALL,
    CHECK (created_at >= '2024-01-01' AND created_at < '2024-02-01')
);

CREATE TABLE orders_2024_02 (
    LIKE orders INCLUDING ALL,
    CHECK (created_at >= '2024-02-01' AND created_at < '2024-03-01')
);

-- 创建分区表
CREATE TABLE orders (
    id BIGSERIAL,
    user_id BIGINT,
    total_amount DECIMAL(10,2),
    status VARCHAR(20),
    created_at TIMESTAMP,
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

CREATE TABLE orders_2024_01 PARTITION OF orders
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE orders_2024_02 PARTITION OF orders
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
```

### 2. 哈希分片（Hash Sharding）

#### 2.1 一致性哈希分片
```sql
-- 创建分片函数
CREATE OR REPLACE FUNCTION get_shard_id(key BIGINT, shard_count INT)
RETURNS INT AS $$
BEGIN
    RETURN ABS(key % shard_count);
END;
$$ LANGUAGE plpgsql;

-- 创建分片表
CREATE TABLE users_shard_0 (
    id BIGINT PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(100),
    shard_key INT GENERATED ALWAYS AS (get_shard_id(id, 4)) STORED
);

CREATE TABLE users_shard_1 (
    id BIGINT PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(100),
    shard_key INT GENERATED ALWAYS AS (get_shard_id(id, 4)) STORED
);

CREATE TABLE users_shard_2 (
    id BIGINT PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(100),
    shard_key INT GENERATED ALWAYS AS (get_shard_id(id, 4)) STORED
);

CREATE TABLE users_shard_3 (
    id BIGINT PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(100),
    shard_key INT GENERATED ALWAYS AS (get_shard_id(id, 4)) STORED
);
```

#### 2.2 虚拟分片节点
```sql
-- 创建虚拟节点映射表
CREATE TABLE shard_mapping (
    virtual_node INT PRIMARY KEY,
    physical_shard INT NOT NULL,
    range_start BIGINT,
    range_end BIGINT
);

-- 插入虚拟节点映射
INSERT INTO shard_mapping VALUES
(0, 0, 0, 249999),
(1, 0, 250000, 499999),
(2, 1, 500000, 749999),
(3, 1, 750000, 999999),
(4, 2, 1000000, 1249999),
(5, 2, 1250000, 1499999);
```

### 3. 地理分片（Geographic Sharding）

#### 3.1 按地区分片
```sql
-- 地区分片配置
CREATE TABLE users_us_east (
    id BIGINT PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(100),
    region VARCHAR(10) DEFAULT 'us-east'
);

CREATE TABLE users_us_west (
    id BIGINT PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(100),
    region VARCHAR(10) DEFAULT 'us-west'
);

CREATE TABLE users_eu_west (
    id BIGINT PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(100),
    region VARCHAR(10) DEFAULT 'eu-west'
);

-- 地区路由表
CREATE TABLE region_routing (
    region VARCHAR(10) PRIMARY KEY,
    shard_name VARCHAR(50),
    connection_string VARCHAR(255)
);

INSERT INTO region_routing VALUES
('us-east', 'users_us_east', 'postgresql://user:pass@us-east-db:5432/db'),
('us-west', 'users_us_west', 'postgresql://user:pass@us-west-db:5432/db'),
('eu-west', 'users_eu_west', 'postgresql://user:pass@eu-west-db:5432/db');
```

## 垂直分片策略

### 1. 按功能模块分片

#### 1.1 用户基础信息和扩展信息分片
```sql
-- 用户基础信息（频繁访问）
CREATE TABLE users_basic (
    id BIGINT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 用户详细信息（较少访问）
CREATE TABLE users_profile (
    user_id BIGINT PRIMARY KEY REFERENCES users_basic(id),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    avatar_url VARCHAR(255)
);

-- 用户统计信息（可延迟加载）
CREATE TABLE users_stats (
    user_id BIGINT PRIMARY KEY REFERENCES users_basic(id),
    total_orders INT DEFAULT 0,
    total_spent DECIMAL(12,2) DEFAULT 0,
    last_order_date TIMESTAMP,
    loyalty_points INT DEFAULT 0
);
```

### 2. 按访问频率分片

#### 2.1 热数据和冷数据分离
```sql
-- 热数据：最近3个月的订单
CREATE TABLE orders_hot (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    total_amount DECIMAL(10,2),
    status VARCHAR(20),
    created_at TIMESTAMP,
    CHECK (created_at >= CURRENT_DATE - INTERVAL '3 months')
);

-- 温数据：3-12个月的订单
CREATE TABLE orders_warm (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    total_amount DECIMAL(10,2),
    status VARCHAR(20),
    created_at TIMESTAMP,
    CHECK (created_at >= CURRENT_DATE - INTERVAL '12 months'
           AND created_at < CURRENT_DATE - INTERVAL '3 months')
);

-- 冷数据：12个月前的订单
CREATE TABLE orders_cold (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    total_amount DECIMAL(10,2),
    status VARCHAR(20),
    created_at TIMESTAMP,
    CHECK (created_at < CURRENT_DATE - INTERVAL '12 months')
);
```

## 混合分片策略

### 1. 水平+垂直分片组合

#### 1.1 用户数据混合分片
```sql
-- 按地区和ID范围水平分片
-- 在每个分片内按功能垂直分片

-- 美国东部用户基础信息
CREATE TABLE users_basic_us_east_0 (
    id BIGINT PRIMARY KEY CHECK (id BETWEEN 1 AND 1000000),
    username VARCHAR(50),
    email VARCHAR(100),
    region VARCHAR(10) DEFAULT 'us-east',
    created_at TIMESTAMP
);

CREATE TABLE users_basic_us_east_1 (
    id BIGINT PRIMARY KEY CHECK (id BETWEEN 1000001 AND 2000000),
    username VARCHAR(50),
    email VARCHAR(100),
    region VARCHAR(10) DEFAULT 'us-east',
    created_at TIMESTAMP
);

-- 美国东部用户详情
CREATE TABLE users_profile_us_east (
    user_id BIGINT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    address TEXT,
    FOREIGN KEY (user_id) REFERENCES users_basic_us_east_0(id)
    DEFERRABLE INITIALLY DEFERRED
);
```

## 分片键选择指南

### 1. 选择标准

| 标准 | 描述 | 示例 |
|------|------|------|
| 高基数 | 唯一值多 | 用户ID、订单ID |
| 均匀分布 | 避免数据倾斜 | UUID、哈希值 |
| 稳定性 | 值不会改变 | 创建时间、ID |
| 查询模式 | 符合主要查询 | 用户ID、地区 |

### 2. 分片键类型

#### 2.1 单一分片键
```sql
-- 用户ID作为分片键
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(100)
) PARTITION BY HASH (id);
```

#### 2.2 复合分片键
```sql
-- 用户ID + 时间作为分片键
CREATE TABLE user_activities (
    user_id BIGINT,
    activity_type VARCHAR(50),
    activity_data JSONB,
    created_at TIMESTAMP,
    PRIMARY KEY (user_id, created_at)
) PARTITION BY RANGE (created_at);
```

## 数据迁移策略

### 1. 在线迁移策略

#### 1.1 双写模式
```sql
-- 创建新分片
CREATE TABLE users_new_shard (
    LIKE users INCLUDING ALL
);

-- 双写触发器
CREATE OR REPLACE FUNCTION dual_write_users()
RETURNS TRIGGER AS $$
BEGIN
    -- 写入旧分片
    INSERT INTO users VALUES (NEW.*);
    
    -- 写入新分片
    IF get_shard_id(NEW.id, 8) = 7 THEN
        INSERT INTO users_new_shard VALUES (NEW.*);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

#### 1.2 增量迁移
```python
# 迁移脚本示例
def migrate_users_incrementally(batch_size=1000):
    offset = 0
    while True:
        users = fetch_users_batch(offset, batch_size)
        if not users:
            break
        
        for user in users:
            new_shard = calculate_shard(user['id'], new_shard_count)
            migrate_user_to_shard(user, new_shard)
        
        offset += batch_size
        time.sleep(1)  # 控制迁移速度
```

### 2. 零停机迁移

#### 2.1 路由表更新
```sql
-- 路由版本控制
CREATE TABLE shard_routing (
    id SERIAL PRIMARY KEY,
    key_range_start BIGINT,
    key_range_end BIGINT,
    shard_name VARCHAR(50),
    version INT DEFAULT 1,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 原子切换路由
BEGIN;
UPDATE shard_routing SET active = FALSE WHERE version = 1;
UPDATE shard_routing SET active = TRUE WHERE version = 2;
COMMIT;
```

## 跨分片查询优化

### 1. 查询路由

#### 1.1 查询分析器
```sql
-- 创建查询路由函数
CREATE OR REPLACE FUNCTION route_query(query_key BIGINT)
RETURNS TABLE(shard_name VARCHAR, connection_string TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT sr.shard_name, sr.connection_string
    FROM shard_routing sr
    WHERE query_key BETWEEN sr.key_range_start AND sr.key_range_end
    AND sr.active = TRUE
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;
```

#### 1.2 聚合查询
```sql
-- 跨分片聚合视图
CREATE VIEW users_global AS
SELECT * FROM dblink('shard_0_conn', 'SELECT * FROM users') AS t0(...)
UNION ALL
SELECT * FROM dblink('shard_1_conn', 'SELECT * FROM users') AS t1(...)
UNION ALL
SELECT * FROM dblink('shard_2_conn', 'SELECT * FROM users') AS t2(...);

-- 分布式聚合查询
CREATE OR REPLACE FUNCTION get_global_user_count()
RETURNS BIGINT AS $$
DECLARE
    total_count BIGINT := 0;
    shard_count INT := 4;
    i INT;
BEGIN
    FOR i IN 0..shard_count-1 LOOP
        EXECUTE format('SELECT COUNT(*) FROM users_shard_%s', i)
        INTO total_count;
        total_count := total_count + shard_count;
    END LOOP;
    RETURN total_count;
END;
$$ LANGUAGE plpgsql;
```

### 2. 缓存策略

#### 2.1 分片缓存
```python
# 分片缓存管理
class ShardCache:
    def __init__(self):
        self.caches = {
            'shard_0': Redis(host='redis-0'),
            'shard_1': Redis(host='redis-1'),
            'shard_2': Redis(host='redis-2'),
            'shard_3': Redis(host='redis-3')
        }
    
    def get_cache(self, key):
        shard = self.calculate_shard(key)
        return self.caches[shard]
    
    def cache_user(self, user_id, user_data):
        cache = self.get_cache(user_id)
        cache.setex(f"user:{user_id}", 3600, json.dumps(user_data))
```

## 监控和维护

### 1. 分片健康监控

#### 1.1 分片状态监控
```sql
-- 分片健康状态表
CREATE TABLE shard_health (
    shard_name VARCHAR(50) PRIMARY KEY,
    status VARCHAR(20) CHECK (status IN ('healthy', 'degraded', 'offline')),
    last_check TIMESTAMP,
    record_count BIGINT,
    size_mb DECIMAL(10,2),
    query_time_avg_ms INT
);

-- 健康检查查询
INSERT INTO shard_health (shard_name, status, last_check, record_count, size_mb, query_time_avg_ms)
SELECT 
    'users_shard_0',
    CASE 
        WHEN pg_is_in_recovery() THEN 'degraded'
        ELSE 'healthy'
    END,
    NOW(),
    (SELECT COUNT(*) FROM users_shard_0),
    pg_database_size('users_shard_0')/1024/1024,
    (SELECT AVG(total_time/calls) FROM pg_stat_statements WHERE dbid = (SELECT oid FROM pg_database WHERE datname = 'users_shard_0'))
WHERE datname = 'users_shard_0';
```

### 2. 数据均衡监控

#### 2.1 数据分布分析
```sql
-- 数据分布统计
CREATE VIEW shard_distribution AS
SELECT 
    'users_shard_0' as shard_name,
    COUNT(*) as record_count,
    MIN(id) as min_id,
    MAX(id) as max_id,
    pg_size_pretty(pg_total_relation_size('users_shard_0')) as size
FROM users_shard_0
UNION ALL
SELECT 
    'users_shard_1',
    COUNT(*),
    MIN(id),
    MAX(id),
    pg_size_pretty(pg_total_relation_size('users_shard_1'))
FROM users_shard_1
-- 继续添加其他分片...
;

-- 数据倾斜检测
SELECT 
    shard_name,
    record_count,
    ROUND(record_count * 100.0 / SUM(record_count) OVER(), 2) as percentage
FROM shard_distribution
ORDER BY record_count DESC;
```

## 配置模板

### 1. 分片配置模板
```yaml
# sharding-config.yaml
sharding:
  strategy: consistent_hash
  shard_count: 8
  virtual_nodes: 256
  replication_factor: 3
  
  shards:
    - name: shard_0
      host: db-0.internal
      port: 5432
      database: users_0
      weight: 1
    - name: shard_1
      host: db-1.internal
      port: 5432
      database: users_1
      weight: 1
      
  routing:
    algorithm: murmur3
    key_pattern: "user:{id}"
    
  migration:
    enabled: true
    batch_size: 1000
    rate_limit: 100  # records per second
```

### 2. 连接池配置
```yaml
# database-pool.yaml
database:
  shards:
    - name: users_shard_0
      host: db-0.internal
      port: 5432
      database: users_0
      pool:
        min: 5
        max: 20
        acquire: 30000
        idle: 10000
    - name: users_shard_1
      host: db-1.internal
      port: 5432
      database: users_1
      pool:
        min: 5
        max: 20
        acquire: 30000
        idle: 10000