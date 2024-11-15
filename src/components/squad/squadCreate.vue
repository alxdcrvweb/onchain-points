<template class="template">
    <!-- <div style="color: white;"> {{ loadSquad }}</div> -->
    <div class="refContainerEmpty">

        <div>

<!--            <name name="Create squad" />-->
            <div v-if="!openM">
                <div v-if="profile.coins > 20000" v-on:click="openMenu()">
                    <div class="createButton">
                        <img src="../../assets/plus.svg" />
                        <div class="squadClick">
                            Click here to create your squad
                        </div>
                    </div>
                    <div :style="{ 'text-align': 'center', 'margin-bottom': '30px' }">Squad earns 5% of earned chain
                        links
                        for its owner and +10% to energy limits for squad members</div>
                </div>
                <div v-else>
                    <div class="createButton">
                        <div class="squadClick">
                            Need 20k ⛓ to create a squad
                        </div>
                    </div>
                    <div :style="{ 'text-align': 'center', 'margin-bottom': '30px' }">Squad earns 5% of earned chain
                        links
                        for its owner and +10% to energy limits for squad members</div>
                </div>
            </div>
            <div v-else>
                <form class="nameForm" v-on:submit="(e) => createSquad(e)">
                    <div>
                        <label for="name">Title:</label>
                        <input v-on:change="(e) => changeName(e)" type="text" id="name" name="name" :value="newName" />
                    </div>
                    <div>
                        <label for="originalName">Original name:</label>
                        <input v-on:change="(e) => changeOriginalName(e)" type="text" id="originalName" name="originalName"
                            :value="originalName" />
                    </div>
                    <div style="margin-bottom: 20px">
                      <label for="squadChanel">Squad channel <img src="/tg.svg"/> :</label>
                      <div class="descr">To add a channel and verify the squad, please add our bot <b>@{{ getGameBotName }}</b> to the channel administrators first. Only public channels accepted. <br/>Left field empty to do this step later.</div>
                      <input v-on:change="(e) => changeSquadChanel(e)" type="text" id="squadChanel" name="squadChanel" placeholder="t.me/squadlink"
                             :value="squadChanel" />
                    </div>
                    <button type="submit">create</button>
                </form>
            </div>

            <div class="squadMore">
                more fun to tap with friends

            </div>
            <SquadTable :squads="squads" :blockJoin="blockJoin" :loadSquad="loadSquad" />
        </div>
    </div>


</template>

<script lang="ts">
import leaderboard from '../top/table.vue'
import { useUserStore } from '../../store/app';
import { useProfileStore } from '../../store/profile';
import {createSquad, getGameBotName, getRandomSquads, getSquad, joinSquad, verifySquad} from '../../api/squad';
import { storeToRefs } from 'pinia';
import name from './name.vue'
import { ref } from "vue";
import {tr} from "vuetify/locale";
// v-for="i in  getLevel" :key="i"
const openM = ref(false)
const newName = ref("")
const originalName = ref("")
const squadChanel = ref("")
const squads = ref<any[]>([])
const mySquad = ref<any>(undefined)
const blockJoin = ref('')

export default {
    name: 'socketFrame',
    components: {
        leaderboard, name
    },
    props: ['loadSquad'],
    setup(props: any) {
        const profileStore = useProfileStore();
        const userStore = useUserStore();
        const { getJwt, getGameBotName } = storeToRefs(userStore);
        const { getLevel, getIsConnected, getCoins, getProfile } = storeToRefs(profileStore)
        return {
          profile: getProfile,
          getLevel,
          getIsConnected,
          getCoins,
          jwt: getJwt,
          squads,
          mySquad,
          getGameBotName,
          originalName,
          squadChanel,
          blockJoin,
          loadSquad: props.loadSquad,
          profileStore,
          getProfile,
          userStore,
        }

    },
    data: () => ({ openM, newName }),
    mounted() {
        this.loadRandomSquads();
    },
    methods: {
        openMenu() {
            openM.value = !openM.value
        },
        getColor(league: string) {
            switch (league) {
                case 'Bronze':
                    return '#DE9038';
                case 'Silver':
                    return '#C0C0C0';
                case 'Gold':
                    return '#FFD700';
                default:
                    return '#FFFFFF';
            }

        },
        getPrecents(max: number, value: number) {
            // get 100% precentage from value
            return `${(value / max) * 100}%`

        },
        changeName(event: any) {
            newName.value = event.target.value
        },
        changeOriginalName(event: any) {
            originalName.value = event.target.value
        },
        changeSquadChanel(event: any) {
          squadChanel.value = event.target.value
        },
        async createSquad(e: any) {

            e.preventDefault()
            const res = await createSquad(this.jwt, newName.value, originalName.value.replaceAll(' ', ''))
            if (res) {
                newName.value = ''
                openM.value = false
                squadChanel.value.trim().length>0 && await verifySquad(this.jwt, squadChanel.value)
                this.loadSquad()
              if (res.jwt) {
                this.userStore.setJwt(res.jwt)
              }
            }

        },
        async loadRandomSquads() {
            const res = await getRandomSquads(this.jwt)
            squads.value = res.squadList
        },

        async joinCurrentSquad(id: string) {
            blockJoin.value = id
            try {
                const res = await joinSquad(this.jwt, id)
                if (res) {
                    blockJoin.value = ""
                    this.loadSquad()
                    this.profileStore.setProfile({ ...this.getProfile, inSquad: true, isUpdated: true})
                    if(res.jwt) {
                      this.userStore.setJwt(res.jwt)
                    }
                }
            } catch (e) {
                blockJoin.value = ""

            }

        }
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
  img{
    width: 16px;
    height: 16px;
  }
    .descr{
      font-size: 12px;
      margin-bottom: 8px;
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

.squadRowBig {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 7px;
    backdrop-filter: blur(100px) invert(5%);
    border: 1px solid #303030;
}

.squadRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 54px;
    width: 100%;
    padding-left: 16px;
    padding-right: 16px;
}
</style>
