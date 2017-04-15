<template>
    <div>
        <mu-appbar :title="title">
            <mu-icon-button v-if="!searchVisible" icon="menu" @click="openDrawer" slot="left" />
            <mu-icon-button v-if="searchVisible" icon="keyboard_arrow_left" @click="searchVisible=false" slot="left" />	

            <div v-if="searchVisible">
            	<mu-text-field class="appbar-search-field" v-model="searchWord" slot="right" hintText="请输入搜索内容"/>
            </div>

            <mu-icon-button icon="search" @click="showSearch" slot="right" />
        </mu-appbar>

        <div>
            <mu-drawer :open="drawerVisible" :docked="docked" @close="drawerVisible = false">

				<div id="drawer_header">
					<mu-list>
							<!-- <img src="../assets/logo.png" alt=""> -->
						<mu-list-item title="用户昵称" titleClass="nickname" disabled>
							<mu-avatar slot="left" :src="avatar"/>
						</mu-list-item>
					</mu-list>
				</div>

                <mu-list >
                    <mu-list-item title="主页" @click="JumpToIndex" >
                        <mu-icon  slot="left" value="home" />
                    </mu-list-item>
                    <mu-list-item title="个人中心">
                        <mu-icon slot="left" value="person" />
                    </mu-list-item>
                    <mu-list-item @click="drawerVisible = false" title="关闭">
                        <mu-icon slot="left" value="close" />
                    </mu-list-item>
                </mu-list>
            </mu-drawer>
        </div>

        <section class="page_body">
        	<router-view></router-view>
        </section>

    </div>
</template>

<script>
	import avatar from "@assets/logo.png"
	import SearchBox from "@components/SearchBox"
	export default {
		components: {
			SearchBox
		},
		data (){
			return {
				title: "石大微课堂",
				drawerVisible: false,
				docked: false,
				avatar: avatar,
				searchVisible: false,
				searchWord: "",
			}
		},
		methods: {
			openDrawer (){
				this.drawerVisible = true;
			},
			jumpToSearch: function (title) {
				this.$router.push({
					path: "/search",
					query: {
						title: title
					}
				})
			},
			JumpToIndex: function (){
				this.$router.push({
					path: "/home"
				});
			},
			showSearch (){
				if (this.searchVisible) {
					let searchWord = this.searchWord.trim();
					if (searchWord){
						this.jumpToSearch(searchWord);
					}
				}
				else {
					this.searchVisible = true;
				}
			}

			
		}

	}

</script>

<style scoped>
	#drawer_header {
		background: #474a4f;
		padding: 20px 0;
	}
	.nickname {
		color: #fff;
	}
</style>

<style lang="less">
.appbar-search-field {
    color: #FFF;
    margin-bottom: 0;
    &.focus-state {
        color: #FFF;
    }
    .mu-text-field-hint {
        color: fade(#FFF, 54%);
    }
    .mu-text-field-input {
        color: #FFF;
    }
    .mu-text-field-focus-line {
        background-color: #FFF;
    }
}

.nickname {
		color: #fff;
}

</style>
