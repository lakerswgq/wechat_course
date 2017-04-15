<template>
	<div>
		<VideoGridList title="搜索结果" :items="courses" :itemHeight="200" :cols="2"></VideoGridList>
		<mu-infinite-scroll :loading="loading" @load="loadMore"/>
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
			this.getCourse();
		},
		mounted (){
			
		},
		watch: {
			$route: function (){
				this.getCourse();
			}
		},
		data (){
			return {
				courseTitle: "",
				loading: false,
				courses: [],
			}
		},
		methods: {
			getCourse: function (){
				let courseTitle = this.$route.query.title;
				console.log("course title:", courseTitle);
				this.courseTitle = courseTitle;
				Actions.searchByTitle(courseTitle)
					.then(res => {
						let courses = res.data.response;
						console.log("courses:", courses);
						this.courses = courses;
					})
					.catch(error => console.log("Error:", error));
			},

			loadMore: function () {
				console.log("load more");
				this.loading = true
				setTimeout(() => {
					this.loading = false;
				}, 1500);
			}
     	}

	}
</script>

<style>
	
</style>

<style>
	
</style>