# @apigo.cc/bootstrap

`@apigo.cc/bootstrap` 是一个自包含的 Bootstrap 5.3 引擎集成模块。它内置了 Bootstrap 及其图标库（Bootstrap Icons），并提供了简单的主题配色与暗色模式绑定机制。

---

## 一、 集成方式

推荐使用 `@apigo.cc/loader` 自动调度：

```html
<script src="https://cdn.jsdelivr.net/npm/@apigo.cc/loader@1.0.0/dist/loader.min.js"></script>
<script>
    Loader.load('state:1.0.11', 'bootstrap:1.0.2');
</script>
```

---

## 二、 核心 API

### 1. 修改主题配色 (`Bootstrap.config`)

您可以通过调用 `Bootstrap.config(colors)` 方法动态修改 Bootstrap 的核心主题颜色。传入十六进制（Hex）值，方法会自动为您计算并设置相应的 CSS 变量以及 RGB 变量：

```javascript
import { Bootstrap } from '@apigo.cc/bootstrap';

// 动态修改 primary 和 danger 的配色
Bootstrap.config({
    primary: '#6366f1',
    danger: '#f43f5e'
});
```

### 2. 绑定暗色模式 (`Bootstrap.bindDarkMode`)

`Bootstrap.bindDarkMode(state, key)` 可以将响应式状态（如 `LocalStorage` 或您自定义的 `NewState`）的某个属性绑定为暗色模式的控制器。

当该属性发生变化时，它会自动在 `<html>` 标签上设置 `data-bs-theme="dark"` 或 `data-bs-theme="light"`，从而无缝切换 Bootstrap 5.3 的深色主题模式：

```javascript
import { LocalStorage } from '@apigo.cc/state';
import { Bootstrap } from '@apigo.cc/bootstrap';

// 绑定 LocalStorage.darkMode 状态
Bootstrap.bindDarkMode(LocalStorage, 'darkMode');

// 示例：切换为暗色模式
LocalStorage.darkMode = true;

// 示例：切换回亮色模式
LocalStorage.darkMode = false;
```

---

## 三、 使用原生 Bootstrap 实例

`@apigo.cc/bootstrap` 导出了原生的 Bootstrap 全量实例，您可以直接调用原生 Bootstrap 的组件方法（如 Modal, Popover 等）：

```javascript
import { Bootstrap } from '@apigo.cc/bootstrap';

// 使用原生的 Modal 组件
const myModal = new Bootstrap.Modal(document.getElementById('myModal'));
myModal.show();
```
