# @apigo.cc/bootstrap API 手册 (AI Optimized)

Bootstrap 5.3 自包含集成引擎。

## 0. 快速开始 (Quick Start)
直接在 HTML 中引入（无需打包）：
```html
<script src="https://cdn.jsdelivr.net/npm/@apigo.cc/bootstrap@1.0.5/dist/bootstrap.min.js"></script>
```

## 1. 运行时接口
- **`bootstrap`**: (Object) 官方原生 Bootstrap 镜像。
- **`Bootstrap`**: (Object) 增强控制接口。

## 2. API 参考

### `Bootstrap.config(options)`
统一配置入口。未定义的 key 将被忽略。

#### 参数 `options`:
- **主题色**: `primary`, `secondary`, `success`, `info`, `warning`, `danger`, `light`, `dark` (Hex 字符串)。
  - *行为*: 自动更新 CSS 变量并注入深度样式补丁（覆盖按钮、表单控件、开关、进度条等硬编码样式）。
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
```

## 3. 核心机制 (Internal)
- **运行时样式补丁**: `Bootstrap.config` 动态更新 `id="bs-config-patch"` 的 `<style>` 标签。通过 `!important` 覆盖 Bootstrap 内部硬编码的组件颜色（如 `.btn`, `.form-switch`, `.form-range`, `.progress-bar`, `.list-group-item` 等）。
- **零构建支持**: 无需 Sass 重新编译，在纯 ESM 环境下即可实现全量主题定制。
