import { defineStore } from "pinia";


export const useAlertStore = defineStore('alert', {
  state: () => {
    return {
      loading: false,
      success: '',
      error: '',
      link: '',
      linkLabel: '',
    }
  },
  actions: {
    setLink(link: string, linkLabel: string) {
      this.link = link
      this.linkLabel = linkLabel
    },
    async setSuccess(msg: string) {
      this.success = msg
      this.error = ''
    },
    async setError(msg: string) {
      this.error = msg
      this.success = ''
    },
    async clear() {
      this.clearError()
      this.success = ''
    },
    async clearError() {
      this.error = ''
      this.link = ''
      this.linkLabel = ''
    }
  }
});
