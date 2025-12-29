document.addEventListener('DOMContentLoaded', () => {
    // ===============================================
    // 1. 全局侧边栏逻辑：回车跳转
    // ===============================================
    const sidebarInput = document.getElementById('global-search-input');
    
    if (sidebarInput) {
        sidebarInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const term = sidebarInput.value.trim();
                if (term) {
                    window.location.href = `/search/?q=${encodeURIComponent(term)}`;
                }
            }
        });
    }

    // ===============================================
    // 2. 搜索结果页逻辑：执行模糊搜索
    // ===============================================
    const searchWrapper = document.getElementById('search-result-wrapper');
    const searchKeywordLabel = document.getElementById('search-keyword');
    const searchStatusLabel = document.getElementById('search-status');

    if (searchWrapper) {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');

        if (query) {
            searchKeywordLabel.innerText = `"${query}"`;
            searchStatusLabel.innerText = "SCANNING_DATABASE...";
            
            if(sidebarInput) sidebarInput.value = query;

            executeSearch(query);
        } else {
            searchKeywordLabel.innerText = "NULL";
            searchStatusLabel.innerText = "STANDBY";
            searchWrapper.innerHTML = `<div class="post-item" style="text-align:center; color:var(--text-muted);">// WAITING FOR COMMAND...</div>`;
        }
    }

    function executeSearch(query) {
        fetch('/index.json')
            .then(response => response.json())
            .then(data => {
                // Debug:数据清洗：去重 + 过滤
                const uniquePosts = Array.from(new Map(data.map(item => [item.permalink, item])).values());
                const cleanData = uniquePosts.filter(post => {
                    const isSearchPage = post.permalink.includes('/search/');
                    const hasTitle = post.title && post.title.trim() !== '';
                    return !isSearchPage && hasTitle;
                });

                const options = {
                    includeScore: true,
                    threshold: 0.4, 
                    keys: [
                        { name: 'title', weight: 0.7 },
                        { name: 'tags', weight: 0.2 },
                        { name: 'categories', weight: 0.1 },
                        { name: 'summary', weight: 0.1 },
                        { name: 'content', weight: 0.1 }
                    ]
                };

                const fuse = new Fuse(cleanData, options);
                const results = fuse.search(query);

                renderSearchResults(results);
            })
            .catch(err => {
                console.error(err);
                searchStatusLabel.innerText = "SYSTEM_ERROR";
            });
    }

    function renderSearchResults(results) {
        if (results.length === 0) {
            searchStatusLabel.innerText = "NO_MATCH_FOUND";
            searchWrapper.innerHTML = `
                <div class="post-item" style="text-align: center; padding: 4rem 0;">
                    <h2 style="color: var(--text-muted); font-family: 'JetBrains Mono';">ERROR: 404_RESULT</h2>
                    <p>No entries found in the memory sector.</p>
                </div>
            `;
            return;
        }

        searchStatusLabel.innerText = `FOUND ${results.length} ENTRIES`;
        let html = '';

        results.forEach(item => {
            const post = item.item;
            
            const summaryHtml = post.summary 
                ? `<p class="summary" style="margin-top: 1rem; font-size: 0.95rem; color: var(--text-muted);">${post.summary}</p>` 
                : '';

            html += `
                <article class="post-item" style="animation: fadeUp 0.5s ease forwards;">
                    <span class="post-meta">
                        ${post.date} 
                        ${post.tags ? `// [${post.tags.join(', ')}]` : ''}
                    </span>
                    <h2 class="post-title">
                        <a href="${post.permalink}">${post.title}</a>
                    </h2>
                    
                    ${summaryHtml}
                    
                    <div style="margin-top: 1rem;">
                        <a href="${post.permalink}" style="font-family: 'JetBrains Mono'; font-size: 0.85rem;">
                            &gt; READ_LOG
                        </a>
                    </div>
                </article>
            `;
        });

        searchWrapper.innerHTML = html;
    }
});
