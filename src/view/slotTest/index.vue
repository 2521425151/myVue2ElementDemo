<template>
    <div>
        {{HPName}}
        <test-children
            :title.sync="doc.title"
        >
            <template v-slot="slotProps">
                {{slotProps.user.lastName}}
            </template>
        </test-children>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import testChildren from '../components/testChildren'
export default {
	name: "slotTest",
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
            },
			slotProps:{
				user:{
					firstName:'firstName'
                }
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
