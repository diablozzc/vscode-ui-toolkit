# Unity UI Toolkit VSCode 扩展

一个全面的Unity UI Toolkit开发VSCode扩展，基于Unity 6.1文档标准为UXML和USS文件提供语法高亮、验证和智能链接功能。

## 功能特性

### 🎨 语法高亮
- **UXML文件**: Unity XML布局文件的完整语法高亮
- **USS文件**: Unity样式表的完整语法高亮
- 支持Unity 6.1特定语法和属性

### ✅ USS验证和错误检测
- 基于Unity 6.1标准对100+个USS属性进行实时验证
- 检测并高亮显示不支持的CSS属性
- 为无效样式属性提供清晰的错误消息
- 在编辑器中提供错误和警告的诊断支持

### 🔗 智能UXML到USS链接
- **跳转到定义**: 从UXML class属性跳转到USS样式定义
- **悬停信息**: 悬停在class名称上时预览样式定义
- 跨文件引用查找和导航
- UXML元素与其对应USS样式之间的智能链接

### 📦 USS Import导航
- **@import语句支持**: 完整支持USS文件中的@import语句
- **路径跳转**: 使用`Ctrl+Click`从@import路径直接跳转到目标文件
- **多种格式**: 支持双引号、单引号、url()等各种import格式
- **智能路径解析**: 自动处理相对路径、绝对路径和无扩展名路径

### 🔧 CSS变量支持
- **变量定义**: 完整支持CSS自定义属性(--variable-name)
- **变量引用**: 智能感知和验证var()函数调用
- **跨文件变量**: 支持在不同USS文件间查找变量定义
- **变量跳转**: 从var()使用处跳转到变量定义位置

## 支持的文件类型

- `.uxml` - Unity XML布局文件
- `.uss` - Unity样式表文件

## 配置

扩展提供了几个配置选项：

```json
{
  "unityUIToolkit.validation.enabled": true,
  "unityUIToolkit.validation.strictMode": false,
  "unityUIToolkit.intellisense.enabled": true
}
```

### 配置选项

- `unityUIToolkit.validation.enabled`: 启用/禁用USS属性验证
- `unityUIToolkit.validation.strictMode`: 启用严格验证模式（对Unity特定属性显示警告）
- `unityUIToolkit.intellisense.enabled`: 启用/禁用UXML和USS文件之间的智能链接

## 使用方法

### UXML文件
- 打开任何`.uxml`文件即可获得语法高亮
- 使用`Ctrl+Click`（Mac上为`Cmd+Click`）点击class属性跳转到USS定义
- 悬停在class名称上查看样式预览

### USS文件
- 打开任何`.uss`文件即可获得语法高亮和验证
- 无效属性将被高亮显示并提供错误消息
- 悬停在属性上查看文档和语法信息
- 使用`Ctrl+Click`点击@import路径跳转到目标文件
- 使用`Ctrl+Click`点击var()中的变量名跳转到定义处
- 在@import语句中享受智能路径补全和验证

## Unity 6.1 兼容性

此扩展专为Unity 6.1设计，遵循官方Unity UI Toolkit文档：

- [Unity UI Elements概述](https://docs.unity3d.com/6000.1/Documentation/Manual/UIElements.html)
- [UI结构文档](https://docs.unity3d.com/6000.1/Documentation/Manual/UIE-structure-ui.html)
- [USS选择器文档](https://docs.unity3d.com/6000.1/Documentation/Manual/UIE-USS-Selectors.html)
- [USS属性参考](https://docs.unity3d.com/6000.1/Documentation/Manual/UIE-uss-properties.html)

## 安装

1. 从VSCode市场安装扩展
2. 打开包含UXML或USS文件的Unity项目
3. 当您打开支持的文件类型时，扩展将自动激活

## 开发

此扩展使用TypeScript构建，并使用VSCode Extension API。

### 从源码构建

```bash
npm install
npm run compile
```

### 运行测试

```bash
npm test
```

## 贡献

欢迎贡献！请随时提交问题和拉取请求。

## 许可证

此扩展基于MIT许可证发布。

## 更新日志

### 0.2.0
- 🆕 **@import导航支持**: 在USS文件中支持@import语句的路径跳转
- 🆕 **CSS变量系统**: 完整的CSS自定义属性支持，包括定义、使用和跨文件引用
- 🆕 **智能路径解析**: 自动处理相对路径、绝对路径和无扩展名路径
- 🆕 **多格式@import**: 支持`@import "path"`、`@import 'path'`、`@import url("path")`等格式
- 🔧 **增强的跳转功能**: 从var()函数跳转到变量定义，从@import跳转到目标文件
- 🧪 **完善的测试**: 添加了@import和CSS变量功能的完整测试覆盖

### 0.1.1
- USS代码操作提供者，支持修复CSS到USS的兼容性问题
- 添加"修复所有USS兼容性问题"命令
- 优化代码质量和错误处理

### 0.1.0
- 初始发布
- 基本的UXML和USS语法高亮
- USS属性验证
- UXML到USS智能链接
- USS属性悬停信息
- class选择器的跳转到定义功能
