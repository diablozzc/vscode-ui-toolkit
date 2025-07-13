import * as vscode from 'vscode';
import { USSParser } from '../parsers/ussParser';

export class USSDefinitionProvider implements vscode.DefinitionProvider {
  
  provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Definition | vscode.LocationLink[]> {
    
    const line = document.lineAt(position.line).text;
    const wordRange = document.getWordRangeAtPosition(position, /--[a-z0-9-]+/);
    
    if (!wordRange) {
      return null;
    }
    
    const variableName = document.getText(wordRange);
    
    // Check if we're inside a var() function call
    if (this.isInsideVarFunction(line, position.character)) {
      return this.findVariableDefinition(document, variableName);
    }
    
    return null;
  }
  
  /**
   * Check if the cursor position is inside a var() function call
   */
  private isInsideVarFunction(line: string, characterPosition: number): boolean {
    const beforeCursor = line.substring(0, characterPosition);
    const afterCursor = line.substring(characterPosition);
    
    // Look for var( before cursor and ) after cursor
    const hasVarBefore = /var\s*\(\s*[^)]*$/.test(beforeCursor);
    const hasClosingParen = /^[^(]*\)/.test(afterCursor);
    
    return hasVarBefore && hasClosingParen;
  }
  
  /**
   * Find the definition location of a CSS variable
   */
  private findVariableDefinition(
    document: vscode.TextDocument, 
    variableName: string
  ): vscode.Location | null {
    
    // First, try to find the definition in the current document
    const location = USSParser.findCustomPropertyDefinition(document, variableName);
    if (location) {
      return location;
    }
    
    // If not found in current document, search in related USS files
    return this.searchInRelatedFiles(document, variableName);
  }
  
  /**
   * Search for variable definition in related USS files
   */
  private searchInRelatedFiles(
    _document: vscode.TextDocument,
    _variableName: string
  ): vscode.Location | null {
    
    // For now, only search in the current document
    // Cross-file search will be handled by the enhanced provider
    return null;
  }
}

/**
 * Enhanced USS Definition Provider that also handles cross-file references
 */
export class USSCrossFileDefinitionProvider implements vscode.DefinitionProvider {
  
  async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken
  ): Promise<vscode.Definition | vscode.LocationLink[]> {
    
    const line = document.lineAt(position.line).text;
    const wordRange = document.getWordRangeAtPosition(position, /--[a-z0-9-]+/);
    
    if (!wordRange) {
      return [];
    }
    
    const variableName = document.getText(wordRange);
    
    // Check if we're inside a var() function call
    if (!this.isInsideVarFunction(line, position.character)) {
      return [];
    }
    
    const locations: vscode.LocationLink[] = [];
    
    // Search in current document first
    const currentDocLocation = USSParser.findCustomPropertyDefinition(document, variableName);
    if (currentDocLocation) {
      locations.push({
        originSelectionRange: wordRange,
        targetUri: currentDocLocation.uri,
        targetRange: currentDocLocation.range,
        targetSelectionRange: currentDocLocation.range
      });
    }
    
    // Search in other USS files
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    if (workspaceFolder) {
      const ussFiles = await vscode.workspace.findFiles(
        new vscode.RelativePattern(workspaceFolder, '**/*.uss'),
        '**/node_modules/**'
      );
      
      for (const fileUri of ussFiles) {
        if (fileUri.toString() === document.uri.toString()) {
          continue;
        }
        
        try {
          const fileDocument = await vscode.workspace.openTextDocument(fileUri);
          const location = USSParser.findCustomPropertyDefinition(fileDocument, variableName);
          if (location) {
            locations.push({
              originSelectionRange: wordRange,
              targetUri: location.uri,
              targetRange: location.range,
              targetSelectionRange: location.range
            });
          }
        } catch (error) {
          // Ignore errors opening files
          continue;
        }
      }
    }
    
    return locations;
  }
  
  /**
   * Check if the cursor position is inside a var() function call
   */
  private isInsideVarFunction(line: string, characterPosition: number): boolean {
    const beforeCursor = line.substring(0, characterPosition);
    const afterCursor = line.substring(characterPosition);
    
    // Look for var( before cursor and ) after cursor
    const hasVarBefore = /var\s*\(\s*[^)]*$/.test(beforeCursor);
    const hasClosingParen = /^[^()*]*\)/.test(afterCursor);
    
    return hasVarBefore && hasClosingParen;
  }
}