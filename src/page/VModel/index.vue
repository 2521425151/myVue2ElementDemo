<template>
    <div class="VModel">
        <h2>常用的时第一种方式</h2>
        <h6>父子组件 v-model 第一种传参方式</h6>
        <first></first>
        <h6>父子组件 v-model 第二种传参方式</h6>
        <second></second>
    </div>
</template>

<script>
import first from './modelFirstMethods/parent'
import second from './modelSecondMethods/parent'
export default {
    name: 'VModel',
    components:{
        first,
        second
    },
    data(){
        return{

        }
    },
    methods:{

    }
}
</script>

<style lang="scss">
    .VModel{
        text-align: left;
        font-size: 18PX;
    }
    ul{
        padding: 0;
    }
</style>