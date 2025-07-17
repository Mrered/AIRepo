# 容量规划模板

## 容量规划框架

### 规划层次
```
┌─────────────────────────────────────┐
│          战略容量规划                  │
│        (3-5年长期规划)                 │
├─────────────────────────────────────┤
│          战术容量规划                  │
│        (6-12个月中期规划)               │
├─────────────────────────────────────┤
│          运营容量规划                  │
│        (1-3个月短期规划)                │
├─────────────────────────────────────┤
│          实时容量调度                  │
│        (小时/天级调整)                 │
└─────────────────────────────────────┘
```

### 容量类型

| 容量类型 | 度量单位 | 规划周期 | 调整方式 |
|----------|----------|----------|----------|
| 计算容量 | CPU核心数 | 周/月 | 自动扩缩容 |
| 内存容量 | GB | 周/月 | 手动扩容 |
| 存储容量 | GB/TB | 月/季 | 手动扩容 |
| 网络容量 | Mbps | 日/周 | 自动扩缩容 |
| 数据库容量 | 连接数/存储 | 月/季 | 分片/扩容 |

## 需求分析方法

### 1. 业务需求分析

#### 1.1 用户增长预测
```yaml
user_growth_forecast:
  baseline:
    current_users: 100000
    growth_rate: 0.15  # 15% 月增长
    seasonal_factor:
      q1: 0.9
      q2: 1.1
      q3: 1.2
      q4: 1.4
      
  scenarios:
    conservative:
      growth_rate: 0.10
      peak_multiplier: 2.0
      
    realistic:
      growth_rate: 0.15
      peak_multiplier: 3.0
      
    optimistic:
      growth_rate: 0.25
      peak_multiplier: 5.0
      
  projections:
    - month: "2024-01"
      users: 100000
      daily_active: 30000
      
    - month: "2024-06"
      users: 200000
      daily_active: 60000
      
    - month: "2024-12"
      users: 400000
      daily_active: 120000
```

#### 1.2 业务活动预测
```yaml
business_events:
  regular_events:
    - name: "月度促销"
      frequency: "monthly"
      traffic_spike: 2.0
      duration_hours: 24
      
    - name: "季度大促"
      frequency: "quarterly"
      traffic_spike: 5.0
      duration_hours: 72
      
  special_events:
    - name: "双十一"
      date: "2024-11-11"
      traffic_spike: 10.0
      duration_hours: 168
      
    - name: "黑五网一"
      date: "2024-11-29"
      traffic_spike: 8.0
      duration_hours: 96
```

### 2. 技术指标分析

#### 2.1 应用性能指标
```yaml
performance_metrics:
  api_metrics:
    - endpoint: "/api/v1/users"
      avg_rps_per_user: 0.1
      peak_rps_per_user: 0.5
      
    - endpoint: "/api/v1/orders"
      avg_rps_per_user: 0.05
      peak_rps_per_user: 0.2
      
    - endpoint: "/api/v1/products"
      avg_rps_per_user: 0.2
      peak_rps_per_user: 1.0
      
  resource_usage:
    - resource: "cpu"
      usage_per_1000_users: 2.0  # cores
      
    - resource: "memory"
      usage_per_1000_users: 4.0  # GB
      
    - resource: "database_connections"
      usage_per_1000_users: 10   # connections
      
    - resource: "bandwidth"
      usage_per_1000_users: 50   # Mbps
```

## 容量计算模型

### 1. 计算容量计算

#### 1.1 Web服务器容量
```python
# 容量计算器
class CapacityCalculator:
    def __init__(self):
        self.baseline_metrics = {
            'cpu_per_1000_rps': 2.0,      # cores
            'memory_per_1000_rps': 4.0,   # GB
            'cpu_utilization_target': 0.7,
            'memory_utilization_target': 0.8
        }
    
    def calculate_web_capacity(self, projected_rps, safety_factor=1.5):
        """计算Web服务器容量需求"""
        # 基础计算
        base_cpu = (projected_rps / 1000) * self.baseline_metrics['cpu_per_1000_rps']
        base_memory = (projected_rps / 1000) * self.baseline_metrics['memory_per_1000_rps']
        
        # 应用利用率和安全系数
        required_cpu = base_cpu / self.baseline_metrics['cpu_utilization_target'] * safety_factor
        required_memory = base_memory / self.baseline_metrics['memory_utilization_target'] * safety_factor
        
        return {
            'cpu_cores': max(2, int(required_cpu)),
            'memory_gb': max(4, int(required_memory)),
            'projected_rps': projected_rps,
            'safety_factor': safety_factor
        }
    
    def calculate_database_capacity(self, projected_connections, peak_multiplier=3.0):
        """计算数据库容量需求"""
        # 连接池计算
        max_connections = projected_connections * peak_multiplier
        
        # 存储容量计算 (假设每用户1MB数据，年增长50%)
        projected_users = 400000
        storage_per_user_mb = 1
        growth_rate = 0.5
        retention_years = 3
        
        total_storage_gb = (projected_users * storage_per_user_mb / 1024) * (1 + growth_rate) ** retention_years
        
        return {
            'max_connections': max_connections,
            'storage_gb': int(total_storage_gb),
            'iops': max_connections * 10,  # 假设每个连接10 IOPS
            'backup_storage_gb': int(total_storage_gb * 1.5)
        }
```

### 2. 存储容量计算

#### 2.1 数据增长模型
```yaml
storage_model:
  data_categories:
    - category: "用户数据"
      size_per_record: 10  # KB
      retention: 1095  # 3年
      growth_rate: 0.15
      
    - category: "订单数据"
      size_per_record: 50  # KB
      retention: 2190  # 6年
      growth_rate: 0.2
      
    - category: "日志数据"
      size_per_record: 2  # KB
      retention: 90  # 3个月
      growth_rate: 0.3
      
    - category: "文件存储"
      size_per_record: 5000  # KB
      retention: 730  # 2年
      growth_rate: 0.25
      
  calculation:
    formula: "current_size * (1 + growth_rate) ^ years * retention_factor"
    retention_factor: 1.5  # 冗余和备份
```

### 3. 网络容量计算

#### 3.1 带宽需求
```python
class NetworkCapacityCalculator:
    def __init__(self):
        self.traffic_patterns = {
            'page_view_size_kb': 500,
            'api_request_size_kb': 2,
            'api_response_size_kb': 10,
            'file_download_size_kb': 2000
        }
    
    def calculate_bandwidth(self, daily_active_users, avg_page_views_per_user):
        """计算带宽需求"""
        # 日均流量
        daily_page_views = daily_active_users * avg_page_views_per_user
        daily_api_calls = daily_page_views * 10  # 假设每页面10个API调用
        
        # 计算总流量
        page_view_traffic = daily_page_views * self.traffic_patterns['page_view_size_kb']
        api_traffic = daily_api_calls * (self.traffic_patterns['api_request_size_kb'] + 
                                       self.traffic_patterns['api_response_size_kb'])
        
        total_daily_traffic_mb = (page_view_traffic + api_traffic) / 1024
        
        # 计算峰值带宽 (假设峰值是平均的5倍)
        peak_hours_per_day = 4
        peak_bandwidth_mbps = (total_daily_traffic_mb * 8 * 5) / (peak_hours_per_day * 3600)
        
        # 添加安全系数
        safety_factor = 1.5
        required_bandwidth_mbps = peak_bandwidth_mbps * safety_factor
        
        return {
            'daily_traffic_mb': int(total_daily_traffic_mb),
            'peak_bandwidth_mbps': int(peak_bandwidth_mbps),
            'required_bandwidth_mbps': int(required_bandwidth_mbps),
            'monthly_transfer_tb': int(total_daily_traffic_mb * 30 / 1024 / 1024)
        }
```

## 自动扩缩容策略

### 1. Kubernetes HPA配置

#### 1.1 基于CPU的扩缩容
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-server-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-server
  minReplicas: 2
  maxReplicas: 100
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100
        periodSeconds: 30
      - type: Pods
        value: 5
        periodSeconds: 60
```

#### 1.2 基于自定义指标的扩缩容
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-server-custom-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-server
  minReplicas: 2
  maxReplicas: 200
  metrics:
  - type: Pods
    pods:
      metric:
        name: http_requests_per_second
      target:
        type: AverageValue
        averageValue: "1000"
  - type: External
    external:
      metric:
        name: pubsub.googleapis.com|subscription|num_undelivered_messages
      target:
        type: Value
        value: "1000"
```

### 2. 垂直扩缩容

#### 2.1 VPA配置
```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: api-server-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-server
  updatePolicy:
    updateMode: "Auto"
  resourcePolicy:
    containerPolicies:
    - containerName: api-server
      minAllowed:
        cpu: 100m
        memory: 128Mi
      maxAllowed:
        cpu: 2
        memory: 2Gi
      controlledResources: ["cpu", "memory"]
```

## 容量监控和告警

### 1. 关键指标监控

#### 1.1 容量利用率
```yaml
capacity_metrics:
  compute:
    - name: "cpu_utilization"
      threshold: 80
      unit: "percentage"
      
    - name: "memory_utilization"
      threshold: 85
      unit: "percentage"
      
  storage:
    - name: "disk_usage"
      threshold: 85
      unit: "percentage"
      
    - name: "iops_utilization"
      threshold: 80
      unit: "percentage"
      
  network:
    - name: "bandwidth_utilization"
      threshold: 75
      unit: "percentage"
      
  database:
    - name: "connection_utilization"
      threshold: 80
      unit: "percentage"
      
    - name: "storage_utilization"
      threshold: 85
      unit: "percentage"
```

#### 1.2 预测性告警
```python
# 容量预测算法
class CapacityPredictor:
    def __init__(self, historical_data):
        self.data = historical_data
    
    def predict_capacity_need(self, days_ahead=7):
        """预测未来容量需求"""
        import numpy as np
        from sklearn.linear_model import LinearRegression
        
        # 准备训练数据
        X = np.array(range(len(self.data))).reshape(-1, 1)
        y = np.array(self.data)
        
        # 训练模型
        model = LinearRegression()
        model.fit(X, y)
        
        # 预测未来
        future_X = np.array(range(len(self.data), len(self.data) + days_ahead)).reshape(-1, 1)
        predictions = model.predict(future_X)
        
        # 添加置信区间
        confidence_interval = 0.2  # 20% buffer
        upper_bound = predictions * (1 + confidence_interval)
        
        return {
            'predictions': predictions.tolist(),
            'upper_bound': upper_bound.tolist(),
            'risk_days': self.calculate_risk_days(predictions)
        }
    
    def calculate_risk_days(self, predictions):
        """计算达到容量阈值的天数"""
        # 假设阈值为当前容量的90%
        current_capacity = max(self.data)
        threshold = current_capacity * 0.9
        
        risk_days = []
        for i, pred in enumerate(predictions):
            if pred > threshold:
                risk_days.append(i + 1)
        
        return risk_days
```

### 2. 告警配置

#### 2.1 Prometheus告警规则
```yaml
# capacity-alerts.yml
groups:
  - name: capacity_alerts
    rules:
      - alert: HighCPUUtilization
        expr: cpu_utilization > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU utilization detected"
          description: "CPU utilization is {{ $value }}%"
          
      - alert: HighMemoryUtilization
        expr: memory_utilization > 85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory utilization detected"
          description: "Memory utilization is {{ $value }}%"
          
      - alert: LowDiskSpace
        expr: disk_free / disk_size < 0.15
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Low disk space"
          description: "Only {{ $value | humanizePercentage }} disk space remaining"
          
      - alert: CapacityExhaustionRisk
        expr: predict_linear(disk_usage[7d], 7*24*3600) > disk_size
        for: 1h
        labels:
          severity: critical
        annotations:
          summary: "Disk capacity exhaustion predicted"
          description: "Disk is predicted to fill up within 7 days"
```

## 成本优化

### 1. 资源优化策略

#### 1.1 预留实例计算
```python
class CostOptimizer:
    def __init__(self, usage_data):
        self.usage_data = usage_data
    
    def calculate_reserved_instance_savings(self):
        """计算预留实例节省成本"""
        # 假设按需价格
        on_demand_price = 0.096  # 每小时美元
        
        # 预留实例价格
        reserved_price = 0.046  # 每小时美元
        
        # 计算节省
        hourly_savings = on_demand_price - reserved_price
        monthly_savings = hourly_savings * 24 * 30
        
        # 计算覆盖率
        utilization_rate = 0.75  # 75%时间运行
        
        return {
            'hourly_savings': hourly_savings,
            'monthly_savings': monthly_savings,
            'annual_savings': monthly_savings * 12,
            'break_even_months': 8,  # 预留实例投资回收期
            'recommended_coverage': utilization_rate
        }
    
    def right_sizing_recommendation(self):
        """实例规格优化建议"""
        recommendations = []
        
        for instance in self.usage_data:
            avg_cpu = instance['avg_cpu']
            max_cpu = instance['max_cpu']
            avg_memory = instance['avg_memory']
            max_memory = instance['max_memory']
            
            # 根据使用率推荐规格
            if avg_cpu < 20 and max_cpu < 50:
                recommendations.append({
                    'instance': instance['name'],
                    'current_type': instance['type'],
                    'recommended_type': 'smaller_instance',
                    'estimated_savings': 0.3
                })
                
        return recommendations
```

### 2. 成本监控仪表板

#### 2.1 Grafana配置
```yaml
# grafana-dashboard.json
dashboard:
  title: "容量成本监控"
  panels:
    - title: "月度成本趋势"
      type: "graph"
      targets:
        - expr: "sum(aws_ec2_instance_cost)"
          
    - title: "资源利用率热力图"
      type: "heatmap"
      targets:
        - expr: "container_cpu_usage_seconds_total"
          
    - title: "容量预测"
      type: "graph"
      targets:
        - expr: "predict_linear(disk_usage[7d], 7*24*3600)"
          
    - title: "成本优化建议"
      type: "table"
      targets:
        - expr: "right_sizing_recommendations"
```

## 容量规划工具

### 1. 容量计算器

#### 1.1 Web应用容量计算器
```python
class WebCapacityCalculator:
    def __init__(self):
        self.baseline_metrics = {
            'request_per_second_per_core': 1000,
            'memory_per_1000_rps_gb': 4,
            'concurrent_users_per_core': 100,
            'bandwidth_per_user_kbps': 100
        }
    
    def calculate_capacity(self, user_projections):
        """计算Web应用容量需求"""
        results = []
        
        for projection in user_projections:
            users = projection['users']
            
            # 计算各项需求
            cpu_cores = max(2, int(users / self.baseline_metrics['concurrent_users_per_core']))
            memory_gb = max(4, int(users * self.baseline_metrics['memory_per_1000_rps_gb'] / 1000))
            bandwidth_mbps = int(users * self.baseline_metrics['bandwidth_per_user_kbps'] / 1000)
            
            # 考虑峰值
            peak_multiplier = 3.0
            peak_cpu = int(cpu_cores * peak_multiplier)
            peak_memory = int(memory_gb * peak_multiplier)
            peak_bandwidth = int(bandwidth_mbps * peak_multiplier)
            
            results.append({
                'period': projection['period'],
                'users': users,
                'cpu_cores': cpu_cores,
                'memory_gb': memory_gb,
                'bandwidth_mbps': bandwidth_mbps,
                'peak_cpu_cores': peak_cpu,
                'peak_memory_gb': peak_memory,
                'peak_bandwidth_mbps': peak_bandwidth
            })
        
        return results
```

### 2. 容量规划报告模板

#### 2.1 容量规划报告
```markdown
# 容量规划报告 - {{REPORT_DATE}}

## 执行摘要
基于未来12个月的业务增长预测，当前基础设施需要扩容以支持预计的用户增长。

## 需求分析
### 用户增长预测
- 当前用户数：{{CURRENT_USERS}}
- 12个月后：{{PROJECTED_USERS}}
- 月增长率：{{GROWTH_RATE}}%

### 业务活动
- 常规峰值：{{PEAK_MULTIPLIER}}倍
- 特殊活动：{{SPECIAL_EVENT_MULTIPLIER}}倍
- 年度大促：{{BIG_EVENT_MULTIPLIER}}倍

## 容量需求

### 计算资源
| 资源类型 | 当前需求 | 12个月需求 | 峰值需求 | 建议配置 |
|----------|----------|------------|----------|----------|
| CPU核心 | {{CURRENT_CPU}} | {{FUTURE_CPU}} | {{PEAK_CPU}} | {{RECOMMENDED_CPU}} |
| 内存GB | {{CURRENT_MEMORY}} | {{FUTURE_MEMORY}} | {{PEAK_MEMORY}} | {{RECOMMENDED_MEMORY}} |

### 存储资源
| 资源类型 | 当前容量 | 12个月容量 | 增长率 | 建议配置 |
|----------|----------|------------|--------|----------|
| 数据库存储 | {{CURRENT_DB}}GB | {{FUTURE_DB}}GB | {{DB_GROWTH_RATE}}% | {{RECOMMENDED_DB}}GB |
| 文件存储 | {{CURRENT_FILE}}GB | {{FUTURE_FILE}}GB | {{FILE_GROWTH_RATE}}% | {{RECOMMENDED_FILE}}GB |

### 网络资源
| 资源类型 | 当前带宽 | 12个月带宽 | 峰值带宽 | 建议配置 |
|----------|----------|------------|----------|----------|
| 总带宽 | {{CURRENT_BW}}Mbps | {{FUTURE_BW}}Mbps | {{PEAK_BW}}Mbps | {{RECOMMENDED_BW}}Mbps |

## 成本分析
### 基础设施成本
- 当前月度成本：{{CURRENT_COST}}
- 预估12个月后：{{FUTURE_COST}}
- 年度增长：{{ANNUAL_GROWTH}}

### 优化建议
1. **预留实例**：可节省{{RESERVED_SAVINGS}}%
2. **自动扩缩容**：减少{{SCALING_SAVINGS}}%浪费
3. **资源优化**：节省{{OPTIMIZATION_SAVINGS}}%

## 实施计划
### 第一阶段（1-3个月）
- 部署自动扩缩容
- 优化资源配置
- 建立监控体系

### 第二阶段（4-6个月）
- 数据库分片准备
- 缓存架构升级
- CDN节点扩展

### 第三阶段（7-12个月）
- 微服务架构调整
- 新数据中心部署
- 容灾能力提升

## 风险评估
### 高风险
- 用户增长超预期50%以上
- 特殊活动流量远超预期

### 缓解措施
- 建立快速扩容机制
- 预留应急资源池
- 与云服务商签订弹性协议