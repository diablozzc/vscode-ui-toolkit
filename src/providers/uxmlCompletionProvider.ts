import * as vscode from 'vscode';
import { USSParser } from '../parsers/ussParser';

export class UXMLCompletionProvider implements vscode.CompletionItemProvider {
  
  async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken,
    _context: vscode.CompletionContext
  ): Promise<vscode.CompletionItem[] | vscode.CompletionList> {
    
    const line = document.lineAt(position.line).text;
    const linePrefix = line.substring(0, position.character);
    
    // Check if we're in a class attribute context
    if (this.isInClassAttributeContext(linePrefix)) {
      return await this.getClassNameCompletions(document);
    }
    
    // Check if we're in an element context
    if (this.isInElementContext(linePrefix)) {
      return this.getUnityElementCompletions();
    }
    
    // Check if we're in an attribute context
    const elementName = this.getElementNameFromContext(line, position.character);
    if (elementName) {
      return this.getAttributeCompletions(elementName);
    }
    
    return [];
  }

  private isInClassAttributeContext(linePrefix: string): boolean {
    // Check if we're inside class="..." or class='...'
    const classMatch = linePrefix.match(/class\s*=\s*["']([^"']*)$/);
    return !!classMatch;
  }

  private isInElementContext(linePrefix: string): boolean {
    // Check if we're after < and before any space or >
    const elementMatch = linePrefix.match(/<([a-zA-Z]*)$/);
    return !!elementMatch;
  }

  private getElementNameFromContext(line: string, position: number): string | undefined {
    // Look for element name before current position
    const beforeCursor = line.substring(0, position);
    const match = beforeCursor.match(/<([a-zA-Z][a-zA-Z0-9.-]*)\s+[^>]*$/);
    if (match) {
      return match[1];
    }
    return undefined;
  }

  private async getClassNameCompletions(document: vscode.TextDocument): Promise<vscode.CompletionItem[]> {
    const completions: vscode.CompletionItem[] = [];
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    
    if (!workspaceFolder) {
      return completions;
    }

    // Search for USS files in the workspace
    const ussFiles = await vscode.workspace.findFiles('**/*.uss', '**/node_modules/**');
    const allClassNames = new Set<string>();

    for (const ussFile of ussFiles) {
      const ussDocument = await vscode.workspace.openTextDocument(ussFile);
      const classNames = USSParser.getAllClassNames(ussDocument);
      
      for (const className of classNames) {
        allClassNames.add(className);
      }
    }

    // Create completion items for each class name
    for (const className of allClassNames) {
      const item = new vscode.CompletionItem(className, vscode.CompletionItemKind.Class);
      item.detail = 'USS class';
      item.documentation = new vscode.MarkdownString(`CSS class defined in USS files`);
      completions.push(item);
    }

    return completions;
  }

  private getUnityElementCompletions(): vscode.CompletionItem[] {
    const completions: vscode.CompletionItem[] = [];
    
    // Unity UI Toolkit elements with their descriptions
    const unityElements = [
      { name: 'VisualElement', description: 'Base class for all visual elements' },
      { name: 'BindableElement', description: 'Base class for bindable elements' },
      { name: 'Box', description: 'A simple container element' },
      { name: 'Button', description: 'A clickable button element' },
      { name: 'Label', description: 'A text display element' },
      { name: 'TextField', description: 'A text input field' },
      { name: 'Toggle', description: 'A checkbox/toggle element' },
      { name: 'Slider', description: 'A slider for numeric input' },
      { name: 'SliderInt', description: 'A slider for integer input' },
      { name: 'FloatField', description: 'A field for float input' },
      { name: 'IntegerField', description: 'A field for integer input' },
      { name: 'DoubleField', description: 'A field for double input' },
      { name: 'LongField', description: 'A field for long input' },
      { name: 'Vector2Field', description: 'A field for Vector2 input' },
      { name: 'Vector3Field', description: 'A field for Vector3 input' },
      { name: 'Vector4Field', description: 'A field for Vector4 input' },
      { name: 'Vector2IntField', description: 'A field for Vector2Int input' },
      { name: 'Vector3IntField', description: 'A field for Vector3Int input' },
      { name: 'RectField', description: 'A field for Rect input' },
      { name: 'RectIntField', description: 'A field for RectInt input' },
      { name: 'BoundsField', description: 'A field for Bounds input' },
      { name: 'BoundsIntField', description: 'A field for BoundsInt input' },
      { name: 'ScrollView', description: 'A scrollable container' },
      { name: 'ListView', description: 'A list view for displaying collections' },
      { name: 'TreeView', description: 'A tree view for hierarchical data' },
      { name: 'Foldout', description: 'A collapsible section' },
      { name: 'GroupBox', description: 'A grouped container with optional title' },
      { name: 'TwoPaneSplitView', description: 'A split view with two panes' },
      { name: 'TabView', description: 'A tabbed container' },
      { name: 'Tab', description: 'A single tab in a TabView' },
      { name: 'DropdownField', description: 'A dropdown selection field' },
      { name: 'EnumField', description: 'A field for enum selection' },
      { name: 'RadioButton', description: 'A radio button element' },
      { name: 'RadioButtonGroup', description: 'A group of radio buttons' },
      { name: 'Image', description: 'An image display element' },
      { name: 'ProgressBar', description: 'A progress indicator' },
      { name: 'MinMaxSlider', description: 'A slider with min and max values' },
      { name: 'HelpBox', description: 'A help message box' },
      { name: 'TemplateContainer', description: 'A container for UXML templates' },
      { name: 'Template', description: 'A UXML template definition' },
      { name: 'Instance', description: 'An instance of a UXML template' }
    ];

    for (const element of unityElements) {
      const item = new vscode.CompletionItem(element.name, vscode.CompletionItemKind.Class);
      item.detail = 'Unity UI Element';
      item.documentation = new vscode.MarkdownString(element.description);
      
      // Add snippet with common attributes
      if (element.name === 'Button') {
        item.insertText = new vscode.SnippetString('Button text="$1"$0');
      } else if (element.name === 'Label') {
        item.insertText = new vscode.SnippetString('Label text="$1"$0');
      } else if (element.name === 'TextField') {
        item.insertText = new vscode.SnippetString('TextField placeholder-text="$1"$0');
      } else {
        item.insertText = new vscode.SnippetString(`${element.name}$0`);
      }
      
      completions.push(item);
    }

    return completions;
  }

  private getAttributeCompletions(elementName: string): vscode.CompletionItem[] {
    const completions: vscode.CompletionItem[] = [];
    
    // Common attributes for all elements
    const commonAttributes = [
      { name: 'name', description: 'The name of the element for identification' },
      { name: 'class', description: 'CSS classes to apply to the element' },
      { name: 'style', description: 'Inline styles for the element' },
      { name: 'picking-mode', description: 'How the element responds to picking' },
      { name: 'tooltip', description: 'Tooltip text for the element' },
      { name: 'usage-hints', description: 'Hints for optimizing element usage' }
    ];

    // Element-specific attributes
    const elementAttributes: { [key: string]: Array<{ name: string; description: string }> } = {
      'Button': [
        { name: 'text', description: 'The text displayed on the button' }
      ],
      'Label': [
        { name: 'text', description: 'The text content of the label' }
      ],
      'TextField': [
        { name: 'value', description: 'The current text value' },
        { name: 'placeholder-text', description: 'Placeholder text when empty' },
        { name: 'multiline', description: 'Whether the field supports multiple lines' },
        { name: 'readonly', description: 'Whether the field is read-only' }
      ],
      'Toggle': [
        { name: 'value', description: 'The current toggle state (true/false)' },
        { name: 'text', description: 'The label text for the toggle' }
      ],
      'Slider': [
        { name: 'value', description: 'The current slider value' },
        { name: 'low-value', description: 'The minimum value' },
        { name: 'high-value', description: 'The maximum value' },
        { name: 'direction', description: 'The direction of the slider' }
      ],
      'Image': [
        { name: 'image', description: 'The image asset to display' },
        { name: 'scale-mode', description: 'How the image should be scaled' },
        { name: 'tint-color', description: 'Tint color for the image' }
      ],
      'ProgressBar': [
        { name: 'value', description: 'The current progress value' },
        { name: 'title', description: 'The title text for the progress bar' }
      ]
    };

    // Add common attributes
    for (const attr of commonAttributes) {
      const item = new vscode.CompletionItem(attr.name, vscode.CompletionItemKind.Property);
      item.detail = 'Common attribute';
      item.documentation = new vscode.MarkdownString(attr.description);
      item.insertText = new vscode.SnippetString(`${attr.name}="$1"$0`);
      completions.push(item);
    }

    // Add element-specific attributes
    if (elementAttributes[elementName]) {
      for (const attr of elementAttributes[elementName]) {
        const item = new vscode.CompletionItem(attr.name, vscode.CompletionItemKind.Property);
        item.detail = `${elementName} attribute`;
        item.documentation = new vscode.MarkdownString(attr.description);
        item.insertText = new vscode.SnippetString(`${attr.name}="$1"$0`);
        completions.push(item);
      }
    }

    return completions;
  }
}
