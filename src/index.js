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
     * 绑定暗色模式到 State 路径
     * @param {string|Object} stateOrPath 例如 'LocalStorage.darkMode' 或某个 NewState 对象
     * @param {string} [key] 如果第一个参数是对象，则需要指定 key
     */
    bindDarkMode: (stateOrPath, key) => {
        if (typeof document === 'undefined') return
        
        const htmlNode = document.documentElement
        const updateTheme = (val) => {
            const theme = val ? 'dark' : 'light'
            htmlNode.setAttribute('data-bs-theme', theme)
            htmlNode.setAttribute('$data-bs-theme', theme)
        }

        let state, finalKey;
        if (typeof stateOrPath === 'string') {
            const parts = stateOrPath.split('.')
            state = GlobalStates[parts[0]]
            finalKey = parts[1]
        } else {
            state = stateOrPath
            finalKey = key
        }

        if (!state || !finalKey) return console.warn('Bootstrap.bindDarkMode: Invalid state or key')

        // 监听状态变化
        state.__watch(finalKey, (val) => {
            updateTheme(val)
            RefreshState(htmlNode)
        })

        // 初始值同步
        updateTheme(state[finalKey])
    },

    /**
     * 动态配置主题
     * @param {Object} config { primary: '#6366f1', ... }
     */
    config: (config = {}) => {
        if (typeof document === 'undefined') return
        const root = document.documentElement
        
        if (config.primary) {
            root.style.setProperty('--bs-primary', config.primary)
            // 简单计算 RGB 供一些需要透明度的组件使用
            const rgb = Bootstrap._hexToRgb(config.primary)
            if (rgb) root.style.setProperty('--bs-primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`)
        }

        if (config.success) root.style.setProperty('--bs-success', config.success)
        if (config.danger) root.style.setProperty('--bs-danger', config.danger)
        // ... 其他颜色变量
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
