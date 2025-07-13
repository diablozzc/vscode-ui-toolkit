# Unity UI Toolkit USS Properties - Complete Reference

## 🎉 完整的Unity 6.1 USS属性支持

基于Unity官方文档 [USS Properties Reference](https://docs.unity3d.com/6000.1/Documentation/Manual/UIE-USS-Properties-Reference.html)，我们的扩展现在支持**100+个**Unity USS属性！

## 📊 属性统计

- **总属性数量**: 100+
- **标准CSS属性**: 70+
- **Unity特有属性**: 20+
- **完全可动画属性**: 60+
- **离散动画属性**: 25+
- **不可动画属性**: 15+

## 🏗️ 属性分类

### 1. 盒模型属性 (Box Model)
- `width`, `height`, `min-width`, `max-width`, `min-height`, `max-height`
- `margin`, `margin-top`, `margin-right`, `margin-bottom`, `margin-left`
- `padding`, `padding-top`, `padding-right`, `padding-bottom`, `padding-left`
- `border-width`, `border-top-width`, `border-right-width`, `border-bottom-width`, `border-left-width`

### 2. 边框属性 (Border)
- `border-color`, `border-top-color`, `border-right-color`, `border-bottom-color`, `border-left-color`
- `border-radius`, `border-top-left-radius`, `border-top-right-radius`, `border-bottom-right-radius`, `border-bottom-left-radius`

### 3. 定位属性 (Positioning)
- `position`, `left`, `top`, `right`, `bottom`

### 4. 外观属性 (Appearance)
- `display`, `visibility`, `overflow`, `opacity`, `cursor`
- `all` (重置所有属性)

### 5. Flexbox布局属性 (Flexbox Layout)
- `flex-direction`, `flex-wrap`, `justify-content`, `align-items`, `align-content`, `align-self`
- `flex-grow`, `flex-shrink`, `flex-basis`, `flex`

### 6. 背景属性 (Background)
- `background-color`, `background-image`
- `background-position`, `background-position-x`, `background-position-y`
- `background-repeat`, `background-size`

### 7. 文本属性 (Text)
- `color`, `font-size`, `white-space`
- `letter-spacing`, `word-spacing`
- `text-overflow`, `text-shadow`

### 8. 变换属性 (Transform)
- `rotate`, `scale`, `translate`, `transform-origin`

### 9. 过渡属性 (Transition)
- `transition`, `transition-delay`, `transition-duration`
- `transition-property`, `transition-timing-function`

### 10. Unity特有属性 (Unity-Specific)

#### 字体属性
- `-unity-font` - 字体资源
- `-unity-font-definition` - 字体定义结构
- `-unity-font-style` - 字体样式和粗细

#### 文本属性
- `-unity-text-align` - 文本对齐方式
- `-unity-text-generator` - 文本生成器类型
- `-unity-text-outline` - 文本轮廓
- `-unity-text-outline-color` - 文本轮廓颜色
- `-unity-text-outline-width` - 文本轮廓宽度
- `-unity-text-overflow-position` - 文本溢出位置

#### 背景属性
- `-unity-background-scale-mode` - 背景图像缩放模式
- `-unity-background-image-tint-color` - 背景图像着色

#### 9-slice属性
- `-unity-slice-left`, `-unity-slice-right`, `-unity-slice-top`, `-unity-slice-bottom`
- `-unity-slice-scale` - 切片缩放
- `-unity-slice-type` - 切片类型

#### 其他Unity属性
- `-unity-editor-text-rendering-mode` - 编辑器文本渲染模式
- `-unity-overflow-clip-box` - 溢出裁剪盒
- `-unity-paragraph-spacing` - 段落间距

## 🎯 属性值支持

### 常用值类型
- `<length>` - 长度值 (px, em, rem, %)
- `<color>` - 颜色值 (hex, rgb, rgba, 颜色名称)
- `<number>` - 数值
- `<percentage>` - 百分比
- `<angle>` - 角度值 (deg, rad)
- `<time>` - 时间值 (s, ms)
- `<resource>` - Unity资源引用
- `<url>` - URL引用

### Unity特有值
- `upper-left`, `middle-center`, `lower-right` 等文本对齐值
- `stretch-to-fill`, `scale-and-crop`, `scale-to-fit` 等缩放模式
- `legacy`, `advanced` 等Unity特有枚举值

## ✨ 扩展功能

### 1. 实时验证
- 所有100+属性的实时验证
- 不支持属性的错误提示
- 无效属性值的警告提示

### 2. 智能补全
- 属性名称自动补全
- 属性值上下文补全
- Unity特有值的专门支持

### 3. 悬停文档
- 每个属性的详细语法说明
- 属性描述和用法示例
- 继承性和动画性信息

### 4. 语法高亮
- Unity特有属性的特殊高亮
- 属性值的正确着色
- 选择器的准确识别

## 🔍 使用示例

```css
/* 完整的Unity UI样式示例 */
.unity-element {
    /* 盒模型 */
    width: 200px;
    height: 100px;
    margin: 10px;
    padding: 5px;
    border-width: 2px;
    border-color: #333333;
    border-radius: 5px;
    
    /* 定位 */
    position: absolute;
    left: 50px;
    top: 100px;
    
    /* 外观 */
    background-color: #ffffff;
    background-image: url("texture.png");
    opacity: 0.9;
    overflow: hidden;
    
    /* Flexbox */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    /* 文本 */
    color: #000000;
    font-size: 16px;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
    
    /* 变换 */
    rotate: 5deg;
    scale: 1.1 1.1;
    transform-origin: center center;
    
    /* 过渡 */
    transition: all 0.3s ease-in-out;
    
    /* Unity特有属性 */
    -unity-font-style: bold;
    -unity-text-align: middle-center;
    -unity-background-scale-mode: scale-to-fit;
    -unity-text-outline-width: 1px;
    -unity-text-outline-color: #ffffff;
    -unity-slice-left: 10;
    -unity-slice-right: 10;
    -unity-slice-top: 10;
    -unity-slice-bottom: 10;
    -unity-slice-type: stretch;
}
```

## 🚀 性能优化

- 高效的属性查找算法
- 缓存的属性验证结果
- 优化的语法高亮规则
- 智能的错误检测机制

## 📈 版本历史

### v0.1.1 - 完整属性支持
- 新增50+个USS属性支持
- 完善Unity特有属性验证
- 增强属性值补全功能
- 优化语法高亮规则

### v0.1.0 - 初始版本
- 基础UXML和USS语法高亮
- 基本属性验证功能
- 简单的智能链接功能

---

**现在您可以享受完整的Unity UI Toolkit开发体验！** 🎉
