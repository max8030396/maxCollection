<template lang="pug">
  .hello
    IndexTitle(:msg='`Hello!你好`')
    h1!= '計算機'
    button(v-for='button, key in buttons' :key='key' @click='handleResults(button.name,calcNum)') {{ button.ChName }} 

    button(@click='countNum')!= '等於'
    input(
      type='text'
      @input='inputOnChange'
      @focus='inputOnFocus'
      @blur='inputOnBlur'
      v-model='numValue'
      placeholder='輸入數值')
    p Results is : {{ calcNum }}

</template>

<script>
import IndexTitle from './IndexTitle.vue';

export default {
  name: 'HelloWorld',
  props: { // 參數
    msg: String
  },

  components: {
    IndexTitle,
  },

  data() {
    return {
      newName: this.msg,
      article: ["第一個","第二個","第三個","第四個"],
      buttons:[{
        name: '+',
        ChName: '加'
      },
      {
        name: '-',
        ChName: '減'
      },
      {
        name: '*',
        ChName: '乘'
      },
      {
        name: '/',
        ChName: '除'
      },
      {
        name: 'c',
        ChName: '清空'
      }],
      numValue: '',
      calcNum: '',
      value1: '',
      howToDo: '',
    }
  },

  beforeCreate() {
    // console.log('bdforeCreated');
    // console.log('bdforeCreated',this.newName);
    
  },

  created() {
    // console.log('created');
    // console.log('bdforeCreated',this.newName);
    // this.changeNameToChinese();
    
  },

  beforeMount() {
    // console.log('beforeMount');
  },

  mounted() {
    // console.log('mount');
  },

  methods: {
    handleResults(way) {
      this.value1 = this.numValue;
      this.numValue = '';
      this.howToDo = way;
      if(way === 'c') {
        this.value1 = '';
        this.numValue = '';
        this.calcNum = '';
      }
    },

    inputOnFocus() {
      // alert('Input Focus');
    },

    inputOnBlur() {
      // alert('Input Blur');
    },

    inputOnChange() {
      console.log('輸入中....')
    },

    countNum() {
      console.log('this.value1',this.value1);
      console.log('this.numValue',this.numValue);
      if(!this.value1 || !this.numValue) {
        alert('請輸入數字');
        return
      }
      if(this.howToDo === '+') {
        this.calcNum = Number(this.value1) + Number(this.numValue);
      } else if(this.howToDo === '-') {
        this.calcNum = Number(this.value1) - Number(this.numValue);
      } else if(this.howToDo === '*') {
        this.calcNum = Number(this.value1) * Number(this.numValue);
      } else {
        this.calcNum = Number(this.value1) / Number(this.numValue);
      }
      this.numValue = this.calcNum;
    },
    
    changeNameToChinese() {
      if(this.msg === 'ziping') {
        this.newName = '周子堯';
      }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- <style lang="scss"> -->
<style module>
  @import '../scss/helloWorld.scss';
</style>
