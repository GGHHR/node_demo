<template>
    <div class="div">
        <router-link to="s2">222</router-link>
        <div @click="reset">重置store</div>
    </div>
</template>

<script setup>
import { useCounterStore } from "@/assets/store/store";

const store = useCounterStore();
store.increment()
console.log(store.count);

store.$subscribe((mutation, state) => {
    console.log("变到"+store.count);
});

store.count += 22;

function reset() {
    store.$reset();
    console.log(store.count);
}

</script>

<style scoped lang="scss">
    div {
        color: red;
    }

</style>
