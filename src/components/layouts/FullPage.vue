<template>
  <div class="fullPageContainer">
    <slot/>
  </div>
</template>

<script lang="ts">
export default {
  name: 'FullPageContainer',
  props: ['pageTitle'],
}

</script>
<style lang="scss">
.fullPageContainer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: black;
  color: white;
  //display: grid;
  //place-items: center;
  z-index: 9999999999;
  padding: 16px;
}
</style>
