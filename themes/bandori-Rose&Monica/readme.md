English | [简体中文](https://github.com/Santerc/bandori_rm/blob/master/readme_cn.md) 
# Bandori-Rose&Monica
[![最低 Hugo 版本](https://img.shields.io/static/v1?label=最低-HUGO-版本&message=0.87.0&color=blue&logo=hugo)](https://github.com/gohugoio/hugo/releases/tag/v0.87.0)
[![GitHub](https://img.shields.io/github/license/Santerc/bandori_rm)](https://github.com/Santerc/bandori_rm/LICENSE)


Banori-Rose&Monica is a theme for [Hugo](https://gohugo.io). We use html css and js to build this theme for Hugo and Bandori fans.
## Installation
you can download it to `$your_Hugo_site_directory$/theme` and then add bandori to your Hugo config file.

git clone is certainly alse available
```shell
cd $your_Hugo_site_directory$
mkdir theme
cd theme
git clone https://github.com/Santerc/bandori_rm.git
```



## Quick start using Banori Rose&Monica

> **Note:** Ensure you have **Go** and **Hugo** installed, and that you have created a new Hugo project before proceeding.

>  I suppose you have a Hugo project already set up. If not, you can learn to create one onthe Internet.

### Make sure you install our theme successfully
```shell
```text
my-blog/
├─archetypes
├─assets
├─content
│  ├─about
│  ├─posts
│  └─tools
├─data
├─i18n
├─layouts
├─public
├─static
└─themes
    └─bandori-Rose&Monica
        ├─Addition  #Addition_content you should add it to my-blog/content
        │  └─content
        │      ├─about
        │      ├─posts
        │      └─tools
        ├─archetypes
        ├─assets
        │  ├─css
        │  └─js
        └─layouts
            ├─partials
            └─_default
```

### Add Toolkits & Search & AboutMe pages to your Hugo project
add `Bandori-Rose&Monica/Addition/content` to your Hugo project‘s `content`.
### Config your toml
```toml
baseURL = '/'                     # Base URL for the site (root)
languageCode = 'en-us'            # Site language (English - United States)
title = 'name of your blog'       # Title of your blog
theme = 'bandori-Rose&Monica'     # Theme name

[params]
  description = ""                 # Site description/subtitle
  
[outputs]
  home = ["HTML", "JSON"]          # Output formats for homepage

[params.author]
  name = "Santerc"                 # Username
  bio = "Thinking Doing To Theory" # Personal bio (displays in sidebar)
  avatar = ""                      # Avatar path or full URL
  
[params.social]
  bilibili = "https://space.bilibili.com/NUM"  # Your Bilibili homepage
  github = "https://github.com/NAME"           # Your GitHub homepage

[params.home]
  banner = ""                      # Header/banner image path
  avatar = ""                      # Profile avatar path (homepage)
  nickname = ""                    # Nickname/display name
  bio = ""                         # Personal bio/signature (homepage)
  status = "CODING_MODE"           # Current status (displays in status capsule)
```
### Add tools to your toolkit
we use yaml to organize tools
create `tool.yaml` to `your_Hugo_Site_Directory/data`
just take an example:
```yaml
- name: "Color Hunt"
  desc: "配色灵感库"
  url: "https://colorhunt.co" #Outer link
  icon: "🎨"
  type: "external"

- name: "My Calculator"
  desc: "自制汇率计算器"
  url: "/tools/calculator"  # Inner tools
  icon: "🧮"
  type: "internal"
```
#### how to create a tool?
you can just create a markdown file in `your_Hugo_Site_Directory/content/tools` 
and write html css and js in it LIKE THIS.
```markdown
---
title: "Simple Calculator"
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
```
### how to modify your about page?
you can modify your about page in `your_Hugo_Site_Directory/content/about/_index.md`
```markdown
---
title: "USER_PROFILE"
layout: "abouts"
avatar: ""
nickname: "Santerc"
role: "College student"
location: "China/Beijing"
skills:
  - name: "Embedded"
    percent: 90
  - name: "C/C++"
    percent: 60
  - name: "Hugo"
    percent: 70
stack: ["Embedded", "Hugo", "Python", "C/C++"]
---
your discription
```

## Interface & Interaction Guide

### Theme Toggling

* **Location:** The capsule switch in the top-right corner of the Header.
  * **Light Mode (Morfonica):**
  * **Dark Mode (Roselia):**

### 📱 Mobile Drawer Menus (Off-Canvas)

When screen width is **less than 1200px** (laptop/tablet/mobile):

* Left and Right sidebars are automatically hidden.
* **Top-left button:** Slides out the left navigation (Menu).
* **Top-right button:** Slides out the right toolbar (Widget/TOC).
* **Close by overlay:** Click the darkened background area to close any open sidebar.

### Table of Contents Scrolling (TOC Spy)

When reading long articles, the right sidebar automatically becomes the **INDEX_PROTOCOL** (Table of Contents).

* As you scroll, the current section's heading is highlighted and slightly indented on the right.
* Clicking any TOC item triggers a smooth scroll to that section.

## Frequently Asked Questions (FAQ)

**Q: Why do posts only show titles, not summaries, on the homepage/list?**
A: Check if the post's Markdown front matter includes `summary: "..."`. To maintain a clean layout, posts without a `summary` field are forced to hide their preview text.

**Q: Changes to CSS or templates aren't showing after refresh?**
A: Hugo has a cache. Try stopping the server and running `hugo server --disableFastRender` to force a full reload.

**Q: Buttons in my Toolkit tool don't work?**
A: Ensure functions defined in `custom_js` are globally accessible, e.g., use `window.myFunction = ...`, not just `function myFunction() ...`.