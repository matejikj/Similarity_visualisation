import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify'
import VueTippy from 'vue-tippy'

Vue.config.productionTip = false

Vue.use(VueTippy)

new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
