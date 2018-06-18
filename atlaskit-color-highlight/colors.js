/*
 * Color detection and utilities
 */

'use strict';

const {
    workspace,
} = require('vscode');

const {
    getInstalledPathSync
} = require('get-installed-path')

let atlaskitColors = null

const Color = require('color');

const IMPORT_REGEX = /import ([a-zA-Z0-9]*)[, ]*{([\S ]+)colors([\S ]+)} from '@atlaskit\/theme';/;

const importsColors = text => IMPORT_REGEX.test(text)

const COLORS_REGEX = /colors\.[a-zA-Z0-9]+/g;

/**
 * Attempt to load the @atlaskit/theme package
 * so that we can read the colors directly from it instead of hardcoding here
 */
function loadAtlaskitColors() {
    if (atlaskitColors) { return atlaskitColors }
    // require from the project workspace! this extension does not have @atlaskit/theme bundled
    const atlaskitThemePath = getInstalledPathSync('@atlaskit/theme', {
        local: true,
        // !!! Uses first workspace !!! this may break with multiple. Let's assume nobody uses that ¯\_(ツ)_/¯
        cwd: workspace.workspaceFolders[0].uri.path
    })
    // this may throw and if it throws it displays a bubble in VSCode so that users can report the bug!
    const atlaskitTheme = require(atlaskitThemePath)
    atlaskitColors = atlaskitTheme.colors
    return atlaskitColors
}

const atlaskitColorToCssColor = (akColors, atlaskitColorAsString) => {
    const withoutPrefix = atlaskitColorAsString.replace(/^colors\./, '')
    return akColors[withoutPrefix]
}

const extractColorsUsage = (line, akColors = loadAtlaskitColors()) => {
    const colors = []
    let match = null
    while ((match = COLORS_REGEX.exec(line)) !== null) {
        const color = match[0]
        colors.push({
            color,
            cssColor: atlaskitColorToCssColor(akColors, color),
            startIndex: match.index,
        })
    }
    return colors
}

const WHITE = '#FFFFFF';
const BLACK = '#000000';

function generateOptimalTextColor(colorAsString) {
    const color = Color(colorAsString)
    if (color.isLight()) {
        return BLACK;
    } else {
        return WHITE;
    }
}

exports.importsColors = importsColors
exports.extractColorsUsage = extractColorsUsage
exports.generateOptimalTextColor = generateOptimalTextColor
