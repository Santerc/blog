document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('.main-content');
    
    if (!mainContent) return;

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        // Check if internal link
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
        
        // Check if same domain
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) return;
        
        // Ignore if opening in new tab
        if (link.target === '_blank' || e.ctrlKey || e.metaKey) return;

        e.preventDefault();
        loadPage(href);
    });

    window.addEventListener('popstate', () => {
        loadPage(window.location.href, false);
    });

    async function loadPage(url, push = true) {
        try {
            document.body.classList.add('pjax-loading');
            
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const html = await response.text();
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // 1. Update Title
            document.title = doc.title;
            
            // 2. Replace Main Content
            const newContent = doc.querySelector('.main-content');
            if (newContent) {
                // Fade out effect could go here
                mainContent.innerHTML = newContent.innerHTML;
                
                // 3. Execute Scripts in the new content
                // We need to execute inline scripts and external scripts that are inside main-content
                const scripts = mainContent.querySelectorAll('script');
                scripts.forEach(oldScript => {
                    const newScript = document.createElement('script');
                    Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                    newScript.textContent = oldScript.textContent;
                    oldScript.parentNode.replaceChild(newScript, oldScript);
                });
            }
            
            // 4. Update History
            if (push) {
                history.pushState(null, '', url);
            }
            
            // 5. Trigger Events
            document.body.classList.remove('pjax-loading');
            
            // Dispatch custom event for other scripts to hook into
            window.dispatchEvent(new Event('pjax:end'));
            
            // Scroll to top
            window.scrollTo(0, 0);
            
        } catch (error) {
            console.error('PJAX Error:', error);
            window.location.href = url; // Fallback to full reload
        }
    }
});
