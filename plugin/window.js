import Vue from 'vue'

Vue.use({
  install(Vue) {
    const $window = Vue.observable({
      width: 0,
      height: 0
    })

    if (process.browser) {
      const onResize = () => {
        $window.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        $window.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      }
      global.addEventListener('resize', onResize)
      onResize()
    }

    Vue.prototype.$window = $window
  }
})
