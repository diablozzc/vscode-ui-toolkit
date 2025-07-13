import * as vscode from 'vscode';
import { USSValidationProvider } from './providers/ussValidationProvider';
import { UXMLDefinitionProvider } from './providers/uxmlDefinitionProvider';
import { USSCrossFileDefinitionProvider } from './providers/ussDefinitionProvider';
import { USSHoverProvider } from './providers/ussHoverProvider';
import { USSCompletionProvider } from './providers/ussCompletionProvider';
import { UXMLCompletionProvider } from './providers/uxmlCompletionProvider';
import { USSCodeActionProvider } from './providers/ussCodeActionProvider';

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

    // Register USS code action provider for fixes
    const ussCodeActionProvider = new USSCodeActionProvider();
    context.subscriptions.push(
      vscode.languages.registerCodeActionsProvider(
        'uss',
        ussCodeActionProvider,
        {
          providedCodeActionKinds: [vscode.CodeActionKind.QuickFix]
        }
      )
    );
  }

  // Register commands
  const validateCommand = vscode.commands.registerCommand(
    'unityUIToolkit.validateUSS',
    () => {
      vscode.window.showInformationMessage(
        'Unity UI Toolkit: USS validation triggered!'
      );
    }
  );
  context.subscriptions.push(validateCommand);

  // Register fix all USS issues command
  const fixAllCommand = vscode.commands.registerCommand(
    'unityUIToolkit.fixAllUSSIssues',
    async () => {
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor || activeEditor.document.languageId !== 'uss') {
        vscode.window.showErrorMessage('请在USS文件中使用此命令');
        return;
      }

      const codeActionProvider = new USSCodeActionProvider();
      const fixAllAction = codeActionProvider['createFixAllIssuesAction'](activeEditor.document);
      
      if (fixAllAction && fixAllAction.edit) {
        const success = await vscode.workspace.applyEdit(fixAllAction.edit);
        if (success) {
          vscode.window.showInformationMessage('USS兼容性问题已修复');
        } else {
          vscode.window.showErrorMessage('修复失败');
        }
      } else {
        vscode.window.showInformationMessage('未发现需要修复的USS兼容性问题');
      }
    }
  );
  context.subscriptions.push(fixAllCommand);

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
