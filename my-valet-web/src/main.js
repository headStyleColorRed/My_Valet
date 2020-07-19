import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
	if (!store.getters.logged && to.name != "Login") {
		next("/login")
	} else if (store.getters.logged && to.name == "Login") {
		next("/")
	} else {
		next()
	}
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
