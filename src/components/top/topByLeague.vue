<template>
      <PageContainer page-title="League">
        <FeatureDisabled v-if="disabledFeatures.leagueRanks" />
        <div v-else>
          <Loader v-if="loadingStatus==='loading'" message="Loading league" />
          <ErrorScreen v-else-if="loadingStatus==='error'" title="Loading failed" message="Try again later" hide-reload-button />
          <Column v-else-if="me && league">
            <BlockContainer>
              <div class="_flex-between">
                <div class="squadRowGen">LEAGUE</div>
                <div :style="{
                            'background': `linear-gradient(${getColor(getLvl(me.league))}`, 'background-clip': 'text', '-webkit-background-clip': 'text',
                            '-webkit-text-fill-color': 'transparent'
                        }">{{ getLvl(me!.league) }}</div>
              </div>
            </BlockContainer>
            <BlockContainer >
              <TwoColumns :right="me?.userRank>0 ? me?.userRank : 'unranked'" left="LEAGUE RANK" />
            </BlockContainer>
            <div v-if="me && league">
              <leaderboard v-if="me.league>1" :table-title="getLvl(me?.league) + ' leaderboard'" :my-data="me" :table-data="league" />
              <div v-else class="clickMore">Keep clicking to be on the top</div>
            </div>
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
import {getLeague, getLeagueTop} from '@/api/leaderboard';
import { useLeaderboardStore } from '@/store/leaderboard';
import { ref } from "vue"
import { getColor, getLvl } from '@/utils/get';
import PageContainer from "@/components/layouts/Page.vue";
import BlockContainer from "@/components/layouts/BlockContainer.vue";
import TwoColumns from "@/components/layouts/TwoColumns.vue";
import Loader from "@/components/utilityScreens/Loader.vue";
import ErrorScreen from "@/components/utilityScreens/ErrorScreen.vue";
import {disabledFeatures} from "@/utils/variables";
// const league = 'Gold'
let urlParams = new URLSearchParams(window.location.search);
const league = ref<any[]>([])
const me = ref<any>(undefined)
const loadingStatus = ref<'loading' | 'successful' | 'error'>('loading')
export default {
    name: 'socketFrame',
  computed: {
    disabledFeatures() {
      return disabledFeatures
    }
  },
    components: {
      ErrorScreen,
      Loader,
      TwoColumns,
      BlockContainer,
      PageContainer,
        foot, leaderboard, name
    },
    setup() {
        const leaderboardStore = useLeaderboardStore();
        const userStore = useUserStore();
        const { getJwt } = storeToRefs(userStore);
        const { leagueLeaderboard, meInLeague } = storeToRefs(leaderboardStore)
        return {
            meInLeague,
            getJwt,
            leaderboardStore,
            leagueLeaderboard,
            league,
            loadingStatus,
            me,
            getColor,
            getLvl
        };
    },
    mounted() {
        !disabledFeatures.leagueRanks && this.load();
    },

    methods: {
        getPrecents(max: number, value: number) {
            // get 100% precentage from value
            return `${(value / max) * 100}%`

        },
        async load() {
            const res = await getLeagueTop(this.getJwt)
            const myLeagueRank = (await getLeague(this.getJwt))

            if(!res.success || !myLeagueRank) {
              loadingStatus.value = 'error'
              return
            } else {
              loadingStatus.value = 'successful'
            }
            // if (!info.success) {
            //     console.log(info);
            //     return
            // }
            league.value = res.leaderboard.threeUsers
            me.value = res.leaderboard.me
            me.value.userRank = myLeagueRank.userRank
            me.value.league = myLeagueRank.leagueId
            console.log(`me`, me.value)
            // this.leaderboardStore.setLeagueLeaderboard(info.leaderboard)
        },
    },

}
</script>
<style>
.squadLeague {
    font-size: 48px;
    width: 100%;
    display: flex;
    justify-content: center;
}

.squadRowGen {
    color: #A4A4A4 !important;
    margin-right: 4px;
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

.squadR {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 54px;
    width: 100%;
    padding-left: 16px;
    padding-right: 16px;
}
.clickMore {
  margin-top: 50px;
  text-align: center;
  div {
    margin-top: 8px;
    font-size: 12px;
  }
}
</style>
