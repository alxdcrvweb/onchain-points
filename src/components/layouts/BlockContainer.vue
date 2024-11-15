<template>
  <!--  <div :class="scale.value?'touchedAnim':''">-->
  <div :class="!reverseGradient?'containerBorder':'containerBorder reverse'" >
    <div :style="{'background':backgroundColor,'padding':padding}" class="containerBG">
          <slot/>
    </div>
  </div>
  <!--  </div>-->
</template>

<script lang="ts">
import {ref} from "vue";
export default {
  name: 'BlockContainer',
  props: {
    reverseGradient: Boolean,
    backgroundColor: String,
    padding: String,
  },
}


</script>
<style lang="scss">
.containerBorder {
  color: white;
  padding: 1px;
  text-decoration: none;
  width: 100%;
  border: 0;
  background: linear-gradient(121.56deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 12%, rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 0.14) 48.5%, rgba(255, 255, 255, 0) 78%, rgba(255, 255, 255, 0) 88.5%, rgba(255, 255, 255, 0.17) 100%);

  .containerBG {
    padding: 16px;
    background: black;
    width: 100%;
  }
}
.reverse {
  background: linear-gradient(80.56deg, rgba(255, 255, 255, 0.17) 0%, rgba(255, 255, 255, 0) 12%, rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 0.12) 48.5%, rgba(255, 255, 255, 0) 78%, rgba(255, 255, 255, 0) 88.5%, rgba(255, 255, 255, 0.21) 100%);
}
</style>
