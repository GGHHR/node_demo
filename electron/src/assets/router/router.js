import {createRouter, createWebHashHistory} from 'vue-router'
import routes from '~pages'
// 路由参数配置
const router = createRouter({
    // 使用hash(createWebHashHistory)模式，(createWebHistory是HTML5历史模式，支持SEO)
    history: createWebHashHistory(),
    routes:[
        { path: '/', component: () =>import("@/pages/props/father.vue") },

    ].concat(routes)
})

//
// 导出默认值
export default router