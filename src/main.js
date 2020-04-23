import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase/app'
import swal from 'sweetalert'
import 'firebase/auth'
import 'firebase/performance'
import 'firebase/remote-config'
import 'firebase/analytics'
import "minireset.css"
import './assets/main.scss'
Vue.config.productionTip = false
const firebaseConfig = {
  apiKey: "AIzaSyCvP2O35KnfzOghBF6Ou3bQcD6xCkmeLb0",
  authDomain: "hyphen-hacks-2020.firebaseapp.com",
  databaseURL: "https://hyphen-hacks-2020.firebaseio.com",
  projectId: "hyphen-hacks-2020",
  storageBucket: "hyphen-hacks-2020.appspot.com",
  messagingSenderId: "288103005258",
  appId: "1:288103005258:web:88f64fd5cb72b58a4c3ab3",
  measurementId: "G-3Z3EE1JHKC"
};
firebase.initializeApp(firebaseConfig)
Vue.prototype.$firebase = firebase
Vue.prototype.$swal = swal
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
