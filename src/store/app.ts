// Utilities
import { defineStore } from 'pinia';

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
}
//userStore {user:{id,first_name,first_name,username},hash}
export const useUserStore = defineStore('user', {
    state: () => ({
        isAuth: false,
        claimInterface: true,
        user: {
            id: 0,
            first_name: '',
            last_name: '',
            username: ''
        },
        jwt: '',
        hash: '',
        gameBotName: ''
    }),
    actions: {
        setJwt(jwt: string) {
            this.jwt = jwt;
        },
        setUser(user: User) {
            this.user = user;
        },
        setHash(hash: string) {
            this.hash = hash;
        },
        setIsAuth(isAuth: boolean) {
            this.isAuth = isAuth;
        },
        setGameBotName(gameBotName: string) {
            this.gameBotName = gameBotName;
        },
        setClaimInterface() {
            console.log('setClaimInterface', this.claimInterface)
            this.claimInterface = !this.claimInterface;
        }
    },
    getters: {
        getUser: (state) => state.user,
        getHash: (state) => state.hash,
        getIsAuth: (state) => state.isAuth,
        getJwt: (state) => state.jwt,
        getGameBotName: (state) => state.gameBotName,
        getClaimInterface: (state) => state.claimInterface
    }
});
