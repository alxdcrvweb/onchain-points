<template>
    <div>
        <RouterLink to="/"
            ><header class="game-header">
                <button class="back-button" aria-label="Go back">
                    <img loading="lazy" src="/nav.svg" alt="" class="back-icon" style="transform: rotate(180deg)" />
                </button>
                <p class="game-title">Onchain game 1</p>
            </header></RouterLink
        >
        <article class="guild-role-container">
            <section class="role-info">
                <img loading="lazy" src="/wallet.png" class="role-icon" alt="Guild role icon" />
                <h2 class="role-title">Connect wallet</h2>
            </section>

            <section class="role-stats">
                <div class="stats-wrapper">
                    <img loading="lazy" src="/diamond.png" class="stats-icon" alt="Points icon" />
                    <span class="stats-value">500K</span>
                </div>

                <button class="nav-button" aria-label="View guild role details">
                    <img loading="lazy" src="/nav.svg" class="nav-icon" alt="" />
                </button>
            </section>
        </article>
        <article class="guild-role-container">
            <section class="role-info">
                <img loading="lazy" src="/telegram.png" class="role-icon" alt="Guild role icon" />
                <h2 class="role-title">Telegram</h2>
            </section>

            <section class="role-stats">
                <div class="stats-wrapper">
                    <img loading="lazy" src="/diamond.png" class="stats-icon" alt="Points icon" />
                    <span class="stats-value">500K</span>
                </div>

                <button class="nav-button" aria-label="View guild role details">
                    <img loading="lazy" src="/nav.svg" class="nav-icon" alt="" />
                </button>
            </section>
        </article>
        <article class="guild-role-container">
            <section class="role-info">
                <img loading="lazy" src="/x.svg" class="role-icon" alt="Guild role icon" />
                <h2 class="role-title">Follow Twitter</h2>
            </section>

            <section class="role-stats">
                <div class="stats-wrapper">
                    <img loading="lazy" src="/diamond.png" class="stats-icon" alt="Points icon" />
                    <span class="stats-value">500K</span>
                </div>

                <button class="nav-button" aria-label="View guild role details">
                    <img loading="lazy" src="/nav.svg" class="nav-icon" alt="" />
                </button>
            </section>
        </article>
        <article class="guild-role-container">
            <section class="role-info">
                <img loading="lazy" src="/x.svg" class="role-icon" alt="Guild role icon" />
                <h2 class="role-title">Make a tweet</h2>
            </section>

            <section class="role-stats">
                <div class="stats-wrapper">
                    <img loading="lazy" src="/diamond.png" class="stats-icon" alt="Points icon" />
                    <span class="stats-value">500K</span>
                </div>

                <button class="nav-button" aria-label="View guild role details">
                    <img loading="lazy" src="/nav.svg" class="nav-icon" alt="" />
                </button>
            </section>
        </article>
        <article class="guild-role-container">
            <section class="role-info">
                <img loading="lazy" src="/guild.png" class="role-icon" alt="Guild role icon" />
                <h2 class="role-title">Get a Guild role</h2>
            </section>

            <section class="role-stats">
                <div class="stats-wrapper">
                    <img loading="lazy" src="/diamond.png" class="stats-icon" alt="Points icon" />
                    <span class="stats-value">500K</span>
                </div>

                <button class="nav-button" aria-label="View guild role details">
                    <img loading="lazy" src="/nav.svg" class="nav-icon" alt="" />
                </button>
            </section>
        </article>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'GuildRole'
});
</script>

<style scoped>
.guild-role-container {
    align-items: center;
    border-radius: 16px;
    background: var(--White-W-6, rgba(255, 255, 255, 0.06));
    display: flex;
    margin-top: 8px;
    min-height: 78px;
    width: 100%;
    gap: 8px;
    justify-content: space-between;
    padding: 27px 8px 27px 16px;
}
.game-header {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    margin-bottom: 24px;
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

.role-info {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
}

.role-icon {
    aspect-ratio: 1;
    object-fit: contain;
    object-position: center;
    width: 16px;
}

.role-title {
    color: var(--White-W-100, #fff);
    font:
        600 16px Manrope,
        sans-serif;
    letter-spacing: -0.48px;
    margin: 0;
}

.role-stats {
    display: flex;
    align-items: center;
    gap: 8px;
}

.stats-wrapper {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--White-W-100, #fff);
    font:
        600 14px/2 Manrope,
        sans-serif;
    letter-spacing: -0.42px;
}

.stats-icon {
    aspect-ratio: 1.29;
    object-fit: contain;
    object-position: center;
    width: 18px;
}

.stats-value {
    white-space: nowrap;
}

.nav-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px 9px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-button:focus {
    outline: 2px solid var(--White-W-100, #fff);
    border-radius: 4px;
}

.nav-icon {
    aspect-ratio: 0.5;
    object-fit: contain;
    object-position: center;
    width: 6px;
    stroke-width: 1.5px;
    stroke: var(--White-W-64, rgba(255, 255, 255, 0.64));
}
</style>
