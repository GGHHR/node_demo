import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {join} from "path";

import {ElementPlusResolver} from "unplugin-vue-components/resolvers";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

import Pages from 'vite-plugin-pages'

export default defineConfig({
    base: './',
    plugins: [
        vue(),
        Pages()
    ],
    build: {
        sourcemap: process.env.NODE_ENV == "development",
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        },
        rollupOptions: {
            plugins: [
                AutoImport({
                    resolvers: [ElementPlusResolver()],
                }),
                Components({
                    resolvers: [ElementPlusResolver()],
                }),
            ],
        },
    },
    resolve: {
        alias: {
            '@': join(__dirname, "src")
        }
    }
})
