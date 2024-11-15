import { defineStore } from 'pinia';
export interface user {
    userRank: number;
    _id: string;
    clicks: number;
    tgId: number;
    league: number;
    fullName: string;
}
export interface leaderboard {
    me: user;
    threeUsers: user[];
}
export const useLeaderboardStore = defineStore('leaderboard', {
    state: () => ({
        globalLeaderboard: <user[]>[],
        leagueLeaderboard: <user[]>[],
        me: <user | undefined>undefined,
        meInLeague: <user | undefined>undefined

    }),
    actions: {
        setGlobalLeaderboard(globalLeaderboard: leaderboard) {
            this.globalLeaderboard = globalLeaderboard.threeUsers;
            this.me = globalLeaderboard.me;
        },
        setLeagueLeaderboard(leagueLeaderboard: leaderboard) {
            this.leagueLeaderboard = leagueLeaderboard.threeUsers;
            this.meInLeague = leagueLeaderboard.me;
        }
    },
    getters: {
        getGlobalLeaderboard: (state) => state.globalLeaderboard,
        getLeagueLeaderboard: (state) => state.leagueLeaderboard
    }
});
