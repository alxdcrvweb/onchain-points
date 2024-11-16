<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue';
import { useUserStore } from './store/app';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { useProfileStore } from './store/profile';
import { DEV_MODE } from '@/utils/variables';
import '@/styles/global.scss';
import { event } from 'vue-gtag';
import { getGameBotName } from '@/api/squad';
import { checkServerStatus, userInfo } from '@/api/auth';
import ErrorScreen from '@/components/utilityScreens/ErrorScreen.vue';
import Loader from '@/components/utilityScreens/Loader.vue';
import MobileOnly from '@/components/utilityScreens/MobileOnly.vue';
import ErrorNotification from '@/components/utilityScreens/ErrorNotification.vue';
import { getLeague } from '@/api/le-+aderboard';
import { getAvailableBoosts } from '@/api/friends';
import axiosClient from '@/api/api';
import { ImprovementsApi, UnionLevels } from '@/api/boost';
import { useGameStore } from '@/store/gameStore';
import ClaimInterface from '@/components/utilityScreens/ClaimInterface.vue';

const userStore = useUserStore();
const gameStore = useGameStore();
const profileStore = useProfileStore();
const { getIsAuth, getJwt, getClaimInterface } = storeToRefs(userStore);
const { getStage, getProfile, getClaimInfo } = storeToRefs(profileStore);
const profile = ref<any>(undefined);
const footer = ref(true);
const serverStatus = ref(true);
const authStatus = ref<'loading' | 'successful' | 'error'>('loading');
const infoLoadingStatus = ref<'loading' | 'successful' | 'error'>('loading');
const loadingStage = ref(0);

const setLoadingStage = (stage: number) => {
    loadingStage.value = stage;
};

watch(
    () => getProfile.value,
    (prof) => {
        profile.value = prof;
    }
);
onMounted(async () => {
    console.log('mounted');
    auth();
    Telegram.WebApp.ready();
    //@ts-ignore
    window.Telegram.WebApp.setHeaderColor('#131313');
    window.Telegram.WebApp.setBackgroundColor('#131313');
    console.log('process', process.env.VITE_DEV_MODE);

    window.Telegram.WebApp.isClosingConfirmationEnabled = true;
    disableMove2();
});
const stage = ref(0);
watch(
    () => getStage.value,
    (count) => {
        stage.value = count;
    }
);
watch(
    () => profile.value,
    (prof) => {
        if (prof && prof.isBanned) {
            footer.value = false;
        }
    }
);
const scrollableEl = ref<any>(null);
const asd = () => {
    let ts: number | undefined;
    const onTouchStart = (e: TouchEvent) => {
        ts = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
        if (scrollableEl) {
            const scroll = scrollableEl?.value.scrollTop;
            const te = e.changedTouches[0].clientY;
            if (scroll <= 0 && ts! < te) {
                e.preventDefault();
            }
        } else {
            e.preventDefault();
        }
    };

    document.documentElement.addEventListener('touchstart', onTouchStart, { passive: false });
    document.documentElement.addEventListener('touchmove', onTouchMove, { passive: false });
};
const disableMove2 = () => {
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = 'auto';
    const overflow = 100;
    document.body.style.overflowY = 'hidden';
    document.body.style.marginTop = `${overflow + 20}px`;
    document.body.style.height = window.innerHeight + overflow + 'px';
    document.body.style.paddingBottom = `${overflow}px`;
    window.scrollTo(0, overflow);
};
const auth = async () => {
    window.Telegram.WebApp.expand();
    const initData = WebApp.initData;
    const initDataUnsafe = WebApp.initDataUnsafe;
    const dataUser = initDataUnsafe.user as {
        id: number;
        first_name: string;
        last_name: string;
        username: string;
    };
    const res = await validateUser(initData);
    if (!res?.success || !res.info) {
        authStatus.value = 'error';
        return;
    }
    event('user_started_app', {
        user_id: dataUser.id,
        username: dataUser.username
    });
    userStore.setUser(dataUser);
    userStore.setHash(initData);
    userStore.setJwt(res.token);
    userStore.setIsAuth(res.success);
    profileStore.setClaimInfo(res.info);
    authStatus.value = 'successful';
};
const loadProfileInfo = async (jwt: string) => {
    try {
        const info = await userInfo();
        console.log('info load async', info);
        if (!info.success) {
            console.error(`error`, info);
            infoLoadingStatus.value = 'error';
            return;
        }
        profileStore.setProfile({ ...info.user, leagueId: info.user.league! });
        infoLoadingStatus.value = 'successful';
    } catch (e) {
        console.error(`error`, e);
        infoLoadingStatus.value = 'error';
    }
};
</script>
<template>
    <v-app class="app2" ref="scrollableEl" :on-touchmove="() => asd()">
        <!-- <MobileOnly> -->
        <!-- <ServiceWorks v-if="!serverStatus" /> -->
        <div v-if="stage !== 4">
            <FirstSlide v-if="stage == 0" />
            <SecondSlide v-if="stage == 1" />
            <ThirdSlide v-if="stage == 2" />
            <FourthSlide v-if="stage == 3" />
        </div>
        <v-main v-else style="background-color: black">
            <div class="app">
                <router-view />
                <foot v-if="stage == 4 && footer" />
                <ErrorNotification />
            </div>
        </v-main>
        <!-- </MobileOnly> -->
    </v-app>
</template>

<script lang="ts">
import WebApp from '@twa-dev/sdk';
import { validateUser } from './api/auth';

import foot from './components/top/footer.vue';
import '../src/styles/settings.scss';
import { ref } from 'vue';
export default {
    name: 'App',
    components: {
        foot
    },

    data: () => ({
        isValid: false
    }),

    methods: {
        prevent(e?: any) {
            // if(e) {
            //     e.preventDefault();
            // }
            //@ts-ignore
            if (!window.Telegram.WebApp.isExpanded) {
                //@ts-ignore
                window.Telegram.WebApp.expand();
                document.documentElement.style.backgroundColor = 'black';
            }
        },
        isMobile() {
            if (/Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                return true;
            } else {
                return false;
            }
        },
        handleBeforeUnload() {
            console.log('aaaa');
            // disconnectUser()
            navigator.sendBeacon('/api/disconnect');
        }
    },

    mounted() {
        // document.addEventListener("visibilitychange", function logData() {
        //     if (document.visibilityState === "hidden") {
        //         navigator.sendBeacon("/api/disconnect");
        //     }
        // });
        window.Telegram.WebApp.onEvent('popupClosed', () => {
            console.log('The Web App is closing');
            navigator.sendBeacon('/api/disconnect');

            // Perform your clean-up actions here
        });
    }
    // beforeUnmounted() {
    //     disconnectUser()
    //     document.removeEventListener('visibilitychange', this.handleBeforeUnload);
    //     navigator.sendBeacon("/api/disconnect")
    //     // document.removeEventListener('beforeunload', this.handleBeforeUnload);
    // }
};
</script>
<style lang="scss">
body {
    background-color: #131313;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;

    /* box-shadow: 0px 0px 50px 50px rgb(153, 153, 153, 0.15); */
    border: 1px solid black;
}

.app {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    /* background-image: url(./assets/bg.png); */
    background-color: black;
    background-size: cover;
    background-position: top;
    height: 100vh;
    overflow: hidden !important;
    padding: 20px;
    padding-top: 0px;
    width: 100vw;

    font-family: 'Poppins';
    z-index: 1;
}

.v-application__wrap {
    background-color: black !important;
}

.v-application {
    background-color: black !important;
}

.mob {
    text-align: center;
    font-size: 51px;
    font-style: normal;
    font-weight: 400;
    line-height: 80.143px;
    /* 157.143% */
    letter-spacing: 2.55px;
}

.app2 {
    /* position: fixed; */
    top: 0;
    height: 100vh;
    width: 100vw;
    touch-action: none;
}

.isLoading {
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
    font-family: 'Poppins';
    color: white;
}

.isLoading img {
    width: 50px;
    height: 50px;
}

.errorTitle {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 10px;
}
</style>
