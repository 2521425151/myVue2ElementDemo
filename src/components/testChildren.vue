<template>
    <div>
        <p>{{title}}</p>
        <button @click="TCClick">update:title</button>
    </div>
</template>

<script>
	export default {
		name: "testChildren",
        props:['title'],
        created(){
			// this.title = 'newTitle'
			this.$emit('update:title', 'newTitle')
        },
        methods:{
	        TCClick(){
		        // this.title = 'TCClick'
		        this.$emit('update:title', 'TCClick')
            }
        }
	}
</script>

<style scoped>

</style>
