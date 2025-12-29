document.addEventListener('DOMContentLoaded', () => {
    // ===============================================
    // 1. Theme Toggle Logic (主题切换与按钮状态)
    // ===============================================
    const toggleBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // 绑定点击事件
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            
            if (currentTheme === 'dark') {
                // 切换到浅色 (Morfonica)
                html.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                // 切换到深色 (Roselia)
                html.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // ===============================================
    // 2. TOC ScrollSpy (文章目录)
    // ===============================================
    const tocLinks = document.querySelectorAll('#TableOfContents a');
    const sections = [];

    tocLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const id = href.slice(1);
            const section = document.getElementById(id);
            if (section) {
                sections.push(section);
            }
        }
    });

    if (sections.length > 0) {
        // 使用 scroll 监听
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                // -150 抵消头部高度 (80px) 和一些视觉余量
                if (window.scrollY >= sectionTop - 150) {
                    current = section.getAttribute('id');
                }
            });

            // 更新右侧目录高亮
            tocLinks.forEach(link => {
                link.classList.remove('active');
                // 获取锚点部分
                const href = link.getAttribute('href');
                // 如果当前滚动到了某个章节，且链接指向该章节
                if (current && href.includes(current)) {
                    link.classList.add('active');
                }
            });
        });
    }
});
