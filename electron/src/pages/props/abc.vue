<template>
    <div>
        231
    </div>
    <div @click="add">{{ count }}</div>
</template>

<script setup>

const props = defineProps({
    count: Number,
})



/*接收定义事件*/
const emit = defineEmits(['update:count']);


function add() {
    emit('update:count', props.count + 1)
}

</script>

<style scoped>
</style>
