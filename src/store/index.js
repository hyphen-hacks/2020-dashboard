import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: false,
    token: false,
    api: "https://2020.hyphen-hacks.com",
    applications: []
  },
  getters: {
    applications(state) {
      return state.applications
    },
    applicationsObject(state) {
      let result = {}
      state.applications.forEach(app => {
        result[app["_id"]] = app
      })
      return result
    },
    user(state) {
      return state.user
    },
    token(state) {
      return state.token
    },
    api(state) {
      if (window.location.hostname == "localhost") {
        return "http://localhost:3005"
      }
      return state.api
    }
  },
  mutations: {
    user(state, user) {
      state.user = user
    },
    token(state, token) {
      state.token = token
    },
    applications(state, apps) {
      state.applications = apps
    }
  },
  actions: {
  },
  modules: {
  }
})
