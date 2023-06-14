<script setup>
import {useCounterStore} from "@/assets/store/store";
import {getCurrentInstance, ref} from "vue";

import { ElButton } from 'element-plus'

const store = useCounterStore()


/*请求*/
// let{proxy}=getCurrentInstance()
// proxy.$axios.get("/api/").then(() => {
//
// }).catch((a)=>{
//     console.log(a)
// });






</script>

<template>
    <div class="example-pagination-block">
        <div class="example-demonstration">When you have few pages</div>
        <el-pagination layout="prev, pager, next" :total="50" />
    </div>
    <div class="example-pagination-block">
        <div class="example-demonstration">When you have more than 7 pages</div>
        <el-pagination layout="prev, pager, next" :total="1000" />
    </div>
    <div>
        <router-link to="/store/store">跳到store</router-link>
    </div>

    <div>
        <router-link to="/props/father">跳到father</router-link>
    </div>

</template>

<style scoped lang="scss"></style>