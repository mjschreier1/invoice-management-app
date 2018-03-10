<template>
  <div id="DashboardComponent">
    <header>
      <ul>
        <li
          v-for="route in routes"
          :key="route.i"
        >
          <a :href="route.path">
            <div
              class="router-link"
              :class="{ selectedRoute: route.selected }"
              @click="selectRoute(route)"
            >
              <p @click="selectRoute(route)">{{ route.title }}</p>
            </div>
          </a>
        </li>
      </ul>
    </header>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "AdminDashboard",
  data () {
    return {
      routes: [
        {
          title: "Create",
          path: "/#/dashboard/create",
          selected: false,
        }, {
          title: "Update",
          path: "/#/dashboard/update",
          selected: false,
        }, {
          title: "View",
          path: "/#/dashboard/books",
          selected: false,
        }
      ],
    }
  },

  mounted() {
    this.routes.forEach(route => {
      if(location.href.includes(route.path)) {
        route.selected = true;
      }
    })
  },

  methods: {
    selectRoute(route) {
      this.routes.forEach(destination => destination === route ? destination.selected = true : destination.selected = false)
    }
  }
}
</script>

<style scoped>
li {
  list-style-type: none;
  width: 30%;
  height: 6.5vh;
}
a {
  color: black;
  text-decoration: none;
}
li p {
  display: inline;
  font-size: 3vw;
}
.router-link {
  box-sizing: border-box;
  margin: auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.router-link:hover {
  cursor: pointer;
  background-color: #00b26b;
  color: white;
}
ul {
  display: flex;
  justify-content: center;
  width: 70vw;
  padding: 0;
  margin: auto;
  margin-top: 20px;
}
.selectedRoute {
  border: 1px black solid;
  background-color: #00b26b;
  color: white;
}
@media(max-width: 500px) {
  ul {
    width: 90vw;
  }
  li p {
    font-size: 4vw;
  }
}
@media(min-width: 750px) {
  li p {
    font-size: 25px;
  }
  li {
    height: 5vh;
  }
}
</style>
