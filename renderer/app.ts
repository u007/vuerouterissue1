import { createSSRApp, defineComponent, h } from 'vue'

import DefaultLayout from '~/layouts/default.vue'
// import MemberLayout from '~/layouts/member.vue'
import ContentLayout from '~/layouts/content.vue'
// import PageWrapper from './PageWrapper.vue'
import { setPageContext } from './usePageContext'
import type { PageContext } from './types'

export { createApp }
import 'virtual:windi.css'
import '../assets/main.scss';
import bootstrap from '~/bootstrap'

function createApp(pageContext: PageContext) {
  const { Page, pageProps, documentProps } = pageContext
  const layout = documentProps?.layout || 'default'

  const PageWithLayout = defineComponent({
    render() {
      let renderComponent = null
      switch(layout) {
        // case 'member':
        //   renderComponent = MemberLayout
        //   break
        case 'content':
          renderComponent = ContentLayout
          break
        case 'default':
          renderComponent = DefaultLayout
          break
        default:
          throw new Error(`Layout missing ${layout}`)
      }

      return h(
        renderComponent,
        { _documentProps: documentProps },
        {
          default() {
            return h(Page, pageProps || {})
          }
        }
      )
    }
  })

  const app = createSSRApp(PageWithLayout)
  app.use(bootstrap);
  // Make `pageContext` available from any Vue component
  setPageContext(app, pageContext)

  return app
}
