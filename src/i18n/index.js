import locale from './zh-CN'
export default key => locale[key] || `__${key}__`