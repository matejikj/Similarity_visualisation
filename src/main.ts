import Vue from 'vue'
import App from './app/App.vue'
import router from './app/router'
import store from './app/store'
import VueTippy from 'vue-tippy'
import Vuetify from 'vuetify/lib'

Vue.config.productionTip = false
Vue.config.performance = true
Vue.use(VueTippy)
Vue.use(Vuetify)

new Vue({
  router,
  store,
  vuetify: new Vuetify(),
  render: h => h(App)
}).$mount('#app')
