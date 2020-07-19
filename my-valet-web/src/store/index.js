import Vue from 'vue'
import Vuex from 'vuex'
import  authModule from "./auth.js"

import VuexPersist from 'vuex-persist'

const vuexPersist = new VuexPersist({
  key: 'starting-up',
  storage: localStorage
})

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
	  language: "es"
  },
  mutations: {
	  setLanguage(state, language) {
		  state.language = language
	  }
  },
  actions: {
	language: (state) => {
		return state.language;
	},
  },
  modules: {
	  authModule
  },
  plugins: [vuexPersist.plugin],
})
