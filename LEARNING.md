# Learning by making Gogoserver

## 1. 发布 npm 包

1. npm init
2. 配置 package.json 中的 bin 字段
3. 创建入口文件 inded.js 并配置 shebang 指定运行环境
4. npm publish

## 2. 使用 commander 构建复杂的命令行工具

[commander](https://github.com/tj/commander.js#readme): 一个 node.js 的命令行解决方案，用于处理命令行输入的指令（command）和参数（option）信息。

## 3. 实现：指定端口号

使用 commander 捕获用户传入的端口号后直接进行替换。

## 4. 实现：指定目录

1. 使用 commander 捕获用户传入的路径
2. 根据 stat 判断是否是目录
   1. 目录：读取目录下的文件，接入 art-template 进行渲染
   2. 文件：流处理文件
