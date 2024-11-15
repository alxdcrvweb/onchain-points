<template>
  <BlockContainer :reverseGradient="true">
    <Loader
      v-if="isLoading"
      title="Loading squads"
    />
    <ErrorScreen
      v-if="!isLoading && !squads"
      title="Loading error"
      message="Try again later"
    />
    <div class="squadTableContainer" v-if="squads">
      <div class="squadTableRow" v-for="item in squads" v-bind:key="item?.name">
        <div class="squadRowInfo">
          <div class="squadRow2Name">
            {{ item?.title }}
            <img v-if="item?.isVerified" src="/verified-gold.svg">
          </div>
          <div class="squadRowPoints">
            <div>{{ item?.points }}</div>
            <img src="../../assets/coin.png" />
          </div>
        </div>
        <div v-if="!disableInteraction" :class="blockJoin !== item?._id ? 'squadRowJoin' : 'squadRowJoinLoading'"
             @click="joinCurrentSquad(item?._id)">
          Join
        </div>
      </div>
    </div>
  </BlockContainer>
</template>
<script lang="ts">
import { useUserStore } from '../../store/app';
import { useProfileStore } from '../../store/profile';
import {  getRandomSquads, joinSquad } from '../../api/squad';
import { storeToRefs } from 'pinia';
import { ref } from "vue";
import Title from "@/components/layouts/Title.vue";
import BlockContainer from "@/components/layouts/BlockContainer.vue";
import Loader from "@/components/utilityScreens/Loader.vue";
import ErrorScreen from "@/components/utilityScreens/ErrorScreen.vue";

const squads = ref<any[]>([])
const blockJoin = ref('')
const isLoading = ref(true)
export default {
  name: 'SquadTable',
  components: {
    ErrorScreen,
    Loader,
    BlockContainer,
    Title,
    squads,
  },
  props: ['loadSquad', 'disableInteraction','mySquad'],
  setup(props: any) {
    const profileStore = useProfileStore();
    const userStore = useUserStore();
    const { getJwt } = storeToRefs(userStore);
    return { jwt: getJwt, squads, blockJoin, loadSquad: props.loadSquad, profileStore, isLoading, userStore }
  },
  mounted() {
    this.loadRandomSquads();
  },
  methods: {
    async loadRandomSquads() {
      const res = await getRandomSquads(this.jwt)
      console.log('squads', res)
      squads.value = res.squadList
      isLoading.value = false
    },
    async joinCurrentSquad(id: string) {
      blockJoin.value = id
      try {
        const res = await joinSquad(this.jwt, id)
        if (res) {
          blockJoin.value = ""
          this.profileStore.setInSquad(true)
          this.loadSquad()
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
.squadTableContainer {
  //border: 1px solid #303030;
  overflow-y: auto;
  //backdrop-filter: blur(10px) invert(5%);
  max-height: 500px;


.squadRowJoin {
  width: 66px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.06);
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
  display: flex;
  align-items: center;
  gap: 4px;
  color: rgba(255, 255, 255, 0.65)
}

.squadTableRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  //padding-left: 16px;
  //padding-right: 16px;

}

.squadRowInfo {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;


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
.mySquadRowInfo {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #303030;
  margin: 16px 16px 0;
  padding-bottom: 16px;
  .squadRow2Name {
    color: white;
  }
}
.squadClick {
  text-transform: uppercase;
  text-align: center;
}
}

</style>
