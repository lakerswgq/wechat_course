<template>
	<div class="video_container">

		<!-- popup -->
		 <!-- <mu-popup position="bottom" :overlay="true" popupClass="demo-popup-top" :open="topPopup" @close="topPopup = false;">
    		更新成功
  		</mu-popup> -->
		

		<!-- toast -->
  		<mu-snackbar 
  			v-if="snackbarVisible" 
  			:message="promptText" 
  			action="关闭" 
  			@actionClick="snackbarVisible = false"
  			@close="snackbarVisible=false"/>

		<!-- comment dialog -->

		<mu-dialog :open="commentDialog" title="评论" @close="closeComment">
				<div class="commentEdit">	
					<mu-text-field 
							v-model="commentContent"
							hintText="不允许超过50个字符" 
							:errorText="commmentError" 
							@textOverflow="handleCommentOverflow" 
							multiLine 
							:rows="3" 
							:rowsMax="6" 
							:maxLength="50"/>
				</div>
				<mu-flat-button @click="jumpToComment" label="查看其他评论" icon="comment" />
				<mu-flat-button 
					slot="actions"  
					@click="closeComment" primary label="取消"/>
				<mu-flat-button 
					slot="actions" 
					:disabled="commentDisabled" 
					@click="submitComment" primary label="评论"/>

		</mu-dialog>

		<div>
		    <mu-card>

		        <mu-card-media >
		            <div class="player">
		            	<video-player 
		            		ref="videoPlayer"
		            		:options="playerOptions"
                        	@ready="playerReadied($event)">
          				</video-player>
		            </div>
		        </mu-card-media>

		        <mu-card-title :title="course.title" subTitle="" />
		        <mu-card-text>
		            {{ course.detail }}
		        </mu-card-text>

		        <mu-card-actions>
		            <mu-flat-button @click="collect" :disabled="collectDiaabled" label="收藏" :icon="heartIcon" />
		            
		            <mu-flat-button @click="openCommentDialog" label="评论" icon="create" />
		            <mu-flat-button @click="openDocDownload" label="课件下载" icon="file_download" />
		        </mu-card-actions>

		    </mu-card>
		</div>

		<footer style="margin: 10px;">
			<VideoGridList title="其他课程推荐" :items="recommendCourse" :itemHeight="200" :cols="2"></VideoGridList>
		</footer>
		<div>
			<mu-bottom-sheet :open="docDownload" @close="closeDocDownload">
				<mu-list @itemClick="closeDocDownload" >
					<mu-sub-header>
					选择课件下载
					</mu-sub-header>
					<mu-list-item 
						v-for="(item, index) in course.docs" 
						:key="item.key"
						:title="item.name" 
						target="_blank"
						:href="item.url" />
				</mu-list>
			</mu-bottom-sheet>
		</div>
    </div>
</template>


<script>
	import image from "@assets/logo.png"
	import { videoPlayer } from "vue-video-player"
	import VideoGridList from "@components/VideoGridList"
	import Actions from "@http"

	require('videojs-resolution-switcher')
  	require('videojs-resolution-switcher/lib/videojs-resolution-switcher.css')

	export default {
		created (){
			this.getCourse();
			this.getRecommendCourse();
		},
		mounted (){

		},
		components: {
			videoPlayer,
			VideoGridList,
		},
		watch: {
			$route: function (){
				location.reload();
				// this.getCourse();
				// this.getRecommendCourse();
			}
		},
		data (){
			return {
				courseId: "",
				course: {
					title: "",
					detail: "",
					videos: [],
					docs: [],
				},
				recommendCourse: [],
				image: image,

				collected: true,
				collectDiaabled: false,

				commentDialog: false,
				commentContent: "",
				commmentError: "",
				commentDisabled: false,

				topPopup: true,
				snackbarVisible: false,
				promptText: "",

				docDownload: false,


				playerSources: [{
					type: "video/mp4",
					src: "ur",
					label: "name",
					res: 0,
				}],
				playerOptions: {
					plugins: {
						videoJsResolutionSwitcher: {
			                	ui: true,
			                	default: 1,
			                	dynamicLabel: true
			        	},
			        },
			        playbackRates: [0.7, 1, 1.3, 1.5, 1.7],
			        poster: "fuck",
			        height: 240  
				}
			}
		},
		computed: {
			player() {
				return this.$refs.videoPlayer.player;
			},
			heartIcon() {
				return this.collected ? "favorite" : "favorite_border";
			}
		},
		methods: {
			handleError: function (error){
				console.log("error:", error);
			},
			getCourse: function (){
				let courseId = this.$route.params.id;
				this.courseId = courseId;
				if (!courseId){
					return;
				}
				Actions.getCourseById(courseId)
					.then(res => {
						let course = res.data.response;
						console.log("course:", course);
						this.course = course;
						// let cover = course.cover.domain+"/"+course.cover.key;
						// this.playerOptions.poster = cover;
						// console.log(this.playerOptions.poster);
						this.getVideos(course.videos);
					})
					.catch(this.handleError)
			},
			getRecommendCourse: function (){
				Actions.getHotCourse()
					.then(res => {
						let courses = res.data.response;
						this.recommendCourse = courses;
					})
					.catch(error => console.log("error:", error))
			},
			collect: function(){
				let self = this;
				this.collectDiaabled = true;
				setTimeout(function (){
					self.collected = !self.collected;
					self.collectDiaabled = false;
				}, 1000);
			},

			jumpToComment: function (){
				let courseId = this.courseId;
				if (courseId) {
					this.$router.push({
						path: "/comments/" + courseId
					});
				}
			},

			openCommentDialog: function (){
				this.commentDialog = true;
			},
			closeComment: function (){
				this.commentDialog = false;
			},
			handleCommentOverflow: function (isOverflow){
				this.commmentError = isOverflow ? '超过字数限制！' : ''
				this.commentDisabled = isOverflow ? true : false;
			},
			submitComment: function (){
					let comment = this.commentContent.trim();
					if (comment) {
						Actions.postComment(this.courseId, comment)
							.then(res => {
								this.showPromptInfo("评论成功");
								this.commentContent = "";
							})
					}
					else {
						alert("请输入有效评论");
					}
			},

			showPromptInfo: function (text) {
				this.promptText = text;
				this.snackbarVisible = true;
				setTimeout(() => {
					this.snackbarVisible = false;
					this.promptText = "";
				}, 1500);
			},


			openDocDownload: function (){
				this.docDownload = true;
			},
			closeDocDownload: function (){
				this.docDownload = false;
			},

			getVideos: function (videos){
				let sources = videos.map((item, index) => {
					return {
						type: "video/mp4",
						src: item.url,
						label: item.name,
						res: index+1
					}
				});
				this.playerSources = sources;
				return;
				this.$http.get("/video_data")
					.then(res => {
						let videos = res.data.videos;
						console.log("videos:", videos)
						this.playerSources = videos;
					})
			},
			playerReadied: function (){
				let player = this.player;
				if (player.updateSrc) {
          			player.updateSrc(this.playerSources);

          			player.on('resolutionchange', function(){
            			console.log('switch the source', player.src())
          			});
          		}
			}
		}
	}
</script>

<style scoped>
	.video_container {
		margin-top: 10px;
	}
	.demo-popup-top {
		width: 100%;
		opacity: .8;
		height: 48px;
		line-height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		max-width: 375px;
	}
</style>

<style>	
	.demo-popup-top {
		width: 100%;
		opacity: .8;
		height: 48px;
		line-height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		max-width: 375px;
	}
	.commentEdit .mu-text-field {
		width: 100%;
	}

</style>