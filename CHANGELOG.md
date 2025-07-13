# Change Log

All notable changes to the Unity UI Toolkit extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2025-01-12

### Enhanced
- **Comprehensive USS Property Support**: Expanded USS property database to include ALL Unity 6.1 supported properties
  - Added 100+ USS properties based on official Unity 6.1 documentation
  - Complete support for all background properties (background-position, background-repeat, background-size, etc.)
  - Full transform properties support (rotate, scale, translate, transform-origin)
  - Complete transition properties (transition-delay, transition-duration, transition-property, etc.)
  - All Unity-specific slice properties (-unity-slice-left, -unity-slice-right, etc.)
  - Advanced text properties (letter-spacing, word-spacing, text-shadow, text-overflow)
  - Enhanced Unity text properties (-unity-text-generator, -unity-text-overflow-position, etc.)

### Fixed
- Resolved property validation issues where valid Unity properties were incorrectly flagged as unsupported
- Improved syntax highlighting for all newly added properties
- Enhanced code completion with comprehensive property and value suggestions

## [0.1.0] - 2025-01-12

### Added
- **UXML Syntax Highlighting**: Complete syntax highlighting for Unity XML layout files
  - Support for all Unity UI Toolkit elements (Button, Label, TextField, etc.)
  - Proper attribute highlighting and validation
  - XML structure highlighting with proper scoping

- **USS Syntax Highlighting**: Complete syntax highlighting for Unity Style Sheets
  - Support for all Unity USS properties including Unity-specific properties (prefixed with `-unity-`)
  - CSS selector highlighting (class, ID, element, pseudo-classes)
  - Property and value highlighting with proper scoping

- **USS Property Validation**: Real-time validation based on Unity 6.1 documentation
  - Validation of 100+ USS properties supported by Unity
  - Error highlighting for unsupported CSS properties
  - Warning highlighting for invalid property values
  - Support for Unity-specific properties like `-unity-font`, `-unity-text-align`, etc.

- **Intelligent UXML to USS Linking**: Smart navigation between UXML and USS files
  - **Go to Definition**: Ctrl+Click on class names in UXML to jump to USS definitions
  - **Hover Information**: Hover over USS properties to see syntax and documentation
  - **Cross-file Reference Finding**: Find all references to CSS classes across files

- **Code Completion**: Intelligent code completion for both UXML and USS
  - **USS Property Completion**: Auto-complete for all supported USS properties with documentation
  - **USS Value Completion**: Context-aware value completion based on property type
  - **UXML Element Completion**: Auto-complete for Unity UI Toolkit elements
  - **UXML Attribute Completion**: Context-aware attribute completion for each element type
  - **CSS Class Completion**: Auto-complete class names from USS files in UXML

- **Advanced Parsing**: Robust parsing engines for both file types
  - UXML parser with support for Unity-specific elements and attributes
  - USS parser with support for Unity-specific properties and selectors
  - Error-tolerant parsing that handles malformed documents gracefully

- **Configuration Options**: Customizable extension behavior
  - `unityUIToolkit.validation.enabled`: Enable/disable USS property validation
  - `unityUIToolkit.validation.strictMode`: Show warnings for Unity-specific properties
  - `unityUIToolkit.intellisense.enabled`: Enable/disable intelligent linking features

### Technical Details
- Built with TypeScript for type safety and maintainability
- Comprehensive Unity 6.1 USS property database with 70+ properties
- TextMate grammar files for syntax highlighting
- Language servers for validation and IntelliSense
- Extensive test suite covering all major functionality

### Supported Unity Elements
- Base elements: VisualElement, BindableElement
- Input elements: Button, TextField, Toggle, Slider, DropdownField
- Display elements: Label, Image, ProgressBar
- Container elements: Box, GroupBox, ScrollView, Foldout
- List elements: ListView, TreeView, MultiColumnListView
- Layout elements: TwoPaneSplitView, TabView
- And 40+ more Unity UI Toolkit elements

### Supported USS Properties
- Layout properties: width, height, margin, padding, position
- Flexbox properties: flex-direction, justify-content, align-items
- Visual properties: background-color, border-radius, opacity
- Text properties: color, font-size, white-space
- Unity-specific properties: -unity-font, -unity-text-align, -unity-background-scale-mode
- And 50+ more properties with full validation

### Known Issues
- None at this time

### Future Enhancements
- UXML template support and validation
- USS @import statement support
- Advanced refactoring tools
- Integration with Unity Editor
- Performance optimizations for large projects
