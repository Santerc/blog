document.addEventListener('DOMContentLoaded', () => {

    // ===============================================
    // 侧边栏回车跳转
    // ===============================================
    const sidebarInput = document.getElementById('global-search-input');
    if (sidebarInput) {
        sidebarInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const term = sidebarInput.value.trim();
                if (term) {
                    // 使用 getUrl 构建正确的搜索结果页路径
                    window.location.href = window.absURL(`search/?q=${encodeURIComponent(term)}`);
                }
            }
        });
    }

    // ===============================================
    // 搜索逻辑
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
        // 获取 index.json
        fetch(window.absURL('index.json'))
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                // 数据清洗
                const uniquePosts = Array.from(new Map(data.map(item => [item.permalink, item])).values());
                const cleanData = uniquePosts.filter(post => {
                    // 过滤掉搜索页本身和无标题页面
                    return !post.permalink.includes('/search/') && post.title && post.title.trim() !== '';
                });

                const fuse = new Fuse(cleanData, {
                    includeScore: true,
                    threshold: 0.4, 
                    keys: ['title', 'tags', 'categories', 'summary', 'content']
                });

                renderSearchResults(fuse.search(query));
            })
            .catch(err => {
                console.error("Search Error:", err);
                searchStatusLabel.innerText = "SYSTEM_ERROR";
                searchWrapper.innerHTML = `<div class="post-item" style="text-align:center; color:red;">// ERROR: ${err.message}</div>`;
            });
    }

    function renderSearchResults(results) {
        if (results.length === 0) {
            searchStatusLabel.innerText = "NO_MATCH_FOUND";
            searchWrapper.innerHTML = `
                <div class="post-item" style="text-align: center; padding: 4rem 0;">
                    <h2 style="color: var(--text-muted); font-family: 'JetBrains Mono';">ERROR: 404_RESULT</h2>
                    <p>No entries found in the memory sector.</p>
                </div>`;
            return;
        }

        searchStatusLabel.innerText = `FOUND ${results.length} ENTRIES`;
        
        const html = results.map(item => {
            const post = item.item;
            // 确保 permalink 是正确的 (通常 index.json 里已经是绝对路径了，但为了保险)
            const postLink = post.permalink; 

            return `
                <article class="post-item" style="animation: fadeUp 0.5s ease forwards;">
                    <span class="post-meta">
                        ${post.date} ${post.tags ? `// [${post.tags.join(', ')}]` : ''}
                    </span>
                    <h2 class="post-title">
                        <a href="${postLink}">${post.title}</a>
                    </h2>
                    ${post.summary ? `<p class="summary" style="margin-top: 1rem; font-size: 0.95rem; color: var(--text-muted);">${post.summary}</p>` : ''}
                    <div style="margin-top: 1rem;">
                        <a href="${postLink}" style="font-family: 'JetBrains Mono'; font-size: 0.85rem;">&gt; READ_LOG</a>
                    </div>
                </article>
            `;
        }).join('');

        searchWrapper.innerHTML = html;
    }
});