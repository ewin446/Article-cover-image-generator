/**
 * 名字数据管理器 - 方案A：数据分离 + 懒加载
 * 
 * 核心功能：
 * 1. 数据分离：名字数据存储在独立JSON文件中
 * 2. 懒加载：按需加载数据，减少初始加载时间
 * 3. 缓存机制：避免重复加载相同数据
 * 4. 智能回退：加载失败时提供备用方案
 */

class NameDatabaseManager {
  constructor() {
    // 配置信息
    this.config = {
      supportedSurnames: ['李', '王', '张', '刘', '陈', '赵', '杨', '黄', '吴'],
      styles: ['classical', 'modern', 'poetic'],
      genders: ['girl', 'boy'],
      dataPath: './data/'
    };
    
    // 内存缓存
    this.cache = new Map();
    
    // 加载状态追踪
    this.loadingPromises = new Map();
    
    // 统计信息
    this.stats = {
      totalRequests: 0,
      cacheHits: 0,
      networkRequests: 0,
      errors: 0
    };
    
    // 初始化
    this.init();
  }
  
  /**
   * 初始化管理器
   */
  init() {
    console.log('NameDatabaseManager 初始化开始...');
    // 不在初始化时自动预加载，避免阻塞页面加载
    console.log('NameDatabaseManager 初始化完成');
    this.initCacheCleanup();
  }
  
  /**
   * 预加载常用数据
   */
  async preloadCommonData() {
    // 预加载李姓的男女数据作为默认数据
    try {
      await this.loadSurnameData('李', 'girl');
      await this.loadSurnameData('李', 'boy');
    } catch (error) {
      console.warn('预加载数据失败:', error);
    }
  }
  
  /**
   * 初始化缓存清理机制
   */
  initCacheCleanup() {
    // 每小时清理一次过期缓存
    setInterval(() => {
      this.cleanupCache();
    }, 3600000); // 1小时
  }
  
  /**
   * 清理缓存
   */
  cleanupCache() {
    const now = Date.now();
    const maxAge = 1800000; // 30分钟
    
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > maxAge) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * 加载姓氏数据（带缓存）
   * @param {string} surname - 姓氏
   * @param {string} gender - 性别 (girl/boy)
   * @returns {Promise<Object>} 名字数据对象
   */
  async loadSurnameData(surname, gender) {
    const cacheKey = `${surname}_${gender}`;
    
    // 更新统计信息
    this.stats.totalRequests++;
    
    // 检查缓存
    if (this.cache.has(cacheKey)) {
      this.stats.cacheHits++;
      return this.cache.get(cacheKey).data;
    }
    
    // 检查是否正在加载
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey);
    }
    
    // 开始加载
    const loadPromise = this.fetchDataFromNetwork(surname, gender, cacheKey);
    this.loadingPromises.set(cacheKey, loadPromise);
    
    try {
      const data = await loadPromise;
      return data;
    } finally {
      this.loadingPromises.delete(cacheKey);
    }
  }
  
  /**
   * 从网络获取数据
   * @param {string} surname - 姓氏
   * @param {string} gender - 性别
   * @param {string} cacheKey - 缓存键
   * @returns {Promise<Object>} 名字数据
   */
  async fetchDataFromNetwork(surname, gender, cacheKey) {
    try {
      this.stats.networkRequests++;
      
      const genderDir = gender === 'girl' ? 'girls' : 'boys';
      const url = `${this.config.dataPath}${genderDir}/${surname}.json`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // 存入缓存
      this.cache.set(cacheKey, {
        data: data,
        timestamp: Date.now()
      });
      
      return data;
      
    } catch (error) {
      this.stats.errors++;
      console.error(`加载${surname}姓${gender}性名字数据失败:`, error);
      
      // 返回备用数据
      return this.getFallbackData(surname, gender);
    }
  }
  
  /**
   * 获取备用数据
   * @param {string} surname - 姓氏
   * @param {string} gender - 性别
   * @returns {Object} 备用数据
   */
  getFallbackData(surname, gender) {
    // 使用李姓数据作为备用
    const fallbackSurname = '李';
    const fallbackKey = `${fallbackSurname}_${gender}`;
    
    if (this.cache.has(fallbackKey)) {
      console.warn(`使用${fallbackSurname}姓作为${surname}姓的备用数据`);
      return this.cache.get(fallbackKey).data;
    }
    
    // 如果连备用数据都没有，返回空数据结构
    return {
      classical: [],
      modern: [],
      poetic: []
    };
  }
  
  /**
   * 获取名字列表
   * @param {string} surname - 姓氏
   * @param {string} gender - 性别 (girl/boy)
   * @param {string} style - 风格 (classical/modern/poetic)
   * @param {number} count - 数量
   * @returns {Promise<Array>} 名字列表
   */
  async getNames(surname, gender, style, count = 10) {
    // 参数验证和容错处理
    if (!surname || !gender || !style) {
      console.warn('缺少必要参数:', { surname, gender, style });
      return [];
    }
    
    // 容错：如果不支持的姓氏，尝试使用李姓作为备用
    let targetSurname = surname;
    if (!this.config.supportedSurnames.includes(surname)) {
      console.warn(`不支持的姓氏: ${surname}，使用李姓作为备用`);
      targetSurname = '李';
    }
    
    // 性别参数标准化
    const normalizedGender = (gender === 'girl' || gender === 'boy') ? gender : 'girl';
    if (gender !== normalizedGender) {
      console.warn(`性别参数标准化: ${gender} -> ${normalizedGender}`);
    }
    
    // 风格参数标准化
    const normalizedStyle = (style === 'classical' || style === 'modern' || style === 'poetic') ? style : 'modern';
    if (style !== normalizedStyle) {
      console.warn(`风格参数标准化: ${style} -> ${normalizedStyle}`);
    }
    
    // 加载数据
    const data = await this.loadSurnameData(targetSurname, normalizedGender);
    
    // 检查数据是否有效
    if (!data || !data[normalizedStyle] || data[normalizedStyle].length === 0) {
      console.warn(`数据为空或无效: ${targetSurname} ${normalizedGender} ${normalizedStyle}`);
      return [];
    }
    
    // 获取指定风格的名字
    const styleData = data[normalizedStyle] || [];
    
    // 确保有足够的数据
    const availableCount = Math.min(count, styleData.length);
    if (availableCount === 0) {
      console.warn(`没有找到${targetSurname}姓${normalizedGender}性${normalizedStyle}风格的名字`);
      return [];
    }
    
    // 随机选择指定数量的名字
    const selectedNames = this.shuffleArray([...styleData]).slice(0, availableCount);
    
    // 为每个名字添加姓氏，确保使用原始请求的姓氏
    return selectedNames.map(name => ({
      ...name,
      fullName: surname + name.name
    }));
  }
  
  /**
   * 按五行筛选名字
   * @param {string} surname - 姓氏
   * @param {string} gender - 性别
   * @param {string} style - 风格
   * @param {string} element - 五行元素
   * @param {number} count - 数量
   * @returns {Promise<Array>} 筛选后的名字列表
   */
  async getNamesByElement(surname, gender, style, element, count = 10) {
    const allNames = await this.getNames(surname, gender, style, count * 3);
    
    const filteredNames = allNames.filter(name => name.element === element);
    
    return this.shuffleArray(filteredNames).slice(0, count);
  }
  
  /**
   * 搜索名字
   * @param {string} query - 搜索关键词
   * @param {Object} options - 搜索选项
   * @returns {Promise<Array>} 搜索结果
   */
  async searchNames(query, options = {}) {
    const { surname, gender, style, limit = 20 } = options;
    const results = [];
    
    const searchSurnames = surname ? [surname] : this.config.supportedSurnames;
    const searchGenders = gender ? [gender] : this.config.genders;
    const searchStyles = style ? [style] : this.config.styles;
    
    for (const s of searchSurnames) {
      for (const g of searchGenders) {
        for (const st of searchStyles) {
          const data = await this.loadSurnameData(s, g);
          const names = data[st] || [];
          
          const matchedNames = names.filter(name => 
            name.name.includes(query) || 
            name.pinyin.includes(query.toLowerCase()) ||
            name.meaning.includes(query)
          ).map(name => ({
            ...name,
            fullName: s + name.name,
            surname: s,
            gender: g,
            style: st
          }));
          
          results.push(...matchedNames);
        }
      }
    }
    
    return results.slice(0, limit);
  }
  
  /**
   * 获取统计信息
   * @returns {Object} 统计信息
   */
  getStats() {
    return {
      ...this.stats,
      cacheSize: this.cache.size,
      cacheHitRate: this.stats.totalRequests > 0 
        ? ((this.stats.cacheHits / this.stats.totalRequests) * 100).toFixed(2) + '%'
        : '0%'
    };
  }
  
  /**
   * 清空缓存
   */
  clearCache() {
    this.cache.clear();
    this.stats = {
      totalRequests: 0,
      cacheHits: 0,
      networkRequests: 0,
      errors: 0
    };
  }
  
  /**
   * 预加载指定姓氏数据
   * @param {string} surname - 姓氏
   */
  async preloadSurname(surname) {
    if (!this.config.supportedSurnames.includes(surname)) {
      console.warn(`不支持的姓氏: ${surname}`);
      return false;
    }
    
    try {
      await Promise.all([
        this.loadSurnameData(surname, 'girl'),
        this.loadSurnameData(surname, 'boy')
      ]);
      return true;
    } catch (error) {
      console.error(`预加载${surname}姓数据失败:`, error);
      return false;
    }
  }
  
  /**
   * 随机打乱数组
   * @param {Array} array - 要打乱的数组
   * @returns {Array} 打乱后的数组
   */
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  /**
   * 检查数据是否可用
   * @param {string} surname - 姓氏
   * @param {string} gender - 性别
   * @returns {Promise<boolean>} 是否可用
   */
  async isDataAvailable(surname, gender) {
    try {
      const data = await this.loadSurnameData(surname, gender);
      return Object.keys(data).some(style => data[style] && data[style].length > 0);
    } catch (error) {
      return false;
    }
  }
  
  /**
   * 获取支持的姓氏列表
   * @returns {Array<string>} 姓氏列表
   */
  getSupportedSurnames() {
    return [...this.config.supportedSurnames];
  }
  
  /**
   * 获取支持的风格列表
   * @returns {Array<string>} 风格列表
   */
  getSupportedStyles() {
    return [...this.config.styles];
  }
}

// 创建全局实例
const nameDatabaseManager = new NameDatabaseManager();

// 导出（如果使用模块化）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NameDatabaseManager, nameDatabaseManager };
}