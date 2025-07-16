// src/types/database.js
// 数据库类型定义文件 - 使用JSDoc注释提供类型支持

/**
 * @typedef {Object} Profile
 * @property {string} id - 用户ID (UUID)
 * @property {string} email - 邮箱地址
 * @property {string} full_name - 全名
 * @property {string} [display_name] - 显示名称
 * @property {string} [avatar_url] - 头像URL
 * @property {string} [bio] - 个人简介
 * @property {string} [phone] - 电话号码
 * @property {string} [location] - 所在地区
 * @property {string[]} [interests] - 兴趣标签
 * @property {number} [total_activities] - 参与活动总数
 * @property {number} [total_distance] - 总徒步距离(米)
 * @property {number} [total_elevation] - 总爬升高度(米)
 * @property {string} [role] - 用户角色 (user, admin, organizer)
 * @property {boolean} [email_verified] - 邮箱是否验证
 * @property {string} [created_at] - 创建时间 (ISO 8601)
 * @property {string} [updated_at] - 更新时间 (ISO 8601)
 */

/**
 * @typedef {Object} Activity
 * @property {string} id - 活动ID (UUID)
 * @property {string} title - 活动标题
 * @property {string} description - 活动描述
 * @property {string} [short_description] - 简短描述
 * @property {string} location - 活动地点
 * @property {Object} coordinates - 地理坐标
 * @property {number} coordinates.lat - 纬度
 * @property {number} coordinates.lng - 经度
 * @property {string} start_time - 开始时间 (ISO 8601)
 * @property {string} end_time - 结束时间 (ISO 8601)
 * @property {number} duration - 预计持续时间(分钟)
 * @property {number} distance - 徒步距离(米)
 * @property {number} elevation_gain - 爬升高度(米)
 * @property {number} max_participants - 最大参与人数
 * @property {number} current_participants - 当前参与人数
 * @property {string} difficulty - 难度等级 (easy, moderate, hard, expert)
 * @property {string[]} [tags] - 活动标签
 * @property {string[]} [equipment] - 所需装备
 * @property {string} [meeting_point] - 集合地点
 * @property {string} organizer_id - 组织者ID
 * @property {Object} organizer - 组织者信息
 * @property {string} organizer.name - 组织者姓名
 * @property {string} organizer.avatar_url - 组织者头像
 * @property {string} status - 活动状态 (draft, published, cancelled, completed)
 * @property {string[]} [images] - 活动图片URLs
 * @property {string} [cover_image] - 封面图片URL
 * @property {number} [rating] - 平均评分
 * @property {number} [review_count] - 评价数量
 * @property {string} [weather_info] - 天气信息
 * @property {string} [notes] - 注意事项
 * @property {string} created_at - 创建时间 (ISO 8601)
 * @property {string} updated_at - 更新时间 (ISO 8601)
 */

/**
 * @typedef {Object} Registration
 * @property {string} id - 报名ID (UUID)
 * @property {string} user_id - 用户ID
 * @property {string} activity_id - 活动ID
 * @property {Object} user - 用户信息
 * @property {string} user.full_name - 用户名
 * @property {string} user.email - 邮箱
 * @property {string} user.phone - 电话
 * @property {string} user.avatar_url - 头像
 * @property {string} status - 报名状态 (pending, confirmed, cancelled, completed)
 * @property {string} [notes] - 备注信息
 * @property {number} [emergency_contact] - 紧急联系人
 * @property {string} [dietary_restrictions] - 饮食限制
 * @property {string} [medical_info] - 医疗信息
 * @property {string} [experience_level] - 经验水平 (beginner, intermediate, advanced)
 * @property {string} registered_at - 报名时间 (ISO 8601)
 * @property {string} [confirmed_at] - 确认时间 (ISO 8601)
 * @property {boolean} [attended] - 是否实际参加
 */

/**
 * @typedef {Object} Comment
 * @property {string} id - 评论ID (UUID)
 * @property {string} activity_id - 活动ID
 * @property {string} user_id - 用户ID
 * @property {Object} user - 用户信息
 * @property {string} user.full_name - 用户名
 * @property {string} user.avatar_url - 头像URL
 * @property {string} content - 评论内容
 * @property {number} [rating] - 评分 (1-5)
 * @property {string[]} [images] - 评论图片
 * @property {string} [parent_id] - 父评论ID (用于回复)
 * @property {Object[]} [replies] - 回复列表
 * @property {string} created_at - 创建时间 (ISO 8601)
 * @property {string} updated_at - 更新时间 (ISO 8601)
 */

/**
 * @typedef {Object} Photo
 * @property {string} id - 照片ID (UUID)
 * @property {string} activity_id - 活动ID
 * @property {string} user_id - 用户ID
 * @property {Object} user - 用户信息
 * @property {string} user.full_name - 用户名
 * @property {string} user.avatar_url - 头像URL
 * @property {string} url - 照片URL
 * @property {string} [thumbnail_url] - 缩略图URL
 * @property {string} [caption] - 照片说明
 * @property {string[]} [tags] - 标签
 * @property {boolean} [is_cover] - 是否为封面
 * @property {number} [file_size] - 文件大小
 * @property {number} [width] - 宽度
 * @property {number} [height] - 高度
 * @property {string} created_at - 上传时间 (ISO 8601)
 */

/**
 * @typedef {Object} Notification
 * @property {string} id - 通知ID (UUID)
 * @property {string} user_id - 接收用户ID
 * @property {string} type - 通知类型 (activity_update, registration_status, new_comment, system)
 * @property {string} title - 通知标题
 * @property {string} content - 通知内容
 * @property {Object} [metadata] - 额外元数据
 * @property {boolean} is_read - 是否已读
 * @property {string} created_at - 创建时间 (ISO 8601)
 * @property {string} [read_at] - 阅读时间 (ISO 8601)
 */

/**
 * @typedef {Object} PaginationOptions
 * @property {number} page - 页码 (从1开始)
 * @property {number} limit - 每页数量
 * @property {string} [orderBy] - 排序字段
 * @property {boolean} [ascending] - 是否升序
 */

/**
 * @typedef {Object} FilterOptions
 * @property {string} [search] - 搜索关键词
 * @property {string[]} [tags] - 标签过滤
 * @property {string} [difficulty] - 难度过滤
 * @property {string} [location] - 地点过滤
 * @property {string} [startDate] - 开始日期过滤
 * @property {string} [endDate] - 结束日期过滤
 * @property {number} [maxDistance] - 最大距离过滤
 * @property {number} [maxElevation] - 最大爬升过滤
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - 是否成功
 * @property {*} data - 返回数据
 * @property {string} [message] - 消息
 * @property {Object} [error] - 错误信息
 */

/**
 * @typedef {Object} DatabaseError
 * @property {string} code - 错误代码
 * @property {string} message - 错误消息
 * @property {string} [details] - 详细信息
 * @property {*} [hint] - 提示信息
 */

// 枚举类型
export const ACTIVITY_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
}

export const REGISTRATION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
}

export const DIFFICULTY_LEVEL = {
  EASY: 'easy',
  MODERATE: 'moderate',
  HARD: 'hard',
  EXPERT: 'expert'
}

export const NOTIFICATION_TYPE = {
  ACTIVITY_UPDATE: 'activity_update',
  REGISTRATION_STATUS: 'registration_status',
  NEW_COMMENT: 'new_comment',
  SYSTEM: 'system'
}

export const USER_ROLE = {
  USER: 'user',
  ORGANIZER: 'organizer',
  ADMIN: 'admin'
}