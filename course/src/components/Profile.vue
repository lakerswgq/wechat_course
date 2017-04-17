<template>
	<div>
		<VideoGridList title="我的收藏" :items="courses" :cols="2"></VideoGridList>
	</div>
</template>


<script>
	import VideoGridList from "@components/VideoGridList"
	import Actions from "@http"

	export default {
		components: {
			VideoGridList,
		},
		created (){
			this.getCollections();
		},
		data (){
			return {
				courses: [],
			}
		},
		methods: {
			getCollections: function () {
				Actions.getCollections()
					.then(res => {
						console.log(res);
						let code = res.data.code;
						if (code == 1){
							let courses = res.data.response;
							this.courses = courses;
						}
					})
					.catch(error => {
						console.log("error:", error);
					})			
			}
		}
	}
</script>

<style>
	
</style>