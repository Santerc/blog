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
            // CSS 会自动处理滑块移动和图标变化，无需 JS 操作 DOM
        });
    }

    // ===============================================
    // 2. TOC ScrollSpy (文章目录滚动监听)
    // ===============================================
    const tocLinks = document.querySelectorAll('#TableOfContents a');
    const sections = [];

    // 收集目录中对应的所有章节元素
    tocLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const id = href.slice(1);
            // 需要转义特殊字符，防止 ID 中包含中文或符号报错
            try {
                const section = document.getElementById(decodeURIComponent(id));
                if (section) {
                    sections.push(section);
                }
            } catch (e) {
                console.warn("Invalid TOC ID:", id);
            }
        }
    });

    if (sections.length > 0) {
        const onScroll = () => {
            let current = '';
            const scrollPos = window.scrollY;
            
            sections.forEach(section => {
                // -150 是为了抵消头部高度 (80px) 和一些视觉余量
                if (scrollPos >= section.offsetTop - 150) {
                    current = section.getAttribute('id');
                }
            });

            tocLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (current && href.includes(current)) {
                    link.classList.add('active');
                }
            });
        };

        // 使用 Passive 监听提升滚动性能
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // ===============================================
    // 3. Mobile Sidebar Toggles (移动端抽屉交互)
    // ===============================================
    const menuBtn = document.getElementById('mobile-menu-btn');     // 左侧菜单按钮
    const widgetBtn = document.getElementById('mobile-widget-btn'); // 右侧小组件按钮
    const leftSidebar = document.querySelector('.sidebar-left');
    const rightSidebar = document.querySelector('.sidebar-right');
    const backdrop = document.getElementById('mobile-backdrop');

    // 关闭所有侧边栏
    function closeAllSidebars() {
        if(leftSidebar) leftSidebar.classList.remove('active');
        if(rightSidebar) rightSidebar.classList.remove('active');
        if(backdrop) backdrop.classList.remove('active');
        document.body.style.overflow = ''; // 恢复背景滚动
    }

    // 打开指定侧边栏
    function openSidebar(sidebar) {
        // 先关闭其他的，互斥显示
        if(leftSidebar && leftSidebar !== sidebar) leftSidebar.classList.remove('active');
        if(rightSidebar && rightSidebar !== sidebar) rightSidebar.classList.remove('active');
        
        if(sidebar) {
            sidebar.classList.add('active');
            if(backdrop) backdrop.classList.add('active');
            document.body.style.overflow = 'hidden'; // 锁定背景滚动
        }
    }

    // 左侧菜单点击
    if (menuBtn && leftSidebar) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (leftSidebar.classList.contains('active')) {
                closeAllSidebars();
            } else {
                openSidebar(leftSidebar);
            }
        });
    }

    // 右侧小组件点击
    if (widgetBtn && rightSidebar) {
        widgetBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (rightSidebar.classList.contains('active')) {
                closeAllSidebars();
            } else {
                openSidebar(rightSidebar);
            }
        });
    }

    // 点击遮罩层关闭
    if (backdrop) {
        backdrop.addEventListener('click', closeAllSidebars);
    }

    // 监听窗口大小变化（防止从移动端切回桌面端时样式残留）
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1200) {
            closeAllSidebars();
        }
    });

    // ===============================================
    // 5. Copy Code Button Logic
    // ===============================================
    function initCopyButtons() {
        console.log("Initializing Copy Buttons..."); 
        const preBlocks = document.querySelectorAll('pre');
        console.log(`Found ${preBlocks.length} pre blocks.`);

        preBlocks.forEach(pre => {
            // Prevent double initialization
            if (pre.parentNode.classList.contains('code-wrapper') || 
                pre.parentNode.querySelector('.copy-code-btn') || 
                pre.querySelector('.copy-code-btn')) {
                return;
            }

            let container = pre.parentNode;
            
            // Check if it's a standard Hugo highlight div
            if (container.classList.contains('highlight')) {
                container.style.position = 'relative';
            } else {
                // Create a wrapper for bare pre tags
                const wrapper = document.createElement('div');
                wrapper.className = 'code-wrapper';
                wrapper.style.position = 'relative';
                wrapper.style.margin = '2rem 0'; // Match pre margin
                
                // Insert wrapper before pre
                pre.parentNode.insertBefore(wrapper, pre);
                // Move pre into wrapper
                wrapper.appendChild(pre);
                
                // Reset pre margin to avoid double margin
                pre.style.margin = '0';
                
                container = wrapper;
            }

            const btn = document.createElement('button');
            btn.className = 'copy-code-btn';
            btn.textContent = 'Copy';
            
            btn.addEventListener('click', () => {
                // Get code text (handle both <code> and raw text)
                const code = pre.querySelector('code');
                let text = code ? code.innerText : pre.innerText;
                
                navigator.clipboard.writeText(text).then(() => {
                    btn.textContent = 'Copied!';
                    btn.classList.add('copied');
                    
                    setTimeout(() => {
                        btn.textContent = 'Copy';
                        btn.classList.remove('copied');
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy:', err);
                    btn.textContent = 'Error';
                });
            });
            
            container.appendChild(btn);
            console.log("Button added to:", container);
        });
    }

    // Run initially
    initCopyButtons();

    // Run on PJAX end
    window.addEventListener('pjax:end', () => {
        initCopyButtons();
        // Re-init TOC scrollspy if needed (omitted for brevity, but good practice)
    });
});
