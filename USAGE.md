# Unity UI Toolkit VSCode Extension - 使用指南

## 🚀 快速开始

### 1. 安装和运行

```bash
# 安装依赖
npm install

# 编译项目
npm run compile

# 启动扩展开发环境
# 按 F5 或运行 "Run Extension" 调试配置
```

### 2. 测试扩展功能

1. 在新的VSCode窗口中打开包含 `.uxml` 和 `.uss` 文件的项目
2. 或者使用提供的测试文件：`test-files/sample.uxml` 和 `test-files/sample.uss`

## ✨ 功能演示

### UXML 语法高亮
打开 `test-files/sample.uxml` 文件，您将看到：
- Unity UI 元素的语法高亮（如 `ui:Button`, `ui:Label`）
- 属性的语法高亮（如 `class`, `text`, `name`）
- XML 结构的正确着色

### USS 语法高亮
打开 `test-files/sample.uss` 文件，您将看到：
- CSS 选择器的语法高亮（如 `.main-container`, `.submit-button`）
- Unity 特有属性的高亮（如 `-unity-font-style`, `-unity-text-align`）
- 属性值的正确着色

### USS 属性验证
在 USS 文件中尝试以下操作：
1. 输入不支持的 CSS 属性（如 `float: left;`）- 将显示错误
2. 输入无效的属性值（如 `position: invalid;`）- 将显示警告
3. 输入正确的 Unity USS 属性 - 无错误提示

### 智能链接功能
1. 在 UXML 文件中，将鼠标悬停在 `class` 属性的值上
2. 按住 Ctrl（或 Cmd）并点击类名 - 将跳转到 USS 文件中的定义
3. 在 USS 文件中悬停在属性名上 - 将显示属性文档

### 代码补全
1. 在 USS 文件中输入属性名 - 将显示所有支持的 USS 属性
2. 在属性值位置 - 将显示该属性支持的值
3. 在 UXML 文件中输入 `<` - 将显示所有 Unity UI 元素
4. 在 UXML 的 `class` 属性中 - 将显示所有可用的 CSS 类

## 🔧 配置选项

在 VSCode 设置中搜索 "Unity UI Toolkit" 或直接编辑 `settings.json`：

```json
{
  // 启用/禁用 USS 属性验证
  "unityUIToolkit.validation.enabled": true,
  
  // 启用严格模式（对 Unity 特有属性显示警告）
  "unityUIToolkit.validation.strictMode": false,
  
  // 启用/禁用智能链接功能
  "unityUIToolkit.intellisense.enabled": true
}
```

## 📝 支持的文件类型

- `.uxml` - Unity XML 布局文件
- `.uss` - Unity Style Sheets 样式文件

## 🎯 支持的 Unity 元素

扩展支持所有 Unity 6.1 UI Toolkit 元素，包括但不限于：

### 基础元素
- `VisualElement` - 基础视觉元素
- `BindableElement` - 可绑定元素

### 输入控件
- `Button` - 按钮
- `TextField` - 文本输入框
- `Toggle` - 开关/复选框
- `Slider` - 滑块
- `DropdownField` - 下拉选择框

### 显示元素
- `Label` - 文本标签
- `Image` - 图像显示
- `ProgressBar` - 进度条

### 容器元素
- `Box` - 基础容器
- `GroupBox` - 分组容器
- `ScrollView` - 滚动视图
- `Foldout` - 折叠面板

### 列表元素
- `ListView` - 列表视图
- `TreeView` - 树形视图
- `MultiColumnListView` - 多列列表

## 🔍 支持的 USS 属性

扩展验证 70+ 个 Unity 支持的 USS 属性：

### 布局属性
- `width`, `height`, `min-width`, `max-width` 等
- `margin`, `padding`, `border-width` 等
- `position`, `left`, `top`, `right`, `bottom`

### Flexbox 属性
- `flex-direction`, `flex-wrap`, `justify-content`
- `align-items`, `align-content`, `align-self`
- `flex-grow`, `flex-shrink`, `flex-basis`

### 视觉属性
- `background-color`, `background-image`
- `border-color`, `border-radius`
- `opacity`, `visibility`

### Unity 特有属性
- `-unity-font`, `-unity-font-style`
- `-unity-text-align`, `-unity-text-outline-width`
- `-unity-background-scale-mode`

## 🐛 故障排除

### 扩展未激活
- 确保打开了包含 `.uxml` 或 `.uss` 文件的项目
- 检查 VSCode 输出面板中的错误信息

### 语法高亮不工作
- 确保文件扩展名正确（`.uxml` 和 `.uss`）
- 尝试重新加载 VSCode 窗口

### 智能功能不工作
- 检查配置项 `unityUIToolkit.intellisense.enabled` 是否为 `true`
- 确保 UXML 和 USS 文件在同一个工作区中

### 验证功能不工作
- 检查配置项 `unityUIToolkit.validation.enabled` 是否为 `true`
- 尝试保存文件以触发验证

## 📞 获取帮助

如果遇到问题或有功能建议，请：
1. 检查本文档的故障排除部分
2. 查看 VSCode 开发者控制台的错误信息
3. 提交 Issue 到项目仓库

## 🔄 开发和贡献

如果您想为项目贡献代码：

```bash
# 克隆项目
git clone <repository-url>

# 安装依赖
npm install

# 启动开发模式
npm run watch

# 运行测试
npm test
```

扩展采用模块化设计，主要组件包括：
- `src/parsers/` - UXML 和 USS 解析器
- `src/providers/` - VSCode 语言服务提供器
- `src/data/` - Unity USS 属性数据库
- `syntaxes/` - TextMate 语法文件
