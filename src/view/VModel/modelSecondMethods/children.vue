<template>
 <div>
    <ul>
      <li><button @click="fnSecond">里面改变外面</button>{{'里面的值：'+ value}}</li>
    </ul>
  </div>
</template>

<script>
export default {
    props: {
        value: { // 必须要使用value
            type: String,
            default: '',
        },
    },
    methods: {
        fnSecond () {
            // 这儿必须用input 发送数据，发送的数据会被父级v-model=“test”接受到，再被value=test传回来。
            this.$emit('input', this.value + 2);
        }
    }
}
</script>