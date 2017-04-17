<template>
    <div>
        <h3>用户评论</h3>
        <p v-if="comments.length === 0">暂无评论</p>
        <div class="comment_container">
        	<div >
        		<template v-for="(comment, index) in comments ">
        			<mu-sub-header>{{comment.name+":"}}</mu-sub-header>
		            <mu-content-block class="comment">
		                {{comment.content}}
		            </mu-content-block>		
        		</template>
        	</div>
            
        </div>
    </div>
</template>


<script>
	import Actions from "@http"

	export default {
		created (){
			this.getComment();
		},
		data (){
			return {
				courseId: "",
				comments: [],
			}
		},
		methods: {
			getComment: function () {
				let courseId = this.$route.params.id;
				this.courseId = courseId;
				if (courseId) {
					Actions.getComment(courseId)
						.then(res => {
							let comments = res.data.response.comments;
							console.log("comments", comments)
							comments = comments.reverse();
							this.comments = comments;
						})
						.catch(error => console.log("error:", error))
				}
			}
		}
	}
</script>

<style>
	.comment_container {
		margin-top: 20px;
	}
	.comment_container .mu-sub-header {
		text-align: left;
	}
	.comment {
		/*margin: 0 20%;*/
		/*border-bottom: 1px solid black;*/
	}
</style>