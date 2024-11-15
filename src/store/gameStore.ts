// Utilities
import { defineStore } from 'pinia';
import {NextLevel, Quests} from "@/api/boost";

interface QuestsInStore extends Quests {
  loaded: boolean
}
export interface Improvement extends NextLevel {}
const defaultImprovement: NextLevel = {
  currentValue: 1,
  nextValue: 1,
  currentLevel: 1,
  nextLevel: 1,
  upgradeCost: 1,
  next: false,
  isExist: false,
}
export interface AppStoreState {
    boosts: {
      boost: {
        showEmoji: boolean,
        showIsBoosted: boolean,
      }
    }
    energy: number
    points: number
    autoClickerBalance: number
    improvements: {
      loaded: boolean,
      pointsPerClick: NextLevel
      maxEnergy: NextLevel
      autoClicker: NextLevel
    },
    quests: QuestsInStore
}
//userStore {user:{id,first_name,first_name,username},hash}
export const useGameStore = defineStore('game', {
    state: ():AppStoreState => ({
        energy: 0,
        points: 0,
        autoClickerBalance: 0,
        improvements: {
          loaded: false,
          pointsPerClick: defaultImprovement,
          maxEnergy: defaultImprovement,
          autoClicker: defaultImprovement,
        },
        quests: {
          loaded: false,
          twitter: false,
          postw: false,
          tgChannel: false,
          trustWallet: false,
          okx: false,
        },
        boosts: {
          boost: {
            showEmoji: false,
            showIsBoosted: false,
          }
        }
    }),
    actions: {
        setEnergy(energy: number) {
            this.energy = energy;
        },
        setPoints(points: number) {
            this.points = this.points;
        },
        setAutoClickerBalance(autoClickerBalance: number) {
            this.autoClickerBalance = autoClickerBalance;
        },
        setImprovements(improvements: AppStoreState['improvements']) {
            this.improvements = {...improvements, loaded:true};
        },
        setEnergyImprovement(improvement: NextLevel) {
          this.improvements.maxEnergy = improvement;
        },
        setPointsPerClickImprovement(improvement: NextLevel) {
          this.improvements.pointsPerClick = improvement;
        },
        setAutoClickerImprovement(improvement: NextLevel) {
          this.improvements.autoClicker = improvement;
        },
        setQuests(quests: Quests) {
            this.quests = {...quests, loaded:true};
        },
        setShowBoostRocket(showBoost: boolean) {
            this.boosts.boost.showEmoji = showBoost;
            setTimeout(() => {
                this.boosts.boost.showEmoji = false;
            }, 4000);
        },
        setShowIsBoosted(showBoost: boolean) {
            this.boosts.boost.showIsBoosted = showBoost;
        },
    },
    getters: {
        getGame: (state)=> state,
        getGameBoosts: (state) => state.boosts,
        getShowEmoji: (state) => state.boosts.boost.showEmoji,
    }
});
