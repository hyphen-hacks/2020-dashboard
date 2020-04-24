<template>
  <div id="app">
    <div v-if="user && firebaseLoaded" class="app__container" id="app__container">
      <nav id="nav">
        <div class="brand">
          <img src="@/assets/logo.svg" alt="Hyphen-Hacks logo">
          <h1 class="heading">Hyphen-Hacks 2020</h1>
        </div>
        <router-link class="nav__link" :class="{active: $route.path == '/'}" to="/">Statistics</router-link>
        <router-link class="nav__link" :class="{active: $route.path == '/review'}" to="/review">Applications in review
          <span class="notification" v-if="$store.getters.applications.length > 0"><i class="fas fa-bell"></i>{{$store.getters.applications.length}}</span></router-link>
        <router-link class="nav__link" :class="{active: $route.path == '/mentors'}" to="/mentors">Mentors</router-link>
        <router-link class="nav__link" :class="{active: $route.path == '/attendees'}" to="/attendees">Attendees
        </router-link>
        <router-link class="nav__link" :class="{active: $route.path == '/volunteers'}" to="/volunteers">Volunteers
        </router-link>
        <router-link class="nav__link" :class="{active: $route.path == '/notifications'}" to="/notifications">
          Notifications
        </router-link>
        <router-link class="nav__link" :class="{active: $route.path == '/schedule'}" to="/schedule">Schedule
        </router-link>
        <div class="nav__user">
          <p class="bold">{{user.displayName}}</p>
          <p>{{user.email}}</p>
          <button @click="logOut" class="btn--dark">Logout</button>
        </div>
      </nav>
      <router-view/>
    </div>
    <div v-if="!user && firebaseLoaded" class="app__container" id="login">
      <div class="card">
        <h1 class="heading">Login</h1>
        <p>Please login to access the Hyphen-Hacks 2020 Admin Dashboard</p>
        <p>For security reasons, please use your Hyphen-Hacks email address. If you need help signing in please email
          Ronan
          <a href="mailto:ronan.furuta@hyphen-hacks.com">ronan.furuta@hyphen-hacks.com</a></p>
        <p>Non Hyphen-Hacks team members need to be authorized directly, please email <a
            href="mailto:ronan.furuta@hyphen-hacks.com">Ronan</a> from the email you would like authorized. (this can
          take up to 24 hours)</p>
        <button @click="login" class="btn mt-1"><i class="fa fa-google"></i>Login With Google</button>
      </div>

    </div>
    <div v-if="!firebaseLoaded" class="loader--full">
      <div class="loader__row"></div>
      <div class="loader__row">
        <div class="sk-cube-grid">
          <div class="sk-cube sk-cube1"></div>
          <div class="sk-cube sk-cube2"></div>
          <div class="sk-cube sk-cube3"></div>
          <div class="sk-cube sk-cube4"></div>
          <div class="sk-cube sk-cube5"></div>
          <div class="sk-cube sk-cube6"></div>
          <div class="sk-cube sk-cube7"></div>
          <div class="sk-cube sk-cube8"></div>
          <div class="sk-cube sk-cube9"></div>
        </div>
        <h1 class="heading">Hyphen-Hacks 2020 Dashboard</h1>
        <h2>Dashboard v{{version}}</h2>
      </div>
      <div class="loader__row">

        <p>Something not working right? Get tech support <a href="mailto:ronan.furuta@hyphen-hacks.com">ronan.furuta@hyphen-hacks.com</a>
        </p>
      </div>

    </div>

  </div>
</template>
<script>
let focus, blur, tokenRefresh
  export default {
    name: "AppContainer",
    data() {
      return {
        version: require("../package").version,
        firebaseLoaded: false,
        noAccess: false
      }
    },
    computed: {
      user() {
        return this.$store.getters.user
      }
    },
    methods: {

      loadBasicData() {
        if (this.$route.path != "/review") {
          fetch(this.$store.getters.api + "/api/v1/admin/applications", {
            method: "get",
            headers: {
              "Authorization": this.$store.getters.token
            }
          }).then(async res => {
            let json = await res.json()
            console.log(json, res.status)
            if (json.applicants) {
              this.$store.commit("applications", json.applicants)
            }
          })
        }

      },
      login() {
        var provider = new this.$firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({
          'login_hint': 'user@hyphen-hacks.com'
        });
        this.$firebase.auth().signInWithRedirect(provider);
      },
      logOut() {
        this.$firebase.auth().signOut()
      }
    },
    mounted() {
     let getToken = (trig) => {
        console.log('token trigger', trig)
        if (this.$firebase.currentUser) {
          this.$firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then((idToken) => {

            this.$store.commit("token", idToken)


          })
        }

      }
      this.$firebase.auth().onAuthStateChanged((user) => {

        if (user) {
          // User is signed in.
          let email = user.email
          console.log(email.endsWith("hyphen-hacks.com"))
          if (email.endsWith("hyphen-hacks.com")) {
            this.$firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then((idToken) => {
              // Send token to your backend via HTTPS
              // ...
              this.$store.commit("user", user)
              this.$store.commit("token", idToken)
              this.firebaseLoaded = true
              tokenRefresh =   window.setInterval(getToken("interval"), 900000)
             focus = window.addEventListener("focus", getToken("focus"), false);
              blur = window.addEventListener("blur", getToken("blur"), false);

          this.loadBasicData()
            }).catch(function (error) {
              // Handle error
            });

          } else {
            this.$store.commit("user", false)
            this.firebaseLoaded = true
            this.noAccess = true
            console.log("no acess")
            this.$swal({
              title: "No Access",
              text: "Please login with your @Hyphen-Hacks email address",
              icon: "error"
            })
          }
        } else {
          this.$store.commit("user", false)
          this.firebaseLoaded = true
          // No user is signed in.
        }
      });
    }
  }
</script>

