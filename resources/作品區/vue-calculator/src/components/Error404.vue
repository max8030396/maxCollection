<template lang="pug">
  .index-404
    h1!= '404'
 

</template>

<script>
export default {
  name: 'Index404',

  props: { // 參數
    msg: String
  },

  // beforeCreate() {
  //   // console.log('bdforeCreated');
  //   // console.log('bdforeCreated',this.newName);
  // },

  // created() {
  //   // console.log('created');
  //   // console.log('bdforeCreated',this.newName);
  //   // this.changeNameToChinese();
  // },

  // beforeMount() {
  //   // console.log('beforeMount');
  // },

  // mounted() {
  //   // console.log('mount');
  // },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style module>
  /* @import '../scss/indexTitle.scss'; */
</style>
