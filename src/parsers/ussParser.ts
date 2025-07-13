import * as vscode from 'vscode';

export interface USSRule {
  selector: string;
  properties: USSProperty[];
  position: vscode.Position;
  range: vscode.Range;
}

export interface USSProperty {
  name: string;
  value: string;
  position: vscode.Position;
  range: vscode.Range;
  isCustomProperty?: boolean;
  usesVariables?: boolean;
}

export interface USSSelector {
  type: 'class' | 'id' | 'element' | 'universal' | 'pseudo';
  name: string;
  position: vscode.Position;
  range: vscode.Range;
}

export interface USSCustomProperty {
  name: string;
  value: string;
  position: vscode.Position;
  range: vscode.Range;
}

export interface USSImport {
  path: string;
  url?: string;
  position: vscode.Position;
  range: vscode.Range;
  pathRange: vscode.Range;
}

export class USSParser {
  
  /**
   * Parse USS document and extract all rules
   */
  public static parseDocument(document: vscode.TextDocument): USSRule[] {
    const rules: USSRule[] = [];
    const text = document.getText();
    const lines = text.split('\n');
    
    let currentRule: Partial<USSRule> | null = null;
    let inRuleBlock = false;
    let braceDepth = 0;

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      const trimmedLine = line.trim();
      
      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith('/*') || trimmedLine.startsWith('//')) {
        continue;
      }

      // Check for rule start (selector followed by {)
      if (!inRuleBlock && trimmedLine.includes('{')) {
        const selectorPart = trimmedLine.substring(0, trimmedLine.indexOf('{')).trim();
        if (selectorPart) {
          const startPos = new vscode.Position(lineIndex, line.indexOf(selectorPart));
          currentRule = {
            selector: selectorPart,
            properties: [],
            position: startPos,
            range: new vscode.Range(startPos, startPos) // Will be updated when rule ends
          };
          inRuleBlock = true;
          braceDepth = 1;
        }
      } else if (inRuleBlock) {
        // Count braces to handle nested rules
        braceDepth += (line.match(/{/g) || []).length;
        braceDepth -= (line.match(/}/g) || []).length;
        
        // Parse properties within the rule
        if (braceDepth > 0 && trimmedLine.includes(':') && !trimmedLine.includes('{')) {
          const property = this.parseProperty(line, lineIndex);
          if (property && currentRule) {
            currentRule.properties!.push(property);
          }
        }
        
        // Rule ends when braces are balanced
        if (braceDepth === 0 && currentRule) {
          const endPos = new vscode.Position(lineIndex, line.length);
          currentRule.range = new vscode.Range(currentRule.position!, endPos);
          rules.push(currentRule as USSRule);
          currentRule = null;
          inRuleBlock = false;
        }
      }
    }

    return rules;
  }

  /**
   * Parse a CSS property line
   */
  private static parseProperty(line: string, lineIndex: number): USSProperty | null {
    const propertyMatch = line.match(/^\s*([^:]+):\s*([^;]+);?\s*$/);
    if (propertyMatch) {
      const propertyName = propertyMatch[1].trim();
      const propertyValue = propertyMatch[2].trim();
      
      const nameStart = line.indexOf(propertyName);
      const valueStart = line.indexOf(propertyValue);
      
      return {
        name: propertyName,
        value: propertyValue,
        position: new vscode.Position(lineIndex, nameStart),
        range: new vscode.Range(
          new vscode.Position(lineIndex, nameStart),
          new vscode.Position(lineIndex, valueStart + propertyValue.length)
        ),
        isCustomProperty: propertyName.startsWith('--'),
        usesVariables: this.hasVariableUsage(propertyValue)
      };
    }
    
    return null;
  }

  /**
   * Extract class selectors from USS document
   */
  public static parseClassSelectors(document: vscode.TextDocument): USSSelector[] {
    const selectors: USSSelector[] = [];
    const rules = this.parseDocument(document);
    
    for (const rule of rules) {
      const selectorParts = rule.selector.split(',').map(s => s.trim());
      
      for (const selectorPart of selectorParts) {
        const classMatches = selectorPart.matchAll(/\.([a-zA-Z][a-zA-Z0-9_-]*)/g);
        
        for (const match of classMatches) {
          const className = match[1];
          // Calculate approximate position - this could be more precise
          const selectorLine = document.positionAt(document.getText().indexOf(rule.selector)).line;
          const line = document.lineAt(selectorLine).text;
          const classIndex = line.indexOf('.' + className);
          
          if (classIndex >= 0) {
            const startPos = new vscode.Position(selectorLine, classIndex + 1); // +1 to skip the dot
            const endPos = new vscode.Position(selectorLine, classIndex + 1 + className.length);
            
            selectors.push({
              type: 'class',
              name: className,
              position: startPos,
              range: new vscode.Range(startPos, endPos)
            });
          }
        }
      }
    }
    
    return selectors;
  }

  /**
   * Find class definition by name
   */
  public static findClassDefinition(document: vscode.TextDocument, className: string): vscode.Location | undefined {
    const selectors = this.parseClassSelectors(document);
    
    for (const selector of selectors) {
      if (selector.type === 'class' && selector.name === className) {
        return new vscode.Location(document.uri, selector.position);
      }
    }
    
    return undefined;
  }

  /**
   * Get all class names defined in the USS document
   */
  public static getAllClassNames(document: vscode.TextDocument): string[] {
    const selectors = this.parseClassSelectors(document);
    const classNames = new Set<string>();
    
    for (const selector of selectors) {
      if (selector.type === 'class') {
        classNames.add(selector.name);
      }
    }
    
    return Array.from(classNames);
  }

  /**
   * Extract all custom properties (CSS variables) from USS document
   */
  public static parseCustomProperties(document: vscode.TextDocument): USSCustomProperty[] {
    const customProperties: USSCustomProperty[] = [];
    const rules = this.parseDocument(document);
    
    for (const rule of rules) {
      for (const property of rule.properties) {
        if (property.isCustomProperty) {
          customProperties.push({
            name: property.name,
            value: property.value,
            position: property.position,
            range: property.range
          });
        }
      }
    }
    
    return customProperties;
  }

  /**
   * Get all custom property names defined in the USS document
   */
  public static getAllCustomPropertyNames(document: vscode.TextDocument): string[] {
    const customProperties = this.parseCustomProperties(document);
    const propertyNames = new Set<string>();
    
    for (const property of customProperties) {
      propertyNames.add(property.name);
    }
    
    return Array.from(propertyNames);
  }

  /**
   * Check if a value contains var() function calls
   */
  private static hasVariableUsage(value: string): boolean {
    return /var\s*\(/i.test(value);
  }

  /**
   * Extract variable names used in var() functions from a value
   */
  public static extractVariableNames(value: string): string[] {
    const variableNames: string[] = [];
    const varRegex = /var\s*\(\s*(--[^\s,)]+)/gi;
    let match;
    
    while ((match = varRegex.exec(value)) !== null) {
      variableNames.push(match[1]);
    }
    
    return variableNames;
  }

  /**
   * Find custom property definition by name
   */
  public static findCustomPropertyDefinition(document: vscode.TextDocument, propertyName: string): vscode.Location | undefined {
    const customProperties = this.parseCustomProperties(document);
    
    for (const property of customProperties) {
      if (property.name === propertyName) {
        return new vscode.Location(document.uri, property.position);
      }
    }
    
    return undefined;
  }

  /**
   * Check if position is within a selector
   */
  public static isPositionInSelector(document: vscode.TextDocument, position: vscode.Position): boolean {
    const line = document.lineAt(position.line).text;
    const charIndex = position.character;
    
    // Simple check - if line contains { and position is before it, likely in selector
    const braceIndex = line.indexOf('{');
    if (braceIndex >= 0 && charIndex < braceIndex) {
      return true;
    }
    
    return false;
  }

  /**
   * Get selector at specific position
   */
  public static getSelectorAtPosition(document: vscode.TextDocument, position: vscode.Position): string | undefined {
    const rules = this.parseDocument(document);
    
    for (const rule of rules) {
      if (rule.range.contains(position)) {
        // Check if position is in the selector part (before the first {)
        const selectorEndLine = document.positionAt(document.getText().indexOf(rule.selector) + rule.selector.length).line;
        if (position.line <= selectorEndLine) {
          return rule.selector;
        }
      }
    }
    
    return undefined;
  }

  /**
   * Get property at specific position
   */
  public static getPropertyAtPosition(document: vscode.TextDocument, position: vscode.Position): USSProperty | undefined {
    const rules = this.parseDocument(document);
    
    for (const rule of rules) {
      for (const property of rule.properties) {
        if (property.range.contains(position)) {
          return property;
        }
      }
    }
    
    return undefined;
  }

  /**
   * Validate USS syntax and return diagnostics
   */
  public static validateSyntax(document: vscode.TextDocument): vscode.Diagnostic[] {
    const diagnostics: vscode.Diagnostic[] = [];
    const text = document.getText();
    const lines = text.split('\n');
    
    let braceDepth = 0;
    
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      const trimmedLine = line.trim();
      
      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith('/*') || trimmedLine.startsWith('//')) {
        continue;
      }
      
      // Count braces
      const openBraces = (line.match(/{/g) || []).length;
      const closeBraces = (line.match(/}/g) || []).length;
      braceDepth += openBraces - closeBraces;
      
      // Check for unmatched braces
      if (braceDepth < 0) {
        const range = new vscode.Range(lineIndex, 0, lineIndex, line.length);
        diagnostics.push(new vscode.Diagnostic(
          range,
          'Unmatched closing brace',
          vscode.DiagnosticSeverity.Error
        ));
        braceDepth = 0; // Reset to continue parsing
      }
    }
    
    // Check for unclosed braces at end of document
    if (braceDepth > 0) {
      const lastLine = lines.length - 1;
      const range = new vscode.Range(lastLine, 0, lastLine, lines[lastLine].length);
      diagnostics.push(new vscode.Diagnostic(
        range,
        'Unclosed brace - missing closing brace',
        vscode.DiagnosticSeverity.Error
      ));
    }
    
    return diagnostics;
  }

  /**
   * Validate variable usage in USS document
   */
  public static validateVariableUsage(document: vscode.TextDocument): vscode.Diagnostic[] {
    const diagnostics: vscode.Diagnostic[] = [];
    const rules = this.parseDocument(document);
    const definedVariables = new Set(this.getAllCustomPropertyNames(document));
    
    for (const rule of rules) {
      for (const property of rule.properties) {
        if (property.usesVariables) {
          const usedVariables = this.extractVariableNames(property.value);
          
          for (const varName of usedVariables) {
            if (!definedVariables.has(varName)) {
              // Find position of the undefined variable in the value
              const varMatch = property.value.match(new RegExp(`var\\\\s*\\\\(\\\\s*(${varName.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')})\\\\s*\\\\)`, 'i'));
              if (varMatch) {
                const varStart = property.value.indexOf(varMatch[0]);
                const valueStartPos = document.positionAt(document.offsetAt(property.range.start) + property.value.indexOf(property.value));
                const varStartPos = new vscode.Position(valueStartPos.line, valueStartPos.character + varStart);
                const varEndPos = new vscode.Position(valueStartPos.line, valueStartPos.character + varStart + varMatch[1].length);
                
                diagnostics.push(new vscode.Diagnostic(
                  new vscode.Range(varStartPos, varEndPos),
                  `Undefined CSS variable: ${varName}`,
                  vscode.DiagnosticSeverity.Warning
                ));
              }
            }
          }
        }
      }
    }
    
    return diagnostics;
  }

  /**
   * Parse @import statements from USS document
   */
  public static parseImports(document: vscode.TextDocument): USSImport[] {
    const imports: USSImport[] = [];
    const text = document.getText();
    const lines = text.split('\n');
    
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      const trimmedLine = line.trim();
      
      // Skip comments
      if (trimmedLine.startsWith('/*') || trimmedLine.startsWith('//')) {
        continue;
      }
      
      // Match @import statements
      // Supports: @import "path"; @import 'path'; @import url("path"); @import url('path');
      const importMatch = trimmedLine.match(/^@import\s+(?:url\s*\(\s*)?["']([^"']+)["']\s*\)?\s*;/);
      if (importMatch) {
        const fullMatch = importMatch[0];
        const importPath = importMatch[1];
        
        const lineStart = line.indexOf('@import');
        const pathStart = line.indexOf(importPath);
        
        const startPos = new vscode.Position(lineIndex, lineStart);
        const endPos = new vscode.Position(lineIndex, lineStart + fullMatch.length);
        const pathStartPos = new vscode.Position(lineIndex, pathStart);
        const pathEndPos = new vscode.Position(lineIndex, pathStart + importPath.length);
        
        imports.push({
          path: importPath,
          url: importMatch[0].includes('url(') ? importPath : undefined,
          position: startPos,
          range: new vscode.Range(startPos, endPos),
          pathRange: new vscode.Range(pathStartPos, pathEndPos)
        });
      }
    }
    
    return imports;
  }

  /**
   * Find import statement at specific position
   */
  public static getImportAtPosition(document: vscode.TextDocument, position: vscode.Position): USSImport | undefined {
    const imports = this.parseImports(document);
    
    for (const importItem of imports) {
      if (importItem.pathRange.contains(position)) {
        return importItem;
      }
    }
    
    return undefined;
  }

  /**
   * Resolve import path relative to current document
   */
  public static resolveImportPath(currentDocumentUri: vscode.Uri, importPath: string): vscode.Uri | undefined {
    try {
      // Handle relative paths
      if (importPath.startsWith('./') || importPath.startsWith('../')) {
        const currentDir = vscode.Uri.joinPath(currentDocumentUri, '..');
        return vscode.Uri.joinPath(currentDir, importPath);
      }
      
      // Handle absolute paths (starting with /)
      if (importPath.startsWith('/')) {
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(currentDocumentUri);
        if (workspaceFolder) {
          return vscode.Uri.joinPath(workspaceFolder.uri, importPath.substring(1));
        }
      }
      
      // Handle paths without extension - try .uss extension
      if (!importPath.includes('.')) {
        const withExtension = importPath + '.uss';
        return this.resolveImportPath(currentDocumentUri, withExtension);
      }
      
      // Default: treat as relative to current document
      const currentDir = vscode.Uri.joinPath(currentDocumentUri, '..');
      return vscode.Uri.joinPath(currentDir, importPath);
    } catch (error) {
      return undefined;
    }
  }
}
