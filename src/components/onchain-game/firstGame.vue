<template>
    <section class="onchain-game">
        <RouterLink to="/"
            ><header class="game-header">
                <button class="back-button" aria-label="Go back">
                    <img loading="lazy" src="/nav.svg" alt="" class="back-icon" style="transform: rotate(180deg)" />
                </button>
                <p class="game-title">Onchain game 1</p>
            </header></RouterLink
        >
        <div class="game-image-container">
            <img loading="lazy" src="/gameb.png" alt="Onchain game 1 visual representation" class="game-image" />
        </div>
        <p class="game-description">
            Onchain game 1 is a fully onchain partner project text text text Onchain game 1 is a fully onchain partner
            project text text text Onchain game 1 is a fully onchain partner project text text text
        </p>
        <nav class="game-links">
            <a href="#" class="link-button website-link">
                <img loading="lazy" src="/world.png" alt="" class="link-icon" />
                <span>Website</span>
            </a>
            <a href="#" class="link-button docs-link">
                <img loading="lazy" src="/doc.png" alt="" class="link-icon" />
                <span>Docs</span>
            </a>
            <a href="#" class="link-button guild-link">
                <img loading="lazy" src="/guild.png" alt="" class="link-icon" />
                <span>Guild</span>
            </a>
        </nav>
    </section>
    <footer class="game-card__footer">
        <RouterLink to="/">
            <div class="continue-button">go back</div>
        </RouterLink>
    </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'OnchainGame'
});
</script>

<style scoped>
.onchain-game {
    border-radius: 32px 32px 0 0;
    background-color: #000;
    display: flex;
    max-width: 393px;
    flex-direction: column;
    overflow: hidden;
    padding: 12px 0px 292px;
}
a {
    text-decoration: none;
}
.continue-button {
    width: 354px !important;
    max-width: 354px !important;
    background-position: center;
    display: flex;
    justify-content: center;
}
.game-header {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 8px;
}

.back-button {
    align-items: center;
    display: flex;
    overflow: hidden;
    width: 24px;
    padding: 6px 9px;
    background: none;
    border: none;
    cursor: pointer;
}

.back-icon {
    aspect-ratio: 0.5;
    object-fit: contain;
    width: 6px;
    stroke-width: 1.5px;
    stroke: #fff;
}

.game-title {
    color: #fff;
    letter-spacing: -0.54px;
    font:
        600 18px/1 Manrope,
        sans-serif;
}

.game-image-container {
    border-radius: 25px;
    border: 1px solid rgba(255, 255, 255, 0.21);
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(38.35px);
    display: flex;
    margin-top: 24px;
    width: 100%;
    overflow: hidden;
}

.game-image {
    object-fit: contain;
    width: 100%;
    background-blend-mode: hard-light;
}

.game-description {
    color: #fff;
    letter-spacing: -0.48px;
    margin-top: 24px;
    font:
        400 16px/22px Inter,
        sans-serif;
}

.game-links {
    display: flex;
    margin-top: 24px;
    width: 100%;
    gap: 8px;
}

.link-button {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.06);
    flex: 1;
    padding: 16px;
    text-decoration: none;
    color: #fff;
    font:
        400 14px/1 Poppins,
        sans-serif;
    text-transform: capitalize;
    letter-spacing: -0.42px;
}

.link-icon {
    width: 17px;
    height: 17px;
    object-fit: contain;
    margin-right: 4px;
}
</style>
