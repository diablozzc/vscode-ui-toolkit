import * as vscode from 'vscode';

export interface UXMLElement {
  tagName: string;
  attributes: { [key: string]: string };
  position: vscode.Position;
  range: vscode.Range;
  children: UXMLElement[];
}

export interface UXMLClassReference {
  className: string;
  position: vscode.Position;
  range: vscode.Range;
}

export class UXMLParser {
  
  /**
   * Parse UXML document and extract class references
   */
  public static parseClassReferences(document: vscode.TextDocument): UXMLClassReference[] {
    const classReferences: UXMLClassReference[] = [];
    const text = document.getText();
    const lines = text.split('\n');

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      
      // Look for class attributes in UXML elements
      const classMatches = line.matchAll(/class\s*=\s*["']([^"']+)["']/g);
      
      for (const match of classMatches) {
        if (match.index !== undefined) {
          const classValue = match[1];
          const classNames = classValue.split(/\s+/).filter(name => name.trim());
          
          // Calculate position for each class name
          let currentIndex = match.index + match[0].indexOf(classValue);
          
          for (const className of classNames) {
            const classIndex = classValue.indexOf(className, currentIndex - match.index - match[0].indexOf(classValue));
            const startPos = new vscode.Position(lineIndex, match.index + match[0].indexOf(classValue) + classIndex);
            const endPos = new vscode.Position(lineIndex, match.index + match[0].indexOf(classValue) + classIndex + className.length);
            
            classReferences.push({
              className: className,
              position: startPos,
              range: new vscode.Range(startPos, endPos)
            });
            
            currentIndex = classIndex + className.length;
          }
        }
      }
    }

    return classReferences;
  }

  /**
   * Parse UXML document structure
   */
  public static parseDocument(document: vscode.TextDocument): UXMLElement[] {
    const elements: UXMLElement[] = [];
    const text = document.getText();
    const lines = text.split('\n');

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      
      // Simple XML tag parsing - can be enhanced with a proper XML parser
      const tagMatches = line.matchAll(/<([a-zA-Z][a-zA-Z0-9.-]*)\s*([^>]*?)(?:\s*\/?>)/g);
      
      for (const match of tagMatches) {
        if (match.index !== undefined) {
          const tagName = match[1];
          const attributesString = match[2];
          const attributes = this.parseAttributes(attributesString);
          
          const startPos = new vscode.Position(lineIndex, match.index);
          const endPos = new vscode.Position(lineIndex, match.index + match[0].length);
          
          elements.push({
            tagName: tagName,
            attributes: attributes,
            position: startPos,
            range: new vscode.Range(startPos, endPos),
            children: [] // Simplified - not parsing nested structure for now
          });
        }
      }
    }

    return elements;
  }

  /**
   * Parse XML attributes from attribute string
   */
  private static parseAttributes(attributesString: string): { [key: string]: string } {
    const attributes: { [key: string]: string } = {};
    
    // Match attribute="value" or attribute='value'
    const attrMatches = attributesString.matchAll(/([a-zA-Z][a-zA-Z0-9.-]*)\s*=\s*["']([^"']*)["']/g);
    
    for (const match of attrMatches) {
      const attrName = match[1];
      const attrValue = match[2];
      attributes[attrName] = attrValue;
    }

    return attributes;
  }

  /**
   * Check if position is within a class attribute value
   */
  public static isPositionInClassAttribute(document: vscode.TextDocument, position: vscode.Position): boolean {
    const line = document.lineAt(position.line).text;
    const charIndex = position.character;
    
    // Find class attributes on this line
    const classMatches = line.matchAll(/class\s*=\s*["']([^"']+)["']/g);
    
    for (const match of classMatches) {
      if (match.index !== undefined) {
        const valueStart = match.index + match[0].indexOf(match[1]);
        const valueEnd = valueStart + match[1].length;
        
        if (charIndex >= valueStart && charIndex <= valueEnd) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Get class name at specific position
   */
  public static getClassNameAtPosition(document: vscode.TextDocument, position: vscode.Position): string | undefined {
    const classReferences = this.parseClassReferences(document);
    
    for (const classRef of classReferences) {
      if (classRef.range.contains(position)) {
        return classRef.className;
      }
    }
    
    return undefined;
  }

  /**
   * Get all Unity UI elements used in the document
   */
  public static getUnityElements(document: vscode.TextDocument): string[] {
    const elements = this.parseDocument(document);
    const unityElements = new Set<string>();
    
    // List of known Unity UI Toolkit elements
    const knownUnityElements = [
      'BindableElement', 'VisualElement', 'BoundsField', 'BoundsIntField', 'Box', 'Button',
      'ColorField', 'CurveField', 'DoubleField', 'DropdownField', 'EnumField', 'EnumFlagsField',
      'FloatField', 'Foldout', 'GradientField', 'GroupBox', 'Hash128Field', 'HelpBox',
      'IMGUIContainer', 'Image', 'InspectorElement', 'IntegerField', 'Label', 'LayerField',
      'LayerMaskField', 'ListView', 'LongField', 'Mask64Field', 'MaskField', 'MinMaxSlider',
      'MultiColumnListView', 'MultiColumnTreeView', 'ObjectField', 'PopupWindow', 'ProgressBar',
      'PropertyField', 'RadioButton', 'RadioButtonGroup', 'RectField', 'RectIntField',
      'RenderingLayerMaskField', 'RepeatButton', 'ScrollView', 'Scroller', 'Slider', 'SliderInt',
      'Tab', 'TabView', 'TagField', 'TemplateContainer', 'TextElement', 'TextField', 'Toggle',
      'ToggleButtonGroup', 'Toolbar', 'ToolbarBreadcrumbs', 'ToolbarButton', 'ToolbarMenu',
      'ToolbarPopupSearchField', 'ToolbarSearchField', 'ToolbarSpacer', 'ToolbarToggle',
      'TreeView', 'TwoPaneSplitView', 'UnsignedIntegerField', 'UnsignedLongField',
      'Vector2Field', 'Vector2IntField', 'Vector3Field', 'Vector3IntField', 'Vector4Field',
      'Template', 'Instance', 'Columns', 'Column'
    ];
    
    for (const element of elements) {
      if (knownUnityElements.includes(element.tagName)) {
        unityElements.add(element.tagName);
      }
    }
    
    return Array.from(unityElements);
  }
}
