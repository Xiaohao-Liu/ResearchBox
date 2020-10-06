# ResearchBox
![](https://raw.githubusercontent.com/WYKXLDZ/ResearchBox/master/main.png)
## 功能介绍
采用express、mysql、vue构建了一个Paper管理器，支持以下功能
- Paper管理
- Paper信息管理（标题、作者、期刊会议、cite、进度、md内容编辑、论文链接等）
- 标签管理（根据设定的paper标签）
- 会议管理（根据设定的paper会议）
- 计划管理（可以自由添加不同的paper，放入不同的计划中，观看计划进度）
- 统计分析（基本的统计信息）

额外功能
- 单用户初始化、登录
- 单用户自定义功能
- 深色模式切换

**2020.10.04 update**

- 增加github contents API(自动获取剪切板图片上传至repos，获取图片链接进行md的编写)

**2020.10.06 update**

- 添加tool（翻译、MD5）
- 添加分页和搜索

## Installation 

### 安装依赖

```shell
npm install
```

### 运行后台

```shell
npm run backend
```

### 运行服务器

```shell
npm run serve
```

### 打包前端

```shell
npm run build
```
### 配置文件

`./src/utils/config.js`

`./src/utils/constant.js`
