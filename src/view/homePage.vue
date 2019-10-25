<template>
    <div>
        {{HPName}}
        <test-children
            :title.sync="doc.title"
        ></test-children>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import testChildren from '../components/testChildren'
export default {
	name: "homePage",
    components:{
	    testChildren
    },
	computed:{
		...mapGetters(['HPName'])
	},
	created(){
		this.setHomePageName('hello personal computer')
	},
	data(){
		return{
			doc:{
				title:'oldTitle'
            }
		}
	},
	methods:{
		...mapActions(['setHomePageName'])
	}
}
</script>

<style scoped>

</style>
