<template>
    <div class="container">
        <div>
            <section class="welcome-card2">
                <img loading="lazy" src="/grow.png" class="welcome-image" alt="Welcome illustration" />
                <div class="welcome-content">
                    <p class="welcome-title">Ready?</p>
                    <p class="welcome-description">Get the most of what onchain can offer!</p>
                </div>
            </section>
        </div>
        <div>
            <div class="content-wrapper">
                <div class="continue-button" @click="() => changeStage(4)">Let’s go!</div>
                <!-- <div class="bottom-indicator"></div> -->
            </div>
        </div>
    </div>
</template>

<script>
import { useProfileStore } from '@/store/profile';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
const opacity = ref(0);
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
            this.profileStore.setStage(stage);
        }
    },
    mounted() {
        setTimeout(() => {
            opacity.value = 1;
        }, 700);
    }
};
</script>

<style scoped>
.welcome-card2 {
    border-radius: 32px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(38.349998474121094px);
    background-image: url(../../../public/cardbg.svg);
    background-size: auto;
    display: flex;
    width: 345px;
    height: 345px;
    flex-direction: column;
    font-family: Manrope, sans-serif;
    font-weight: 400;
    text-align: center;
    background-position: center;
    padding-top: 40px;
}
</style>
