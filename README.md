# RPageSearch  
实现自动化静态站全站搜索 - 高性能/实时搜索/正则语法支持/异步/web worker/自动持续构建/可拓展数据格式/自定义前端样式

## 效果
在我的博客(https://ravelloh.top/articles/) 中可直接试用此搜索功能，感受它的高性能。  

## 原理
构建时运行`search.js`，这会对站点所有文章进行索引并生成一个索引文件`search.json`。  
在客户端使用时，浏览器会请求生成的`search.json`，并与Web Worker`search.worker.js`建立连接。  
在搜索时，搜索词及索引数据将会被发送至Worker并处理，Worker返回一个JSON格式的搜索结果。  
之后，前端处理返回的结果并展示。  


## 使用

### 初始化配置

> **注意：你需要先根据自己的页面结构调整脚本**

#### 配置目录结构  

例子：
如果你的文章目录结构如下：
```
......
├── articles
│   ├── 20200816
│   │   ├── index.html
│   ├── 20210701
│   │   └── index.html
│   ├── 20210705
│   │   └── index.html
│   ├── 20210719
│   │   └── index.html
│   ├── 20220206
│   │   └── index.html
......
```
需要在`search.js`中这样配置：
```js
// 配置区
const articlesFolder = "../articles/"; // 文章根目录
const articlesFileName = "index.html"; // 文档文件名
const savePath = "../assets/data/search.json";
```
RPageSearch默认会在`articlesFolder`中列出所有目录，并检测其中是否含有`articlesFileName`，如果有则进行解析。  
其中，`savePath`定义了生成数据的保存路径，后期会用到。

#### 配置页面结构
例子：
如果你的文章文档结构如下：
```html
<article>
    <div id="articles-header">
        <h2><a href="/articles/20221224/">HikvisionIP摄像头后台绕过</a></h2><p class="articles-info">
            <time>2022-12-24</time> •<span class="i_small ri:archive-line"></span><span class="class"><a>网络安全</a>/<a>技术</a></span> •<span class="i_small ri:t-box-line"></span> <span id="textLength">----字</span> •<span class="i_small ri:search-eye-line"></span> <span id="pageVisitors">---</span>
        </p>
        <p class="articles-tags">
            <span class="i_small ri:price-tag-3-line"></span><a>ATTACK</a><a>JSON</a><a>MONITOR</a>
        </p>
        <hr>
    </div>
    <div id="articles-body">
        <h3>标题</h3><p>
            正文内容
        </p>
        <br><br><h3>标题</h3><p>
            正文
        </p>
        <h3>标题</h3><p>
            正文
        </p>
    </div>
    <div id="articles-footer">
        略
    </div>
</article>
```
可以在`search.js`中这样配置：
```js
// 选择器
const articlesName = "#articles-header h2 a"; // 文章标题元素
const articlesUrl = "#articles-header h2 a"; // 文章链接元素
const articlesTime = "#articles-header .articles-info time"; // 文章时间元素
const articlesClass = "#articles-header .articles-info .class a"; // 文章分类元素
const articlesTag = "#articles-header .articles-tags a"; // 文章标签元素
const articlesBody = "#articles-body"; // 文章正文元素
const articlesImages = "#articles-body img"; // 文章图片元素
const articlesLinks = "#articles-body a"; // 文章外链元素
const articlesTitle =
  "#articles-body h2 , #articles-body h3 , articles-body h4 , articles-body h5 , articles-body h6"; // 文章小标题元素
```
这里可以任意使用CSS选择器，参考如上。

#### 生成索引数据
安装依赖并执行`search.js`
```
npm install
node search.js
```

不出意外，用于保存结果的`search.json`会正常生成在之前定义的路径`savePath`中。  
此文件用于与search.worker.js通信，其格式一般不需要调整，为所有索引的对象，其中的一项格式如下：  
```json
{
        "name": "Minecraft反转药水效果",
        "url": "/articles/20200816/",
        "time": "2020-08-16",
        "class": [
            "游戏"
        ],
        "tag": [
            "minecraft",
            "json"
        ],
        "title": [
            "原理",
            "效果",
            "命令"
        ],
        "context": "文章内容，略"
        "img": [
            "/articles/20200816/show1.gif",
            "/articles/20200816/show2.gif",
            "/articles/20200816/show3.gif"
        ],
        "links": []
}
```

#### 前端接入
你需要在frontEnd.js中自定义以适应你的样式。详细的例子，可以参照我的博客(https://ravelloh.top/articles/)或RTheme(https://github.com/ravelloh/RTheme)
`search.worker.js`一般不需要调整。它会在搜索时返回以下结构的结果：
```json
[
    {
        "name": "论静态页中伪动态的实现",
        "url": "/articles/20220708/",
        "time": "2022-07-08",
        "class": [
            "技术",
            "设计"
        ],
        "tag": [
            "javascript",
            "html",
            "python"
        ],
        "title": [
            "前言",
            "效果",
            "实现方法",
            "页面自动构建"
        ],
        "context": "文章内容，这里略"
        "img": [
            "/articles/20220708/show1.gif",
            "/articles/20220708/show2.png",
            "/articles/20220708/code3.png"
        ],
        "links": [
            "?text=123&?name=aaa#锚点",
            "https://ravelloh.github.io/PSGameSpider/",
            "https://ravelloh.github.io/EverydayNews/",
            "https://github.com/RavelloH/PSGameSpider",
            "?text=123&?name=aaa#实现方法",
            "https://docs.github.com/cn/actions",
            "https://github.com/RavelloH/PSGameSpider",
            "https://github.com/RavelloH/EverydayNews"
        ],
        "match": [
            [
                "context",
                25,
                118
            ],
            [
                "links",
                1
            ]
        ],
        "matchTimes": 25
    },
    {
        "name": "静态站实现全站搜索",
        "url": "/articles/20220825/",
        "time": "2022-08-25",
        "class": [
            "技术",
            "设计"
        ],
        "tag": [
            "javascript",
            "json",
            "python"
        ],
        "title": [
            "前言",
            "效果",
            "实现方式",
            "代码分析",
            "后言"
        ],
        "context": "文章内容，这里略"
        "img": [
            "/articles/20220825/show1.jpg"
        ],
        "links": [
            "/articles/",
            "https://github.com/ravelloh/ravelloh.github.io",
            "https://github.com/ravelloh/RPageSearch"
        ],
        "match": [
            [
                "context",
                7,
                103
            ],
            [
                "links",
                1
            ]
        ],
        "matchTimes": 7
    }
]
```

返回的对象包含索引的所有内容，并已经按照相关度排序，且其匹配项会被包裹在`<mark></mark>`标签内。除此以外，还会包含一个特殊值`match`用于表示所有匹配的结果数据。  
`match`定义了一个结果列表，其每一项的第一项表示匹配的属性，第二项表示匹配的属性在所有属性中的排序。  
其中，`context`属性与其他属性稍微不同，它的第二项是匹配个数，第三项是第一次匹配的字符位置。  
`match`的最后一项是`matchTimes`，表示匹配次数。如果含有标题匹配，这个值会是`999999`以确保其在结果中置顶。

因为是使用worker通讯，你可以参照`frontEnd.js`中的`search`函数配置你的结果展示。

### 持续构建
在初始化成功后，你可以使用github Workflow在有更改时自动构建。
添加一个`.github/workflow/search.xml`，示例如下：
```yml
name: RPageSearch
on:
    push:
        paths:
            - 'articles/**'
    workflow_dispatch:

permissions:
    contents: write
    pages: write
    id-token: write

jobs:
    build:
        runs-on: ubuntu-latest #运行环境
        steps:
            - name: Checkout
              uses: actions/checkout@v2
            - name: 'Git set'
              run: |
                  git init
                  git pull
            - name: 'Set up nodejs'
              uses: actions/setup-node@v3
              with:
                  node-version: 'latest'
            - name: 'Install requirements'
              run: |
                  npm install
            - name: 'Working'
              run: |
                  node search.js
            - name: Commit files
              continue-on-error: True
              run: |
                  git diff
                  git config --local user.email "dr_hamilton@foxmail.com"
                  git config --local user.name "Ravello-H"
                  git add -A
                  git commit -m "[RPageSearch]`date '+%Y-%m-%d %H:%M:%S'`" || exit
                  git status
                  git push -f
```

## 进阶  
因为能提供索引文件，你可以据此生成其他文件。参照以下项目：  
(https://github.com/RavelloH/local-feed-generation)

## 依赖  
https://github.com/cheeriojs/cheerio
