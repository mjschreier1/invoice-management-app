<template>
  <div id="app">
    <nav>
      <h1>Adam A Torres Music, LLC</h1>
      <div id="contact">
        <a href="mailto:utmusic@gmail.com"><icon name="envelope"></icon></a>
      </div>
    </nav>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}


body {
  margin: 0;
}

nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #00b26b;
  color: white;
  font-size: 4vw;
  padding: 2.5vw;
}

.fa-icon {
  width: auto;
  height: 4vw;
  padding-right: 1vw;
}

h1 {
  margin: 0;
}

a {
  color: white;
}

#contact {
  display: flex;
  align-items: center;
}

iframe {
  height: 5vw !important;
}

@media (max-height: 500px) {
  nav {
    padding: 1.5vw;
    font-size: 2.5vw;
  }

  .fa-icon {
    height: 2.25vw;
  }
}

@media (min-width: 750px) {
  nav {
    padding: 31.25px;
    font-size: 30px;
  }

  .fa-icon {
    height: 30px;
  }

  iframe input {
    font-size: 23px !important;
  }

  .CardField-child {
    font-size: 10px;
  }

}
</style>
