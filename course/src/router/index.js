import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'Header',
        component: require("@components/Header"),
        children: [
        	{
        		path: "/home",
        		name: "Home",
        		component: require("@components/Home"),
        	},
        	{
        		path: "/video/:id",
        		name: "Video",
        		component: require("@components/Video")
        	},
            {
                path: "/search",
                name: "Search",
                component: require("@components/SearchResult")
            },
            {
                path: "/profile",
                name: "Profile",
                component: require("@components/Profile")
            },
            {
                path: "/comments/:id",
                name: "Comments",
                component: require("@components/Comments")
            }
        ]
    }]
})
