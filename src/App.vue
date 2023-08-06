<template>
  <div>

  </div>
</template>

<script>
import { registerAPI } from '@/api/index'
export default {
  async created () {
    const res = await registerAPI()
    console.log(res)
  }
}

</script>

<style lang="less" scoped>

</style>
