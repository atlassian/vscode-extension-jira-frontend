'use strict';

const assert = require('assert')

const { importsColors, extractColorsUsage } = require('../atlaskit-color-highlight/colors')

suite('IMPORT_REGEX', () => {
    test('should recognize import colors', () => {
        const line = "import { colors } from '@atlaskit/theme';"
        assert.equal(importsColors(line), true);
    })

    test('should recognize import multiple variables', () => {
        const line = "import { colors, typography } from '@atlaskit/theme';"
        assert.equal(importsColors(line), true);
    })

    test('should recognize default import with colors', () => {
        const line = "import theme, { colors } from '@atlaskit/theme';"
        assert.equal(importsColors(line), true);
    })

    test('should recognize default import with multiple variables', () => {
        const line = "import theme, { colors, typography } from '@atlaskit/theme';"
        assert.equal(importsColors(line), true);
    })

    test('should not recognize import variables without colors', () => {
        const line = "import { typography, gridUnit } from '@atlaskit/theme';"
        assert.equal(importsColors(line), false);
    })

    test('should not recognize default import without colors', () => {
        const line = "import theme from '@atlaskit/theme';"
        assert.equal(importsColors(line), false);
    })
})

suite('extractColorsUsage', () => {

    test('should return empty array when line does not use colors.', () => {
        const line = '    border-radius: ${fieldBorderRadius};'
        assert.deepStrictEqual(extractColorsUsage(line, {}), [])
    })

    test('should return match for single usage', () => {
        const line = '    background: ${colors.N30};'
        assert.deepStrictEqual(extractColorsUsage(line, { 'N30': '#bada55' }), [{
            color: 'colors.N30',
            "cssColor": "#bada55",
            startIndex: 18,
        }])
    })

    test('should return match for multiple uses', () => {
        const line = '    box-shadow: 0 1px 1px ${colors.N50A}, 0 0 1px ${colors.N30A};'
        assert.deepStrictEqual(extractColorsUsage(line, { 'N50A': '#bada55', 'N30A': 'green' }), [{
            color: 'colors.N50A',
            "cssColor": "#bada55",
            startIndex: 28,
        }, {
            color: 'colors.N30A',
            "cssColor": "green",
            startIndex: 52,
        }])
    })

})
