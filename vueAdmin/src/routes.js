import Login from './pages/Login.vue'
import NotFound from './pages/404.vue'
import Home from './pages/Home.vue'
import Main from './pages/Main.vue'
import Table from './pages/nav1/Table.vue'
import Form from './pages/nav1/Form.vue'
import user from './pages/nav1/user.vue'
import Page4 from './pages/nav2/Page4.vue'
import Page5 from './pages/nav2/Page5.vue'
import NewAdmin from './pages/AdminManage.vue'
import echarts from './pages/charts/echarts.vue'
import Upload from "./pages/upload/Upload.vue"

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '课程管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/courses', component: Table, name: '课程列表' },
            {
                path: "/course/new",
                component: Upload,
                name: "新建课程",
            },
            {
                path: "/course/:courseId",
                component: Upload,
                name: "修改课程",
                hidden: true
            },
            // { path: '/form', component: Form, name: 'Form' },
            // { path: '/user', component: user, name: '列表' },
        ]
    },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '导航二',
    //     iconCls: 'fa fa-id-card-o',
    //     children: [
    //         { path: '/page4', component: Page4, name: '页面4' },
    //         { path: '/page5', component: Page5, name: '页面5' }
    //     ]
    // },
    {
        path: '/',
        component: Home,
        name: '用户管理',
        iconCls: 'fa fa-address-card',
        //leaf: true,//只有一个节点
        children: [
            { path: '/admin_manage', component: NewAdmin, name: '管理员' },
        ]
    },
    // {
    //     path: '/',
    //     component: Home,
    //     name: 'Charts',
    //     iconCls: 'fa fa-bar-chart',
    //     children: [
    //         { path: '/echarts', component: echarts, name: 'echarts' }
    //     ]
    // },
    // {
    //     path: "/",
    //     component: Home,
    //     name: "Course",
    //     iconCls: "el-icon-upload",
    //     children: [
    //         {
    //             path: "/course/new",
    //             component: Upload,
    //             name: "NewCourse",
    //         },
    //         {
    //             path: "/course/:courseId",
    //             component: Upload,
    //             name: "EditCourse",
    //             hidden: true
    //         }
    //     ]

    // },

    // {
    //     path: "/course/:courseId",
    //     component: Home,
    //     name: "Course"
    //     hidden: true,
    //     name: "EditCourse"
    // },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    },

];

export default routes;