import Vue from 'vue'
import App from './app/App.vue'
import router from './app/router'
import store from './app/store'
import VueTippy from 'vue-tippy'
import Vuetify from 'vuetify'

Vue.config.productionTip = false

Vue.use(Vuetify)

Vue.use(VueTippy)

new Vue({
  router,
  store,
  vuetify: new Vuetify(),
  render: h => h(App)
}).$mount('#app')
