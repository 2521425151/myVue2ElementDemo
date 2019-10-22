<template>
    <div>
        {{HPName}}
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
	name: "homePage",
	computed:{
		...mapGetters(['HPName'])
	},
	created(){
		this.setHomePageName('hello personal computer')
	},
	data(){
		return{

		}
	},
	methods:{
		...mapActions(['setHomePageName'])
	}
}
</script>

<style scoped>

</style>
