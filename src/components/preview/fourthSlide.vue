<template>
    <div class="container">

        <div>
            <div class="stages">
                <div class="active"></div>
                <div class="active"></div>
                <div class="active"></div>
                <div class="active"></div>
            </div>
            <div class="welcome-section">


            </div>
        </div>
        <img loading="lazy" src="../../assets/welcome.png" class="icon2" :style="{
            'opacity': `${opacity}`
        }" />
        <div><img class="chain-main" src="../../assets/chains-1.png" :style="{
            'opacity': `${opacity}`
        }" /></div>
        <div class="content-wrapper" :style="{
            'opacity': `${opacity}`
        }">
            <div class="continue-button" v-on:click="() => changeStage(4)">PLAY</div>
            <!-- <div class="bottom-indicator"></div> -->
        </div>

    </div>
</template>

<script>
import { useProfileStore } from '@/store/profile';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
const opacity = ref(0)
export default {
    name: 'fourthSlide',
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

<style scoped>
.message {
    width: 100%;
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
    max-width: 306px;


}

.message div {

    color: rgba(241, 145, 1, 0.7) !important;
    background: none !important;
    background-clip: auto !important;
    -webkit-background-clip: auto !important;
    -webkit-text-fill-color: rgba(241, 145, 1, 0.7) !important;
}

.icon2 {
    width: calc(100% - 40px);
    margin-top: 30px;
    backdrop-filter: blur(10px);
    margin-left: 20px;
    margin-right: 20px;
    object-fit: contain;
    transition: 500ms ease all;
}

.chain-main {
    position: absolute;
    z-index: -1000;
    top: 30px;
    transition: 500ms ease all;
}

.description {
    max-width: 306px;
}

.message img {
    height: 158px;
}
</style>
