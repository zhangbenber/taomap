import locale from './ar-SA'
export default key => locale[key] || `__${key}__`