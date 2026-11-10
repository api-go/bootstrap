# @api-go/bootstrap API 手册 (AI Optimized)

Bootstrap 5.3 自包含集成引擎。

## 0. 快速开始 (Quick Start)
直接在 HTML 中引入（无需打包，完全非 ESM 注入）：
```html
<script src="https://cdn.jsdelivr.net/npm/@api-go/bootstrap@1.0.16/dist/bootstrap.min.js"></script>
```

## 1. 运行时接口
- **`bootstrap`**: (Object) 官方原生 Bootstrap 镜像。已挂载至 `globalThis.bootstrap`。
- **`Bootstrap`**: (Object) 增强控制接口。已挂载至 `globalThis.Bootstrap`。

*(注意：本库自 v1.0.6 起全面废弃 ESM 导出，改为纯全局注入模式。)*

## 2. API 参考

### `Bootstrap.config(options)`
统一配置入口。未定义的 key 将被忽略。

基础配置是可选的增量配置；`light` / `dark` 也是可选覆盖层，不需要同时提供。主题切换时，主题层覆盖基础层，未覆盖的值继续继承基础配置或 Bootstrap 默认值。

内置方案（均保持品牌主色 `#a855f7`）：`Bootstrap.themes.steady`、`clean`、`soft`、`cool`。这些方案都同时包含 light/dark 配置。使用 `Bootstrap.useTheme('steady')` 即时应用，也可传入第二个对象局部覆盖。可用 `Bootstrap.addTheme('my-theme', theme)` 注册自定义方案。

#### 参数 `options`:
- **主题色**: `primary`, `secondary`, `success`, `info`, `warning`, `danger`, `light`, `dark` (Hex 字符串)。
- **语义色**: `bodyColor`, `bodyBg`, `bodySecondaryColor`, `bodySecondaryBg`, `bodyTertiaryColor`, `bodyTertiaryBg`, `bodyEmphasisColor`, `headingColor`, `borderColor`, `borderColorTranslucent`, `linkColor`, `linkHoverColor`；也接受 Bootstrap 原生 kebab-case 名称。未指定的层级保留 Bootstrap 默认值。
- **主题专属配色**: `light: { ... }` 和 `dark: { ... }` 可分别覆盖同一组颜色，随 `darkMode` / `bindDarkMode` 即时生效。
  - *行为*: 自动更新 CSS 变量并注入深度样式补丁（覆盖实心与 outline 按钮、表单控件、开关、进度条等硬编码样式）。按钮保留明确的 hover / active 状态。
  - *链接与链接按钮*: `primary` 驱动普通链接和 `btn-link-primary`；默认 `btn-link` 使用中性色，`btn-link-info` 等语义色类分别跟随对应主题色，hover / active 会自动变深。
- **暗黑模式**:
  - `darkMode`: (Boolean) 直接设置主题。`true` 为 dark，`false` 为 light。
  - `bindDarkMode`: (Array) `[state, key]`。绑定响应式状态。
    - `state`: 具有 `__watch(key, callback)` 方法的状态对象。
    - `key`: 状态对象中的键名。

#### 示例 (Examples):
```javascript
// 1. 设置颜色与暗黑模式简写
Bootstrap.config({ 
    primary: '#a855f7', 
    bindDarkMode: [LocalStorage, 'isDark'] 
});

// 2. 手动模式
Bootstrap.config({ darkMode: true });

// 3. 仅更新单一颜色 (自动处理相关组件补丁)
Bootstrap.config({ success: '#22c55e' });

// 使用 VS Code 风格方案；只在深色模式额外覆盖背景
Bootstrap.useTheme('steady', { dark: { bodyBg: '#181818' } });

// 深浅色分别配置层级背景和正文色
Bootstrap.config({
    light: { primary: '#2563eb', bodyTertiaryBg: '#f8fafc' },
    dark: { primary: '#93c5fd', bodyBg: '#0f172a', bodyColor: '#e2e8f0' },
    darkMode: false
});
```

```html
<button class="btn btn-link-info">Info Link</button>
```

## 3. 核心机制 (Internal)

### 简洁外观与工具条

在容器添加 `ui-link`，按钮/分页使用链接外观，文本输入和单选下拉使用透明背景与底部下划线。输入组标签/图标透明、无边框，位于下划线之外。移除 class 即恢复原样，不重建控件，不影响绑定。支持与 `ui-sm` / `ui-lg` 独立组合。

焦点线使用主色，校验保留有效/无效颜色和原生图标，禁用/只读语义不变。复选框、单选框、range、文件/颜色输入和多行选择框保留专用原生 UI；卡片和表格结构边框独立。按钮链接默认无下划线，正文链接保留原样；分页当前项保留选中标识。

工具条用 `ui-toolbar px-2 px-sm-3`，flex 筛选表单用 `ui-toolbar-fields` 继承间距。有框模式增加呼吸空间，简洁模式更紧凑；尺寸随密度变化。只由一层容器负责内边距，避免重复叠加。

数字/实际值用 `text-body`，辅助说明与分隔符用 `text-body-tertiary`，辅助操作用 `text-body-secondary`，主要动作和校验保留语义强调。

```html
<section class="ui-sm ui-link">
  <div class="ui-toolbar d-flex align-items-center px-2 px-sm-3">
    <div class="input-group"><span class="input-group-text">Status</span><select class="form-select" aria-label="Status"><option>All</option><option>Open</option></select></div>
    <button class="btn btn-primary">Search</button>
  </div>
</section>
```

### 全局密度

在 `html` 或 `body` 上设置 `class="ui-sm"` / `class="ui-lg"`；不设置则保持 BS5 默认大小。局部区域可以使用 `ui-default`、`ui-sm` 或 `ui-lg` 覆盖继承，每个元素只设置一个密度类。切换 class 即时生效，无需遍历控件、重写 class 或重建表单。

普通 `.btn`、`.form-control`、`.form-select`、输入组文本、列表组、导航、菜单、表格和模态框使用继承尺寸。显式 `btn-sm/lg`、`form-control-sm/lg`、`form-select-sm/lg`、`btn-group-sm/lg`、`input-group-sm/lg` 优先；显式 `p-*`、`gap-*` 等工具类不受影响。密度不会缩放根字号，也不代表屏幕断点。

公共组件可消费 `--ui-region-space`、`--ui-tool-space`、`--ui-gap`、`--ui-field-gap`、`--ui-column-gap`、`--ui-item-font`、`--ui-list-row`、`--ui-grid-row` 等继承变量。虚拟滚动等几何缓存使用 `Bootstrap.observeDensity(element, (density, computedStyle) => ...)`，返回解除监听函数；组件销毁时必须调用它。此监听只用于实际密度变更，普通视觉样式由 CSS 完成。

```html
<body class="ui-sm">
  <button class="btn btn-primary">继承小尺寸</button>
  <button class="btn btn-primary btn-lg">显式大尺寸</button>
  <section class="ui-default"><input class="form-control"></section>
</body>
```

- **运行时样式补丁**: `Bootstrap.config` 动态更新 `id="bs-config-patch"` 的 `<style>` 标签。通过 `!important` 覆盖 Bootstrap 内部硬编码的组件颜色（如 `.btn`, `.form-switch`, `.form-range`, `.progress-bar`, `.list-group-item`, `.nav-pills`, `.dropdown-menu`, `.navbar-nav .nav-link.active` 等）。
- **零构建支持**: 无需 Sass 重新编译，在纯 ESM 环境下即可实现全量主题定制。
