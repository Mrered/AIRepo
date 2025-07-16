// src/utils/supabase-helpers.js
import { supabase, TABLES, BUCKETS } from '@/lib/supabase'
import { handleSupabaseError } from '@/lib/supabase'

/**
 * 通用的数据库查询工具函数
 */

/**
 * 获取分页数据
 * @param {string} table - 表名
 * @param {Object} options - 查询选项
 * @param {number} options.page - 页码
 * @param {number} options.limit - 每页数量
 * @param {string} [options.orderBy] - 排序字段
 * @param {boolean} [options.ascending=true] - 是否升序
 * @param {Object} [options.filters] - 过滤条件
 * @returns {Promise<Object>} 分页数据
 */
export async function getPaginatedData(table, options = {}) {
  const {
    page = 1,
    limit = 10,
    orderBy = 'created_at',
    ascending = false,
    filters = {}
  } = options

  try {
    let query = supabase
      .from(table)
      .select('*', { count: 'exact' })

    // 应用过滤条件
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          query = query.in(key, value)
        } else if (typeof value === 'object') {
          // 支持复杂的过滤条件
          Object.entries(value).forEach(([op, val]) => {
            query = query[key](op, val)
          })
        } else {
          query = query.eq(key, value)
        }
      }
    })

    // 应用分页和排序
    const from = (page - 1) * limit
    const to = from + limit - 1
    
    query = query
      .order(orderBy, { ascending })
      .range(from, to)

    const { data, error, count } = await query

    if (error) throw error

    return {
      data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    }
  } catch (error) {
    console.error(`获取分页数据失败 (${table}):`, error)
    throw new Error(handleSupabaseError(error))
  }
}

/**
 * 获取单条数据
 * @param {string} table - 表名
 * @param {string} id - 数据ID
 * @returns {Promise<Object>} 数据对象
 */
export async function getSingleData(table, id) {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error(`获取单条数据失败 (${table}, id: ${id}):`, error)
    throw new Error(handleSupabaseError(error))
  }
}

/**
 * 插入数据
 * @param {string} table - 表名
 * @param {Object} data - 要插入的数据
 * @returns {Promise<Object>} 插入的数据
 */
export async function insertData(table, data) {
  try {
    const { data: insertedData, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single()

    if (error) throw error
    return insertedData
  } catch (error) {
    console.error(`插入数据失败 (${table}):`, error)
    throw new Error(handleSupabaseError(error))
  }
}

/**
 * 更新数据
 * @param {string} table - 表名
 * @param {string} id - 数据ID
 * @param {Object} data - 要更新的数据
 * @returns {Promise<Object>} 更新后的数据
 */
export async function updateData(table, id, data) {
  try {
    const { data: updatedData, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return updatedData
  } catch (error) {
    console.error(`更新数据失败 (${table}, id: ${id}):`, error)
    throw new Error(handleSupabaseError(error))
  }
}

/**
 * 删除数据
 * @param {string} table - 表名
 * @param {string} id - 数据ID
 * @returns {Promise<Object>} 删除结果
 */
export async function deleteData(table, id) {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error(`删除数据失败 (${table}, id: ${id}):`, error)
    throw new Error(handleSupabaseError(error))
  }
}

/**
 * 上传文件到存储桶
 * @param {string} bucket - 存储桶名
 * @param {string} path - 文件路径
 * @param {File} file - 文件对象
 * @param {Object} [options] - 上传选项
 * @returns {Promise<Object>} 上传结果
 */
export async function uploadFile(bucket, path, file, options = {}) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        ...options
      })

    if (error) throw error

    // 获取公开URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return {
      path: data.path,
      url: publicUrl
    }
  } catch (error) {
    console.error(`上传文件失败 (${bucket}/${path}):`, error)
    throw new Error(handleSupabaseError(error))
  }
}

/**
 * 删除文件
 * @param {string} bucket - 存储桶名
 * @param {string|string[]} paths - 文件路径或路径数组
 * @returns {Promise<Object>} 删除结果
 */
export async function deleteFile(bucket, paths) {
  try {
    const filePaths = Array.isArray(paths) ? paths : [paths]
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove(filePaths)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error(`删除文件失败 (${bucket}):`, error)
    throw new Error(handleSupabaseError(error))
  }
}

/**
 * 获取用户个人资料
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} 用户资料
 */
export async function getUserProfile(userId) {
  try {
    const { data, error } = await supabase
      .from(TABLES.PROFILES)
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error(`获取用户资料失败:`, error)
    throw new Error(handleSupabaseError(error))
  }
}

/**
 * 更新用户个人资料
 * @param {string} userId - 用户ID
 * @param {Object} profile - 个人资料数据
 * @returns {Promise<Object>} 更新后的资料
 */
export async function updateUserProfile(userId, profile) {
  try {
    const { data, error } = await supabase
      .from(TABLES.PROFILES)
      .upsert({ id: userId, ...profile })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error(`更新用户资料失败:`, error)
    throw new Error(handleSupabaseError(error))
  }
}

/**
 * 获取活动列表（带过滤和分页）
 * @param {Object} options - 查询选项
 * @returns {Promise<Object>} 活动列表
 */
export async function getActivities(options = {}) {
  const {
    page = 1,
    limit = 10,
    search = '',
    tags = [],
    difficulty = '',
    location = '',
    startDate = '',
    endDate = '',
    status = 'published'
  } = options

  try {
    let query = supabase
      .from(TABLES.ACTIVITIES)
      .select(`
        *,
        organizer:profiles!organizer_id(id, full_name, avatar_url),
        registrations(count),
        comments(count)
      `, { count: 'exact' })
      .eq('status', status)

    // 搜索过滤
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // 标签过滤
    if (tags && tags.length > 0) {
      query = query.contains('tags', tags)
    }

    // 难度过滤
    if (difficulty) {
      query = query.eq('difficulty', difficulty)
    }

    // 地点过滤
    if (location) {
      query = query.ilike('location', `%${location}%`)
    }

    // 日期过滤
    if (startDate) {
      query = query.gte('start_time', startDate)
    }
    if (endDate) {
      query = query.lte('end_time', endDate)
    }

    // 分页和排序
    const from = (page - 1) * limit
    const to = from + limit - 1
    
    query = query
      .order('start_time', { ascending: true })
      .range(from, to)

    const { data, error, count } = await query

    if (error) throw error

    return {
      data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    }
  } catch (error) {
    console.error('获取活动列表失败:', error)
    throw new Error(handleSupabaseError(error))
  }
}

/**
 * 获取用户参与的活动
 * @param {string} userId - 用户ID
 * @param {Object} options - 查询选项
 * @returns {Promise<Object>} 活动列表
 */
export async function getUserActivities(userId, options = {}) {
  const { page = 1, limit = 10, status = 'confirmed' } = options

  try {
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabase
      .from(TABLES.REGISTRATIONS)
      .select(`
        *,
        activity:activities(*)
      `, { count: 'exact' })
      .eq('user_id', userId)
      .eq('status', status)
      .order('registered_at', { ascending: false })
      .range(from, to)

    if (error) throw error

    return {
      data: data.map(item => item.activity),
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    }
  } catch (error) {
    console.error('获取用户活动失败:', error)
    throw new Error(handleSupabaseError(error))
  }
}

/**
 * 报名参加活动
 * @param {string} userId - 用户ID
 * @param {string} activityId - 活动ID
 * @param {Object} [registrationData] - 额外报名信息
 * @returns {Promise<Object>} 报名结果
 */
export async function registerForActivity(userId, activityId, registrationData = {}) {
  try {
    const { data, error } = await supabase
      .from(TABLES.REGISTRATIONS)
      .insert({
        user_id: userId,
        activity_id: activityId,
        ...registrationData
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('报名活动失败:', error)
    throw new Error(handleSupabaseError(error))
  }
}

/**
 * 取消活动报名
 * @param {string} registrationId - 报名ID
 * @returns {Promise<Object>} 取消结果
 */
export async function cancelRegistration(registrationId) {
  try {
    const { data, error } = await supabase
      .from(TABLES.REGISTRATIONS)
      .update({ status: 'cancelled' })
      .eq('id', registrationId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('取消报名失败:', error)
    throw new Error(handleSupabaseError(error))
  }
}

/**
 * 获取活动评论
 * @param {string} activityId - 活动ID
 * @returns {Promise<Array>} 评论列表
 */
export async function getActivityComments(activityId) {
  try {
    const { data, error } = await supabase
      .from(TABLES.COMMENTS)
      .select(`
        *,
        user:profiles(id, full_name, avatar_url)
      `)
      .eq('activity_id', activityId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('获取活动评论失败:', error)
    throw new Error(handleSupabaseError(error))
  }
}

/**
 * 添加活动评论
 * @param {Object} comment - 评论数据
 * @returns {Promise<Object>} 评论结果
 */
export async function addComment(comment) {
  try {
    const { data, error } = await supabase
      .from(TABLES.COMMENTS)
      .insert(comment)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('添加评论失败:', error)
    throw new Error(handleSupabaseError(error))
  }
}

export default {
  getPaginatedData,
  getSingleData,
  insertData,
  updateData,
  deleteData,
  uploadFile,
  deleteFile,
  getUserProfile,
  updateUserProfile,
  getActivities,
  getUserActivities,
  registerForActivity,
  cancelRegistration,
  getActivityComments,
  addComment
}