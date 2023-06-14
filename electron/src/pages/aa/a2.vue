<script setup>
import { ref } from 'vue'

const value1 = ref('')


</script>



<template>

  <el-date-picker  v-model="value1" type="datetime" placeholder="选择日期" format="YYYY/MM/DD HH:mm:ss" />

</template>

<style scoped lang="scss"></style>