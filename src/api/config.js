/**
 * API接口配置
 */
export default {
  // 用户相关
  register: 'register', // 用户注册
  oauth: '/oauth/token', // 用户授权
  logout: 'logout', // 用户登出
  user: 'user', // 用户信息
  updateProfile: 'user/profile', // 更新用户资料
  
  // 聊天相关
  chat: 'chat', // 获取聊天记录
  send: 'sendMsg', // 发送消息
  markRead: 'message/read', // 标记消息已读
  deleteMessage: 'message/delete', // 删除消息
  
  // 联系人相关
  contacts: 'contacts', // 获取联系人列表
  addContact: 'contacts/add', // 添加联系人
  removeContact: 'contacts/remove', // 删除联系人
  blockContact: 'contacts/block', // 拉黑联系人
  unblockContact: 'contacts/unblock', // 取消拉黑
  
  // 翻译相关
  translate: 'translate', // 文本翻译
  translateHistory: 'translate/history', // 翻译历史
  supportedLanguages: 'translate/languages', // 支持的语言列表
  
  // 系统相关
  home: 'home', // 首页数据
  info: 'info', // 系统信息
  feedback: 'feedback', // 用户反馈
  version: 'version', // 版本检查
  
  // WebSocket相关
  updateCurrWin: 'updateCurrWin', // 更新当前窗口状态
  
  // 文件上传
  upload: 'upload', // 文件上传
  avatar: 'upload/avatar', // 头像上传
  
  // 设置相关
  settings: 'settings', // 获取设置
  updateSettings: 'settings/update' // 更新设置
}
