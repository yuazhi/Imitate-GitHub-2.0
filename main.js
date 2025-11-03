import { API_CONFIG, sendToAPI, buildMessages, setCurrentModel, sendDrawRequest, getCurrentModel } from './api.js';

const messageHistory = []; // 移到文件顶部
const chatHistoryList = [];
let sidebarOverlay;
let currentChatId = null; // 添加当前聊天ID的跟踪
const TAVILY_API_KEY = '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';
let isSearchMode = false;
let isSending = false; // 添加发送状态标志，防止重复调用API

// 检测浏览器类型
function getBrowserType() {
    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = ua.match(/android/i);
    
    if (ua.match(/MicroMessenger/i)) {
        return isAndroid ? 'android-wechat' : 'ios-wechat';
    } else if (ua.match(/QQ/i)) {
        return isAndroid ? 'android-qq' : 'ios-qq';
    }
    return 'other';
}

// 在 DOMContentLoaded 时添加特殊类
document.addEventListener('DOMContentLoaded', function() {
    const browserType = getBrowserType();
    if (browserType === 'ios-wechat' || browserType === 'ios-qq') {
        document.documentElement.classList.add('wechat-qq-browser');
    } else if (browserType === 'android-qq' || browserType === 'android-wechat') {
        document.documentElement.classList.add('android-qq-browser');
    }
    
    // 初始化事件监听器
    initEventListeners();
    // 初始化主题切换
    initThemeToggle();
});

// 初始化所有事件监听器
function initEventListeners() {
    // 发送按钮点击事件
    const sendButton = document.getElementById('send-button');
    if (sendButton) {
        sendButton.addEventListener('click', sendMainMessage);
    }

    // 输入框事件
    const userInput = document.getElementById('main-user-input');
    if (userInput) {
        userInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMainMessage();
            }
        });
    }

    // 菜单按钮事件
    const menuButton = document.getElementById('menuButton');
    if (menuButton) {
        menuButton.addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.add('active');
                if (sidebarOverlay) {
                    sidebarOverlay.classList.add('active');
                }
            }
        });
    }

    // 添加搜索按钮事件监听
    const searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            this.classList.toggle('active');
            isSearchMode = this.classList.contains('active');
            
            // 更新按钮文本
            if (isSearchMode) {
                this.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M2 12h20"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                    
                `;
            } else {
                this.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M2 12h20"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                    
                `;
            }
        });
    }
}

// 修改代码块打字效果函数
function typeCode(code, element, callback) {
    let i = 0;
    const chars = code.split('');
    let currentCode = '';
    let buffer = '';
    const BUFFER_SIZE = 5; // 每次显示5个字符
    
    // 预处理整个代码的高亮
    const tempCode = document.createElement('code');
    tempCode.className = element.className;
    tempCode.textContent = code;
    hljs.highlightElement(tempCode);
    const highlightedCode = tempCode.innerHTML;
    
    // 设置初始样式
    element.classList.add('hljs');
    element.classList.add(element.className.split(' ')[0]); // 确保语言类名被添加
    
    function typeChar() {
        if (i < chars.length) {
            buffer += chars[i];
            i++;
            
            if (buffer.length >= BUFFER_SIZE || i === chars.length) {
                currentCode += buffer;
                // 使用预处理的高亮结果的对应部分
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = highlightedCode;
                const highlightedText = tempDiv.textContent;
                const percentage = currentCode.length / code.length;
                const partialHighlighted = highlightedCode.substring(0, Math.floor(highlightedCode.length * percentage));
                
                element.innerHTML = partialHighlighted;
                buffer = '';
            }
            
            requestAnimationFrame(() => setTimeout(typeChar, 8));
        } else {
            // 完成时使用完整的高亮代码
            element.innerHTML = highlightedCode;
            if (callback) callback();
        }
    }
    
    // 开始打字效果前先设置一个空的高亮块
    element.innerHTML = '<span class="hljs-comment"></span>';
    typeChar();
}

// 检查是否是数学公式元素，避免被误识别为代码块
function isMathFormula(element) {
    // 检查元素或父元素是否包含 katex 类
    if (element.classList.contains('katex') || 
        element.classList.contains('katex-display') ||
        element.parentElement?.classList.contains('katex') ||
        element.parentElement?.classList.contains('katex-display') ||
        element.closest('.katex') ||
        element.closest('.katex-display')) {
        return true;
    }
    
    // 检查父元素链中是否有 katex 相关元素
    let parent = element.parentElement;
    while (parent) {
        if (parent.classList.contains('katex') || 
            parent.classList.contains('katex-display')) {
            return true;
        }
        parent = parent.parentElement;
    }
    
    return false;
}

// 处理代码块的函数
function processCodeBlock(codeContent, messageDiv, useTypingEffect, callback) {
    const codeWrapper = document.createElement('div');
    codeWrapper.className = 'code-block-wrapper';
    
    // 解析语言和文件名
    let language = 'plaintext';
    let filename = '';
    
    // 检查是否包含文件名
    if (codeContent.startsWith('```') && codeContent.includes(':')) {
        const firstLine = codeContent.split('\n')[0];
        const match = firstLine.match(/```([^:]+):(.+)/);
        if (match) {
            language = match[1];
            filename = match[2];
        }
    }
    
    codeWrapper.setAttribute('data-language', language);
    if (filename) {
        codeWrapper.setAttribute('data-filename', filename);
    }
    
    const pre = document.createElement('pre');
    const codeElement = document.createElement('code');
    codeElement.className = `language-${language}${filename ? `:${filename}` : ''}`;
    
    pre.appendChild(codeElement);
    codeWrapper.appendChild(pre);
    
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.textContent = 'Copy code';
    copyButton.onclick = () => copyCode(copyButton);
    codeWrapper.appendChild(copyButton);
    
    messageDiv.appendChild(codeWrapper);
    
    if (useTypingEffect) {
        if (codeContent.startsWith('```')) {
            const lines = codeContent.split('\n');
            codeContent = lines.slice(1, -1).join('\n');
        }
        // 确保代码块容器立即显示
        pre.style.display = 'block';
        pre.style.opacity = '1';
        typeCode(codeContent, codeElement, callback);
    } else {
        codeElement.textContent = codeContent;
        hljs.highlightElement(codeElement);
        if (callback) callback();
    }
}

// 处理数学公式的函数，将 [ ... ] 和 ( ... ) 格式转换为 KaTeX 可渲染格式
function processMathFormulas(text) {
    // 先将已经是 \[ ... \] 格式的公式保护起来，避免被重复处理
    const protectedFormulas = [];
    let protectedIndex = 0;
    
    // 保护已经存在的 \[ ... \] 格式
    text = text.replace(/\\\[[\s\S]*?\\\]/g, (match) => {
        const placeholder = `__PROTECTED_MATH_${protectedIndex}__`;
        protectedFormulas[protectedIndex] = match;
        protectedIndex++;
        return placeholder;
    });
    
    // 将 [ ... ] 格式转换为 \[ ... \] 格式（块级公式）
    // 匹配 [ 开头，] 结尾，中间包含 LaTeX 公式的内容
    text = text.replace(/\[(.*?)\]/g, (match, formula) => {
        // 检查是否包含 LaTeX 命令（如 \frac, \sum, \int, \begin 等）
        if (/(\\[a-zA-Z]+|\\[^\w\s])/.test(formula)) {
            return `\\[${formula}\\]`;
        }
        return match; // 如果不包含 LaTeX 命令，保持原样
    });
    
    // 将 ( ... ) 格式转换为行内公式格式 \( ... \)
    // 使用更智能的方法来处理嵌套括号
    let pos = 0;
    while (pos < text.length) {
        const openPos = text.indexOf('(', pos);
        if (openPos === -1) break;
        
        // 检查这个位置之后是否有 LaTeX 命令
        const nextLaTeX = text.substring(openPos).match(/\\[a-zA-Z]+/);
        if (!nextLaTeX) {
            pos = openPos + 1;
            continue;
        }
        
        // 从开括号开始，匹配到对应的闭括号
        let depth = 0;
        let closePos = -1;
        for (let i = openPos; i < text.length; i++) {
            if (text[i] === '(') {
                depth++;
            } else if (text[i] === ')') {
                depth--;
                if (depth === 0) {
                    closePos = i;
                    break;
                }
            }
        }
        
        if (closePos > openPos) {
            const formula = text.substring(openPos + 1, closePos);
            // 检查是否包含 LaTeX 命令
            if (/(\\[a-zA-Z]+|\\[^\w\s])/.test(formula)) {
                const before = text.substring(0, openPos);
                const after = text.substring(closePos + 1);
                text = before + `\\(${formula}\\)` + after;
                pos = before.length + formula.length + 4; // 跳过已处理的公式
                continue;
            }
        }
        
        pos = openPos + 1;
    }
    
    // 恢复被保护的 \[ ... \] 格式
    protectedFormulas.forEach((original, index) => {
        text = text.replace(`__PROTECTED_MATH_${index}__`, original);
    });
    
    return text;
}

// 渲染数学公式的函数
function renderMathFormulas(element) {
    if (typeof renderMathInElement !== 'undefined') {
        renderMathInElement(element, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '\\[', right: '\\]', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\(', right: '\\)', display: false}
            ],
            throwOnError: false
        });
        
        // 为数学公式添加换行样式（所有设备）
        const mathElements = element.querySelectorAll('.katex-display, .katex');
        mathElements.forEach(mathEl => {
            mathEl.style.whiteSpace = 'normal';
            mathEl.style.wordWrap = 'break-word';
            mathEl.style.overflowWrap = 'break-word';
        });
    }
}

// 统一处理 Markdown 和数学公式的函数
function parseMarkdownWithMath(text) {
    // 先将数学公式保护起来，使用 Base64 编码的占位符
    const mathPlaceholders = [];
    let placeholderIndex = 0;
    
    // 保护所有数学公式格式：\[ ... \], $$ ... $$, \( ... \), $ ... $
    const mathPatterns = [
        /\\\[[\s\S]*?\\\]/g,  // \[ ... \]
        /\$\$[\s\S]*?\$\$/g,  // $$ ... $$
        /\\\([\s\S]*?\\\)/g,  // \( ... \)
        /\$[^$\n]+?\$/g        // $ ... $ (行内公式，避免匹配多个)
    ];
    
    mathPatterns.forEach(pattern => {
        text = text.replace(pattern, (match) => {
            // 使用 Base64 编码的占位符，确保不会被 marked 转义
            const placeholder = `MATH${btoa(placeholderIndex.toString()).replace(/[+\/=]/g, '')}MATH`;
            mathPlaceholders[placeholderIndex] = match;
            placeholderIndex++;
            return placeholder;
        });
    });
    
    // 处理 [ ... ] 格式转换为 \[ ... \]
    const processedText = processMathFormulas(text);
    
    // 使用 marked 解析
    let html = marked.parse(processedText, {
        breaks: true,
        gfm: true,
        smartLists: true,
        smartypants: true
    });
    
    // 恢复数学公式
    mathPlaceholders.forEach((original, index) => {
        const placeholder = `MATH${btoa(index.toString()).replace(/[+\/=]/g, '')}MATH`;
        // 使用全局替换，确保所有占位符都被替换
        html = html.split(placeholder).join(original);
    });
    
    return html;
}

// 添加消息处理函数
function addMessage(message, sender, containerId, useTypingEffect = true) {
    const chatMessages = document.getElementById(containerId);
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender === 'user' ? 'user-message' : 'assistant-message'}`;
    chatMessages.appendChild(messageDiv);
    
    if (sender === 'user') {
        // 用户消息不再使用 marked，而是直接显示文本
        // 对特殊字符进行转义
        const escapedMessage = message
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
            .replace(/\n/g, '<br>');
        messageDiv.innerHTML = escapedMessage;
        // 只在用户发送消息时滚动到底部
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } else {
        // 检查是否是图片消息
        if (message.startsWith('Generated image: ')) {
            const imageUrl = message.replace('Generated image: ', '');
            messageDiv.innerHTML = `
                <div class="image-loading">
                    <img src="${imageUrl}" alt="AI Generated Image" class="generated-image" />
                </div>
            `;
            return;
        }

        // AI 文本回复的处理
        if (useTypingEffect) {
            const tempDiv = document.createElement('div');
            tempDiv.style.display = 'none';
            
            // 先处理数学公式格式
            const processedMessage = processMathFormulas(message);
            
            // 使用 marked 解析，但添加特定配置
            tempDiv.innerHTML = marked.parse(processedMessage, {
                breaks: true, // 保留换行
                gfm: true,   // 启用 GitHub 风格 Markdown
                smartLists: true, // 优化列表渲染
                smartypants: true // 优化标点符号
            });
            
            document.body.appendChild(tempDiv);

            let currentIndex = 0;
            const elements = Array.from(tempDiv.children);

            function processNextElement() {
                if (currentIndex < elements.length) {
                    const element = elements[currentIndex];
                    
                    if (element.tagName === 'PRE') {
                        // 代码块特殊处理
                        const codeBlock = element.querySelector('code');
                        if (codeBlock) {
                            const codeWrapper = document.createElement('div');
                            codeWrapper.className = 'code-block-wrapper';
                            
                            // 解析语言和文件名
                            let language = 'plaintext';
                            let filename = '';
                            if (codeBlock.className) {
                                const match = codeBlock.className.match(/language-([^:]+)(?::(.+))?/);
                                if (match) {
                                    language = match[1];
                                    filename = match[2] || '';
                                }
                            }
                            
                            // 设置代码块属性
                            codeWrapper.setAttribute('data-language', language);
                            if (filename) {
                                codeWrapper.setAttribute('data-filename', filename);
                            }
                            
                            const pre = document.createElement('pre');
                            const newCodeBlock = document.createElement('code');
                            newCodeBlock.className = codeBlock.className;
                            
                            pre.appendChild(newCodeBlock);
                            codeWrapper.appendChild(pre);
                            
                            const copyButton = document.createElement('button');
                            copyButton.className = 'copy-button';
                            copyButton.textContent = 'Copy code';
                            copyButton.onclick = () => copyCode(copyButton);
                            codeWrapper.appendChild(copyButton);
                            
                            messageDiv.appendChild(codeWrapper);
                            
                            typeCode(codeBlock.textContent, newCodeBlock, () => {
                                currentIndex++;
                                processNextElement();
                            });
                        }
                    } else {
                        // 普通文本使用打字效果
                        const textElement = document.createElement('div');
                        messageDiv.appendChild(textElement);
                        
                        // 处理 Markdown 内联样式
                        const content = element.outerHTML;
                        typeWriterHTML(content, textElement, () => {
                            currentIndex++;
                            processNextElement();
                        });
                    }
                } else {
                    // 所有元素处理完成，渲染数学公式
                    renderMathFormulas(messageDiv);
                }
                
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }

            processNextElement();
            document.body.removeChild(tempDiv);
        } else {
            // 不使用打字效果时的处理
            // 先处理数学公式格式
            const processedMessage = processMathFormulas(message);
            
            messageDiv.innerHTML = marked.parse(processedMessage, {
                breaks: true,
                gfm: true,
                smartLists: true,
                smartypants: true
            });
            
            // 处理代码块
            messageDiv.querySelectorAll('pre code').forEach(block => {
                // 跳过数学公式元素
                if (isMathFormula(block)) {
                    return;
                }
                
                const wrapper = block.parentElement.parentElement;
                if (wrapper.classList.contains('code-block-wrapper')) {
                    const match = block.className.match(/language-([^:]+)(?::(.+))?/);
                    if (match) {
                        const language = match[1];
                        const filename = match[2];
                        wrapper.setAttribute('data-language', language);
                        if (filename) {
                            wrapper.setAttribute('data-filename', filename);
                        }
                    }
                }
                hljs.highlightElement(block);
            });
            
            // 渲染数学公式
            renderMathFormulas(messageDiv);
        }
    }

    // 滚动到底部
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 修改 typeWriterHTML 函数，调整打字速度
function typeWriterHTML(html, element, callback = null) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    element.innerHTML = '';
    
    const contents = [];
    function parseNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.replace(/^\s+|\s+$/g, '');
            if (text) {
                contents.push({ type: 'text', content: text });
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            contents.push({ type: 'open', content: node.cloneNode(false) });
            Array.from(node.childNodes).forEach(child => parseNode(child));
            contents.push({ type: 'close' });
        }
    }
    
    Array.from(temp.childNodes).forEach(node => parseNode(node));
    
    let currentIndex = 0;
    let currentTextIndex = 0;
    let currentElement = element;
    const elementStack = [element];
    
    const TYPING_SPEED = 8; // 减少普通文本打字延迟到8ms
    
    function typeNextChar() {
        if (currentIndex >= contents.length) {
            if (callback) callback();
            return;
        }
        
        const current = contents[currentIndex];
        
        switch (current.type) {
            case 'text':
                if (currentTextIndex < current.content.length) {
                    if (!currentElement.lastChild || currentElement.lastChild.nodeType !== Node.TEXT_NODE) {
                        currentElement.appendChild(document.createTextNode(''));
                    }
                    currentElement.lastChild.textContent += current.content[currentTextIndex];
                    currentTextIndex++;
                    setTimeout(typeNextChar, TYPING_SPEED);
                } else {
                    currentIndex++;
                    currentTextIndex = 0;
                    typeNextChar();
                }
                break;
                
            case 'open':
                const newElement = current.content.cloneNode(false);
                currentElement.appendChild(newElement);
                elementStack.push(newElement);
                currentElement = newElement;
                currentIndex++;
                typeNextChar();
                break;
                
            case 'close':
                elementStack.pop();
                currentElement = elementStack[elementStack.length - 1];
                currentIndex++;
                typeNextChar();
                break;
        }
    }
    
    typeNextChar();
}

// 打字机效果函数
function typeWriter(text, element, callback = null) {
    if (!text) {
        if (callback) callback();
        return;
    }
    
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, 30); // 调整打字速度
        } else if (callback) {
            callback();
        }
    }
    
    type();
}

// 复制代码功能
function copyCode(button) {
    const pre = button.parentElement.querySelector('pre');
    const code = pre.textContent;
    
    navigator.clipboard.writeText(code).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copied';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('复制失败:', err);
        button.textContent = 'Failed to copy';
        
        setTimeout(() => {
            button.textContent = 'Copy code';
        }, 2000);
    });
}

// 加载示器函数
function addTypingIndicator() {
    const chatMessages = document.getElementById('main-chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    typingDiv.id = 'typing-indicator';
    chatMessages.appendChild(typingDiv);
    // 移除自动滚动
    // chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// 侧边栏控制
document.getElementById('menuButton').addEventListener('click', function() {
    document.getElementById('sidebar').classList.add('active');
});

// 本地存储相关
function saveToLocalStorage() {
    localStorage.setItem('chatHistory', JSON.stringify(messageHistory));
}

function loadFromLocalStorage() {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
        const history = JSON.parse(savedHistory);
        // 直接加载消息，保持原始顺序
        messageHistory.push(...history);
        
        // 使用addMessage函数显示历史消息
        messageHistory.forEach(msg => {
            addMessage(msg.content, msg.role, 'main-chat-messages', false);
        });
        
        // 滚动到底部
        const chatMessages = document.getElementById('main-chat-messages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// 修改对话按钮功能
document.querySelector('.new-chat').addEventListener('click', function() {
    // 清空当前对话
    currentChatId = null;
    const chatMessages = document.getElementById('main-chat-messages');
    chatMessages.innerHTML = '';
    messageHistory.length = 0;
    
    // 显示欢迎消息
    const welcomeMessage = '你好呀，有什么可以帮忙的？';
    addMessage(welcomeMessage, 'ai', 'main-chat-messages');
    messageHistory.push({
        role: "assistant",
        content: welcomeMessage,
        timestamp: Date.now()
    });
    
    // 移除所有聊天记录的active类
    document.querySelectorAll('.chat-history-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 在移动端时，关闭侧栏和遮罩层
    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');
        sidebar.classList.remove('active');
        if (sidebarOverlay) {
            sidebarOverlay.classList.remove('active');
        }
    }
});

// 更新聊天历史UI
function updateChatHistoryUI() {
    const chatHistory = document.getElementById('chatHistory');
    chatHistory.innerHTML = '';

    chatHistoryList.forEach(chat => {
        // 优先使用数据库中保存的标题，如果标题为空才从消息中提取
        let title = chat.title && chat.title.trim() ? chat.title : '新对话';
        
        // 如果标题为空或只有默认值，且消息已加载，则从第一条用户消息中提取
        if ((!title || title === '新对话') && chat.messages && chat.messages.length > 0) {
            const firstUserMessage = chat.messages.find(msg => msg.role === 'user');
            if (firstUserMessage) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = marked.parse(firstUserMessage.content);
                const extractedTitle = tempDiv.textContent.slice(0, 30) + (tempDiv.textContent.length > 30 ? '...' : '');
                if (extractedTitle) {
                    title = extractedTitle;
                }
            }
        }

        const chatElement = document.createElement('div');
        chatElement.className = `chat-history-item${chat.id === currentChatId ? ' active' : ''}`;
        chatElement.dataset.id = chat.id;
        chatElement.innerHTML = `
            <span class="chat-title">${title}</span>
            <button class="delete-chat" data-id="${chat.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        `;

        // 为删除按钮添加事件监听器
        const deleteButton = chatElement.querySelector('.delete-chat');
        deleteButton.addEventListener('click', async (e) => {
            e.stopPropagation(); // 阻止事件冒泡
            
            showDeleteConfirmModal(async (confirmed) => {
                if (confirmed) {
                    try {
                        const formData = new FormData();
                        formData.append('action', 'deleteChatHistory');
                        formData.append('chatId', chat.id);
                        
                        const response = await fetch('api.php', {
                            method: 'POST',
                            body: formData
                        });
                        
                        const data = await response.json();
                        
                        if (data.success) {
                            // 如果删除的是当前对话，清空聊天区域
                            if (chat.id === currentChatId) {
                                currentChatId = null;
                                document.getElementById('main-chat-messages').innerHTML = '';
                                messageHistory.length = 0;
                                
                                // 显示欢迎消息
                                const welcomeMessage = '你好呀，有什么可以帮忙的？';
                                addMessage(welcomeMessage, 'ai', 'main-chat-messages');
                            }
                            
                            // 从本地数组中移除该聊天记录，避免重新加载所有聊天记录
                            const index = chatHistoryList.findIndex(c => c.id === chat.id);
                            if (index !== -1) {
                                chatHistoryList.splice(index, 1);
                            }
                            
                            // 只更新UI，不需要重新加载所有聊天记录
                            updateChatHistoryUI();
                        } else {
                            alert('删除失败：' + (data.error || '未知错误'));
                        }
                    } catch (error) {
                        console.error('删除聊天失败:', error);
                        alert('删除失败，请重试');
                    }
                }
            });
        });

        // 点击加载对话
        chatElement.addEventListener('click', async (e) => {
            // 如果点击的是删除按钮，不执行加载
            if (e.target.closest('.delete-chat')) {
                return;
            }
            
            // 移除其他对话的active类
            document.querySelectorAll('.chat-history-item').forEach(item => {
                item.classList.remove('active');
            });
            // 添加当前对话的active类
            chatElement.classList.add('active');

            currentChatId = chat.id;
            const chatMessages = document.getElementById('main-chat-messages');
            chatMessages.innerHTML = ''; // 清空聊天区域
            messageHistory.length = 0;  // 清空消息历史

            // 如果消息未加载，则加载消息（延迟加载）
            if (!chat.messages || chat.messages.length === 0) {
                try {
                    chat.messages = await getMessages(chat.id);
                } catch (error) {
                    console.error('加载消息失败:', error);
                    chat.messages = [];
                }
            }

            // 确保消息按时间戳排序后再加载
            const sortedMessages = chat.messages.sort((a, b) => {
                return a.order - b.order; // 使用order而不是timestamp来排序
            });

            // 清除所有现有的消息
            const existingMessages = chatMessages.querySelectorAll('.message');
            existingMessages.forEach(msg => msg.remove());

            sortedMessages.forEach(msg => {
                messageHistory.push({
                    role: msg.role,
                    content: msg.content,
                    timestamp: msg.timestamp || Date.now(), // 确保有时间戳
                    order: msg.order // 保持消息顺序
                });
                
                if (msg.role === 'assistant') {
                    // 对于AI消息，需要重新解析并应用样式
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'message assistant-message';
                    chatMessages.appendChild(messageDiv);
                    
                    if (msg.content.startsWith('Generated image: ')) {
                        // 处理图片消息
                        const imageUrl = msg.content.replace('Generated image: ', '');
                        messageDiv.innerHTML = `
                            <div class="image-loading">
                                <img src="${imageUrl}" alt="AI Generated Image" class="generated-image" />
                            </div>
                        `;
                        return;
                    }
                    
                    // 检查是否包含思考内容
                    if (msg.content.includes('<sy_think>')) {
                        // 检查是否同时包含搜索引用
                        if (msg.content.includes('<search_references>')) {
                            // 使用processThinkingTags处理带思考标签和引用的内容
                            messageDiv.innerHTML = processThinkingTags(msg.content);
                        } else {
                            // 使用processThinkingTags处理带思考标签的内容
                            messageDiv.innerHTML = processThinkingTags(msg.content);
                        }
                        
                        // 渲染数学公式
                        renderMathFormulas(messageDiv);
                        
                        // 确保思考内容区域展开
                        const thinkingHeaders = messageDiv.querySelectorAll('.thinking-header');
                        const thinkingContents = messageDiv.querySelectorAll('.thinking-content');
                        
                        thinkingHeaders.forEach(header => {
                            header.classList.add('expanded');
                        });
                        
                        thinkingContents.forEach(content => {
                            content.style.display = 'block';
                        });
                    } else if (msg.content.includes('<search_references>')) {
                        // 处理包含搜索引用的消息
                        processMessageWithReferences(msg.content, messageDiv);
                    } else {
                        // 处理普通文本消息，包括代码块
                        messageDiv.innerHTML = parseMarkdownWithMath(msg.content);
                    }
                    
                    // 渲染数学公式
                    renderMathFormulas(messageDiv);
                    
                    // 为所有代码块添加包装器和复制按钮
                    messageDiv.querySelectorAll('pre code').forEach(codeBlock => {
                        // 跳过数学公式元素
                        if (isMathFormula(codeBlock)) {
                            return;
                        }
                        
                        // 检查代码块是否已经有包装器
                        if (!codeBlock.parentElement.parentElement.classList.contains('code-block-wrapper')) {
                            const wrapper = document.createElement('div');
                            wrapper.className = 'code-block-wrapper';
                            
                            // 解析语言和文件名
                            const match = codeBlock.className.match(/language-([^:]+)(?::(.+))?/);
                            if (match) {
                                const language = match[1];
                                const filename = match[2];
                                wrapper.setAttribute('data-language', language);
                                if (filename) {
                                    wrapper.setAttribute('data-filename', filename);
                                }
                            }
                            
                            const pre = codeBlock.parentElement;
                            pre.parentNode.insertBefore(wrapper, pre);
                            wrapper.appendChild(pre);
                            
                            // 添加复制按钮
                            const copyButton = document.createElement('button');
                            copyButton.className = 'copy-button';
                            copyButton.textContent = 'Copy code';
                            copyButton.onclick = () => copyCode(copyButton);
                            wrapper.appendChild(copyButton);
                            
                            // 应用代码高亮
                            hljs.highlightElement(codeBlock);
                        }
                    });

                    // 添加消息操作按钮
                    // 只有非开场白消息才添加操作按钮
                    if (msg.content !== '你好呀，有什么可以帮忙的？') {
                        const actionButtons = document.createElement('div');
                        actionButtons.className = 'message-actions';
                        
                        // 复制按钮
                        const copyMessageButton = document.createElement('button');
                        copyMessageButton.className = 'action-button';
                        copyMessageButton.innerHTML = `
                            <span class="copy-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                            </span>
                            <span class="check-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </span>
                        `;
                        copyMessageButton.title = '复制回答';
                        copyMessageButton.onclick = () => {
                            navigator.clipboard.writeText(msg.content).then(() => {
                                copyMessageButton.classList.add('copied');
                                setTimeout(() => copyMessageButton.classList.remove('copied'), 2000);
                            });
                        };

                        // 重新回答按钮
                        const newRegenerateButton = document.createElement('button');
                        newRegenerateButton.className = 'action-button';
                        newRegenerateButton.innerHTML = `
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/>
                            </svg>
                        `;
                        newRegenerateButton.title = '重新回答';
                        newRegenerateButton.onclick = async () => {
                            // 移除当前回答的内容，但保留消息容器
                            messageDiv.innerHTML = '';
                            
                            // 获取当前消息的order
                            const currentMessageOrder = messageHistory.findIndex(m => 
                                m.role === 'assistant' && 
                                m.content === msg.content
                            );

                            // 创建一个新的消息历史，只包含当前消息之前的对话
                            const previousMessages = messageHistory.filter((m, index) => index < currentMessageOrder);
                            
                            // 添加打字机动画
                            const typingIndicator = document.createElement('div');
                            typingIndicator.className = 'typing-indicator';
                            typingIndicator.innerHTML = '<span></span><span></span><span></span>';
                            messageDiv.appendChild(typingIndicator);

                            try {
                                // 使用截至当前消息之前的历史记录重新请求回答
                                const messages = buildMessages(previousMessages);
                                let textContainer = null;
                                let accumulatedText = '';
                                let currentIndex = 0;

                                const regenerateResponse = await sendToAPI(messages, async (chunk) => {
                                    // 在第一次收到响应时创建文本容器
                                    if (currentIndex === 0) {
                                        messageDiv.innerHTML = ''; // 清除打字机动画
                                        textContainer = document.createElement('div');
                                        messageDiv.appendChild(textContainer);
                                    }

                                    accumulatedText += chunk;
                                    currentIndex += chunk.length;

                                    // 处理思考过程
                                    let processedHTML = accumulatedText;
                                    
                                    // 检查是否有思考标签和引用标签
                                    if (accumulatedText.includes('<sy_think>') && accumulatedText.includes('<search_references>')) {
                                        // 同时包含思考标签和引用标签
                                        processedHTML = processThinkingTags(accumulatedText);
                                        textContainer.innerHTML = processedHTML;
                                        
                                        // 渲染数学公式
                                        renderMathFormulas(textContainer);
                                        
                                        // 确保思考内容区域展开
                                        const thinkingHeaders = textContainer.querySelectorAll('.thinking-header');
                                        const thinkingContents = textContainer.querySelectorAll('.thinking-content');
                                        
                                        thinkingHeaders.forEach(header => {
                                            header.classList.add('expanded');
                                        });
                                        
                                        thinkingContents.forEach(content => {
                                            content.style.display = 'block';
                                        });
                                    } else if (accumulatedText.includes('<sy_think>')) {
                                        // 只有思考标签
                                        processedHTML = processThinkingTags(accumulatedText);
                                        textContainer.innerHTML = processedHTML;
                                        
                                        // 渲染数学公式
                                        renderMathFormulas(textContainer);
                                        
                                        // 确保思考内容区域展开
                                        const thinkingHeaders = textContainer.querySelectorAll('.thinking-header');
                                        const thinkingContents = textContainer.querySelectorAll('.thinking-content');
                
                                        thinkingHeaders.forEach(header => {
                                            header.classList.add('expanded');
                                        });
                
                                        thinkingContents.forEach(content => {
                                            content.style.display = 'block';
                                        });
                                    } else if (accumulatedText.includes('<search_references>')) {
                                        // 只有引用标签
                                        processMessageWithReferences(accumulatedText, messageDiv);
                                    } else {
                                        // 使用 marked 解析累积的文本
                                        textContainer.innerHTML = parseMarkdownWithMath(accumulatedText);
                                            renderMathFormulas(textContainer);
                                    }
                                    
                                    // 处理代码块
                                    textContainer.querySelectorAll('pre code').forEach(block => {
                                        // 跳过数学公式元素
                                        if (isMathFormula(block)) {
                                            return;
                                        }
                                        
                                        hljs.highlightElement(block);
                                        
                                        // 检查是否已经有包装器
                                        const pre = block.parentElement;
                                        if (!pre.parentElement?.classList.contains('code-block-wrapper')) {
                                            const wrapper = document.createElement('div');
                                            wrapper.className = 'code-block-wrapper';
                                            
                                            // 解析语言和文件名
                                            const match = block.className.match(/language-([^:]+)(?::(.+))?/);
                                            if (match) {
                                                const language = match[1];
                                                const filename = match[2];
                                                wrapper.setAttribute('data-language', language);
                                                if (filename) {
                                                    wrapper.setAttribute('data-filename', filename);
                                                }
                                            }
                                            
                                            pre.parentNode.insertBefore(wrapper, pre);
                                            wrapper.appendChild(pre);
                                        }
                                    });
                                });

                                if (regenerateResponse.success) {
                                    // 更新历史记录中对应order的消息
                                    messageHistory[currentMessageOrder] = {
                                        role: "assistant",
                                        content: regenerateResponse.content,
                                        timestamp: Date.now(),
                                        order: currentMessageOrder
                                    };


                                    // 保存到数据库
                                    await saveChatToDatabase();

                                    // 在响应完成后为所有代码块添加复制按钮
                                    messageDiv.querySelectorAll('.code-block-wrapper').forEach(wrapper => {
                                        if (!wrapper.querySelector('.copy-button')) {
                                            const copyButton = document.createElement('button');
                                            copyButton.className = 'copy-button';
                                            copyButton.textContent = 'Copy code';
                                            copyButton.onclick = () => copyCode(copyButton);
                                            wrapper.appendChild(copyButton);
                                        }
                                    });

                                    // 重新添加消息操作按钮
                                    const newActionButtons = document.createElement('div');
                                    newActionButtons.className = 'message-actions';
                                    
                                    // 复制按钮
                                    const newCopyMessageButton = document.createElement('button');
                                    newCopyMessageButton.className = 'action-button';
                                    newCopyMessageButton.innerHTML = copyMessageButton.innerHTML;
                                    newCopyMessageButton.title = '复制回答';
                                    newCopyMessageButton.onclick = () => {
                                        navigator.clipboard.writeText(regenerateResponse.content).then(() => {
                                            newCopyMessageButton.classList.add('copied');
                                            setTimeout(() => newCopyMessageButton.classList.remove('copied'), 2000);
                                        });
                                    };

                                    // 重新添加重新回答按钮 - 使用更新后的内容进行匹配
                                    const reRegenerateButton = document.createElement('button');
                                    reRegenerateButton.className = 'action-button';
                                    reRegenerateButton.innerHTML = newRegenerateButton.innerHTML;
                                    reRegenerateButton.title = '重新回答';
                                    // 创建一个新的onclick函数，使用更新后的内容来匹配
                                    const updatedContent = regenerateResponse.content;
                                    reRegenerateButton.onclick = async () => {
                                        // 移除当前回答的内容，但保留消息容器
                                        messageDiv.innerHTML = '';
                                        
                                        // 获取当前消息的order - 使用更新后的内容来匹配
                                        const messageOrder = messageHistory.findIndex(m => 
                                            m.role === 'assistant' && 
                                            m.content === updatedContent
                                        );
                                        
                                        // 如果找不到，尝试使用currentMessageOrder
                                        const finalOrder = messageOrder !== -1 ? messageOrder : currentMessageOrder;
                                        
                                        // 创建一个新的消息历史，只包含当前消息之前的对话
                                        const previousMessages = messageHistory.filter((m, index) => index < finalOrder);
                                        
                                        // 添加打字机动画
                                        const typingIndicator = document.createElement('div');
                                        typingIndicator.className = 'typing-indicator';
                                        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
                                        messageDiv.appendChild(typingIndicator);
                                        
                                        try {
                                            // 使用截至当前消息之前的历史记录重新请求回答
                                            const messages = buildMessages(previousMessages);
                                            let textContainer = null;
                                            let accumulatedText = '';
                                            let currentIndex = 0;

                                            const newRegenerateResponse = await sendToAPI(messages, async (chunk) => {
                                                // 在第一次收到响应时创建文本容器
                                                if (currentIndex === 0) {
                                                    messageDiv.innerHTML = ''; // 清除打字机动画
                                                    textContainer = document.createElement('div');
                                                    messageDiv.appendChild(textContainer);
                                                }

                                                accumulatedText += chunk;
                                                currentIndex += chunk.length;

                                                // 处理思考过程
                                                let processedHTML = accumulatedText;
                                                
                                                // 检查是否有思考标签和引用标签
                                                if (accumulatedText.includes('<sy_think>') && accumulatedText.includes('<search_references>')) {
                                                    // 同时包含思考标签和引用标签
                                                    processedHTML = processThinkingTags(accumulatedText);
                                        textContainer.innerHTML = processedHTML;
                                        
                                        // 渲染数学公式
                                        renderMathFormulas(textContainer);
                                        
                                        // 确保思考内容区域展开
                                                    const thinkingHeaders = textContainer.querySelectorAll('.thinking-header');
                                                    const thinkingContents = textContainer.querySelectorAll('.thinking-content');
                                                    
                                                    thinkingHeaders.forEach(header => {
                                                        header.classList.add('expanded');
                                                    });
                                                    
                                                    thinkingContents.forEach(content => {
                                                        content.style.display = 'block';
                                                    });
                                                } else if (accumulatedText.includes('<sy_think>')) {
                                                    // 只有思考标签
                                                    processedHTML = processThinkingTags(accumulatedText);
                                        textContainer.innerHTML = processedHTML;
                                        
                                        // 渲染数学公式
                                        renderMathFormulas(textContainer);
                                        
                                        // 确保思考内容区域展开
                                                    const thinkingHeaders = textContainer.querySelectorAll('.thinking-header');
                                                    const thinkingContents = textContainer.querySelectorAll('.thinking-content');
                                        
                                                    thinkingHeaders.forEach(header => {
                                                        header.classList.add('expanded');
                                                    });
                                        
                                                    thinkingContents.forEach(content => {
                                                        content.style.display = 'block';
                                                    });
                                                } else if (accumulatedText.includes('<search_references>')) {
                                                    // 只有引用标签
                                                    processMessageWithReferences(accumulatedText, messageDiv);
                                                } else {
                                                    // 使用 marked 解析累积的文本
                                                    textContainer.innerHTML = parseMarkdownWithMath(accumulatedText);
                                            renderMathFormulas(textContainer);
                                                }
                                                
                                                // 处理代码块
                                                textContainer.querySelectorAll('pre code').forEach(block => {
                                                    // 跳过数学公式元素
                                                    if (isMathFormula(block)) {
                                                        return;
                                                    }
                                                    
                                                    hljs.highlightElement(block);
                                                    
                                                    // 检查是否已经有包装器
                                                    const pre = block.parentElement;
                                                    if (!pre.parentElement?.classList.contains('code-block-wrapper')) {
                                                        const wrapper = document.createElement('div');
                                                        wrapper.className = 'code-block-wrapper';
                                                        
                                                        // 解析语言和文件名
                                                        const match = block.className.match(/language-([^:]+)(?::(.+))?/);
                                                        if (match) {
                                                            const language = match[1];
                                                            const filename = match[2];
                                                            wrapper.setAttribute('data-language', language);
                                                            if (filename) {
                                                                wrapper.setAttribute('data-filename', filename);
                                                            }
                                                        }
                                                        
                                                        pre.parentNode.insertBefore(wrapper, pre);
                                                        wrapper.appendChild(pre);
                                                    }
                                                });
                                            });

                                            if (newRegenerateResponse.success) {
                                                // 更新历史记录中对应order的消息
                                                messageHistory[finalOrder] = {
                                                    role: "assistant",
                                                    content: newRegenerateResponse.content,
                                                    timestamp: Date.now(),
                                                    order: finalOrder
                                                };

                                                // 保存到数据库
                                                await saveChatToDatabase();

                                                // 在响应完成后为所有代码块添加复制按钮
                                                messageDiv.querySelectorAll('.code-block-wrapper').forEach(wrapper => {
                                                    if (!wrapper.querySelector('.copy-button')) {
                                                        const copyButton = document.createElement('button');
                                                        copyButton.className = 'copy-button';
                                                        copyButton.textContent = 'Copy code';
                                                        copyButton.onclick = () => copyCode(copyButton);
                                                        wrapper.appendChild(copyButton);
                                                    }
                                                });

                                                // 重新添加消息操作按钮（递归添加，复用相同的逻辑）
                                                const recursiveActionButtons = document.createElement('div');
                                                recursiveActionButtons.className = 'message-actions';
                                                
                                                // 复制按钮
                                                const recursiveCopyButton = document.createElement('button');
                                                recursiveCopyButton.className = 'action-button';
                                                recursiveCopyButton.innerHTML = newCopyMessageButton.innerHTML;
                                                recursiveCopyButton.title = '复制回答';
                                                recursiveCopyButton.onclick = () => {
                                                    navigator.clipboard.writeText(newRegenerateResponse.content).then(() => {
                                                        recursiveCopyButton.classList.add('copied');
                                                        setTimeout(() => recursiveCopyButton.classList.remove('copied'), 2000);
                                                    });
                                                };

                                                // 重新添加重新回答按钮（使用递归逻辑，但简化处理）
                                                const recursiveRegenerateButton = document.createElement('button');
                                                recursiveRegenerateButton.className = 'action-button';
                                                recursiveRegenerateButton.innerHTML = reRegenerateButton.innerHTML;
                                                recursiveRegenerateButton.title = '重新回答';
                                                // 递归调用：使用新内容创建新的onclick函数
                                                const recursiveContent = newRegenerateResponse.content;
                                                recursiveRegenerateButton.onclick = async () => {
                                                    messageDiv.innerHTML = '';
                                                    const recursiveOrder = messageHistory.findIndex(m => 
                                                        m.role === 'assistant' && 
                                                        m.content === recursiveContent
                                                    );
                                                    const finalRecursiveOrder = recursiveOrder !== -1 ? recursiveOrder : finalOrder;
                                                    const previousRecursiveMessages = messageHistory.filter((m, index) => index < finalRecursiveOrder);
                                                    const typingIndicator = document.createElement('div');
                                                    typingIndicator.className = 'typing-indicator';
                                                    typingIndicator.innerHTML = '<span></span><span></span><span></span>';
                                                    messageDiv.appendChild(typingIndicator);
                                                    
                                                    try {
                                                        const messages = buildMessages(previousRecursiveMessages);
                                                        let textContainer = null;
                                                        let accumulatedText = '';
                                                        let currentIndex = 0;

                                                        const response = await sendToAPI(messages, async (chunk) => {
                                                            if (currentIndex === 0) {
                                                                messageDiv.innerHTML = '';
                                                                textContainer = document.createElement('div');
                                                                messageDiv.appendChild(textContainer);
                                                            }
                                                            accumulatedText += chunk;
                                                            currentIndex += chunk.length;
                                                            let processedHTML = accumulatedText;
                                                            if (accumulatedText.includes('<sy_think>') && accumulatedText.includes('<search_references>')) {
                                                                processedHTML = processThinkingTags(accumulatedText);
                                                                textContainer.innerHTML = processedHTML;
                                                                // 渲染数学公式
                                                                renderMathFormulas(textContainer);
                                                                const thinkingHeaders = textContainer.querySelectorAll('.thinking-header');
                                                                const thinkingContents = textContainer.querySelectorAll('.thinking-content');
                                                                thinkingHeaders.forEach(h => h.classList.add('expanded'));
                                                                thinkingContents.forEach(c => c.style.display = 'block');
                                                            } else if (accumulatedText.includes('<sy_think>')) {
                                                                processedHTML = processThinkingTags(accumulatedText);
                                                                textContainer.innerHTML = processedHTML;
                                                                // 渲染数学公式
                                                                renderMathFormulas(textContainer);
                                                                const thinkingHeaders = textContainer.querySelectorAll('.thinking-header');
                                                                const thinkingContents = textContainer.querySelectorAll('.thinking-content');
                                                                thinkingHeaders.forEach(h => h.classList.add('expanded'));
                                                                thinkingContents.forEach(c => c.style.display = 'block');
                                                            } else if (accumulatedText.includes('<search_references>')) {
                                                                processMessageWithReferences(accumulatedText, messageDiv);
                                                            } else {
                                                                textContainer.innerHTML = parseMarkdownWithMath(accumulatedText);
                                            renderMathFormulas(textContainer);
                                                            }
                                                            textContainer.querySelectorAll('pre code').forEach(block => {
                                                                // 跳过数学公式元素
                                                                if (isMathFormula(block)) {
                                                                    return;
                                                                }
                                                                
                                                                hljs.highlightElement(block);
                                                                const pre = block.parentElement;
                                                                if (!pre.parentElement?.classList.contains('code-block-wrapper')) {
                                                                    const wrapper = document.createElement('div');
                                                                    wrapper.className = 'code-block-wrapper';
                                                                    const match = block.className.match(/language-([^:]+)(?::(.+))?/);
                                                                    if (match) {
                                                                        wrapper.setAttribute('data-language', match[1]);
                                                                        if (match[2]) wrapper.setAttribute('data-filename', match[2]);
                                                                    }
                                                                    pre.parentNode.insertBefore(wrapper, pre);
                                                                    wrapper.appendChild(pre);
                                                                }
                                                            });
                                                        });

                                                        if (response.success) {
                                                            messageHistory[finalRecursiveOrder] = {
                                                                role: "assistant",
                                                                content: response.content,
                                                                timestamp: Date.now(),
                                                                order: finalRecursiveOrder
                                                            };
                                                            await saveChatToDatabase();
                                                            messageDiv.querySelectorAll('.code-block-wrapper').forEach(wrapper => {
                                                                if (!wrapper.querySelector('.copy-button')) {
                                                                    const copyButton = document.createElement('button');
                                                                    copyButton.className = 'copy-button';
                                                                    copyButton.textContent = 'Copy code';
                                                                    copyButton.onclick = () => copyCode(copyButton);
                                                                    wrapper.appendChild(copyButton);
                                                                }
                                                            });
                                                            // 重新添加消息操作按钮（确保按钮始终存在）
                                                            const newRecursiveActionButtons = document.createElement('div');
                                                            newRecursiveActionButtons.className = 'message-actions';
                                                            
                                                            // 复制按钮
                                                            const newRecursiveCopyButton = document.createElement('button');
                                                            newRecursiveCopyButton.className = 'action-button';
                                                            newRecursiveCopyButton.innerHTML = recursiveCopyButton.innerHTML;
                                                            newRecursiveCopyButton.title = '复制回答';
                                                            newRecursiveCopyButton.onclick = () => {
                                                                navigator.clipboard.writeText(response.content).then(() => {
                                                                    newRecursiveCopyButton.classList.add('copied');
                                                                    setTimeout(() => newRecursiveCopyButton.classList.remove('copied'), 2000);
                                                                });
                                                            };
                                                            
                                                            // 重新回答按钮 - 使用新的响应内容创建新的onclick函数
                                                            const newRecursiveRegenerateButton = document.createElement('button');
                                                            newRecursiveRegenerateButton.className = 'action-button';
                                                            newRecursiveRegenerateButton.innerHTML = recursiveRegenerateButton.innerHTML;
                                                            newRecursiveRegenerateButton.title = '重新回答';
                                                            // 递归：使用新内容创建新的onclick函数
                                                            const newRecursiveContent = response.content;
                                                            // 创建新的onclick函数，结构与recursiveRegenerateButton.onclick相同，但使用新内容
                                                            newRecursiveRegenerateButton.onclick = async () => {
                                                                messageDiv.innerHTML = '';
                                                                const newRecursiveOrder = messageHistory.findIndex(m => 
                                                                    m.role === 'assistant' && 
                                                                    m.content === newRecursiveContent
                                                                );
                                                                const newFinalRecursiveOrder = newRecursiveOrder !== -1 ? newRecursiveOrder : finalRecursiveOrder;
                                                                const newPreviousRecursiveMessages = messageHistory.filter((m, index) => index < newFinalRecursiveOrder);
                                                                const typingIndicator = document.createElement('div');
                                                                typingIndicator.className = 'typing-indicator';
                                                                typingIndicator.innerHTML = '<span></span><span></span><span></span>';
                                                                messageDiv.appendChild(typingIndicator);
                                                                
                                                                try {
                                                                    const messages = buildMessages(newPreviousRecursiveMessages);
                                                                    let textContainer = null;
                                                                    let accumulatedText = '';
                                                                    let currentIndex = 0;

                                                                    const newResponse = await sendToAPI(messages, async (chunk) => {
                                                                        if (currentIndex === 0) {
                                                                            messageDiv.innerHTML = '';
                                                                            textContainer = document.createElement('div');
                                                                            messageDiv.appendChild(textContainer);
                                                                        }
                                                                        accumulatedText += chunk;
                                                                        currentIndex += chunk.length;
                                                                        let processedHTML = accumulatedText;
                                                                        if (accumulatedText.includes('<sy_think>') && accumulatedText.includes('<search_references>')) {
                                                                            processedHTML = processThinkingTags(accumulatedText);
                                                                            textContainer.innerHTML = processedHTML;
                                                                            // 渲染数学公式
                                                                            renderMathFormulas(textContainer);
                                                                            const thinkingHeaders = textContainer.querySelectorAll('.thinking-header');
                                                                            const thinkingContents = textContainer.querySelectorAll('.thinking-content');
                                                                            thinkingHeaders.forEach(h => h.classList.add('expanded'));
                                                                            thinkingContents.forEach(c => c.style.display = 'block');
                                                                        } else if (accumulatedText.includes('<sy_think>')) {
                                                                            processedHTML = processThinkingTags(accumulatedText);
                                                                            textContainer.innerHTML = processedHTML;
                                                                            // 渲染数学公式
                                                                            renderMathFormulas(textContainer);
                                                                            const thinkingHeaders = textContainer.querySelectorAll('.thinking-header');
                                                                            const thinkingContents = textContainer.querySelectorAll('.thinking-content');
                                                                            thinkingHeaders.forEach(h => h.classList.add('expanded'));
                                                                            thinkingContents.forEach(c => c.style.display = 'block');
                                                                        } else if (accumulatedText.includes('<search_references>')) {
                                                                            processMessageWithReferences(accumulatedText, messageDiv);
                                                                        } else {
                                                                            textContainer.innerHTML = parseMarkdownWithMath(accumulatedText);
                                            renderMathFormulas(textContainer);
                                                                        }
                                                                        textContainer.querySelectorAll('pre code').forEach(block => {
                                                                            hljs.highlightElement(block);
                                                                            const pre = block.parentElement;
                                                                            if (!pre.parentElement?.classList.contains('code-block-wrapper')) {
                                                                                const wrapper = document.createElement('div');
                                                                                wrapper.className = 'code-block-wrapper';
                                                                                const match = block.className.match(/language-([^:]+)(?::(.+))?/);
                                                                                if (match) {
                                                                                    wrapper.setAttribute('data-language', match[1]);
                                                                                    if (match[2]) wrapper.setAttribute('data-filename', match[2]);
                                                                                }
                                                                                pre.parentNode.insertBefore(wrapper, pre);
                                                                                wrapper.appendChild(pre);
                                                                            }
                                                                        });
                                                                    });

                                                                    if (newResponse.success) {
                                                                        messageHistory[newFinalRecursiveOrder] = {
                                                                            role: "assistant",
                                                                            content: newResponse.content,
                                                                            timestamp: Date.now(),
                                                                            order: newFinalRecursiveOrder
                                                                        };
                                                                        await saveChatToDatabase();
                                                                        messageDiv.querySelectorAll('.code-block-wrapper').forEach(wrapper => {
                                                                            if (!wrapper.querySelector('.copy-button')) {
                                                                                const copyButton = document.createElement('button');
                                                                                copyButton.className = 'copy-button';
                                                                                copyButton.textContent = 'Copy code';
                                                                                copyButton.onclick = () => copyCode(copyButton);
                                                                                wrapper.appendChild(copyButton);
                                                                            }
                                                                        });
                                                                        
                                                                        // 继续递归添加按钮
                                                                        const continueActionButtons = document.createElement('div');
                                                                        continueActionButtons.className = 'message-actions';
                                                                        
                                                                        const continueCopyButton = document.createElement('button');
                                                                        continueCopyButton.className = 'action-button';
                                                                        continueCopyButton.innerHTML = newRecursiveCopyButton.innerHTML;
                                                                        continueCopyButton.title = '复制回答';
                                                                        continueCopyButton.onclick = () => {
                                                                            navigator.clipboard.writeText(newResponse.content).then(() => {
                                                                                continueCopyButton.classList.add('copied');
                                                                                setTimeout(() => continueCopyButton.classList.remove('copied'), 2000);
                                                                            });
                                                                        };
                                                                        
                                                                        const continueRegenerateButton = document.createElement('button');
                                                                        continueRegenerateButton.className = 'action-button';
                                                                        continueRegenerateButton.innerHTML = newRecursiveRegenerateButton.innerHTML;
                                                                        continueRegenerateButton.title = '重新回答';
                                                                        // 递归调用：创建新的onclick函数使用新内容
                                                                        const continueContent = newResponse.content;
                                                                        continueRegenerateButton.onclick = newRecursiveRegenerateButton.onclick; // 复用相同的逻辑结构
                                                                        
                                                                        continueActionButtons.appendChild(continueCopyButton);
                                                                        continueActionButtons.appendChild(continueRegenerateButton);
                                                                        messageDiv.appendChild(continueActionButtons);
                                                                    }
                                                                } catch (error) {
                                                                    console.error('Regenerate Error:', error);
                                                                    messageDiv.innerHTML = '重新生成回答时发生错误，请稍后重试';
                                                                }
                                                            };
                                                            
                                                            newRecursiveActionButtons.appendChild(newRecursiveCopyButton);
                                                            newRecursiveActionButtons.appendChild(newRecursiveRegenerateButton);
                                                            messageDiv.appendChild(newRecursiveActionButtons);
                                                        }
                                                    } catch (error) {
                                                        console.error('Regenerate Error:', error);
                                                        messageDiv.innerHTML = '重新生成回答时发生错误，请稍后重试';
                                                    }
                                                };

                                                recursiveActionButtons.appendChild(recursiveCopyButton);
                                                recursiveActionButtons.appendChild(recursiveRegenerateButton);
                                                messageDiv.appendChild(recursiveActionButtons);
                                            }
                                        } catch (error) {
                                            console.error('Regenerate Error:', error);
                                            messageDiv.innerHTML = '重新生成回答时发生错误，请稍后重试';
                                        }
                                    };

                                    newActionButtons.appendChild(newCopyMessageButton);
                                    newActionButtons.appendChild(reRegenerateButton);
                                    messageDiv.appendChild(newActionButtons);
                                }
                            } catch (error) {
                                console.error('Regenerate Error:', error);
                                messageDiv.innerHTML = '重新生成回答时发生错误，请稍后重试';
                            }
                        };

                        actionButtons.appendChild(copyMessageButton);
                        actionButtons.appendChild(newRegenerateButton);
                        messageDiv.appendChild(actionButtons);
                    }
                } else {
                    // 用户消息直接显示
                    addMessage(msg.content, msg.role, 'main-chat-messages', false);
                }
            });

            // 滚动到底部
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // 在移动端加载对话后关闭侧边栏和遮罩层
            if (window.innerWidth <= 768) {
                const sidebar = document.getElementById('sidebar');
                sidebar.classList.remove('active');
                sidebarOverlay.classList.remove('active');
            }
        });

        chatHistory.appendChild(chatElement);
    });
}

// 加载历史对话
function loadChat(chat) {
    messageHistory.length = 0;
    
    // 确保消息按照order排序后再加载
    const sortedMessages = chat.messages.sort((a, b) => a.order - b.order);
    messageHistory.push(...sortedMessages);
    
    document.getElementById('main-chat-messages').innerHTML = '';
    messageHistory.forEach(msg => {
        addMessage(msg.content, msg.role, 'main-chat-messages', false);
    });
    
    // 确保所有代码块都应用高亮
    document.querySelectorAll('pre code').forEach(block => {
        // 跳过数学公式元素
        if (isMathFormula(block)) {
            return;
        }
        
        hljs.highlightElement(block);
    });
    
    // 滚动到底部
            const chatMessages = document.getElementById('main-chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // 更新本地存储
    saveToLocalStorage();
    
    // 在移动端加载对话后关闭侧边栏和遮罩层
    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.remove('active');
        if (sidebarOverlay) {
            sidebarOverlay.classList.remove('active');
        }
    }
}

// 删除历史对话
async function deleteChatHistory(chatId) {
    try {
        const formData = new FormData();
        formData.append('action', 'deleteChatHistory');
        formData.append('chatId', chatId);
        
        const response = await fetch('api.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            // 如果删除的是当前对话，清空聊天区域
            if (chatId === currentChatId) {
                currentChatId = null;
                document.getElementById('main-chat-messages').innerHTML = '';
                messageHistory.length = 0;
                
                // 显示欢迎消息
                const welcomeMessage = '你好呀，有什么可以帮忙的？';
                addMessage(welcomeMessage, 'ai', 'main-chat-messages');
            }
            
            // 从本地数组中移除该聊天记录，避免重新加载所有聊天记录
            const index = chatHistoryList.findIndex(c => c.id === chatId);
            if (index !== -1) {
                chatHistoryList.splice(index, 1);
            }
            
            // 只更新UI，不需要重新加载所有聊天记录
            updateChatHistoryUI();
        } else {
            throw new Error(data.error || '删除聊天历史失败');
        }
    } catch (error) {
        console.error('删除聊天历史失败:', error);
        alert('删除聊条历史失败，请重试');
    }
}

// 加载用户的聊天历史
async function loadUserChatHistory() {
    try {
        const formData = new FormData();
        formData.append('action', 'getChatHistory');
        
        const response = await fetch('api.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            // 清空现有历史
            chatHistoryList.length = 0;
            
            // 只加载聊天列表，不加载消息内容（延迟加载）
            // 消息内容只在用户点击聊天记录时才加载
            for (const history of data.histories) {
                chatHistoryList.push({
                    id: history.id,
                    title: history.title,
                    messages: [] // 初始为空，点击时才加载
                });
            }
            
            // 更新UI
            updateChatHistoryUI();
        } else {
            throw new Error(data.error || '加载聊天历史失败');
        }
    } catch (error) {
        console.error('加载聊天历史失败:', error);
        alert('加载聊天历史失败，请重试');
    }
}

// 获取特定聊天记录的消息
async function getMessages(chatId) {
    try {
        const formData = new FormData();
        formData.append('action', 'getMessages');
        formData.append('chatId', chatId);
        
        const response = await fetch('api.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            // 确保消息按照order属性排序
            return data.messages.sort((a, b) => {
                // 如果没有order属性，使用timestamp作为备选
                if (a.order === undefined || b.order === undefined) {
                    return (a.timestamp || 0) - (b.timestamp || 0);
                }
                return a.order - b.order;
            });
        } else {
            throw new Error(data.error || '获取消息失败');
        }
    } catch (error) {
        console.error('获取消息失败:', error);
        return [];
    }
}

// 在页面加载时添加事件监听器
document.addEventListener('DOMContentLoaded', function() {
    // 显示录模态框
    const loginModal = document.getElementById('loginModal');
    // 检查登录状态
    checkLoginStatus();
    
    async function checkLoginStatus() {
        try {
            const formData = new FormData();
            formData.append('action', 'checkLogin');
            
            const response = await fetch('api.php', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                // 已登录加载聊天历史
                await loadUserChatHistory();
                // 如果有历史记录，显示欢迎消息
                const chatMessages = document.getElementById('main-chat-messages');
                if (chatMessages.children.length === 0) {
                    const welcomeMessage = '你好呀，有什么可以帮忙的？';
                    addMessage(welcomeMessage, 'ai', 'main-chat-messages');
                }
            } else {
                // 未登录，显示登录框
                loginModal.classList.add('active');
            }
        } catch (error) {
            console.error('检查登录态失败:', error);
            loginModal.classList.add('active');
        }
    }

    // 处理登录表单提交
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            const formData = new FormData();
            formData.append('action', 'login');
            formData.append('username', username);
            formData.append('password', password);
            
            const response = await fetch('api.php', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                console.log('登录成功:', data.user.username);
                loginModal.classList.remove('active');
                
                // 加载用户的聊天历史
                await loadUserChatHistory();
                
                // 如果没有历史记录，显示欢迎消息
                const chatMessages = document.getElementById('main-chat-messages');
                if (chatMessages.children.length === 0) {
                    const welcomeMessage = '你好呀，有什么可以帮忙的？';
                    addMessage(welcomeMessage, 'ai', 'main-chat-messages');
                }
            } else {
                throw new Error(data.error || '登录失败');
            }
        } catch (error) {
            console.error('登录失败:', error);
            alert(error.message || '登录失败请重试');
        }
    });
    
    // 发送按钮点击事件
    document.getElementById('send-button').addEventListener('click', sendMainMessage);
    
    // 输入框事件
    const userInput = document.getElementById('main-user-input');
    
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMainMessage();
        }
    });
    
    userInput.addEventListener('input', function() {
        this.style.height = '45px';
        const newHeight = Math.min(this.scrollHeight, 120);
        this.style.height = newHeight + 'px';
        
        // 调整发送按钮的位置
        const sendButton = document.getElementById('send-button');
        if (newHeight > 45) {
            sendButton.style.height = newHeight + 'px';
        } else {
            sendButton.style.height = '45px';
        }
    });
    
    // 创建遮罩层
    sidebarOverlay = document.createElement('div');
    sidebarOverlay.className = 'sidebar-overlay';
    document.body.appendChild(sidebarOverlay);
    
    // 菜单按钮点击事件
    document.getElementById('menuButton').addEventListener('click', function() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
    });
    
    // 遮罩层点击事件
    sidebarOverlay.addEventListener('click', function() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    });

    // 修改模型选择器相关代码
    document.querySelector('.model-selector').innerHTML = `
        <div class="model-dropdown" id="modelDropdown">
            <div class="model-option" data-model="yuanzhi">鸢栀助手</div>
            <div class="model-option" data-model="gpt">通用助手</div>
            <div class="model-option" data-model="deepseek">DeepSeek</div>
            
        </div>
        <button class="model-button" id="modelButton">
            <span class="model-name">鸢栀助手</span>
            <span class="dropdown-arrow">▼</span>
        </button>
    `;

    // 切换下拉菜单
    const modelButton = document.getElementById('modelButton');
    if (modelButton) {
        modelButton.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = document.getElementById('modelDropdown');
            
            // 如果下拉菜单已显示，先移除 show 类
            if (dropdown.classList.contains('show')) {
                dropdown.style.opacity = '0';
                dropdown.style.transform = 'translateY(-10px)';
                dropdown.style.visibility = 'hidden';
                
                setTimeout(() => {
                    dropdown.classList.remove('show');
                }, 200);
            } else {
                // 如果下拉菜单隐藏，先添加 show 类
                dropdown.classList.add('show');
                
                // 强制重绘
                dropdown.offsetHeight;
                
                // 设置可和度
                dropdown.style.visibility = 'visible';
                dropdown.style.opacity = '1';
                dropdown.style.transform = 'translateY(0)';
            }
        });
    }

    // 修改模型选项点击事件处理
    document.querySelectorAll('.model-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const modelName = this.textContent;
            const modelType = this.dataset.model;
            const dropdown = document.getElementById('modelDropdown');
            
            // 更新按钮文本
            document.querySelector('.model-button .model-name').textContent = modelName;
            
            // 关闭下拉菜单（带动画）
            dropdown.style.opacity = '0';
            dropdown.style.transform = 'translateY(-10px)';
            dropdown.style.visibility = 'hidden';
            
            setTimeout(() => {
                dropdown.classList.remove('show');
            }, 200);
            
            // 只更新当前模型,不显示开场白
            setCurrentModel(modelType);
        });
    });

    // 点击其他地时关闭下拉菜单
    document.addEventListener('click', function() {
        const dropdown = document.getElementById('modelDropdown');
        if (dropdown.classList.contains('show')) {
            dropdown.style.opacity = '0';
            dropdown.style.transform = 'translateY(-10px)';
            dropdown.style.visibility = 'hidden';
            
            setTimeout(() => {
                dropdown.classList.remove('show');
            }, 200);
        }
    });

    // 处理 ESC 键
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const dropdown = document.getElementById('modelDropdown');
            if (dropdown.classList.contains('show')) {
                dropdown.style.opacity = '0';
                dropdown.style.transform = 'translateY(-10px)';
                dropdown.style.visibility = 'hidden';
                
                setTimeout(() => {
                    dropdown.classList.remove('show');
                }, 200);
            }
        }
    });
});

// 修改 sendMainMessage 函数
async function sendMainMessage() {
    // 如果正在发送消息，直接返回，防止重复调用
    if (isSending) {
        return;
    }

    const userInput = document.getElementById('main-user-input');
    const message = userInput.value.trim();
    
    if (!message) return;

    // 设置发送状态为true
    isSending = true;

    // 禁用输入和发送按钮
    userInput.disabled = true;
    const sendButton = document.getElementById('send-button');
    sendButton.disabled = true;
    let messageDiv = null;

    try {
        // 添加用户消息到历史记录
        messageHistory.push({
            role: "user",
            content: message,
            timestamp: Date.now(),
            order: messageHistory.length
        });

        addMessage(message, 'user', 'main-chat-messages');
        userInput.value = '';
        userInput.style.height = '45px';
        sendButton.style.height = '45px';

        // 如果是搜索模式，先进行搜索
        if (isSearchMode) {
            // 添加搜索状态消息
            const searchStatusDiv = document.createElement('div');
            searchStatusDiv.className = 'message assistant-message';
            const chatMessages = document.getElementById('main-chat-messages');
            chatMessages.appendChild(searchStatusDiv);
            
            // 创建搜索状态内容
            const searchStatusContent = document.createElement('div');
            searchStatusContent.className = 'search-status-message';
            searchStatusContent.innerHTML = `
                <div class="search-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>
                <div class="search-text">正在联网搜索...</div>
                <div class="search-progress"></div>
            `;
            searchStatusDiv.appendChild(searchStatusContent);
            
            try {
                const searchResults = await searchWithTavily(message);
                
                // 移除搜索状态消息
                searchStatusDiv.remove();
                
                // 将搜索结果整理为上下文信息
                const searchContext = searchResults.map(result => 
                    `标题: ${result.title}\n内容: ${result.content}\n链接: ${result.url}`
                ).join('\n\n');
                
                // 保存搜索结果供后续显示引用
                const references = searchResults.map(result => ({
                    title: result.title,
                    content: result.content.substring(0, 150) + (result.content.length > 150 ? '...' : ''),
                    url: result.url
                }));
                
                // 添加包含搜索上下文的系统消息到消息历史（临时，不会保存到数据库）
                // 创建一个临时的消息历史数组用于发送请求
                const tempMessageHistory = [
                    ...messageHistory,
                    {
                        role: "system",
                        content: `以下是关于用户问题"${message}"的网络搜索结果，请基于这些信息回答用户的问题。在回答中适当引用这些信息来源，并且在回答的末尾简要总结使用了哪些信息来源：\n\n${searchContext}`
                    }
                ];
                
                // 创建新的消息容器
                const chatMessages = document.getElementById('main-chat-messages');
                
                // 添加打字机动画
                addTypingIndicator();

                try {
                    // 使用临时消息历史发送API请求
                    const messages = buildMessages(tempMessageHistory);
                    let textContainer = null;
                    let accumulatedText = '';
                    let currentIndex = 0;

                    const response = await sendToAPI(messages, async (chunk) => {
                        // 在第一次收到响应时创建消息容器
                        if (currentIndex === 0) {
                            removeTypingIndicator();
            messageDiv = document.createElement('div');
            messageDiv.className = 'message assistant-message';
            chatMessages.appendChild(messageDiv);
            
                            textContainer = document.createElement('div');
                            messageDiv.appendChild(textContainer);
                        }
                        
                        accumulatedText += chunk;
                        currentIndex += chunk.length;
                        
                // 处理思考过程
                        let processedHTML = accumulatedText;
                        
                        // 检查是否有思考标签和引用标签
                        if (accumulatedText.includes('<sy_think>') && accumulatedText.includes('<search_references>')) {
                            // 同时包含思考标签和引用标签
                            processedHTML = processThinkingTags(accumulatedText);
                            textContainer.innerHTML = processedHTML;
                            
                            // 渲染数学公式
                            renderMathFormulas(textContainer);
                            
                            // 确保思考内容区域展开
                            const thinkingHeaders = textContainer.querySelectorAll('.thinking-header');
                            const thinkingContents = textContainer.querySelectorAll('.thinking-content');
                            
                            thinkingHeaders.forEach(header => {
                                header.classList.add('expanded');
                            });
                            
                            thinkingContents.forEach(content => {
                                content.style.display = 'block';
                            });
                        } else if (accumulatedText.includes('<sy_think>')) {
                            // 只有思考标签
                            processedHTML = processThinkingTags(accumulatedText);
                                        textContainer.innerHTML = processedHTML;
                                        
                                        // 渲染数学公式
                                        renderMathFormulas(textContainer);
                                        
                                        // 确保思考内容区域展开
                            const thinkingHeaders = textContainer.querySelectorAll('.thinking-header');
                            const thinkingContents = textContainer.querySelectorAll('.thinking-content');
                
                            thinkingHeaders.forEach(header => {
                                header.classList.add('expanded');
                            });
                
                            thinkingContents.forEach(content => {
                                content.style.display = 'block';
                            });
                        } else if (accumulatedText.includes('<search_references>')) {
                            // 只有引用标签
                            processMessageWithReferences(accumulatedText, messageDiv);
                        } else {
                            // 使用 marked 解析累积的文本
                            textContainer.innerHTML = parseMarkdownWithMath(accumulatedText);
                                            renderMathFormulas(textContainer);
                        }
                        
                                                            // 处理代码块
                                                            textContainer.querySelectorAll('pre code').forEach(block => {
                                                                // 跳过数学公式元素
                                                                if (isMathFormula(block)) {
                                                                    return;
                                                                }
                                                                
                                                                hljs.highlightElement(block);
                            
                            // 检查是否已经有包装器
                            const pre = block.parentElement;
                            if (!pre.parentElement?.classList.contains('code-block-wrapper')) {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'code-block-wrapper';
                    
                    // 解析语言和文件名
                                const match = block.className.match(/language-([^:]+)(?::(.+))?/);
                    if (match) {
                        const language = match[1];
                        const filename = match[2];
                        wrapper.setAttribute('data-language', language);
                        if (filename) {
                            wrapper.setAttribute('data-filename', filename);
                        }
                    }
                    
                    pre.parentNode.insertBefore(wrapper, pre);
                    wrapper.appendChild(pre);
                            }
                        });
                    });

                    if (response.success) {
                        // 添加搜索标记到回复
                        const responseWithSearchNote = response.content;
                        
                        // 添加引用内容
                        const referenceContainer = document.createElement('div');
                        referenceContainer.className = 'reference-container';
                        
                        const referencesHTML = `
                            <h5>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <path d="M2 12h20"/>
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                                </svg>
                                引用内容:
                            </h5>
                            <ul>
                                ${references.map(ref => `
                                    <li>
                                        <a href="${ref.url}" target="_blank" rel="noopener noreferrer">${ref.title}</a>
                                    </li>
                                `).join('')}
                            </ul>
                        `;
                        
                        referenceContainer.innerHTML = referencesHTML;
                        messageDiv.appendChild(referenceContainer);
                        
                        // 将引用数据添加到回复内容中，使用特殊标记包裹，便于后续解析
                        const referencesData = JSON.stringify(references);
                        const contentWithReferences = `${responseWithSearchNote}\n<search_references>${referencesData}</search_references>`;
                        
                        // 添加AI回复到历史记录（包含引用数据但用特殊标记隐藏）
                        const newMessage = {
                            role: "assistant",
                            content: contentWithReferences,
                            timestamp: Date.now(),
                            order: messageHistory.length
                        };
                        messageHistory.push(newMessage);

                        // 保存到数据库
                        try {
                            const formData = new FormData();
                            formData.append('action', 'saveChatHistory');
                            
                            const firstUserMessage = messageHistory.find(msg => msg.role === 'user');
                            let chatTitle = firstUserMessage ? limitTitleLength(firstUserMessage.content, 9) : '新对话';
                            
                            formData.append('title', chatTitle);
                            formData.append('messages', JSON.stringify(messageHistory));
                            
                            if (currentChatId) {
                                formData.append('chatId', currentChatId);
                            }
                            
                            const saveResponse = await fetch('api.php', {
                                method: 'POST',
                                body: formData
                            });
                            
                            if (!saveResponse.ok) {
                                const errorText = await saveResponse.text();
                                console.error('保存失败:', errorText);
                                throw new Error(`保存失败: ${saveResponse.status} ${saveResponse.statusText}`);
                            }
                            
                            const saveData = await saveResponse.json();
                            
                            if (saveData.success) {
                                if (!currentChatId) {
                                    currentChatId = saveData.chatId;
                                    // 如果是新创建的聊天，添加到列表中
                                    const existingChat = chatHistoryList.find(c => c.id === currentChatId);
                                    if (!existingChat) {
                                        chatHistoryList.unshift({
                                            id: currentChatId,
                                            title: chatTitle,
                                            messages: [...messageHistory] // 使用当前的消息历史，不需要重新加载
                                        });
                                        updateChatHistoryUI();
                                    }
                                } else {
                                    // 如果已存在的聊天，只更新消息，不重置标题（避免覆盖已生成的AI标题）
                                    const existingChat = chatHistoryList.find(c => c.id === currentChatId);
                                    if (existingChat) {
                                        // 只有在标题是默认值"新对话"时，才更新为临时标题
                                        if (!existingChat.title || existingChat.title === '新对话') {
                                            existingChat.title = chatTitle;
                                        }
                                        existingChat.messages = [...messageHistory]; // 更新消息，不需要重新加载
                                        updateChatHistoryUI();
                                    }
                                }

                                // 如果消息数量达到要求（有用户消息和助手回复），异步生成AI标题
                                // 只在标题还是初始默认值时才更新（避免每次发送消息都更新标题）
                                const userMessages = messageHistory.filter(msg => msg.role === 'user');
                                const assistantMessages = messageHistory.filter(msg => msg.role === 'assistant');
                                const existingChat = chatHistoryList.find(c => c.id === currentChatId);
                                const currentTitle = existingChat ? existingChat.title : chatTitle;
                                // 判断是否需要生成AI标题：
                                // 1. 消息数量>=2且有用户和助手消息
                                // 2. 标题是默认值"新对话"或者是临时标题（从第一条消息提取的）
                                // 3. 标题还未被AI生成过（避免重复生成）
                                const isDefaultTitle = !currentTitle || currentTitle === '新对话' || currentTitle === chatTitle;
                                // 确保只在首次对话或标题失败时生成，避免重复生成
                                const shouldGenerateTitle = userMessages.length > 0 && assistantMessages.length > 0 && 
                                                           messageHistory.length >= 2 && isDefaultTitle &&
                                                           (currentTitle === '新对话' || currentTitle === chatTitle);
                                if (shouldGenerateTitle) {
                                    // 异步生成标题，不阻塞主流程
                                    generateChatTitle(messageHistory).then(async (aiTitle) => {
                                        if (aiTitle && aiTitle !== chatTitle && currentChatId) {
                                            // 更新数据库中的标题
                                            const updateSuccess = await updateChatTitle(currentChatId, aiTitle);
                                            if (updateSuccess) {
                                                // 更新本地列表中的标题
                                                const chat = chatHistoryList.find(c => c.id === currentChatId);
                                                if (chat) {
                                                    chat.title = aiTitle;
                                                    // 使用打字机效果更新标题显示
                                                    updateChatTitleWithTypewriter(currentChatId, aiTitle);
                                                }
                                            }
                                        }
                                    }).catch(error => {
                                        console.error('生成标题失败:', error);
                                    });
                                }

                                // 不再调用 loadUserChatHistory()，避免重复加载所有聊天记录的消息
                } else {
                                throw new Error(saveData.error || '保存失败');
                }
            } catch (error) {
                            console.error('保存聊天历史失败:', error);
                            // 添加错误消息到聊天
                            const errorMessage = '保存聊天记录失败，但消息已发送';
                            addMessage(errorMessage, 'assistant', 'main-chat-messages');
                        }

                        // 在响应完成后为所有代码块添加复制按钮
                        messageDiv.querySelectorAll('.code-block-wrapper').forEach(wrapper => {
                            if (!wrapper.querySelector('.copy-button')) {
                    const copyButton = document.createElement('button');
                    copyButton.className = 'copy-button';
                    copyButton.textContent = 'Copy code';
                    copyButton.onclick = () => copyCode(copyButton);
                    wrapper.appendChild(copyButton);
                }
            });
            
            // 添加消息操作按钮
                const actionButtons = document.createElement('div');
                actionButtons.className = 'message-actions';
                
                // 复制按钮
                const copyMessageButton = document.createElement('button');
                copyMessageButton.className = 'action-button';
                copyMessageButton.innerHTML = `
                    <span class="copy-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    </span>
                    <span class="check-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </span>
                `;
                copyMessageButton.title = '复制回答';
                copyMessageButton.onclick = () => {
                            navigator.clipboard.writeText(response.content).then(() => {
                        copyMessageButton.classList.add('copied');
                        setTimeout(() => copyMessageButton.classList.remove('copied'), 2000);
                    });
                };
                
                // 重新回答按钮
                        const newRegenerateButton = document.createElement('button');
                        newRegenerateButton.className = 'action-button';
                        newRegenerateButton.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/>
                    </svg>
                `;
                        newRegenerateButton.title = '重新回答';
                        newRegenerateButton.onclick = async () => {
                            // 如果正在发送消息，直接返回，防止重复调用
                            if (isSending) {
                                return;
                            }

                            // 设置发送状态为true
                            isSending = true;
                            // 禁用重新回答按钮，防止重复点击
                            newRegenerateButton.disabled = true;

                            // 移除当前回答的内容，但保留消息容器
                            messageDiv.innerHTML = '';
                            
                            // 获取当前消息的order - 使用contentWithReferences来匹配
                            const currentMessageOrder = messageHistory.findIndex(m => 
                                m.role === 'assistant' && 
                                m.content === contentWithReferences
                            );

                            // 创建一个新的消息历史，只包含当前消息之前的对话
                            const previousMessages = messageHistory.filter((m, index) => index < currentMessageOrder);
                            
                        // 添加打字机动画
                        const typingIndicator = document.createElement('div');
                        typingIndicator.className = 'typing-indicator';
                        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
                        messageDiv.appendChild(typingIndicator);
                        
                        try {
                                // 使用截至当前消息之前的历史记录重新请求回答
                            const messages = buildMessages(previousMessages);
                                let textContainer = null;
                                let accumulatedText = '';
                                let currentIndex = 0;

                                const regenerateResponse = await sendToAPI(messages, async (chunk) => {
                                    // 在第一次收到响应时创建文本容器
                                    if (currentIndex === 0) {
                                        messageDiv.innerHTML = ''; // 清除打字机动画
                                        textContainer = document.createElement('div');
                                        messageDiv.appendChild(textContainer);
                                    }

                                    accumulatedText += chunk;
                                    currentIndex += chunk.length;

                                    // 处理思考过程
                                    let processedHTML = accumulatedText;
                                    
                                    // 检查是否有思考标签和引用标签
                                    if (accumulatedText.includes('<sy_think>') && accumulatedText.includes('<search_references>')) {
                                        // 同时包含思考标签和引用标签
                                        processedHTML = processThinkingTags(accumulatedText);
                                        textContainer.innerHTML = processedHTML;
                                        
                                        // 渲染数学公式
                                        renderMathFormulas(textContainer);
                                        
                                        // 确保思考内容区域展开
                                        const thinkingHeaders = textContainer.querySelectorAll('.thinking-header');
                                        const thinkingContents = textContainer.querySelectorAll('.thinking-content');
                                        
                                        thinkingHeaders.forEach(header => {
                                            header.classList.add('expanded');
                                        });
                                        
                                        thinkingContents.forEach(content => {
                                            content.style.display = 'block';
                                        });
                                    } else if (accumulatedText.includes('<sy_think>')) {
                                        // 只有思考标签
                                        processedHTML = processThinkingTags(accumulatedText);
                                        textContainer.innerHTML = processedHTML;
                                        
                                        // 渲染数学公式
                                        renderMathFormulas(textContainer);
                                        
                                        // 确保思考内容区域展开
                                        const thinkingHeaders = textContainer.querySelectorAll('.thinking-header');
                                        const thinkingContents = textContainer.querySelectorAll('.thinking-content');
                
                                        thinkingHeaders.forEach(header => {
                                            header.classList.add('expanded');
                                        });
                
                                        thinkingContents.forEach(content => {
                                            content.style.display = 'block';
                                        });
                                    } else if (accumulatedText.includes('<search_references>')) {
                                        // 只有引用标签
                                        processMessageWithReferences(accumulatedText, messageDiv);
                                    } else {
                                        // 使用 marked 解析累积的文本
                                        textContainer.innerHTML = parseMarkdownWithMath(accumulatedText);
                                            renderMathFormulas(textContainer);
                                    }
                                    
                                    // 处理代码块
                                    textContainer.querySelectorAll('pre code').forEach(block => {
                                        // 跳过数学公式元素
                                        if (isMathFormula(block)) {
                                            return;
                                        }
                                        
                                        hljs.highlightElement(block);
                                        
                                        // 检查是否已经有包装器
                                        const pre = block.parentElement;
                                        if (!pre.parentElement?.classList.contains('code-block-wrapper')) {
                                            const wrapper = document.createElement('div');
                                            wrapper.className = 'code-block-wrapper';
                                            
                                            // 解析语言和文件名
                                            const match = block.className.match(/language-([^:]+)(?::(.+))?/);
                                            if (match) {
                                                const language = match[1];
                                                const filename = match[2];
                                                wrapper.setAttribute('data-language', language);
                                                if (filename) {
                                                    wrapper.setAttribute('data-filename', filename);
                                                }
                                            }
                                            
                                            pre.parentNode.insertBefore(wrapper, pre);
                                            wrapper.appendChild(pre);
                                        }
                                    });
                                });

                                if (regenerateResponse.success) {
                                    // 更新历史记录中对应order的消息
                                    messageHistory[currentMessageOrder] = {
                                        role: "assistant",
                                        content: regenerateResponse.content,
                                        timestamp: Date.now(),
                                        order: currentMessageOrder
                                    };


                                    // 保存到数据库
                                    await saveChatToDatabase();

                                    // 在响应完成后为所有代码块添加复制按钮
                                    messageDiv.querySelectorAll('.code-block-wrapper').forEach(wrapper => {
                                        if (!wrapper.querySelector('.copy-button')) {
                                            const copyButton = document.createElement('button');
                                            copyButton.className = 'copy-button';
                                            copyButton.textContent = 'Copy code';
                                            copyButton.onclick = () => copyCode(copyButton);
                                            wrapper.appendChild(copyButton);
                                        }
                                    });

                                    // 重新添加消息操作按钮
                                    const newActionButtons = document.createElement('div');
                                    newActionButtons.className = 'message-actions';
                                    
                                    // 复制按钮
                                    const newCopyMessageButton = document.createElement('button');
                                    newCopyMessageButton.className = 'action-button';
                                    newCopyMessageButton.innerHTML = copyMessageButton.innerHTML;
                                    newCopyMessageButton.title = '复制回答';
                                    newCopyMessageButton.onclick = () => {
                                        navigator.clipboard.writeText(regenerateResponse.content).then(() => {
                                            newCopyMessageButton.classList.add('copied');
                                            setTimeout(() => newCopyMessageButton.classList.remove('copied'), 2000);
                                        });
                                    };

                                    // 重新添加重新回答按钮 - 使用更新后的内容进行匹配
                                    const reRegenerateButton = document.createElement('button');
                                    reRegenerateButton.className = 'action-button';
                                    reRegenerateButton.innerHTML = newRegenerateButton.innerHTML;
                                    reRegenerateButton.title = '重新回答';
                                    // 创建一个新的onclick函数，使用更新后的内容来匹配
                                    const updatedContent = regenerateResponse.content;
                                    reRegenerateButton.onclick = async () => {
                                        // 移除当前回答的内容，但保留消息容器
                                        messageDiv.innerHTML = '';
                                        
                                        // 获取当前消息的order - 使用更新后的内容来匹配
                                        const messageOrder = messageHistory.findIndex(m => 
                                            m.role === 'assistant' && 
                                            m.content === updatedContent
                                        );
                                        
                                        // 如果找不到，尝试使用currentMessageOrder
                                        const finalOrder = messageOrder !== -1 ? messageOrder : currentMessageOrder;
                                        
                                        // 创建一个新的消息历史，只包含当前消息之前的对话
                                        const previousMessages = messageHistory.filter((m, index) => index < finalOrder);
                                        
                                        // 添加打字机动画
                                        const typingIndicator = document.createElement('div');
                                        typingIndicator.className = 'typing-indicator';
                                        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
                                        messageDiv.appendChild(typingIndicator);
                                        
                                        try {
                                            // 使用截至当前消息之前的历史记录重新请求回答
                                            const messages = buildMessages(previousMessages);
                                            let textContainer = null;
                                            let accumulatedText = '';
                                            let currentIndex = 0;

                                            const newRegenerateResponse = await sendToAPI(messages, async (chunk) => {
                                                // 在第一次收到响应时创建文本容器
                                                if (currentIndex === 0) {
                                                    messageDiv.innerHTML = ''; // 清除打字机动画
                                                    textContainer = document.createElement('div');
                                                    messageDiv.appendChild(textContainer);
                                                }

                                                accumulatedText += chunk;
                                                currentIndex += chunk.length;

                                                // 处理思考过程
                                                let processedHTML = accumulatedText;
                                                
                                                // 检查是否有思考标签和引用标签
                                                if (accumulatedText.includes('<sy_think>') && accumulatedText.includes('<search_references>')) {
                                                    // 同时包含思考标签和引用标签
                                                    processedHTML = processThinkingTags(accumulatedText);
                                        textContainer.innerHTML = processedHTML;
                                        
                                        // 渲染数学公式
                                        renderMathFormulas(textContainer);
                                        
                                        // 确保思考内容区域展开
                                                    const thinkingHeaders = textContainer.querySelectorAll('.thinking-header');
                                                    const thinkingContents = textContainer.querySelectorAll('.thinking-content');
                                                    
                                                    thinkingHeaders.forEach(header => {
                                                        header.classList.add('expanded');
                                                    });
                                                    
                                                    thinkingContents.forEach(content => {
                                                        content.style.display = 'block';
                                                    });
                                                } else if (accumulatedText.includes('<sy_think>')) {
                                                    // 只有思考标签
                                                    processedHTML = processThinkingTags(accumulatedText);
                                        textContainer.innerHTML = processedHTML;
                                        
                                        // 渲染数学公式
                                        renderMathFormulas(textContainer);
                                        
                                        // 确保思考内容区域展开
                                                    const thinkingHeaders = textContainer.querySelectorAll('.thinking-header');
                                                    const thinkingContents = textContainer.querySelectorAll('.thinking-content');
                                        
                                                    thinkingHeaders.forEach(header => {
                                                        header.classList.add('expanded');
                                                    });
                                        
                                                    thinkingContents.forEach(content => {
                                                        content.style.display = 'block';
                                                    });
                                                } else if (accumulatedText.includes('<search_references>')) {
                                                    // 只有引用标签
                                                    processMessageWithReferences(accumulatedText, messageDiv);
                                                } else {
                                                    // 使用 marked 解析累积的文本
                                                    textContainer.innerHTML = parseMarkdownWithMath(accumulatedText);
                                            renderMathFormulas(textContainer);
                                                }
                                                
                                                // 处理代码块
                                                textContainer.querySelectorAll('pre code').forEach(block => {
                                                    // 跳过数学公式元素
                                                    if (isMathFormula(block)) {
                                                        return;
                                                    }
                                                    
                                                    hljs.highlightElement(block);
                                                    
                                                    // 检查是否已经有包装器
                                                    const pre = block.parentElement;
                                                    if (!pre.parentElement?.classList.contains('code-block-wrapper')) {
                                                        const wrapper = document.createElement('div');
                                                        wrapper.className = 'code-block-wrapper';
                                                        
                                                        // 解析语言和文件名
                                                        const match = block.className.match(/language-([^:]+)(?::(.+))?/);
                                                        if (match) {
                                                            const language = match[1];
                                                            const filename = match[2];
                                                            wrapper.setAttribute('data-language', language);
                                                            if (filename) {
                                                                wrapper.setAttribute('data-filename', filename);
                                                            }
                                                        }
                                                        
                                                        pre.parentNode.insertBefore(wrapper, pre);
                                                        wrapper.appendChild(pre);
                                                    }
                                                });
                                            });

                                            if (newRegenerateResponse.success) {
                                                // 更新历史记录中对应order的消息
                                                messageHistory[finalOrder] = {
                                                    role: "assistant",
                                                    content: newRegenerateResponse.content,
                                                    timestamp: Date.now(),
                                                    order: finalOrder
                                                };

                                                // 保存到数据库
                                                await saveChatToDatabase();

                                                // 在响应完成后为所有代码块添加复制按钮
                                                messageDiv.querySelectorAll('.code-block-wrapper').forEach(wrapper => {
                                                    if (!wrapper.querySelector('.copy-button')) {
                                                        const copyButton = document.createElement('button');
                                                        copyButton.className = 'copy-button';
                                                        copyButton.textContent = 'Copy code';
                                                        copyButton.onclick = () => copyCode(copyButton);
                                                        wrapper.appendChild(copyButton);
                                                    }
                                                });

                                                // 重新添加消息操作按钮（递归添加，复用相同的逻辑）
                                                const recursiveActionButtons = document.createElement('div');
                                                recursiveActionButtons.className = 'message-actions';
                                                
                                                // 复制按钮
                                                const recursiveCopyButton = document.createElement('button');
                                                recursiveCopyButton.className = 'action-button';
                                                recursiveCopyButton.innerHTML = newCopyMessageButton.innerHTML;
                                                recursiveCopyButton.title = '复制回答';
                                                recursiveCopyButton.onclick = () => {
                                                    navigator.clipboard.writeText(newRegenerateResponse.content).then(() => {
                                                        recursiveCopyButton.classList.add('copied');
                                                        setTimeout(() => recursiveCopyButton.classList.remove('copied'), 2000);
                                                    });
                                                };

                                                // 重新添加重新回答按钮（使用递归逻辑，但简化处理）
                                                const recursiveRegenerateButton = document.createElement('button');
                                                recursiveRegenerateButton.className = 'action-button';
                                                recursiveRegenerateButton.innerHTML = reRegenerateButton.innerHTML;
                                                recursiveRegenerateButton.title = '重新回答';
                                                // 递归调用：使用新内容创建新的onclick函数
                                                const recursiveContent = newRegenerateResponse.content;
                                                recursiveRegenerateButton.onclick = async () => {
                                                    messageDiv.innerHTML = '';
                                                    const recursiveOrder = messageHistory.findIndex(m => 
                                                        m.role === 'assistant' && 
                                                        m.content === recursiveContent
                                                    );
                                                    const finalRecursiveOrder = recursiveOrder !== -1 ? recursiveOrder : finalOrder;
                                                    const previousRecursiveMessages = messageHistory.filter((m, index) => index < finalRecursiveOrder);
                                                    const typingIndicator = document.createElement('div');
                                                    typingIndicator.className = 'typing-indicator';
                                                    typingIndicator.innerHTML = '<span></span><span></span><span></span>';
                                                    messageDiv.appendChild(typingIndicator);
                                                    
                                                    try {
                                                        const messages = buildMessages(previousRecursiveMessages);
                                                        let textContainer = null;
                                                        let accumulatedText = '';
                                                        let currentIndex = 0;

                                                        const response = await sendToAPI(messages, async (chunk) => {
                                                            if (currentIndex === 0) {
                                                                messageDiv.innerHTML = '';
                                                                textContainer = document.createElement('div');
                                                                messageDiv.appendChild(textContainer);
                                                            }
                                                            accumulatedText += chunk;
                                                            currentIndex += chunk.length;
                                                            let processedHTML = accumulatedText;
                                                            if (accumulatedText.includes('<sy_think>') && accumulatedText.includes('<search_references>')) {
                                                                processedHTML = processThinkingTags(accumulatedText);
                                                                textContainer.innerHTML = processedHTML;
                                                                // 渲染数学公式
                                                                renderMathFormulas(textContainer);
                                                                const thinkingHeaders = textContainer.querySelectorAll('.thinking-header');
                                                                const thinkingContents = textContainer.querySelectorAll('.thinking-content');
                                                                thinkingHeaders.forEach(h => h.classList.add('expanded'));
                                                                thinkingContents.forEach(c => c.style.display = 'block');
                                                            } else if (accumulatedText.includes('<sy_think>')) {
                                                                processedHTML = processThinkingTags(accumulatedText);
                                                                textContainer.innerHTML = processedHTML;
                                                                // 渲染数学公式
                                                                renderMathFormulas(textContainer);
                                                                const thinkingHeaders = textContainer.querySelectorAll('.thinking-header');
                                                                const thinkingContents = textContainer.querySelectorAll('.thinking-content');
                                                                thinkingHeaders.forEach(h => h.classList.add('expanded'));
                                                                thinkingContents.forEach(c => c.style.display = 'block');
                                                            } else if (accumulatedText.includes('<search_references>')) {
                                                                processMessageWithReferences(accumulatedText, messageDiv);
                                                            } else {
                                                                textContainer.innerHTML = parseMarkdownWithMath(accumulatedText);
                                            renderMathFormulas(textContainer);
                                                            }
                                                            textContainer.querySelectorAll('pre code').forEach(block => {
                                                                // 跳过数学公式元素
                                                                if (isMathFormula(block)) {
                                                                    return;
                                                                }
                                                                
                                                                hljs.highlightElement(block);
                                                                const pre = block.parentElement;
                                                                if (!pre.parentElement?.classList.contains('code-block-wrapper')) {
                                                                    const wrapper = document.createElement('div');
                                                                    wrapper.className = 'code-block-wrapper';
                                                                    const match = block.className.match(/language-([^:]+)(?::(.+))?/);
                                                                    if (match) {
                                                                        wrapper.setAttribute('data-language', match[1]);
                                                                        if (match[2]) wrapper.setAttribute('data-filename', match[2]);
                                                                    }
                                                                    pre.parentNode.insertBefore(wrapper, pre);
                                                                    wrapper.appendChild(pre);
                                                                }
                                                            });
                                                        });

                                                        if (response.success) {
                                                            messageHistory[finalRecursiveOrder] = {
                                                                role: "assistant",
                                                                content: response.content,
                                                                timestamp: Date.now(),
                                                                order: finalRecursiveOrder
                                                            };
                                                            await saveChatToDatabase();
                                                            messageDiv.querySelectorAll('.code-block-wrapper').forEach(wrapper => {
                                                                if (!wrapper.querySelector('.copy-button')) {
                                                                    const copyButton = document.createElement('button');
                                                                    copyButton.className = 'copy-button';
                                                                    copyButton.textContent = 'Copy code';
                                                                    copyButton.onclick = () => copyCode(copyButton);
                                                                    wrapper.appendChild(copyButton);
                                                                }
                                                            });
                                                            // 重新添加消息操作按钮（确保按钮始终存在）
                                                            const newRecursiveActionButtons = document.createElement('div');
                                                            newRecursiveActionButtons.className = 'message-actions';
                                                            
                                                            // 复制按钮
                                                            const newRecursiveCopyButton = document.createElement('button');
                                                            newRecursiveCopyButton.className = 'action-button';
                                                            newRecursiveCopyButton.innerHTML = recursiveCopyButton.innerHTML;
                                                            newRecursiveCopyButton.title = '复制回答';
                                                            newRecursiveCopyButton.onclick = () => {
                                                                navigator.clipboard.writeText(response.content).then(() => {
                                                                    newRecursiveCopyButton.classList.add('copied');
                                                                    setTimeout(() => newRecursiveCopyButton.classList.remove('copied'), 2000);
                                                                });
                                                            };
                                                            
                                                            // 重新回答按钮 - 使用新的响应内容创建新的onclick函数
                                                            const newRecursiveRegenerateButton = document.createElement('button');
                                                            newRecursiveRegenerateButton.className = 'action-button';
                                                            newRecursiveRegenerateButton.innerHTML = recursiveRegenerateButton.innerHTML;
                                                            newRecursiveRegenerateButton.title = '重新回答';
                                                            // 递归：使用新内容创建新的onclick函数
                                                            const newRecursiveContent = response.content;
                                                            // 创建新的onclick函数，结构与recursiveRegenerateButton.onclick相同，但使用新内容
                                                            newRecursiveRegenerateButton.onclick = async () => {
                                                                messageDiv.innerHTML = '';
                                                                const newRecursiveOrder = messageHistory.findIndex(m => 
                                                                    m.role === 'assistant' && 
                                                                    m.content === newRecursiveContent
                                                                );
                                                                const newFinalRecursiveOrder = newRecursiveOrder !== -1 ? newRecursiveOrder : finalRecursiveOrder;
                                                                const newPreviousRecursiveMessages = messageHistory.filter((m, index) => index < newFinalRecursiveOrder);
                                                                const typingIndicator = document.createElement('div');
                                                                typingIndicator.className = 'typing-indicator';
                                                                typingIndicator.innerHTML = '<span></span><span></span><span></span>';
                                                                messageDiv.appendChild(typingIndicator);
                                                                
                                                                try {
                                                                    const messages = buildMessages(newPreviousRecursiveMessages);
                                                                    let textContainer = null;
                                                                    let accumulatedText = '';
                                                                    let currentIndex = 0;

                                                                    const newResponse = await sendToAPI(messages, async (chunk) => {
                                                                        if (currentIndex === 0) {
                                                                            messageDiv.innerHTML = '';
                                                                            textContainer = document.createElement('div');
                                                                            messageDiv.appendChild(textContainer);
                                                                        }
                                                                        accumulatedText += chunk;
                                                                        currentIndex += chunk.length;
                                                                        let processedHTML = accumulatedText;
                                                                        if (accumulatedText.includes('<sy_think>') && accumulatedText.includes('<search_references>')) {
                                                                            processedHTML = processThinkingTags(accumulatedText);
                                                                            textContainer.innerHTML = processedHTML;
                                                                            // 渲染数学公式
                                                                            renderMathFormulas(textContainer);
                                                                            const thinkingHeaders = textContainer.querySelectorAll('.thinking-header');
                                                                            const thinkingContents = textContainer.querySelectorAll('.thinking-content');
                                                                            thinkingHeaders.forEach(h => h.classList.add('expanded'));
                                                                            thinkingContents.forEach(c => c.style.display = 'block');
                                                                        } else if (accumulatedText.includes('<sy_think>')) {
                                                                            processedHTML = processThinkingTags(accumulatedText);
                                                                            textContainer.innerHTML = processedHTML;
                                                                            // 渲染数学公式
                                                                            renderMathFormulas(textContainer);
                                                                            const thinkingHeaders = textContainer.querySelectorAll('.thinking-header');
                                                                            const thinkingContents = textContainer.querySelectorAll('.thinking-content');
                                                                            thinkingHeaders.forEach(h => h.classList.add('expanded'));
                                                                            thinkingContents.forEach(c => c.style.display = 'block');
                                                                        } else if (accumulatedText.includes('<search_references>')) {
                                                                            processMessageWithReferences(accumulatedText, messageDiv);
                                                                        } else {
                                                                            textContainer.innerHTML = parseMarkdownWithMath(accumulatedText);
                                            renderMathFormulas(textContainer);
                                                                        }
                                                                        textContainer.querySelectorAll('pre code').forEach(block => {
                                                                            hljs.highlightElement(block);
                                                                            const pre = block.parentElement;
                                                                            if (!pre.parentElement?.classList.contains('code-block-wrapper')) {
                                                                                const wrapper = document.createElement('div');
                                                                                wrapper.className = 'code-block-wrapper';
                                                                                const match = block.className.match(/language-([^:]+)(?::(.+))?/);
                                                                                if (match) {
                                                                                    wrapper.setAttribute('data-language', match[1]);
                                                                                    if (match[2]) wrapper.setAttribute('data-filename', match[2]);
                                                                                }
                                                                                pre.parentNode.insertBefore(wrapper, pre);
                                                                                wrapper.appendChild(pre);
                                                                            }
                                                                        });
                                                                    });

                                                                    if (newResponse.success) {
                                                                        messageHistory[newFinalRecursiveOrder] = {
                                                                            role: "assistant",
                                                                            content: newResponse.content,
                                                                            timestamp: Date.now(),
                                                                            order: newFinalRecursiveOrder
                                                                        };
                                                                        await saveChatToDatabase();
                                                                        messageDiv.querySelectorAll('.code-block-wrapper').forEach(wrapper => {
                                                                            if (!wrapper.querySelector('.copy-button')) {
                                                                                const copyButton = document.createElement('button');
                                                                                copyButton.className = 'copy-button';
                                                                                copyButton.textContent = 'Copy code';
                                                                                copyButton.onclick = () => copyCode(copyButton);
                                                                                wrapper.appendChild(copyButton);
                                                                            }
                                                                        });
                                                                        
                                                                        // 继续递归添加按钮
                                                                        const continueActionButtons = document.createElement('div');
                                                                        continueActionButtons.className = 'message-actions';
                                                                        
                                                                        const continueCopyButton = document.createElement('button');
                                                                        continueCopyButton.className = 'action-button';
                                                                        continueCopyButton.innerHTML = newRecursiveCopyButton.innerHTML;
                                                                        continueCopyButton.title = '复制回答';
                                                                        continueCopyButton.onclick = () => {
                                                                            navigator.clipboard.writeText(newResponse.content).then(() => {
                                                                                continueCopyButton.classList.add('copied');
                                                                                setTimeout(() => continueCopyButton.classList.remove('copied'), 2000);
                                                                            });
                                                                        };
                                                                        
                                                                        const continueRegenerateButton = document.createElement('button');
                                                                        continueRegenerateButton.className = 'action-button';
                                                                        continueRegenerateButton.innerHTML = newRecursiveRegenerateButton.innerHTML;
                                                                        continueRegenerateButton.title = '重新回答';
                                                                        // 递归调用：创建新的onclick函数使用新内容
                                                                        const continueContent = newResponse.content;
                                                                        continueRegenerateButton.onclick = newRecursiveRegenerateButton.onclick; // 复用相同的逻辑结构
                                                                        
                                                                        continueActionButtons.appendChild(continueCopyButton);
                                                                        continueActionButtons.appendChild(continueRegenerateButton);
                                                                        messageDiv.appendChild(continueActionButtons);
                                                                    }
                                                                } catch (error) {
                                                                    console.error('Regenerate Error:', error);
                                                                    messageDiv.innerHTML = '重新生成回答时发生错误，请稍后重试';
                                                                }
                                                            };
                                                            
                                                            newRecursiveActionButtons.appendChild(newRecursiveCopyButton);
                                                            newRecursiveActionButtons.appendChild(newRecursiveRegenerateButton);
                                                            messageDiv.appendChild(newRecursiveActionButtons);
                                                        }
                                                    } catch (error) {
                                                        console.error('Regenerate Error:', error);
                                                        messageDiv.innerHTML = '重新生成回答时发生错误，请稍后重试';
                                                    }
                                                };

                                                recursiveActionButtons.appendChild(recursiveCopyButton);
                                                recursiveActionButtons.appendChild(recursiveRegenerateButton);
                                                messageDiv.appendChild(recursiveActionButtons);
                                            }
                                        } catch (error) {
                                            console.error('Regenerate Error:', error);
                                            messageDiv.innerHTML = '重新生成回答时发生错误，请稍后重试';
                                        } finally {
                                            // 重置发送状态并重新启用按钮
                                            isSending = false;
                                            newRegenerateButton.disabled = false;
                                        }
                                    };

                                    newActionButtons.appendChild(newCopyMessageButton);
                                    newActionButtons.appendChild(reRegenerateButton);
                                    messageDiv.appendChild(newActionButtons);
                                }
                            } catch (error) {
                                console.error('Regenerate Error:', error);
                                messageDiv.innerHTML = '重新生成回答时发生错误，请稍后重试';
                            } finally {
                                // 重置发送状态并重新启用按钮
                                isSending = false;
                                newRegenerateButton.disabled = false;
                            }
                        };

                        actionButtons.appendChild(copyMessageButton);
                        actionButtons.appendChild(newRegenerateButton);
                        messageDiv.appendChild(actionButtons);
                    }
                    
                    // 不再继续执行后面的代码
                    return;
                } catch (error) {
                    console.error('Send Message Error:', error);
                    if (messageDiv) {
                        messageDiv.innerHTML = '发生了外部错误，请稍后重试（伤心地垂下耳朵）';
                    }
                    // 停止执行
                    return;
                }
            } catch (error) {
                console.error('搜索失败:', error);
                searchButton.classList.remove('searching');
                
                // 添加错误消息到聊天
                const errorMessage = '搜索失败，请稍后重试';
                addMessage(errorMessage, 'assistant', 'main-chat-messages');
                messageHistory.push({
                    role: "assistant",
                    content: errorMessage,
                    timestamp: Date.now(),
                    order: messageHistory.length
                });
                return;
            }
        }

            // 创建新的消息容器
            const chatMessages = document.getElementById('main-chat-messages');
            
            // 添加打字机动画
            addTypingIndicator();

            try {
                // 使用 API 模块发送消息并处理流式响应
                const messages = buildMessages(messageHistory);
                            let textContainer = null;
                            let accumulatedText = '';
                let currentIndex = 0;

                const response = await sendToAPI(messages, async (chunk) => {
                    // 在第一次收到响应时创建消息容器
                    if (currentIndex === 0) {
                        removeTypingIndicator();
                        messageDiv = document.createElement('div');
                        messageDiv.className = 'message assistant-message';
                        chatMessages.appendChild(messageDiv);
                        
                        textContainer = document.createElement('div');
                        messageDiv.appendChild(textContainer);
                    }
                    
                    accumulatedText += chunk;
                    currentIndex += chunk.length;
                    
                    // 处理思考过程
                    let processedHTML = accumulatedText;
                    
                    // 检查是否有思考标签和引用标签
                    if (accumulatedText.includes('<sy_think>') && accumulatedText.includes('<search_references>')) {
                        // 同时包含思考标签和引用标签
                        processedHTML = processThinkingTags(accumulatedText);
                                        textContainer.innerHTML = processedHTML;
                                        
                                        // 渲染数学公式
                                        renderMathFormulas(textContainer);
                                        
                                        // 确保思考内容区域展开
                        const thinkingHeaders = textContainer.querySelectorAll('.thinking-header');
                        const thinkingContents = textContainer.querySelectorAll('.thinking-content');
                        
                        thinkingHeaders.forEach(header => {
                            header.classList.add('expanded');
                        });
                        
                        thinkingContents.forEach(content => {
                            content.style.display = 'block';
                        });
                    } else if (accumulatedText.includes('<sy_think>')) {
                        // 只有思考标签
                        processedHTML = processThinkingTags(accumulatedText);
                                        textContainer.innerHTML = processedHTML;
                                        
                                        // 渲染数学公式
                                        renderMathFormulas(textContainer);
                                        
                                        // 确保思考内容区域展开
                        const thinkingHeaders = textContainer.querySelectorAll('.thinking-header');
                        const thinkingContents = textContainer.querySelectorAll('.thinking-content');
                
                        thinkingHeaders.forEach(header => {
                            header.classList.add('expanded');
                        });
                
                        thinkingContents.forEach(content => {
                            content.style.display = 'block';
                        });
                    } else if (accumulatedText.includes('<search_references>')) {
                        // 只有引用标签
                        processMessageWithReferences(accumulatedText, messageDiv);
                    } else {
                        // 使用 marked 解析累积的文本
                        textContainer.innerHTML = parseMarkdownWithMath(accumulatedText);
                                            renderMathFormulas(textContainer);
                    }
                    
                                                            // 处理代码块
                                                            textContainer.querySelectorAll('pre code').forEach(block => {
                                                                // 跳过数学公式元素
                                                                if (isMathFormula(block)) {
                                                                    return;
                                                                }
                                                                
                                                                hljs.highlightElement(block);
                        
                        // 检查是否已经有包装器
                        const pre = block.parentElement;
                        if (!pre.parentElement?.classList.contains('code-block-wrapper')) {
                            const wrapper = document.createElement('div');
                            wrapper.className = 'code-block-wrapper';
                            
                            // 解析语言和文件名
                            const match = block.className.match(/language-([^:]+)(?::(.+))?/);
                            if (match) {
                                const language = match[1];
                                const filename = match[2];
                                // 直接使用完整的语言名称，不进行简化
                                wrapper.setAttribute('data-language', language);
                                if (filename) {
                                    wrapper.setAttribute('data-filename', filename);
                                }
                            }
                            
                            pre.parentNode.insertBefore(wrapper, pre);
                            wrapper.appendChild(pre);
                        }
                    });
                });

                if (response.success) {
                    // 添加AI回复到历史记录
                    const newMessage = {
                        role: "assistant",
                        content: response.content,
                        timestamp: Date.now(),
                    order: messageHistory.length
                    };
                    messageHistory.push(newMessage);

                    // 保存到数据库
                try {
                    const formData = new FormData();
                    formData.append('action', 'saveChatHistory');
                    
                    const firstUserMessage = messageHistory.find(msg => msg.role === 'user');
                    let chatTitle = firstUserMessage ? limitTitleLength(firstUserMessage.content, 9) : '新对话';
                    
                    formData.append('title', chatTitle);
                    formData.append('messages', JSON.stringify(messageHistory));
                    
                    if (currentChatId) {
                        formData.append('chatId', currentChatId);
                    }
                    
                        const saveResponse = await fetch('api.php', {
                            method: 'POST',
                            body: formData
                        });
                    
                    if (!saveResponse.ok) {
                        const errorText = await saveResponse.text();
                        console.error('保存失败:', errorText);
                        throw new Error(`保存失败: ${saveResponse.status} ${saveResponse.statusText}`);
                    }
                        
                        const saveData = await saveResponse.json();
                        
                        if (saveData.success) {
                            if (!currentChatId) {
                                currentChatId = saveData.chatId;
                                // 如果是新创建的聊天，添加到列表中
                                const existingChat = chatHistoryList.find(c => c.id === currentChatId);
                                if (!existingChat) {
                                    chatHistoryList.unshift({
                                        id: currentChatId,
                                        title: chatTitle,
                                        messages: [...messageHistory] // 使用当前的消息历史，不需要重新加载
                                    });
                                    updateChatHistoryUI();
                                }
                            } else {
                                // 如果已存在的聊天，只更新消息，不重置标题（避免覆盖已生成的AI标题）
                                const existingChat = chatHistoryList.find(c => c.id === currentChatId);
                                if (existingChat) {
                                    // 只有在标题是默认值"新对话"时，才更新为临时标题
                                    if (!existingChat.title || existingChat.title === '新对话') {
                                        existingChat.title = chatTitle;
                                    }
                                    existingChat.messages = [...messageHistory]; // 更新消息，不需要重新加载
                                    updateChatHistoryUI();
                                }
                            }

                            // 如果消息数量达到要求（有用户消息和助手回复），异步生成AI标题
                            // 只在标题还是初始默认值时才更新（避免每次发送消息都更新标题）
                            const userMessages = messageHistory.filter(msg => msg.role === 'user');
                            const assistantMessages = messageHistory.filter(msg => msg.role === 'assistant');
                            const existingChat = chatHistoryList.find(c => c.id === currentChatId);
                            const currentTitle = existingChat ? existingChat.title : chatTitle;
                            // 判断是否需要生成AI标题：
                            // 1. 消息数量>=2且有用户和助手消息
                            // 2. 标题是默认值"新对话"或者是临时标题（从第一条消息提取的）
                            // 3. 标题还未被AI生成过（避免重复生成）
                            const isDefaultTitle = !currentTitle || currentTitle === '新对话' || currentTitle === chatTitle;
                            // 确保只在首次对话或标题失败时生成，避免重复生成
                            const shouldGenerateTitle = userMessages.length > 0 && assistantMessages.length > 0 && 
                                                       messageHistory.length >= 2 && isDefaultTitle &&
                                                       (currentTitle === '新对话' || currentTitle === chatTitle);
                            if (shouldGenerateTitle) {
                                // 异步生成标题，不阻塞主流程
                                generateChatTitle(messageHistory).then(async (aiTitle) => {
                                    if (aiTitle && aiTitle !== chatTitle && currentChatId) {
                                        // 更新数据库中的标题
                                        const updateSuccess = await updateChatTitle(currentChatId, aiTitle);
                                        if (updateSuccess) {
                                            // 更新本地列表中的标题
                                            const chat = chatHistoryList.find(c => c.id === currentChatId);
                                            if (chat) {
                                                chat.title = aiTitle;
                                                // 使用打字机效果更新标题显示
                                                updateChatTitleWithTypewriter(currentChatId, aiTitle);
                                            }
                                        }
                                    }
                                }).catch(error => {
                                    console.error('生成标题失败:', error);
                                });
                            }

                            // 不再调用 loadUserChatHistory()，避免重复加载所有聊天记录的消息
                    } else {
                        throw new Error(saveData.error || '保存失败');
                        }
                    } catch (error) {
                        console.error('保存聊天历史失败:', error);
                    // 添加错误消息到聊天
                    const errorMessage = '保存聊天记录失败，但消息已发送';
                    addMessage(errorMessage, 'assistant', 'main-chat-messages');
                    }

                    // 在响应完成后为所有代码块添加复制按钮
                    messageDiv.querySelectorAll('.code-block-wrapper').forEach(wrapper => {
                        if (!wrapper.querySelector('.copy-button')) {
                            const copyButton = document.createElement('button');
                            copyButton.className = 'copy-button';
                            copyButton.textContent = 'Copy code';
                            copyButton.onclick = () => copyCode(copyButton);
                            wrapper.appendChild(copyButton);
                        }
                    });

                    // 重新添加消息操作按钮
                    const actionButtons = document.createElement('div');
                    actionButtons.className = 'message-actions';
                    
                    // 复制按钮
                    const copyMessageButton = document.createElement('button');
                    copyMessageButton.className = 'action-button';
                    copyMessageButton.innerHTML = `
                        <span class="copy-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        </span>
                        <span class="check-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </span>
                    `;
                    copyMessageButton.title = '复制回答';
                    copyMessageButton.onclick = () => {
                        navigator.clipboard.writeText(response.content).then(() => {
                            copyMessageButton.classList.add('copied');
                            setTimeout(() => copyMessageButton.classList.remove('copied'), 2000);
                        });
                    };

                    // 重新回答按钮
                    const newRegenerateButton = document.createElement('button');
                    newRegenerateButton.className = 'action-button';
                    newRegenerateButton.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/>
                        </svg>
                    `;
                    newRegenerateButton.title = '重新回答';
                    newRegenerateButton.onclick = async () => {
                        // 如果正在发送消息，直接返回，防止重复调用
                        if (isSending) {
                            return;
                        }

                        // 设置发送状态为true
                        isSending = true;
                        // 禁用重新回答按钮，防止重复点击
                        newRegenerateButton.disabled = true;

                        // 移除当前回答的内容，但保留消息容器
                        messageDiv.innerHTML = '';
                        
                        // 获取当前消息的order
                        const currentMessageOrder = messageHistory.findIndex(m => 
                            m.role === 'assistant' && 
                            m.content === response.content
                        );

                        // 创建一个新的消息历史，只包含当前消息之前的对话
                        const previousMessages = messageHistory.filter((m, index) => index < currentMessageOrder);
                        
                        // 添加打字机动画
                        const typingIndicator = document.createElement('div');
                        typingIndicator.className = 'typing-indicator';
                        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
                        messageDiv.appendChild(typingIndicator);

                        try {
                            // 使用截至当前消息之前的历史记录重新请求回答
                            const messages = buildMessages(previousMessages);
                            let textContainer = null;
                            let accumulatedText = '';
                            let currentIndex = 0;
                            
                            const regenerateResponse = await sendToAPI(messages, async (chunk) => {
                                // 在第一次收到响应时创建文本容器
                                if (currentIndex === 0) {
                                    messageDiv.innerHTML = ''; // 清除打字机动画
                                    textContainer = document.createElement('div');
                                    messageDiv.appendChild(textContainer);
                                }
                                
                                accumulatedText += chunk;
                                currentIndex += chunk.length;
                                
                                // 处理思考过程
                                let processedHTML = accumulatedText;
                                
                                // 检查是否有思考标签和引用标签
                                if (accumulatedText.includes('<sy_think>') && accumulatedText.includes('<search_references>')) {
                                    // 同时包含思考标签和引用标签
                                    processedHTML = processThinkingTags(accumulatedText);
                                        textContainer.innerHTML = processedHTML;
                                        
                                        // 渲染数学公式
                                        renderMathFormulas(textContainer);
                                        
                                        // 确保思考内容区域展开
                                    const thinkingHeaders = textContainer.querySelectorAll('.thinking-header');
                                    const thinkingContents = textContainer.querySelectorAll('.thinking-content');
                                    
                                    thinkingHeaders.forEach(header => {
                                        header.classList.add('expanded');
                                    });
                                    
                                    thinkingContents.forEach(content => {
                                        content.style.display = 'block';
                                    });
                                } else if (accumulatedText.includes('<sy_think>')) {
                                    // 只有思考标签
                                    processedHTML = processThinkingTags(accumulatedText);
                                        textContainer.innerHTML = processedHTML;
                                        
                                        // 渲染数学公式
                                        renderMathFormulas(textContainer);
                                        
                                        // 确保思考内容区域展开
                                    const thinkingHeaders = textContainer.querySelectorAll('.thinking-header');
                                    const thinkingContents = textContainer.querySelectorAll('.thinking-content');
                
                                    thinkingHeaders.forEach(header => {
                                        header.classList.add('expanded');
                                    });
                
                                    thinkingContents.forEach(content => {
                                        content.style.display = 'block';
                                    });
                                } else if (accumulatedText.includes('<search_references>')) {
                                    // 只有引用标签
                                    processMessageWithReferences(accumulatedText, messageDiv);
                                } else {
                                    // 使用 marked 解析累积的文本
                                    textContainer.innerHTML = parseMarkdownWithMath(accumulatedText);
                                            renderMathFormulas(textContainer);
                                }
                                
                                                            // 处理代码块
                                                            textContainer.querySelectorAll('pre code').forEach(block => {
                                                                // 跳过数学公式元素
                                                                if (isMathFormula(block)) {
                                                                    return;
                                                                }
                                                                
                                                                hljs.highlightElement(block);
                                    
                                    // 检查是否已经有包装器
                                    const pre = block.parentElement;
                                    if (!pre.parentElement?.classList.contains('code-block-wrapper')) {
                                        const wrapper = document.createElement('div');
                                        wrapper.className = 'code-block-wrapper';
                                        
                                        // 解析语言和文件名
                                        const match = block.className.match(/language-([^:]+)(?::(.+))?/);
                                        if (match) {
                                            const language = match[1];
                                            const filename = match[2];
                                            wrapper.setAttribute('data-language', language);
                                            if (filename) {
                                                wrapper.setAttribute('data-filename', filename);
                                            }
                                        }
                                        
                                        pre.parentNode.insertBefore(wrapper, pre);
                                        wrapper.appendChild(pre);
                                    }
                                });
                            });

                            if (regenerateResponse.success) {
                                // 更新历史记录中对应order的消息
                                messageHistory[currentMessageOrder] = {
                                    role: "assistant",
                                    content: regenerateResponse.content,
                                    timestamp: Date.now(),
                                    order: currentMessageOrder
                                };

                                // 更新response变量，确保下次重新回答能找到正确的消息
                                response.content = regenerateResponse.content;

                                // 保存到数据库
                                await saveChatToDatabase();

                                // 在响应完成后为所有代码块添加复制按钮
                                messageDiv.querySelectorAll('.code-block-wrapper').forEach(wrapper => {
                                    if (!wrapper.querySelector('.copy-button')) {
                                        const copyButton = document.createElement('button');
                                        copyButton.className = 'copy-button';
                                        copyButton.textContent = 'Copy code';
                                        copyButton.onclick = () => copyCode(copyButton);
                                        wrapper.appendChild(copyButton);
                                    }
                                });

                                // 重新添加消息操作按钮
                                const newActionButtons = document.createElement('div');
                                newActionButtons.className = 'message-actions';
                                
                                // 复制按钮
                                const newCopyMessageButton = document.createElement('button');
                                newCopyMessageButton.className = 'action-button';
                                newCopyMessageButton.innerHTML = copyMessageButton.innerHTML;
                                newCopyMessageButton.title = '复制回答';
                                newCopyMessageButton.onclick = () => {
                                    navigator.clipboard.writeText(regenerateResponse.content).then(() => {
                                        newCopyMessageButton.classList.add('copied');
                                        setTimeout(() => newCopyMessageButton.classList.remove('copied'), 2000);
                                    });
                                };

                                // 重新添加重新回答按钮
                                const reRegenerateButton = document.createElement('button');
                                reRegenerateButton.className = 'action-button';
                                reRegenerateButton.innerHTML = newRegenerateButton.innerHTML;
                                reRegenerateButton.title = '重新回答';
                                reRegenerateButton.onclick = newRegenerateButton.onclick;

                                newActionButtons.appendChild(newCopyMessageButton);
                                newActionButtons.appendChild(reRegenerateButton);
                                messageDiv.appendChild(newActionButtons);
                            }
                        } catch (error) {
                            console.error('Regenerate Error:', error);
                            messageDiv.innerHTML = '重新生成回答时发生错误，请稍后重试';
                        } finally {
                            // 重置发送状态并重新启用按钮
                            isSending = false;
                            newRegenerateButton.disabled = false;
                        }
                    };

                    actionButtons.appendChild(copyMessageButton);
                    actionButtons.appendChild(newRegenerateButton);
                    messageDiv.appendChild(actionButtons);
                }
            } catch (error) {
                console.error('Send Message Error:', error);
                if (messageDiv) {
                    messageDiv.innerHTML = '发生了外部错误，请稍后重试（伤心地垂下耳朵）';
            }
        }
    } catch (error) {
        console.error('Send Message Error:', error);
        if (messageDiv) {
            messageDiv.innerHTML = '发生了外部错误，请稍后重试（伤心地垂下耳朵）';
        }
    } finally {
        // 重置发送状态
        isSending = false;
        // 重新启用输入和发送按钮
        userInput.disabled = false;
        sendButton.disabled = false;
        userInput.focus();
    }
}

// 限制标题长度为9个字符（中文字符占1个位置，英文/数字占0.5个位置）
function limitTitleLength(title, maxLength = 9) {
    if (!title || !title.trim()) {
        return '新对话';
    }
    
    title = title.trim();
    let charCount = 0;
    let limitedTitle = '';
    
    for (let i = 0; i < title.length; i++) {
        const char = title[i];
        // 判断是否为中文字符
        if (/[\u4e00-\u9fa5]/.test(char)) {
            charCount += 1;
        } else {
            charCount += 0.5; // 英文/数字算半个字符
        }
        if (charCount <= maxLength) {
            limitedTitle += char;
        } else {
            break;
        }
    }
    
    return limitedTitle.trim() || '新对话';
}

// 使用AI生成聊天标题
async function generateChatTitle(messages) {
    try {
        // 如果消息数量少于2条，使用第一条用户消息作为标题
        if (messages.length < 2) {
            const firstUserMessage = messages.find(msg => msg.role === 'user');
            if (firstUserMessage) {
                let title = firstUserMessage.content.replace(/[。，、；：：！？\s]+/g, ' ').trim();
                return limitTitleLength(title, 9);
            }
            return '新对话';
        }

        // 提取对话内容（只包含用户和助手的消息）
        const conversationText = messages
            .filter(msg => msg.role === 'user' || msg.role === 'assistant')
            .slice(0, 10) // 只取前10条消息，避免内容过长
            .map(msg => {
                // 清理消息内容，移除特殊标记和HTML标签
                let content = msg.content
                    .replace(/<sy_think>[\s\S]*?<\/sy_think>/gi, '') // 移除思考内容
                    .replace(/<search_references>[\s\S]*?<\/search_references>/gi, '') // 移除搜索引用
                    .replace(/<[^>]+>/g, '') // 移除HTML标签
                    .slice(0, 200); // 每条消息最多200字符
                return `${msg.role === 'user' ? '用户' : '助手'}: ${content}`;
            })
            .join('\n');

        // 构建提示词
        const prompt = `请根据以下对话内容，生成一个简洁的标题（不超过9个汉字），要求：
1. 标题要能准确概括对话的主要内容
2. 标题要简洁明了，避免使用标点符号
3. 只用中文回答，不要添加任何其他说明
4. 标题长度必须严格控制在9个汉字以内

对话内容：
${conversationText}

标题：`;

        // 调用AI API生成标题
        const response = await fetch('/api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
                body: JSON.stringify({
                action: 'chat',
                messages: [
                    {
                        role: 'system',
                        content: '你是一个专业的标题生成助手，擅长根据对话内容生成简洁准确的标题。'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                model: 'gpt', // 统一使用通用助手模型生成标题
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error('生成标题失败');
        }

        const data = await response.json();
        
        // 检查响应格式，可能是 {success: true, content: ...} 或者直接的API响应
        let titleContent = '';
        if (data.success && data.content) {
            titleContent = data.content;
        } else if (data.choices && data.choices[0] && data.choices[0].message) {
            titleContent = data.choices[0].message.content;
        } else if (typeof data === 'string') {
            titleContent = data;
        }
        
        if (titleContent) {
            // 清理标题内容，移除可能的标点和多余内容
            let title = titleContent.trim()
                .replace(/^标题[：:]\s*/i, '')
                .replace(/[。，、；：：！？\s]+/g, ' ')
                .trim();
            
            // 使用辅助函数限制标题长度为9个字符
            return limitTitleLength(title, 9);
        }

        // 如果生成失败，使用第一条用户消息作为标题
        const firstUserMessage = messages.find(msg => msg.role === 'user');
        if (firstUserMessage) {
            let title = firstUserMessage.content.replace(/[。，、；：：！？\s]+/g, ' ').trim();
            return limitTitleLength(title, 9);
        }
        return '新对话';
    } catch (error) {
        console.error('生成标题失败:', error);
        // 如果生成失败，使用第一条用户消息作为标题
        const firstUserMessage = messages.find(msg => msg.role === 'user');
        if (firstUserMessage) {
            let title = firstUserMessage.content.replace(/[。，、；：：！？\s]+/g, ' ').trim();
            return limitTitleLength(title, 9);
        }
        return '新对话';
    }
}

// 打字机效果显示文本
function typewriterEffect(element, text, speed = 50) {
    element.textContent = '';
    let index = 0;
    
    function typeChar() {
        if (index < text.length) {
            element.textContent += text[index];
            index++;
            setTimeout(typeChar, speed);
        }
    }
    
    typeChar();
}

// 更新聊天标题
async function updateChatTitle(chatId, newTitle) {
    try {
        const formData = new FormData();
        formData.append('action', 'updateChatTitle');
        formData.append('chatId', chatId);
        formData.append('title', newTitle);

        const response = await fetch('api.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('更新标题失败:', error);
        return false;
    }
}

// 更新聊天标题显示（带打字机效果）
function updateChatTitleWithTypewriter(chatId, newTitle) {
    // 查找对应的聊天记录元素
    const chatElement = document.querySelector(`.chat-history-item[data-id="${chatId}"]`);
    if (chatElement) {
        const titleElement = chatElement.querySelector('.chat-title');
        if (titleElement) {
            // 使用打字机效果显示新标题
            typewriterEffect(titleElement, newTitle, 30);
        }
    }
}

// 保存聊天到数据库的辅助函数
async function saveChatToDatabase() {
    try {
        const formData = new FormData();
        formData.append('action', 'saveChatHistory');
        
        const firstUserMessage = messageHistory.find(msg => msg.role === 'user');
        let chatTitle = firstUserMessage ? limitTitleLength(firstUserMessage.content, 9) : '新对话';
        
        const messagesWithOrder = messageHistory.map((msg, index) => ({
            ...msg,
            order: index
        }));
        
        formData.append('title', chatTitle);
        formData.append('messages', JSON.stringify(messagesWithOrder));
        
        if (currentChatId) {
            formData.append('chatId', currentChatId);
        }
        
        const saveResponse = await fetch('api.php', {
            method: 'POST',
            body: formData
        });
        
        const saveData = await saveResponse.json();
        
        if (saveData.success) {
            if (!currentChatId) {
                currentChatId = saveData.chatId;
                // 如果是新创建的聊天，添加到列表中
                const existingChat = chatHistoryList.find(c => c.id === currentChatId);
                if (!existingChat) {
                    chatHistoryList.unshift({
                        id: currentChatId,
                        title: chatTitle,
                        messages: [...messageHistory] // 使用当前的消息历史，不需要重新加载
                    });
                    updateChatHistoryUI();
                }
            } else {
                // 如果已存在的聊天，只更新消息，不重置标题（避免覆盖已生成的AI标题）
                const existingChat = chatHistoryList.find(c => c.id === currentChatId);
                if (existingChat) {
                    // 只有在标题是默认值"新对话"时，才更新为临时标题
                    if (!existingChat.title || existingChat.title === '新对话') {
                        existingChat.title = chatTitle;
                    }
                    existingChat.messages = [...messageHistory]; // 更新消息，不需要重新加载
                    updateChatHistoryUI();
                }
            }

            // 如果消息数量达到要求（有用户消息和助手回复），异步生成AI标题
            // 只在标题还是初始默认值时才更新（避免每次发送消息都更新标题）
            const userMessages = messageHistory.filter(msg => msg.role === 'user');
            const assistantMessages = messageHistory.filter(msg => msg.role === 'assistant');
            const existingChat = chatHistoryList.find(c => c.id === currentChatId);
            const currentTitle = existingChat ? existingChat.title : chatTitle;
            // 判断是否需要生成AI标题：
            // 1. 消息数量>=2且有用户和助手消息
            // 2. 标题是默认值"新对话"或者是临时标题（从第一条消息提取的）
            // 3. 标题还未被AI生成过（避免重复生成）
            const isDefaultTitle = !currentTitle || currentTitle === '新对话' || currentTitle === chatTitle;
            // 确保只在首次对话或标题失败时生成，避免重复生成
            const shouldGenerateTitle = userMessages.length > 0 && assistantMessages.length > 0 && 
                                       messageHistory.length >= 2 && isDefaultTitle &&
                                       (currentTitle === '新对话' || currentTitle === chatTitle);
            if (shouldGenerateTitle) {
                // 异步生成标题，不阻塞主流程
                generateChatTitle(messageHistory).then(async (aiTitle) => {
                    if (aiTitle && aiTitle !== chatTitle && currentChatId) {
                        // 更新数据库中的标题
                        const updateSuccess = await updateChatTitle(currentChatId, aiTitle);
                        if (updateSuccess) {
                            // 更新本地列表中的标题
                            const chat = chatHistoryList.find(c => c.id === currentChatId);
                            if (chat) {
                                chat.title = aiTitle;
                                // 使用打字机效果更新标题显示
                                updateChatTitleWithTypewriter(currentChatId, aiTitle);
                            }
                        }
                    }
                }).catch(error => {
                    console.error('生成标题失败:', error);
                });
            }
            
            // 不再调用 loadUserChatHistory()，避免重复加载所有聊天记录的消息
        }
    } catch (error) {
        console.error('保存聊天历史失败:', error);
    }
}

// 修改主题切换功能
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle'); // 修改这里，使用 class 选择器
    const root = document.documentElement;
    
    // 从localStorage加载主题设置
    const savedTheme = localStorage.getItem('theme') || 'dark';
    root.setAttribute('data-theme', savedTheme);
    
    if (themeToggle) {
        // 移除可能存在的旧事件监听器
        themeToggle.replaceWith(themeToggle.cloneNode(true));
        const newThemeToggle = document.querySelector('.theme-toggle');
        
        newThemeToggle.addEventListener('click', () => {
            const currentTheme = root.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            root.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // 更新图标
            updateThemeIcon(newTheme);
        });
        
        // 初始化图标
        updateThemeIcon(savedTheme);
    }
}

function updateThemeIcon(theme) {
    const themeToggle = document.querySelector('.theme-toggle'); // 修改这里，使用 class 选择器
    if (!themeToggle) return;
    
    if (theme === 'light') {
        themeToggle.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
        `;
    } else {
        themeToggle.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
        `;
    }
}

// 确保在 DOMContentLoaded 时初始化主题切换功能
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    
    // 其他初始化代码...
});

// 在页面加载完成后也初始化一次
window.addEventListener('load', () => {
    initThemeToggle();
});

// 添加模态框控制函数
function showDeleteConfirmModal(callback) {
    const modal = document.getElementById('deleteConfirmModal');
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);

    const confirmBtn = modal.querySelector('.confirm');
    const cancelBtn = modal.querySelector('.cancel');
    
    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
        confirmBtn.removeEventListener('click', handleConfirm);
        cancelBtn.removeEventListener('click', handleCancel);
    }
    
    function handleConfirm() {
        closeModal();
        callback(true);
    }
    
    function handleCancel() {
        closeModal();
        callback(false);
    }
    
    confirmBtn.addEventListener('click', handleConfirm);
    cancelBtn.addEventListener('click', handleCancel);
}

// 修改删除按钮的事件处理
deleteButton.addEventListener('click', async (e) => {
    e.stopPropagation(); // 阻止事件冒泡
    
    showDeleteConfirmModal(async (confirmed) => {
        if (confirmed) {
            try {
                const formData = new FormData();
                formData.append('action', 'deleteChatHistory');
                formData.append('chatId', chat.id);
                
                const response = await fetch('api.php', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // 如果删除的是当前对话，清空聊天区域
                    if (chat.id === currentChatId) {
                        currentChatId = null;
                        document.getElementById('main-chat-messages').innerHTML = '';
                        messageHistory.length = 0;
                        
                        // 显示欢迎消息
                        const welcomeMessage = '你好呀，有什么可以帮忙的？';
                        addMessage(welcomeMessage, 'ai', 'main-chat-messages');
                    }
                    
                    // 从本地数组中移除该聊天记录，避免重新加载所有聊天记录
                    const index = chatHistoryList.findIndex(c => c.id === chat.id);
                    if (index !== -1) {
                        chatHistoryList.splice(index, 1);
                    }
                    
                    // 只更新UI，不需要重新加载所有聊天记录
                    updateChatHistoryUI();
                } else {
                    alert('删除失败：' + (data.error || '未知错误'));
                }
            } catch (error) {
                console.error('删除聊天失败:', error);
                alert('删除失败，请重试');
            }
        }
    });
});

// 处理思考标签的函数
function processThinkingTags(content) {
    // 检查是否包含思考标签
    if (!content.includes('<sy_think>')) {
        return parseMarkdownWithMath(content);
    }
    
    // 检查是否同时包含搜索引用
    if (content.includes('<search_references>')) {
        // 分离引用数据和主要内容
        const referencesParts = content.split('<search_references>');
        const mainContentWithThinking = referencesParts[0];
        let references = [];
        
        try {
            // 尝试解析引用数据
            const referencesJson = referencesParts[1].split('</search_references>')[0];
            references = JSON.parse(referencesJson);
            
            // 处理带思考标签的主要内容
            const processedMainContent = processThinkingContent(mainContentWithThinking);
            
            // 创建完整的HTML
            let html = processedMainContent;
            
            // 添加引用部分的HTML
            const referencesHTML = `
                <div class="reference-container">
                    <h5>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M2 12h20"/>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                        </svg>
                        引用内容:
                    </h5>
                    <ul>
                        ${references.map(ref => `
                            <li>
                                <a href="${ref.url}" target="_blank" rel="noopener noreferrer">${ref.title}</a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
            
            html += referencesHTML;
            return html;
        } catch (error) {
            console.error('解析引用数据失败:', error);
            // 如果解析引用失败，仍处理思考标签部分
            return processThinkingContent(content);
        }
    } else {
        // 只有思考标签，没有引用标签
        return processThinkingContent(content);
    }
    
    // 内部辅助函数：处理只包含思考标签的内容
    function processThinkingContent(content) {
        // HTML转义函数，将thinking内容转换为纯文本
        function escapeHtml(text) {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, function(m) { return map[m]; });
        }
        
        // 将思考内容收集到一起
        let mainContent = '';
        let thinkingContent = '';
        
        // 分割内容为各个部分
        const parts = content.split(/<sy_think>|<\/sy_think>/);
        for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
                // 非思考部分
                mainContent += parts[i];
            } else {
                // 思考部分
                thinkingContent += parts[i];
            }
        }
        
        // 处理空白字符：移除中文字符之间的空格，使字符间距一致
        // 先移除所有换行符和制表符，替换为空格
        thinkingContent = thinkingContent.replace(/[\n\r\t]/g, ' ');
        // 移除中文字符之间的所有空白字符（中文字符Unicode范围：\u4e00-\u9fff，包括中文标点）
        // 匹配中文字符之间的任意空白字符（包括空格、多个空格等）
        thinkingContent = thinkingContent.replace(/([\u4e00-\u9fff\u3000-\u303f\uff00-\uffef])\s+([\u4e00-\u9fff\u3000-\u303f\uff00-\uffef])/g, '$1$2');
        // 将多个连续空格替换为单个空格（用于中英文之间的必要空格）
        thinkingContent = thinkingContent.replace(/\s+/g, ' ');
        // 最后去除首尾空格
        thinkingContent = thinkingContent.trim();
        
        // 计算思考时长（假设每10个字符约1秒）
        const thinkingTimeInSeconds = Math.max(Math.round(thinkingContent.length / 10), 1);
        const thinkingTimeText = thinkingTimeInSeconds > 60 
            ? `${Math.floor(thinkingTimeInSeconds / 60)}分${thinkingTimeInSeconds % 60}秒`
            : `${thinkingTimeInSeconds}秒`;
        
        // 将各部分转换为HTML
        let html = '';
        
        // 创建折叠式深度思考区域
        const thinkingId = 'thinking-' + Date.now();
        
        // 先添加思考标题和内容，默认显示内容（不再隐藏）
        html += `
            <div class="thinking-summary">
                <div class="thinking-header expanded" data-target="${thinkingId}" onclick="toggleThinking('${thinkingId}')">
                    <svg class="thinking-icon" viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"></path>
                    </svg>
                    已进行深度思考 (耗时${thinkingTimeText})
                    <svg class="thinking-arrow" viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path>
                    </svg>
                </div>
                <div id="${thinkingId}" class="thinking-content" style="display: block; max-height: none; overflow: visible;">
                    <div style="white-space: normal; word-wrap: break-word; word-break: break-word; margin: 0; padding: 0; background: transparent; border: none; font-family: inherit; font-size: inherit; line-height: inherit; overflow-wrap: break-word;">${escapeHtml(thinkingContent)}</div>
                </div>
            </div>
        `;
        
        // 然后添加主要内容
        if (mainContent.trim()) {
            html += parseMarkdownWithMath(mainContent);
        }
        
        // 确保toggleThinking函数存在
        if (!window.toggleThinking) {
            window.toggleThinking = function(id) {
                const content = document.getElementById(id);
                if (!content) return;
                
                const header = document.querySelector(`.thinking-header[data-target="${id}"]`);
                
                if (content.style.display === 'none') {
                    content.style.display = 'block';
                    if (header) header.classList.add('expanded');
                } else {
                    content.style.display = 'none';
                    if (header) header.classList.remove('expanded');
                }
            };
        }
        
        return html;
    }
}

// 添加 Tavily 搜索函数
async function searchWithTavily(query) {
    try {
        const response = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TAVILY_API_KEY}`
            },
            body: JSON.stringify({
                query: query,
                search_depth: "basic",
                max_results: 5
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('搜索请求失败:', errorText);
            throw new Error(`搜索请求失败: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.results) {
            throw new Error('搜索结果格式错误');
        }
        return data.results;
    } catch (error) {
        console.error('搜索出错:', error);
        throw error;
    }
}

// 修改处理引用内容的函数
function processMessageWithReferences(content, messageDiv) {
    // 检查消息是否包含搜索引用
    if (content.includes('<search_references>')) {
        // 提取引用数据和主要内容
        const parts = content.split('<search_references>');
        const mainContent = parts[0];
        let references = [];
        
        try {
            // 尝试解析引用数据
            const referencesJson = parts[1].split('</search_references>')[0];
            references = JSON.parse(referencesJson);
            
            // 首先渲染主要内容
            messageDiv.innerHTML = parseMarkdownWithMath(mainContent);
            
            // 渲染数学公式
            renderMathFormulas(messageDiv);
            
            // 然后添加引用容器
            const referenceContainer = document.createElement('div');
            referenceContainer.className = 'reference-container';
            
            const referencesHTML = `
                <h5>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M2 12h20"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                    引用内容:
                </h5>
                <ul>
                    ${references.map(ref => `
                        <li>
                            <a href="${ref.url}" target="_blank" rel="noopener noreferrer">${ref.title}</a>
                        </li>
                    `).join('')}
                </ul>
            `;
            
            referenceContainer.innerHTML = referencesHTML;
            messageDiv.appendChild(referenceContainer);
            
            // 高亮代码块
            messageDiv.querySelectorAll('pre code').forEach(block => {
                // 跳过数学公式元素
                if (isMathFormula(block)) {
                    return;
                }
                
                hljs.highlightElement(block);
            });
            
            return true;
        } catch (error) {
            console.error('解析引用数据失败:', error);
            // 如果解析失败，回退到普通渲染
            messageDiv.innerHTML = parseMarkdownWithMath(content);
            renderMathFormulas(messageDiv);
            return false;
        }
    } else {
        // 普通消息，直接解析
        messageDiv.innerHTML = parseMarkdownWithMath(content);
        renderMathFormulas(messageDiv);
        return false;
    }
}
