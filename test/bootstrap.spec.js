import { test, expect } from '@playwright/test';

test('bootstrap self-contained integration', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    await page.goto('http://127.0.0.1:8083/test/index.html');

    // 1. 验证 CSS 是否注入（检查 .container 是否有 padding）
    const container = page.locator('.container');
    const padding = await container.evaluate(el => window.getComputedStyle(el).padding);
    expect(padding).not.toBe('0px');

    // 2. 验证 Icon 是否显示（通过伪元素内容检查）
    const icon = page.locator('.bi-bootstrap-fill');
    const iconContent = await icon.evaluate(el => window.getComputedStyle(el, '::before').content);
    expect(iconContent).not.toBe('none');

    // 3. 验证暗色模式切换
    const html = page.locator('html');
    
    // 初始应为 light
    expect(await html.getAttribute('data-bs-theme')).toBe('light');

    // 点击切换
    await page.click('#toggle-btn');
    expect(await html.getAttribute('data-bs-theme')).toBe('dark');

    // 4. 验证主色修改
    await page.evaluate(() => window.setTheme('#ff0000'));
    const primaryColor = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--bs-primary'));
    expect(primaryColor.trim()).toBe('#ff0000');
});
