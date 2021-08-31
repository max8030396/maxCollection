<template lang="pug">
  .index-calculator

    h1 {{ `會員編號: ${userId}` }}

</template>

<script>
export default {
  name: 'IndexCalculator',

  mounted() {
    this.$router.replace({
      name: '404',
    })
  },
  
  data() {
    return {
      userId: this.$route.params.id,
    }
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

  // methods: {
  //   changeNameToChinese() {
  //     if(this.msg === 'ziping') {
  //       this.newName = '周子堯';
  //     }
  //   }
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style module>
  @import '../scss/indexCalculator.scss';
</style>
