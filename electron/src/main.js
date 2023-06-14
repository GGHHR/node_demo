import {createApp} from 'vue'
import App from './App.vue'
import router from './assets/router/router.js'
import axios_config from "@/assets/axios/axios";
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const pinia = createPinia();

/*pinia持久化*/
pinia.use(piniaPluginPersistedstate);

let app = createApp(App);

    app.config.globalProperties.$axios=axios_config;

    app.use(router)
        .use(pinia)
        .use(ElementPlus, {
            locale: zhCn,
        })
        .mount('#app')
