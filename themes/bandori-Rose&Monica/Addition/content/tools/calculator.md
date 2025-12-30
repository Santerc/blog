---
title: "简易计数器"
layout: "tool-runner"

# HTML
custom_html: |
  <div class="counter-box">
    <h2 id="display">0</h2>
    <div class="btn-group">
      <button onclick="update(-1)">-</button>
      <button onclick="update(1)">+</button>
    </div>
  </div>

# CSS
custom_css: |
  .counter-box { text-align: center; padding: 20px; }
  #display { font-size: 3rem; color: var(--primary); font-family: 'JetBrains Mono'; }
  .btn-group button { 
    padding: 10px 20px; background: var(--glass-bg-subtle); border: 1px solid var(--primary); 
    color: var(--text-main); cursor: pointer; margin: 0 10px; border-radius: 4px;
  }
  .btn-group button:hover { background: var(--primary); color: #fff; }

# JS
custom_js: |
  let count = 0;
  function update(val) {
    count += val;
    document.getElementById('display').innerText = count;
  }
---

### 使用说明
这是一个测试用的计数器，完全运行在 Hugo 页面内，旨在教会读者如何使用本模板在MD中编写HTML。
