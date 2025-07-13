import * as vscode from 'vscode';
import { USS_PROPERTIES, getUSSPropertyInfo } from '../data/ussProperties';
import { USSParser } from '../parsers/ussParser';

export class USSCompletionProvider implements vscode.CompletionItemProvider {
  
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken,
    _context: vscode.CompletionContext
  ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
    
    const line = document.lineAt(position.line).text;
    const linePrefix = line.substring(0, position.character);
    
    // Check if we're in a property name context
    if (this.isInPropertyNameContext(linePrefix)) {
      return this.getPropertyCompletions(document);
    }
    
    // Check if we're in a property value context
    const propertyName = this.getPropertyNameFromLine(line, position.character);
    if (propertyName) {
      return this.getPropertyValueCompletions(propertyName, document, position);
    }
    
    // Check if we're typing a var() function
    if (this.isTypingVarFunction(linePrefix)) {
      return this.getVariableCompletions(document);
    }
    
    return [];
  }

  private isInPropertyNameContext(linePrefix: string): boolean {
    // Simple heuristic: if line is indented and doesn't contain :, we're likely in property name context
    const trimmed = linePrefix.trim();
    return linePrefix.startsWith('  ') && !trimmed.includes(':') && !trimmed.includes('{') && !trimmed.includes('}');
  }

  private getPropertyNameFromLine(line: string, position: number): string | undefined {
    // Look for property: pattern before the cursor position
    const beforeCursor = line.substring(0, position);
    const match = beforeCursor.match(/([a-z-][a-z0-9-]*)\s*:\s*$/);
    if (match) {
      return match[1];
    }
    
    // Also check if we're in the middle of typing a value
    const fullMatch = line.match(/([a-z-][a-z0-9-]*)\s*:\s*([^;]*)/);
    if (fullMatch && position > line.indexOf(':')) {
      return fullMatch[1];
    }
    
    // Support custom properties (CSS variables)
    const customMatch = beforeCursor.match(/(--[a-z0-9-]+)\s*:\s*$/);
    if (customMatch) {
      return customMatch[1];
    }
    
    return undefined;
  }

  private getPropertyCompletions(document: vscode.TextDocument): vscode.CompletionItem[] {
    const completions: vscode.CompletionItem[] = [];
    
    // Add standard USS properties
    for (const [propertyName, propertyInfo] of Object.entries(USS_PROPERTIES)) {
      const item = new vscode.CompletionItem(propertyName, vscode.CompletionItemKind.Property);
      item.detail = propertyInfo.syntax;
      item.documentation = new vscode.MarkdownString(propertyInfo.description);
      
      if (propertyInfo.unitySpecific) {
        item.documentation.appendMarkdown('\n\n**Unity-specific property**');
      }
      
      if (propertyInfo.inherited) {
        item.documentation.appendMarkdown('\n\n*Inherited property*');
      }
      
      item.documentation.appendMarkdown(`\n\n**Animatable:** ${propertyInfo.animatable}`);
      
      // Add snippet with colon and space
      item.insertText = `${propertyName}: `;
      item.command = {
        command: 'editor.action.triggerSuggest',
        title: 'Trigger Suggest'
      };
      
      completions.push(item);
    }
    
    // Add custom properties (CSS variables) already defined in this document
    const customProperties = USSParser.getAllCustomPropertyNames(document);
    for (const customProperty of customProperties) {
      const item = new vscode.CompletionItem(customProperty, vscode.CompletionItemKind.Variable);
      item.detail = 'CSS Custom Property';
      item.documentation = new vscode.MarkdownString(`Custom CSS variable: \`${customProperty}\``);
      item.insertText = `${customProperty}: `;
      item.command = {
        command: 'editor.action.triggerSuggest',
        title: 'Trigger Suggest'
      };
      completions.push(item);
    }
    
    return completions;
  }

  private getPropertyValueCompletions(propertyName: string, document: vscode.TextDocument, _position: vscode.Position): vscode.CompletionItem[] {
    const completions: vscode.CompletionItem[] = [];
    
    // Add variable completions for any property value
    const variableCompletions = this.getVariableCompletions(document);
    completions.push(...variableCompletions);
    
    // Skip standard property validation for custom properties
    if (propertyName.startsWith('--')) {
      return completions;
    }
    
    const propertyInfo = getUSSPropertyInfo(propertyName);
    
    if (!propertyInfo || !propertyInfo.values) {
      // Add common value patterns even if no specific values are defined
      this.addCommonValueCompletions(propertyName, propertyInfo?.syntax || '', completions);
      return completions;
    }
    
    for (const value of propertyInfo.values) {
      const item = new vscode.CompletionItem(value, vscode.CompletionItemKind.Value);
      item.detail = `Value for ${propertyName}`;
      
      // Add specific documentation for known values
      const valueDoc = this.getValueDocumentation(propertyName, value);
      if (valueDoc) {
        item.documentation = new vscode.MarkdownString(valueDoc);
      }
      
      completions.push(item);
    }
    
    // Add common value patterns based on property type
    this.addCommonValueCompletions(propertyName, propertyInfo.syntax, completions);
    
    return completions;
  }

  private getValueDocumentation(propertyName: string, value: string): string | undefined {
    const valueDescriptions: { [key: string]: { [key: string]: string } } = {
      'position': {
        'absolute': 'Element is positioned absolutely relative to its parent',
        'relative': 'Element is positioned relative to its normal position'
      },
      'flex-direction': {
        'row': 'Items are placed in a row (horizontal)',
        'column': 'Items are placed in a column (vertical)',
        'row-reverse': 'Items are placed in a row in reverse order',
        'column-reverse': 'Items are placed in a column in reverse order'
      },
      'justify-content': {
        'flex-start': 'Items are packed toward the start of the flex-direction',
        'flex-end': 'Items are packed toward the end of the flex-direction',
        'center': 'Items are centered along the line',
        'space-between': 'Items are evenly distributed with first item at start and last at end',
        'space-around': 'Items are evenly distributed with equal space around them'
      },
      'align-items': {
        'flex-start': 'Items are placed at the start of the cross axis',
        'flex-end': 'Items are placed at the end of the cross axis',
        'center': 'Items are centered on the cross axis',
        'stretch': 'Items are stretched to fill the container',
        'auto': 'Uses the parent\'s align-items value or stretch if no parent'
      },
      'display': {
        'flex': 'Element participates in flex layout',
        'none': 'Element is not displayed and takes no space'
      },
      'visibility': {
        'visible': 'Element is visible',
        'hidden': 'Element is hidden but still takes space in layout'
      },
      'overflow': {
        'visible': 'Content is not clipped and may overflow the element bounds',
        'hidden': 'Content is clipped to the element bounds'
      },
      '-unity-text-align': {
        'upper-left': 'Text is aligned to the upper-left corner',
        'upper-center': 'Text is aligned to the upper-center',
        'upper-right': 'Text is aligned to the upper-right corner',
        'middle-left': 'Text is aligned to the middle-left',
        'middle-center': 'Text is centered',
        'middle-right': 'Text is aligned to the middle-right',
        'lower-left': 'Text is aligned to the lower-left corner',
        'lower-center': 'Text is aligned to the lower-center',
        'lower-right': 'Text is aligned to the lower-right corner'
      }
    };

    if (valueDescriptions[propertyName] && valueDescriptions[propertyName][value]) {
      return valueDescriptions[propertyName][value];
    }

    return undefined;
  }

  private addCommonValueCompletions(propertyName: string, syntax: string, completions: vscode.CompletionItem[]): void {
    // Add length value completions for properties that accept <length>
    if (syntax.includes('<length>')) {
      const lengthUnits = ['px', 'em', 'rem', '%'];
      for (const unit of lengthUnits) {
        const item = new vscode.CompletionItem(`0${unit}`, vscode.CompletionItemKind.Value);
        item.detail = `Length value in ${unit}`;
        item.insertText = `0${unit}`;
        completions.push(item);
      }
    }
    
    // Add color value completions for properties that accept <color>
    if (syntax.includes('<color>')) {
      const commonColors = [
        { name: 'transparent', value: 'transparent' },
        { name: 'white', value: 'white' },
        { name: 'black', value: 'black' },
        { name: 'red', value: 'red' },
        { name: 'green', value: 'green' },
        { name: 'blue', value: 'blue' },
        { name: 'yellow', value: 'yellow' },
        { name: 'cyan', value: 'cyan' },
        { name: 'magenta', value: 'magenta' },
        { name: 'gray', value: 'gray' }
      ];
      
      for (const color of commonColors) {
        const item = new vscode.CompletionItem(color.name, vscode.CompletionItemKind.Color);
        item.detail = `Color: ${color.name}`;
        item.insertText = color.value;
        completions.push(item);
      }
      
      // Add hex color pattern
      const hexItem = new vscode.CompletionItem('#000000', vscode.CompletionItemKind.Color);
      hexItem.detail = 'Hex color value';
      hexItem.insertText = '#000000';
      completions.push(hexItem);
    }
    
    // Add number completions for properties that accept <number>
    if (syntax.includes('<number>')) {
      const commonNumbers = ['0', '1', '2', '0.5', '1.5'];
      for (const num of commonNumbers) {
        const item = new vscode.CompletionItem(num, vscode.CompletionItemKind.Value);
        item.detail = 'Numeric value';
        item.insertText = num;
        completions.push(item);
      }
    }
  }

  private isTypingVarFunction(linePrefix: string): boolean {
    // Check if we're typing inside a var() function
    return /var\s*\(\s*$/.test(linePrefix) || /var\s*\(\s*--[a-z0-9-]*$/.test(linePrefix);
  }

  private getVariableCompletions(document: vscode.TextDocument): vscode.CompletionItem[] {
    const completions: vscode.CompletionItem[] = [];
    const customProperties = USSParser.getAllCustomPropertyNames(document);
    
    for (const customProperty of customProperties) {
      const item = new vscode.CompletionItem(`var(${customProperty})`, vscode.CompletionItemKind.Variable);
      item.detail = 'CSS Variable Reference';
      item.documentation = new vscode.MarkdownString(`Reference to custom property: \`${customProperty}\``);
      item.insertText = `var(${customProperty})`;
      item.filterText = customProperty;
      completions.push(item);
    }
    
    // Add var() function template if no variables exist yet
    if (customProperties.length === 0) {
      const item = new vscode.CompletionItem('var(--custom-property)', vscode.CompletionItemKind.Snippet);
      item.detail = 'CSS Variable Template';
      item.documentation = new vscode.MarkdownString('Template for CSS variable usage. Replace `--custom-property` with your variable name.');
      item.insertText = new vscode.SnippetString('var(--${1:custom-property})');
      completions.push(item);
    }
    
    return completions;
  }
}
