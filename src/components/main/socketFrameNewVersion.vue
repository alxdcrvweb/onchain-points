<template>
    <!-- <div style="color: white">{{ opacity }}</div>-->
    <!-- <div style="color: white">{{ profile?.hasBoost}} {{ profile?.dailyClickBoosts }}</div>  -->
    <div v-if="showFastClickerMsg" class="fastClickerMsg">
      <div class="content">
        You are clicking too fast
      </div>
    </div>
    <Loader
      v-if="(profile == undefined || !socketConnected) && !DEV_MODE"
      :message="profile == undefined ? 'Loading...' : 'Connecting...'"
    />

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
                <!-- <div style="color: white">{{ aa }}</div> -->
            </div>
<!--            <div class="rowText" :style="{ 'opacity': Number(bb) !== 0 ? 1 : 0 }">⛓ BOOSTED x{{bb}} ⛓</div>-->
<!--                <div class="rowText" :style="{ 'opacity': 1 }">⛓ BOOSTED x{{bb}} ⛓</div>-->
<!--            <div class="rocketContainer"-->
<!--                :style="{ 'left': axisX == 'left' ? '20px' : 'auto', right: axisX == 'right' ? '20px' : 'auto', 'transform': 'translateY(' + axisY + 'px)' }">-->
<!--                <div @touchstart="boost" @touchend="handleTouchEnd" class="rocket"-->
<!--                     @click="boost"-->
<!--                    :class="{ 'show': profile?.hasBoost && profile?.dailyClickBoosts !== 0 }">-->

<!--                    <div>🚀</div>-->
<!--                </div>-->
<!--            </div>-->


            <div class="centry">
                <div :style="{ 'transform': 'translateY(' + clicked + 'px) scale(4)', 'transition': transform + 'ms ease transform' }"
                     @touchstart="click" @touchend="handleTouchEnd"
                >
                  <!--                     @click="click"-->
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


import { activateBoost, disconnectUser } from '@/api/auth';
import userInfoCard from '@/components/main/userInfoCard.vue'
// import lvl from '@/components/main/level.vue'
// import { SocketWrapper } from '@/socketio';
import {DEV_MODE} from '@/utils/variables';
import { useUserStore } from '@/store/app';
import { useProfileStore } from '@/store/profile';
import { storeToRefs } from 'pinia';
//@ts-ignore
import { userInfo } from '@/api/auth';
import { init } from '@/api/a';
import { getLeague } from '@/api/leaderboard';
import { useVibrate } from '@vueuse/core'
import { useBoostStore } from '@/store/boost';
import { Ref, watch, ref } from 'vue';
import FirstSlide from '../preview/firstSlide.vue';
import SecondSlide from '../preview/secondSlide.vue';
import ThirdSlide from '../preview/thirdSlide.vue';
import FourthSlide from '../preview/fourthSlide.vue';
import { clickNew } from '@/api/boost';
import { SocketWrapper } from '@/socket';
import Loader from "@/App.vue";
// import { Haptics, ImpactStyle } from '@capacitor/haptics';

// const hapticsVibrate = async () => {
//   await Haptics.vibrate({
//     duration: 50
//   });
// };

// v-for="i in  getLevel" :key="i"
//@ts-ignore
const pos = ref("touched")
const { vibrate, stop, isSupported } = useVibrate({ pattern: [50] })
const transform = ref(300)
const axisX = ref("left")
const axisY = ref(0)
const currentBoostSize = ref(0)
const v = ref(0)
const bb = ref(0)
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
export default {
    name: 'socketFrame',
    components: {
      Loader,
        userInfoCard, FirstSlide, SecondSlide, ThirdSlide, FourthSlide
    },

    // watch: {
    //     "profile.hasBoost": {
    //         handler: function (val) {
    //             if (val > 0) {
    //                 open.value = true
    //             }
    //             // else {
    //             //     open.value = false
    //             // }
    //         },
    //         immediate: true
    //     }
    // },
    setup() {
        const profileStore = useProfileStore();
        const userStore = useUserStore();
        const boostStore = useBoostStore();
        const { boostSize } = storeToRefs(boostStore)
        const { getJwt } = storeToRefs(userStore);
        const { getLevel, getIsConnected, getCoins, getProfile, getStage, getUpdated, getTooFastClicker  } = storeToRefs(profileStore);
        const socketWR = new SocketWrapper(getJwt.value);
        const profile = ref<any>(undefined)
        const showFastClickerMsg = ref(false)
        const socketConnected = ref(false)
        const load = async () => {
            // init(this.getJwt)
            const info = await userInfo(getJwt.value)
            const res = await getLeague(getJwt.value)
            if (!info.success) {
                console.log(`error`, info)
                return
            }
            console.log(`info`, info)
            // test.value = info
            // profileStore.setUpdated(false)
            profileStore.setProfile({ ...res, ...info.user, hasBoost: false, isConnected: false })
        }
        // clickIntervalTimer.value = setInterval(() => {
        //     clickNew(getJwt.value, currentClicked.value.coins).then(() => {
        //         currentClicked.value = {
        //             coins: 0,
        //             enegry: 0
        //         }
        //     })
        // }, 120000);
        // @ts-ignore
        // window.Telegram.WebView.receiveEvent("back_button_pressed", () => {
        //     console.log('back_button_pressed')
        //     disconnectUser()
        //     navigator.sendBeacon("/api/disconnect")
        // });

        watch(
            () => getProfile.value,
            (prof) => {
                console.log('proffff', prof)
                profile.value = prof;
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
            () => isUpdated.value,
            (val) => {
                console.log("prof", val);
                if (val == true) {
                    load()
                } if (val == false) {
                    profile.value = profileStore.getProfile
                }
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
                    // if (getStage.value !== 4) {
                    //     profileStore.setStage(4)

                    // }
                }

            }
        ),
        watch(()=> getTooFastClicker, (val) => {
          if (val) {
            showFastClickerMsg.value = true
            setTimeout(() => {
              showFastClickerMsg.value = false
            }, 5000)
          } else {
            showFastClickerMsg.value = false
          }
        }),
        watch(getIsConnected, (val) => {
          socketConnected.value = val
        })

        return {
            getLevel,
            getJwt,
            getIsConnected,
            userStore,
            profile: profile,
            profileStore,
            getCoins,
            boostSize,
            transform,
            pos,
            axisY,
            axisX,
            stage,
            v,
            currentBoostSize,
            socketWR,
            boosted,
            open,
            bb,
            test,
            opacity,
            currentClicked,
            stage1,
            showFastClickerMsg,
            DEV_MODE,
            socketConnected,
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
        async boost() {
            bb.value = 10
            this.profileStore.setBoost(false)
            // pos.value = "touched"
            if (this.animationFrameId !== null && bb.value > 0) {
                cancelAnimationFrame(this.animationFrameId);
            }
            try {
                const res = await activateBoost(this.getJwt)
                    bb.value = Number(res.boost.boostSize)
                    setTimeout(() => {
                        bb.value = 0
                        const rndIntX = this.randomIntFromInterval(1, 2)
                        const rndIntY = this.randomIntFromInterval(1, 200)
                        axisY.value = rndIntY
                        if (rndIntX == 1) {
                          axisX.value = "left"
                        } else {
                          axisX.value = "right"
                        }
                        // pos.value = "unactive"
                    }, 4000)

            } catch (error) {
                bb.value = -1
                setTimeout(() => {
                    bb.value = 0
                }, 4000)
                console.log(`error`, error)
            }
        },
        randomIntFromInterval(min: number, max: number) { // min and max included
            return Math.floor(Math.random() * (max - min + 1) + min)
        },
        async load() {
            // init(this.getJwt)
            const info = await userInfo(this.getJwt)
            const res = await getLeague(this.getJwt)
            if (!info.success) {
                console.log(`error`, info)
                return
            }
            console.log(`info`, info)
            // test.value = info
            this.profileStore.setProfile({ ...res, ...info.user, hasBoost: false, isConnected: false })
        },
        changeStage(num: number) {
            stage.value = num
        },
        getPrecents(max: number, value: number) {
            // get 100% precentage from value
            return `${(value / max) * 100}%`

        },
        // checkElapsedTime() {
        //     if (Date.now() - this.lastTouchTime >= 1500) {
        //         // pos.value = "not touched"
        //         currentBoostSize.value = 0
        //         if (this.profile) {
        //             this.profile.hasBoost = false
        //         }
        //
        //     } else {
        //         this.animationFrameId = requestAnimationFrame(this.checkElapsedTime);
        //     }
        // },
        handleTouchEnd() {
            // if (currentBoostSize.value > 0) {
            //     this.lastTouchTime = Date.now();
            //     this.checkElapsedTime();
            // }
            // if (clickDebounceTimer.value !== null) {
            //     clearTimeout(clickDebounceTimer.value);
            // }
            // // clickDebounceTimer.value = setTimeout(() => {
            // //     this.oldClick(); // Вызов функции после 1 секунды бездействия
            // // }, 1000); // 1000 мс = 1 с
        },
        click(e: TouchEvent|MouseEvent) {
            if (this.profile?.energy > this.profile?.clickLevel) {
                // lastTouchTime.value = Date.now();
                this.handleTouchLogic();
                const b = currentBoostSize.value + this.profileStore.profile.clickLevel
                //@ts-ignore
                this.handleCircleCreation(e.touches||1, b);
                this.vibrateIfNeeded();
                this.processClick();
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
        // determineBoostCreation(clickStrength: number) {
        //     //get a number between 1 and 200 inclusive
        //     const seed = Math.floor(Math.random() * 800 + 1);
        //     return seed >= 801 - clickStrength;
        // },
        // getRandomBoostStrength() {
        //     let items = [2, 3, 4, 5];
        //     let weights = [10, 10, 10, 10];
        //     let i;
        //     for (i = 1; i < weights.length; i++) weights[i] += weights[i - 1];
        //     let random = Math.random() * weights[weights.length - 1];
        //     for (i = 0; i < weights.length; i++) if (weights[i] > random) break;
        //     return items[i];
        // },
        // oldClick() {
        //     clickNew(this.getJwt, currentClicked.value.coins).then(() => {
        //         currentClicked.value = {
        //             coins: 0,
        //             enegry: 0
        //         }
        //     })
        // },
        // checkIsBoostClicked() {
        //     if (currentBoostSize.value == 0) {
        //         if (this.profile) {
        //             this.profile.hasBoost = false
        //         }
        //     }
        // },
        // newClick() {
        //     // this.socketWR.click()
        //     // let currentClick = this.profile.clickLevel
        //     const boost = this.determineBoostCreation(this.profile.clickLevel)
        //     if (boost) {
        //         // this.getRandomBoostStrength()
        //         this.profile.hasBoost = true
        //         setTimeout(() => {
        //             this.checkIsBoostClicked()
        //         }, 5000)
        //     }
        //     if (currentBoostSize.value > 0) {
        //         this.profile.energy = this.profile.energy
        //         this.profile.coins = this.profile.coins + this.profile.clickLevel + currentBoostSize.value
        //         currentClicked.value = {
        //             coins: currentClicked.value.coins + this.profile.clickLevel + currentBoostSize.value,
        //             enegry: currentClicked.value.enegry
        //         }
        //         return
        //     }
        //     currentClicked.value = {
        //         coins: currentClicked.value.coins + 1,
        //         enegry: currentClicked.value.enegry + 1
        //     }
        //     this.profile.energy = this.profile.energy - this.profile.clickLevel
        //     this.profile.coins = this.profile.coins + this.profile.clickLevel
        //     return
        //     // currentClicked.points = currentClicked.points + 1
        // },
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
            // this.newClick()
            this.socketWR.click()

            if (currentBoostSize.value > 0) {
                if (boosted.value == 0) {
                    boosted.value = 1
                }
                if (boosted.value == 100) {
                    currentBoostSize.value = 0
                    if (this.profile) {
                        this.profile.hasBoost = false
                    }
                }

            }
            if (boosted.value > 0 && boosted.value <= 110) {
                boosted.value++
                if (boosted.value == 110) {
                    boosted.value = 0
                    open.value = true
                }

            }
        }
    },
    async mounted() {
        await this.socketWR.listen();
        this.socketWR.AuthSocket(this.getJwt)
        this.socketWR.sync()
        // this.load()
        // this.checkElapsedTime();
        console.log('aaaaa');
        if (!this.profileStore.isUpdated) {
            this.profileStore.setUpdated(true)
        } else {
            this.profile = this.profileStore.getProfile
        }
        console.log('this.profile',this.profile)
        // AuthSocket(this.getJwt);
    },
    unmounted() {
        this.socketWR.disconnect();

        // disconnectUser()
        // navigator.sendBeacon("/api/disconnect")
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
        this.socketWR.sync()
        // this.oldClick()

    },

}
</script>
<style lang="scss">
.enn {
    //position: absolute;
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
    width: fit-content;
    position: absolute;
    z-index: 99999999999;
    top: 60px;
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
.fastClickerMsg{
  position: fixed;
  z-index: 9999999999;
  top: 40%;
  left: 16px;
  right: 16px;
  bottom: auto;
  text-align: center;
  height: max-content;
  color: white;
  background: linear-gradient(121.56deg, rgba(245, 2, 2, 0.51) 0%, rgba(204, 23, 23, 0) 12%, rgba(155, 6, 6, 0) 20%, rgba(201, 25, 25, 0.14) 48.5%, rgba(255, 255, 255, 0) 78%, rgba(245, 2, 2, 0) 88.5%, rgba(245, 2, 2, 0.47) 100%);
  padding: 2px;
  .content {
    background: black;
    padding: 8px;
  }
}
</style>
