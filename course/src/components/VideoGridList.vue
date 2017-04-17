<template>
    <div>
        <div class="list_header">
        </div>

        <div class="list_content">
            <mu-grid-list :cellHeight="itemHeight">
                <mu-sub-header>{{ title }}</mu-sub-header>
                <mu-grid-tile 
                	:cols="cols" 
                	v-for="item, index in items"
                	@click.native="jumpToVideo(item._id)" 
                	:key="index">

                    <img :src="item.cover.domain+'/'+item.cover.key" />
                    <span slot="title">{{item.title}}</span>
                    <span slot="subTitle">
                    	<mu-flat-button 
                    		:label="item.collections | num" 
                    		class="demo-flat-button" 
                    		color="#FFF" 
                    		icon="favorite"/>

                    	<mu-flat-button 
                    		:label="item.comments.length | num"
                    		color="#FFF" 
                    		class="demo-flat-button" 
                    		icon="comment">
                    	</mu-flat-button>
                    </span>

                </mu-grid-tile>
            </mu-grid-list>
        </div>

        <!-- <p>item grid list</p> -->
    </div>
</template>


<script>
	import shortNum from "@/filters/shortNum"
	export default {
		created() {
			//this.getItems();
		},
		mounted() {

		},
		filters: {
			num: shortNum
		},
		props: {
			items: {
				type: Array,
				default: function() {
					return [];
				}
			},
			cols: {
				type: Number,
				default: function (){
					return 1;
				}
			},
			title: {
				type: String,
				default: function (){
					return "默认标题";
				}
			},
			itemHeight: {
				type: Number,
				default: function (){
					return 180;
				}
			}
		},
		data (){
			return {
				
			}
		},
		methods: {
			handleError: function (error) {
				console.log("got a error:", error);
			},
			jumpToVideo: function (id){
				this.$router.push({
					name: "Video",
					params: {
						id: id
					}
				});
			},
			getItems: function () {
				if (this.items && this.items.length !==0){
					return;
				}

				// this.$http.get("/video_list")
				// 	.then(res => {
				// 		let videos = res.data.videos.anime.items;
				// 		this.items = videos;
				// 	})
			}
		}
	}
</script>

<style>
	.mu-grid-tile-title-container {
		margin-left: 0 !important;
	}
	.mu-flat-button-wrapper>i.mu-icon, .mu-flat-button-wrapper>.mu-flat-button-label {
		font-size: 14px;
	}
	.mu-grid-tile>img {
		width: 100% !important;
	}
</style>