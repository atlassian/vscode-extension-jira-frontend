/*
 * Abstracting away the create / enable / disable / delete differences of the vanilla TextEditorDecoration.
 */

'use strict';

const {
    window,
    Range,
    Position
} = require('vscode');

const { generateOptimalTextColor } = require('./colors')

module.exports = class Decoration {

    constructor(editor, colorsUsage, lineIndex) {

        this._editor = editor

        this._decoration = window.createTextEditorDecorationType({
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: colorsUsage.cssColor,
            backgroundColor: colorsUsage.cssColor,
            color: generateOptimalTextColor(colorsUsage.cssColor)
        });


        const startPosition = new Position(lineIndex, colorsUsage.startIndex)
        const endPosition = new Position(lineIndex, colorsUsage.startIndex + colorsUsage.color.length)
        this._decorationOptions = {
            range: new Range(startPosition, endPosition),
            hoverMessage: colorsUsage.cssColor,
        }
        
        this.enable()
    }

    enable() {
        this._editor.setDecorations(this._decoration, [this._decorationOptions])
    }

    disable() {
        // https://github.com/Microsoft/vscode-extension-samples/issues/22#issuecomment-321555992
        this._editor.setDecorations(this._decoration, [])
    }

    delete() {
        this._decoration.dispose()
    }

}
