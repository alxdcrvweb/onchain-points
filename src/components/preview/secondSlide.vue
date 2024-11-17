<template>
    <div class="container">
        <div>
            <section class="welcome-card">
                <img loading="lazy" src="/cup.png" class="welcome-image" alt="Welcome illustration" />
                <div class="welcome-content">
                    <p class="welcome-title"><span>Engage </span>with projects</p>
                    <p class="welcome-description">
                        Projects allocate $onchain tokens to the App’s prize pool, promoting their products, channels,
                        or airdrops. Users earn rewards by completing incentivized tasks.
                    </p>
                </div>
            </section>
        </div>
        <div>
            <div className="stages">
                <div className="active"></div>
                <div className="active"></div>
                <div className="unactive"></div>
            </div>
            <div
                class="content-wrapper"
            >
                <div class="continue-button" @click="() => changeStage(2)">Gotcha!</div>
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
    name: 'secondSlide',
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
.message {
    display: flex;
    justify-content: space-between;
    width: 100%;
    letter-spacing: 2px;
    text-transform: uppercase;
    background: linear-gradient(94deg, rgba(255, 255, 255, 0.4) -1.07%, #fff 32.18%, rgba(255, 255, 255, 0.4) 104.41%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font:
        40px/40px Poppins,
        sans-serif;
}

.icon {
    width: 100%;
    margin-top: 30px;
}

.message img {
    height: 158px;
}
</style>
