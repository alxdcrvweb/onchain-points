<template class="template">
    <PageContainer pageTitle="Global top" >
        <div v-if="me && globalLeaderboard">
<!--            <name name="Global top" />-->
          <Column>
          <BlockContainer>
                <div class="_flex-between">
                    <div class="squadRowGen">YOUR LEAGUE</div>
                    <RouterLink :style="{ 'text-decoration': 'none' }" to="/league">
                        <div :style="{
                            'background': `linear-gradient(${getColor(getLvl(me.league))}`, 'background-clip': 'text', '-webkit-background-clip': 'text',
                            '-webkit-text-fill-color': 'transparent'
                        }">{{ getLeague(me!.league) }}</div>
                    </RouterLink>
                </div>
          </BlockContainer>
            <BlockContainer class="squadRowBig">
              <TwoColumns :right="me?.userRank>0 ? me?.userRank : 'unranked'" left="GLOBAL RANK" />
            </BlockContainer>
          </Column>
        </div>
        <div v-if="me && globalLeaderboard">
            <leaderboard v-if="me.userRank>0" table-title="Global leaderboard" :my-data="me" :table-data="globalLeaderboard" />
            <div v-else class="clickMore">
                CLick more to get your first rank and get access to the leaderboard.
              <div v-if="me.clicks">
                You need {{5000 - me.clicks}} more clicks to get your first rank.
              </div>
            </div>


        </div>
    </PageContainer>
</template>

<script lang="ts">
import foot from '@/components/top/footer.vue'
import leaderboard from '@/components/top/table.vue'
import { useUserStore } from '@/store/app';
import { useProfileStore } from '@/store/profile';
import { useLeaderboardStore } from '@/store/leaderboard';
import { storeToRefs } from 'pinia';
import name from '@/components/squad/name.vue'
import { getColor, getLvl } from '@/utils/get';
import { ref } from "vue"
import { getGlobalTop } from '@/api/leaderboard';
import BlockContainer from "@/components/layouts/BlockContainer.vue";
import TwoColumns from "@/components/layouts/TwoColumns.vue";
import Column from "@/components/layouts/Column.vue";
import PageContainer from "@/components/layouts/Page.vue";
const me = ref()
const globalLeaderboard = ref()

export default {
    name: 'socketFrame',
    components: {
      PageContainer,
      Column,
      TwoColumns,
      BlockContainer,
        foot, leaderboard, name
    },

    setup() {
        const profileStore = useProfileStore();
        const leaderboardStore = useLeaderboardStore();
        const userStore = useUserStore();
        const { getJwt } = storeToRefs(userStore);
        const { getLevel, getIsConnected, getCoins } = storeToRefs(profileStore)
        return {
            getLevel,
            getJwt,
            getIsConnected,
            userStore,
            profileStore,
            getCoins,
            me,
            leaderboardStore,
            globalLeaderboard,
            getColor,
            getLvl
        };
    },
    mounted() {
        this.load();

    },
    methods: {
        getPrecents(max: number, value: number) {
            // get 100% precentage from value
            return `${(value / max) * 100}%`

        },

        getRoute(league: string) {
            return `/league`

        },
        async load() {
            const info = await getGlobalTop(this.getJwt)
            // if (!info.success) {
            //     console.log(info);
            //     return
            // }
            console.log(`info`, info)
            globalLeaderboard.value = info.leaderboard.threeUsers
            me.value = info.leaderboard.me
        },
        getLeague(league: number) {
            switch (league) {
                case 1:
                    return 'Bronze';
                case 2:
                    return "Silver";
                case 3:
                    return "Gold";
            }

        }
    },

}
</script>
<style lang="scss">
.squadRowGen {
    color: rgba(255, 255, 255, 0.65)
}

.userEnergy {
    height: 4px;
    background-color: #2F2F2F;
    border-radius: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;

    width: 100%;
}

.userEnergyFill {
    height: 4px;
    background-color: white;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}



.leagueContainer {
    width: 100%;
    background-size: cover;
    background-position: center;
    color: white;
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 220px 1fr;
    height: calc(100vh - 120px);
}

.squad {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px
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
.clickMore {
  margin-top: 20px;
  text-align: center;
  div {
    margin-top: 8px;
    font-size: 12px;
  }
}
</style>
