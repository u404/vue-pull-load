<template>
  <div class="pull-load-tips" :class="`status-${status}`">
    <i class="pull-load-tips-icon" ></i>
    <span class="pull-load-tips-text"></span>
  </div>
</template>

<script>
import pullLoadStatus from "./status"

export default {
  name: "pull-load-tips",
  props: {

  },
  data () {
    return {
      status: pullLoadStatus.ready
    }
  }
}
</script>

<style lang="scss">
@import "./index.scss";
</style>
