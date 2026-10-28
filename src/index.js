import * as bootstrap from 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './button.css'
import './density.css'
import './appearance.css'
import { Hash, LocalStorage } from '@apigo.cc/state'

const GlobalStates = { Hash, LocalStorage }

// 可直接用于 Bootstrap.config 的品牌主题方案。基础配置先应用，主题专属配置再覆盖。
export const BootstrapThemes = {
	steady: {
		primary: '#a855f7', secondary: '#57606a', success: '#1a7f37', info: '#8ecae6', warning: '#ffd166bd', danger: '#cf222e',
		light: { bodyBg: '#e5e7eb', bodyColor: '#202124', bodySecondaryBg: '#d1d5db', bodyTertiaryBg: '#f3f4f6', borderColor: '#9ca3af', warningBgSubtle: '#fff3cd', warningTextEmphasis: '#664d03' },
		dark: { bodyBg: '#202124', bodyColor: '#f1f3f4', bodyTertiaryBg: '#303134', bodySecondaryBg: '#17181a', borderColor: '#5f6368', warningBgSubtle: '#4d3b12', warningTextEmphasis: '#ffe69c' }
	},
	clean: {
		primary: '#a855f7', secondary: '#416181', success: '#5e754a', info: '#6ca8b8', warning: '#c9ad76', danger: '#bf616a',
		light: { bodyBg: '#ffffff', bodyColor: '#111111', bodySecondaryBg: '#f5f5f5', bodyTertiaryBg: '#ffffff', borderColor: '#d6d6d6' },
		dark: { bodyBg: '#050505', bodyColor: '#f5f5f5', bodyTertiaryBg: '#111111', bodySecondaryBg: '#333333', borderColor: '#3a3a3a' }
	},
	soft: {
		primary: '#a855f7', secondary: '#6c757d', success: '#43ad51', info: '#3794ff', warning: '#d29922', danger: '#f85149',
		light: { bodyBg: '#fffaf5', bodyColor: '#3d3028', bodySecondaryBg: '#f2e7df', bodyTertiaryBg: '#fff4eb', borderColor: '#d8c5b8', warningBgSubtle: '#fff1c7', warningTextEmphasis: '#664d03' },
		dark: { bodyBg: '#3f3f32', bodyColor: '#f7f7df', bodyTertiaryBg: '#50503f', bodySecondaryBg: '#2f2f24', borderColor: '#77775a', warningBgSubtle: '#5c501e', warningTextEmphasis: '#ffe69c' }
	},
	cool: {
		primary: '#a855f7', secondary: '#64748b', success: '#13a08f', info: '#38bdf8', warning: '#f59e0b', danger: '#f43f5e',
		light: { bodyBg: '#eef8f7', bodyColor: '#123c3b', bodySecondaryBg: '#d7eeeb', bodyTertiaryBg: '#f5fcfb', borderColor: '#afd4d0' },
		dark: { bodyBg: '#263238', bodyColor: '#eceff1', bodyTertiaryBg: '#37474f', bodySecondaryBg: '#455a64', borderColor: '#607d8b' }
	}
}

/**
 * @apigo.cc/bootstrap
 * 自包含的 Bootstrap 5.3 集成引擎
 */

// 导出增强功能对象
export const Bootstrap = {
	_activeTheme: null,
	observeDensity: (element, callback) => {
		let frame, previous;
		const update = () => {
			const css = getComputedStyle(element);
			const density = css.getPropertyValue('--ui-density').trim() || 'default';
			if (density !== previous) { previous = density; callback(density, css); }
		};
		const observer = new MutationObserver(() => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); });
		for (let node = element; node; node = node.parentElement) observer.observe(node, { attributes:true, attributeFilter:['class','style'] });
		update();
		return () => { observer.disconnect(); cancelAnimationFrame(frame); };
	},
	themes: BootstrapThemes,
	addTheme: (name, theme) => {
		if (!name || typeof name !== 'string' || !theme || typeof theme !== 'object') throw new TypeError('Theme name and theme object are required')
		BootstrapThemes[name] = Object.freeze({ ...theme, light: theme.light ? { ...theme.light } : undefined, dark: theme.dark ? { ...theme.dark } : undefined })
		return BootstrapThemes[name]
	},
	useTheme: (name, overrides = {}) => {
		const theme = BootstrapThemes[name]
		if (!theme) throw new Error(`Unknown Bootstrap theme: ${name}`)
		Bootstrap._activeTheme = { name, value: { ...theme, ...overrides, light: { ...theme.light, ...overrides.light }, dark: { ...theme.dark, ...overrides.dark } } }
		Bootstrap.config(Bootstrap._activeTheme.value)
		Bootstrap._applyActiveTheme()
	},
	_applyActiveTheme: () => {
		if (typeof document === 'undefined' || !Bootstrap._activeTheme) return
		const theme = Bootstrap._activeTheme.value
		const mode = document.documentElement.getAttribute('data-bs-theme') || 'light'
		const palette = { ...theme, ...(theme[mode] || {}) }
		const names = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'light', 'dark', 'bodyColor', 'bodyBg', 'bodySecondaryColor', 'bodySecondaryBg', 'bodyTertiaryColor', 'bodyTertiaryBg', 'bodyEmphasisColor', 'headingColor', 'borderColor', 'borderColorTranslucent', 'linkColor', 'linkHoverColor', 'secondaryBg', 'tertiaryBg', 'secondaryColor', 'tertiaryColor', 'emphasisColor']
		for (const color of ['primary', 'secondary', 'success', 'info', 'warning', 'danger']) names.push(`${color}BgSubtle`, `${color}TextEmphasis`, `${color}BorderSubtle`)
		const dark = document.documentElement.getAttribute('data-bs-theme') === 'dark'
		const mix = (hex, target, amount) => Bootstrap._mixColor(hex, target, amount)
		for (const color of ['primary', 'secondary', 'success', 'info', 'warning', 'danger']) {
			const base = palette[color]
			if (typeof base !== 'string') continue
			palette[`${color}BgSubtle`] ??= mix(base, palette.bodyBg || (dark ? '#000000' : '#ffffff'), dark ? 0.72 : 0.88)
			palette[`${color}TextEmphasis`] ??= mix(base, palette.bodyColor || (dark ? '#ffffff' : '#000000'), 0.55)
			palette[`${color}BorderSubtle`] ??= mix(base, dark ? '#ffffff' : '#000000', 0.3)
		}
		for (const name of names) {
			const value = palette[name] ?? palette[name.replaceAll(/[A-Z]/g, m => '-' + m.toLowerCase())]
			if (typeof value === 'string') {
				const cssName = name.replaceAll(/[A-Z]/g, m => '-' + m.toLowerCase())
				document.documentElement.style.setProperty(`--bs-${cssName}`, value)
				const rgb = Bootstrap._hexToRgb(value)
				if (rgb) document.documentElement.style.setProperty(`--bs-${cssName}-rgb`, `${rgb.r}, ${rgb.g}, ${rgb.b}`)
			}
		}
		const aliases = { tertiaryBg: 'bodyTertiaryBg', secondaryBg: 'bodySecondaryBg', tertiaryColor: 'bodyTertiaryColor', secondaryColor: 'bodySecondaryColor', emphasisColor: 'bodyEmphasisColor' }
		for (const [alias, source] of Object.entries(aliases)) {
			const value = palette[alias] ?? palette[source]
			if (typeof value === 'string') {
				const cssName = alias.replaceAll(/[A-Z]/g, m => '-' + m.toLowerCase())
				document.documentElement.style.setProperty(`--bs-${cssName}`, value)
				const rgb = Bootstrap._hexToRgb(value)
				if (rgb) document.documentElement.style.setProperty(`--bs-${cssName}-rgb`, `${rgb.r}, ${rgb.g}, ${rgb.b}`)
			}
		}
	},
	bindTheme: (state, key = 'theme') => {
		if (!state?.__watch) return
		const apply = value => {
			if (value && BootstrapThemes[value]) Bootstrap.useTheme(value)
		}
		state.__watch(key, apply)
		apply(state[key])
	},
	config: (options = {}) => {
		if (typeof document === 'undefined') return
		const root = document.documentElement

		// 1. 处理颜色主题。除基础色外，Bootstrap 5.3 的语义变量也可配置。
		const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'light', 'dark']
		const semantic = {
			'body-color': [],
			'body-bg': [],
			'body-secondary-color': ['secondary-color'],
			'body-secondary-bg': ['secondary-bg'],
			'body-tertiary-color': ['tertiary-color'],
			'body-tertiary-bg': ['tertiary-bg'],
			'body-emphasis-color': ['emphasis-color'],
			'heading-color': [],
			'border-color': [],
			'border-color-translucent': [],
			'link-color': [],
			'link-hover-color': []
		}
		let cssPatch = ''
		let themeVars = ''
		const applyPalette = (palette, selector = '') => {
			const vars = []
			const declarations = []
			const setVar = (name, value) => {
				if (selector) declarations.push(`--bs-${name}: ${value};`)
				else root.style.setProperty(`--bs-${name}`, value)
			}
			colors.forEach(name => {
				const hex = palette[name]
				if (typeof hex !== 'string' || !hex) return
				const rgb = Bootstrap._hexToRgb(hex)
				setVar(name, hex)
				if (rgb) setVar(`${name}-rgb`, `${rgb.r}, ${rgb.g}, ${rgb.b}`)
				const hoverColor = Bootstrap._shadeColor(hex, 0.15)
				const activeColor = Bootstrap._shadeColor(hex, 0.2)
				vars.push({ name, hex, hoverColor, activeColor })
			})
			Object.entries(semantic).forEach(([name, aliases]) => {
				const camelKey = name.replaceAll(/-([a-z])/g, (_, letter) => letter.toUpperCase())
				const value = palette[name] ?? palette[camelKey]
				if (typeof value !== 'string' || !value) return
				for (const target of [name, ...aliases]) {
					setVar(target, value)
					const rgb = Bootstrap._hexToRgb(value)
					if (rgb) setVar(`${target}-rgb`, `${rgb.r}, ${rgb.g}, ${rgb.b}`)
				}
			})
			if (palette.primary) {
				const hoverColor = Bootstrap._shadeColor(palette.primary, 0.15)
				setVar('link-color', palette['link-color'] || palette.linkColor || palette.primary)
				setVar('link-hover-color', palette['link-hover-color'] || palette.linkHoverColor || hoverColor)
			}
			if (selector) themeVars += `${selector}{${declarations.join('')}}`
			vars.forEach(({ name, hex, hoverColor, activeColor }) => {
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
			})
		}
		applyPalette(options)
		// light/dark 可分别提供完整或部分颜色；变量作用域由主题选择器隔离。
		if (options.light && typeof options.light === 'object') applyPalette(options.light, ':root[data-bs-theme="light"] ')
		if (options.dark && typeof options.dark === 'object') applyPalette(options.dark, ':root[data-bs-theme="dark"] ')
		cssPatch = themeVars + cssPatch

		if (options.bindTheme) {
			const binding = Array.isArray(options.bindTheme) ? { state: options.bindTheme[0], key: options.bindTheme[1] } : options.bindTheme
			if (binding?.state && binding?.key && binding.state.__watch) {
				const applyTheme = value => { if (value && BootstrapThemes[value]) Bootstrap.useTheme(value) }
				binding.state.__watch(binding.key, applyTheme)
				applyTheme(binding.state[binding.key])
			}
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
			Bootstrap._applyActiveTheme()
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
	},
	_mixColor: (hex, target, amount) => {
		const a = Bootstrap._hexToRgb(hex), b = Bootstrap._hexToRgb(target)
		if (!a || !b) return hex
		const mix = key => Math.round(a[key] + (b[key] - a[key]) * amount).toString(16).padStart(2, '0')
		return `#${mix('r')}${mix('g')}${mix('b')}`
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
