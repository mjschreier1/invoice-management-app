<template>
  <div id="DashboardComponent">
    <header>
      <ul>
        <li v-for="route in routes" :key="route.i">
          <a :href="route.path">
            <div class="router-link">
              <p>{{ route.title }}</p>
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
          path: "/#/dashboard/create"
        }, {
          title: "Update",
          path: "/#/dashboard/update"
        }, {
          title: "View",
          path: "/#/dashboard/books"
        }
      ],
    }
  },

  methods: {

  }
}
</script>

<style scoped>
li {
  list-style-type: none;
  width: 30%;
  height: 5vh;
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
  border: 2px black;
  margin: auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.router-link:hover {
  cursor: pointer;
  background-color: green;
}
ul {
  display: flex;
  justify-content: center;
  width: 70vw;
  padding: 0;
  margin: auto;
  margin-top: 20px;
}
@media(max-width: 500px) {
  ul {
    width: 90vw;
  }
}
@media(min-width: 750px) {
  li p {
    font-size: 25px;
  }
}
</style>
