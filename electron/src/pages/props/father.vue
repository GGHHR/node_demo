<script setup>
import { ref, toRaw, watch} from 'vue'
import abc from     './abc.vue'

import {useCounterStore} from "@/assets/store/store";
const store = useCounterStore()
console.log(store.count);



const count = ref(9999)

/*监控值变化*/
watch(count,() => {
    console.log(count.value)
})

count.value++;

const aa = ref({a:1,b:2})

console.log(toRaw(aa.value))

</script>

<template>


    <div><router-link to="/store/store">跳到store</router-link></div>

    <h1>hello{{count}}</h1>

    <abc :count="count" @update:count="count = $event"></abc>
</template>

<style scoped lang="scss">


@mixin  rounded-corners (){
    color: red
}
.ft_2 {
    color: red;
    width:100 - 3px;
}
.ft_22{
    @extend .ft_2;
}
</style>
