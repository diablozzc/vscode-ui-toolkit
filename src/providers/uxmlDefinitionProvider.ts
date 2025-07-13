import * as vscode from 'vscode';
import { UXMLParser } from '../parsers/uxmlParser';
import { USSParser } from '../parsers/ussParser';

export class UXMLDefinitionProvider implements vscode.DefinitionProvider {
  async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken
  ): Promise<vscode.Definition | undefined> {
    // Check if we're in a class attribute using the parser
    if (!UXMLParser.isPositionInClassAttribute(document, position)) {
      return undefined;
    }

    // Get the class name at the current position
    const className = UXMLParser.getClassNameAtPosition(document, position);
    if (!className) {
      return undefined;
    }

    // Find the class definition in USS files
    return this.findClassDefinition(className, document);
  }

  private async findClassDefinition(
    className: string,
    document: vscode.TextDocument
  ): Promise<vscode.Definition | undefined> {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    if (!workspaceFolder) {
      return undefined;
    }

    // Search for USS files in the workspace
    const ussFiles = await vscode.workspace.findFiles(
      '**/*.uss',
      '**/node_modules/**'
    );

    for (const ussFile of ussFiles) {
      const ussDocument = await vscode.workspace.openTextDocument(ussFile);

      // Use the USS parser to find class definition
      const classDefinition = USSParser.findClassDefinition(
        ussDocument,
        className
      );
      if (classDefinition) {
        return classDefinition;
      }
    }

    return undefined;
  }
}
