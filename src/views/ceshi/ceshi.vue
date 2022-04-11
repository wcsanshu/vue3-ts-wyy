<template>
  <div class="input_wrap">
    <input v-model="inputRef" type="text" />
    <button @click="addTodos">添加</button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
const numbers = ref([1, 2, 3, 4, 5])
const evenNumbers = computed(() => {
  return numbers.value.filter((n) => n % 2 === 0)
})
const ce = (event) => {
  console.log(event.target.tagName)
}
let nextTodoId = 4
const todos = ref([
  {
    id: 1,
    title: "Do the dishes"
  },
  {
    id: 2,
    title: "Take out the trash"
  },
  {
    id: 3,
    title: "Mow the lawn"
  }
])
const inputRef = ref("")
const addTodos = () => {
  todos.value.push({
    id: nextTodoId++,
    title: inputRef.value
  })
}
const remove = (id) => {
  todos.value.splice(id, 1)
}
const nu = computed(() => {
  return todos.value.filter((item) => {
    return item.title + "4566"
  })
})
</script>

<style lang="scss">
.active {
  background-color: red;
}
.input_wrap {
  display: flex;
  justify-content: space-between;
  color: black;
}
.box {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  padding-bottom: 5px;
  margin-bottom: 10px;
  border-bottom: 1px solid #fff;
}
</style>
