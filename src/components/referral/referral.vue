<template class="template">
    <!-- <div style="color: white;"> {{ profile }}</div> -->
    <Loader v-if="loader==='loading'" message="Loading referrals" />
    <ErrorScreen v-else-if="loader==='error'" title="Failed to load referrals" message="Try again later" />
    <div v-else-if="loader==='successful'" class="refContainerEmpty">
        <name name="Referral links" />

        <div class="squadd">
            <div class="squadrr">TOTAL INVITED USERS</div>
            <div>{{ numberOfReferals }}</div>
        </div>
        <div v-if="link?.user" class="update" @click="copyURL(getInviteLink(link?.user), 'user')">
            <div>
                <div class="updateTitle">
                    👉 PERSONAL REF LINK</div>
                <div class="updateSubtitle">{{ getInviteLink(link?.user), 'squad' }}</div>
            </div>
            <div>
                <img src="../../assets/plus.png" />
            </div>
        </div>
        <span :style="{ 'opacity': copied2 ? '1' : '0' }">Copied</span>
        <div :style="{ 'text-align': 'center' }">Referral gives your friends 200 starting points and earns you 10% of
            chain links earned by them</div>
        <div v-if="link?.squad" class="update" @click="copyURL(getInviteLink(link?.squad), 'squad')">

            <div>
                <div class="updateTitle">
                    🤝 SQUAD REF LINK</div>
                <div class="updateSubtitle">{{ getInviteLink(link?.squad) }}</div>
            </div>
            <div>
                <img src="../../assets/plus.png" />
            </div>
        </div>
        <span :style="{ 'opacity': copied ? '1' : '0' }">Copied</span>
        <div class="social">
            <a href="https://t.me/onchainchain" target="_blank"><img src="/t.svg" /></a>
            <a href="https://warpcast.com/~/channel/onchaincoin" target="_blank"><img src="/w.svg" /></a>
            <a href="https://twitter.com/onchaincoin" target="_blank"><img src="/x.svg" /></a>
        </div>
    </div>


</template>

<script lang="ts">
import foot from '@/components/top/footer.vue'
import leaderboard from '@/components/top/table.vue'
import { useUserStore } from '@/store/app';
import { useProfileStore } from '@/store/profile';
import { getLink, getBotname } from '@/api/squad';
import { storeToRefs } from 'pinia';
import name from '@/components/squad/name.vue'
import { ref } from "vue";
import Loader from "@/components/utilityScreens/Loader.vue";
import ErrorScreen from "@/components/utilityScreens/ErrorScreen.vue";
// v-for="i in  getLevel" :key="i"
const link = ref<{ squad:string,user:string }|null>(null)
const numberOfReferals = ref<number>(0)
const loader = ref<'loading'|'error'|'successful'>('loading')
// const botname = ref("")
const copied = ref(false)
const copied2 = ref(false)
export default {
    name: 'socketFrame',
    components: {
      Loader,
      ErrorScreen,
        foot, leaderboard, name
    },
    setup() {
        const profileStore = useProfileStore();
        const userStore = useUserStore();
        const { getJwt,getGameBotName } = storeToRefs(userStore);
        const { getLevel, getIsConnected, getCoins, getProfile } = storeToRefs(profileStore)
        return { profile: getProfile, getLevel, getIsConnected, getCoins, jwt: getJwt,getGameBotName, link, copied, loader, copied2,numberOfReferals }
    },
    mounted() {
        // this.getBot()
        this.getLinkRef()
    },
    methods: {

        async getLinkRef() {
            try {
              loader.value = 'loading'
              const res = await getLink(this.jwt)
              console.log('link',res)
              const links = res?.link?.links
              console.log('link2',links)

              if(!links || links.length == 0) {
                loader.value = 'error'
                return
              }
              numberOfReferals.value = res.link.referals
              loader.value = 'successful'
              link.value = {
                user:links[0]?.username,
                squad:links[1]?.username
              }
              console.log('link3',link?.value)
            } catch (e) {
              loader.value = 'error'
            }

        },

        async copyURL(mytext: string, type: string) {
            try {
                await navigator.clipboard.writeText(mytext);
                if (type == 'squad') {
                    copied.value = true
                    setTimeout(() => {
                        copied.value = false
                    }, 5000)
                } else if (type == 'user') {
                    copied2.value = true
                    setTimeout(() => {
                        copied2.value = false
                    }, 5000)
                }
            } catch ($e) {
                alert('Cannot copy');
            }
        },
        getInviteLink(username?: string|null) {
          if(!username) return ""
            return `https://t.me/${this.getGameBotName}?start=${username}`
        },

    },

}
</script>
<style lang="scss">
.squadTable {
    border: 1px solid #303030;
    overflow-y: auto;
    backdrop-filter: blur(10px) invert(5%);
    max-height: 500px;
}

.social {
    display: flex;
    justify-content: space-around;
    align-items: center;

    img {
        width: 30px;
        height: 30px;
        margin-left: 10px;
        margin-right: 10px;
    }
}

.squadRowJoin {
    width: 66px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #1E1E1E;
}

.squadRowJoinLoading {
    width: 66px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #1E1E1E;
    opacity: 0.5;
    pointer-events: none;
}

.squadRow2Name {

    color: rgba(255, 255, 255, 0.65)
}

.squadRow2 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
    padding-left: 16px;
    padding-right: 16px;

}

.squadRowInfo {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
}

.invite {
    margin-top: 25px;
    margin-bottom: 5px;

    div {
        font-size: 20px;
        display: flex;
        align-items: center;
        text-decoration: underline;

        img {
            margin-left: 5px;
        }
    }
}

.squadRowPoints {
    display: flex;
    align-items: center;

    img {
        width: 17px;
        height: 17px;
        margin-left: 5px;
    }
}

.squadClick {
    text-transform: uppercase;
    text-align: center;
}

.squadMore {
    text-transform: uppercase;
    margin-left: 16px;
    margin-bottom: 10px
}

.updateSubtitle {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.65);
    margin-top: 7px;
    margin-bottom: 7px;

}

.nameForm {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 30px;

    label {
        color: rgba(255, 255, 255, 0.65);
        margin-bottom: 5px;
    }

    input {
        width: 100%;
        height: 30px;
        border: 1px solid #303030;
        background-color: #1E1E1E;
        color: white;
        padding-left: 10px;
        margin-bottom: 10px;
    }

    button {
        width: 100%;
        height: 30px;
        border: 1px solid #303030;
        background-color: #1E1E1E;
        color: white;
        text-transform: uppercase;
    }

    div {
        width: 100%;
    }
}


.createText {
    text-align: center;
    margin-bottom: 30px;
}

.createButton {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 56px;
    background-image: url('../../assets/createButton.png');
    margin-bottom: 30px;

    img {
        margin-right: 10px;
    }
}

.updateLockTop {
    width: 100%;
    font-size: 12px;
    margin-top: 10px;
}

.userRow {
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding-left: 16px;
    padding-right: 16px;
    margin-bottom: 16px;
    align-items: center;
}

.update {
    display: flex;
    justify-content: space-between;
    padding-left: 16px;
    padding-right: 16px;
    margin-bottom: 16px;
    backdrop-filter: blur(10px) invert(5%);
    width: 100%;
    height: 74px;
    align-items: center;
    margin-top: 16px
}

.updateLock {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding-left: 16px;
    padding-right: 16px;
    margin-bottom: 16px;
    backdrop-filter: blur(10px) invert(5%);
    width: 100%;
    height: 92px;
    align-items: center;
    margin-top: 16px
}


.updateTitle {
    font-size: 14px;
    display: flex;
    align-items: center;
    margin-top: 7px;
    margin-bottom: 7px;

    img {
        transform: rotate(180deg);
        margin-left: 5px;
    }
}

.refContainerEmpty {
    width: 100%;
    background-size: cover;
    background-position: center;
    color: white;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
    /* position: fixed;
    top: 0;
    left: 0; */
    justify-content: flex-start;
}

.refContainer {
    width: 100%;
    background-size: cover;
    background-position: center;
    color: white;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: 100%;
}

.squadRowGen {
    color: rgba(255, 255, 255, 0.65)
}

.squadd {
    display: flex;
    /* flex-direction: column; */
    height: 54px;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding-right: 10px;
    backdrop-filter: blur(10px) invert(5%);
    border: 1px solid #303030;
}

.squadrr {
    display: flex;
    /* justify-content: space-between;
    align-items: center; */
    /* width: 100%; */
    padding-left: 16px;
    padding-right: 16px;
}
</style>
