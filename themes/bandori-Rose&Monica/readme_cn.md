[English](https://github.com/Santerc/bandori_rm/blob/master/readme.md)  | 简体中文
# Bandori-Rose&Monica
[![最低 Hugo 版本](https://img.shields.io/static/v1?label=最低-HUGO-版本&message=0.87.0&color=blue&logo=hugo)](https://github.com/gohugoio/hugo/releases/tag/v0.87.0)
[![GitHub](https://img.shields.io/github/license/Santerc/bandori_rm)](https://github.com/Santerc/bandori_rm/LICENSE)


Bandori-Rose&Monica 是一个为 [Hugo](https://gohugo.io) 设计的主题。使用 HTML、CSS 和 JS 为 Hugo 和 邦邦 粉打造了这款主题。

## 安装

你可以将其下载到 `$your-nugo-site$/themes` 文件夹，然后在 Hugo 配置文件中添加 我们的主题。

当然也可以使用 git clone 命令：
```shell
cd $your-nugo-site$
mkdir themes
cd themes
git clone https://github.com/Santerc/bandori_rm.git
```

## 快速开始使用 Bandori Rose&Monica

> **注意：** 确保你已经安装了 **Go** 和 **Hugo**，并且在开始之前已经创建了一个新的 Hugo 项目。

> 我假设你已经设置好了一个 Hugo 项目。如果没有，你可以在网上学习如何创建一个。

### 确保你成功安装了我们的主题

```shell
```
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
        ├─Addition  #Addition_content 之后将其添加到 my-blog/content
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

### 将工具包、搜索和AboutMe页面添加到你的 Hugo 项目

将 `Bandori-Rose&Monica/Addition/content` 复制到你的 Hugo 项目的 `content` 目录。

### 配置 toml 文件

```toml
baseURL = '/'                     # 网站的基础 URL（根目录）
languageCode = 'zh-cn'            # 网站语言（简体中文）
title = '你的博客名称'             # 博客标题
theme = 'bandori-Rose&Monica'     # 主题名称

[params]
  description = ""                 # 网站描述/副标题
  
[outputs]
  home = ["HTML", "JSON"]          # 主页的输出格式

[params.author]
  name = "Santerc"                 # 用户名
  bio = "思考 实践 理论"            # 个人简介（显示在侧边栏）
  avatar = ""                      # 头像路径或完整 URL
  
[params.social]
  bilibili = "https://space.bilibili.com/NUM"  # 你的 B 站主页
  github = "https://github.com/NAME"           # 你的 GitHub 主页

[params.home]
  banner = ""                      # 头图/横幅图片路径
  avatar = ""                      # 个人头像路径（首页）
  nickname = ""                    # 昵称/显示名称
  bio = ""                         # 个人简介/签名（首页）
  status = "CODING_MODE"           # 当前状态（显示在状态胶囊中）
```

### 向你的工具包添加工具

我们使用 yaml 来组织工具。
在 `你的_Hugo_站点_目录/data` 下创建 `tools.yaml` 文件。
举个例子：
```yaml
- name: "Color Hunt"
  desc: "配色灵感库"
  url: "https://colorhunt.co" # 外部链接
  icon: "🎨"
  type: "external"

- name: "我的计算器"
  desc: "自制计算器"
  url: "/tools/calculator"  # 内部工具
  icon: "🧮"
  type: "internal"
```

#### 如何创建一个工具？

你只需在 `你的_Hugo_站点_目录/content/tools` 目录下创建一个 markdown 文件，并在其中编写 HTML、CSS 和 JS，**如下**：
```markdown
---
title: "简易计算器"
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

### 如何修改AboutMe页面？

你可以在 `your-nugo-site/content/about/_index.md` 文件中修改AboutMe页面：
```markdown
---
title: "用户资料"
layout: "abouts"
avatar: ""
nickname: "Santerc"
role: "大学生"
location: "中国/北京"
skills:
  - name: "嵌入式"
    percent: 90
  - name: "C/C++"
    percent: 60
  - name: "Hugo"
    percent: 70
stack: ["嵌入式", "Hugo", "Python", "C/C++"]
---
个人描述
```

## 界面与交互指南

### 主题切换

* **位置：** 顶部右侧的胶囊开关。
  * **浅色模式 (Morfonica):**
  * **深色模式 (Roselia):**

### 📱 移动端抽屉菜单 (Off-Canvas)

当屏幕宽度**小于 1200px**（笔记本电脑/平板/手机）时：

* 左侧和右侧边栏会自动隐藏。
* **左上角按钮：** 滑出左侧导航菜单。
* **右上角按钮：** 滑出右侧工具栏（小工具/目录）。
* **点击遮罩关闭：** 点击暗色背景区域可以关闭任何打开的侧边栏。

### 目录滚动监听 (TOC Spy)

当阅读长篇文章时，右侧边栏会自动变为 **索引协议**（目录）。

* 随着页面滚动，当前章节的标题会在右侧高亮并略微右移。
* 点击任何目录项都会触发平滑滚动到该部分。

## 常见问题解答 (FAQ)

**问：为什么首页/列表页只显示标题，不显示摘要？**
答：检查文章的 Markdown 前置元数据是否包含 `summary: "..."`。为了保持版面整洁，没有 `summary` 字段的文章会被强制隐藏预览文字。

**问：修改了 CSS 或模板后，刷新页面没有变化？**
答：Hugo 有缓存机制。尝试停止服务器，然后运行 `hugo server --disableFastRender` 来强制完全重新加载。

**问：我的工具包工具里的按钮点击没反应？**
答：确保在 `custom_js` 中定义的函数是全局可访问的，例如使用 `window.myFunction = ...`，而不仅仅是 `function myFunction() ...`。