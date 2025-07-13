# CLAUDE.md

此文件为Claude Code (claude.ai/code) 在处理此代码库时提供指导。

## 项目概述
这是一个Unity UI Toolkit开发的VSCode扩展，基于Unity 6.1标准为UXML和USS文件提供语法高亮、验证和智能感知功能。该扩展采用基于提供者的架构，通过语言服务提供者处理不同的功能。

## 常用开发命令

```bash
# 构建和开发
npm install                    # 安装依赖
npm run compile               # 将TypeScript编译为JavaScript
npm run watch                 # 开发模式的监听编译
npm run lint                  # 对源代码运行ESLint
npm test                      # 运行完整测试套件 (包含编译和lint)
npm run vscode:prepublish     # 为扩展发布做准备

# 测试单个文件
npm run pretest               # 测试前编译和lint
node ./out/test/runTest.js    # 编译后直接运行测试

# 打包和发布
npm run package               # 创建用于分发的.vsix包文件
npm run publish               # 将扩展发布到VS Code市场
npm run package:pre-release   # 创建预发布版本的.vsix包
npm run publish:pre-release   # 以预发布版本发布到市场
```

## 架构

### 核心结构
- **`src/extension.ts`**: 注册所有语言提供者的主扩展入口点
- **`src/providers/`**: 实现VSCode语言功能的语言服务提供者
- **`src/parsers/`**: UXML和USS文件的解析工具
- **`src/data/ussProperties.ts`**: 完整的USS属性定义 (100+ Unity 6.1属性)
- **`syntaxes/`**: 用于语法高亮的TextMate语法文件

### 提供者模式
扩展遵循基于提供者的架构，每个语言功能都作为单独的提供者实现：

- **UssValidationProvider**: USS属性的实时验证和诊断
- **UssCompletionProvider**: USS属性的自动完成
- **UssHoverProvider**: USS属性的悬停文档
- **UxmlCompletionProvider**: UXML元素的自动完成
- **UxmlDefinitionProvider**: 从UXML class属性到USS选择器的定义跳转

### 主要依赖
- **fast-xml-parser**: 用于在提供者中解析UXML文件
- **VSCode Extension API**: 语言注册、提供者、诊断
- **TypeScript 4.9.4**: 以严格模式编译

## 配置
扩展设置在package.json的`contributes.configuration`中定义：
- `unityUIToolkit.validation.enabled`: 切换USS验证
- `unityUIToolkit.validation.strictMode`: Unity特定属性的严格验证
- `unityUIToolkit.intellisense.enabled`: 切换智能UXML/USS链接

## 文件类型
- **`.uxml`**: Unity XML布局文件 (基于XML的Unity特定元素)
- **`.uss`**: Unity样式表 (类似CSS的Unity特定属性)

## CSS自定义属性（变量）支持
扩展完全支持USS文件中的CSS自定义属性（变量）：

### 支持的语法
- **变量定义**: `--primary-color: #007ACC;`
- **变量引用**: `color: var(--primary-color);`
- **嵌套变量**: `--primary: var(--blue-600);`
- **复杂用法**: `padding: var(--spacing-sm) var(--spacing-md);`

### 语言功能
- **语法验证**: 自定义属性与标准USS属性分别验证
- **变量使用验证**: 检测未定义的变量引用并显示警告
- **自动完成**: 为定义的自定义属性和`var()`函数模板提供智能感知
- **跳转到定义**: 点击`var(--variable-name)`跳转到变量定义 (Ctrl+Click)
- **跨文件引用**: 可以在工作区的多个USS文件中找到变量定义

### 提供者架构
- **USSDefinitionProvider**: 处理CSS变量在文件内和跨文件的定义跳转
- **USSValidationProvider**: 验证变量使用并对未定义变量显示警告
- **USSCompletionProvider**: 为变量和`var()`函数提供智能自动完成
- **USSParser**: 增强了变量解析功能 (自定义属性和var()提取)

## 测试策略
测试套件使用Mocha和@vscode/test-electron与VSCode扩展主机进行集成测试。测试验证语言提供者、解析功能和扩展激活。`test-files/`中包含带有变量使用的示例USS文件用于手动测试。