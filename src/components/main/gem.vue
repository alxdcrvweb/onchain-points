<script setup lang="ts">

import {useProfileStore} from "@/store/profile";
import {onMounted, ref, watch} from "vue";
import { useVibrate } from '@vueuse/core'
import Button from "@/components/button/button.vue";
import GemMenu from "@/components/main/gemMenu.vue";
const { vibrate, stop, isSupported } = useVibrate({ pattern: [500] })
const {getProfile,setProfile, setGem} = useProfileStore();
const align = ref<'left'|'right'>('left');
const axisY = ref(0);
const axisX = ref(0);
const interval = ref<any>(null);
const animateGemClick = ref(false);

const openGemMenu = ref(false);

watch(() => getProfile.hasGem, (has) => {
  if(has){
    interval.value = setInterval(() => {
      randomizePositionInsideScreen();
    }, 1000);
  } else {
    clearInterval(interval.value);
  }
});


onMounted(() => {
  randomizePositionInsideScreen();
});
const gemClick = async () => {
  if(animateGemClick.value) return;
  clearInterval(interval.value);
  centerGem();
  animateGemClick.value = true;
  if(isSupported) vibrate();
  setTimeout(() => {
    setGem(false);
    animateGemClick.value = false;
    openGemMenu.value = true;
    randomizePositionInsideScreen();
  }, 1500);
};
const closeGemMenu = () => {
  openGemMenu.value = false;
};


const randomizePositionInsideScreen = () => {
  const width = window.innerWidth;
  const height = window.innerHeight-250;
  const randomY = Math.floor(Math.random() * height) + 1;
  const randomX = Math.floor(Math.random() * 100) + 1;
  const randomAlign = Math.floor(Math.random() * 2) + 1;
  axisY.value = randomY+150;
  axisX.value = randomAlign == 1 ? randomX+20 : width-randomX-20
  // align.value = randomAlign == 1 ? 'left' : 'right';
  console.log('randomizePositionInsideScreen',axisY.value,axisX.value,align.value)
};
const centerGem = () => {
  axisY.value = window.innerHeight/2;
  axisX.value = window.innerWidth/2;
};

</script>

<template>
  <div
    class="gemContainer"
    v-if="getProfile.hasGem"
    :style="{ top: `${axisY}px`, [align]: `${axisX}px` }"
  >
    <div @touchstart="gemClick" :class="{'gemEmoji':true, 'tremor':animateGemClick}">
      <div :class="{'appear':true, 'scale':animateGemClick}">💎</div>
    </div>
  </div>
  <GemMenu v-if="openGemMenu" :close="closeGemMenu" />
</template>

<style lang="scss">
.gemContainer {
  position: fixed;
  top: auto;
  left: auto;
  right: auto;
  bottom: auto;
  width: max-content;
  height: max-content;
  transition: all 1s ease;
  z-index: 9999999999;
  transform: translate(-50%, -50%);
}
.gemEmoji {
  font-size: 30px;
  &.tremor {
    animation: tremor 0.1s ease infinite;
  }
}

.appear {
  animation: show 8s;
  &.scale {
    animation: scale 1.5s ease;
  }
}

@keyframes show {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
@keyframes scale {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(3);
  }
}
@keyframes tremor {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>
