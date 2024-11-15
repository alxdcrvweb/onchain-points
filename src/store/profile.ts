import { defineStore } from 'pinia';
export interface profile {
    isConnected: boolean;
    coins: number;
    fullName: string;
    clicks: number;
    level: number;
    energy: number;
    hasBoost: boolean;
    hasGem: boolean;
    maxEnergy: number;
    hasDisbeliever: boolean;
    leagueId: number;
    userRank: number;
    energyLevel: number;
    dailyEnergyRefill: number;
    clickLevel: number;
    isAdmin: boolean;
    isFirstTime: boolean;
    referals: number;
    isUpdated: boolean;
    tgId: number;
    inSquad: boolean;
    tooFastClicker: boolean;
    gems: number;
    league?: number;
    sigAddress: string;
}
export interface Boosts {
    remainingGems: number;
    remainingRockets: number;
}
export const useProfileStore = defineStore('profile', {
    state: () => ({
        claimInfo: {
          toClaim: '0',
          claimedCoins: 0,
          proofs:'',
          sigAddress: '',
        },
        profile: {
            isConnected: false,
            coins: 0,
            fullName: '/me',
            clicks: 0,
            level: 0,
            energy: 0,
            maxEnergy: 0,
            hasBoost: false,
            hasDisbeliever: false,
            leagueId: 0,
            userRank: 0,
            dailyEnergyRefill: 0,
            energyLevel: 0,
            clickLevel: 0,
            isAdmin: false,
            isFirstTime: false,
            referals: 0,
            tgId: 0,
            inSquad: false,
            tooFastClicker: false,
            hasGem: false,
            sigAddress: '',
            gems: 0,
        },
        stage: 0,
        isUpdated: false,
        remainingGems: 0,
        remainingRockets: 0

    }),
    actions: {
        setProfile(profile: profile) {
            console.log('aaaaaffffff', profile)
            this.profile = profile;
            console.log('aaaaavvvvvv', this.profile)
        },
        setInSquad(b: boolean) {
            this.profile.inSquad = b;
        },
        setRemainingGems(remainingGems: number|'-') {
            if (remainingGems === '-') this.remainingGems--
            else this.remainingGems = remainingGems;
        },
        setRemainingRockets(remainingRockets: number|'-') {
            if (remainingRockets === '-') this.remainingRockets--
            else this.remainingRockets = remainingRockets;
        },
        setStage(st: number) {
            this.stage = st;
        },
        setEnergyRefill() {
            this.profile.energy = this.profile.maxEnergy;
            this.profile.dailyEnergyRefill--;
        },
        setUpdated(up: boolean) {
            console.log('aaaaa');
            this.isUpdated = up;
        },
        setClickLevel(clickLevel: number) {
          this.profile.clickLevel = clickLevel;

        },
        setIsConnected(isConnected: boolean) {
            this.profile.isConnected = isConnected;
        },
        setCoins(coins: number) {
          console.log('coins',coins);
            this.profile.coins = coins;
            console.log('this.profile.coins',this.profile.coins);
        },
        setClicks(clicks: number) {
            this.profile.clicks = clicks;
        },
        setBoost(hasBoost: boolean) {
            this.profile.hasBoost = hasBoost;
            console.log('this.profile.hasBoost',this.profile.hasBoost);
          setTimeout(() => {
            this.profile.hasBoost = false;
          }, 4000);
        },
        setGem(hasGem: boolean) {
              this.profile.hasGem = hasGem;
              setTimeout(() => {
                this.profile.hasGem = false;
              }, 8000);
        },
        setLevel(level: number) {
            this.profile.level = level;
        },
        setEnergy(energy: number) {
            this.profile.energy = energy;
        },
        setEnergyLevel(energyLevel: number) {
          this.profile.energyLevel = energyLevel;
        },
        setMaxEnergy(maxEnergy: number) {
            this.profile.maxEnergy = maxEnergy;
        },
        setLeagueId(leagueId: number) {
            this.profile.leagueId = leagueId;
        },
        setUserRank(userRank: number) {
            this.profile.userRank = userRank;
        },
        setTooFastClicker(tooFastClicker: boolean) {
            this.profile.tooFastClicker = tooFastClicker;
        },
        setClaimInfo(claimInfo: any) {
          console.log('claimInfo', claimInfo);
          this.claimInfo = claimInfo;
        }
    },
    getters: {
        getProfile: (state) => state.profile,
        getLevel: (state) => state.profile.level,
        getEnergy: (state) => state.profile.energy,
        getMaxEnergy: (state) => state.profile.maxEnergy,
        getClicks: (state) => state.profile.clicks,
        getCoins: (state) => state.profile.coins,
        getIsConnected: (state) => state.profile.isConnected,
        getLeagueId: (state) => state.profile.leagueId,
        getUserRank: (state) => state.profile.userRank,
        getStage: (state) => state.stage,
        getUpdated: (state) => state.isUpdated,
        getTgId: (state) => state.profile.tgId,
        getTooFastClicker: (state) => state.profile.tooFastClicker,
        getBoosts: (state):Boosts => ({
          remainingGems: state.remainingGems,
          remainingRockets: state.remainingRockets
        }),
        getClaimInfo: (state) => state.claimInfo
    }
});
