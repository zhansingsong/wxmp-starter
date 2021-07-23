// https://stylelint.io/user-guide/ignore-code
module.exports = {
  extends: ['stylelint-config-recommended', 'stylelint-config-property-sort-order-smacss'],
  plugins: ['stylelint-scss'],
  rules: {
    // 'prettier/prettier': true,
    'font-family-no-missing-generic-family-keyword': null,
    'at-rule-empty-line-before': null,
    'at-rule-no-unknown': null,
    'selector-pseudo-element-colon-notation': 'single',
    'scss/at-rule-no-unknown': true,
    'no-descending-specificity': null,
    'unicode-bom': 'never',
    'unit-no-unknown': [
      true,
      {
        ignoreUnits: ['rpx'],
      },
    ],
  },
};
