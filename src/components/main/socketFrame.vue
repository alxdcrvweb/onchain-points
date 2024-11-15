<template>
    <!-- <div style="color: white">{{ opacity }}</div>
    <div style="color: white">{{ stage }}</div> -->
    <div v-if="profile == undefined" >
        <img src="../../assets/loader.gif" />
    </div>
    <div v-else-if="profile && profile.isFirstTime && stage !== 4">
        <FirstSlide v-if="stage == 0" />
        <SecondSlide v-if="stage == 1" />
        <ThirdSlide v-if="stage == 2" />
        <FourthSlide v-if="stage == 3" />
    </div>

    <div v-else-if="stage == 4" class="frame__container" id="contain" :sftyle="{
        'opacity': `${opacity}`
    }">
        <div class="clicker">
            <div class="temp">
                <userInfoCard />
              <div class="rowText" v-if="boostMultiplier>0&&getGameBoosts.boost.showIsBoosted">
                <span style="transform: rotate(-45deg)">🚀</span>
                &nbsp;BOOSTED X{{ boostMultiplier }}&nbsp;
                <span style="transform: rotate(-45deg)">🚀</span>
              </div>
            </div>

            <BoostRocket :boostMultiplier="boostMultiplier" :claim-boosted-clicks="sendBoostedClicks" />
            <Boss  :boost-multiplier="boostMultiplier" :claim-boosted-clicks="sendBoostedClicks" />
            <Gem v-if="getBoosts?.remainingGems && getBoosts?.remainingGems>0" />


            <div class="centry touchAction">
                <div :style="{ 'transform': 'translateY(' + clicked + 'px) scale(4)', 'transition': transform + 'ms ease transform' }"
                    @touchstart="click" @touchend="handleTouchEnd">
                    <img src="../../assets/chain.png" class="chain" />
                </div>
            </div>
            <div class="enn">{{ profile?.energy > 0 ? profile?.energy.toFixed(0) : 0 }}</div>
            <div class="energy">
                ⚡️<div class="userEnergyRank">
                    <div class="userEnergyFillRank"
                        :style="{ 'width': getPrecents(profile?.maxEnergy, Number(profile?.energy.toFixed(2))) }"></div>
                </div>
                <div class="qqwe">{{ profile?.energy.toFixed(0) }}
                </div>
            </div>
        </div>

    </div>

</template>

<script lang="ts">


import { activateBoost } from '@/api/auth';
import userInfoCard from '@/components/main/userInfoCard.vue'
import { useUserStore } from '@/store/app';
import { useProfileStore, Boosts } from '@/store/profile';
import { storeToRefs } from 'pinia';
import { useVibrate } from '@vueuse/core'
import { useBoostStore } from '@/store/boost';
import { Ref, watch, ref } from 'vue';
import FirstSlide from '../preview/firstSlide.vue';
import SecondSlide from '../preview/secondSlide.vue';
import ThirdSlide from '../preview/thirdSlide.vue';
import FourthSlide from '../preview/fourthSlide.vue';
import {clickNew, RocketApi} from '@/api/boost';
import { SocketWrapper } from '@/socket';
import {useAppStore} from "@/store/application";
import {boostProbability} from "@/utils/utilities";
import Boss from "@/components/main/Boss.vue";
import BoostRocket from "@/components/main/BoostRocket.vue";
import {useGameStore} from "@/store/gameStore";
import {boostChances, disabledFeatures} from "@/utils/variables";


const pos = ref("touched")
const { vibrate, stop, isSupported } = useVibrate({ pattern: [50] })
const transform = ref(300)
const axisX = ref("left")
const axisY = ref(0)
const currentBoostSize = ref(0)
const v = ref(0)
const boosted = ref(0)
const open = ref(true)
const test = ref(false)
const lastTouchTime: Ref<number> = ref(Date.now());
const animationFrameId: Ref<number | null> = ref(null);
const stage = ref(0)
const opacity = ref(0)
const clickIntervalTimer = ref(null as NodeJS.Timeout | null);
const clickDebounceTimer = ref(null as NodeJS.Timeout | null);
const currentClicked = ref({
    coins: 0,
    enegry: 0
})
const stage1 = ref(0)
const isUpdated = ref<boolean | undefined>(undefined)
const boostMultiplier = ref(0)
const clicksWithBoost = ref(0)
export default {
    name: 'socketFrame',
    components: {
      BoostRocket,
      Boss,
        userInfoCard, FirstSlide, SecondSlide, ThirdSlide, FourthSlide
    },

    setup() {
        const profileStore = useProfileStore();
        const userStore = useUserStore();
        const boostStore = useBoostStore();
        const appStore = useAppStore();
        const { boostSize } = storeToRefs(boostStore)
        const { getJwt } = storeToRefs(userStore);
        const { getLevel, getIsConnected, getCoins, getProfile, getBoosts, getStage, getUpdated } = storeToRefs(profileStore);
        const socketWR = new SocketWrapper(getJwt.value);
        const profile = ref<any>(undefined)
        const boosts = ref<Boosts|undefined>(undefined)
        const gameStore = useGameStore();
        const {getGameBoosts} = storeToRefs(gameStore)

        clickIntervalTimer.value = setInterval(() => {
            clickNew(currentClicked.value.coins).then(() => {
                currentClicked.value = {
                    coins: 0,
                    enegry: 0
                }
            })
        }, 120000);

        const loadProfile = () => {
          console.log("getProfile.value", getProfile.value)
          profile.value = getProfile.value
        }
        const loadBoosts = () => {
          boosts.value = getBoosts.value
          console.log("getBoosts.value", getBoosts.value, boosts.value, boosts?.value?.remainingGems)
        }

        watch(
            () => getProfile.value,
            (prof) => {
                console.log("prof.value", prof)
                loadProfile()
            }
        )

        watch(
            () => getUpdated.value,
            (prof) => {
                console.log("prof", prof);
                isUpdated.value = prof
            }
        )

        watch(
            () => getStage.value,
            (prof) => {
                stage.value = prof;
                if (prof == 4) {
                    setTimeout(() => {
                        opacity.value = 1
                    }, 500)

                }
            }
        )
        watch(
            () => profile.value,
            (prof) => {
                if (prof && !prof.isFirstTime) {
                    stage.value = 4;

                    setTimeout(() => {
                        opacity.value = 1
                    }, 500)
                    if (getStage.value !== 4) {
                        profileStore.setStage(4)

                    }
                }

            }
        )
        return {
            getLevel,
            getJwt,
            getIsConnected,
            userStore,
            profile: profile,
            profileStore,
            getCoins,
            getProfile,
            loadProfile,
            boostSize,
            transform,
            pos,
            axisY,
            axisX,
            stage,
            v,
            boosts,
            loadBoosts,
            getBoosts,
            currentBoostSize,
            socketWR,
            boosted,
            open,
            test,
            opacity,
            currentClicked,
            stage1,
            boostMultiplier,
          gameStore,
          getGameBoosts,
            // isSupported
        };
    },

    data: () => ({
        dialog: false,
        progressBar: 0,
        clicked: 0,
        lastTouchTime: 0,
        animationFrameId: null as number | null

    }),

    methods: {
        async boost(type: 'rocket' | 'boss') {
          const multiplier = await RocketApi.fetchRocketBoostMultiplier()
          if(!multiplier) return
          this.boostMultiplier = multiplier
          if(type==='rocket') this.gameStore.setShowBoostRocket(true)
          if(type==='boss') this.profileStore.setBoost(true)

        },

        async sendBoostedClicks(clicks?:number) {
          const clicksWB = clicks || clicksWithBoost.value
          this.gameStore.setShowIsBoosted(false)
          await RocketApi.sendRocketResults(clicksWB>100?100:clicksWB)
          this.profileStore.setRemainingRockets('-')
          clicksWithBoost.value = 0
          boostMultiplier.value = 0

        },

        changeStage(num: number) {
            stage.value = num
        },
        getPrecents(max: number, value: number) {
            // get 100% precentage from value
            return `${(value / max) * 100}%`

        },
        checkElapsedTime() {
            if (Date.now() - this.lastTouchTime >= 1500) {
                // pos.value = "not touched"
                currentBoostSize.value = 0
                if (this.profile) {
                    this.profile.hasBoost = false
                }

            } else {
                this.animationFrameId = requestAnimationFrame(this.checkElapsedTime);
            }
        },
        someBoostIsActive() {
            return this.getProfile.hasGem||this.getProfile.hasBoost||this.getGameBoosts.boost.showIsBoosted||this.getGameBoosts.boost.showEmoji
        },
        checkGemProbability() {
          if (this.someBoostIsActive()||disabledFeatures.gems||this.getBoosts.remainingGems<=0) return
          else boostProbability(boostChances.gem) && this.profileStore.setGem(true)
        },
        checkRocketProbability() {
          if (this.someBoostIsActive()||disabledFeatures.boss||this.getBoosts.remainingRockets<=0) return
          else boostProbability(boostChances.boss) && this.boost('boss')//this.profileStore.setBoost(true)
        },
        checkBoostProbability() {
          if(this.someBoostIsActive()||disabledFeatures.rockets||this.getBoosts.remainingRockets<=0) return
          else boostProbability(boostChances.rocket) && this.boost('rocket')
        },
        handleTouchEnd() {
            if (currentBoostSize.value > 0) {
                this.lastTouchTime = Date.now();
                this.checkElapsedTime();
            }
            if (clickDebounceTimer.value !== null) {
                clearTimeout(clickDebounceTimer.value);
            }
            clickDebounceTimer.value = setTimeout(() => {
                this.oldClick(); // Вызов функции после 1 секунды бездействия
            }, 1000); // 1000 мс = 1 с
        },
        click(e: TouchEvent) {
            e.preventDefault()
            if (this.profile?.energy > this.profile?.clickLevel || this.getGameBoosts?.boost.showIsBoosted) {
                if(clicksWithBoost.value >= 100) {
                    this.sendBoostedClicks()
                }
                lastTouchTime.value = Date.now();
                this.handleTouchLogic();
                const b = this.profileStore.profile.clickLevel * (this.getGameBoosts?.boost.showIsBoosted?this.boostMultiplier:1)
                this.handleCircleCreation(e.touches, b);
                this.vibrateIfNeeded();
                this.processClick();
                this.checkGemProbability();
                this.checkRocketProbability();
                this.checkBoostProbability();
            }
        },

        handleTouchLogic(): void {
            pos.value = "touched";
            if (animationFrameId.value !== null) {
                cancelAnimationFrame(animationFrameId.value);
            }
        },

        handleCircleCreation(touches: TouchList, b: number): void {
            for (const touch of Array.from(touches)) {
                this.createCircle(touch.clientX - 10, touch.clientY - 10, `+${b}`);
            }
        },

        createCircle(x: number, y: number, text: string): void {
            const circle = document.createElement('div');
            // v.value = text
            circle.classList.add('circle');
            circle.style.left = `${x}px`;
            circle.style.top = `${y}px`;
            circle.textContent = text;
            if(this.getGameBoosts.boost.showIsBoosted) circle.classList.add('circleBoosted')
            // circle.style.transform = ``;
            document.getElementById('contain')?.appendChild(circle);
            // circle.style.transform = `translateX(${x+10}px) translateY(${y+10}px)`;
            setTimeout(() => {
                requestAnimationFrame(() => this.removeCircle(circle));
            }, 500)
        },

        removeCircle(circle: Element): void {
            circle.remove();
        },

        vibrateIfNeeded(): void {
            if (isSupported) {
                vibrate();
            }
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
        },
        determineBoostCreation(clickStrength: number) {
            //get a number between 1 and 200 inclusive
            const seed = Math.floor(Math.random() * 800 + 1);
            return seed >= 801 - clickStrength;
        },
        getRandomBoostStrength() {
            let items = [2, 3, 4, 5];
            let weights = [10, 10, 10, 10];
            let i;
            for (i = 1; i < weights.length; i++) weights[i] += weights[i - 1];
            let random = Math.random() * weights[weights.length - 1];
            for (i = 0; i < weights.length; i++) if (weights[i] > random) break;
            return items[i];
        },
        oldClick() {
            clickNew(currentClicked.value.coins).then(() => {
                currentClicked.value = {
                    coins: 0,
                    enegry: 0
                }
            })
        },
        checkIsBoostClicked() {
            if (currentBoostSize.value == 0) {
                if (this.profile) {
                    this.profile.hasBoost = false
                }
            }
        },
        newClick() {
            // this.socketWR.click()
            // let currentClick = this.profile.clickLevel
            // const boost = this.determineBoostCreation(this.profile.clickLevel)
            // if (boost) {
                // this.getRandomBoostStrength()
                // this.profile.hasBoost = true
                // setTimeout(() => {
                //     this.checkIsBoostClicked()
                // }, 5000)
            // }
            if (boostMultiplier.value > 0 && this.getGameBoosts.boost.showIsBoosted) {
                if(clicksWithBoost.value>=100) {
                    this.sendBoostedClicks()
                    return;
                }
                this.profile.coins += this.profile.clickLevel * boostMultiplier.value
                // currentClicked.value = {
                //     coins: currentClicked.value.coins + this.profile.clickLevel + boostMultiplier.value,
                //     enegry: currentClicked.value.enegry
                // }
                clicksWithBoost.value++
                return
            } else {
                currentClicked.value = {
                  coins: currentClicked.value.coins + 1,
                  enegry: currentClicked.value.enegry + 1
                }
                this.profile.energy = this.profile.energy - this.profile.clickLevel
                this.profile.coins = this.profile.coins + this.profile.clickLevel
                return
            }

        },
        processClick(): void {
            if (this.clicked >= 1850) {
                transform.value = 0
                this.clicked = -1863
            }

            setTimeout(() => {
                transform.value = 300
                this.clicked = this.clicked + 40
            }, 0)

            // this.oldClick()
            this.newClick()
            // if (currentBoostSize.value > 0) {
            //     if (boosted.value == 0) {
            //         boosted.value = 1
            //     }
            //     if (boosted.value == 100) {
            //         currentBoostSize.value = 0
            //         if (this.profile) {
            //             this.profile.hasBoost = false
            //         }
            //     }
            //
            // }
            // if (boosted.value > 0 && boosted.value <= 110) {
            //     boosted.value++
            //     if (boosted.value == 110) {
            //         boosted.value = 0
            //         open.value = true
            //     }
            //
            // }
        }
    },

     mounted() {
        this.socketWR.listen()
        this.socketWR.AuthSocket(this.getJwt)
        this.checkElapsedTime()
      this.profileStore.setUpdated(true)
      this.profileStore.setUpdated(false)
      this.loadProfile()
       this.loadBoosts()


    },
    unmounted() {
        this.socketWR.disconnect();
    },
    beforeUnmount() {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
        }
        if (clickDebounceTimer.value !== null) {
            clearTimeout(clickDebounceTimer.value);
        }
        if (clickIntervalTimer.value !== null) {
            clearInterval(clickIntervalTimer.value);
        }
        this.oldClick()

    },

}
</script>
<style>
.enn {
    /* position: absolute; */
    color: white;
    font-size: 12px;
    top: auto;
    align-self: flex-end;
    transform: translateY(-120px) translateX(20px);
    z-index: 5;
    left: auto;
    right: 10px;
}

.circle {
    position: fixed;
    width: 0px;
    height: 0px;
    top: 0;
    color: white;
    left: 0;
    /* background-color: red; */
    border-radius: 50%;
    z-index: 6000;
    font-size: 30px;
    transition: transform 1s ease;
    animation: click-animation 1s ease;
    pointer-events: none
}
.circleBoosted {
    font-size: 40px;

}

.isLoading {
    width: 100vw;
    height: 100vh;
    position: absolute;
    display: flex;
    justify-content: center;
    top: 0;
    z-index: 9999999999999999;
    align-items: center;
    background-color: rgba(0, 0, 0, 1);
    left: 0;

    img {
        width: 50px;
        height: 50px;
    }

}

.rowText {
    display: flex;
    justify-content: center;
    font-size: 20px;
    align-items: center;
    width: 100%;
    text-align: center;
    //position: absolute;
    z-index: 99999999999;
    //top: 60px;
    color: white;
}

.energy {
    position: absolute;
    top: auto;
    bottom: 130px;
    display: flex;
    justify-content: center;
    backdrop-filter: blur(5px);
    width: calc(100% - 40px);
    align-items: center;
    font-size: 12px;
    padding-top: 10px;
    padding-bottom: 10px;
    z-index: 1;
    font-family: "HelveticaNeueMedium";
    color: white !important;
}

.qqwe {
    width: 30px;
    color: white !important;
    opacity: 0;
}

/* .coins {
    display: flex;
    font-size: 40px;
    font-family: "HelveticaNeueMedium";
    justify-content: center;
    align-items: center;
    width: 100%;
} */

.userEnergyRank {
    width: 100%;
    height: 4px;
    background-color: #2F2F2F;
    border-radius: 10px;
    margin-left: 10px;
    margin-right: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
}

.userEnergyFillRank {
    height: 4px;
    background-color: white;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

@keyframes click-animation {
    0% {
        transform: translateY(0px);
        opacity: 1;
    }

    100% {
        transform: translateY(-100px);
        opacity: 0;
    }
}

.frame__container {
    width: 100%;
    background-size: cover;
    background-position: center;
    color: white;
    height: 100vh;
    margin-bottom: -85px;
    /* overflow: hidden; */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    touch-action: none;
    transition: 500ms ease all;
}

.blue {
    background-color: blue;

}

.rocketContainer {
    position: absolute;
    width: 60px;
    /* transition: 1000ms ease all; */
    top: 250px;
    height: 50px;
    /* height: 100vh; */
    overflow: hidden;
    font-size: 40px;
    z-index: 4000;
}

.rocket {

    /* transform: translateY(1000px); */
    opacity: 0;
    transition: 500ms ease all;
    pointer-events: none;

    div {
        width: 100%;
    }
}

.show {
    opacity: 0;
    pointer-events: auto !important;
}

.rocket.show {
    animation: fadeOut 5s ease;
}

@keyframes fadeOut {
    15% {
        opacity: 1;
    }

    95% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}

.centry {
    display: flex;
    justify-content: center;
    z-index: 0;

    img {
        object-fit: contain
    }
}
.touchAction {
  touch-action: none !important;
  -webkit-touch-callout: none;
}

.round {
    width: 100px;
    height: 100px;
    border-radius: 100%;
    background-color: rgb(254, 0, 0);
    display: grid;
    grid-template-columns: repeat(4, auto);
}

.game {

    display: flex;
    justify-content: center;
    align-items: center;
}

.towns {
    display: grid;
    grid-template-columns: repeat(3, auto);

}

.chain {
    transition: 150ms ease all;
    width: 100%;
    z-index: -1;
    transform: scale(3);
    height: 403px;
    object-fit: contain;
    /* touch-action: none; */
    /* overflow: hidden */
}

.chainContainer {
    /* touch-action: none; */
    transition: 100ms ease transform;
}

.clicker {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    width: 100%;
    padding: 20px;
    /* overflow: hidden; */
}

.temp {
    z-index: 1;
    background-color: black;
    width: 100vw;
    margin-top: -20px;
}
</style>
