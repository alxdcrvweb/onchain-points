<template>
  <div class="pageContainer">
    <div class="pageTitle">
      <RouterLink to="/"><img src="../../assets/back.svg" /></RouterLink>
      <div class="pageTitle__content">
        {{pageTitle}}
        <img v-if="verified" src="/verified-gold.svg">
      </div>
    </div>
    <slot/>
  </div>
</template>

<script lang="ts">
export default {
  name: 'PageContainer',
  props: ['pageTitle','verified'],
}

</script>
<style lang="scss">
.pageContainer {
  width: 100%;
  background-size: cover;
  background-position: center;
  color: white;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  justify-content: flex-start;
  position: relative;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  .pageTitle {
    width: 100%;
    position: sticky;
    top: 0px;
    display: grid;
    grid-template-columns: max-content 1fr;
    place-items: center;
    padding: 20px 0;
    background: black;
    z-index: 9999999;
    &__content {
      display: flex;
      align-items: center;
      gap: 7px;
    }
  }
}
</style>
