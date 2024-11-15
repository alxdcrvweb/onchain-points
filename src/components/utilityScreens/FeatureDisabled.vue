<template>
  <div :class="{'fullPageContainer':fullPage}">
    <div class="errorScreenCenter" >
      <div class="errorEmoji">🛠</div>
      <div class="errorTitle">Feature is temporarily disabled</div>
      <div>We are working to optimize it.</div>
    </div>
  </div>
</template>

<script lang="ts">
import FullPageContainer from "@/components/layouts/FullPage.vue";
import Button from "@/components/button/button.vue";

export default {
  name: 'FeatureDisabled',
  components: {Button, FullPageContainer},
  props: {
    fullPage: {
      type: Boolean,
      required: false
    },
  }
}

</script>
<style lang="scss">
.errorScreenCenter {
  width: 100%;
  height: max-content;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background-color: black;
  overflow: hidden;
  font-size: 14px;
  font-family: "Poppins";
  color: white;
  text-align: center;
  padding: 40px 20px;
  .errorEmoji {
    font-size: 50px;
  }
  .errorTitle {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  margin-bottom: 60px;
}

</style>
