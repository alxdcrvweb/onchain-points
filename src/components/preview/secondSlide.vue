<template>
    <div class="container">
        <div>
            <div class="stages">
                <div class="active"></div>
                <div class="active"></div>
                <div class="unactive"></div>
                <div class="unactive"></div>
            </div>
            <div class="welcome-section" :style="{
                'opacity': `${opacity}`
            }">
                <div class="message">Use chain links to upgrade your level
                    <img src="../../assets/chainSmall.png" />
                </div>
                <div class="description">
                    To get the highest rewards, you want to use improvements and upgrade your level.
                </div>

                <img loading="lazy" src="../../assets/upgrade.png" class="icon" />
            </div>
        </div>
        <div class="content-wrapper" :style="{
            'opacity': `${opacity}`
        }">
            <div class="continue-button" v-on:click="() => changeStage(2)">CONTINUE</div>
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
    name: 'secondSlide',
    data(props) {
        const profileStore = useProfileStore();
        return {
            profileStore, opacity
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
    display: flex;
    justify-content: space-between;
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


}

.icon {
    width: 100%;
    margin-top: 30px;
}

.message img {
    height: 158px;
}
</style>
