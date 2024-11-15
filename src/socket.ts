import { io, Socket } from 'socket.io-client';
import { useUserStore } from './store/app';
import { Store } from 'pinia';
import { useProfileStore } from './store/profile';

// export const socket = io('/');
// // socket.on('connect', () => {
// //     console.log('connected');
// // });

// // socket.on('disconnect', () => {
// //     console.log('disconnected');
// // });
// // export async function AuthSocket(jwt: string) {
// //     socket.emit('auth', jwt);
// // }

// socket.on('service', (msg) => {
//     console.log('service', msg);
// });

export class SocketWrapper {
    socket: Socket;
    interval: any;
    userStore: ReturnType<typeof useUserStore>;
    profileStore: ReturnType<typeof useProfileStore>;
    jwt: string;
    constructor(jwt: string) {
        const userStore = useUserStore();
        this.userStore = userStore;
        const profileStore = useProfileStore();
        this.profileStore = profileStore;
        this.jwt = jwt;
        this.socket = io('/');
    }
    async init() {
        this.userStore.getJwt;
        // this.userStore = userStore
        // this.userStore.setJwt(this.getJwt());
    }
    listen() {
        this.socket.on('auth', (msg: any) => {
            console.log('auth', msg);
            const message = msg as {
                status: boolean;
                error: any;
                user: {
                    room: string;
                    id: number;
                    username: string;
                    coins: number;
                    hasBoost: boolean;
                    clicks: number;
                    level: number;
                    energy: number;
                    hasDisbeliever: boolean;
                    maxEnergy: number;
                };
            };
            console.log(`message:`, message);
            if (!message.status) {
                console.log('error', message.error);
                this.profileStore.setIsConnected(false);
                return;
            }
            this.profileStore.setIsConnected(true);
            // this.profileStore.setProfile({
            //     leagueId: this.profileStore.getProfile.leagueId,
            //     userRank: this.profileStore.getProfile.userRank,
            //     coins: message.user.coins,
            //     clicks: message.user.clicks,
            //     level: message.user.level,
            //     energy: message.user.energy,
            //     maxEnergy: message.user.maxEnergy,
            //     isConnected: true,
            //     username: message.user.username,
            //     hasBoost: false,
            //     hasDisbeliever: message.user.hasDisbeliever
            // });
            this.socket.on('clicks', (msg: any) => {
                // const message = msg as { clicks: number; coins: number; energy: number; hasBoost: boolean, error: string };
                const message = msg as { hasBoost: boolean, hasGem: boolean, error: string };

                if(message.error) {
                  this.profileStore.setTooFastClicker(true);
                } else this.profileStore.setTooFastClicker(false);

                console.log('clicker - huicker', message);
                // this.profileStore.setClicks(message.clicks);
                // this.profileStore.setCoins(message.coins);
                // this.profileStore.setEnergy(message.energy);
                message.hasBoost && this.profileStore.setBoost(true);
                message.hasBoost && this.profileStore.setGem(true);
            });
            //   this.profileStore.setIsConnected(true);
        });
    }
    // change() {
    //     console.log(`changed:`, this.userStore.getUser);
    // }
    async AuthSocket(jwt:string) {
        console.log('authіщслуеjwt', jwt);
        this.socket.emit('auth', { token: jwt });
        this.interval = setInterval(() => {
            if(!this.profileStore.getIsConnected)
              this.socket.emit('auth', { token: jwt });
            else
              clearInterval(this.interval);
        }, 5000);
    }
    click() {
        this.socket.emit('clicks');
    }
    sync() {
        this.socket.emit('sync');
    }
    // getEthBalance() {
    //     this.socket.emit('ethBalance');
    //     this.socket.on('ethBalance', (msg: any) => {
    //         const message = msg as { coins: number };

    //         console.log('socket ethBalance msg', msg);

    //         // this.profileStore.setClicks(message.clicks);
    //         this.profileStore.setCoins(message.coins);
    //         //  this.profileStore.setEnergy(message.energy);
    //     });
    // }
    disconnect() {
        this.socket.disconnect();
        clearInterval(this.interval);
    }
}
