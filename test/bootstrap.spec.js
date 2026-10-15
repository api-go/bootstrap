import { test, expect } from '@playwright/test';

test('bootstrap self-contained integration', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    await page.goto('/test/index.html');

    // 1. 验证 CSS 是否注入（检查 .container 是否有 padding）
    const container = page.locator('.container-fluid');
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
    await page.evaluate(() => window.Bootstrap.config({ primary: '#ff0000' }));
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
            bodyColor: getComputedStyle(document.documentElement).getPropertyValue('--bs-body-color').trim(),
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
    expect(buttonColors.defaultLink).toBe(buttonColors.bodyColor)
    expect(buttonColors.defaultLink).not.toBe(buttonColors.base)
    expect(buttonColors.rootLink).toBe('#ff0000')
    expect(buttonColors.outline).toBe('#ff0000')
    expect(buttonColors.outlineBorder).toBe('#ff0000')
    expect(buttonColors.outlineHover).toBe('#ff0000')
    expect(buttonColors.outlineActive).toBe('#cc0000')

    await page.evaluate(() => window.Bootstrap.config({
        light: { bodySecondaryBg: '#eeeeee', bodyTertiaryBg: '#fafafa' },
        dark: { bodySecondaryBg: '#333333', bodyTertiaryBg: '#222222' },
        darkMode: false
    }))
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--bs-secondary-bg').trim())).toBe('#eeeeee')
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--bs-tertiary-bg-rgb').trim())).toBe('250, 250, 250')
    await page.evaluate(() => window.Bootstrap.config({ darkMode: true }))
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--bs-secondary-bg').trim())).toBe('#333333')
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--bs-tertiary-bg-rgb').trim())).toBe('34, 34, 34')
});

test('global density inherits while explicit Bootstrap sizes and groups win', async ({page}) => {
    await page.goto('/test/index.html')
    await page.evaluate(() => {
        const fixture=document.createElement('section')
        fixture.id='density-fixture'
        fixture.innerHTML='<button id="inherited" class="btn">Inherited</button><button id="density-icon" class="btn"><i class="bi bi-plus-lg"></i></button><input id="density-input" class="form-control"><button id="fixed" class="btn btn-lg">Fixed</button><div class="ui-default"><input id="local" class="form-control"></div><div class="input-group input-group-lg"><input id="group" class="form-control"></div>'
        document.body.append(fixture)
    })
    for(const [density,font] of [['ui-sm','14px'],['ui-lg','20px'],['ui-default','16px']]) {
        await page.evaluate(value => {document.body.className=value},density)
        await expect(page.locator('#inherited')).toHaveCSS('font-size',font)
        const geometry=await page.locator('#density-icon').evaluate(button=>{
            const b=button.getBoundingClientRect(),i=button.querySelector('i').getBoundingClientRect(),input=document.querySelector('#density-input').getBoundingClientRect();
            return {height:Math.abs(b.height-input.height),x:Math.abs(i.x+i.width/2-b.x-b.width/2),y:Math.abs(i.y+i.height/2-b.y-b.height/2)}
        })
        expect(geometry.height).toBeLessThanOrEqual(1)
        expect(geometry.x).toBeLessThanOrEqual(1)
        expect(geometry.y).toBeLessThanOrEqual(1)
        await expect(page.locator('#fixed')).toHaveCSS('font-size','20px')
        await expect(page.locator('#local')).toHaveCSS('font-size','16px')
        await expect(page.locator('#group')).toHaveCSS('font-size','20px')
    }
})
