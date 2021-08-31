<template lang="pug">
  .index-title
    h1 {{ newName }}
    ul
      li(v-for='itmes, key in article' :key='key')
        span(:class='`number-${ key + 1 }`') {{ key + 1 }}
        span.name {{ itmes }}

</template>

<script>
export default {
  name: 'IndexTitle',

  props: { // 參數
    msg: String
  },

  data() {
    return {
      open: false,
      newName: this.msg,
      article: ["第一個","第二個","第三個","第四個"],
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

  methods: {
    changeNameToChinese() {
      if(this.msg === 'ziping') {
        this.newName = '周子堯';
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style module>
  @import '../scss/indexTitle.scss';
</style>
