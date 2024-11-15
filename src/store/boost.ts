import { defineStore } from 'pinia';

// export interface energy {
//     me: user;
//     threeUsers: user[];
// }
export const useBoostStore = defineStore('leaderboard', {
    state: () => ({
        energy: <any>undefined,
        clicks: <any>undefined,
        boostSize: <number>0
    }),
    actions: {
        setBoosts(energy: any, click: any) {
            this.energy = energy;
            this.clicks = click;
        },
        setBoostSize(size: number) {
            this.boostSize = size;
            // setTimeout(() => {
            //     this.boostSize = 0;
            // }, 10000);
        }
    },
    getters: {
        getEnergy: (state) => state.energy,
        getCoins: (state) => state.clicks,
        getBoostSize: (state) => state.boostSize
    }
});
