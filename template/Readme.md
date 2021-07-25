# 小程序开发脚手架

![wxmp-starter](./src/assets/gg.png)

基于 gulp 搭建，满足小程序基本开发所有需求 🖥。

- 🚀 轻量极速构建
- 🎨 支持 `TypeScript` `SASS`
- 🔍 代码检测
- 🎈 font icon
- 🗃 自动化 npm 构建
- 🏞 图片压缩

## 为什么不使用流行框架

在使用官方开发模板时。使用起来不是很舒服，如官方 `wxss`，类似于 `css`。没有类似 SASS 提供的供了变量（variables）、嵌套（nested rules）、 混合（mixins）、 函数（functions）等功能。另外，习惯了 Typescript，虽然官方也提供了模板，但不是很自动化。**出于个人学习的原因**，基于官方的开发环境，搭建这个 `wxmp-starter`。

虽然有很多主流框架可供选择。在纠结选择哪个框架时，需要明确自己的需求，确定是否真正需要。自己在选择框架时，更多会结合自己的业务需求，如果不考虑其他平台的转化，会选择 wpey，或时间允许的情况下，会结合业务进行搭建。另外原因是原生微信小程序本身相较 HTML 就存在各种限制，在此基础使用 DSL 进行二次封装，又引入新的复杂度。出现 bug 可能需要花更多的时间去解决 😂。

如果真有多平台转化 “**Write once, build anywhere**”，还是可以选择 [taro](https://github.com/NervJS/taro)，或 [remax](https://github.com/remaxjs/remax)。类似 DSL 框架还有 [uni-app](https://github.com/dcloudio/uni-app)、[mpvue](https://github.com/Meituan-Dianping/mpvue)、[Chameleon](https://github.com/didi/chameleon)。

## 快速开始

```js
 npx -p wxmp-starter wxmp-starter
```

## 开发相关命令

- 启动开发环境

  ```js
  npm start
  ```

- 打包构建

  ```js
  npm run build
  ```

- lint 代码

  ```js
  npm run eslint
  ```

- 格式化代码

  ```js
  npm run format
  ```
