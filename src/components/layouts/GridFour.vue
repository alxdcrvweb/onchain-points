<template>
  <div class="gridFour__flex">
    <div>
      <div class="gridFour__title"><slot/>{{leftTop}}</div>
      <div class="gridFour__subtitle">{{leftBottom}}</div>
    </div>
    <div>
      <div class="gridFour__subtitle right">{{ rightTop }}</div>
      <div class="gridFour__title right">{{ rightBottom }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  leftTop: String,
  leftBottom: String,
  rightTop: String,
  rightBottom: String,
  chevron: Boolean,
})

</script>
<style lang="scss">
.gridFour {
  &__flex {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
  }
  &__title {
    font-size: 14px;
    display: flex;
    align-items: center;
    text-align: left;
    &.right {
      display: flex;
      justify-content: flex-end;
      text-align: right;
    }
  }
  &__subtitle {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.65);
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: left;
    &.right {
      display: flex;
      justify-content: flex-end;
      text-align: right;
    }
  }
}
</style>
