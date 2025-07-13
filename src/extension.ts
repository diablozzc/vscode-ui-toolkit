import * as vscode from 'vscode';
import { USSValidationProvider } from './providers/ussValidationProvider';
import { UXMLDefinitionProvider } from './providers/uxmlDefinitionProvider';
import { USSCrossFileDefinitionProvider } from './providers/ussDefinitionProvider';
import { USSHoverProvider } from './providers/ussHoverProvider';
import { USSCompletionProvider } from './providers/ussCompletionProvider';
import { UXMLCompletionProvider } from './providers/uxmlCompletionProvider';

export function activate(context: vscode.ExtensionContext) {
  console.log('Unity UI Toolkit extension is now active!');

  // Get configuration
  const config = vscode.workspace.getConfiguration('unityUIToolkit');
  const validationEnabled = config.get<boolean>('validation.enabled', true);
  const intellisenseEnabled = config.get<boolean>('intellisense.enabled', true);

  // Register USS validation provider
  if (validationEnabled) {
    const ussValidationProvider = new USSValidationProvider();
    context.subscriptions.push(
      vscode.languages.registerDocumentFormattingEditProvider(
        'uss',
        ussValidationProvider
      ),
      vscode.workspace.onDidChangeTextDocument(
        ussValidationProvider.onDidChangeTextDocument,
        ussValidationProvider
      ),
      vscode.workspace.onDidOpenTextDocument(
        ussValidationProvider.onDidOpenTextDocument,
        ussValidationProvider
      )
    );

    // Validate all currently open USS documents
    vscode.workspace.textDocuments.forEach(document => {
      if (document.languageId === 'uss') {
        ussValidationProvider.onDidOpenTextDocument(document);
      }
    });
  }

  // Register UXML definition provider (Go to Definition)
  if (intellisenseEnabled) {
    const uxmlDefinitionProvider = new UXMLDefinitionProvider();
    context.subscriptions.push(
      vscode.languages.registerDefinitionProvider(
        'uxml',
        uxmlDefinitionProvider
      )
    );

    // Register USS hover provider
    const ussHoverProvider = new USSHoverProvider();
    context.subscriptions.push(
      vscode.languages.registerHoverProvider('uss', ussHoverProvider)
    );

    // Register USS definition provider for variable references
    const ussDefinitionProvider = new USSCrossFileDefinitionProvider();
    context.subscriptions.push(
      vscode.languages.registerDefinitionProvider('uss', ussDefinitionProvider)
    );

    // Register completion providers
    const ussCompletionProvider = new USSCompletionProvider();
    context.subscriptions.push(
      vscode.languages.registerCompletionItemProvider(
        'uss',
        ussCompletionProvider,
        ':',
        ' '
      )
    );

    const uxmlCompletionProvider = new UXMLCompletionProvider();
    context.subscriptions.push(
      vscode.languages.registerCompletionItemProvider(
        'uxml',
        uxmlCompletionProvider,
        '<',
        ' ',
        '"',
        "'"
      )
    );
  }

  // Register commands
  const disposable = vscode.commands.registerCommand(
    'unityUIToolkit.validateUSS',
    () => {
      vscode.window.showInformationMessage(
        'Unity UI Toolkit: USS validation triggered!'
      );
    }
  );
  context.subscriptions.push(disposable);

  // Watch for configuration changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration('unityUIToolkit')) {
        vscode.window.showInformationMessage(
          'Unity UI Toolkit configuration changed. Please reload the window for changes to take effect.'
        );
      }
    })
  );
}

export function deactivate() {
  console.log('Unity UI Toolkit extension is now deactivated!');
}
