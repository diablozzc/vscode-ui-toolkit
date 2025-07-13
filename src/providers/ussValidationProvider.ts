import * as vscode from 'vscode';
import {
  isValidUSSProperty,
  getUSSPropertyInfo,
  isValidUSSValue,
} from '../data/ussProperties';
import { USSParser } from '../parsers/ussParser';

export class USSValidationProvider
  implements vscode.DocumentFormattingEditProvider
{
  private diagnosticCollection: vscode.DiagnosticCollection;

  constructor() {
    this.diagnosticCollection =
      vscode.languages.createDiagnosticCollection('uss');
  }

  provideDocumentFormattingEdits(
    _document: vscode.TextDocument,
    _options: vscode.FormattingOptions,
    _token: vscode.CancellationToken
  ): vscode.TextEdit[] {
    // This will be implemented later for USS formatting
    return [];
  }

  onDidChangeTextDocument(event: vscode.TextDocumentChangeEvent) {
    if (event.document.languageId === 'uss') {
      this.validateDocument(event.document);
    }
  }

  onDidOpenTextDocument(document: vscode.TextDocument) {
    if (document.languageId === 'uss') {
      this.validateDocument(document);
    }
  }

  private validateDocument(document: vscode.TextDocument) {
    const diagnostics: vscode.Diagnostic[] = [];
    const text = document.getText();
    const lines = text.split('\n');

    // Track if we're inside a CSS rule block
    let inRuleBlock = false;
    let braceDepth = 0;

    // Basic USS validation - will be expanded later
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines and comments
      if (!line || line.startsWith('/*') || line.startsWith('//')) {
        continue;
      }

      // Track brace depth to know if we're inside a rule block
      const openBraces = (line.match(/{/g) || []).length;
      const closeBraces = (line.match(/}/g) || []).length;
      braceDepth += openBraces - closeBraces;
      inRuleBlock = braceDepth > 0;

      // Only validate properties when we're inside a rule block
      if (inRuleBlock && line.includes(':') && !line.includes('{') && !line.includes('}')) {
        // Check if this looks like a CSS property (not a selector with pseudo-classes)
        const propertyMatch = line.match(/^\s*([a-zA-Z][a-zA-Z0-9_-]*|\-\-[a-zA-Z0-9_-]+):\s*([^;]+);?\s*$/);
        if (propertyMatch) {
          const property = propertyMatch[1].trim();
          const value = propertyMatch[2].trim();

          // Skip validation for CSS custom properties (variables)
          if (property.startsWith('--')) {
            continue;
          }

          // Always validate USS property against Unity 6.1 supported properties
          if (!isValidUSSProperty(property)) {
            const range = new vscode.Range(i, 0, i, line.length);
            const diagnostic = new vscode.Diagnostic(
              range,
              `Property '${property}' is not supported in Unity USS`,
              vscode.DiagnosticSeverity.Error
            );
            diagnostics.push(diagnostic);
          } else {
            // Skip value validation for values that use var() function
            if (/var\s*\(/i.test(value)) {
              continue;
            }

            // Validate property value if specific values are defined
            const propertyInfo = getUSSPropertyInfo(property);
            if (
              propertyInfo &&
              propertyInfo.values &&
              !isValidUSSValue(property, value)
            ) {
              const range = new vscode.Range(
                i,
                line.indexOf(value),
                i,
                line.indexOf(value) + value.length
              );
              const diagnostic = new vscode.Diagnostic(
                range,
                `Value '${value}' is not valid for property '${property}'. Expected: ${propertyInfo.values.join(
                  ' | '
                )}`,
                vscode.DiagnosticSeverity.Warning
              );
              diagnostics.push(diagnostic);
            }
          }
        }
      }
    }

    // Add variable usage validation
    const variableDiagnostics = USSParser.validateVariableUsage(document);
    diagnostics.push(...variableDiagnostics);

    // Add syntax validation
    const syntaxDiagnostics = USSParser.validateSyntax(document);
    diagnostics.push(...syntaxDiagnostics);

    this.diagnosticCollection.set(document.uri, diagnostics);
  }

  dispose() {
    this.diagnosticCollection.dispose();
  }
}
