// 模拟项目数据，实际使用时可以替换为真实的API请求
// 添加 normalizeLangName 函数定义
function normalizeLangName(name) {
    if (!name) return 'default';
    return name.toLowerCase()
        .replace(/\+/g, 'p')
        .replace(/#/g, 'sharp')
        .replace(/\./g, 'dot')
        .replace(/-/g, '')
        .replace(/\s+/g, '');
}

// 添加获取有效年份范围的辅助函数
function getValidYears() {
    const currentYear = new Date().getFullYear();
    // 假设用户注册年份为 2020 年（可以根据实际情况调整）
    const userRegistrationYear = 2023; // 可以改为实际的注册年份
    const validYears = [];
    for (let year = currentYear; year >= userRegistrationYear; year--) {
        validYears.push(year);
    }
    return validYears;
}

// 添加验证年份是否有效的辅助函数
function isValidYear(year) {
    const validYears = getValidYears();
    return validYears.includes(parseInt(year));
}

const projectsData = [
    {
        name: "WordPress-LivePhotos",
        description: "在WordPress支持LivePhotos",
        tags: ["JavaScript", "PHP", "CSS"],
        stars: 1,
        forks: 0
    },
    {
        name: "Sasariki.github.io",
        description: "个人网站",
        tags: ["JavaScript", "HTML", "CSS"],
        stars: 1,
        forks: 0
    },
    {
        name: "x-html",
        description: "An HTML page that mimics the macOS interface",
        tags: ["HTML"],
        stars: 1,
        forks: 0
    },
    {
        name: "go-proxy-bingai",
        description: "用Vue3和Go搭建的微软New Bing演示站点，拥有一致的UI体验，支持ChatGPT提示词，支持API调用，国内可用。",
        tags: ["HTML", "Vue", "Go"],
        stars: 0,
        forks: 0
    }
];

// 在 projectsData 数组前添加正在进行的项目数据
const ongoingProject = {
    name: "WordPress-LivePhotos",
    description: "在WordPress支持LivePhotos，这是一个正在开发中的重要项目。",
    tags: ["JavaScript", "PHP", "CSS"],
    progress: 65, // 进度百分比
    stars: 1,
    forks: 0
};

// GitHub API配置
const GITHUB_USERNAME = '#';
const GITHUB_API_BASE = '#';
const GITHUB_TOKEN = '#';

// Memos API配置
const MEMOS_API_BASE = '#';
const MEMOS_TOKEN = '#';
// const MEMOS_RESOURCE_BASE = 'http://120.26.160.134:5230/o/r/'; // Memos 资源的基础URL

// 文章 API 配置
const ARTICLES_API_CONFIG = {
    URL: "#",
    Method: "post",
    Headers: {
        "Accept": "application/json, text/plain, */*",
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

async function fetchArticlesData() {
    try {
        showSkeletonLoading();
        const response = await fetch(ARTICLES_API_CONFIG.URL, {
            method: ARTICLES_API_CONFIG.Method,
            headers: ARTICLES_API_CONFIG.Headers,
            body: JSON.stringify(ARTICLES_API_CONFIG.Body)
        });

        if (!response.ok) {
            throw new Error(`Article API error: ${response.status}`);
        }

        const data = await response.json();
        console.log("API 返回的原始数据:", data); // 添加日志
        hideSkeletonLoading();
        // 对文章数据进行排序，按 created_at 降序排列
        const sortedRows = data.rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return sortedRows; // 返回排序后的数据
    } catch (error) {
        console.error("Error fetching articles data:", error);
        hideSkeletonLoading();
        throw error; // 抛出错误而不是返回空数组
    }
}

// 友情链接数据
const friendsData = [
    {
        name: "杉红茶博客(原顶茶社)",
        url: "https://blog.redcha.cn/",
        description: "19年入坑，喜欢折腾，喜欢分享",
        avatar: "https://blog.redcha.cn/favicon.ico"
    },
    {
        name: "龙星划空",
        url: "https://blog.245179.xyz/",
        description: "人生近看是悲剧，远看是喜剧",
        avatar: "https://blog.245179.xyz/images/atiq.png"
    },
    {
        name: "早枯薄荷的小屋",
        url: "https://orange-mint.com/",
        description: "去行动，抓住时间，去做想做的事情。",
        avatar: "https://orange-mint.com/wp-content/uploads/2024/02/orange-mint.webp"
    },
    {
        name: "知非博客",
        url: "https://zfei.net/",
        description: "记录生活，分享技术",
        avatar: "https://cdn.rjjr.cn/avatar/20250609130551633.webp"
    },
    {
        name: "中文博客导航",
        url: "https://zhblogs.ohyee.cc/",
        description: "中文博客大全",
        avatar: "https://www.zhblogs.net/logo-light.webp"
    },
    {
        name: "纸鹿摸鱼处",
        url: "https://blog.zhilu.cyou/",
        description: "纸鹿至麓不知路，支炉制露不止漉",
        avatar: "https://www.zhilu.cyou/api/avatar.png"
    },
    {
        name: "Diary of LX",
        url: "https://diary.bid/",
        description: "记录生活，分享技术",
        avatar: "https://diary.bid/wp-content/uploads/2022/11/%E4%B8%8B%E8%BD%BD.jpg"
    },
    {
        name: "Kegongteng",
        url: "https://kegongteng.cn/",
        description: "	Blogger / Technophile / Student",
        avatar: "https://bu.dusays.com/2023/12/23/65867c3357bb6.jpg"
    },
    {
        name: "无名博客",
        url: "https://wuminboke.site/",
        description: "一个无聊的人罢了",
        avatar: "https://bu.dusays.com/2024/07/23/669f7b016ad0b.jpg"
    },
    {
        name: "张洪Heo",
        url: "https://blog.zhheo.com/",
        description: "分享设计与科技生活",
        avatar: "https://img.zhheo.com/i/67d8fa75943e4.webp"
    },
    {
        name: "祈星海",
        url: "https://www.zzzzhi.com/#/",
        description: "tutu",
        avatar: "https://bu.dusays.com/2025/06/08/684490849e31f.png"
    },
    {
        name: "珞佳小窝",
        url: "https://www.lokria.top/",
        description: "珞佳的温暖小窝，记录着生活中琐碎小事",
        avatar: "https://www.lokria.top/_nuxt/headimg_dl.5IKCoyuF.jpg"
    },
    {
        name: "啊不都",
        url: "https://www.oplog.cn/",
        description: "啊不都",
        avatar: "https://www.oplog.cn/img/avatar.png"
    },
    {
        name: "沉沦博客",
        url: "https://kkn.me/",
        description: "深陷其中欲罢不能",
        avatar: "https://kkn.me/wp-content/avatars/89ae0301f5fc21761dbbecfa18ff2f76.webp"
    },
    {
        name: "刘郎阁",
        url: "https://vjo.cc/",
        description: "一个积极向上的生活探索者！",
        avatar: "https://vjo.cc/usr/uploads/logo.jpeg"
    },
    {
        name: "Chlorine",
        url: "https://chlor.me/",
        description: "An Element-chan who writes.",
        avatar: "https://img.viento.cc/avatar/02.webp"
    },
    {
        name: "iMaeGoo's Blog",
        url: "https://www.imaegoo.com/",
        description: "虹墨空间站",
        avatar: "https://cdn.jsdelivr.net/npm/imaegoo/avatar.jpg"
    },
    {
        name: "Mo的记事簿",
        url: "https://blog.xiowo.net/",
        description: "万年鸽王，哈哈OvO",
        avatar: "https://blog.xiowo.net/img/avatar.png"
    },
    {
        name: "诺诺博客",
        url: "https://nnkin.com/",
        description: "春风不语即随本心",
        avatar: "https://nnkin.com/impression/nnkin.jpg"
    }
];

// 复制内容到剪贴板
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            showRefreshToast('复制成功！', 'success');
        })
        .catch(err => {
            console.error('复制失败:', err);
            showRefreshToast('复制失败，请手动复制', 'error');
        });
}

// 强制下载图片的函数
function downloadImage(url, filename) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
        })
        .catch(error => {
            console.error('下载图片失败:', error);
            alert('下载图片失败，请稍后重试');
        });
}

// 渲染友情链接页面
async function renderFriends() {
    const contentArea = document.querySelector('.content-area');
    contentArea.innerHTML = `
        <div class="friends-container">
            <div class="friends-grid">
                ${friendsData.map(friend => `
                    <a href="${friend.url}" class="friend-card" target="_blank" rel="noopener">
                        <div class="friend-avatar">
                            <img src="${friend.avatar}" alt="${friend.name}">
                        </div>
                        <div class="friend-info">
                            <h3>${friend.name}</h3>
                            <p>${friend.description}</p>
                        </div>
                    </a>
                `).join('')}
            </div>
            <div class="site-info">
                <h3>本站基本信息</h3>
                <div class="site-info-content">
                    <div class="site-info-item">
                        <span class="site-info-label">博客名称：</span>
                        <span class="site-info-value"><a href="javascript:void(0);" onclick="copyToClipboard('鸢栀的仓库')">鸢栀的仓库</a></span>
                    </div>
                    <div class="site-info-item">
                        <span class="site-info-label">地址：</span>
                        <span class="site-info-value"><a href="javascript:void(0);" onclick="copyToClipboard('https://yuazhi.cn/')">https://yuazhi.cn/</a></span>
                    </div>
                    <div class="site-info-item">
                        <span class="site-info-label">图标：</span>
                        <span class="site-info-value"><a href="javascript:void(0);" onclick="downloadImage('https://cdn.rjjr.cn/assets/IMG_0235.PNG', 'yuazhi.png')">点击下载</a></span>
                    </div>
                    <div class="site-info-item">
                        <span class="site-info-label">简介：</span>
                        <span class="site-info-value"><a href="javascript:void(0);" onclick="copyToClipboard('每天写下自己的喜好')">每天写下自己的喜好</a></span>
                    </div>
                    <div class="site-info-item">
                        <span class="site-info-label">申请邮箱：</span>
                        <span class="site-info-value"><a href="mailto:hfyu2008@gmail.com">hfyu2008@gmail.com</a></span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 获取GitHub数据的函数
async function fetchGitHubData() {
    try {
        const headers = {
            'Accept': 'application/vnd.github.v3+json'
        };
        
        if (GITHUB_TOKEN) {
            headers['Authorization'] = `token ${GITHUB_TOKEN}`;
        }

        // 获取用户仓库
        const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=100`, { headers });
        if (!response.ok) {
            throw new Error(`Failed to fetch repositories: ${response.status}`);
        }
        
        let repos = await response.json();
        
        // 忽略特定仓库
        repos = repos.filter(repo => repo.name !== 'yuazhi' && repo.full_name !== 'yuazhi/yuazhi');
        
        // 获取每个仓库的详细信息
        const repoDetails = await Promise.all(repos.map(async (repo) => {
            try {
                console.log(`处理仓库: ${repo.name}`);
                
                const languagesResponse = await fetch(repo.languages_url, {
                    headers: headers
                });
                const languages = await languagesResponse.json();
                
                // 验证仓库名称，避免特殊字符导致的API错误
                const repoName = repo.name.replace(/[^a-zA-Z0-9._-]/g, '');
                if (!repoName) {
                    console.warn(`跳过无效的仓库名称: ${repo.name}`);
                    return null;
                }
                
                console.log(`清理后的仓库名称: ${repoName}`);
                
                // 获取最近的提交
                let lastCommit = null;
                try {
                    const commitsResponse = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}/commits?per_page=1`, {
                        headers: headers
                    });
                    
                    if (commitsResponse.ok) {
                        const commits = await commitsResponse.json();
                        lastCommit = commits.length > 0 ? commits[0].commit.author.date : null;
                    } else {
                        console.warn(`无法获取仓库 ${repoName} 的提交信息: ${commitsResponse.status} - ${commitsResponse.statusText}`);
                    }
                } catch (commitError) {
                    console.warn(`获取仓库 ${repoName} 提交信息时出错:`, commitError);
                }
                
                return {
                    name: repo.name,
                    description: repo.description || '',
                    tags: Object.keys(languages),
                    stars: repo.stargazers_count,
                    forks: repo.forks_count,
                    html_url: repo.html_url,
                    updated_at: repo.updated_at,
                    created_at: repo.created_at,
                    last_commit: lastCommit,
                    is_fork: repo.fork,
                    language: repo.language,
                    open_issues: repo.open_issues_count,
                    size: repo.size,
                    languages: languages
                };
            } catch (error) {
                console.error(`处理仓库 ${repo.name} 时出错:`, error);
                return null;
            }
        }));

        // 过滤掉null值（处理失败的仓库）
        const validRepoDetails = repoDetails.filter(repo => repo !== null);

        // 按更新时间排序
        validRepoDetails.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        // 更新项目数据
        projectsData.length = 0;
        projectsData.push(...validRepoDetails);

        // 更新进行中的项目（使用最近更新的非fork仓库）
        const mostRecentRepo = validRepoDetails.find(repo => !repo.is_fork);
        if (mostRecentRepo) {
            ongoingProject.name = mostRecentRepo.name;
            ongoingProject.description = mostRecentRepo.description;
            ongoingProject.tags = mostRecentRepo.tags;
            ongoingProject.stars = mostRecentRepo.stars;
            ongoingProject.forks = mostRecentRepo.forks;
            // 根据最后提交时间计算进度
            const daysSinceLastCommit = (new Date() - new Date(mostRecentRepo.last_commit)) / (1000 * 60 * 60 * 24);
            ongoingProject.progress = Math.max(0, Math.min(100, 100 - Math.floor(daysSinceLastCommit)));
        }

        return validRepoDetails;
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        throw error;
    }
}

// 修改渲染项目卡片的函数
function renderProjectCard(project) {
    // 统计信息
    const stats = `
        <span class="repo-stat" title="Stars">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path></svg>
            ${project.stars ?? project.stargazers_count ?? 0}
        </span>
        <span class="repo-stat" title="Forks">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path></svg>
            ${project.forks ?? project.forks_count ?? 0}
        </span>
        <span class="repo-stat" title="Watchers">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16"><path d="M1.5 8s2.5-5.5 6.5-5.5S14.5 8 14.5 8s-2.5 5.5-6.5 5.5S1.5 8 1.5 8Zm6.5 4a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path></svg>
            ${project.watchers ?? project.watchers_count ?? 0}
        </span>
        <span class="repo-stat" title="Size">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16"><path d="M1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25v-8.5C0 2.784.784 2 1.75 2ZM1.5 12.251c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V5.809L8.38 9.397a.75.75 0 0 1-.76 0L1.5 5.809v6.442Zm13-8.181v-.32a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25v.32L8 7.88Z"></path></svg>
            ${(project.size ? (project.size / 1024).toFixed(2) : '0.00')} MB
        </span>
    `;

    // 底部信息
    const bottom = `
        ${project.language ? `
            <span class="repo-lang">
                <span class="language-dot" style="background-color: var(--color-${normalizeLangName(project.language)}, var(--color-default));"></span>
                ${project.language}
            </span>
        ` : ''}
        <span class="repo-license">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16"><path d="M1.5 2.75A.75.75 0 0 1 2.25 2h11.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75H2.25a.75.75 0 0 1-.75-.75V2.75Zm1 .75v9.5h11V3.5H2.5Z"></path></svg>
            ${project.license?.spdx_id || 'MIT'}
        </span>
        <span class="repo-updated">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16"><path d="M1.643 3.143 L.427 1.927 A.25.25 0 0 0 0 2.104 V5.75 c0 .138.112.25.25.25 h3.646 a.25.25 0 0 0 .177-.427 L2.715 4.215 a6.5 6.5 0 1 1-1.18 4.458.75.75 0 1 0-1.493.154 A8.001 8.001 0 1 0 8 0a7.964 7.964 0 0 0-6.357 3.143 z"></path></svg>
            Updated ${project.updated_at ? timeAgo(new Date(project.updated_at)) : ''}
        </span>
    `;

    // Open issues
    const openIssues = `
        <span class="repo-issues" style="${project.open_issues === 0 ? 'color: var(--text-secondary);' : ''}">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16"><path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path></svg>
            <span class="issues-count">${project.open_issues}</span> open issues
        </span>
    `;

    // Projects 标签
    const projectsTag = `<span class="repo-projects">Projects</span>`;

    // 创建时间
    const created = project.created_at ? new Date(project.created_at).toLocaleDateString() : '';

    // 检查是否为最新项目（通过检查是否有特殊的标识或者是否为第一个项目）
    const isLatestProject = project.isLatest || project.isMostRecent;

    return `
    <div class="repo-card" onclick="showProjectDetail('${project.name}')">
        <div class="repo-header-row">
            <a class="repo-title" href="${project.html_url || '#'}" target="_blank">${project.name}</a>
            <span class="repo-created">Created ${created}</span>
        </div>
        <div class="repo-description${isLatestProject ? ' latest-project-description' : ''}" ${isLatestProject ? 'style="margin-bottom:10px;"' : ''}>${project.description || 'No description available'}
            ${isLatestProject ? `
            <style>
                .latest-project-description {
                    margin-bottom: 9px;
                }
                @media (max-width: 767px) {
                    .latest-project-description { 
                        margin-top: -5px; 
                        margin-bottom: 6px; 
                    }
                }
                @media (min-width: 768px) {
                    .latest-project-description { 
                        margin-top: -10px; 
                    }
                }
            </style>
            ` : ''}
        </div>
        <div class="repo-stats-row">${stats}</div>
        <div class="repo-bottom">${bottom}</div>
        <div class="repo-extra">
            ${openIssues}
            ${projectsTag}
        </div>
    </div>
    `;
}

// 辅助函数：时间友好显示（中文）
function timeAgo(date) {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return `${diff}秒前`;
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}天前`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)}个月前`;
    return `${Math.floor(diff / 31536000)}年前`;
}

// 修改渲染正在进行项目的函数
function renderOngoingProject() {
    return `
        <div class="ongoing-project-title">
            <svg viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
                <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
            </svg>
            最新项目
        </div>
        <div class="pinned-project">
            <div class="repo-title">${ongoingProject.name}</div>
            <p class="repo-description" style="margin-top:-10px;margin-bottom:10px;">${ongoingProject.description}</p>
            <div class="progress-bar">
                <div class="progress" style="width: ${ongoingProject.progress}%"></div>
            </div>
            <div class="repo-meta">
                ${ongoingProject.language ? `
                    <div class="language-tag">
                        <span class="language-dot" style="background-color: var(--color-${normalizeLangName(ongoingProject.language)}, var(--color-default));"></span>
                        <span>${ongoingProject.language}</span>
                    </div>
                ` : ''}
            </div>
            <div class="repo-stats">
                <span class="repo-stat" title="Stars">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
                        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
                    </svg>
                    ${ongoingProject.stars}
                </span>
                <span class="repo-stat" title="Forks">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
                        <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
                    </svg>
                    ${ongoingProject.forks}
                </span>
            </div>
        </div>
    `;
}

// 在现有代码中添加生成贡献数据的函数
function generateContributionData() {
    const data = [];
    const today = new Date();
    const totalDays = 365;

    for (let i = 0; i < totalDays; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (totalDays - i));
        
        // 随机生成贡献数量（0-4级）
        const level = Math.floor(Math.random() * 5);
        data.push({
            date: date,
            level: level,
            contributions: level === 0 ? 0 : Math.floor(Math.random() * 10) + level
        });
    }
    return data;
}

// 修改获取GitHub贡献数据的函数
async function fetchContributionData(year = new Date().getFullYear(), forceRefresh = false) {
    try {
        // 缓存键名
        const cacheKey = `contribution_data_${year}`;
        const cacheTimestampKey = `contribution_timestamp_${year}`;
        
        // 检查缓存是否有效（5分钟过期）
        const CACHE_DURATION = 5 * 60 * 1000; // 5分钟
        const now = Date.now();
        const cachedTimestamp = localStorage.getItem(cacheTimestampKey);
        const cachedData = localStorage.getItem(cacheKey);
        
        // 如果不是强制刷新且缓存有效，直接返回缓存数据
        if (!forceRefresh && cachedData && cachedTimestamp) {
            const cacheAge = now - parseInt(cachedTimestamp);
            if (cacheAge < CACHE_DURATION) {
                console.log(`使用缓存的贡献数据 (${year})`);
                const parsedData = JSON.parse(cachedData);
                // 恢复Date对象
                parsedData.contributionData = parsedData.contributionData.map(day => ({
                    ...day,
                    date: new Date(day.date)
                }));
                return parsedData;
            }
        }

        console.log(`正在获取最新的贡献数据 (${year})...`);
        
        const headers = {
            'Accept': 'application/vnd.github.v3+json'
        };
        
        if (GITHUB_TOKEN) {
            headers['Authorization'] = `token ${GITHUB_TOKEN}`;
        }

        // 获取指定年份的贡献数据
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);
        
        // 新增：获取用户的所有仓库
        async function getUserRepos() {
            const reposResponse = await fetch(
                `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
                { headers }
            );
            
            if (!reposResponse.ok) {
                console.warn('无法获取用户仓库列表，将只使用 Events API 数据');
                return [];
            }
            
            const repos = await reposResponse.json();
            return repos.filter(repo => !repo.fork); // 只获取非 fork 的仓库
        }

        // 新增：获取指定仓库在指定时间范围内的 Commits
        async function getRepoCommits(repoName, since, until) {
            try {
                const commitsResponse = await fetch(
                    `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/commits?author=${GITHUB_USERNAME}&since=${since.toISOString()}&until=${until.toISOString()}&per_page=100`,
                    { headers }
                );
                
                if (!commitsResponse.ok) {
                    console.warn(`无法获取仓库 ${repoName} 的 Commits`);
                    return [];
                }
                
                const commits = await commitsResponse.json();
                return commits.map(commit => ({
                    ...commit,
                    repo: repoName,
                    type: 'commit',
                    created_at: commit.commit.author.date
                }));
            } catch (error) {
                console.warn(`获取仓库 ${repoName} 的 Commits 时出错:`, error);
                return [];
            }
        }

        // 新增：获取用户的 Stars 数据
        async function getUserStars(since, until) {
            try {
                const starsResponse = await fetch(
                    `https://api.github.com/users/${GITHUB_USERNAME}/starred?per_page=100&sort=updated`,
                    { headers }
                );
                
                if (!starsResponse.ok) {
                    console.warn('无法获取用户的 Stars 数据');
                    return [];
                }
                
                const stars = await starsResponse.json();
                // 过滤指定时间范围内的 Stars
                const filteredStars = stars.filter(star => {
                    const starredAt = new Date(star.starred_at || star.updated_at);
                    return starredAt >= since && starredAt <= until;
                });
                
                return filteredStars.map(star => ({
                    ...star,
                    type: 'star',
                    created_at: star.starred_at || star.updated_at,
                    repo: star.full_name.split('/')[1],
                    owner: star.full_name.split('/')[0]
                }));
            } catch (error) {
                console.warn('获取用户 Stars 数据时出错:', error);
                return [];
            }
        }

        // 新增：获取用户的 Forks 数据
        async function getUserForks(since, until) {
            try {
                const forksResponse = await fetch(
                    `https://api.github.com/users/${GITHUB_USERNAME}/repos?type=fork&per_page=100&sort=updated`,
                    { headers }
                );
                
                if (!forksResponse.ok) {
                    console.warn('无法获取用户的 Forks 数据');
                    return [];
                }
                
                const forks = await forksResponse.json();
                // 过滤指定时间范围内的 Forks
                const filteredForks = forks.filter(fork => {
                    const forkedAt = new Date(fork.created_at || fork.updated_at);
                    return forkedAt >= since && forkedAt <= until;
                });
                
                return filteredForks.map(fork => ({
                    ...fork,
                    type: 'fork',
                    created_at: fork.created_at || fork.updated_at,
                    repo: fork.name,
                    originalRepo: fork.source ? fork.source.full_name : null
                }));
            } catch (error) {
                console.warn('获取用户 Forks 数据时出错:', error);
                return [];
            }
        }

        // 并行获取 Events API 数据和仓库 Commits 数据
        const [allEvents, userRepos, allStars, allForks] = await Promise.all([
            (async () => {
                // 使用分页方式获取更多事件
                let allEvents = [];
                let page = 1;
                let hasMorePages = true;
                const maxPages = 20; // 增加最大获取页数，确保获取足够的事件
                
                while (hasMorePages && page <= maxPages) {
                    const response = await fetch(
                        `https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=100&page=${page}`, 
                        { headers }
                    );
                    
                    if (!response.ok) {
                        throw new Error(`GitHub API error: ${response.status}`);
                    }
                    
                    const events = await response.json();
                    
                    if (events.length === 0) {
                        hasMorePages = false;
                    } else {
                        allEvents = [...allEvents, ...events];
                        
                        // 检查最后一个事件的日期是否早于我们需要的年份
                        const lastEventDate = new Date(events[events.length - 1].created_at);
                        if (lastEventDate < startDate) {
                            hasMorePages = false;
                        }
                        
                        page++;
                    }
                }
                
                // 对 Events 按时间倒序排序，确保最新的 Events 在前面
                allEvents.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                
                return allEvents;
            })(),
            getUserRepos(),
            getUserStars(startDate, endDate),
            getUserForks(startDate, endDate)
        ]);
        
        console.log(`获取到 ${allEvents.length} 个GitHub事件，${userRepos.length} 个用户仓库，${allStars.length} 个 Stars，${allForks.length} 个 Forks`);
        
        // 对 Stars 和 Forks 按时间倒序排序，确保最新的在前面
        allStars.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        allForks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        // 获取所有仓库的 Commits 数据
        const allCommits = [];
        for (const repo of userRepos.slice(0, 10)) { // 限制最多获取前10个仓库，避免API限制
            const repoCommits = await getRepoCommits(repo.name, startDate, endDate);
            allCommits.push(...repoCommits);
        }
        
        // 对 Commits 按时间倒序排序，确保最新的 Commits 在前面
        allCommits.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        console.log(`获取到 ${allCommits.length} 个 Commits`);
        
        // 处理事件数据，按日期分组
        const contributionsByDate = {};
        const activitiesByMonth = {};

        // 处理 Events API 数据
        allEvents.forEach(event => {
            const eventDate = new Date(event.created_at);
            if (eventDate >= startDate && eventDate <= endDate) {
                const dateStr = eventDate.toISOString().split('T')[0];
                const monthStr = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}`;
                
                // 初始化日期的贡献计数
                if (!contributionsByDate[dateStr]) {
                    contributionsByDate[dateStr] = 0;
                }

                // 初始化月份的活动数组
                if (!activitiesByMonth[monthStr]) {
                    activitiesByMonth[monthStr] = [];
                }

                // 处理不同类型的事件
                switch(event.type) {
                    case 'PushEvent':
                        const commitCount = event.payload.commits ? event.payload.commits.length : 0;
                        contributionsByDate[dateStr] += commitCount;
                        
                        // 确保每个 PushEvent 都会创建活动记录，即使 commitCount 为 0
                        console.log(`处理 PushEvent: ${event.repo.name}, commits: ${commitCount}`);
                        
                        // 获取提交信息
                        const commits = event.payload.commits || [];
                        const commitMessages = commits.map(commit => commit.message).slice(0, 3); // 只取前3个提交信息
                        
                        activitiesByMonth[monthStr].push({
                            type: 'commit',
                            repo: event.repo.name.split('/')[1],
                            count: commitCount,
                            commits: commits,
                            commitMessages: commitMessages,
                            description: commitCount > 0 
                                ? `Created ${commitCount} commit${commitCount > 1 ? 's' : ''} in ${event.repo.name.split('/')[1]}`
                                : `Pushed to ${event.repo.name.split('/')[1]}`,
                            date: eventDate.toLocaleString('en-US', { month: 'short', day: 'numeric' }),
                            created_at: event.created_at, // 保存完整时间戳用于排序
                            branch: event.payload.ref ? event.payload.ref.replace('refs/heads/', '') : 'main'
                        });
                        break;
                    case 'CreateEvent':
                        contributionsByDate[dateStr] += 1;
                        if (event.payload.ref_type === 'repository') {
                            // 获取仓库的主要语言
                            const language = event.payload.description || 'Unknown';
                            activitiesByMonth[monthStr].push({
                                type: 'create',
                                repo: event.repo.name.split('/')[1],
                                language: language,
                                description: `Created repository ${event.repo.name.split('/')[1]}`,
                                date: eventDate.toLocaleString('en-US', { month: 'short', day: 'numeric' }),
                                created_at: event.created_at // 保存完整时间戳用于排序
                            });
                        } else if (event.payload.ref_type === 'branch') {
                            activitiesByMonth[monthStr].push({
                                type: 'branch',
                                repo: event.repo.name.split('/')[1],
                                branch: event.payload.ref,
                                description: `Created branch ${event.payload.ref} in ${event.repo.name.split('/')[1]}`,
                                date: eventDate.toLocaleString('en-US', { month: 'short', day: 'numeric' }),
                                created_at: event.created_at // 保存完整时间戳用于排序
                            });
                        }
                        break;
                    case 'IssuesEvent':
                        contributionsByDate[dateStr] += 1;
                        const issueAction = event.payload.action;
                        const issueTitleText = event.payload.issue?.title || 'issue';
                        activitiesByMonth[monthStr].push({
                            type: 'issue',
                            repo: event.repo.name.split('/')[1],
                            action: issueAction,
                            title: issueTitleText,
                            description: `${issueAction} issue "${issueTitleText}" in ${event.repo.name.split('/')[1]}`,
                            date: eventDate.toLocaleString('en-US', { month: 'short', day: 'numeric' }),
                            created_at: event.created_at // 保存完整时间戳用于排序
                        });
                        break;
                    case 'PullRequestEvent':
                        contributionsByDate[dateStr] += 1;
                        const prAction = event.payload.action;
                        const prTitleText = event.payload.pull_request?.title || 'pull request';
                        activitiesByMonth[monthStr].push({
                            type: 'pr',
                            repo: event.repo.name.split('/')[1],
                            action: prAction,
                            title: prTitleText,
                            description: `${prAction} pull request "${prTitleText}" in ${event.repo.name.split('/')[1]}`,
                            date: eventDate.toLocaleString('en-US', { month: 'short', day: 'numeric' }),
                            created_at: event.created_at // 保存完整时间戳用于排序
                        });
                        break;
                    case 'IssueCommentEvent':
                        contributionsByDate[dateStr] += 1;
                        const commentAction = event.payload.action;
                        const commentIssueTitle = event.payload.issue?.title || 'issue';
                        activitiesByMonth[monthStr].push({
                            type: 'comment',
                            repo: event.repo.name.split('/')[1],
                            action: commentAction,
                            title: commentIssueTitle,
                            description: `${commentAction} comment on issue "${commentIssueTitle}" in ${event.repo.name.split('/')[1]}`,
                            date: eventDate.toLocaleString('en-US', { month: 'short', day: 'numeric' }),
                            created_at: event.created_at // 保存完整时间戳用于排序
                        });
                        break;
                    case 'PullRequestReviewEvent':
                        contributionsByDate[dateStr] += 1;
                        const reviewAction = event.payload.action;
                        const reviewPrTitle = event.payload.pull_request?.title || 'pull request';
                        activitiesByMonth[monthStr].push({
                            type: 'review',
                            repo: event.repo.name.split('/')[1],
                            action: reviewAction,
                            title: reviewPrTitle,
                            description: `${reviewAction} review on pull request "${reviewPrTitle}" in ${event.repo.name.split('/')[1]}`,
                            date: eventDate.toLocaleString('en-US', { month: 'short', day: 'numeric' }),
                            created_at: event.created_at // 保存完整时间戳用于排序
                        });
                        break;
                    case 'WatchEvent':
                        contributionsByDate[dateStr] += 1;
                        
                        // 检查是否已经存在相同仓库和日期的 star 活动
                        const existingWatchActivity = activitiesByMonth[monthStr].find(activity => 
                            activity.type === 'star' && 
                            activity.repo === event.repo.name.split('/')[1] &&
                            activity.date === eventDate.toLocaleString('en-US', { month: 'short', day: 'numeric' })
                        );
                        
                        if (!existingWatchActivity) {
                            activitiesByMonth[monthStr].push({
                                type: 'star',
                                repo: event.repo.name.split('/')[1],
                                owner: event.repo.name.split('/')[0],
                                description: `Starred ${event.repo.name}`,
                                date: eventDate.toLocaleString('en-US', { month: 'short', day: 'numeric' }),
                                created_at: event.created_at // 保存完整时间戳用于排序
                            });
                        }
                        break;
                    case 'ForkEvent':
                        contributionsByDate[dateStr] += 1;
                        activitiesByMonth[monthStr].push({
                            type: 'fork',
                            repo: event.repo.name.split('/')[1],
                            description: `Forked ${event.repo.name.split('/')[1]}`,
                            date: eventDate.toLocaleString('en-US', { month: 'short', day: 'numeric' }),
                            created_at: event.created_at // 保存完整时间戳用于排序
                        });
                        break;
                }
            }
        });

        // 处理 Commits API 数据，补充可能缺失的 Commits
        allCommits.forEach(commit => {
            const commitDate = new Date(commit.created_at);
            if (commitDate >= startDate && commitDate <= endDate) {
                const dateStr = commitDate.toISOString().split('T')[0];
                const monthStr = `${commitDate.getFullYear()}-${String(commitDate.getMonth() + 1).padStart(2, '0')}`;
                
                // 初始化日期的贡献计数
                if (!contributionsByDate[dateStr]) {
                    contributionsByDate[dateStr] = 0;
                }

                // 初始化月份的活动数组
                if (!activitiesByMonth[monthStr]) {
                    activitiesByMonth[monthStr] = [];
                }

                // 增加贡献计数
                contributionsByDate[dateStr] += 1;
                
                // 检查是否已经存在相同仓库和日期的 commit 活动
                const existingActivity = activitiesByMonth[monthStr].find(activity => 
                    activity.type === 'commit' && 
                    activity.repo === commit.repo &&
                    activity.date === commitDate.toLocaleString('en-US', { month: 'short', day: 'numeric' })
                );
                
                if (!existingActivity) {
                    // 创建新的 commit 活动
                    activitiesByMonth[monthStr].push({
                        type: 'commit',
                        repo: commit.repo,
                        count: 1,
                        commits: [commit],
                        commitMessages: [commit.commit.message],
                        description: `Created commit in ${commit.repo}`,
                        date: commitDate.toLocaleString('en-US', { month: 'short', day: 'numeric' }),
                        created_at: commit.created_at, // 保存完整时间戳用于排序
                        branch: 'main', // 默认分支
                        sha: commit.sha.substring(0, 7)
                    });
                } else {
                    // 更新现有的 commit 活动
                    existingActivity.count += 1;
                    existingActivity.commits.push(commit);
                    existingActivity.commitMessages.push(commit.commit.message);
                    existingActivity.description = `Created ${existingActivity.count} commit${existingActivity.count > 1 ? 's' : ''} in ${commit.repo}`;
                    // 更新时间为最新的 commit 时间
                    if (new Date(commit.created_at) > new Date(existingActivity.created_at || 0)) {
                        existingActivity.created_at = commit.created_at;
                    }
                }
            }
        });

        // 处理 Stars API 数据，补充可能缺失的 Stars
        allStars.forEach(star => {
            const starDate = new Date(star.created_at);
            if (starDate >= startDate && starDate <= endDate) {
                const dateStr = starDate.toISOString().split('T')[0];
                const monthStr = `${starDate.getFullYear()}-${String(starDate.getMonth() + 1).padStart(2, '0')}`;
                
                // 初始化日期的贡献计数
                if (!contributionsByDate[dateStr]) {
                    contributionsByDate[dateStr] = 0;
                }

                // 初始化月份的活动数组
                if (!activitiesByMonth[monthStr]) {
                    activitiesByMonth[monthStr] = [];
                }

                // 增加贡献计数
                contributionsByDate[dateStr] += 1;
                
                // 检查是否已经存在相同仓库和日期的 star 活动
                const existingActivity = activitiesByMonth[monthStr].find(activity => 
                    activity.type === 'star' && 
                    activity.repo === star.repo &&
                    activity.owner === star.owner &&
                    activity.date === starDate.toLocaleString('en-US', { month: 'short', day: 'numeric' })
                );
                
                if (!existingActivity) {
                    // 创建新的 star 活动
                    activitiesByMonth[monthStr].push({
                        type: 'star',
                        repo: star.repo,
                        owner: star.owner,
                        description: `Starred ${star.owner}/${star.repo}`,
                        date: starDate.toLocaleString('en-US', { month: 'short', day: 'numeric' }),
                        created_at: star.created_at // 保存完整时间戳用于排序
                    });
                }
            }
        });

        // 处理 Forks API 数据，补充可能缺失的 Forks
        allForks.forEach(fork => {
            const forkDate = new Date(fork.created_at);
            if (forkDate >= startDate && forkDate <= endDate) {
                const dateStr = forkDate.toISOString().split('T')[0];
                const monthStr = `${forkDate.getFullYear()}-${String(forkDate.getMonth() + 1).padStart(2, '0')}`;
                
                // 初始化日期的贡献计数
                if (!contributionsByDate[dateStr]) {
                    contributionsByDate[dateStr] = 0;
                }

                // 初始化月份的活动数组
                if (!activitiesByMonth[monthStr]) {
                    activitiesByMonth[monthStr] = [];
                }

                // 增加贡献计数
                contributionsByDate[dateStr] += 1;
                
                // 检查是否已经存在相同仓库和日期的 fork 活动
                const existingActivity = activitiesByMonth[monthStr].find(activity => 
                    activity.type === 'fork' && 
                    activity.repo === fork.repo &&
                    activity.date === forkDate.toLocaleString('en-US', { month: 'short', day: 'numeric' })
                );
                
                if (!existingActivity) {
                    // 创建新的 fork 活动
                    activitiesByMonth[monthStr].push({
                        type: 'fork',
                        repo: fork.repo,
                        originalRepo: fork.originalRepo,
                        description: fork.originalRepo ? 
                            `Forked ${fork.originalRepo} to ${GITHUB_USERNAME}/${fork.repo}` : 
                            `Forked ${fork.repo}`,
                        date: forkDate.toLocaleString('en-US', { month: 'short', day: 'numeric' }),
                        created_at: fork.created_at // 保存完整时间戳用于排序
                    });
                }
            }
        });

        // 生成指定年份的所有日期数据
        const data = [];
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            const contributions = contributionsByDate[dateStr] || 0;
            
            let level = 0;
            if (contributions > 0) {
                if (contributions <= 2) level = 1;
                else if (contributions <= 4) level = 2;
                else if (contributions <= 6) level = 3;
                else level = 4;
            }

            data.push({
                date: new Date(d),
                level: level,
                contributions: contributions
            });
        }

        // 准备返回的数据
        const result = {
            contributionData: data,
            activityData: activitiesByMonth
        };

        // 对每个月份的活动数据进行时间倒序排序，确保最新的活动显示在最前面
        Object.keys(activitiesByMonth).forEach(month => {
            activitiesByMonth[month].sort((a, b) => {
                // 尝试解析完整的日期时间，如果失败则使用日期字符串
                let dateA, dateB;
                
                try {
                    // 如果有完整的 created_at 时间戳，使用它
                    if (a.created_at) {
                        dateA = new Date(a.created_at);
                    } else {
                        // 否则使用日期字符串
                        dateA = new Date(a.date + ' ' + new Date().getFullYear());
                    }
                    
                    if (b.created_at) {
                        dateB = new Date(b.created_at);
                    } else {
                        dateB = new Date(b.date + ' ' + new Date().getFullYear());
                    }
                } catch (error) {
                    // 如果解析失败，使用日期字符串
                    dateA = new Date(a.date + ' ' + new Date().getFullYear());
                    dateB = new Date(b.date + ' ' + new Date().getFullYear());
                }
                
                return dateB - dateA; // 倒序排列，最新的在前
            });
        });

        // 缓存数据
        localStorage.setItem(cacheKey, JSON.stringify(result));
        localStorage.setItem(cacheTimestampKey, now.toString());
        
        // 输出调试信息
        console.log(`贡献数据已缓存 (${year})`);
        console.log(`总贡献数: ${data.reduce((sum, day) => sum + day.contributions, 0)}`);
        
        // 统计各类型活动
        const activityStats = {};
        Object.values(activitiesByMonth).forEach(monthActivities => {
            monthActivities.forEach(activity => {
                activityStats[activity.type] = (activityStats[activity.type] || 0) + 1;
            });
        });
        console.log('活动类型统计:', activityStats);
        
        // 输出最新的几个活动用于调试
        console.log('最新的活动:');
        Object.keys(activitiesByMonth).slice(0, 2).forEach(month => {
            const monthActivities = activitiesByMonth[month];
            if (monthActivities.length > 0) {
                console.log(`${month}:`, monthActivities.slice(0, 3).map(a => ({
                    type: a.type,
                    repo: a.repo,
                    date: a.date,
                    description: a.description
                })));
            }
        });
        
        return result;
    } catch (error) {
        console.error('Error fetching contribution data:', error);
        return {
            contributionData: [],
            activityData: {}
        };
    }
}

// 添加检查贡献数据更新的函数
async function checkContributionUpdates() {
    try {
        // 获取当前选择的年份，如果没有保存则使用当前年份
        const savedYear = localStorage.getItem('selected-contribution-year');
        const currentYear = new Date().getFullYear();
        const yearToCheck = savedYear ? parseInt(savedYear) : currentYear;
        
        const cacheKey = `contribution_data_${yearToCheck}`;
        const cacheTimestampKey = `contribution_timestamp_${yearToCheck}`;
        
        // 获取缓存的时间戳
        const cachedTimestamp = localStorage.getItem(cacheTimestampKey);
        if (!cachedTimestamp) {
            return false; // 没有缓存，需要更新
        }
        
        // 检查缓存是否过期（1分钟检查一次）
        const CACHE_CHECK_INTERVAL = 1 * 60 * 1000; // 1分钟
        const now = Date.now();
        const cacheAge = now - parseInt(cachedTimestamp);
        
        if (cacheAge > CACHE_CHECK_INTERVAL) {
            // 获取最新的前几个事件来检查是否有新活动
            const headers = {
                'Accept': 'application/vnd.github.v3+json'
            };
            
            if (GITHUB_TOKEN) {
                headers['Authorization'] = `token ${GITHUB_TOKEN}`;
            }
            
            const response = await fetch(
                `https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=10`, 
                { headers }
            );
            
            if (response.ok) {
                const events = await response.json();
                if (events.length > 0) {
                    const latestEventTime = new Date(events[0].created_at).getTime();
                    const cacheTime = parseInt(cachedTimestamp);
                    
                    // 如果最新事件时间晚于缓存时间，说明有新活动
                    if (latestEventTime > cacheTime) {
                        console.log('检测到新的GitHub活动，需要更新贡献数据');
                        console.log('最新活动类型:', events[0].type);
                        
                        // 特别检查是否有新的提交活动
                        const hasNewCommits = events.some(event => {
                            const eventTime = new Date(event.created_at).getTime();
                            return event.type === 'PushEvent' && eventTime > cacheTime;
                        });
                        
                        if (hasNewCommits) {
                            console.log('检测到新的提交活动，优先更新贡献数据');
                        }
                        
                        return true;
                    }
                }
            }
        }
        
        return false;
    } catch (error) {
        console.error('Error checking contribution updates:', error);
        return false;
    }
}

// 添加手动刷新贡献数据的函数
async function refreshContributionData() {
    try {
        const refreshButton = document.querySelector('.refresh-button');
        if (refreshButton) {
            // 添加加载状态
            refreshButton.classList.add('loading');
            refreshButton.disabled = true;
        }
        
        // 获取当前选择的年份，如果没有保存则使用当前年份
        const savedYear = localStorage.getItem('selected-contribution-year');
        const currentYear = new Date().getFullYear();
        const yearToRefresh = savedYear ? parseInt(savedYear) : currentYear;
        
        console.log('手动刷新贡献数据...', yearToRefresh);
        
        // 清除所有相关的缓存，强制重新获取数据
        const cacheKey = `contribution_data_${yearToRefresh}`;
        const cacheTimestampKey = `contribution_timestamp_${yearToRefresh}`;
        
        // 清除当前年份的缓存
        localStorage.removeItem(cacheKey);
        localStorage.removeItem(cacheTimestampKey);
        
        // 清除所有可能的贡献数据缓存（以防万一）
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('contribution_data_') || key.startsWith('contribution_timestamp_'))) {
                localStorage.removeItem(key);
                console.log('清除缓存:', key);
            }
        }
        
        // 强制刷新当前选择年份的数据
        const { contributionData: data, activityData } = await fetchContributionData(yearToRefresh, true);
        
        // 更新页面显示
        await updateContributionDisplay(data, activityData, yearToRefresh);
        
        // 显示刷新成功提示
        showRefreshToast('数据已更新');
        
    } catch (error) {
        console.error('Error refreshing contribution data:', error);
        showRefreshToast('更新失败，请稍后重试', 'error');
    } finally {
        // 移除加载状态
        const refreshButton = document.querySelector('.refresh-button');
        if (refreshButton) {
            refreshButton.classList.remove('loading');
            refreshButton.disabled = false;
        }
    }
}

// 添加更新贡献显示的辅助函数
async function updateContributionDisplay(data, activityData, year) {
    const content = document.querySelector('.contributions');
    if (!content) return;

    const totalContributions = data.reduce((sum, day) => sum + day.contributions, 0);

    // 更新标题
    const header = content.querySelector('.contribution-header h2');
    if (header) {
        header.textContent = `${totalContributions} contributions in ${year}`;
    }

    // 更新年份选择器的值
    const yearSelect = content.querySelector('.year-select');
    if (yearSelect) {
        yearSelect.value = year;
    }

    // 更新贡献网格
    const grid = content.querySelector('.contribution-grid');
    if (grid) {
        grid.innerHTML = data.map(day => {
            const date = day.date instanceof Date ? day.date : new Date(day.date);
            return `
            <div class="contribution-cell" 
                data-level="${day.level}"
                title="${date.toLocaleDateString()} - ${day.contributions} contributions">
            </div>
        `}).join('');
    }

    // 更新活动时间线
    const timeline = content.querySelector('.activity-timeline');
    if (timeline) {
        timeline.innerHTML = renderActivityTimeline(data, activityData);
    }
}

// 添加显示刷新提示的函数
function showRefreshToast(message, type = 'success') {
    // 移除现有的提示
    const existingToast = document.querySelector('.refresh-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `refresh-toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <svg class="toast-icon" viewBox="0 0 16 16" width="16" height="16">
                ${type === 'success' ? 
                    '<path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>' :
                    '<path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm3.82 1.636a.75.75 0 0 1 1.038.175l.007.009c.103.118.22.222.35.31.264.178.683.37 1.285.37.602 0 1.02-.192 1.285-.371.13-.088.247-.192.35-.31l.007-.008a.75.75 0 0 1 1.222.87l-.614-.431c.614.43.614.431.613.431v.001l-.001.002-.002.003-.005.007-.014.019a1.984 1.984 0 0 1-.184.213c-.16.166-.338.316-.53.445-.63.418-1.37.638-2.127.629-.946 0-1.652-.308-2.126-.63a3.32 3.32 0 0 1-.715-.657 2.248 2.248 0 0 1-.207-.23l-.01-.013-.004-.006-.002-.003v-.002h-.001l.613-.432-.614.43a.75.75 0 0 1 .183-1.044ZM12 6a.75.75 0 0 1-.75.75h-6.5a.75.75 0 0 1 0-1.5h6.5A.75.75 0 0 1 12 6Z"></path>'
                }
            </svg>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // 自动隐藏
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// 修改渲染活动时间线的函数，添加 activities 参数
function renderActivityTimeline(data, activities = null) {
    // 重置全局计数器和状态
    currentVisibleActivityCount = 5;
    lastExpandedCount = 5;
    
    // 确保收起按钮被隐藏（避免前一个视图的状态残留）
    setTimeout(() => {
        const collapseButton = document.querySelector('.collapse-button');
        if (collapseButton) {
            collapseButton.style.display = 'none';
        }
    }, 100);
    
    // 如果没有提供活动数据，使用空对象
    const effectiveActivities = activities || {};

    let timelineHtml = '';
    let totalActivityItems = 0; // This variable tracks the total count of actual activity items for 'Show more' button logic.
    let visibleActivityItems = 0; // 跟踪可见的活动项数量

    // 设置初始显示的活动数量
    const initialVisibleCount = 5;

    // Sort months in descending order (most recent first) for display
    const sortedMonths = Object.keys(effectiveActivities).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateB - dateA;
    });

    // 创建一个平面化的活动列表，用于计算前5个活动
    let allActivities = [];
    sortedMonths.forEach(month => {
        effectiveActivities[month].forEach(activity => {
            allActivities.push({
                month,
                activity
            });
        });
    });

    sortedMonths.forEach(month => {
        const monthActivities = effectiveActivities[month];
        
        // 对月份内的活动进行时间倒序排序，确保最新的活动显示在最前面
        const sortedMonthActivities = [...monthActivities].sort((a, b) => {
            // 解析日期字符串进行比较
            const dateA = new Date(a.date + ' ' + new Date().getFullYear());
            const dateB = new Date(b.date + ' ' + new Date().getFullYear());
            return dateB - dateA; // 倒序排列，最新的在前
        });
        
        let monthContentHtml = '';
        let hideMonthClass = ''; // Class to hide month if it's beyond the first few activities

        if (sortedMonthActivities.length === 0) {
            // If no activities for this specific month, display the "no activity" message
            monthContentHtml = `
                <div class="activity-item">
                    <div class="activity-icon">
                        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-dash">
                            <path d="M2.75 7.75h10.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5Z"></path>
                        </svg>
                    </div>
                    <div class="activity-content">
                        <div class="activity-header">
                            yuazhi has no activity yet for this period.
                        </div>
                    </div>
                </div>
            `;
            // Do not increment totalActivityItems for this placeholder
        } else {
            // Generate HTML for all activities in this month
            monthContentHtml = sortedMonthActivities.map(activity => {
                // 跳过 star 类型的活动
                if (activity.type === 'star') {
                    return null;
                }
                
                // Increment totalActivityItems for each actual activity item
                totalActivityItems++;
                
                // 确定这个活动是否应该被隐藏
                const shouldBeVisible = visibleActivityItems < initialVisibleCount;
                if (shouldBeVisible) {
                    visibleActivityItems++;
                }
                
                const activityItemClass = shouldBeVisible ? '' : 'hidden-activity-item';

                // 根据不同的活动类型返回不同的HTML
                let activityHtml = '';
                
                switch(activity.type) {
                    case 'commit':
                        activityHtml = `
                            <div class="activity-item ${activityItemClass}">
                                <div class="activity-icon">
                                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                                        <path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"></path>
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-header">
                                        ${activity.description}
                                    </div>
                                    <div class="activity-details">
                                        <a href="https://github.com/${GITHUB_USERNAME}/${activity.repo}" target="_blank" class="repo-link">
                                            ${activity.repo}
                                        </a>
                                        ${activity.branch ? `
                                            <span class="branch-tag">
                                                <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="12" height="12">
                                                    <path d="M3.75 1.5a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5H3.75Zm6.75.75V4.25c0 .138.112.25.25.25H12.5v7h-9V2.25h6.5V2.25ZM5 3.25a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1-.75-.75Zm0 2.5a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Zm0 2.5a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"></path>
                                                </svg>
                                                ${activity.branch}
                                            </span>
                                        ` : ''}
                                        ${activity.sha ? `
                                            <span class="commit-sha">
                                                <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="12" height="12">
                                                    <path d="M1.643 3.143 8 9.5l6.357-6.357A.75.75 0 0 0 13.643 2.5L8 8.157 2.357 2.5a.75.75 0 0 0-1.714.643Z"></path>
                                                </svg>
                                                ${activity.sha}
                                            </span>
                                        ` : ''}
                                        <span class="activity-date">${activity.date}</span>
                                    </div>
                                    ${activity.commitMessages && activity.commitMessages.length > 0 ? `
                                        <div class="commit-messages">
                                            ${activity.commitMessages.map(message => `
                                                <div class="commit-message-item">
                                                    <span class="commit-message-text">${message.length > 50 ? message.substring(0, 50) + '...' : message}</span>
                                                </div>
                                            `).join('')}
                                            ${activity.count > 3 ? `
                                                <div class="commit-message-item">
                                                    <span class="commit-message-text">... and ${activity.count - 3} more commits</span>
                                                </div>
                                            ` : ''}
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        `;
                        break;
                    case 'create':
                        activityHtml = `
                            <div class="activity-item ${activityItemClass}">
                                <div class="activity-icon">
                                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                                        <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-header">
                                        ${activity.description}
                                    </div>
                                    <div class="activity-details">
                                        <a href="https://github.com/${GITHUB_USERNAME}/${activity.repo}" target="_blank" class="repo-link">
                                            ${GITHUB_USERNAME}/${activity.repo}
                                        </a>
                                        <span class="language-tag">
                                            <span class="language-dot" style="background-color: var(--color-${normalizeLangName(activity.language)}, var(--color-default));"></span>
                                            ${activity.language}
                                        </span>
                                        <span class="activity-date">${activity.date}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        break;
                    case 'issue':
                        activityHtml = `
                            <div class="activity-item ${activityItemClass}">
                                <div class="activity-icon">
                                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                                        <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-header">
                                        ${activity.description}
                                    </div>
                                    <div class="activity-details">
                                        <a href="https://github.com/${GITHUB_USERNAME}/${activity.repo}" target="_blank" class="repo-link">
                                            ${activity.repo}
                                        </a>
                                        <span class="activity-date">${activity.date}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        break;
                    case 'pr':
                        activityHtml = `
                            <div class="activity-item ${activityItemClass}">
                                <div class="activity-icon">
                                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                                        <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"></path>
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-header">
                                        ${activity.description}
                                    </div>
                                    <div class="activity-details">
                                        <a href="https://github.com/${GITHUB_USERNAME}/${activity.repo}" target="_blank" class="repo-link">
                                            ${activity.repo}
                                        </a>
                                        <span class="activity-date">${activity.date}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        break;
                    case 'comment':
                        activityHtml = `
                            <div class="activity-item ${activityItemClass}">
                                <div class="activity-icon">
                                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                                        <path d="M1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v7.5A1.75 1.75 0 0 1 13.25 12H9.06l-2.573 2.573A1.458 1.458 0 0 1 4 13.543V12H2.75A1.75 1.75 0 0 1 1 10.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h4.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-header">
                                        ${activity.description}
                                    </div>
                                    <div class="activity-details">
                                        <a href="https://github.com/${GITHUB_USERNAME}/${activity.repo}" target="_blank" class="repo-link">
                                            ${activity.repo}
                                        </a>
                                        <span class="activity-date">${activity.date}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        break;
                    case 'review':
                        activityHtml = `
                            <div class="activity-item ${activityItemClass}">
                                <div class="activity-icon">
                                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm4.936-2.41 4.189 3.348a.75.75 0 0 1 0 1.124l-4.19 3.348a.75.75 0 0 1-1.186-.61V6.2a.75.75 0 0 1 1.186-.61Z"></path>
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-header">
                                        ${activity.description}
                                    </div>
                                    <div class="activity-details">
                                        <a href="https://github.com/${GITHUB_USERNAME}/${activity.repo}" target="_blank" class="repo-link">
                                            ${activity.repo}
                                        </a>
                                        <span class="activity-date">${activity.date}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        break;
                    case 'star':
                        // 跳过 star 类型的活动，不显示
                        break;
                    case 'fork':
                        activityHtml = `
                            <div class="activity-item ${activityItemClass}">
                                <div class="activity-icon">
                                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                                        <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-header">
                                        ${activity.description}
                                    </div>
                                    <div class="activity-details">
                                        ${activity.originalRepo ? `
                                            <a href="https://github.com/${activity.originalRepo}" target="_blank" class="repo-link">
                                                ${activity.originalRepo}
                                            </a>
                                            <span class="fork-arrow">→</span>
                                        ` : ''}
                                        <a href="https://github.com/${GITHUB_USERNAME}/${activity.repo}" target="_blank" class="repo-link">
                                            ${GITHUB_USERNAME}/${activity.repo}
                                        </a>
                                        <span class="activity-date">${activity.date}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        break;
                    case 'branch':
                        activityHtml = `
                            <div class="activity-item ${activityItemClass}">
                                <div class="activity-icon">
                                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                                        <path d="M3.75 1.5a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5H3.75Zm6.75.75V4.25c0 .138.112.25.25.25H12.5v7h-9V2.25h6.5V2.25ZM5 3.25a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1-.75-.75Zm0 2.5a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Zm0 2.5a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"></path>
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-header">
                                        ${activity.description}
                                    </div>
                                    <div class="activity-details">
                                        <a href="https://github.com/${GITHUB_USERNAME}/${activity.repo}" target="_blank" class="repo-link">
                                            ${activity.repo}
                                        </a>
                                        <span class="activity-date">${activity.date}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        break;
                    case 'delete':
                        activityHtml = `
                            <div class="activity-item ${activityItemClass}">
                                <div class="activity-icon">
                                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                                        <path d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.75.75 0 0 0 1.493.154l.825-4.25a.75.75 0 0 1 1.494.154l.825 4.25a.75.75 0 0 0 1.493-.154l.66-6.6a.75.75 0 0 1 1.494.154l.66 6.6A2.25 2.25 0 0 1 13.174 15H2.826a2.25 2.25 0 0 1-2.065-2.171l-.66-6.6a.75.75 0 0 1 1.494-.154ZM6 1.75V3h4V1.75a.25.25 0 0 0-.25-.25h-3.5a.25.25 0 0 0-.25.25Z"></path>
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-header">
                                        ${activity.description}
                                    </div>
                                    <div class="activity-details">
                                        <a href="https://github.com/${GITHUB_USERNAME}/${activity.repo}" target="_blank" class="repo-link">
                                            ${activity.repo}
                                        </a>
                                        <span class="activity-date">${activity.date}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        break;
                    case 'release':
                        activityHtml = `
                            <div class="activity-item ${activityItemClass}">
                                <div class="activity-icon">
                                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                                        <path d="M8.177.677l2.896 2.896a.25.25 0 0 1 0 .354L8.177 6.823l-2.896-2.896a.25.25 0 0 1 0-.354l2.896-2.896zM1.25 7.5l2.896 2.896a.25.25 0 0 1 0 .354L1.25 13.677l-2.896-2.896a.25.25 0 0 1 0-.354L1.25 7.5zM14.75 7.5l2.896 2.896a.25.25 0 0 1 0 .354L14.75 13.677l-2.896-2.896a.25.25 0 0 1 0-.354L14.75 7.5z"></path>
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-header">
                                        ${activity.description}
                                    </div>
                                    <div class="activity-details">
                                        <a href="https://github.com/${GITHUB_USERNAME}/${activity.repo}" target="_blank" class="repo-link">
                                            ${activity.repo}
                                        </a>
                                        <span class="activity-date">${activity.date}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        break;
                    case 'wiki':
                        activityHtml = `
                            <div class="activity-item ${activityItemClass}">
                                <div class="activity-icon">
                                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                                        <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25Zm7.47 3.97a.75.75 0 0 1 1.06 0l2 2a.75.75 0 0 1 0 1.06l-2 2a.75.75 0 1 1-1.06-1.06l1.47-1.47H6.75a.75.75 0 0 1 0-1.5h3.69L9.22 6.28a.75.75 0 0 1 0-1.06Z"></path>
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-header">
                                        ${activity.description}
                                    </div>
                                    <div class="activity-details">
                                        <a href="https://github.com/${GITHUB_USERNAME}/${activity.repo}" target="_blank" class="repo-link">
                                            ${activity.repo}
                                        </a>
                                        <span class="activity-date">${activity.date}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        break;
                    default: // Handle other event types not explicitly covered
                        activityHtml = `
                            <div class="activity-item ${activityItemClass}">
                                <div class="activity-icon">
                                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                                        <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-header">
                                        ${activity.description || 'GitHub Activity'}
                                    </div>
                                    <div class="activity-details">
                                        <a href="https://github.com/${GITHUB_USERNAME}/" target="_blank" class="repo-link">
                                            ${GITHUB_USERNAME}
                                        </a>
                                        <span class="activity-date">${activity.date || ''}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                }
                
                return activityHtml;
            }).filter(item => item !== null).join('');
        }

        // Append the month container with its content
        timelineHtml += `
            <div class="activity-month">
                <div class="activity-month-header">
                    <h3>${formatMonth(month)}</h3>
                </div>
                ${monthContentHtml}
            </div>
        `;
    });

    // Handle the case where there are absolutely no activities for any month in effectiveActivities.
    // This block should only execute if `sortedMonths` is empty.
    if (sortedMonths.length === 0) {
        timelineHtml = `
            <div class="activity-month">
                <div class="activity-month-header">
                    <h3>No activity</h3>
                </div>
                <div class="activity-item">
                    <div class="activity-icon">
                        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-dash">
                            <path d="M2.75 7.75h10.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5Z"></path>
                        </svg>
                    </div>
                    <div class="activity-content">
                        <div class="activity-header">
                            This user doesn't have any public activity yet.
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // The show more button logic should check against the total number of actual activity items
    if (totalActivityItems > initialVisibleCount) {
        const nextBatch = Math.min(activityIncrement, totalActivityItems - initialVisibleCount);
        timelineHtml += `
            <div class="show-more">
                <div class="button-group">
                    <button class="show-more-button activity-action-btn" onclick="toggleActivity(event)">
                        Show ${nextBatch} more activities
                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                            <path fill="currentColor" d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"></path>
                        </svg>
                    </button>
                    <button class="collapse-button activity-action-btn" onclick="collapseActivity(event)" style="display: none;">
                        <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                            <path fill="currentColor" d="M3.22 10.53a.749.749 0 0 1 0-1.06l4.25-4.25a.749.749 0 0 1 1.06 0l4.25 4.25a.749.749 0 1 1-1.06 1.06L8 6.811 4.28 10.53a.749.749 0 0 1-1.06 0Z"></path>
                    </svg>
                </button>
                </div>
            </div>
        `;
    }

    return timelineHtml;
}

// 添加计算代码审查统计数据的函数
function calculateCodeReviewStats(activityData) {
    let totalCommits = 0;
    let totalIssues = 0;
    let totalPullRequests = 0;
    let totalReviews = 0;
    let totalActivities = 0;

    // 遍历所有月份的活动数据
    Object.values(activityData).forEach(monthActivities => {
        monthActivities.forEach(activity => {
            totalActivities++;
            
            switch (activity.type) {
                case 'commit':
                    // 对于commit类型，使用实际的提交数量
                    totalCommits += activity.count || 1;
                    break;
                case 'issues':
                case 'issue':
                    totalIssues++;
                    break;
                case 'pullrequest':
                case 'pull_request':
                case 'pr':
                    totalPullRequests++;
                    break;
                case 'review':
                case 'pullrequest_review':
                    totalReviews++;
                    break;
                case 'comment':
                    // 评论可以算作代码审查的一部分
                    totalReviews++;
                    break;
                case 'fork':
                case 'star':
                    // 这些活动不计入代码审查统计
                    totalActivities--; // 减去因为不计入统计而增加的计数
                    break;
                default:
                    // 对于未知类型，根据description判断
                    if (activity.description) {
                        const desc = activity.description.toLowerCase();
                        if (desc.includes('commit')) {
                            totalCommits++;
                        } else if (desc.includes('issue')) {
                            totalIssues++;
                        } else if (desc.includes('pull request') || desc.includes('pr')) {
                            totalPullRequests++;
                        } else if (desc.includes('review') || desc.includes('comment')) {
                            totalReviews++;
                        } else {
                            totalActivities--; // 不计入统计的活动
                        }
                    } else {
                        totalActivities--; // 不计入统计的活动
                    }
                    break;
            }
        });
    });

    // 计算总数（避免除零）
    const totalCount = totalCommits + totalIssues + totalPullRequests + totalReviews;
    
    if (totalCount === 0) {
        return {
            commitsPercentage: 50,  // 没有数据时显示默认值
            issuesPercentage: 50,
            pullRequestsPercentage: 0,
            reviewsPercentage: 0,
            totalCount: 0,
            totalCommits: 0,
            totalIssues: 0,
            totalPullRequests: 0,
            totalReviews: 0
        };
    }

    // 计算百分比
    const commitsPercentage = Math.round((totalCommits / totalCount) * 100);
    const issuesPercentage = Math.round((totalIssues / totalCount) * 100);
    const pullRequestsPercentage = Math.round((totalPullRequests / totalCount) * 100);
    const reviewsPercentage = Math.round((totalReviews / totalCount) * 100);

    console.log('代码审查统计:', {
        totalCommits,
        totalIssues,
        totalPullRequests,
        totalReviews,
        totalCount,
        commitsPercentage,
        issuesPercentage,
        pullRequestsPercentage,
        reviewsPercentage
    });

    return {
        commitsPercentage,
        issuesPercentage,
        pullRequestsPercentage,
        reviewsPercentage,
        totalCount,
        totalCommits,
        totalIssues,
        totalPullRequests,
        totalReviews
    };
}

// 修改渲染贡献图的函数
async function renderContributionGraph() {
    // 获取保存的年份，如果没有则使用当前年份
    const savedYear = localStorage.getItem('selected-contribution-year');
    const currentYear = new Date().getFullYear();
    const selectedYear = savedYear ? parseInt(savedYear) : currentYear;
    
    // 使用辅助函数获取有效年份范围
    const validYears = getValidYears();
    
    // 确保选择的年份在有效范围内
    const yearToUse = validYears.includes(selectedYear) ? selectedYear : currentYear;
    
    const { contributionData: data, activityData } = await fetchContributionData(yearToUse);
    const totalContributions = data.reduce((sum, day) => sum + day.contributions, 0);
    
    // 计算真实的代码审查统计数据
    const codeReviewStats = calculateCodeReviewStats(activityData);
    
    // 动态生成年份选项的HTML
    const yearOptionsHTML = validYears.map(year => 
        `<option value="${year}" ${yearToUse === year ? 'selected' : ''}>${year}</option>`
    ).join('');
    
    return `
        <div class="contributions">
            <div class="contribution-header">
                <div class="contribution-title-group">
                    <h2>${totalContributions} contributions in ${yearToUse}</h2>
                    <div class="contribution-controls">
                        <div class="year-select-container">
                            <select class="year-select" onchange="updateContributionYear(this.value)">
                                ${yearOptionsHTML}
                            </select>
                        </div>
                        <button class="refresh-button" onclick="refreshContributionData()" title="刷新贡献数据">
                            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                                <path d="M8 3a5 5 0 0 0-5 5H1l3.5 3.5L8 8H6a2 2 0 1 1 2 2v2a4 4 0 1 0-4-4H2a6 6 0 1 1 6 6v-2a4 4 0 0 0 0-8Z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="contribution-calendar">
                <div class="contribution-grid">
                    ${data.map(day => {
                        const date = day.date instanceof Date ? day.date : new Date(day.date);
                        const formattedDate = date.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            weekday: 'long'
                        });
                        const contributionText = day.contributions === 0 ? 'No contributions' : 
                                               day.contributions === 1 ? '1 contribution' : 
                                               `${day.contributions} contributions`;
                        return `
                        <div class="contribution-cell" 
                            data-level="${day.level}"
                            data-date="${date.toISOString()}"
                            data-contributions="${day.contributions}"
                            onmouseenter="showContributionTooltip(event, '${formattedDate}', ${day.contributions})"
                            onmouseleave="hideContributionTooltip()">
                        </div>
                    `}).join('')}
                </div>
                <div class="contribution-legend">
                    <span>Less</span>
                    ${[0, 1, 2, 3, 4].map(level => 
                        `<div class="legend-item" data-level="${level}"></div>`).join('')}
                    <span>More</span>
                </div>

                <div class="code-review-chart">
                    <div class="code-review-line vertical"></div>
                    <div class="code-review-line horizontal"></div>
                    <div class="code-review-marker" style="left: 25%; top: 50%"></div>
                    <div class="code-review-marker" style="left: 50%; top: 25%"></div>
                    <div class="code-review-marker" style="left: 75%; top: 50%"></div>
                    <div class="code-review-marker" style="left: 50%; top: 75%"></div>
                    <div class="code-review-label top">Code review</div>
                    <div class="code-review-label bottom">Pull requests</div>
                    <div class="code-review-percentage commits">${codeReviewStats.commitsPercentage}% Commits (${codeReviewStats.totalCommits})</div>
                    <div class="code-review-percentage issues">${codeReviewStats.issuesPercentage}% Issues (${codeReviewStats.totalIssues})</div>
                    ${codeReviewStats.totalPullRequests > 0 ? `<div class="code-review-percentage pull-requests">${codeReviewStats.pullRequestsPercentage}% PRs (${codeReviewStats.totalPullRequests})</div>` : ''}
                    ${codeReviewStats.totalReviews > 0 ? `<div class="code-review-percentage reviews">${codeReviewStats.reviewsPercentage}% Reviews (${codeReviewStats.totalReviews})</div>` : ''}
                </div>
            </div>
            
            <div class="activity-timeline">
                ${renderActivityTimeline(data, activityData)}
            </div>
        </div>
    `;
}

// 修改更新年份的函数
async function updateContributionYear(year, forceRefresh = false) {
    try {
        const content = document.querySelector('.contributions');
        if (!content) return;

        // 验证年份是否有效
        if (!isValidYear(year)) {
            console.warn(`Invalid year: ${year}`);
            return;
        }

        // 保存选择的年份到 localStorage
        localStorage.setItem('selected-contribution-year', year);

        // 更新年份选择器的值
        const yearSelect = document.querySelector('.year-select');
        if (yearSelect) {
            yearSelect.value = year;
        }

        // 重新获取并渲染贡献数据
        const { contributionData: data, activityData } = await fetchContributionData(year, forceRefresh);
        const totalContributions = data.reduce((sum, day) => sum + day.contributions, 0);

        // 计算真实的代码审查统计数据
        const codeReviewStats = calculateCodeReviewStats(activityData);

        // 更新标题
        const header = content.querySelector('.contribution-header h2');
        if (header) {
            header.textContent = `${totalContributions} contributions in ${year}`;
        }

        // 更新贡献网格
        const grid = content.querySelector('.contribution-grid');
        if (grid) {
            grid.innerHTML = data.map(day => {
                const date = day.date instanceof Date ? day.date : new Date(day.date);
                const formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                });
                return `
                <div class="contribution-cell" 
                    data-level="${day.level}"
                            data-date="${date.toISOString()}"
                            data-contributions="${day.contributions}"
                            data-tooltip-date="${formattedDate}"
                            data-tooltip-contributions="${day.contributions}">
                </div>
            `}).join('');
        }

        // 更新Code review统计数据
        const codeReviewChart = content.querySelector('.code-review-chart');
        if (codeReviewChart) {
            // 重新生成完整的Code review统计信息
            const percentageElements = `
                <div class="code-review-percentage commits">${codeReviewStats.commitsPercentage}% Commits (${codeReviewStats.totalCommits})</div>
                <div class="code-review-percentage issues">${codeReviewStats.issuesPercentage}% Issues (${codeReviewStats.totalIssues})</div>
                ${codeReviewStats.totalPullRequests > 0 ? `<div class="code-review-percentage pull-requests">${codeReviewStats.pullRequestsPercentage}% PRs (${codeReviewStats.totalPullRequests})</div>` : ''}
                ${codeReviewStats.totalReviews > 0 ? `<div class="code-review-percentage reviews">${codeReviewStats.reviewsPercentage}% Reviews (${codeReviewStats.totalReviews})</div>` : ''}
            `;
            
            // 清除旧的百分比元素并添加新的
            const oldPercentages = codeReviewChart.querySelectorAll('.code-review-percentage');
            oldPercentages.forEach(element => element.remove());
            
            // 添加新的百分比元素
            codeReviewChart.insertAdjacentHTML('beforeend', percentageElements);
        }

        // 更新活动时间线
        const timeline = content.querySelector('.activity-timeline');
        if (timeline) {
            timeline.innerHTML = renderActivityTimeline(data, activityData);
        }
    } catch (error) {
        console.error('Error updating contribution year:', error);
    }
}

// 修改渲染概览页面的函数
async function renderOverview() {
    const content = document.querySelector('.content-area');
    
    // 显示骨架屏
    showSkeletonLoading();
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
        // 获取最新的 GitHub 数据
        const repoDetails = await fetchGitHubData();
        
        // 获取贡献图数据
        const contributionGraph = await renderContributionGraph();
        
        // 生成活动图表
        const activityGraph = await generateActivityGraph();
        
        // 获取最新的非 fork 仓库，并且不是 yuazhi/yuazhi 仓库
        const mostRecentRepo = repoDetails.find(repo => !repo.is_fork && repo.name !== 'yuazhi' && repo.full_name !== 'yuazhi/yuazhi');
        
        // 为最新项目添加标识
        if (mostRecentRepo) {
            mostRecentRepo.isLatest = true;
        }
        
        // 获取所有使用的编程语言
        const allLanguages = new Set();
        repoDetails.forEach(repo => {
            if (repo.language) allLanguages.add(repo.language);
            if (repo.tags) repo.tags.forEach(tag => allLanguages.add(tag));
        });
        ['Python', 'TypeScript', 'Vue', 'React', 'Node.js', 'Dart', 'Rust', 'C++', 'C#'].forEach(lang => allLanguages.add(lang));
        
        // 为recent-projects部分准备项目数据，确保它们没有isLatest标识
        const recentProjects = repoDetails.slice(0, 2).map(repo => ({
            ...repo,
            isLatest: false // 明确设置为false，确保没有特殊样式
        }));
        
        content.innerHTML = `
            ${mostRecentRepo ? `
                <div class="ongoing-project-title">
                    <svg viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
                        <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
                    </svg>
                    最新项目
                </div>
                <div class="pinned-project">
                    ${renderProjectCard(mostRecentRepo)}
                </div>
            ` : ''}
            ${contributionGraph}
            <div class="github-activity-section">
                <h2 class="activity-title">GitHub Activity Graph</h2>
                <div class="activity-container">
                </div>
            </div>
            <div class="github-stats-section">
                <h2 class="stats-title">Contributions & Reactions</h2>
                <div class="stats-container">
                    <img src="https://hub.gitmirror.com/https://raw.githubusercontent.com/yuazhi/yuazhi/f33292b1b2812dbe789397126b2dd437455aac18/metrics.isocalendar.svg" 
                         alt="GitHub Contributions Calendar" 
                         class="github-stats-image"
                         loading="lazy">
                    <img src="https://hub.gitmirror.com/https://raw.githubusercontent.com/yuazhi/yuazhi/c2a0dd99dbf105e24a648037b126e4e7f30f845f/metrics.base.svg" 
                         alt="GitHub Base Metrics" 
                         class="github-stats-image"
                         loading="lazy">
                </div>
            </div>
            <div class="recent-projects">
                ${recentProjects.map(renderProjectCard).join('')}
            </div>
        `;
        
        // 初始化活动图表
        setTimeout(async () => {
            const activityContainer = content.querySelector('.activity-container');
            const activityGraph = await generateActivityGraph();
            activityContainer.appendChild(activityGraph);
            initActivityChart(activityContainer);
        }, 100);
        
    } catch (error) {
        console.error('Error rendering overview:', error);
        content.innerHTML = `
            <div class="blankslate">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <h3>加载失败</h3>
                <p>无法加载概览内容，请稍后重试</p>
            </div>
        `;
    } finally {
        await hideSkeletonLoading();
        initLightbox(); // 重新初始化灯箱
    }
}

// 修改渲染项目库页面的函数
async function renderProjects() {
    const content = document.querySelector('.content-area');
    
    try {
        // 显示骨架屏
        showSkeletonLoading();
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // 获取最新的 GitHub 数据
        const repoDetails = await fetchGitHubData();
        
        if (!repoDetails || repoDetails.length === 0) {
            content.innerHTML = `
                <div class="blankslate">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3>暂无项目</h3>
                    <p>还没有任何项目</p>
                </div>
            `;
            return;
        }
        
        // 渲染所有项目
        content.innerHTML = repoDetails.map(repo => renderProjectCard(repo)).join('');
    } catch (error) {
        console.error('Error rendering projects:', error);
        content.innerHTML = `
            <div class="blankslate">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <h3>加载失败</h3>
                <p>无法加载项目内容，请稍后重试</p>
            </div>
        `;
    } finally {
        await hideSkeletonLoading();
        initLightbox(); // 重新初始化灯箱
    }
}

// 修改微信二维码弹窗功能
function showWechat(event) {
    event.preventDefault();
    showQRCode('微信', 'https://cdn.rjjr.cn/avatar/IMG_0231.JPG', '扫码添加微信');
}

// 添加 QQ 二维码弹窗功能
function showQQ(event) {
    event.preventDefault();
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    const qrCodeUrl = isDarkMode ? 'https://cdn.rjjr.cn/avatar/IMG_0233.JPG' : 'https://cdn.rjjr.cn/assets/e1f67108d1e5ab51216cee6f503b878d.png';
    showQRCode('QQ', qrCodeUrl, '直接点击此处加好友', 'https://qm.qq.com/q/W2oxo3R3qy');
}

// 通用的二维码弹窗显示函数
function showQRCode(title, qrCodeUrl, description, linkUrl = null) {
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    
    // 创建弹窗
    const popup = document.createElement('div');
    popup.className = 'wechat-popup';
    
    // 根据是否有链接来决定描述文字的HTML
    const descriptionHtml = linkUrl 
        ? `<p><a href="${linkUrl}" target="_blank" rel="noopener">${description}</a></p>`
        : `<p>${description}</p>`;
    
    popup.innerHTML = `
        <img src="${qrCodeUrl}" alt="${title}二维码">
        ${descriptionHtml}
    `;
    
    // 添加到页面
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
    
    // 显示弹窗
    setTimeout(() => {
        popup.classList.add('show');
    }, 10);
    
    // 点击遮罩层关闭弹窗
    const closePopup = () => {
        popup.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(overlay);
            document.body.removeChild(popup);
        }, 300);
    };
    
    overlay.addEventListener('click', closePopup);
}

// 获取用户 Stars 的仓库
async function fetchStarredRepos() {
    try {
        const headers = {
            'Accept': 'application/vnd.github.v3+json'
        };
        
        if (GITHUB_TOKEN) {
            headers['Authorization'] = `token ${GITHUB_TOKEN}`;
        }

        const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/starred`, {
            headers: headers
        });
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const starredRepos = await response.json();

        // 获取每个仓库的详细信息
        const repoDetails = await Promise.all(starredRepos.map(async (repo) => {
            const languagesResponse = await fetch(repo.languages_url, {
                headers: headers
            });
            const languages = await languagesResponse.json();
            
            return {
                name: repo.name,
                full_name: repo.full_name,
                owner: {
                    login: repo.owner.login,
                    avatar_url: repo.owner.avatar_url
                },
                description: repo.description || '',
                language: repo.language,
                languages_url: repo.languages_url,
                languages: languages,
                html_url: repo.html_url,
                stargazers_count: repo.stargazers_count,
                forks_count: repo.forks_count,
                open_issues_count: repo.open_issues_count,
                created_at: repo.created_at,
                updated_at: repo.updated_at
            };
        }));

        return repoDetails;
    } catch (error) {
        console.error('Error fetching starred repos:', error);
        throw error; // 抛出错误而不是返回空数组
    }
}

// 修改渲染 Stars 页面的函数
async function renderStars() {
    const content = document.querySelector('.content-area');
    
    // 显示加载中
    showSkeletonLoading();
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
        const starredRepos = await fetchStarredRepos();
        
        if (starredRepos.length === 0) {
            content.innerHTML = `
                <div class="blankslate">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    <h3>没有加星标的仓库</h3>
                    <p>星标是跟踪您感兴趣的仓库的一种方式</p>
                </div>
            `;
            return;
        }

        // 只取最新的10个项目
        const latestRepos = starredRepos.slice(0, 10);

        const reposHtml = latestRepos.map(repo => {
            // 统计信息
            const stats = `
                <span class="repo-stat" title="Stars">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path></svg>
                    ${repo.stargazers_count}
                </span>
                <span class="repo-stat" title="Forks">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path></svg>
                    ${repo.forks_count}
                </span>
                <span class="repo-stat" title="Watchers">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16"><path d="M1.5 8s2.5-5.5 6.5-5.5S14.5 8 14.5 8s-2.5 5.5-6.5 5.5S1.5 8 1.5 8Zm6.5 4a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path></svg>
                    ${repo.watchers_count || 0}
                </span>
            `;

            // 底部信息
            const bottom = `
                ${repo.language ? `
                    <span class="repo-lang">
                        <span class="language-dot" style="background-color: var(--color-${normalizeLangName(repo.language)}, var(--color-default));"></span>
                        ${repo.language}
                    </span>
                ` : ''}
                <span class="repo-license">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16"><path d="M1.5 2.75A.75.75 0 0 1 2.25 2h11.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75H2.25a.75.75 0 0 1-.75-.75V2.75Zm1 .75v9.5h11V3.5H2.5Z"></path></svg>
                    ${repo.license?.spdx_id || 'MIT'}
                </span>
                <span class="repo-updated">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16"><path d="M1.643 3.143 L.427 1.927 A.25.25 0 0 0 0 2.104 V5.75 c0 .138.112.25.25.25 h3.646 a.25.25 0 0 0 .177-.427 L2.715 4.215 a6.5 6.5 0 1 1-1.18 4.458.75.75 0 1 0-1.493.154 A8.001 8.001 0 1 0 8 0a7.964 7.964 0 0 0-6.357 3.143 z"></path></svg>
                    Updated ${timeAgo(new Date(repo.updated_at))}
                </span>
            `;

            // Open issues
            const openIssues = `
                <span class="repo-issues" style="${repo.open_issues_count === 0 ? 'color: var(--text-secondary);' : ''}">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16"><path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path></svg>
                    <span class="issues-count">${repo.open_issues_count}</span> open issues
                </span>
            `;

            // 创建时间
            const created = new Date(repo.created_at).toLocaleDateString();

            return `
            <div class="repo-card" onclick="showProjectDetail('${repo.full_name}')">
                <div class="repo-header-row">
                    <a class="repo-title" href="${repo.html_url}" target="_blank">${repo.full_name}</a>
                    <span class="repo-created">Created ${created}</span>
                </div>
                <div class="repo-description">${repo.description || 'No description available'}</div>
                <div class="repo-stats-row">${stats}</div>
                <div class="repo-bottom">${bottom}</div>
                <div class="repo-extra">
                    ${openIssues}
                </div>
            </div>
            `;
        }).join('');

        content.innerHTML = reposHtml;
    } catch (error) {
        console.error('Error rendering stars:', error);
        content.innerHTML = `
            <div class="blankslate">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <h3>加载失败</h3>
                <p>无法加载已加星标的存储库，请稍后重试</p>
            </div>
        `;
    } finally {
        // 隐藏加载中
        await hideSkeletonLoading();
        initLightbox(); // 重新初始化灯箱
    }
}

// 添加获取项目详情的函数
async function fetchProjectDetail(projectName) {
    try {
        const headers = {
            'Accept': 'application/vnd.github.v3+json'
        };
        
        if (GITHUB_TOKEN) {
            headers['Authorization'] = `token ${GITHUB_TOKEN}`;
        }

        // 如果 projectName 包含 '/'，说明是完整的仓库名称
        const [owner, repo] = projectName.includes('/') ? projectName.split('/') : [GITHUB_USERNAME, projectName];
        
        // 验证仓库名称，避免特殊字符导致的API错误
        const cleanOwner = owner.replace(/[^a-zA-Z0-9._-]/g, '');
        const cleanRepo = repo.replace(/[^a-zA-Z0-9._-]/g, '');
        
        if (!cleanOwner || !cleanRepo) {
            throw new Error(`无效的仓库名称: ${owner}/${repo}`);
        }

        // 获取仓库详细信息
        const repoResponse = await fetch(`${GITHUB_API_BASE}/repos/${cleanOwner}/${cleanRepo}`, { headers });
        if (!repoResponse.ok) {
            throw new Error(`Failed to fetch repository: ${repoResponse.status}`);
        }
        const repoData = await repoResponse.json();

        // 获取语言统计
        const languagesResponse = await fetch(repoData.languages_url, { headers });
        const languages = await languagesResponse.json();

        // 获取最近的提交
        let commits = [];
        try {
            const commitsResponse = await fetch(`${GITHUB_API_BASE}/repos/${cleanOwner}/${cleanRepo}/commits?per_page=5`, { headers });
            if (commitsResponse.ok) {
                commits = await commitsResponse.json();
            } else {
                console.warn(`无法获取仓库 ${cleanOwner}/${cleanRepo} 的提交信息: ${commitsResponse.status}`);
            }
        } catch (commitError) {
            console.warn(`获取仓库 ${cleanOwner}/${cleanRepo} 提交信息时出错:`, commitError);
        }

        // 获取README内容
        let readme = null;
        try {
            const readmeResponse = await fetch(`${GITHUB_API_BASE}/repos/${cleanOwner}/${cleanRepo}/readme`, { headers });
            if (readmeResponse.ok) {
                const readmeData = await readmeResponse.json();
                // 使用 decodeURIComponent 和 escape 来正确处理中文内容
                readme = decodeURIComponent(escape(atob(readmeData.content)));
            }
        } catch (error) {
            console.log('No README found');
        }

        return {
            ...repoData,
            languages,
            commits,
            readme
        };
    } catch (error) {
        console.error('Error fetching project detail:', error);
        return null;
    }
}

// 添加显示项目详情的函数
async function showProjectDetail(projectName) {
    // 立即创建并显示模态框和骨架屏
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.innerHTML = `
        <div class="project-modal-header">
            <div class="project-modal-title">
                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
                    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
                </svg>
                <span class="repo-link">${GITHUB_USERNAME} / ${projectName}</span>
            </div>
            <div class="project-modal-actions">
                <button class="project-modal-close" onclick="closeProjectModal()">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                        <path d="M5.293 5.293a1 1 0 0 1 1.414 0L12 10.586l5.293-5.293a1 1 0 1 1 1.414 1.414L13.414 12l5.293 5.293a1 1 0 0 1-1.414 1.414L12 13.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L10.586 12 5.293 6.707a1 1 0 0 1 0-1.414z"/>
                    </svg>
                </button>
            </div>
        </div>
        <div class="project-modal-body">
            <div class="skeleton-wrapper">
                <div class="skeleton-card skeleton"></div>
                <div class="skeleton-title skeleton"></div>
                <div class="skeleton-text skeleton"></div>
                <div class="skeleton-text skeleton"></div>
                <div class="skeleton-text skeleton"></div>
                <div class="skeleton-text skeleton"></div>
            </div>
        </div>
    `;

    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.addEventListener('click', closeProjectModal);

    // 添加到页面
    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    // 显示模态框
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);

    try {
        // 获取项目数据
        const projectData = await fetchProjectDetail(projectName);
        if (!projectData) {
            throw new Error('Failed to fetch project details');
        }

        // 计算语言百分比
        const totalBytes = Object.values(projectData.languages).reduce((a, b) => a + b, 0);
        const languagesWithPercentage = Object.entries(projectData.languages)
            .map(([name, bytes]) => ({
                name,
                bytes,
                percentage: (bytes / totalBytes) * 100
            }))
            .sort((a, b) => b.percentage - a.percentage)
            .map(lang => ({
                ...lang,
                percentage: lang.percentage.toFixed(1)
            }));

        // 辅助函数：规范化语言名称为CSS变量名
        function normalizeLangName(name) {
            if (!name) return 'default';
            return name.toLowerCase()
                .replace(/\+/g, 'p')
                .replace(/#/g, 'sharp')
                .replace(/\./g, 'dot')
                .replace(/-/g, '')
                .replace(/\s+/g, '');
        }

        // 创建语言条形图
        const languageBar = languagesWithPercentage
            .filter(lang => parseFloat(lang.percentage) >= 0.1)
            .map(lang => {
                const langNameLower = normalizeLangName(lang.name);
                return `
                <div class="language-bar-item" 
                    style="width: ${lang.percentage}%; background-color: var(--color-${langNameLower}, var(--color-default));" 
                    title="${lang.name} ${lang.percentage}%">
                </div>
            `;
            }).join('');

        // 更新模态框内容
        modal.innerHTML = `
            <div class="project-modal-header">
                <div class="project-modal-title">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
                        <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
                    </svg>
                    <a href="${projectData.html_url}" target="_blank" class="repo-link">
                        ${GITHUB_USERNAME} / ${projectData.name}
                    </a>
                </div>
                <div class="project-modal-actions">
                    <a href="${projectData.html_url}" target="_blank" class="github-button">
                        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
                            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                        </svg>
                        View on GitHub
                    </a>
                    <button class="project-modal-close" onclick="closeProjectModal()">
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <path d="M5.293 5.293a1 1 0 0 1 1.414 0L12 10.586l5.293-5.293a1 1 0 1 1 1.414 1.414L13.414 12l5.293 5.293a1 1 0 0 1-1.414 1.414L12 13.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L10.586 12 5.293 6.707a1 1 0 0 1 0-1.414z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="project-modal-body">
                <div class="project-info-section">
                    <p class="project-description">${projectData.description || '暂无描述'}</p>
                    
                    <div class="project-meta">
                        <div class="project-meta-item">
                            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
                                <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
                            </svg>
                            ${projectData.stargazers_count} stars
                        </div>
                        <div class="project-meta-item">
                            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
                                <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
                            </svg>
                            ${projectData.forks_count} forks
                        </div>
                        <div class="project-meta-item">
                            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
                                <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
                            </svg>
                            ${projectData.open_issues_count} issues
                        </div>
                        <div class="project-meta-item">
                            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
                                <path d="M2 1.75C2 .784 2.784 0 3.75 0h8.5C13.216 0 14 .784 14 1.75v5a1.75 1.75 0 0 1-1.75 1.75h-8.5A1.75 1.75 0 0 1 2 6.75v-5Zm1.75-.25a.25.25 0 0 0-.25.25v5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-5a.25.25 0 0 0-.25-.25h-8.5ZM0 11.25c0-.966.784-1.75 1.75-1.75h12.5c.966 0 1.75.784 1.75 1.75v3A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25v-3Zm1.75-.25a.25.25 0 0 0-.25.25v3c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-3a.25.25 0 0 0-.25-.25H1.75Z"></path>
                            </svg>
                            ${(projectData.size / 1024).toFixed(1)} MB
                        </div>
                    </div>

                    ${languagesWithPercentage.length > 0 ? `
                        <div class="project-languages-section">
                            <div class="language-bar">
                                ${languageBar}
                            </div>
                            <div class="language-list">
                                ${languagesWithPercentage.map(lang => {
                                    const langNameLower = normalizeLangName(lang.name);
                                    return `
                                    <div class="language-item">
                                        <span class="language-color" style="background-color: var(--color-${langNameLower}, var(--color-default));"></span>
                                        <span class="language-name">${lang.name}</span>
                                        <span class="language-percentage">${lang.percentage}%</span>
                                    </div>
                                `;
                                }).join('')}
                            </div>
                        </div>
                    ` : '<div class="no-content">暂无语言统计信息</div>'}

                    ${projectData.commits && projectData.commits.length > 0 ? `
                        <div class="project-section">
                            <h3 class="section-title">Recent Commits</h3>
                            <div class="commits-list">
                                ${projectData.commits.map(commit => `
                                    <div class="commit-item">
                                        <div class="commit-header">
                                            <img class="commit-avatar" src="${commit.author?.avatar_url || 'https://github.com/identicons/default.png'}" alt="Author avatar">
                                            <div class="commit-info">
                                                <div class="commit-message">${commit.commit.message}</div>
                                                <div class="commit-meta">
                                                    <span class="commit-author">${commit.commit.author.name}</span>
                                                    committed on
                                                    <span class="commit-date">${new Date(commit.commit.author.date).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : '<div class="no-content">暂无提交记录</div>'}

                    ${projectData.readme ? `
                        <div class="project-section">
                            <h3 class="section-title">README</h3>
                            <div class="readme-content markdown-body">
                                ${marked.parse(projectData.readme)}
                            </div>
                        </div>
                    ` : '<div class="no-content">暂无 README 内容</div>'}
                </div>
            </div>
        `;

        // 初始化代码高亮
        modal.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    } catch (error) {
        console.error('Error loading project details:', error);
        modal.querySelector('.project-modal-body').innerHTML = `
            <div class="error-message">
                <h3>加载项目详细信息时出错</h3>
                <p>请稍后再试</p>
            </div>
        `;
    }
}

// 添加关闭项目详情的函数
function closeProjectModal() {
    const modal = document.querySelector('.project-modal');
    const overlay = document.querySelector('.overlay');
    
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(modal);
            document.body.removeChild(overlay);
        }, 300);
    }
}

// 添加全局变量跟踪当前显示的活动项目数量
let currentVisibleActivityCount = 5; // 初始显示5个
const activityIncrement = 6; // 每次展开显示6个
let lastExpandedCount = 5; // 记录上次展开的位置

// 添加切换活动显示的函数
function toggleActivity(event) {
    event.preventDefault();
    
    // 防止重复点击
    const button = event.currentTarget;
    if (button.dataset.processing === "true") return;
    button.dataset.processing = "true";
    
    const hiddenItems = document.querySelectorAll('.hidden-activity-item');
    
    if (hiddenItems.length > 0) {
        // 检查是否还有更多项目可以显示
        const totalHiddenItems = hiddenItems.length;
        const remainingItems = totalHiddenItems - (currentVisibleActivityCount - 5); // 5是初始显示数量
        
        if (remainingItems > 0) {
            // 还有更多项目可以显示，展开下一批
            const itemsToShow = Math.min(activityIncrement, remainingItems);
            const startIndex = currentVisibleActivityCount - 5; // 从当前显示数量开始
            
            // 使用requestAnimationFrame进行更流畅的DOM操作
            requestAnimationFrame(() => {
                // 批量处理DOM操作减少重排
                for (let i = startIndex; i < startIndex + itemsToShow; i++) {
                    if (hiddenItems[i]) {
                        hiddenItems[i].style.display = 'block';
                    }
                }
                
                lastExpandedCount = currentVisibleActivityCount;
                currentVisibleActivityCount += itemsToShow;
                
                // 显示收起按钮
                const collapseButton = document.querySelector('.collapse-button');
                if (collapseButton) {
                    collapseButton.style.display = 'block';
                }
                
                // 使用第二个requestAnimationFrame确保DOM已更新
                requestAnimationFrame(() => {
                    // 找到最后一个新显示的项目
                    const lastNewItem = hiddenItems[startIndex + itemsToShow - 1];
                    if (lastNewItem) {
                        // 计算位置而不是使用scrollIntoView
                        const rect = lastNewItem.getBoundingClientRect();
                        const targetY = window.pageYOffset + rect.top - window.innerHeight/2; // 居中显示
                        
                        // 使用CSS控制的平滑滚动（更丝滑的效果）
                        document.documentElement.style.scrollBehavior = 'smooth';
                        window.scrollTo({
                            top: targetY
                        });
                        
                        // 滚动完成后恢复默认滚动行为
                        setTimeout(() => {
                            document.documentElement.style.scrollBehavior = '';
                            // 重置处理状态，允许下一次点击
                            button.dataset.processing = "false";
                        }, 600); // 稍微缩短动画时间，让体验更流畅
                    } else {
                        button.dataset.processing = "false";
                    }
                });
            });
            
            // 更新按钮文本 - 在requestAnimationFrame中进行，减少重排
            requestAnimationFrame(() => {
                if (currentVisibleActivityCount - 5 >= totalHiddenItems) {
                    // 所有项目都已显示，显示"回到顶端"按钮，隐藏收起按钮
            button.innerHTML = `
                        Back to top
                <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                    <path d="M3.22 10.53a.749.749 0 0 1 0-1.06l4.25-4.25a.749.749 0 0 1 1.06 0l4.25 4.25a.749.749 0 1 1-1.06 1.06L8 6.811 4.28 10.53a.749.749 0 0 1-1.06 0Z"></path>
                </svg>
            `;
                    // 隐藏收起按钮
                    const collapseButton = document.querySelector('.collapse-button');
                    if (collapseButton) {
                        collapseButton.style.display = 'none';
                    }
        } else {
                    // 还有更多项目可以显示
                    const nextBatch = Math.min(activityIncrement, remainingItems - itemsToShow);
                    button.innerHTML = `
                        Show ${nextBatch} more activities
                        <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                            <path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"></path>
                        </svg>
                    `;
                }
            });
        } else {
            // 检查按钮当前状态，如果是"Back to top"就直接滚动到顶部
            if (button.textContent.includes('Back to top')) {
                // 收起所有隐藏项目
                hiddenItems.forEach(item => {
                    item.style.display = 'none';
                });
                
                // 重置计数器
                currentVisibleActivityCount = 5;
                lastExpandedCount = 5;
                
                // 隐藏收起按钮
                const collapseButton = document.querySelector('.collapse-button');
                if (collapseButton) {
                    collapseButton.style.display = 'none';
                }
                
                // 更新按钮文本
                button.innerHTML = `
                    Show more activity
                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                        <path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"></path>
                    </svg>
                `;
                
                // 直接滚动到activity-timeline的底部
                const activityTimeline = document.querySelector('.activity-timeline');
                if (activityTimeline) {
                    // 找到timeline的底部位置
                    const rect = activityTimeline.getBoundingClientRect();
                    const targetY = window.pageYOffset + rect.top + rect.height - window.innerHeight +20 // -100px的偏移，让位置再往上一点
                    
                    // 使用CSS控制的平滑滚动
                    document.documentElement.style.scrollBehavior = 'smooth';
                    window.scrollTo({
                        top: targetY
                    });
                    
                    // 滚动完成后恢复默认滚动行为并重置处理状态
                    setTimeout(() => {
                        document.documentElement.style.scrollBehavior = '';
                        button.dataset.processing = "false";
                    }, 500);
                } else {
                    // 如果找不到activity-timeline，尝试找show-more按钮
                    const showMoreSection = document.querySelector('.show-more');
                    if (showMoreSection) {
                        // 使用CSS控制的平滑滚动
                        document.documentElement.style.scrollBehavior = 'smooth';
                        showMoreSection.scrollIntoView({block: 'center'});
                        
                        setTimeout(() => {
                            document.documentElement.style.scrollBehavior = '';
                            button.dataset.processing = "false";
                        }, 500);
                    } else {
                        // 都找不到，回到顶部
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                        
                        setTimeout(() => {
                            button.dataset.processing = "false";
                        }, 500);
                    }
                }
                
                return; // 不执行下面的收起逻辑
            } else {
                // 如果不是Back to top按钮，重置处理状态
                button.dataset.processing = "false";
            }
            
            // 先计算滚动目标位置，减少布局抖动
            const contributionsSection = document.querySelector('.contributions');
            let targetY = 0;
            
            if (contributionsSection) {
                // 使用直接计算位置的方式代替scrollIntoView
                const rect = contributionsSection.getBoundingClientRect();
                targetY = window.pageYOffset + rect.top;
            }
            
            // 使用requestAnimationFrame批量处理DOM操作
            requestAnimationFrame(() => {
                // 所有项目都已显示，收起所有隐藏项目
                hiddenItems.forEach(item => {
                    item.style.display = 'none';
                });
                
                // 重置计数器
                currentVisibleActivityCount = 5;
                lastExpandedCount = 5;
                
                // 隐藏收起按钮
                const collapseButton = document.querySelector('.collapse-button');
                if (collapseButton) {
                    collapseButton.style.display = 'none';
                }
                
                button.innerHTML = `
                    Show more activity
                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                        <path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"></path>
                    </svg>
                `;
                
                // 确保DOM已更新后再滚动
                requestAnimationFrame(() => {
                    if (contributionsSection) {
                        // 使用CSS控制的平滑滚动（更丝滑的效果）
                        document.documentElement.style.scrollBehavior = 'smooth';
                        window.scrollTo({
                            top: targetY
                        });
                        
                        // 滚动完成后恢复默认滚动行为
                        setTimeout(() => {
                            document.documentElement.style.scrollBehavior = '';
                            // 重置处理状态，允许下一次点击
                            button.dataset.processing = "false";
                        }, 600); // 缩短动画时间，让体验更流畅
                    } else {
                        button.dataset.processing = "false";
                    }
                });
            });
        }
    }
}

// 添加收起按钮功能
function collapseActivity(event) {
    event.preventDefault();
    
    // 防止重复点击
    const button = event.currentTarget;
    if (button.dataset.processing === "true") return;
    button.dataset.processing = "true";
    
    // 使用性能更好的方式获取元素
    const hiddenItems = document.querySelectorAll('.hidden-activity-item');
    
    if (hiddenItems.length > 0) {
        const totalHiddenItems = hiddenItems.length;
        
        if (currentVisibleActivityCount > 5) {
            // 检查是否到达底部（所有项目都已显示）
            const isAtBottom = currentVisibleActivityCount - 5 >= totalHiddenItems;
            
            // 先计算滚动目标位置，减少布局抖动
            const showMoreSection = document.querySelector('.show-more');
            let targetY = 0;
            
            if (showMoreSection) {
                const rect = showMoreSection.getBoundingClientRect();
                // 根据是否从底部收起来决定不同的偏移量，增加偏移距离
                const offsetDistance = isAtBottom ? 1000 : 1400; // 增加偏移量，收回更大距离
                targetY = window.pageYOffset + rect.top - offsetDistance;
            }
            
            // 一次性执行所有DOM操作，避免多次重排
            if (isAtBottom) {
                // 到底部时，收起全部
                hiddenItems.forEach(item => {
                    item.style.display = 'none';
                });
                currentVisibleActivityCount = 5;
                lastExpandedCount = 5;
            } else {
                // 收起最近展开的部分
                const itemsToHide = Math.min(activityIncrement, currentVisibleActivityCount - 5);
                const startIndex = Math.max(0, currentVisibleActivityCount - 5 - itemsToHide);
                
                // 记录当前显示数量
                const previousCount = currentVisibleActivityCount;
                
                // 先更新计数器，确保状态一致
                currentVisibleActivityCount = Math.max(5, currentVisibleActivityCount - itemsToHide);
                
                // 执行DOM操作
                for (let i = startIndex; i < startIndex + itemsToHide; i++) {
                    if (i >= 0 && i < hiddenItems.length && hiddenItems[i]) {
                        hiddenItems[i].style.display = 'none';
                    }
                }
                
                // 更新上次展开位置
                lastExpandedCount = previousCount - itemsToHide;
            }
            
            // 更新展开按钮文本（只在非底部时）
            if (!isAtBottom) {
                const remainingItems = totalHiddenItems - (currentVisibleActivityCount - 5);
                if (remainingItems > 0) {
                    const nextBatch = Math.min(activityIncrement, remainingItems);
                    const expandButton = document.querySelector('.show-more-button');
                    if (expandButton) {
                        expandButton.innerHTML = `
                            Show ${nextBatch} more activities
                            <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                                <path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"></path>
                            </svg>
                        `;
                    }
                }
            }
            
            // 如果收起后回到初始状态，隐藏收起按钮
            if (currentVisibleActivityCount <= 5) {
                button.style.display = 'none';
            } else {
                // 确保收起按钮在非初始状态下保持显示
                button.style.display = 'flex';
            }
            
            // 如果到达底部，更新展开按钮文本
            if (isAtBottom) {
                const expandButton = document.querySelector('.show-more-button');
                if (expandButton) {
                    expandButton.innerHTML = `
                        Show more activity
                        <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                            <path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"></path>
                        </svg>
                    `;
                }
            }
            
            // 立即开始流畅的滚动动画
            if (showMoreSection) {
                // 使用CSS控制的平滑滚动（更丝滑的效果）
                document.documentElement.style.scrollBehavior = 'smooth';
                window.scrollTo({
                    top: targetY
                });
                
                // 滚动完成后恢复默认滚动行为并重置处理状态
                setTimeout(() => {
                    document.documentElement.style.scrollBehavior = '';
                    button.dataset.processing = "false";
                }, 500); // 缩短时间让交互更流畅
            } else {
                button.dataset.processing = "false";
            }
        } else {
            // 重置处理状态
            button.dataset.processing = "false";
        }
    } else {
        // 重置处理状态
        button.dataset.processing = "false";
    }
}

function showSkeletonLoading() {
    const content = document.querySelector('.content-area');
    content.innerHTML = `
        <div class="loading-text">加载中...</div>
    `;
}

function hideSkeletonLoading() {
    // 不需要额外操作，因为内容会被新的内容替换
}

// Modify the tab click event handler
document.addEventListener('DOMContentLoaded', async function() {
    const contentArea = document.querySelector('.content-area');
    const tabs = document.querySelectorAll('.tab');

    // 根据 URL hash 决定初始显示的标签
    const initialHash = window.location.hash.substring(1) || 'overview';
    let activeTab = initialHash;

    // 确保初始活动的标签是有效的
    if (!Array.from(tabs).some(tab => tab.dataset.tab === activeTab)) {
        activeTab = 'overview'; // 如果 hash 无效，则默认为概览
    }

    // 激活初始标签
    tabs.forEach(tab => {
        if (tab.dataset.tab === activeTab) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // 显示骨架屏
    showSkeletonLoading();

    // 根据初始标签渲染内容
    try {
        switch (activeTab) {
            case 'overview':
                await fetchGitHubData();
                await renderOverview();
                break;
            case 'projects':
                await renderProjects();
                break;
            case 'memos':
                await renderMemos();
                break;
            case 'friends':
                await renderFriends();
                break;
            case 'stars':
                await renderStars();
                break;
            case 'articles':
                await renderArticles();
                break;
            case 'changelog':
                await renderChangelog();
                break;
            default:
                await fetchGitHubData();
                await renderOverview();
                break;
        }
    } catch (error) {
        console.error('Error loading content:', error);
        contentArea.innerHTML = `
            <div class="blankslate">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <h3>加载失败</h3>
                <p>无法加载内容，请稍后重试</p>
            </div>
        `;
    } finally {
        hideSkeletonLoading();
    }

    // 监听标签点击事件
    tabs.forEach(tab => {
        tab.addEventListener('click', async (event) => {
            event.preventDefault();
            const targetTab = event.target.dataset.tab;

            // 移除所有标签的 active 类
            tabs.forEach(t => t.classList.remove('active'));
            // 添加 active 类到被点击的标签
            event.target.classList.add('active');

            // 更新 URL hash
            window.location.hash = targetTab;

            // 显示骨架屏
            showSkeletonLoading();

            try {
                switch(targetTab) {
                    case 'overview':
                        await fetchGitHubData();
                        await renderOverview();
                        break;
                    case 'projects':
                        await renderProjects();
                        break;
                    case 'memos':
                        await renderMemos();
                        break;
                    case 'friends':
                        await renderFriends();
                        break;
                    case 'stars':
                        await renderStars();
                        break;
                    case 'articles':
                        await renderArticles();
                        break;
                    case 'changelog':
                        await renderChangelog();
                        break;
                    default:
                        await fetchGitHubData();
                        await renderOverview();
                        break;
                }
            } catch (error) {
                console.error('Error loading content:', error);
                contentArea.innerHTML = `
                    <div class="blankslate">
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                        <h3>加载失败</h3>
                        <p>无法加载内容，请稍后重试</p>
                    </div>
                `;
            } finally {
                hideSkeletonLoading();
            }
        });
    });

    // 添加灯箱功能
    initLightbox();
});

// ... existing code ... 

// 添加主题切换功能
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // 更新主题
    html.setAttribute('data-theme', newTheme);
    
    // 保存用户手动设置的主题偏好
    localStorage.setItem('theme-preference', 'manual');
    localStorage.setItem('theme', newTheme);
}

// 初始化主题
function initializeTheme() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const themePreference = localStorage.getItem('theme-preference');
    
    // 如果用户之前手动设置过主题
    if (themePreference === 'manual') {
        const savedTheme = localStorage.getItem('theme');
        document.documentElement.setAttribute('data-theme', savedTheme || 'light');
        return;
    }
    
    // 跟随系统设置
    const setThemeBySystem = (e) => {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    };
    
    // 初始设置
    setThemeBySystem(prefersDarkScheme);
    
    // 监听系统主题变化
    prefersDarkScheme.addListener(setThemeBySystem);
}

// 在 DOMContentLoaded 事件中初始化主题
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    
    // 启动自动检查贡献数据更新
    startContributionUpdateChecker();
});

// 添加启动贡献数据更新检查器的函数
function startContributionUpdateChecker() {
    // 每1分钟检查一次更新
    setInterval(async () => {
        // 只在页面可见时检查更新
        if (!document.hidden) {
            const needsUpdate = await checkContributionUpdates();
            if (needsUpdate) {
                console.log('检测到新活动，自动更新贡献数据');
                await refreshContributionData();
            }
        }
    }, 1 * 60 * 1000); // 1分钟
    
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', async () => {
        if (!document.hidden) {
            // 页面变为可见时检查更新
            const needsUpdate = await checkContributionUpdates();
            if (needsUpdate) {
                console.log('页面重新可见，检测到新活动，自动更新贡献数据');
                await refreshContributionData();
            }
        }
    });
}

// 获取Memos数据的函数
async function fetchMemosData() {
    try {
        let allMemos = [];
        let nextPageToken = null;
        
        // 循环获取所有页面的memo数据
        do {
            const url = nextPageToken 
                ? `${MEMOS_API_BASE}/memos?pageToken=${nextPageToken}`
                : `${MEMOS_API_BASE}/memos`;
                
            console.log(`正在获取memo数据: ${url}`);
                
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${MEMOS_TOKEN}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Memos API error: ${response.status}`);
            }
            
            const data = await response.json();
            const memos = data.memos || [];
            
            console.log(`本页获取到 ${memos.length} 个memo`);
            allMemos.push(...memos);
            
            // 获取下一页的token
            nextPageToken = data.nextPageToken;
            console.log(`下一页token: ${nextPageToken}`);
            
        } while (nextPageToken);
        
        console.log(`总共获取到 ${allMemos.length} 个memo`);
        return allMemos;
    } catch (error) {
        console.error('Error fetching Memos data:', error);
        throw error;
    }
}

// Function to style inline tags within memo content
function styleInlineTags(content) {
    if (!content) return '';
    // This regex looks for # followed by one or more non-whitespace characters.
    // It captures the whole tag including the #.
    return content.replace(/#(\S+)/g, '<span class="memo-inline-tag">#$1</span>');
}

// 渲染说说的函数
// 全局变量存储说说数据
let allUnpinnedMemos = [];
let currentDisplayCount = 0;
const MEMOS_PER_LOAD = 5; // 每次加载5个说说

// 创建单个说说HTML的函数
function createMemoHTML(memo) {
    const date = new Date(memo.createTime);
    const formattedDate = timeAgo(date);

    // 处理标签 - 将标签直接处理到内容中
    const processedContent = styleInlineTags(memo.content);

    // Group and count reactions
    const groupedReactions = {};
    if (memo.reactions) {
        memo.reactions.forEach(reaction => {
            groupedReactions[reaction.reactionType] = (groupedReactions[reaction.reactionType] || 0) + 1;
        });
    }

    // 处理资源（图片等）
    const resourcesHTML = memo.resources && memo.resources.length > 0
        ? `<div class="memo-resources">${
            memo.resources.map(resource => {
                const memosBaseUrl = MEMOS_API_BASE.replace('/api/v1', '');
                const resourcePathSegment = resource.name.replace('resources/', '');
                const imageUrl = resource.externalLink || `${memosBaseUrl}/file/resources/${resourcePathSegment}/${resource.filename}?thumbnail=true`;
                return `<img src="${imageUrl}" alt="资源图片" class="memo-resource">`;
            }).join('')
        }</div>`
        : '';

    // 添加置顶标识的类名
    const pinnedClass = memo.pinned ? 'pinned-memo' : '';

    return `
        <div class="memo-card ${pinnedClass}">
            <div class="memo-header">
                ${memo.pinned ? `
                    <span class="memo-pin-icon" title="置顶说说">
                        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                            <path d="M4.456.734a1.75 1.75 0 0 1 2.826.504l.613 1.327a3.081 3.081 0 0 0 2.084 1.707l2.454.584c1.332.317 1.8 1.972.832 2.94L11.06 10l3.72 3.72a.748.748 0 0 1-.332 1.265.75.75 0 0 1-.729-.205L10 11.06l-2.204 2.205c-.968.968-2.623.5-2.94-.832l-.584-2.454a3.081 3.081 0 0 0-1.707-2.084l-1.327-.613a1.75 1.75 0 0 1-.504-2.826L4.456.734ZM5.92 1.866a.25.25 0 0 0-.404-.072L1.794 5.516a.25.25 0 0 0 .072.404l1.328.613A4.582 4.582 0 0 1 5.73 9.63l.584 2.454a.25.25 0 0 0 .42.12l5.47-5.47a.25.25 0 0 0-.12-.42L9.63 5.73a4.581 4.581 0 0 1-3.098-2.537L5.92 1.866Z"></path>
                        </svg>
                    </span>
                ` : ''}
                <span class="memo-date">
                    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                    </svg>
                    ${formattedDate}
                </span>
            </div>
            <div class="memo-content">
                ${marked.parse(processedContent)}
                ${resourcesHTML}
            </div>
            <div class="memo-reactions">
                ${Object.entries(groupedReactions).map(([reactionType, count]) => `
                    <button class="reaction-button">
                        <span class="emoji">${reactionType}</span>
                        <span class="count">${count}</span>
                    </button>
                `).join('')}
            </div>
            <div class="memo-meta">
                ${memo.visibility === 'PRIVATE' ? '<span class="memo-visibility">私密</span>' : ''}
                ${memo.state === 'ARCHIVED' ? '<span class="memo-archived">已归档</span>' : ''}
            </div>
        </div>
    `;
}

async function renderMemos() {
    try {
        const memos = await fetchMemosData();
        const contentArea = document.querySelector('.content-area');
        
        if (!memos || memos.length === 0) {
            contentArea.innerHTML = `
                <div class="blankslate">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <h3>暂无说说</h3>
                    <p>还没有发布任何说说</p>
                </div>
            `;
            return;
        }

        // 将说说按置顶状态分组
        const pinnedMemos = memos.filter(memo => memo.pinned);
        allUnpinnedMemos = memos.filter(memo => !memo.pinned);

        // 重置显示计数
        currentDisplayCount = Math.min(MEMOS_PER_LOAD, allUnpinnedMemos.length);

        // 渲染置顶说说
        const pinnedMemosHTML = pinnedMemos.length > 0 ? 
            `<div class="pinned-memos-section">
                ${pinnedMemos.map(createMemoHTML).join('')}
            </div>` : '';

        // 初始显示的非置顶说说
        const initialMemosHTML = allUnpinnedMemos.slice(0, currentDisplayCount).map(createMemoHTML).join('');
        
        // 加载更多按钮（当还有更多说说时显示）
        const hasMoreMemos = currentDisplayCount < allUnpinnedMemos.length;
        const loadMoreButton = hasMoreMemos ? 
            `<div class="load-more-memos">
                <button class="load-more-button" onclick="loadMoreMemos()">
                    加载更多
                </button>
            </div>` : '';

        contentArea.innerHTML = `
            <div class="memos-container">
                ${pinnedMemosHTML}
                <div class="unpinned-memos-container">
                    ${initialMemosHTML}
                </div>
                ${loadMoreButton}
            </div>
        `;
    } catch (error) {
        console.error('Error rendering memos:', error);
        const contentArea = document.querySelector('.content-area');
        contentArea.innerHTML = `
            <div class="blankslate">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <h3>加载失败</h3>
                <p>无法加载说说内容，请稍后重试</p>
            </div>
        `;
    } finally {
        initLightbox(); // 重新初始化灯箱
    }
}

// 添加加载更多说说的函数
function loadMoreMemos() {
    const unpinnedContainer = document.querySelector('.unpinned-memos-container');
    const loadMoreButton = document.querySelector('.load-more-button');
    
    if (!unpinnedContainer || !allUnpinnedMemos.length) return;
    
    // 计算下一批要显示的说说
    const nextBatchStart = currentDisplayCount;
    const nextBatchEnd = Math.min(currentDisplayCount + MEMOS_PER_LOAD, allUnpinnedMemos.length);
    const nextBatchMemos = allUnpinnedMemos.slice(nextBatchStart, nextBatchEnd);
    
    // 将新说说添加到容器中
    const newMemosHTML = nextBatchMemos.map(createMemoHTML).join('');
    unpinnedContainer.insertAdjacentHTML('beforeend', newMemosHTML);
    
    // 更新当前显示计数
    currentDisplayCount = nextBatchEnd;
    
    // 检查是否还有更多说说
    const remainingCount = allUnpinnedMemos.length - currentDisplayCount;
    if (remainingCount <= 0) {
        // 移除加载更多按钮
        if (loadMoreButton) {
            loadMoreButton.parentElement.remove();
        }
    }
    
    // 重新初始化灯箱功能
    initLightbox();
}

// 添加灯箱功能
function initLightbox() {
    // 为每个说说单独初始化 ViewImage
    const memos = document.querySelectorAll('.memo-resources');
    memos.forEach(memo => {
        const images = memo.querySelectorAll('img');
        if (images.length > 0) {
            const imageUrls = Array.from(images).map(img => img.src);
            images.forEach(img => {
                img.addEventListener('click', function(e) {
                    e.preventDefault();
                    ViewImage.display(imageUrls, this.src);
                });
            });
        }
    });

    // 为 readme 内容单独初始化
    const readmeImages = document.querySelectorAll('.readme-content img');
    if (readmeImages.length > 0) {
        const readmeImageUrls = Array.from(readmeImages).map(img => img.src);
        readmeImages.forEach(img => {
            img.addEventListener('click', function(e) {
                e.preventDefault();
                ViewImage.display(readmeImageUrls, this.src);
            });
        });
    }
}

// 在页面加载完成后初始化 ViewImage
document.addEventListener('DOMContentLoaded', initLightbox);

// 辅助函数：格式化日期为 YYYY/MM/DD
function formatDate(dateString) {
    const date = new Date(dateString); // 直接解析 ISO 8601 字符串
    if (isNaN(date.getTime())) { // 检查日期是否有效
        console.error("Invalid date string for formatDate:", dateString);
        return 'Invalid Date';
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
}

// 渲染文章页面
async function renderArticles() {
    const contentArea = document.querySelector('.content-area');
    contentArea.innerHTML = ''; // 清除旧内容
    showSkeletonLoading();

    try {
        const articles = await fetchArticlesData();
        console.log("渲染文章时接收到的文章数据:", articles); // 添加日志

    if (articles && articles.length > 0) {
        let articlesContentHTML = `<div class="articles-grid">`;
        // 只渲染前五个文章
        const initialArticles = articles.slice(0, 5);
        initialArticles.forEach(article => {
            const descriptionText = article.description || ''; // 移除默认值 'yuazhi'
            // 从文章内容中提取摘要
            const content = article.text || article.content || '';
            const summary = content.replace(/<[^>]+>/g, '').slice(0, 100) + (content.length > 100 ? '...' : '');
            
            articlesContentHTML += `
                <a href="#" class="post-card" data-article-id="${article.id}">
                    <div class="post-date">
                        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                        </svg>
                        ${formatDate(article.created_at)}
                    </div>
                    <h3 class="post-title">${article.title}</h3>
                    <!-- <p class="post-description">${descriptionText}</p> -->
                    <p class="post-summary">${summary}</p>
                </a>
            `;
        });
        articlesContentHTML += `</div>`;
        
        let fullHTML = `<div class="articles-section">${articlesContentHTML}`;

        // 添加加载更多按钮
        if (articles.length > 5) {
            fullHTML += `<button id="load-more-articles" class="load-more-button">加载更多</button>`;
        }
        fullHTML += `</div>`; // Close articles-section div

        contentArea.innerHTML = fullHTML;
        hideSkeletonLoading();

        // 为文章卡片添加点击事件监听器
        document.querySelectorAll('.post-card').forEach(card => {
            card.addEventListener('click', async (event) => {
                event.preventDefault();
                const articleId = card.dataset.articleId;
                const article = articles.find(a => a.id == articleId);
                if (article) {
                    console.log("点击文章卡片时:", article); // 添加日志
                    showArticleDetail(article);
                }
            });
        });

        // 为加载更多按钮添加点击事件监听器
        const loadMoreButton = document.getElementById('load-more-articles');
        if (loadMoreButton) {
            loadMoreButton.addEventListener('click', () => loadMoreArticles(articles));
        }

    } else {
        console.log("articles 数组为空或无效，显示暂无文章可显示。"); // 添加日志
        contentArea.innerHTML = `
            <div class="blankslate">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10,9 9,9 8,9"></polyline>
                </svg>
                <h3>暂无文章</h3>
                <p>还没有发布任何文章</p>
            </div>
        `;
        hideSkeletonLoading();
    }
    } catch (error) {
        console.error('Error rendering articles:', error);
        contentArea.innerHTML = `
            <div class="blankslate">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <h3>加载失败</h3>
                <p>无法加载文章内容，请稍后重试</p>
            </div>
        `;
        hideSkeletonLoading();
    } finally {
        initLightbox(); // 重新初始化灯箱
    }
}

// 加载更多文章的函数
function loadMoreArticles(articles) {
    const articlesGrid = document.querySelector('.articles-grid');
    const loadMoreButton = document.getElementById('load-more-articles');
    const currentArticles = document.querySelectorAll('.post-card');
    const startIndex = currentArticles.length;
    const endIndex = Math.min(startIndex + 5, articles.length);

    for (let i = startIndex; i < endIndex; i++) {
        const article = articles[i];
        const descriptionText = article.description || '';
        const content = article.text || article.content || '';
        const summary = content.replace(/<[^>]+>/g, '').slice(0, 100) + (content.length > 100 ? '...' : '');
        
        const articleHTML = `
            <a href="#" class="post-card" data-article-id="${article.id}">
                <div class="post-date">
                    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                    </svg>
                    ${formatDate(article.created_at)}
                </div>
                <h3 class="post-title">${article.title}</h3>
                <!-- <p class="post-description">${descriptionText}</p> -->
                <p class="post-summary">${summary}</p>
            </a>
        `;
        articlesGrid.insertAdjacentHTML('beforeend', articleHTML);
    }

    // 为新添加的文章卡片添加点击事件监听器
    document.querySelectorAll('.post-card').forEach(card => {
        if (!card.hasEventListener) {
            card.hasEventListener = true;
            card.addEventListener('click', async (event) => {
                event.preventDefault();
                const articleId = card.dataset.articleId;
                const article = articles.find(a => a.id == articleId);
                if (article) {
                    console.log("点击文章卡片时:", article); // 添加日志
                    showArticleDetail(article);
                }
            });
        }
    });

    // 如果没有更多文章可显示，则隐藏加载更多按钮
    if (endIndex >= articles.length) {
        loadMoreButton.style.display = 'none';
    }
    initLightbox(); // 重新初始化灯箱
}

// 显示文章详情的模态框
async function showArticleDetail(article) {
    let articleModal = document.querySelector('.article-modal');
    if (!articleModal) {
        articleModal = document.createElement('div');
        articleModal.className = 'article-modal';
        articleModal.innerHTML = `
            <div class="article-modal-content">
                <div class="article-modal-header">
                    <h3 class="article-modal-title"></h3>
                    <div class="article-modal-actions">
                        <button class="article-share-button" title="分享文章">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path>
                            </svg>
                        </button>
                        <button class="article-modal-close">&times;</button>
                    </div>
                </div>
                <div class="article-modal-body markdown-body"></div>
            </div>
        `;
        document.body.appendChild(articleModal);

        // 创建提示消息元素
        const toast = document.createElement('div');
        toast.className = 'copy-toast';
        toast.textContent = '链接已复制！';
        document.body.appendChild(toast);

        // 强制浏览器重绘，以便动画能正确触发
        void articleModal.offsetWidth;

        // 延迟添加 'show' 类，确保动画在第一次弹出时也能触发
        setTimeout(() => {
            articleModal.classList.add('show');
        }, 10);

        // 添加分享按钮点击事件
        articleModal.querySelector('.article-share-button').addEventListener('click', () => {
            const articleUrl = `${window.location.origin}${window.location.pathname}?article=${article.id}`;
            navigator.clipboard.writeText(articleUrl).then(() => {
                // 显示复制成功提示
                toast.classList.add('show');
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 2000);
            }).catch(err => {
                console.error('复制失败:', err);
            });
        });

        articleModal.querySelector('.article-modal-close').addEventListener('click', () => {
            articleModal.classList.remove('show');
            // 清除 URL 中的 article 参数
            const url = new URL(window.location.href);
            url.searchParams.delete('article');
            window.history.replaceState({}, '', url);
        });

        articleModal.addEventListener('click', (e) => {
            if (e.target === articleModal) {
                articleModal.classList.remove('show');
                // 清除 URL 中的 article 参数
                const url = new URL(window.location.href);
                url.searchParams.delete('article');
                window.history.replaceState({}, '', url);
            }
        });
    }

    articleModal.querySelector('.article-modal-title').textContent = article.title;
    // 检查 article.text 是否存在，否则尝试使用 article.content
    const articleContent = article.text || article.content;
    if (articleContent) {
        articleModal.querySelector('.article-modal-body').innerHTML = articleContent;
        hljs.highlightAll();
    } else {
        console.error("文章内容为空或无法找到 'text' 或 'content' 字段:", article);
        articleModal.querySelector('.article-modal-body').innerHTML = '<p>无法加载文章内容。</p>';
    }

    // 确保模态框在 DOM 中并且内容已加载，然后添加 'show' 类以触发动画
    void articleModal.offsetWidth;
    setTimeout(() => {
        articleModal.classList.add('show');
    }, 10);
    initLightbox(); // 重新初始化灯箱
}

// 添加检查URL参数并显示文章的函数
function checkUrlForArticle() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('article');
    if (articleId) {
        // 切换到文章标签
        const articlesTab = document.querySelector('[data-tab="articles"]');
        if (articlesTab) {
            articlesTab.click();
        }
        
        // 获取文章数据并显示
        fetchArticlesData().then(articles => {
            const article = articles.find(a => a.id == articleId);
            if (article) {
                showArticleDetail(article);
            }
        });
    }
}

// 在页面加载完成后检查URL参数
document.addEventListener('DOMContentLoaded', async () => {
    // ... existing code ...
    
    // 添加灯箱功能
    initLightbox();
    
    // 检查URL参数并显示文章
    checkUrlForArticle();
});

// 添加显示提示的函数
function showProjectTip() {
    const hasShownTip = localStorage.getItem('hasShownProjectTip');
    if (!hasShownTip) {
        const tip = document.createElement('div');
        tip.className = 'project-tip';
        tip.innerHTML = `
            <div class="tip-content">
                <p>点击卡片可以查看项目详情</p>
                <button onclick="hideProjectTip(this.parentElement.parentElement)">知道了</button>
            </div>
        `;
        document.body.appendChild(tip);
        
        // 添加显示动画
        setTimeout(() => {
            tip.classList.add('show');
        }, 10);
        
        localStorage.setItem('hasShownProjectTip', 'true');
    }
}

// 添加隐藏项目提示的函数
function hideProjectTip(tipElement) {
    if (tipElement) {
        tipElement.classList.remove('show');
        tipElement.classList.add('hide');
        // 等待动画完成后再移除元素
        setTimeout(() => {
            if (tipElement.parentNode) {
                tipElement.parentNode.removeChild(tipElement);
            }
        }, 300); // 与CSS动画时间保持一致
    }
}

// 在页面加载完成后显示提示
document.addEventListener('DOMContentLoaded', () => {
    // 延迟 1 秒显示提示，让页面先加载完成
    setTimeout(showProjectTip, 1000);
});

// 添加生成GitHub Activity Graph折线图的函数
async function generateActivityGraph() {
    try {
        // 获取当前年份的贡献数据
        const currentYear = new Date().getFullYear();
        const { contributionData } = await fetchContributionData(currentYear);
        
        // 按周分组数据（GitHub风格的周视图）
        const weeklyData = [];
        const weeks = [];
        
        // 获取当前年份的第一周
        const firstDayOfYear = new Date(currentYear, 0, 1);
        const firstMonday = new Date(firstDayOfYear);
        const dayOfWeek = firstDayOfYear.getDay();
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        firstMonday.setDate(firstDayOfYear.getDate() - daysToMonday);
        
        // 生成52周的数据（一年大约52周）
        for (let week = 0; week < 52; week++) {
            const weekStart = new Date(firstMonday);
            weekStart.setDate(firstMonday.getDate() + (week * 7));
            
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            
            // 计算这一周的提交总数
            let weekCommits = 0;
            for (let day = 0; day < 7; day++) {
                const currentDate = new Date(weekStart);
                currentDate.setDate(weekStart.getDate() + day);
                
                const dateStr = currentDate.toISOString().split('T')[0];
                const dayData = contributionData.find(d => {
                    const dayDate = d.date instanceof Date ? d.date : new Date(d.date);
                    return dayDate.toISOString().split('T')[0] === dateStr;
                });
                
                if (dayData) {
                    weekCommits += dayData.contributions;
                }
            }
            
            weeklyData.push(weekCommits);
            weeks.push(`Week ${week + 1}`);
        }
        
        // 创建图表容器
        const chartContainer = document.createElement('div');
        chartContainer.className = 'activity-graph-container';
        chartContainer.innerHTML = `
            <div class="activity-graph-header">
                <div class="graph-stats">
                    <span class="total-commits">Total: ${weeklyData.reduce((a, b) => a + b, 0)} commits</span>
                    <span class="avg-commits">Avg: ${(weeklyData.reduce((a, b) => a + b, 0) / 52).toFixed(1)}/week</span>
                </div>
            </div>
            <div class="chart-wrapper">
                <canvas id="activityChart" width="800" height="200"></canvas>
            </div>
        `;
        
        return chartContainer;
    } catch (error) {
        console.error('Error generating activity graph:', error);
        return document.createElement('div');
    }
}

// 添加初始化Chart.js的函数
function initActivityChart(container) {
    const canvas = container.querySelector('#activityChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // 获取数据
    const currentYear = new Date().getFullYear();
    fetchContributionData(currentYear).then(({ contributionData }) => {
        // 按周分组数据
        const weeklyData = [];
        const weeks = [];
        
        const firstDayOfYear = new Date(currentYear, 0, 1);
        const firstMonday = new Date(firstDayOfYear);
        const dayOfWeek = firstDayOfYear.getDay();
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        firstMonday.setDate(firstDayOfYear.getDate() - daysToMonday);
        
        for (let week = 0; week < 52; week++) {
            const weekStart = new Date(firstMonday);
            weekStart.setDate(firstMonday.getDate() + (week * 7));
            
            let weekCommits = 0;
            for (let day = 0; day < 7; day++) {
                const currentDate = new Date(weekStart);
                currentDate.setDate(weekStart.getDate() + day);
                
                const dateStr = currentDate.toISOString().split('T')[0];
                const dayData = contributionData.find(d => {
                    const dayDate = d.date instanceof Date ? d.date : new Date(d.date);
                    return dayDate.toISOString().split('T')[0] === dateStr;
                });
                
                if (dayData) {
                    weekCommits += dayData.contributions;
                }
            }
            
            weeklyData.push(weekCommits);
            weeks.push(`W${week + 1}`);
        }
        
        // 创建渐变背景
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, 'rgba(56, 139, 253, 0.3)');
        gradient.addColorStop(1, 'rgba(56, 139, 253, 0.05)');
        
        // 创建Chart.js图表
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: weeks,
                datasets: [{
                    label: 'Commits',
                    data: weeklyData,
                    borderColor: '#388bfd',
                    backgroundColor: gradient,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#388bfd',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#388bfd',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#388bfd',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            title: function(context) {
                                return `Week ${context[0].dataIndex + 1}`;
                            },
                            label: function(context) {
                                return `${context.parsed.y} commits`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#656d76',
                            font: {
                                size: 10
                            },
                            maxTicksLimit: 12
                        }
                    },
                    y: {
                        display: true,
                        grid: {
                            color: 'rgba(101, 109, 118, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#656d76',
                            font: {
                                size: 10
                            },
                            padding: 8
                        },
                        border: {
                            display: false
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                elements: {
                    point: {
                        hoverRadius: 6
                    }
                }
            }
        });
    });
}

// 获取更新日志数据的函数
async function fetchChangelogData() {
    try {
        const CHANGELOG_API_CONFIG = {
            URL: "",
            Method: "post",
            Headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": ""
            },
            Body: {
                "meta": {
                    "ds": "log",
                    "table": "changelogs",
                    "action": "r",
                    "filters": {
                        "project_id": 6
                    },
                    "pageSize": 10,
                    "env": "dev"
                }
            },
            Status: 200
        };

        const response = await fetch(CHANGELOG_API_CONFIG.URL, {
            method: CHANGELOG_API_CONFIG.Method,
            headers: CHANGELOG_API_CONFIG.Headers,
            body: JSON.stringify(CHANGELOG_API_CONFIG.Body)
        });
        
        if (!response.ok) {
            throw new Error(`Changelog API error: ${response.status}`);
        }
        
        const data = await response.json();
        // 修复：API返回的数据在rows字段中
        return data.rows || [];
    } catch (error) {
        console.error('Error fetching changelog data:', error);
        throw error;
    }
}

// 全局变量保存 changelog 数据和当前显示数量
let changelogDataCache = [];
let changelogDisplayCount = 5;

// 渲染更新日志的函数
async function renderChangelog() {
    try {
        const changelogs = await fetchChangelogData();
        const contentArea = document.querySelector('.content-area');
        
        if (!changelogs || changelogs.length === 0) {
            contentArea.innerHTML = `
                <div class="blankslate">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14,2 14,8 20,8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10,9 9,9 8,9"></polyline>
                    </svg>
                    <h3>暂无更新日志</h3>
                    <p>还没有发布任何更新日志</p>
                </div>
            `;
            return;
        }

        // 对更新日志进行排序（倒序）
        const sortedChangelogs = [...changelogs].sort((a, b) => {
            const dateA = new Date(a.created_at || a.updated_at || 0);
            const dateB = new Date(b.created_at || b.updated_at || 0);
            return dateB - dateA;
        });

        // 缓存数据和重置显示数量
        changelogDataCache = sortedChangelogs;
        changelogDisplayCount = 5;
        renderChangelogList();
    } catch (error) {
        console.error('Error rendering changelog:', error);
        const contentArea = document.querySelector('.content-area');
        contentArea.innerHTML = `
            <div class="blankslate">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <h3>加载更新日志失败</h3>
                <p>请稍后再试</p>
            </div>
        `;
    }
}

// 渲染 changelog 列表和加载更多按钮
function renderChangelogList() {
    const contentArea = document.querySelector('.content-area');
    if (!changelogDataCache || changelogDataCache.length === 0) return;
    const showList = changelogDataCache.slice(0, changelogDisplayCount);
    let html = showList.map(changelog => {
        let date;
        if (changelog.created_at) {
            date = new Date(changelog.created_at);
        } else if (changelog.updated_at) {
            date = new Date(changelog.updated_at);
        } else {
            date = new Date();
        }
        const formattedDate = date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const getTypeClass = (type) => {
            switch(type) {
                case 'feature': return 'type-feature';
                case 'fix': return 'type-fix';
                case 'improvement': return 'type-improvement';
                default: return 'type-default';
            }
        };
        const getChineseType = (type) => {
  const translations = {
    'feature': '新功能',
    'fix': '修复',
    'improvement': '改进',
    'other': '其他'
  };
  // 这种方法会把内容和样式混在一起
  return `<span style="color:white">${translations[type] || type}</span>`;
};
        return `
            <div class="changelog-card">
                <div class="changelog-header">
                    <h4 class="changelog-title">${changelog.title || '更新'}</h4>
                    <span class="changelog-date">${formattedDate}</span>
                </div>
                <div class="changelog-description">${changelog.content || changelog.description || '暂无详细描述'}</div>
                <div class="changelog-tags">
                    <span class="changelog-tag version-tag">v${changelog.version || '1.0.0'}</span>
                    ${changelog.type ? `<span class="changelog-tag type-tag ${getTypeClass(changelog.type)}">${getChineseType(changelog.type)}</span>` : ''}
                    ${changelog.tags ? changelog.tags.split(',').map(tag => `<span class="changelog-tag">${tag.trim()}</span>`).join('') : ''}
                </div>
            </div>
        `;
    }).join('');
    // 加载更多按钮
    if (changelogDisplayCount < changelogDataCache.length) {
        html += `<div class="load-more-memos"><button class="load-more-button" onclick="loadMoreChangelog()">加载更多</button></div>`;
    }
    contentArea.innerHTML = html;
}

// 加载更多 changelog
function loadMoreChangelog() {
    changelogDisplayCount += 5;
    renderChangelogList();
}

// 显示更新日志的函数（用于社交链接点击）
function showChangelog() {
    // 切换到更新日志标签页
    const changelogTab = document.querySelector('[data-tab="changelog"]');
    if (changelogTab) {
        changelogTab.click();
    }
}

// 添加全局调试函数，用于手动清除所有贡献数据缓存
window.clearContributionCache = function() {
    console.log('清除所有贡献数据缓存...');
    let clearedCount = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('contribution_data_') || key.startsWith('contribution_timestamp_'))) {
            localStorage.removeItem(key);
            console.log('清除缓存:', key);
            clearedCount++;
        }
    }
    
    console.log(`共清除 ${clearedCount} 个缓存项`);
    alert(`已清除 ${clearedCount} 个贡献数据缓存项，请刷新页面`);
};

// 添加全局调试函数，用于查看当前缓存状态
window.showContributionCache = function() {
    console.log('当前贡献数据缓存状态:');
    let cacheCount = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('contribution_data_') || key.startsWith('contribution_timestamp_'))) {
            const value = localStorage.getItem(key);
            console.log(`${key}:`, value ? '有数据' : '空');
            cacheCount++;
        }
    }
    
    console.log(`共有 ${cacheCount} 个贡献数据缓存项`);
};

// 2. renderActivityTimeline 里，月份头部显示格式化
function formatMonth(monthStr) {
    const [year, month] = monthStr.split('-');
    // 用Date对象生成英文月份
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

// 贡献图工具提示功能
let tooltipElement = null;

function showContributionTooltip(event, date, contributions) {
    // 如果工具提示已存在，直接更新内容
    if (!tooltipElement) {
        tooltipElement = document.createElement('div');
        tooltipElement.className = 'contribution-tooltip';
        document.body.appendChild(tooltipElement);
    }
    
    // 更新内容
    tooltipElement.innerHTML = `
        <div class="tooltip-date">${date}</div>
        <div class="tooltip-contributions">${contributions === 0 ? 'No contributions' : contributions === 1 ? '1 contribution' : `${contributions} contributions`}</div>
    `;
    
    // 计算位置
    const rect = event.target.getBoundingClientRect();
    
    let left = rect.left + (rect.width / 2) - 100; // 假设工具提示宽度约200px
    let top = rect.top - 40; // 假设工具提示高度约40px
    
    // 边界检查
    if (left < 8) left = 8;
    if (left > window.innerWidth - 208) {
        left = window.innerWidth - 208;
    }
    if (top < 8) {
        top = rect.bottom + 8;
    }
    
    tooltipElement.style.left = left + 'px';
    tooltipElement.style.top = top + 'px';
    tooltipElement.classList.add('show');
}

function hideContributionTooltip() {
    if (tooltipElement) {
        tooltipElement.classList.remove('show');
    }
}

// 添加事件委托处理贡献图工具提示
document.addEventListener('DOMContentLoaded', function() {
    // 使用事件委托处理贡献图单元格的鼠标事件
    document.addEventListener('mouseover', function(event) {
        if (event.target.classList.contains('contribution-cell')) {
            const date = event.target.dataset.tooltipDate;
            const contributions = parseInt(event.target.dataset.tooltipContributions);
            if (date && !isNaN(contributions)) {
                showContributionTooltip(event, date, contributions);
            }
        }
    });
    
    document.addEventListener('mouseout', function(event) {
        if (event.target.classList.contains('contribution-cell')) {
            hideContributionTooltip();
        }
    });
});

// 添加触摸事件支持，实现长按效果
function addTouchFeedback() {
    // 获取所有需要添加触摸反馈的按钮
    const touchButtons = document.querySelectorAll('.show-more-button, .activity-action-btn');
    
    touchButtons.forEach(button => {
        // 触摸开始时添加active-touch类
        button.addEventListener('touchstart', function(e) {
            this.classList.add('active-touch');
            // 不阻止默认行为，允许点击事件发生
        });
        
        // 触摸结束或取消时移除active-touch类
        button.addEventListener('touchend', function() {
            this.classList.remove('active-touch');
        });
        
        button.addEventListener('touchcancel', function() {
            this.classList.remove('active-touch');
        });
        
        // 触摸移出按钮区域时也移除效果
        button.addEventListener('touchmove', function(e) {
            const touch = e.touches[0];
            const buttonRect = this.getBoundingClientRect();
            
            // 检查触摸点是否在按钮区域外
            if (touch.clientX < buttonRect.left || touch.clientX > buttonRect.right ||
                touch.clientY < buttonRect.top || touch.clientY > buttonRect.bottom) {
                this.classList.remove('active-touch');
            }
        });
    });
}

// 在页面加载完成后初始化触摸反馈
window.addEventListener('load', function() {
    // 初始化触摸反馈
    addTouchFeedback();
});

// 修改现有的showMoreButton创建函数，添加触摸反馈
const originalCreateShowMoreButton = window.createShowMoreButton || function(){};
window.createShowMoreButton = function() {
    // 调用原始函数
    const result = originalCreateShowMoreButton.apply(this, arguments);
    
    // 为新创建的按钮添加触摸反馈
    setTimeout(addTouchFeedback, 0);
    
    return result;
}
