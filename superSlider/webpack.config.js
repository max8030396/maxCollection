const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
let PUBLIC_PATH;
let SERVER_PORT;

let initProject = {
  openPage: 'index',
  pages: ['index']
  // pages: ['bot', 'botBasicHistory', 'botBasicCurrent']
};

let cleanFolderInit = {
  target: [
    'build',
    'dist'
  ],
  options: {
    root: path.resolve('./'),
    verbose: true
    // exclude: ['*.html']
  }
};

module.exports = (env, argv) => {
  // PUBLIC_PATH = argv.mode === 'production' ? `./` : `/`;
  // 正式打包用
  PUBLIC_PATH = argv.mode === 'production' ? `/static/` : `/`;
  SERVER_PORT = argv.mode === 'production' ? 8000 : 3000;

  let baseConfig = {
    entry: {},
    // 輸出位置
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'js/[name].js',
      sourceMapFilename: '[file].map',
      publicPath: PUBLIC_PATH,
    },
  
    // 模組Loader設定
    module: {
      rules: [
        {
          //Eslint-Loader
          enforce: 'pre',
          test: /\.js$/,
          // 忽略的目錄名稱
          exclude: /(node_modules)/,
          loader: 'eslint-loader',
          options: {
            emitError: true
          }
        },
        {
          //Babel-Loader
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-transform-runtime'
              ]
            }
          },
        },
        {
          test: /\.pug$/,
          exclude: /(node_modules)/,
          use: [{
            loader: 'pug-loader',
            options: {
              self: true,
              pretty: true,
             },
          }]
        },
        {
          // Sass-loader + css-loader
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                url: false,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: false,
                data: () => `$BaseUrl: '${PUBLIC_PATH}';`,
                // Sass變數取代 類似String-replace-loader
                // sassOptions: {
                //   data: () => `$BaseUrl: '${PUBLIC_PATH}';`,
                //   // includePaths: [
                //   //   './resources/sass/mixin',
                //   // ],
                // },
              },
            },
          ]
        },
        {
          test: /\.(png|jpg|gif|jpe?g|svg)$/,
          use: [
            {
              // 圖片做壓縮
              loader: 'image-webpack-loader',
              options: {
                bypassOnDebug: true,
              }
            }
          ]
        }
      ],
      
      // 不用丟到webpack解析與處理的模組，節省處理時間
      noParse: [
        /jquery/
      ]
    },
  
    // 套件設定
    plugins: [
      // 清除指定資料夾
      new CleanWebpackPlugin(
        cleanFolderInit.target,
        cleanFolderInit.options
      ),
  
      // 拷貝複製資料夾
      new CopyWebpackPlugin([
        {
          from: './resources/images/',
          to: './images/',
          force: true
        }
      ]),
  
      // 產生獨立css檔案並匯入html
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        chunkFilename: '[id].css'
      }),
  
      // new HtmlWebpackPlugin({
      //   chunks: ['bot'],
      //   filename: 'bot.html',
      //   template: path.resolve(__dirname, './resources/pug/bot.pug'),
      //   data: {
      //     topper: require('./resources/words/common/topper.json'),
      //     base: require('./resources/words/bot.json'),
      //     footer: require('./resources/words/common/footer.json'),
      //   },
      //   inject: true
      // })
    ],
  
    // 開發模式是否產生source-map
    // devtool: 'source-map',
  
    // dev模式設定
    devServer: {
      overlay: {
        warnings: true,
        errors: true
      },
      // 是否開啟https模式
      https: false,
      // 是否產生實體檔案到disk目錄
      writeToDisk: false,
      open: true,
      openPage: `${initProject.openPage}.html`,
      compress: true,
      watchContentBase: true,
      contentBase: path.join(__dirname, './resources/'),
      port: SERVER_PORT,
      disableHostCheck: true
    }
  }
  
  // 產生所有頁面與載入所需資料
  initProject.pages.map(function(proName) {
    baseConfig.entry[`${proName}`] = path.resolve(__dirname, `./resources/js/${proName}.js`);
  
    baseConfig.plugins.push(
      new HtmlWebpackPlugin({
        chunks: [`${proName}`],
        filename: `${proName}.html`,
        template: path.resolve(__dirname, `./resources/pug/${proName}.pug`),
        // data: {
          // css: `<link href="${$BASE_URL}css/${proName}.css" rel="stylesheet"></link>`,
          // js: `<script type="text/javascript" src="${$BASE_URL}js/${proName}.js"></script>`,
          // topper: require(`./resources/words/common/topper.json`),
          // base: require(`./resources/words/${proName}.json`),
          // footer: require(`./resources/words/common/footer.json`),
        // },
        inject: true
      })
    );
  });

  return baseConfig;
}