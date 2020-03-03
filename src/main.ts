import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify'
import VueSuggestion from 'vue-suggestion'

Vue.config.productionTip = false

Vue.use(VueSuggestion)

new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
