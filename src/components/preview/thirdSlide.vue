<template>
    <div class="container">
        <div>
            <section class="welcome-card">
                <img loading="lazy" src="/cube.png" class="welcome-image" alt="Welcome illustration" />
                <div class="welcome-content">
                    <p class="welcome-title">Building <br /><span>onchain</span>?</p>
                    <p class="welcome-description">
                        We invite both projects and users to connect and benefit. Builders can apply for their projects
                        to be featured in Chain Game. Look for the APPLY button inside the app for details.
                    </p>
                </div>
            </section>
        </div>
        <div>
            <div className="stages">
                <div className="active"></div>
                <div className="active"></div>
                <div className="active"></div>
            </div>
            <div
                class="content-wrapper"
            >
                <div class="continue-button" @click="() => changeStage(3)">Noted!</div>
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
    name: 'thirdSlide',
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

</style>
