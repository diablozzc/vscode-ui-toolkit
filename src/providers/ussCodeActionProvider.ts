import * as vscode from 'vscode';
import { isValidUSSProperty } from '../data/ussProperties';
import { 
  getConversionForProperty, 
  shouldRemoveProperty, 
  convertCSSValueToUSS 
} from '../data/cssToUssConversions';

export class USSCodeActionProvider implements vscode.CodeActionProvider {
  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    _token: vscode.CancellationToken
  ): vscode.CodeAction[] {
    const actions: vscode.CodeAction[] = [];

    // Add fix all USS issues action
    const fixAllAction = this.createFixAllIssuesAction(document);
    if (fixAllAction) {
      actions.push(fixAllAction);
    }

    // Add actions for specific diagnostics
    for (const diagnostic of context.diagnostics) {
      if (diagnostic.source === 'uss' || diagnostic.message.includes('not supported in Unity USS')) {
        const lineText = document.lineAt(diagnostic.range.start.line).text;
        const propertyMatch = lineText.match(/^\s*([a-zA-Z][a-zA-Z0-9_-]*|\-\-[a-zA-Z0-9_-]+):\s*([^;]+);?\s*$/);
        
        if (propertyMatch) {
          const property = propertyMatch[1].trim();
          const value = propertyMatch[2].trim();

          // Action to remove unsupported property
          if (!isValidUSSProperty(property) && shouldRemoveProperty(property)) {
            const removeAction = this.createRemovePropertyAction(document, diagnostic.range, property);
            actions.push(removeAction);
          }

          // Action to convert CSS property to USS
          const conversion = getConversionForProperty(property);
          if (conversion) {
            const convertAction = this.createConvertPropertyAction(
              document, 
              diagnostic.range, 
              property, 
              value, 
              conversion
            );
            actions.push(convertAction);
          }
        }
      }
    }

    return actions;
  }

  public createFixAllIssuesAction(document: vscode.TextDocument): vscode.CodeAction | null {
    const edits: vscode.TextEdit[] = [];
    const text = document.getText();
    const lines = text.split('\n');
    
    let inRuleBlock = false;
    let braceDepth = 0;
    let hasIssues = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith('/*') || trimmedLine.startsWith('//')) {
        continue;
      }

      // Track brace depth
      const openBraces = (trimmedLine.match(/{/g) || []).length;
      const closeBraces = (trimmedLine.match(/}/g) || []).length;
      braceDepth += openBraces - closeBraces;
      inRuleBlock = braceDepth > 0;

      // Process properties inside rule blocks
      if (inRuleBlock && trimmedLine.includes(':') && !trimmedLine.includes('{') && !trimmedLine.includes('}')) {
        const propertyMatch = trimmedLine.match(/^\s*([a-zA-Z][a-zA-Z0-9_-]*|\-\-[a-zA-Z0-9_-]+):\s*([^;]+);?\s*$/);
        if (propertyMatch) {
          const property = propertyMatch[1].trim();
          const value = propertyMatch[2].trim();

          // Skip CSS custom properties
          if (property.startsWith('--')) {
            continue;
          }

          if (!isValidUSSProperty(property)) {
            hasIssues = true;
            const range = new vscode.Range(i, 0, i, line.length);
            
            // Check if property should be removed
            if (shouldRemoveProperty(property)) {
              // Remove the entire line (including newline if not last line)
              const endLine = i < lines.length - 1 ? i + 1 : i;
              const endChar = i < lines.length - 1 ? 0 : line.length;
              const removeRange = new vscode.Range(i, 0, endLine, endChar);
              edits.push(vscode.TextEdit.delete(removeRange));
            } else {
              // Check if property can be converted
              const conversion = getConversionForProperty(property);
              if (conversion) {
                const convertedValue = convertCSSValueToUSS(property, value);
                const newLine = line.replace(
                  new RegExp(`\\b${property}\\b`), 
                  conversion.ussProperty
                ).replace(value, convertedValue);
                edits.push(vscode.TextEdit.replace(range, newLine));
              } else {
                // Remove unsupported property
                const endLine = i < lines.length - 1 ? i + 1 : i;
                const endChar = i < lines.length - 1 ? 0 : line.length;
                const removeRange = new vscode.Range(i, 0, endLine, endChar);
                edits.push(vscode.TextEdit.delete(removeRange));
              }
            }
          }
        }
      }
    }

    if (!hasIssues) {
      return null;
    }

    const action = new vscode.CodeAction(
      '🔧 修复所有USS兼容性问题',
      vscode.CodeActionKind.QuickFix
    );
    action.edit = new vscode.WorkspaceEdit();
    action.edit.set(document.uri, edits);
    action.isPreferred = true;

    return action;
  }

  private createRemovePropertyAction(
    document: vscode.TextDocument,
    range: vscode.Range,
    property: string
  ): vscode.CodeAction {
    const action = new vscode.CodeAction(
      `移除不支持的属性 '${property}'`,
      vscode.CodeActionKind.QuickFix
    );

    // Remove the entire line
    const lineRange = document.lineAt(range.start.line);
    const fullLineRange = lineRange.rangeIncludingLineBreak;
    
    action.edit = new vscode.WorkspaceEdit();
    action.edit.delete(document.uri, fullLineRange);

    return action;
  }

  private createConvertPropertyAction(
    document: vscode.TextDocument,
    range: vscode.Range,
    cssProperty: string,
    cssValue: string,
    conversion: { ussProperty: string; valueConverter?: (value: string) => string; note?: string }
  ): vscode.CodeAction {
    const convertedValue = convertCSSValueToUSS(cssProperty, cssValue);
    const actionTitle = conversion.note 
      ? `转换 '${cssProperty}' 为 '${conversion.ussProperty}' (${conversion.note})`
      : `转换 '${cssProperty}' 为 '${conversion.ussProperty}'`;

    const action = new vscode.CodeAction(
      actionTitle,
      vscode.CodeActionKind.QuickFix
    );

    const lineText = document.lineAt(range.start.line).text;
    const newLineText = lineText
      .replace(new RegExp(`\\b${cssProperty}\\b`), conversion.ussProperty)
      .replace(cssValue, convertedValue);

    action.edit = new vscode.WorkspaceEdit();
    action.edit.replace(document.uri, range, newLineText);

    return action;
  }
}