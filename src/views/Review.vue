<template>
  <div class="columns">

    <div class="page">
      <div class="searchBox">
        <form @submit.prevent class="searchRow">
          <input v-model="searchTerm" type="search" class="input" placeholder="Search">
          <select v-model="type" class="input" name="" id="">
            <option value="all">All</option>
            <option value="mentor">Mentors</option>
            <option value="attendee">Attendees</option>
            <option value="volunteer">Volunteers</option>
          </select>
        </form>
        <div class="reviewHeader">
          <p>Name</p>
          <p>School/Work</p>
          <p class="right">Role</p>
          <p class="right">Applied</p>
        </div>

      </div>
      <div class="people">
        <div @click="openPerson(app)" :class="{active:chosen == app['_id']} " :key="app['_id']" v-for="app in searched"
             class="appliedPerson">
          <p>{{app.firstName}} {{app.lastName}}</p>
          <p>{{app.application.school? app.application.school : app.application.company}}</p>
          <p class="right">{{app.role}}</p>
          <p class="right">{{relativeTime(app.applied)}}</p>
        </div>
      </div>
    </div>
    <div v-if="chosen" class="column">
      <div class="name">
        <div>

          <h1 class="heading">{{focusedApp.firstName}} {{focusedApp.lastName}}</h1>
          <p>{{focusedApp.application.school ? `${focusedApp.application.school}, ${focusedApp.application.graduation}
            `: focusedApp.application.company}}</p>
        </div>
        <p>{{focusedApp.role}}</p>
      </div>
      <div class="appData">
        <p class="sectionTitle">Info</p>
        <p class="info">email: <span>{{focusedApp.email}}</span></p>
        <div v-if="focusedApp.role == 'attendee'">
          <p class="info">Zipcode: <span>{{focusedApp.application.zip}}</span></p>
          <p class="info">Birthday: <span>{{focusedApp.application.birthday}}</span></p>
          <p class="info">Gender: <span>{{focusedApp.application.gender}}</span></p>
          <p class="question">Race: <span>{{objList(focusedApp.application.race)}}</span></p>
        </div>
        <div v-if="focusedApp.role == 'mentor'">
          <p class="info">Phone: <span>{{focusedApp.application.phoneNumber}}</span></p>
          <p class="info">Company: <span>{{focusedApp.application.company}}</span></p>
          <p class="info">Position: <span>{{focusedApp.application.companyPosition}}</span></p>
        </div>
        <p class="sectionTitle">Questions</p>
        <div v-if="focusedApp.role == 'mentor'">
          <p class="question">Experience Attending Hackathons: <span>{{focusedApp.application.expAttending}}</span></p>
          <p class="question">Experience Mentoring or Judging Hackathons: <span>{{focusedApp.application.expMentoringJudging}}</span>
          </p>
          <p class="question">Experience Working with High School Students: <span>{{focusedApp.application.expWorkingWithStudents}}</span>
          </p>
          <p class="question">Areas of expertise: <span>{{focusedApp.application.areasOfExpertise}}</span></p>
        </div>
        <div v-if="focusedApp.role == 'attendee'">
          <p class="question">Why do you want to attend?: <span>{{focusedApp.application.whyDoYouWantToAttend}}</span>
          </p>
          <p class="question">Experience with software development:
            <span>{{focusedApp.application.experienceSoftware}}</span></p>
          <p class="question">Experience with hardware development:
            <span>{{focusedApp.application.experienceHardware}}</span></p>
          <p class="question">Experience with hackathons: <span>{{focusedApp.application.experienceHackathon}}</span>
          </p>
          <p class="question">Experience with team coding: <span>{{focusedApp.application.experienceTeamCoding}}</span>
          </p>
          <p class="question">Description of computer science experience: <span>{{focusedApp.application.descriptionCompSciExp}}</span>
          </p>
          <p class="info">Coming with team: <span>{{focusedApp.application.team? "Yes" : "No"}}</span></p>

        </div>
        <p class="sectionTitle">Logistics</p>
        <p v-if="focusedApp.role == 'attendee'" class="info">Laptop: <span>{{focusedApp.application.laptop? "Yes" : "No"}}</span>
        </p>
        <p class="question">Food Allergies: <span>{{objList(focusedApp.application.foodAllergies)}}</span></p>
        <p class="question">Dietary Restrictions: <span>{{objList(focusedApp.application.dietaryRestrictions)}}</span>
        </p>
        <p class="question">Accommodations: <span>{{focusedApp.application.accommodations}}</span></p>
        <p class="info">Shirt Size: <span>{{focusedApp.application.shirtSize}}</span></p>
        <p class="question">Referrers: <span>{{objList(focusedApp.application.referrers)}}</span></p>
        <p class="question">Comments: <span>{{focusedApp.application.comments}}</span></p>
      </div>
      <div class="actions">
        <button class="btn" @click="accept(focusedApp['_id'])">Accept</button>
        <button class="btn--dark">Decline</button>
      </div>
    </div>
    <div v-if="!chosen" class="column empty">
      <p>Click on someone to get details about their application</p>
    </div>
  </div>
</template>

<script>
  // @ is an alias to /src
  import HelloWorld from '@/components/HelloWorld.vue'

  export default {
    name: 'Home',
    components: {
      HelloWorld
    },
    data() {
      return {
        chosen: false,
        search: new this.$JsSearch.Search('_id'),
        "searchTerm": "",
        type: "all"

      }
    },
    methods: {
      accept(id) {
        console.log("accpting", id)


        fetch(this.$store.getters.api + "/api/v1/admin/applications/accept", {
          method: "post",
          headers: {
            "Authorization": this.$store.getters.token,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({applicationId: id})
        }).then(async res => {
          let json = await res.json()
          console.log(json, res.status)
          if (json.success) {
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
              } else {
                this.$swal("Error fetching applications")
              }
            })
            let person = this.focusedApp.firstName
            this.chosen = false

            this.$swal({
              icon: "success", title: "Success",
              text: `${person} has been accepted. They have automatically been sent an acceptance email.`
            })

          } else {
            this.$swal({
              icon: "error", title: "ERROR",
              text: `${this.focusedApp.firstName} has not been accepted. Please take a screen shot and email Ronan`
            })
          }
        })
      },
      objList(obj) {
        let terms = []
        Object.keys(obj).forEach(i => {
          if (i === "otherEnabled" && obj.otherEnabled) {
            // console.log(obj.otherEnabled, obj.other)
            terms.push(obj.other)
          } else {
            if (obj[i] && i != "other") {
              terms.push(i)
            }
          }

        })
        return String(terms)
      },
      relativeTime(time) {
        return this.$moment.unix(time).fromNow()
      },
      openPerson(app) {
        this.chosen = app["_id"]
      }
    },
    computed: {
      focusedApp() {
        if (this.chosen) {
          return this.applicationsObject[this.chosen]
        } else {
          return false
        }

      },
      applications() {
        this.search = new this.$JsSearch.Search('_id')
        this.search.addIndex('firstName');
        this.search.addIndex('lastName');
        this.search.addIndex('email');
        this.search.addIndex('role');
        this.search.addIndex(['application', 'school']);
        this.search.addIndex(['application', 'company']);
        this.search.addDocuments(this.$store.getters.applications)
        return this.$store.getters.applications.sort((a, b) => {
          return a.applied - b.applied
        })
      },
      searched() {
        console.log(this.type)
        if (this.searchTerm.length >= 1) {

          return this.search.search(this.searchTerm).filter(a => {
            if (this.type == "all") {
              return true
            } else {
              return a.role == this.type
            }
          })


        } else {

          return this.applications.filter(a => {
            if (this.type == "all") {
              return true
            } else {
              return a.role == this.type
            }
          })

        }

      },
      applicationsObject() {
        return this.$store.getters.applicationsObject
      }
    },
    mounted() {

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
        } else {
          this.$swal("Error fetching applications")
        }
      })
    }

  }
</script>
