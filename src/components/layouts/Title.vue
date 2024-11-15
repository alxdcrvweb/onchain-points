<template>
  <div class="title">
    <slot/>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Title',
}

</script>
<style lang="scss">
.title {
  margin: 24px 16px 0;
  color: #FFF;
  font-family: Poppins;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
  letter-spacing: 0.8px;
  text-transform: uppercase;
}
</style>
