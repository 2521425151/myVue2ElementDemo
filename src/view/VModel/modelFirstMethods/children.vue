<template>
  <div>
    <ul>
      <li><button @click="fn2">里面改变外面</button>{{'里面的值：'+ msg}}</li>
    </ul>
  </div>
</template>

<script>
  export default {
    model: {    // 使用model， 这儿2个属性，prop属性说，我要将msg作为该组件被使用时（此处为aa组件被父组件调用）v-model能取到的值，event说，我emit ‘cc’ 的时候，参数的值就是父组件v-model收到的值。
      prop: 'msg',
      event: 'cc'
    },
    props: {
      msg: {
        type: String,
        default: ''
      }
    },
    methods: {
      fn2 () {
        this.$emit('cc', this.msg + 2)
      }
    }
  }
</script>