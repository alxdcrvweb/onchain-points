<!--
1 show boost rocket on screen flying upward and hide after 4 seconds
2 on click hide rocket and open mini game
3 await for multiplier api call
4 show mini game with 100 clicks
5 on 100 clicks or after 4s finish mini game
6 rocket flies upwards, show result of mini game
6 hide mini game and sum points


-->


<script setup lang="ts">
import {randomIntFromInterval, wait} from "@/utils/utilities";
import { useVibrate } from '@vueuse/core'
import {useProfileStore} from "@/store/profile";
const gameStore = useGameStore();
const {getGame} = storeToRefs(gameStore);
const authStore = useUserStore();
const {getJwt} = storeToRefs(authStore);

const props = defineProps({claimBoostedClicks: Function, boostMultiplier: Number});
const {boostMultiplier} = toRefs(props)
import {onBeforeUnmount, onMounted, ref, toRefs, watch} from "vue";
import {useGameStore} from "@/store/gameStore";
import {storeToRefs} from "pinia";
import {useUserStore} from "@/store/app";
import {RocketApi} from "@/api/boost";

const { vibrate, stop, isSupported } = useVibrate({ pattern: [500] })
const { vibrate:vibrateClick } = useVibrate({ pattern: [50] })
const { vibrate:vibrateStart } = useVibrate({ pattern: [150] })


const {getProfile,setProfile, setBoost, setCoins,setClicks} = useProfileStore();
const align = ref<'left'|'right'>('left');
const axisY = ref(window.innerHeight-150);
const axisX = ref(50);
const rocketQuestStarted = ref(false);
const savedMultiplier = ref(0);
const boostMiniGameStarted = ref(false);
const boostMiniGameClicks = ref(0);
const showMiniGameResult = ref(false);
const rocketFliesAway = ref(false);
const scaleMonster = ref(1);
const randomBoost = ref(2)
const randomInterval = setInterval(() => {
  if(randomBoost.value >= 5) return randomBoost.value = 2;
  randomBoost.value ++
}, 150);



watch(() => getProfile.hasBoost, (has) => {

  randomizePositionInsideScreen(false);
  setTimeout(() => {
    randomizePositionInsideScreen(has);
  }, 0);
});


onMounted(() => {
  randomizePositionInsideScreen(false);
});
onBeforeUnmount(() => {
  clearInterval(randomInterval);
});
const rocketClick = async () => {
  setBoost(false);
  randomizePositionInsideScreen(false);
  if(isSupported) vibrate();
  rocketQuestStarted.value = true;
  await wait(1000)//fetchBoostMultiplier()
  savedMultiplier.value = boostMultiplier?.value||0;
  startMiniGame();

  setTimeout(() => {
    finishMiniGame()
  }, 4000);
};
const hideRocket = () => setBoost(false);
const showMiniGame = () => rocketQuestStarted.value = true;
const startMiniGame = () => {
  boostMiniGameStarted.value = true;
  vibrateStart();
}

const randomizePositionInsideScreen = (appear:boolean) => {
  const randomAlign = Math.floor(Math.random() * 2) + 1;
  axisY.value = appear ? window.innerHeight-180:150;
  axisX.value = 50;
  align.value = randomAlign == 1 ? 'left' : 'right';
};

const boostMiniGameClickHandler = (e:TouchEvent) => {
  if(!boostMiniGameStarted.value) return;
  if(boostMiniGameClicks.value >= 100 ) {
    finishMiniGame()
    return;
  }
  scaleMonster.value = 0.9
  vibrateClick();
  handleCircleCreation(e.touches, 1);
  boostMiniGameClicks.value++;
}
const finishMiniGame = async () => {
  setCoins(getProfile.coins + (boostMiniGameClicks.value*getProfile?.clickLevel*savedMultiplier.value))
  boostMiniGameStarted.value = false;
  rocketFliesAway.value = true;
  vibrate()
  sendBoostResult();
  await wait(2000)
  showMiniGameResult.value = true;
  await wait(3000)
  boostMiniGameClicks.value = 0;
  savedMultiplier.value = 0;
  showMiniGameResult.value = false;
  rocketQuestStarted.value = false;
  rocketFliesAway.value = false;
  randomizePositionInsideScreen(false);
}

// const fetchBoostMultiplier = async () => {
//   const mp = await wait(2000, RocketApi.fetchRocketBoostMultiplier)
//   boostMultiplier.value = mp;
// }


const sendBoostResult = async () =>  props?.claimBoostedClicks && props.claimBoostedClicks(boostMiniGameClicks.value)//await RocketApi.sendRocketResults(boostMiniGameClicks.value)


const removeCircle = (circle: Element): void => {
  circle.remove();
}
const createCircle = (x: number, y: number, text: string): void => {
  const circle = document.createElement('div');
  // v.value = text
  circle.classList.add('touchIndicator');
  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;
  // circle.textContent = text;
  // circle.style.transform = ``;
  document.getElementById('contain')?.appendChild(circle);
  // circle.style.transform = `translateX(${x+10}px) translateY(${y+10}px)`;
  setTimeout(() => {
  requestAnimationFrame(() => removeCircle(circle));
}, 500)
}
const handleCircleCreation = (touches: TouchList, b: number): void => {
  console.log('handleCircleCreation',touches,b)
  for (const touch of Array.from(touches)) {
    createCircle(touch.clientX - 10, touch.clientY - 10, `+${b}`);
  }
};
</script>

<template>
  <div
    class="rocketBoostContainer"
    v-if="getProfile.hasBoost"

    :style="{ top: `${axisY}px`, [align]: `${axisX}px` }"
  >
    <div
      @click="rocketClick"
      class="rocketEmoji"
    >
      <div>👾</div>
    </div>
  </div>

  <div v-if="rocketQuestStarted" class="rocketQuest">
    <div/>
    <div class="rocketQuestBoost">
      <div v-if="savedMultiplier!==0" class="rqbTitle">BOOSTED X{{savedMultiplier}}</div>
      <div v-else class="rqbTitle">BOOSTED X{{randomBoost}}</div>
      <div class="healthBar"><div class="healthBarBar" :style="{width: (100-boostMiniGameClicks)+'%'}"><div class="healthBarPercent">{{ (100-boostMiniGameClicks)+'%' }}</div></div></div>
      <div class="progressBar"><div class="progressBarBar" v-bind:class="{'progressBarBackwardsAnimation':boostMiniGameStarted}"/></div>
      <div v-if="savedMultiplier===0" class="prepare">READY...</div>
      <div v-else-if="boostMiniGameStarted" class="prepare">CLICK!!!</div>
    </div>
    <div
      v-if="!showMiniGameResult"
      @touchstart="boostMiniGameClickHandler"
      @touchend="scaleMonster=1"
      class="rocketQuestEmoji"
      v-bind:class="{rocketFliesAway:rocketFliesAway}
    ">
      <div class="rotate" :style="{fontSize: 190*scaleMonster+'px'}">👾</div>
      <div/>
    </div>
    <div v-if="showMiniGameResult" class="gameResults">
      <img src="../../assets/coin.png" />
      {{boostMiniGameClicks*getProfile?.clickLevel*savedMultiplier}}
    </div>

    <div/>
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


.rocketQuest {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: grid;
  grid-template-rows: 1fr max-content 7fr 1fr;
  place-items: center;
  animation: rocketQuest 1s ease;
  z-index: 9999999999999;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  //background: rgba(0, 0, 0, 0.67);
  font-size: 50px;
  .rocketQuestEmoji {
    //background: #00b0ff;
    width: 60vw;
    height: 60vh;
    font-size: 190px;
    position: relative;
    animation: battleMove 4s infinite linear, rocketQuestEmoji 1s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    //display: grid;
    //grid-template-rows: 1fr max-content max-content;
    //place-items: center;

  }
  .rocketFliesAway {
    animation: trembling 0.1s infinite, rocketQuestAway 2s ease;
  }
  .prepare {
    //position: absolute;
    //left: 50%;
    //transform: translateX(-50%);
    //bottom: -50%;
    font-size: 30px;
    margin-top: 10px;
    color: white;
    text-shadow: 0 0 10px white;
    text-align: center;
    pointer-events: none;
  }
}
@keyframes battleMove {
  0% {
    transform: translate(0, 0);
  }
  15% {
    transform: translate(15px, 50px);
  }
  35% {
    transform: translate(50px, -50px);
  }
  50% {
    transform: translate(0, 0);
  }
  65% {
    transform: translate(-15px, 50px);
  }
  85% {
    transform: translate(-50px, -50px);
  }
  100% {
    transform: translate(0, 0px);
  }
}
@keyframes rocketQuest {
  0% {
    -webkit-backdrop-filter: blur(0px);
    backdrop-filter: blur(0px);

  }
  100% {
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
  }
}
@keyframes rocketQuestEmoji {
  0% {
    margin-top: 1000px;
  }
  100% {
    margin-top: 0;
  }
}
@keyframes rocketQuestAway {
  0% {
    margin-top: 0;
  }
  30% {
    margin-top: -300px;
  }
  100% {
    margin-top: 1000px;
  }
}
.rotate{
  pointer-events: none;
  user-select: none;
  //transform: rotate(-45deg);
}

.rocketQuestBoost {
  .rqbTitle {
    text-align: center;
    font-size: 20px;
    color: white;
    text-shadow: 0 0 10px white;
  }
  .boostClicks {
    text-align: center;
    font-size: 30px;
    color: white;
    text-shadow: 0 0 10px white;
  }
}


.progressBarBackwardsAnimation {
  animation: progressBarBackwards 4s linear;
  width: 0%;
}
@keyframes progressBarBackwards {
  0% {
    width: 100%;
  }
  100% {
    width: 0;
  }
}

.gameResults{
  display: flex;
  align-items: center;
  gap: 8px;
  img {
    width: 50px;
    height: 50px;
  }
  animation: appear .1s ease;
}
@keyframes appear {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.touchIndicator {
  position: fixed;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  z-index: 99999999999999;
  pointer-events: none;
}
.healthBar{
  width: 230px;
  height: 20px;
  background: #333;
  border-radius: 7px;
  position: relative;
  padding: 1px;
  overflow: hidden;
  margin-bottom: 4px;
}
.healthBarBar{
  width: 100%;
  height: 100%;
  background: #ff3c3c;
}
.healthBarPercent{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-outline: 0.5px black;
  font-size: 12px;
}
</style>
