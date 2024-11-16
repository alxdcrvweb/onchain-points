<template>
    <div class="container">
        <div>
            <section class="welcome-card">
                <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/9a63818aa80a7fdcac9f1d05b2c4271cabf950775a141c70427b4ab1ba0d3aad?placeholderIfAbsent=true&apiKey=2c86edb590ef47c3b40bb8bea5c66e15"
                    class="welcome-image"
                    alt="Welcome illustration"
                />
                <div class="welcome-content">
                    <h1 class="welcome-title">Welcome to the new <span>onchain era</span></h1>
                    <p class="welcome-description">
                        The Chain Game is being transformed
                        <br />to better serve the community and support promising projects.
                    </p>
                </div>
            </section>
        </div>
        <div>
            <div className="stages">
                <div className="active"></div>
                <div className="unactive"></div>
                <div className="unactive"></div>
            </div>
            <div
                class="content-wrapper"
                :style="{
                    opacity: `${opacity}`
                }"
            >
                <div class="continue-button" @click="() => changeStage(1)">CONTINUE</div>
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

<style>
.container {
    position: fixed;
    border-radius: 32px 32px 0px 0px;
    display: flex;
    max-width: 403px;
    z-index: 1000000000000;
    width: 100vw;
    height: 100vh;
    top: 25px;
    left: 0;
    padding-top: 32px;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
}

.stages {
    align-self: start;
    display: flex;
    width: 100%;
    gap: 8px;
    justify-content: center;
    margin-bottom: 32px;
}

.active {
    background-color: #f6a800;
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
    background: linear-gradient(94deg, rgba(255, 255, 255, 0.4) -1.07%, #fff 32.18%, rgba(255, 255, 255, 0.4) 104.41%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font:
        40px/40px Poppins,
        sans-serif;
}
.welcome-card {
    border-radius: 32px;
    border: 1px solid rgba(255, 255, 255, 0.21);
    background: var(--White-W-3, rgba(255, 255, 255, 0.03));
    display: flex;
    max-width: 345px;
    flex-direction: column;
    font-family: Manrope, sans-serif;
    font-weight: 400;
    text-align: center;
    padding: 72px 24px;
}

.welcome-image {
    aspect-ratio: 1.17;
    object-fit: contain;
    object-position: center;
    width: 105px;
    align-self: center;
    max-width: 100%;
}

.welcome-content {
    display: flex;
    margin-top: 32px;
    width: 100%;
    flex-direction: column;
}

.welcome-title {
    width: 100%;
    font-size: 40px;
    letter-spacing: -1.2px;
    line-height: 48px;
    background: linear-gradient(94deg, rgba(255, 255, 255, 0.4) -1.07%, #fff 32.18%, rgba(255, 255, 255, 0.4) 104.41%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-style: normal;
}
.welcome-title span {
    color: #f19101b2;
    background-clip: auto;
    -webkit-background-clip: auto;
    -webkit-text-fill-color: #f19101b2;
}
.welcome-description {
    color: var(--White-W-100, #fff);
    font-size: 16px;
    line-height: 22px;
    letter-spacing: -0.48px;
    margin-top: 16px;
}

.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
.description {
    color: var(--Whitek-W-100, #fff);
    letter-spacing: -0.48px;
    margin-top: 16px;
    font:
        16px/24px Inter,
        sans-serif;
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
    width: 100vw;
    max-width: 345px;
    color: var(--Whitek-W-100, #fff);
    white-space: nowrap;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    padding: 16px;
    background-size: contain;
    font:
        14px/143% Poppins,
        sans-serif;
    margin-bottom: 75px;
}
</style>
