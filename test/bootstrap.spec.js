import { test, expect } from '@playwright/test';

test('bootstrap self-contained integration', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    await page.goto('/test/index.html');

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

    // 5. 主色按钮保留 hover / active 层级，链接按钮支持语义色
    const buttonColors = await page.evaluate(() => {
        const primary = document.createElement('button')
        primary.className = 'btn btn-primary'
        document.body.appendChild(primary)

        const link = document.createElement('button')
        link.className = 'btn btn-link-primary'
        document.body.appendChild(link)

        const defaultLink = document.createElement('button')
        defaultLink.className = 'btn btn-link'
        document.body.appendChild(defaultLink)

        const outline = document.createElement('button')
        outline.className = 'btn btn-outline-primary'
        document.body.appendChild(outline)

        const primaryStyle = getComputedStyle(primary)
        const linkStyle = getComputedStyle(link)
        const outlineStyle = getComputedStyle(outline)
        const result = {
            base: primaryStyle.getPropertyValue('--bs-btn-bg').trim(),
            hover: primaryStyle.getPropertyValue('--bs-btn-hover-bg').trim(),
            link: linkStyle.getPropertyValue('--bs-btn-color').trim(),
            linkHover: linkStyle.getPropertyValue('--bs-btn-hover-color').trim(),
            defaultLink: getComputedStyle(defaultLink).getPropertyValue('--bs-btn-color').trim(),
            rootLink: getComputedStyle(document.documentElement).getPropertyValue('--bs-link-color').trim(),
            outline: outlineStyle.getPropertyValue('--bs-btn-color').trim(),
            outlineBorder: outlineStyle.getPropertyValue('--bs-btn-border-color').trim(),
            outlineHover: outlineStyle.getPropertyValue('--bs-btn-hover-bg').trim(),
            outlineActive: outlineStyle.getPropertyValue('--bs-btn-active-bg').trim()
        }
        primary.remove()
        link.remove()
        defaultLink.remove()
        outline.remove()
        return result
    })
    expect(buttonColors.base).toBe('#ff0000')
    expect(buttonColors.hover).toBe('#d90000')
    expect(buttonColors.hover).not.toBe(buttonColors.base)
    expect(buttonColors.link).toBe('#ff0000')
    expect(buttonColors.linkHover).toBe('#d90000')
    expect(buttonColors.defaultLink).toBe('#ff0000')
    expect(buttonColors.rootLink).toBe('#ff0000')
    expect(buttonColors.outline).toBe('#ff0000')
    expect(buttonColors.outlineBorder).toBe('#ff0000')
    expect(buttonColors.outlineHover).toBe('#ff0000')
    expect(buttonColors.outlineActive).toBe('#cc0000')
});
