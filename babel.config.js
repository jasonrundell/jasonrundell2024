module.exports = {
  presets: [
    [
      'next/babel',
      {
        'preset-react': {
          runtime: 'classic',
        },
      },
    ],
    '@emotion/babel-preset-css-prop',
  ],
}
