import * as bootstrap from 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { Hash, LocalStorage, RefreshState } from '@web/state'

const GlobalStates = { Hash, LocalStorage }

/**
 * @web/bootstrap
 * 自包含的 Bootstrap 5.3 集成引擎
 */

const Bootstrap = {
    // 原始 Bootstrap 实例引用
    ...bootstrap,
/**
 * 绑定暗色模式
 * @param {Object} state NewState 对象 (如 LocalStorage)
 * @param {string} key 键名 (如 'darkMode')
 */
bindDarkMode: (state, key) => {
    if (typeof document === 'undefined') return
    const htmlNode = document.documentElement
    const updateTheme = (val) => {
        htmlNode.setAttribute('data-bs-theme', val ? 'dark' : 'light')
    }
    if (state && key) {
        state.__watch(key, updateTheme)
        updateTheme(state[key])
    }
},

/**
 * 动态配置主题变量
 * @param {Object} config { primary: '#6366f1', ... }
 */
config: (config = {}) => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'light', 'dark']

    colors.forEach(name => {
        const hex = config[name]
        if (hex) {
            root.style.setProperty(`--bs-${name}`, hex)
            const rgb = Bootstrap._hexToRgb(hex)
            if (rgb) root.style.setProperty(`--bs-${name}-rgb`, `${rgb.r}, ${rgb.g}, ${rgb.b}`)
        }
    })
},

    _hexToRgb: (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null
    }
}

export { Bootstrap }
export default Bootstrap
