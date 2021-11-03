import { createPinia } from 'pinia'

export default {
  install(app: any) {
    app.use(createPinia())
  },
};
