<script setup lang="ts">
import BlockContainer from "@/components/layouts/BlockContainer.vue";
import GridFour from "@/components/layouts/GridFour.vue";

defineProps({
  title: String,
  subtitle: String,
  level: Number,
  nextLevel: Number,
  nextAmount: Number,
  upgradeCost: Number,
  loading: Boolean,
  locked: Boolean,
  maxed: Boolean,
  handler: Function,
})
</script>
<template>
  <Button :loader="loading" :on-click="handler" :disabled="locked||maxed" >
    <div v-if="locked" class="updateLockTop">LOCKED</div>
    <GridFour
      :leftTop="title"
      :leftBottom="!maxed?subtitle+' '+nextAmount:'You reached max level'"
      :rightTop="'⛓ lvl '+nextLevel"
      :rightBottom="!maxed?upgradeCost?.toString():'MAX'"
    />
  </Button>
</template>


<style lang="scss">
.improvementCard {
  display: flex;
  justify-content: space-between;
  //padding: 16px;
  //margin: 16px 0;
  backdrop-filter: blur(10px) invert(5%);
  width: 100%;
  height: max-content;
  align-items: center;
  &.locked {
    filter: blur(1px);
    opacity: 0.7;
  }

}

</style>
