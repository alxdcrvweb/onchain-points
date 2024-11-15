<template>
  <div class="column">
    <slot/>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Column',
}

</script>
<style lang="scss">
.column {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
