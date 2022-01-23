// webpack requires a 'require' here, which seems reasonable as it's,
// you know, the thing that provides import to begin with:
//
// SyntaxError: Cannot use import statement outside a module
{%- if cookiecutter.asana_api == 'yes' %}
const webpack = require('webpack'); // eslint-disable-line @typescript-eslint/no-var-requires
{%- endif %}
const CopyPlugin = require('copy-webpack-plugin'); // eslint-disable-line @typescript-eslint/no-var-requires

module.exports = {
  entry: {
    background: ['./src/background.ts'],
{%- if cookiecutter.chrome_extension_options == 'yes' %}
    options: ['./src/options.ts'],
{%- endif %}
  },
  // https://webpack.js.org/guides/typescript/
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  // without this, I can't satisfy emacs TIDE's need for import lines to exclude
  // the .ts suffix, as it calls into tsc without webpack preprocessing.
  //
  // https://stackoverflow.com/questions/43595555/webpack-cant-resolve-typescript-modules
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  mode: 'development', // override with webpack --mode=production on CLI builds
  output: {
    filename: '[name].js',
  },
  // 'inline-source-map' is suggested by https://webpack.js.org/guides/typescript/
  // 'cheap-module-source-map' is suggested by https://stackoverflow.com/questions/48047150/chrome-extension-compiled-by-webpack-throws-unsafe-eval-error
  devtool: 'cheap-module-source-map',
  plugins: [
{%- if cookiecutter.asana_api == 'yes' %}
    // node-asana uses process.nextTick, which this provides:
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    // The node-util polyfill looks up 'process.env.NODE_DEBUG' to
    // toggle debugging without checking for process.env existing.
    //
    // The node-process polyfill doesn't provide process.env at all.
    //
    // There's no note of this on the webpack page recommending
    // node polyfills.
    //
    // https://github.com/browserify/node-util/issues/43
    new webpack.DefinePlugin({
      process: {
        env: '{}',
      },
    }),
{%- endif %}
    new CopyPlugin({
      patterns: [{ from: 'static' }],
    }),
  ],
};
