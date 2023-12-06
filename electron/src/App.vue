<script setup>
import { ref} from 'vue'


let msg=ref(1)


console.log(window.electron.ipcRenderer)


function msgFn(data) {
    msg.value+=data
}

</script>

<template>
    <router-view>  </router-view>
</template>

<style  lang="scss">
@import 'element-plus/dist/index.css';
@import "@/assets/css/index.scss";


</style>
