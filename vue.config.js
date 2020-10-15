// vue.config.js
module.exports = {
    // 选项...
    publicPath:"/",
    pages:{
        // index: {
        //     // page 的入口
        //     entry: 'src/main.js',
        //     // 模板来源
        //     template: 'public/index.html',
        //     // 在 dist/index.html 的输出
        //     filename: 'index.html',
        //     // 当使用 title 选项时，
        //     // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
        //     title: 'Index Page',
        //     // 在这个页面中包含的块，默认情况下会包含
        //     // 提取出来的通用 chunk 和 vendor chunk。
        //     //chunks: ['chunk-vendors', 'chunk-common', 'index']
        //   },
          login: {
            // page 的入口
            entry: 'src/views/login/index.js',
            // 模板来源
            template: 'public/index.html',
            // 在 dist/index.html 的输出
            filename: 'login.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'Login', 
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            //chunks: ['chunk-vendors', 'chunk-common', 'index']
          },
          firstsetting: {
            // page 的入口
            entry: 'src/views/login/firstsetting.js',
            // 模板来源
            template: 'public/index.html',
            // 在 dist/index.html 的输出
            filename: 'firstsetting.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'FirstSetting',
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            //chunks: ['chunk-vendors', 'chunk-common', 'index']
          },
          main: {
            // page 的入口
            entry: 'src/views/main/main.js',
            // 模板来源
            template: 'public/index.html',
            // 在 dist/index.html 的输出
            filename: 'main.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'Main',
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            //chunks: ['chunk-vendors', 'chunk-common', 'index']
          },
          translate: {
            // page 的入口
            entry: 'src/views/tool/translate.js',
            // 模板来源
            template: 'public/index.html',
            // 在 dist/index.html 的输出
            filename: 'translate.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'translate',
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            //chunks: ['chunk-vendors', 'chunk-common', 'index']
          },
          crypto: {
            // page 的入口
            entry: 'src/views/tool/crypto.js',
            // 模板来源
            template: 'public/index.html',
            // 在 dist/index.html 的输出
            filename: 'crypto.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'crypto',
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            //chunks: ['chunk-vendors', 'chunk-common', 'index']
          },
          piclinks: {
            // page 的入口
            entry: 'src/views/tool/piclinks.js',
            // 模板来源
            template: 'public/index.html',
            // 在 dist/index.html 的输出
            filename: 'piclinks.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'piclinks',
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            //chunks: ['chunk-vendors', 'chunk-common', 'index']
          },
    }
  }