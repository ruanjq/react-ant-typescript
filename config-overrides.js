/**
 * antd 默认支持基于 ES module 的 tree shaking，js 代码部分不使用这个插件也会有按需加载的效果。
 * babel-plugin-import 是一个用于按需加载组件代码和样式的 babel 插件（原理），现在我们尝试安装它并修改 config-overrides.js 文件。
 */

const {
    override,
    fixBabelImports,
    addLessLoader,
    addWebpackResolve,
    addWebpackAlias
} = require('customize-cra');


// const rewireReactHotLoader = require('react-app-rewire-hot-loader');

const entrys =  {
    'main': './src/index.tsx',
    // 'pace':'./src/modules/pace/pace.js'
  }

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({
        javascriptEnabled:true,
        modifyVars:{ 
            // '@primary-color': '#1DA57A' 
        }
    }),
    addWebpackResolve({
        extensions:[".tsx",".jsx",".js",".ts",".less",".json",".svg",".css",]
    }),
    // (config, env) => {
    //     // config = rewireReactHotLoader(config, env);
    //     // config.entry = entrys;
    //     return config;
    // },
    // addWebpackAlias({        
    //     ["react-dom"]: "@hot-loader/react-dom"
    // })
);