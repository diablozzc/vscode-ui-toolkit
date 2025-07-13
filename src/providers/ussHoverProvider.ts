import * as vscode from 'vscode';
import { getUSSPropertyInfo } from '../data/ussProperties';

export class USSHoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    const wordRange = document.getWordRangeAtPosition(position);
    if (!wordRange) {
      return undefined;
    }

    const word = document.getText(wordRange);
    const line = document.lineAt(position.line).text;

    // Check if we're hovering over a USS property
    const propertyMatch = line.match(/^\s*([^:]+):\s*([^;]+);?\s*$/);
    if (propertyMatch) {
      const property = propertyMatch[1].trim();
      const value = propertyMatch[2].trim();

      if (word === property) {
        return this.getPropertyHover(property);
      } else if (word === value || value.includes(word)) {
        return this.getValueHover(property, word);
      }
    }

    // Check if we're hovering over a selector
    if (line.includes(word) && (line.includes('{') || line.includes(','))) {
      return this.getSelectorHover(word);
    }

    return undefined;
  }

  private getPropertyHover(property: string): vscode.Hover | undefined {
    const propertyInfo = getUSSPropertyInfo(property);
    if (propertyInfo) {
      const markdown = new vscode.MarkdownString();
      markdown.appendCodeblock(`${property}: ${propertyInfo.syntax}`, 'css');
      markdown.appendMarkdown(`\n\n${propertyInfo.description}`);

      if (propertyInfo.unitySpecific) {
        markdown.appendMarkdown('\n\n**Unity-specific property**');
      }

      if (propertyInfo.inherited) {
        markdown.appendMarkdown('\n\n*Inherited property*');
      }

      markdown.appendMarkdown(`\n\n**Animatable:** ${propertyInfo.animatable}`);

      return new vscode.Hover(markdown);
    }

    return undefined;
  }

  private getValueHover(
    property: string,
    value: string
  ): vscode.Hover | undefined {
    const valueInfo = this.getUSSValueInfo(property, value);
    if (valueInfo) {
      const markdown = new vscode.MarkdownString();
      markdown.appendCodeblock(`${value}`, 'css');
      markdown.appendMarkdown(`\n\n${valueInfo.description}`);

      return new vscode.Hover(markdown);
    }

    return undefined;
  }

  private getSelectorHover(selector: string): vscode.Hover | undefined {
    if (selector.startsWith('.')) {
      const markdown = new vscode.MarkdownString();
      markdown.appendCodeblock(selector, 'css');
      markdown.appendMarkdown(
        '\n\nClass selector - targets elements with this USS class'
      );
      return new vscode.Hover(markdown);
    } else if (selector.startsWith('#')) {
      const markdown = new vscode.MarkdownString();
      markdown.appendCodeblock(selector, 'css');
      markdown.appendMarkdown(
        '\n\nName selector - targets elements with this name'
      );
      return new vscode.Hover(markdown);
    }

    return undefined;
  }

  private getUSSValueInfo(
    property: string,
    value: string
  ): { description: string } | undefined {
    // This will be expanded with comprehensive Unity USS value information
    const valueDescriptions: { [key: string]: { [key: string]: string } } = {
      position: {
        absolute: 'Element is positioned absolutely relative to its parent',
        relative: 'Element is positioned relative to its normal position',
      },
      'flex-direction': {
        row: 'Items are placed in a row (horizontal)',
        column: 'Items are placed in a column (vertical)',
        'row-reverse': 'Items are placed in a row in reverse order',
        'column-reverse': 'Items are placed in a column in reverse order',
      },
    };

    if (valueDescriptions[property] && valueDescriptions[property][value]) {
      return { description: valueDescriptions[property][value] };
    }

    return undefined;
  }
}
