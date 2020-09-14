 <template>
  <div>
    <children v-model="test" ></children>  <!-- 组件中使用v-model -->
    <button @click="fn">外面改变里面</button>
    {{'外面的值：' + test}}  <!-- 这儿试验test与内部msg值为双向绑定关系 -->
  </div>
</template>

<script>
import children from './children'
  export default {
    data () {
      return {
        test: ''
      }
    },
    methods: {
      fn () {
        this.test += 1 
      }
    },
    components:{
      children
    }
  }
</script>