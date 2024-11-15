<template>
  <div :class="{'fullPageContainer':fullPage}">
    <div class="errorScreenCenter" >
      <div class="errorEmoji">{{ emoji || '😔' }}</div>
      <div class="errorTitle">{{ title || 'Unknown error' }}</div>
      <div>{{ message || 'Please reload the app' }}</div>
      <Button style="width: 50%; margin-top: 40px" v-if="!hideReloadButton" @click="$router.go(0)">Reload</Button>
    </div>
  </div>
</template>

<script lang="ts">
import FullPageContainer from "@/components/layouts/FullPage.vue";
import Button from "@/components/button/button.vue";

export default {
  name: 'ErrorScreen',
  components: {Button, FullPageContainer},
  props: {
    hideReloadButton: {
      type: Boolean,
      required: false
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    fullPage: {
      type: Boolean,
      required: false
    },
    emoji: {
      type: String,
      required: false
    }
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
