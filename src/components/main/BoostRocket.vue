<script setup lang="ts">
import {wait} from "@/utils/utilities";
import { useVibrate } from '@vueuse/core'
import {useProfileStore} from "@/store/profile";
import {onMounted, ref, watch} from "vue";
import {useGameStore} from "@/store/gameStore";
import {storeToRefs} from "pinia";
import {useUserStore} from "@/store/app";
import {RocketApi} from "@/api/boost";

const gameStore = useGameStore();
const {getGame,getShowEmoji} = storeToRefs(gameStore);
const authStore = useUserStore();
const {getJwt} = storeToRefs(authStore);

const { vibrate, stop, isSupported } = useVibrate({ pattern: [500] })
const { vibrate:vibrateClick } = useVibrate({ pattern: [50] })
const { vibrate:vibrateStart } = useVibrate({ pattern: [150] })


const {getProfile} = useProfileStore();
const align = ref<'left'|'right'>('left');
const axisY = ref(window.innerHeight-150);
const axisX = ref(50);


watch(() => getShowEmoji.value, (has) => {
  console.log('watch getGame?.boosts.boost.showEmoji',has);
  randomizePositionInsideScreen(false);
  setTimeout(() => {
    randomizePositionInsideScreen(has);
  }, 10);
});


onMounted(() => {
  randomizePositionInsideScreen(false);
});

const {claimBoostedClicks} = defineProps({claimBoostedClicks: Function});
const rocketClick = async () => {
  if(isSupported) vibrate();
  gameStore.setShowBoostRocket(false)
  gameStore.setShowIsBoosted(true)
  setTimeout(() => {
    gameStore.setShowIsBoosted(false)
    claimBoostedClicks&&claimBoostedClicks()
  }, 5000)

};


const randomizePositionInsideScreen = (appear:boolean) => {
  const randomAlign = Math.floor(Math.random() * 2) + 1;
  console.log('randomizePositionInsideScreen1',axisY.value, axisX.value, align.value);
  axisY.value = appear ? 150:window.innerHeight-180;
  axisX.value = 50;
  align.value = randomAlign == 1 ? 'left' : 'right';
  console.log('randomizePositionInsideScreen2',axisY.value, axisX.value, align.value);
};

</script>

<template>
  <div
    class="rocketBoostContainer"
    v-if="getGame?.boosts?.boost?.showEmoji"
    :style="{ top: `${axisY}px`, [align]: `${axisX}px` }"
  >
    <div
      @click="rocketClick"
      class="rocketEmoji"
    >
      <div>🚀</div>
    </div>
  </div>
</template>

<style lang="scss">
.rocketBoostContainer {
  position: fixed;
  top: auto;
  left: auto;
  right: auto;
  bottom: auto;
  width: max-content;
  height: max-content;
  transition: all 8s ease;
  z-index: 9999999999;
  transform: rotate(-45deg);
  animation: show 4s;
}
.rocketEmoji {
  font-size: 30px;
  animation: trembling 0.1s infinite;
}
@keyframes show {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes trembling {
  0% {
    transform: translateX(2px);
  }
  50% {
    transform: translateX(0px);
  }
  100% {
    transform: translateX(2px);
  }
}

</style>

