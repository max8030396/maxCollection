<template lang='pug'>
  #app
    nav.navbar
      router-link(tag='button' to='/' :class='`nav-btn`')!= 'Home'
      router-link(tag='button' to='page2' :class='`nav-btn`')!= 'Page2'
      button(:class='`nav-btn`' @click='handleGoToUserProfile')!= 'Profile'
    router-view
</template>

<script>
export default {
  data() {
    return {
      randomUser: 0,
    }
  },

  // mounted() {
  //   this.getRandomInt(1, 1000);
  //   console.log('randomUser', this.randomUser);
  // },

  methods: {
    handleGoToUserProfile() {
      this.getRandomInt(1, 1000);
    },

    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      const newNumber = Math.floor(Math.random() * (max - min) + min);

      this.$router.push({
        name: 'Profile',
        params: {
          id: newNumber,
        },
      })
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
