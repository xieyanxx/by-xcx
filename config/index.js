import { defineConfig } from '@tarojs/cli'
import fs from 'fs-extra'
import path from 'path'
import devConfig from './dev'
import prodConfig from './prod'

const PROJECT_NAME = 'template';

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig(async (merge, { command, mode }) => {
  const baseConfig = {
    projectName: PROJECT_NAME,
    date: '2024-8-15',
    env: '',
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      828: 1.81 / 2,
      375: 2 / 1,
    },
    designWidth: 375,
    sourceRoot: 'src',
    outputRoot: 'dist',
    defineConstants: {
      // LOCAL_DEBUG: process.env.NODE_ENV === 'development',
      // DEBUG_ENV: JSON.stringify(process.env.NODE_ENV === 'development' ? 'TEST' : 'No_Exist'),
      // isH5: process.env.TARO_ENV === 'h5',
    },
    alias: { '@': path.resolve(__dirname, '..', 'src') },
    copy: {
      patterns: [
      ],
      options: {
      }
    },
    framework: 'react',
    compiler: {
      type: 'webpack5',
      prebundle: {
        exclude: ['taro-ui']
      }
    },
    // compiler: 'webpack5',
    cache: {
      enable: false // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {

          }
        },
        url: {
          enable: true,
          config: {
            limit: 100 // 设定转换尺寸上限
          }
        },
        cssModules: {
          enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },
      webpackChain(chain) {
        if (fs.existsSync(path.resolve(__dirname, '../FinClipConf.js'))) {
          chain.plugin('copyRootConfig')
            .use(require('copy-webpack-plugin'), [{ patterns: [{ from: 'FinClipConf.js', noErrorOnMissing: true }] }])
        }
      }
    },
    h5: {
      esnextModules: ['taro-ui'],
      publicPath: '/',
      staticDirectory: 'static',
      output: {
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].[chunkhash:8].js'
      },
      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css'
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },
      webpackChain(chain) {

      }
    },
    rn: {
      appName: PROJECT_NAME,
      postcss: {
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        }
      }
    }
  }
  if (process.env.NODE_ENV === 'development') {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig)
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig)
})
