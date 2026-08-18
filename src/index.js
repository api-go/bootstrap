import * as bootstrap from 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './button.css'
import { Hash, LocalStorage } from '@apigo.cc/state'

const GlobalStates = { Hash, LocalStorage }

/**
 * @apigo.cc/bootstrap
 * 自包含的 Bootstrap 5.3 集成引擎
 */

// 导出增强功能对象
export const Bootstrap = {
    config: (options = {}) => {
        if (typeof document === 'undefined') return
        const root = document.documentElement

        // 1. 处理颜色主题 (Colors)
        const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'light', 'dark']
        let cssPatch = ''
        
        colors.forEach(name => {
            const hex = options[name]
            if (hex) {
                root.style.setProperty(`--bs-${name}`, hex)
                const rgb = Bootstrap._hexToRgb(hex)
                if (rgb) {
                    const rgbStr = `${rgb.r}, ${rgb.g}, ${rgb.b}`
                    const hoverColor = Bootstrap._shadeColor(hex, 0.15)
                    const activeColor = Bootstrap._shadeColor(hex, 0.2)
                    root.style.setProperty(`--bs-${name}-rgb`, rgbStr)
                    
                    // 深度补丁：覆盖组件内部硬编码的变量和状态样式
                    cssPatch += `
                        .btn-${name} {
                            --bs-btn-bg: var(--bs-${name}) !important;
                            --bs-btn-border-color: var(--bs-${name}) !important;
                            --bs-btn-hover-bg: ${hoverColor} !important;
                            --bs-btn-hover-border-color: ${hoverColor} !important;
                            --bs-btn-active-bg: ${activeColor} !important;
                            --bs-btn-active-border-color: ${activeColor} !important;
                            --bs-btn-disabled-bg: var(--bs-${name}) !important;
                            --bs-btn-disabled-border-color: var(--bs-${name}) !important;
                        }
                        .btn-outline-${name} {
                            --bs-btn-color: var(--bs-${name}) !important;
                            --bs-btn-border-color: var(--bs-${name}) !important;
                            --bs-btn-hover-bg: var(--bs-${name}) !important;
                            --bs-btn-hover-border-color: var(--bs-${name}) !important;
                            --bs-btn-active-bg: ${activeColor} !important;
                            --bs-btn-active-border-color: ${activeColor} !important;
                            --bs-btn-disabled-color: var(--bs-${name}) !important;
                            --bs-btn-disabled-border-color: var(--bs-${name}) !important;
                        }
                        .bg-${name} { background-color: var(--bs-${name}) !important; }
                        .text-${name} { color: var(--bs-${name}) !important; }
                        .border-${name} { border-color: var(--bs-${name}) !important; }
                        .badge.bg-${name} { background-color: var(--bs-${name}) !important; }

                        /* 语义色链接按钮 */
                        .btn-link-${name},
                        .btn-link.btn-link-${name} {
                            --bs-btn-color: var(--bs-${name});
                            --bs-btn-hover-color: ${hoverColor};
                            --bs-btn-active-color: ${activeColor};
                            --bs-btn-disabled-color: var(--bs-${name});
                        }

                        /* 表单控件补丁 (Form Controls) */
                        .form-check-input:checked {
                            background-color: var(--bs-primary) !important;
                            border-color: var(--bs-primary) !important;
                        }
                        .form-check-input:focus {
                            border-color: var(--bs-primary) !important;
                            box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25) !important;
                        }
                        .form-switch .form-check-input:checked {
                            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e") !important;
                        }
                        .form-range::-webkit-slider-thumb { background: var(--bs-primary) !important; }
                        .form-range::-moz-range-thumb { background: var(--bs-primary) !important; }
                        .form-range::-webkit-slider-thumb:active { background-color: rgba(var(--bs-primary-rgb), 0.5) !important; }

                        /* 进度条与分页 (Progress & Pagination) */
                        .progress-bar { background-color: var(--bs-primary) !important; }
                        .page-link { color: var(--bs-primary); }
                        .active > .page-link, .page-link.active {
                            background-color: var(--bs-primary) !important;
                            border-color: var(--bs-primary) !important;
                        }

                        /* 导航与下拉菜单 (Nav & Dropdown) */
                        .nav {
                            --bs-nav-link-color: var(--bs-body-color) !important;
                            --bs-nav-link-hover-color: var(--bs-primary) !important;
                        }
                        .nav-pills {
                            --bs-nav-pills-link-active-bg: var(--bs-primary) !important;
                            --bs-nav-pills-link-active-color: #fff !important;
                        }
                        .dropdown-menu {
                            --bs-dropdown-link-active-bg: var(--bs-primary) !important;
                            --bs-dropdown-link-active-color: #fff !important;
                        }
                        .navbar-nav .nav-link.active,
                        .navbar-nav .nav-link.show {
                            color: var(--bs-primary) !important;
                        }

                        /* 列表组 (List Group) */
                        .list-group-item.active {
                            background-color: var(--bs-primary) !important;
                            border-color: var(--bs-primary) !important;
                        }
                    `
                }
            }
        })

		if (options.primary) {
			const rgb = Bootstrap._hexToRgb(options.primary)
			const hoverColor = Bootstrap._shadeColor(options.primary, 0.15)
			const activeColor = Bootstrap._shadeColor(options.primary, 0.2)
			root.style.setProperty('--bs-link-color', options.primary)
			root.style.setProperty('--bs-link-hover-color', hoverColor)
			if (rgb) root.style.setProperty('--bs-link-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`)
			cssPatch += `
				.btn-link {
					--bs-btn-color: var(--bs-primary) !important;
					--bs-btn-hover-color: ${hoverColor} !important;
					--bs-btn-active-color: ${activeColor} !important;
					--bs-btn-disabled-color: rgba(var(--bs-primary-rgb), .65) !important;
				}
			`
		}

        if (cssPatch) {
            let styleEl = document.getElementById('bs-config-patch')
            if (!styleEl) {
                styleEl = document.createElement('style')
                styleEl.id = 'bs-config-patch'
                document.head.appendChild(styleEl)
            }
            styleEl.innerHTML = cssPatch
        }

        // 2. 处理暗黑模式 (Dark Mode)
        let { bindDarkMode, darkMode } = options
        const updateTheme = (val) => {
            root.setAttribute('data-bs-theme', val ? 'dark' : 'light')
        }

        // 支持 [state, key] 简写
        if (Array.isArray(bindDarkMode)) {
            bindDarkMode = { state: bindDarkMode[0], key: bindDarkMode[1] }
        }

        if (bindDarkMode && bindDarkMode.state && bindDarkMode.key) {
            const { state, key } = bindDarkMode
            if (state.__watch) {
                state.__watch(key, updateTheme)
                updateTheme(state[key])
            }
        } else if (darkMode !== undefined) {
            updateTheme(darkMode)
        }
    },
    _hexToRgb: (hex) => {
        let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null
    },
    _shadeColor: (hex, amount) => {
        const rgb = Bootstrap._hexToRgb(hex)
        if (!rgb) return hex
        const shade = (value) => Math.round(value * (1 - amount)).toString(16).padStart(2, '0')
        return `#${shade(rgb.r)}${shade(rgb.g)}${shade(rgb.b)}`
    }
}

// 挂载到全局
if (typeof globalThis !== 'undefined') {
    // 小写变量保持为纯原生或接近原生的引用，供 AI 舒适使用
    globalThis.bootstrap = bootstrap;
    // 大写变量供需要我们额外增强能力的场景使用
    globalThis.Bootstrap = Bootstrap;
}

export default Bootstrap;
