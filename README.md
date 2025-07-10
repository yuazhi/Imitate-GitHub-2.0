# 仿github的个人主页
> [!TIP]
> 此项目不能用于任何的商业目的
## 🌐 演示站点
**在线预览**：[yuazhi.cn](https://yuazhi.cn)

## 🔧 快速开始
在使用此模板之前，请先修改以下关键配置：

1. 在 `main.js` 中修改：
   - GitHub 配置：
     ```javascript
     const GITHUB_USERNAME = '#';  // 替换为你的 GitHub 用户名
     const GITHUB_TOKEN = '#';     // 替换为你的 GitHub Token
     ```
   - Memos API 配置：
     ```javascript
     const MEMOS_API_BASE = '#';   // 替换为你的 Memos API 地址
     const MEMOS_TOKEN = '#';      // 替换为你的 Memos Token
     ```
   - 文章 API 配置：
     ```javascript
     const ARTICLES_API_CONFIG = {
         URL: "#",                 // 替换为你的文章 API 地址
         // ... 其他配置
     };
     ```
   - 友情链接配置：修改 `friendsData` 数组中的友链信息

2. 在 `index.html` 中修改：
   - 网站标题和描述
   - Open Graph 标签信息
   - 社交媒体链接
   - 备案信息（如需要）

以下是详细介绍教程
## 📖 项目简介
这是一个基于 GitHub 风格设计的个人主页项目，具有现代化的界面和丰富的功能模块。项目采用响应式设计，支持明暗主题切换，并集成了多种数据源来展示个人信息。

## ✨ 主要功能

### 🏠 概览页面
- **个人资料展示**：头像、姓名、简介
- **GitHub 贡献图**：动态显示代码贡献历史
- **GitHub 统计卡片**：展示仓库统计信息
- **活动时间线**：显示最近的 GitHub 活动
- **正在进行的项目**：突出显示当前开发中的项目

### 📁 项目展示
- **项目卡片**：展示仓库信息、描述、技术栈
- **语言标签**：支持多种编程语言的颜色标识
- **项目详情**：点击可查看完整的 README 内容
- **项目统计**：Star、Fork、Issue 数量
- **进度条**：显示项目开发进度

### 📝 文章管理
- **文章列表**：从 API 获取文章数据
- **文章详情**：支持 Markdown 渲染
- **分享功能**：一键复制文章链接
- **响应式布局**：适配各种屏幕尺寸

### 💭 说说功能
- **Memos 集成**：连接 Memos 服务
- **动态内容**：支持图片、标签、表情
- **置顶功能**：重要内容可置顶显示
- **加载更多**：分页加载历史内容

### 🔗 友情链接
- **友链展示**：展示其他博客和网站
- **头像显示**：自动获取网站图标
- **描述信息**：显示网站简介

### ⭐ Stars 收藏
- **GitHub Stars**：展示收藏的仓库
- **分类展示**：按语言和技术分类
- **搜索功能**：快速查找特定仓库

### 📋 更新日志
- **版本记录**：记录项目更新历史
- **类型标签**：功能、修复、改进等分类
- **详细说明**：每个版本的变更内容

## 🛠️ 技术栈

### 前端技术
- **HTML5**：语义化标签结构
- **CSS3**：现代样式和动画效果
- **JavaScript (ES6+)**：交互逻辑和数据处理
- **响应式设计**：适配桌面、平板、手机

### 第三方库
- **Marked.js**：Markdown 渲染
- **Highlight.js**：代码语法高亮
- **Chart.js**：图表展示
- **GitHub CSS**：GitHub 风格界面

### 数据源
- **GitHub API**：获取仓库和贡献数据
- **Memos API**：获取说说内容
- **自定义 API**：文章数据接口

## 📁 文件结构

```
主页 - 副本/
├── index.html          # 主页面文件
├── css.css            # 样式文件
├── main.js            # 主要逻辑文件
├── chart.js           # 图表库
├── marked.min.js      # Markdown 渲染库
├── highlight.min.js   # 代码高亮库
├── github.min.css     # GitHub 样式
├── github-dark.min.css # GitHub 暗色主题
├── yuazhi.ico         # 网站图标
└── package-lock.json  # 依赖锁定文件
```

## ⚙️ 配置说明

### API 配置详解

#### GitHub API 配置

```javascript
// GitHub API配置
const GITHUB_USERNAME = 'your-username';  // 你的 GitHub 用户名
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = 'your-github-token'; // GitHub Personal Access Token
```

**获取 GitHub Token：**
1. 访问 [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token (classic)"
3. 选择权限范围：`repo`, `read:user`, `read:email`
4. 复制生成的 token

#### Memos API 配置

```javascript
// Memos API配置
const MEMOS_API_BASE = 'https://your-memos-domain.com/api/v1';
const MEMOS_TOKEN = 'your-memos-access-token';
```

**获取 Memos Token：**
1. 登录 Memos 管理后台
2. 进入设置页面 → API 密钥
3. 创建新的访问令牌
4. 复制生成的 JWT Token

**Memos API 端点：**
- 获取说说列表：`GET /api/v1/memos`
- 分页参数：使用 `pageToken` 进行分页
- 认证方式：Bearer Token

#### 文章 API 配置

```javascript
// 文章 API 配置
const ARTICLES_API_CONFIG = {
    URL: "https://your-api-domain.com/api/posts",
    Method: "post",
    Headers: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json"
    },
    Body: {
        meta: {
            ds: "文章 get",
            table: "posts",
            action: "r",
            filters: {},
            env: "dev"
        }
    },
    Status: 200
};
```

**自定义文章 API 示例（WordPress）：**

```javascript
// WordPress REST API 配置
const ARTICLES_API_CONFIG = {
    URL: "https://your-wordpress-site.com/wp-json/wp/v2/posts",
    Method: "get",
    Headers: {
        "Accept": "application/json"
    },
    Params: {
        per_page: 10,
        _embed: true
    }
};
```

### 1. 个人信息配置

在 `main.js` 中修改以下配置：

```javascript
// GitHub 配置
const GITHUB_USERNAME = 'your-username';  // 替换为你的 GitHub 用户名
const GITHUB_TOKEN = 'your-token';        // 替换为你的 GitHub Token
```

### 2. Memos 说说 API 配置

#### 2.1 基本配置

在 `main.js` 中配置 Memos API：

```javascript
// Memos API配置
const MEMOS_API_BASE = 'https://your-memos-domain.com/api/v1';
const MEMOS_TOKEN = 'your-memos-access-token';
```

#### 2.2 获取 Memos Token

1. **登录 Memos 管理后台**
2. **进入设置页面** → **API 密钥**
3. **创建新的访问令牌**
4. **复制生成的 JWT Token**

#### 2.3 API 端点说明

Memos API 使用以下端点：

- **获取说说列表**：`GET /api/v1/memos`
- **分页参数**：使用 `pageToken` 进行分页
- **认证方式**：Bearer Token

#### 2.4 数据格式

Memos API 返回的数据格式：

```json
{
  "memos": [
    {
      "id": 1,
      "content": "说说内容 #标签",
      "createTime": "2024-01-01T00:00:00Z",
      "pinned": false,
      "visibility": "PUBLIC",
      "state": "NORMAL",
      "resources": [
        {
          "id": 1,
          "filename": "image.jpg",
          "externalLink": "https://example.com/image.jpg",
          "name": "resources/image.jpg"
        }
      ],
      "reactions": [
        {
          "reactionType": "👍",
          "count": 1
        }
      ]
    }
  ],
  "nextPageToken": "next-page-token"
}
```

#### 2.5 自定义配置

如果需要自定义 Memos 配置，可以修改以下参数：

```javascript
// 每次加载的说说数量
const MEMOS_PER_LOAD = 5;

// 资源文件基础URL（可选）
const MEMOS_RESOURCE_BASE = 'https://your-memos-domain.com/o/r/';
```

### 3. 文章 API 配置

#### 3.1 基本配置

在 `main.js` 中配置文章 API：

```javascript
// 文章 API 配置
const ARTICLES_API_CONFIG = {
    URL: "https://your-api-domain.com/api/posts",
    Method: "post",
    Headers: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json"
    },
    Body: {
        meta: {
            ds: "文章 get",
            table: "posts",
            action: "r",
            filters: {},
            env: "dev"
        }
    },
    Status: 200
};
```

#### 3.2 API 请求格式

文章 API 使用 POST 请求，请求体格式：

```json
{
  "meta": {
    "ds": "文章 get",
    "table": "posts",
    "action": "r",
    "filters": {},
    "env": "dev"
  }
}
```

#### 3.3 响应数据格式

API 返回的文章数据格式：

```json
{
  "rows": [
    {
      "id": 1,
      "title": "文章标题",
      "content": "文章内容（Markdown格式）",
      "description": "文章描述",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "status": "published",
      "tags": ["技术", "编程"],
      "cover_image": "https://example.com/cover.jpg"
    }
  ],
  "total": 10,
  "page": 1,
  "pageSize": 10
}
```

#### 3.4 自定义文章 API

如果使用其他文章系统，可以自定义 API 配置：

```javascript
// WordPress REST API 示例
const ARTICLES_API_CONFIG = {
    URL: "https://your-wordpress-site.com/wp-json/wp/v2/posts",
    Method: "get",
    Headers: {
        "Accept": "application/json"
    },
    Params: {
        per_page: 10,
        _embed: true
    }
};

// 自定义数据处理函数
async function fetchArticlesData() {
    try {
        const response = await fetch(ARTICLES_API_CONFIG.URL);
        const data = await response.json();
        
        // 转换数据格式
        return data.map(post => ({
            id: post.id,
            title: post.title.rendered,
            content: post.content.rendered,
            description: post.excerpt.rendered,
            created_at: post.date,
            updated_at: post.modified,
            cover_image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url
        }));
    } catch (error) {
        console.error('Error fetching articles:', error);
        return [];
    }
}
```

#### 3.5 文章分页配置

```javascript
// 文章分页设置
const ARTICLES_PER_PAGE = 6;  // 每页显示文章数量
const ARTICLES_PER_LOAD = 3;  // 每次加载更多显示的数量
```

### 4. 社交链接配置

在 `index.html` 中修改社交链接：

```html
<div class="social-links">
    <a href="#" class="social-link" onclick="showWechat(event)">
        <!-- 微信二维码 -->
    </a>
    <a href="#" class="social-link" onclick="showQQ(event)">
        <!-- QQ 联系方式 -->
    </a>
    <a href="mailto:your-email@example.com" class="social-link">
        <!-- 邮箱链接 -->
    </a>
    <a href="https://x.com/your-username" class="social-link" target="_blank">
        <!-- X (Twitter) 链接 -->
    </a>
</div>
```

### 5. 友情链接配置

在 `main.js` 中修改 `friendsData` 数组：

```javascript
const friendsData = [
    {
        name: "朋友网站名称",
        url: "https://friend-website.com/",
        description: "网站描述",
        avatar: "https://friend-website.com/favicon.ico"
    },
    // ... 更多友链
];
```

### 6. 项目数据配置

在 `main.js` 中修改 `projectsData` 数组：

```javascript
const projectsData = [
    {
        name: "项目名称",
        description: "项目描述",
        tags: ["JavaScript", "Vue", "CSS"],
        stars: 10,
        forks: 5
    },
    // ... 更多项目
];
```

## 🎨 主题定制

### 颜色变量

项目使用 CSS 变量来管理主题色彩，在 `css.css` 中定义：

```css
:root {
    --bg-color: #ffffff;
    --text-color: #1F2328;
    --border-color: #d0d7de;
    --hover-color: #0969da;
    /* ... 更多变量 */
}

[data-theme="dark"] {
    --bg-color: #0d1117;
    --text-color: #e6edf3;
    --border-color: #30363d;
    /* ... 暗色主题变量 */
}
```

### 响应式断点

项目支持多个屏幕尺寸：

- **桌面端**：> 768px
- **平板端**：768px - 480px
- **手机端**：< 480px

## 🚀 部署说明

### 1. 静态部署

将项目文件上传到任何静态网站托管服务：

- **GitHub Pages**
- **Vercel**
- **Netlify**
- **阿里云 OSS**
- **腾讯云 COS**

### 2. 域名配置

1. 购买域名并解析到托管服务
2. 在 `index.html` 中更新 Open Graph 标签：

```html
<meta property="og:url" content="https://your-domain.com" />
<meta property="og:image" content="https://your-domain.com/og-image.jpg" />
```

### 3. HTTPS 配置

确保网站使用 HTTPS 协议，因为 GitHub API 需要安全连接。

## 🔧 自定义开发

### 添加新功能模块

1. 在 `index.html` 中添加新的标签页：

```html
<a href="#" class="tab" data-tab="new-module">新模块</a>
```

2. 在 `main.js` 中添加对应的渲染函数：

```javascript
async function renderNewModule() {
    const contentArea = document.querySelector('.content-area');
    contentArea.innerHTML = `
        <div class="new-module-container">
            <!-- 新模块内容 -->
        </div>
    `;
}
```

3. 在标签切换逻辑中注册新模块：

```javascript
// 在现有的 switch 语句中添加
case 'new-module':
    await renderNewModule();
    break;
```

### 样式定制

1. 在 `css.css` 中添加新模块的样式
2. 确保支持明暗主题切换
3. 添加响应式设计规则

## 📱 移动端优化

项目已针对移动端进行了优化：

- **触摸友好**：按钮和链接有足够的点击区域
- **字体缩放**：支持系统字体大小设置
- **性能优化**：图片懒加载和代码分割
- **手势支持**：滑动和缩放操作

## 🔒 安全考虑

### API 密钥管理

- 不要在代码中硬编码 API 密钥
- 使用环境变量或配置文件
- 定期轮换密钥
- 设置适当的 API 访问权限

### 内容安全策略

建议添加 CSP 头：

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline';">
```

## 🐛 常见问题

### 1. GitHub API 限制

如果遇到 API 限制，可以：
- 增加 API 缓存时间
- 使用 GitHub Token 提高限制
- 实现本地数据缓存

### 2. Memos API 问题

**Token 无效：**
- 检查 Memos Token 是否正确
- 确认 Token 是否过期
- 验证 Memos 服务是否正常运行

**无法获取说说：**
- 检查网络连接
- 确认 Memos 域名配置正确
- 查看浏览器控制台错误信息

**图片无法显示：**
- 检查资源文件路径
- 确认 Memos 资源服务正常
- 验证图片 URL 是否可访问

### 3. 文章 API 问题

**API 请求失败：**
- 检查 API 端点是否正确
- 确认请求方法和头部设置
- 验证 API 服务是否可用

**数据格式错误：**
- 检查 API 响应格式
- 确认数据字段名称匹配
- 验证 JSON 格式是否正确

**文章内容显示异常：**
- 检查 Markdown 渲染
- 确认图片链接有效
- 验证 HTML 标签安全

### 4. 图片加载失败

- 检查图片 URL 是否有效
- 添加图片加载失败的回退方案
- 使用 CDN 加速图片加载

### 5. 移动端显示异常

- 检查 viewport 设置
- 测试不同设备的兼容性
- 优化触摸交互体验

## 📞 技术支持

如果在使用过程中遇到问题，可以：

1. **查看浏览器控制台错误信息**
   - 按 F12 打开开发者工具
   - 查看 Console 标签页的错误信息
   - 检查 Network 标签页的 API 请求状态

2. **检查网络请求是否正常**
   - 确认所有 API 端点可访问
   - 验证 CORS 设置是否正确
   - 检查网络连接和防火墙设置

3. **验证 API 配置是否正确**
   - 确认 GitHub Token 有效且有足够权限
   - 验证 Memos Token 未过期
   - 检查文章 API 配置和认证信息

4. **API 调试技巧**
   - 使用 Postman 或类似工具测试 API
   - 检查 API 响应状态码和错误信息
   - 验证请求头和请求体格式

5. **联系开发者获取帮助**
   - 提供详细的错误信息和复现步骤
   - 包含浏览器控制台的错误截图
   - 说明使用的浏览器版本和操作系统

## 📄 许可证

本项目采用 MIT 许可证，您可以自由使用、修改和分发。

## 🙏 致谢

感谢以下开源项目的支持：

- [GitHub](https://github.com) - 提供 API 和设计灵感
- [Marked.js](https://marked.js.org/) - Markdown 渲染
- [Highlight.js](https://highlightjs.org/) - 代码高亮
- [Chart.js](https://www.chartjs.org/) - 图表库

---

**最后更新**：2024年12月

**版本**：1.0.0

**作者**：鸢栀 (@yuazhi) 
