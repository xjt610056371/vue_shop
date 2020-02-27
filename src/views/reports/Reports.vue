<template>
  <div>
    <div v-for="val in arr">val</div>
    <button @click="add">+1</button>
    <button @click="reset">reset</button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        arr: [0, 1, 2]
      }
    },
    methods: {
      add() {
        this.arr.push(1)
      },
      reset() {
        this.arr = []
      }
    }
  }
</script>

<style scoped>

</style>