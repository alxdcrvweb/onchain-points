<template>
    <article class="game-card">
        <header class="game-card__header">
            <img loading="lazy" src="/diamond.png" class="gem-icon" alt="Gem icon" />
            <span class="gem-count">12K</span>
        </header>
        <section class="game-card__content">
            <div class="game-image-wrapper">
                <img loading="lazy" src="/gameb.png" class="game-image" alt="Onchain game 1 preview" />
            </div>
            <div class="game-details">
                <h2 class="game-title">Onchain game 1</h2>
                <div class="game-stats">
                    <div class="participation-info">
                        <span class="stat-label">FCFS basis:</span>
                        <div class="stat-value">
                            <span class="current-participants">3000</span>
                            <span class="separator">/</span>
                            <span class="total-participants">25000 participants</span>
                        </div>
                    </div>
                    <div class="prize-info">
                        <span class="stat-label">Prize pool:</span>
                        <div class="stat-value">
                            <span class="prize-amount">500K</span>
                            <img loading="lazy" src="/diamond.png" class="prize-icon" alt="Prize icon" />
                        </div>
                    </div>
                </div>
            </div>
            <RouterLink to="/firstGame">
                <div class="read-more">
                    <button class="read-more-btn">Read more</button>
                </div>
            </RouterLink>
        </section>
        <nav class="game-card__navigation">
            <button class="nav-btn nav-btn--prev" aria-label="Previous game">
                <img
                    loading="lazy"
                    src="/nav.svg"
                    class="nav-icon"
                    style="transform: rotate(180deg); opacity: 0.3"
                    alt=""
                />
            </button>
            <div class="nav-indicators">
                <div class="indicator indicator--active"></div>
                <div class="indicator"></div>
            </div>
            <RouterLink to="/banger">
                <button class="nav-btn nav-btn--next" aria-label="Next game">
                    <img loading="lazy" src="/nav.svg" class="nav-icon" alt="" /></button
            ></RouterLink>
        </nav>
    </article>
    <footer class="game-card__footer">
        <p class="footer-text">Complete tasks to gain gems<br />and get an airdrop in the future</p>
        <RouterLink to="/tasks">
            <button class="view-tasks-btn">View tasks</button>
            <div class="continue-button">Let’s go!</div>
        </RouterLink>
    </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'GameCard'
    // Add any necessary component logic here
});
</script>

<style scoped>
.continue-button {
    background-position: center;
    width: 354px !important;
    max-width: 354px !important;
}
.game-card {
    border-radius: 32px 32px 0 0;
    background-color: #000;
    display: flex;
    max-width: 393px;
    flex-direction: column;
    overflow: hidden;
    padding-top: 15px;
}

.game-card__header {
    align-self: flex-end;
    display: flex;
    align-items: center;
    gap: 4px;
    color: #fff;
    white-space: nowrap;
    letter-spacing: -0.42px;
    font:
        600 14px/2 Manrope,
        sans-serif;
}

.gem-icon {
    object-fit: cover;
    width: 18px;
    height: 14px;
    margin-top: -2px;
}

.game-card__content {
    border-radius: 20px;
    border: 1px solid rgba(246, 168, 0, 0.5);
    backdrop-filter: blur(38.35px);

    background-size: cover;
    display: flex;
    background-position: right;
    margin-top: 16px;
    flex-direction: column;
    overflow: hidden;
    padding-bottom: 10px;
    padding-top: 3px;
}

.game-image {
    aspect-ratio: 2.3;
    object-fit: contain;
    width: 100%;
    background-blend-mode: hard-light;
}

.game-details {
    display: flex;
    margin-top: 24px;
    width: 100%;
    flex-direction: column;
    padding: 0 8px 0 24px;
}

.game-title {
    font-size: 24px;
    color: #fff;
    font-weight: 600;
    letter-spacing: -0.72px;
    line-height: 1;
    margin: 0;
}

.game-stats {
    display: flex;
    margin-top: 16px;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    font-size: 14px;
    letter-spacing: -0.42px;
    line-height: 2;
}

.participation-info,
.prize-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.stat-label {
    color: #fff;
    font-weight: 600;
}

.stat-value {
    display: flex;
    align-items: center;
    border-radius: 32px;
    background: rgba(255, 255, 255, 0.03);
    min-height: 38px;
    gap: 4px;
    padding: 8px;
}

.current-participants {
    color: #fff;
    font-weight: 600;
}

.separator {
    color: #5c5c5c;
}

.total-participants {
    color: rgba(255, 255, 255, 0.64);
}

.prize-amount {
    color: #fff;
    font-weight: 600;
}

.prize-icon {
    object-fit: cover;
    width: 18px;
    height: 14px;
    margin-top: -2px;
}

.read-more {
    display: flex;
    min-height: 40px;
    width: 100%;
    padding-right: 16px;
    align-items: center;
    justify-content: flex-end;
}
a {
    text-decoration: none;
}
.read-more-btn {
    color: #ff9900;
    text-align: center;
    text-decoration: none;
    letter-spacing: -0.42px;
    font:
        400 14px/1 Poppins,
        sans-serif;
    background: none;
    border: none;
    cursor: pointer;
}

.game-card__navigation {
    display: flex;
    margin-top: 16px;
    width: 100%;
    align-items: center;
    justify-content: space-between;
}

.nav-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px 9px;
}

.nav-icon {
    aspect-ratio: 0.5;
    object-fit: contain;
    width: 6px;
}

.nav-btn--prev .nav-icon {
    stroke-width: 1.5px;
    stroke: rgba(255, 255, 255, 0.16);
}

.nav-btn--next .nav-icon {
    stroke-width: 1.5px;
    stroke: rgba(255, 255, 255, 0.64);
}

.nav-indicators {
    display: flex;
    gap: 8px;
}

.indicator {
    border-radius: 100px;
    width: 32px;
    height: 3px;
}

.indicator--active {
    background-color: #f6a800;
}

.indicator:not(.indicator--active) {
    background-color: rgba(255, 255, 255, 0.16);
}

.game-card__footer {
    display: flex;
    margin-top: 16px;
    flex-direction: column;
    align-items: center;
    font-size: 14px;
    color: #fff;
    text-align: center;
    letter-spacing: -0.42px;
}

.footer-text {
    font-family: Manrope, sans-serif;
    line-height: 20px;
    margin: 0;
}

.view-tasks-btn {
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.06);
    margin-top: 16px;
    width: 100%;
    padding: 16px;
    margin-bottom: 16px;
    font-family: Poppins, sans-serif;
    line-height: 1;
    color: #fff;
    border: none;
    cursor: pointer;
}

/* Visually hidden class for screen readers */
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
</style>
