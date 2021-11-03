import vue from '@vitejs/plugin-vue'
import ssr from 'vite-plugin-ssr/plugin'
import { UserConfig } from 'vite'
import path from 'path'
import vueJsx from 'vite-plugin-ts';
import styleImport from 'vite-plugin-style-import';
import WindiCSS from 'vite-plugin-windicss'
import vueI18n from '@intlify/vite-plugin-vue-i18n'

const isProd = process.env.NODE_ENV === 'production'

const config: UserConfig = {
  resolve: {
    alias: {
      '~': path.resolve(__dirname),
      '@': path.resolve(__dirname),
    }
  },
  logLevel: ['info', 'warn', 'error'].includes(process.env.DEBUG_LEVEL) ? process.env.DEBUG_LEVEL : 'info',
  plugins: [
    WindiCSS({
      scan: {
        // By default only `src/` is scanned
        dirs: ["pages", "layouts", "components"],
        // We only have to specify the file extensions we actually use.
        fileExtensions: ["vue", "js", "ts", "jsx", "tsx", "html", "pug"]
      },
      safelist: [],
      
    }),
    styleImport({
      libs: [
        // {
        //   libraryName: 'ant-design-vue',
        //   esModule: true,
        //   resolveStyle: (name) => {
        //     return `ant-design-vue/es/${name}/style/css`;
        //   },
        // },
      ],
    }),
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => !!['wc-', 'ce-'].filter(i => tag.startsWith(i)).length
        }
      }
    }),
    vueJsx(),
    vueI18n({
      // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
      // compositionOnly: false,

      // you need to set i18n resource including paths !
      include: path.resolve(__dirname, './locales/**')
    }),

    ssr()]
}

export default config
