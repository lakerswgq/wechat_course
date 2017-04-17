<template>
	<div>
		<div class="banner">
			<Swiper
	    	:pagination-visible="true"
	    	:slides="banners"
	    	:repeating="true"
	    	:auto="5000"
	    	>

			    <div v-for="(slide,index) in banners" :key="index">
			      <a :href="slide.value">
			        <img width="100%" :src="slide.image" />
			      </a>
			    </div>
	  		</Swiper>
		</div>

		<section class="page_body">
			<VideoGridList title="热门推荐" :items="hotCourses" :itemHeight="140"></VideoGridList>
			<VideoGridList title="最新课程" :items="newCourses" :itemHeight="140"></VideoGridList>
		</section>
		<!-- <p>home page</p> -->

	</div>
</template>

<script>
	import Swiper from "@components/Swiper"
	import VideoGridList from "@components/VideoGridList"
	import Actions from "@http"

	export default {
		components: {
			Swiper,
			VideoGridList
		},

		created() {
			//this.getBanners();
			this.getHotCourse();
			this.getNewCourse();
		},	

		mounted (){

		},

		data (){
			return {
				banners: [],
				newCourses: [],
				hotCourses: [],
			}
		},

		methods: {
			handleError: function (error){
				console.log("got a error:", error);
			},
			getBanners: function () {
				this.$http.get("/banners")
					.then(res => {
						let banners = res.data.banners;
						this.banners = banners;
					})
					.catch(this.handleError)
			},
			getHotCourse: function (){
				Actions.getHotCourse()
					.then(res => {
						let courses = res.data.response;
						console.log("hot courses:", res);
						this.hotCourses = courses;
					})
					.catch(error => console.log(error))
			},
			getNewCourse: function (){
				Actions.getNewCourse()
					.then(res => {
						let courses = res.data.response;
						console.log("new courses:", res);
						this.newCourses = courses;
					})
					.catch(error => console.log(error))
			}
		}
	}

</script>

<style>
	.page_body {
		padding: 0 4px;
	}
</style>