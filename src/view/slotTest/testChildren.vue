<template>
    <div>
        <p>{{title}}</p>
        <button @click="TCClick">update</button>
        <slot v-bind:user="user">
            {{user.lastName}}
        </slot>
    </div>
</template>

<script>
	export default {
		name: "testChildren",
        props:['title'],
        data(){
			return{
				user:{
					lastName:"lastName"
                }
            }
        },
        created(){
			this.$emit('update:title', 'newTitle')
        },
        methods:{
	        TCClick(){
                this.user.lastName = this.user.lastName === 'clickLastName' ? 'lastName' : 'clickLastName';
                let msg = this.title === 'TCClick' ? 'newTitle' : 'TCClick';
		        this.$emit('update:title', msg)
            }
        }
	}
</script>

<style scoped>

</style>
