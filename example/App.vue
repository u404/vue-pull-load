<script>
import directive from "@/index"

export default {
  directives: {
    [directive.name]: directive
  },

  methods: {
    load () {
      return new Promise(resolve => {
        window.setTimeout(() => {
          resolve()
        }, 300)
      })
    }
  }
}
</script>

<template>
  <div class="page" ref="page">
    <div class="content" v-pull-load="{ loadHandler: load, bindToWrapper: true }">
      内容 <br>
      内容 <br>
      内容 <br>
      内容 <br>
      内容 <br>
      内容 <br>
      内容 <br>
      内容 <br>
      内容 <br>
      内容 <br>
      内容 <br>
      内容 <br>
      内容 <br>
      内容 <br>
      内容 <br>
      内容 <br>
      内容 <br>
      内容 <br>
      内容 <br>
      内容 <br>
      内容 <br>
      内容 <br>
      内容 <br>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  height: 100%;
  overflow: auto;
}
</style>
