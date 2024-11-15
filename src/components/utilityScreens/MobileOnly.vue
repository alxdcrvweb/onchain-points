<template>
  <div v-if="!isMobile() && !DEV_MODE() " class="betterOnMobile">
    <div> The game is better on mobile.</div>
    <div>Open the app on your phone to continue</div>
    <div class="mob">📱</div>
  </div>
  <slot v-else/>
</template>

<script lang="ts">
import FullPageContainer from "@/components/layouts/FullPage.vue";
import Button from "@/components/button/button.vue";
import {DEV_MODE} from "@/utils/variables";

export default {
  name: 'MobileOnly',
  components: {Button, FullPageContainer},
  props: {
    message: {
      type: String,
      required: false
    },
    fullPage: {
      type: Boolean,
      required: false
    }
  },
  methods: {
    DEV_MODE() {
      return DEV_MODE
    },
    isMobile() {
      if (/Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        return true
      } else {
        return false
      }
    },
  }
}

</script>
<style lang="scss">
.betterOnMobile {
  width: 100vw;
  height: 100vh;
  position: absolute;
  display: flex;
  justify-content: center;
  flex-direction: column;
  top: 0;
  z-index: 9999999;
  align-items: center;
  background-color: black;
  left: 0;
  overflow: hidden;
  font-size: 14px;
  font-family: "Poppins";
  color: white;

  .mob {
    font-size: 50px;
  }

}

</style>
