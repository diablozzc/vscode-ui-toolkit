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

### 0.1.0
- 初始发布
- 基本的UXML和USS语法高亮
- USS属性验证
- UXML到USS智能链接
- USS属性悬停信息
- class选择器的跳转到定义功能
