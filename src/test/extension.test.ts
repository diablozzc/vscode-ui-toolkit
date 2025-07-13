import * as assert from 'assert';
import * as vscode from 'vscode';
import { UXMLParser } from '../parsers/uxmlParser';
import { USSParser } from '../parsers/ussParser';
import { isValidUSSProperty, getUSSPropertyInfo } from '../data/ussProperties';

// Declare global test functions for Mocha TDD interface
declare function suite(name: string, fn: () => void): void;
declare function test(name: string, fn: () => void): void;

suite('Unity UI Toolkit Extension Test Suite', function () {
  vscode.window.showInformationMessage('Start all tests.');

  suite('UXML Parser Tests', function () {
    test('Should parse class references correctly', () => {
      const mockDocument = {
        getText: () =>
          '<ui:Button class="submit-button primary-btn" text="Click me" />',
        lineAt: (_line: number) => ({
          text: '<ui:Button class="submit-button primary-btn" text="Click me" />',
        }),
        positionAt: (offset: number) => new vscode.Position(0, offset),
      } as any;

      const classRefs = UXMLParser.parseClassReferences(mockDocument);

      assert.strictEqual(classRefs.length, 2);
      assert.strictEqual(classRefs[0].className, 'submit-button');
      assert.strictEqual(classRefs[1].className, 'primary-btn');
    });

    test('Should detect position in class attribute', () => {
      const mockDocument = {
        lineAt: (_line: number) => ({
          text: '<ui:Button class="submit-button" />',
        }),
      } as any;

      const position = new vscode.Position(0, 20); // Inside class attribute
      const isInClass = UXMLParser.isPositionInClassAttribute(
        mockDocument,
        position
      );

      assert.strictEqual(isInClass, true);
    });

    test('Should parse Unity elements correctly', () => {
      const mockDocument = {
        getText: () => '<ui:Button /><ui:Label /><ui:CustomElement />',
        lineAt: (_line: number) => ({
          text: '<ui:Button /><ui:Label /><ui:CustomElement />',
        }),
        positionAt: (offset: number) => new vscode.Position(0, offset),
      } as any;

      const elements = UXMLParser.getUnityElements(mockDocument);

      assert.ok(elements.includes('Button'));
      assert.ok(elements.includes('Label'));
      assert.ok(!elements.includes('CustomElement')); // Not a known Unity element
    });
  });

  suite('USS Parser Tests', function () {
    test('Should parse CSS rules correctly', () => {
      const mockDocument = {
        getText: () => '.button { color: red; background-color: blue; }',
        lineAt: (_line: number) => ({
          text: '.button { color: red; background-color: blue; }',
        }),
        positionAt: (offset: number) => new vscode.Position(0, offset),
        uri: vscode.Uri.file('/test.uss'),
      } as any;

      const rules = USSParser.parseDocument(mockDocument);

      assert.strictEqual(rules.length, 1);
      assert.strictEqual(rules[0].selector, '.button');
      assert.strictEqual(rules[0].properties.length, 2);
      assert.strictEqual(rules[0].properties[0].name, 'color');
      assert.strictEqual(rules[0].properties[0].value, 'red');
    });

    test('Should parse class selectors correctly', () => {
      const mockDocument = {
        getText: () => '.button, .primary-button { color: red; }',
        lineAt: (_line: number) => ({
          text: '.button, .primary-button { color: red; }',
        }),
        positionAt: (offset: number) => new vscode.Position(0, offset),
        uri: vscode.Uri.file('/test.uss'),
      } as any;

      const classNames = USSParser.getAllClassNames(mockDocument);

      assert.ok(classNames.includes('button'));
      assert.ok(classNames.includes('primary-button'));
    });

    test('Should validate USS syntax', () => {
      const mockDocument = {
        getText: () => '.button { color: red; } .unclosed { color: blue;',
        lineAt: (_line: number) => ({
          text: '.button { color: red; } .unclosed { color: blue;',
        }),
        positionAt: (offset: number) => new vscode.Position(0, offset),
        uri: vscode.Uri.file('/test.uss'),
      } as any;

      const diagnostics = USSParser.validateSyntax(mockDocument);

      assert.ok(diagnostics.length > 0);
      assert.ok(diagnostics.some((d) => d.message.includes('Unclosed brace')));
    });

    test('Should parse @import statements correctly', () => {
      const mockDocument = {
        getText: () => `@import "variables.uss";
@import 'components.uss';
@import url("theme.uss");
@import url('base.uss');
.button { color: red; }`,
        lineAt: (line: number) => {
          const lines = [
            '@import "variables.uss";',
            '@import \'components.uss\';',
            '@import url("theme.uss");',
            '@import url(\'base.uss\');',
            '.button { color: red; }'
          ];
          return { text: lines[line] || '' };
        },
        positionAt: (offset: number) => new vscode.Position(0, offset),
        uri: vscode.Uri.file('/test.uss'),
      } as any;

      const imports = USSParser.parseImports(mockDocument);

      assert.strictEqual(imports.length, 4);
      assert.strictEqual(imports[0].path, 'variables.uss');
      assert.strictEqual(imports[1].path, 'components.uss');
      assert.strictEqual(imports[2].path, 'theme.uss');
      assert.strictEqual(imports[3].path, 'base.uss');
    });

    test('Should find import at position', () => {
      const mockDocument = {
        getText: () => '@import "variables.uss";',
        lineAt: (_line: number) => ({
          text: '@import "variables.uss";',
        }),
        positionAt: (offset: number) => new vscode.Position(0, offset),
        uri: vscode.Uri.file('/test.uss'),
      } as any;

      // Position inside the import path
      const position = new vscode.Position(0, 12); // Inside "variables.uss"
      const importItem = USSParser.getImportAtPosition(mockDocument, position);

      assert.ok(importItem);
      assert.strictEqual(importItem.path, 'variables.uss');
    });

    test('Should resolve import paths correctly', () => {
      const currentUri = vscode.Uri.file('/project/styles/main.uss');
      
      // Test relative path
      const relativeResult = USSParser.resolveImportPath(currentUri, './variables.uss');
      assert.ok(relativeResult);
      assert.ok(relativeResult.path.includes('variables.uss'));
      
      // Test path without extension
      const noExtResult = USSParser.resolveImportPath(currentUri, 'base');
      assert.ok(noExtResult);
      assert.ok(noExtResult.path.includes('base.uss'));
    });
  });

  suite('USS Properties Data Tests', function () {
    test('Should validate known USS properties', () => {
      assert.strictEqual(isValidUSSProperty('width'), true);
      assert.strictEqual(isValidUSSProperty('height'), true);
      assert.strictEqual(isValidUSSProperty('-unity-font'), true);
      assert.strictEqual(isValidUSSProperty('invalid-property'), false);
    });

    test('Should provide property information', () => {
      const widthInfo = getUSSPropertyInfo('width');
      assert.ok(widthInfo);
      assert.strictEqual(widthInfo.syntax, '<length> | auto');
      assert.strictEqual(widthInfo.unitySpecific, false);

      const unityFontInfo = getUSSPropertyInfo('-unity-font');
      assert.ok(unityFontInfo);
      assert.strictEqual(unityFontInfo.unitySpecific, true);
    });

    test('Should validate property values', () => {
      const positionInfo = getUSSPropertyInfo('position');
      assert.ok(positionInfo);
      assert.ok(positionInfo.values);
      assert.ok(positionInfo.values.includes('absolute'));
      assert.ok(positionInfo.values.includes('relative'));
    });
  });

  suite('Integration Tests', function () {
    test('Should handle empty documents gracefully', () => {
      const emptyDocument = {
        getText: () => '',
        lineAt: (_line: number) => ({ text: '' }),
        positionAt: (_offset: number) => new vscode.Position(0, 0),
        uri: vscode.Uri.file('/empty.uss'),
      } as any;

      const uxmlClassRefs = UXMLParser.parseClassReferences(emptyDocument);
      const ussRules = USSParser.parseDocument(emptyDocument);

      assert.strictEqual(uxmlClassRefs.length, 0);
      assert.strictEqual(ussRules.length, 0);
    });

    test('Should handle malformed documents gracefully', () => {
      const malformedDocument = {
        getText: () => '<ui:Button class="incomplete',
        lineAt: (_line: number) => ({ text: '<ui:Button class="incomplete' }),
        positionAt: (offset: number) => new vscode.Position(0, offset),
        uri: vscode.Uri.file('/malformed.uxml'),
      } as any;

      // Should not throw errors
      assert.doesNotThrow(() => {
        UXMLParser.parseClassReferences(malformedDocument);
        UXMLParser.parseDocument(malformedDocument);
      });
    });
  });
});
