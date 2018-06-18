/*
 * This file contains VSCode extension lifecycle hooks and stitches the whole thing together.
 */

'use strict';

// populated in function readConfiguration()
const config = {}

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const {
    window,
    workspace,
} = require('vscode');

const {
    importsColors,
    extractColorsUsage,
} = require('./colors')

const Decoration = require('./decoration')

const extension = {
    usesColors: false, // if (file imports {colors} from @atlaskit/theme) => true, else false
    editor: window.activeTextEditor, // TextEditor
    currentSelection: [], // number[] array of lines
    decorations: new Map(), // Map<lineIndex: number, decoration: Decoration>
    lineCount: 0,
}

/**
 * Colorize all visible text editors. Use when initializing the extension
 */
function colorizeVisibleTextEditors() {
    window.visibleTextEditors.forEach(colorize)
}

/**
 * 
 * @param {TextDocument} document 
 * @return {boolean} true if supported
 */
function canColorize(document) {
    return document.languageId === 'javascript' && document.fileName.endsWith('.js')
}

/**
 * @param {TextEditor} editor 
 * @param {number} lineIndex
 * @return {function} iterator over extracted color usages
 */
const highlight = (editor, lineIndex) => colorsUsage => {
    const decoration = new Decoration(editor, colorsUsage, lineIndex)
    updateDecorationMap(extension.decorations, lineIndex, decoration)
}

/**
 * Set or concat the decorations array
 * @param {Map<number, Decoration[]>} map 
 * @param {number} line 
 * @param {Decoration} decoration 
 */
function updateDecorationMap(map, line, decoration) {
    if (map.has(line)) {
        map.set(line, map.get(line).concat([decoration]));
    } else {
        map.set(line, [decoration]);
    }
}

/**
 * Initialize and decorate single text editor
 * @param {TextEditor} editor 
 */
function colorize(editor) {
    if (!editor || !canColorize(editor.document)) {
        return
    }
    extension.editor = editor
    extension.currentSelection = editor.selections.map(selection => selection.active.line)
    extension.lineCount = editor.document.lineCount
    // TODO cache here?
    extension.decorations.clear()
    const text = editor.document.getText()
    const fileLines = text.split(/\n/)
    extension.usesColors = false
    // let's assume that imports are at the beginning of a file
    let lineIndex = 0
    for (; lineIndex < fileLines.length; lineIndex++) {
        if (importsColors(fileLines[lineIndex])) {
            extension.usesColors = true
            break
        }
    }

    if (!extension.usesColors) {
        // this file does not import colors from @atlaskit/theme => nothing to do here
        return
    }

    // let's assume that usage of colors.* _always comes after import_
    extractColors(editor, lineIndex, fileLines.length)

}

/**
 * Extract all colors between two lines and add all decorations
 * @param {TextEditor} editor
 * @param {number} firstLine
 * @param {number} lastLine
 */
function extractColors(editor, firstLine, lastLine) {
    const lines = editor.document.getText().split(/\n/)
    for (let i = firstLine; i <= lastLine; i++) {
        const extracted = extractColorsUsage(lines[i])
        extracted.forEach(highlight(editor, i))
    }
}

function handleChangeActiveTextEditor(editor) {
    colorize(editor)
}

/**
 * 
 * @param {TextEditorSelectionChangeEvent} event 
 */
function handleTextSelectionChange(event) {
    if (!config.isHideCurrentLineDecorations || event.textEditor !== extension.editor) {
        return
    }

    // enable everything that was disabled before
    extension.currentSelection.forEach(line => {
        const decorations = extension.decorations.get(line)
        if (decorations) {
            decorations.forEach(_ => _.enable())
        }
    })

    // disable decorations on active lines so that user can better see what they're typing
    const selectedLines = event.selections.map(_ => _.active.line);
    selectedLines.forEach(line => {
        let decoration
        // disable decoration on selected line
        if (decoration = extension.decorations.get(line)) {
            // this is an array because there can be multiple decorations on single line
            decoration.forEach(_ => {
                _.disable()
            })
        }
    })

    // save selected lines so that we can re-enable the disabled decorations later
    extension.currentSelection = selectedLines
}

/**
 * 
 * @param {TextDocumentContentChangeEvent[]} contentChanges 
 */
function updateDecorations(contentChanges) {
    contentChanges.forEach(change /* : TextDocumentContentChangeEvent */ => {

        // first remove all decorations on changed lines
        // _remove_, not disable! the text may have changed so the decorations may no longer apply
        const startLine = change.range.start.line
        let endLine = change.range.end.line
        for (let i = startLine; i <= endLine; i++) {
            if (extension.decorations.has(i)) {
                extension.decorations.get(i).forEach(_ => _.delete())
                extension.decorations.set(i, [])
            }
        }

        // now regenerate all decorations on changed lines
        const addedNewlinesMatch = change.text.match(/\n/g)
        if (addedNewlinesMatch) {
            // if multiple new lines have been added (paste, or undo, ...) VSCode reports startLine === endLine
            // which is not we want.
            // We want to add the count of added lines so that extractColors() finds colors.* usage in those added lines too
            endLine += addedNewlinesMatch.length
        }
        extractColors(extension.editor, startLine, endLine)

    })
}

/**
 * 
 * @param {TextDocumentChangeEvent} event 
 */
function handleChangeTextDocument(event) {
    if (extension.editor && event.document.fileName === extension.editor.document.fileName) {
        extension.editor = window.activeTextEditor
        updateDecorations(event.contentChanges, extension)
    }
}

function handleConfigurationChanged() {
    readConfiguration()
    clear()
    colorizeVisibleTextEditors()
}

function clear() {
    extension.decorations.clear()
    extension.currentSelection.length = 0
    extension.disabledDecorations.length = 0
    extension.editor = null
}

function readConfiguration() {
    // not configurable until somebody asks for it
    config.isHideCurrentLineDecorations = true
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // This code will only be executed once when your extension is activated
    readConfiguration()
    initEventListeners(context)
    colorizeVisibleTextEditors()
}

function initEventListeners(context) {
    window.onDidChangeTextEditorSelection(handleTextSelectionChange, null, context.subscriptions);
    // workspace.onDidCloseTextDocument(handleCloseOpen, null, context.subscriptions);
    // workspace.onDidSaveTextDocument(handleCloseOpen, null, context.subscriptions);
    window.onDidChangeActiveTextEditor(handleChangeActiveTextEditor, null, context.subscriptions);
    workspace.onDidChangeTextDocument(handleChangeTextDocument, null, context.subscriptions);
    workspace.onDidChangeConfiguration(handleConfigurationChanged, null, context.subscriptions);
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;
