<template class="template">
    <PageContainer :verified="squad?.isVerified" :pageTitle="squad?.title? squad?.title: (loadingg||getProfile.inSquad)? '' :  'Create squad'">
        <Column v-if="!getProfile.inSquad">
          <createSquad :loadSquad="load" />
        </Column>
        <Loader
          v-else-if="loadingg&&!squad"
          message="Loading squad info"
        />
        <ErrorScreen v-else-if="!loadingg&&!squad&&getProfile.inSquad" title="Loading failed" message="Try again later" hide-reload-button />

        <div v-else>
          <Column v-if="squad">
            <BlockContainer>
              <TwoColumns left="SQUAD TOTAL POINTS" :right="squad?.points" />
            </BlockContainer>
            <BlockContainer>
              <TwoColumns left="SQUAD GEMS" :right="`💎 ${squad?.gems}`" />
            </BlockContainer>
            <Button v-if="squad?.globalRank" :onClick="setViewSquadTop" :reverseIcon="viewSquadTop">
              <TwoColumns v-if="!viewSquadTop" left="GLOBAL RANK" :right="squad?.globalRank" />
              <TwoColumns v-else left="Return" right="" />
            </Button>

            <a v-if="squad?.isVerified" :href="'https://t.me/'+squad?.verifyLink">
              <Button :onClick="setSquadSettings">
                <TwoColumns left="SQUAD SQUARE"><img src="/tg.svg"></TwoColumns>
              </Button>
            </a>
            <Button v-if="!squad?.isVerified && squad?.isOwner" :onClick="setSquadSettings" :reverse-icon="viewSquadSettings">
              <TwoColumns v-if="!viewSquadSettings" left="VERIFY SQUAD"><img src="/tg.svg"></TwoColumns>
              <TwoColumns v-else left="Return" right="" />
            </Button>
            <form v-if="viewSquadSettings && !squad?.isVerified && squad?.isOwner" class="nameForm" v-on:submit="verifySquadHandler">
              <div style="margin-bottom: 20px">
                <label for="squadChanel">Squad channel <img src="/tg.svg"/> :</label>
                <div class="descr">To add a channel and verify the squad, please add our bot <b>@{{ getGameBotName }}</b> to the channel administrators first. Only public channels accepted. <br/>Left field empty to do this step later.</div>
                <input v-on:change="(e) => changeSquadChanel(e)" type="text" id="squadChanel" name="squadChanel" placeholder="t.me/squadlink"
                       :value="squadChanel" />
              </div>
              <button type="submit">Verify</button>
            </form>
          </Column>

          <button v-if="!viewSquadSettings && squad && !squad?.isOwner" :class="!blockLeave ? 'leaveButton' : 'leaveButton loading'"
                  @click="leaveCurrentSquad()">
            Leave current squad
          </button>

          <Column v-if="!viewSquadSettings && !viewSquadTop && (squadLeaderBoard || loadingLeaderBoard || disabledFeatures.squadRanks)">
            <FeatureDisabled v-if="disabledFeatures.squadRanks" />
            <leaderboard v-else table-title="squad leaderboard" :is-loading="loadingLeaderBoard" :my-data="squadLeaderBoard?.me" :table-data="squadLeaderBoard?.users" />
          </Column>

          <Column v-else-if="!viewSquadSettings && viewSquadTop && !disabledFeatures.squadsTop">
            <Title>Top squads</Title>
            <SquadTable :disable-interaction="true" :loadSquad="load" :mySquad="squad" />
          </Column>


        </div>

    </PageContainer>
</template>

<script lang="ts">
import foot from '@/components/top/footer.vue'
import leaderboard from '@/components/top/table.vue'
import { useUserStore } from '@/store/app';
import { useProfileStore } from '@/store/profile';
import { storeToRefs } from 'pinia';
import name from '@/components/squad/name.vue'
import {getSquad, getSquadLeaderboard, leaveSquad, verifySquad} from '@/api/squad';
import { ref } from "vue"
import createSquad from './squadCreate.vue'
import TwoColumns from "@/components/layouts/TwoColumns.vue";
import Button from "@/components/button/button.vue";
import BlockContainer from "@/components/layouts/BlockContainer.vue";
import Title from "@/components/layouts/Title.vue";
import PageContainer from "@/components/layouts/Page.vue";
import Loader from "@/components/utilityScreens/Loader.vue";
import ErrorScreen from "@/components/utilityScreens/ErrorScreen.vue";
import FeatureDisabled from "@/components/utilityScreens/FeatureDisabled.vue";
import {disabledFeatures} from "@/utils/variables";
// v-for="i in  getLevel" :key="i"
const squad = ref()
const squadLeaderBoard = ref<{me:any,users:any[]}|null>()
const blockLeave = ref()
const loadingg = ref(true)
const loadingLeaderBoard = ref(true)
const viewSquadTop = ref(false)
const viewSquadSettings = ref(false)
const squadChanel = ref('')

export default {
    name: 'socketFrame',
  computed: {
    disabledFeatures() {
      return disabledFeatures
    }
  },
    components: {
      FeatureDisabled,
      ErrorScreen,
      PageContainer,
      Title,
      BlockContainer,
      Button,
      TwoColumns,
        foot, leaderboard, name, createSquad
      ,Loader
    },
    setup() {
        const profileStore = useProfileStore();
        const userStore = useUserStore();
      const { getJwt, getGameBotName } = storeToRefs(userStore);
      const { getProfile } = storeToRefs(profileStore);

        return {
            getJwt,
            getGameBotName,
            getProfile,
            profileStore,
          squadLeaderBoard,
          squad,
          userStore,
        }
    },
    data: () => ({
        loadingg,
        squad,
        blockLeave,
        viewSquadTop,
        viewSquadSettings,
        squadChanel,
        squadLeaderBoard,
        loadingLeaderBoard,
    }),
    methods: {
        changeSquadChanel(e: any) {
            squadChanel.value = e.target.value
        },
        setViewSquadTop() {
          viewSquadTop.value = !Boolean(viewSquadTop.value)
        },
        setSquadSettings() {
          viewSquadSettings.value = !Boolean(viewSquadSettings.value)
        },
        async verifySquadHandler(e:any) {
            e.preventDefault()
            if (squadChanel.value.trim().length === 0 || squadChanel.value.includes('t.me/+')) {
                return
            }
            squadChanel.value.trim().length>0 && await verifySquad(this.getJwt, squadChanel.value)
            await this.load()
            this.setSquadSettings()
        },
        async leaveCurrentSquad() {
            blockLeave.value = true
            try {
                const res = await leaveSquad(this.getJwt)
                if (res) {
                    squad.value = null
                    blockLeave.value = false
                    this.load()
                    this.profileStore.setInSquad(false)
                    if(res.jwt) {
                      this.userStore.setJwt(res.jwt)
                    }
                }
            } catch (e) {
                blockLeave.value = false
            }

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
        async load() {
            if(!this.getProfile.inSquad) return
            loadingg.value = true
            const res = await getSquad(this.getJwt)
            if (res) {
                squad.value = res.squad
                loadingg.value = false
            } else {
              loadingg.value = false
              return
            }

            const lb = !disabledFeatures.squadRanks && await getSquadLeaderboard(this.getJwt)
            if (lb) {
              console.log('lb', lb)
              squadLeaderBoard.value = {users:lb?.users, me:res?.me}
            }
            console.log('squadLeaderBoard', squadLeaderBoard.value)
            loadingLeaderBoard.value = false

        }
    },
    mounted() {
      console.log('mounted started')
        this.load()
    },
}
</script>
<style lang="scss">
.squadContainer {
    width: 100%;
    background-size: cover;
    background-position: center;
    color: white;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 8px;
    height: 100%;
    justify-content: flex-start;
}

.squadRowGen {
    color: rgba(255, 255, 255, 0.65)
}

a {
    color: white;
}



.squadRowBig {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 7px;
    backdrop-filter: blur(10px) invert(5%);
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

.leaveButton {
    width: 100%;
    height: 50px;
    border: 1px solid #303030;
    background-color: #1E1E1E;
    color: white;
    text-transform: uppercase;
    flex-shrink: 0;
}

.loading {
    width: 100%;
    height: 50px;
    border: 1px solid #303030;
    background-color: #1E1E1E;
    color: white;
    text-transform: uppercase;
    opacity: 0.5;
    pointer-events: none;
}
</style>
