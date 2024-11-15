<template>
    <div :class="{'fullPageContainer':fullPage, 'chain-loader-container':true}">
      <div class="chain-loader">
        <div class="chain-link"></div>
        <div class="chain-link"></div>
        <div class="chain-link"></div>
        <div class="chain-link"></div>
        <div class="chain-link"></div>
        <div class="chain-link"></div>
        <div class="chain-link"></div>
      </div>
      <div v-if="progress" class="progressBar" ><div class="progressBarBar" :style="{width: progress+'%'}"/></div>
      <div v-if="message" class="loaderMessage">{{message}}</div>
    </div>
</template>

<script lang="ts">
import FullPageContainer from "@/components/layouts/FullPage.vue";
import Button from "@/components/button/button.vue";

export default {
  name: 'Loader',
  components: {Button, FullPageContainer},
  props: {
    message: {
      type: String,
      required: false
    },
    fullPage: {
      type: Boolean,
      required: false
    },
    progress: {
      type: Number,
      required: false
    }
  }
}

</script>
<style lang="scss">
.isLoadingScreen {
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

  img {
    width: 50px;
    height: 50px;
  }

}




.chain-loader-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 40px 20px;
}

.loaderMessage {
  font-size: 18px;
  font-family: "Poppins";
  color: white;
  text-align: center;
}


.chain-loader {
  display: flex;
  gap: -8px; /* Adjusted to overlap the links */
  justify-content: center;
  align-items: center;
  transform: translateX(10px);
}

.chain-link {
  width: 50px;
  height: 30px;
  border: 5px solid white;
  border-radius: 20px;
  position: relative;
  margin-left: -20px;
  animation: chain-animation 1.5s infinite reverse;
}

.chain-link:nth-child(2) {
  animation-delay: 0.1s;
  height: 0px;
  border-width: 4px;

}

.chain-link:nth-child(3) {
  animation-delay: 0.2s;
}

.chain-link:nth-child(4) {
  animation-delay: 0.3s;
  height: 0px;
  border-width: 4px;

}

.chain-link:nth-child(5) {
  animation-delay: 0.4s;
}
.chain-link:nth-child(6) {
  animation-delay: 0.4s;
  height: 0px;
  border-width: 4px;

}
.chain-link:nth-child(7) {
  animation-delay: 0.4s;
}

@keyframes chain-animation {
  0% {
    //transform: translateY(0) translateX(0px);
    opacity: 0.3;
  }
  //50% {
  //  opacity: 1;
  //  //transform: translateY(-15px) translateX(20px);
  //}
  100% {
    opacity: 1;
  }
}
.progressBar {
  height: 3px;
  background-color: #484848;
  border-radius: 5px;
  width: 230px;
  position: relative;
  overflow: hidden;
  .progressBarBar {
    height: 100%;
    background-color: #ffffff;
    border-radius: 3px;
  }
}

</style>
