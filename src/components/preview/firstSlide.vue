<template>
    <div class="container">
        <div>
            <div className="stages">
                <div className="active"></div>
                <div className="unactive"></div>
                <div className="unactive"></div>
                <div className="unactive"></div>
            </div>
            <div class="welcome-section" :style="{
                'opacity': `${opacity}`
            }">
                <div class="welcome-message">Welcome to Chain Game Alpha Test!</div>
                <div class="description">
                    Tap and earn chain links for extra onchain coin airdrop points
                </div>

                <img loading="lazy" src="../../assets/click.png" class="click-icon" />
            </div>
        </div>
        <div class="content-wrapper" :style="{
            'opacity': `${opacity}`
        }">
            <div class="continue-button" @click="() => changeStage(1)">CONTINUE</div>
            <!-- <div class="bottom-indicator"></div> -->
        </div>
    </div>
</template>

<script>
import { useProfileStore } from '@/store/profile';
import { storeToRefs } from 'pinia';
import { ref } from "vue";
const opacity = ref(0)
export default {
    name: 'firstSlide',

    data(props) {
        const profileStore = useProfileStore();
        return {
            profileStore,
            opacity
            // Your component's data goes here
        };
    },
    methods: {
        changeStage(stage) {
            this.profileStore.setStage(stage)
        }

    },
    mounted() {
        setTimeout(() => {
            opacity.value = 1
        }, 700)
    },
};
</script>

<style>
.container {
    position: fixed;
    border-radius: 32px 32px 0px 0px;
    display: flex;
    max-width: 393px;
    z-index: 1000000000000;
    height: 100vh;
    top: 25px;
    left: 0;
    padding-top: 32px;
    flex-direction: column;
    background-image: url(../../assets/bg.png);
    justify-content: space-between;

}

.stages {
    align-self: start;
    display: flex;
    margin-left: 24px;
    gap: 8px;
}

.active {
    background-color: white;
    width: 32px;
    height: 3px;
}

.unactive {
    background-color: var(--Whitek-W-16, rgba(255, 255, 255, 0.16));
    width: 32px;
    height: 3px;
}

.content-wrapper {
    display: flex;
    flex-direction: column;
    position: relative;
    display: flex;
    width: 100%;
    padding-bottom: 8px;
    align-items: center;
    font-weight: 400;
    transition: 500ms ease all;
}

.welcome-section {
    position: relative;
    align-self: stretch;
    z-index: 10;
    display: flex;
    width: 100%;
    flex-direction: column;
    padding: 0 24px;
    margin-top: 50px;
    transition: 500ms ease all;
}

.welcome-message {
    letter-spacing: 2px;
    text-transform: uppercase;
    background: linear-gradient(94deg,
            rgba(255, 255, 255, 0.4) -1.07%,
            #fff 32.18%,
            rgba(255, 255, 255, 0.4) 104.41%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font: 40px/40px Poppins, sans-serif;
}

.description {
    color: var(--Whitek-W-100, #fff);
    letter-spacing: -0.48px;
    margin-top: 16px;
    font: 16px/24px Inter, sans-serif;
}

.click-icon {
    object-fit: contain;
    object-position: center;
    align-self: center;
    margin-top: 14px;
    width: 200px;
}

.continue-button {
    position: relative;
    justify-content: center;
    align-items: center;
    background-image: url(../../assets/createButton.png);
    width: 100%;
    max-width: 345px;
    color: var(--Whitek-W-100, #fff);
    white-space: nowrap;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    padding: 16px;
    background-size: contain;
    font: 14px/143% Poppins, sans-serif;
    margin-bottom: 75px;
}
</style>
