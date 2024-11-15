<script setup lang="ts">
import {useProfileStore} from "@/store/profile";
import { useUserStore } from '@/store/app';
import { useBoostStore } from '@/store/boost';
import {
  AutoClickerApi,
  checkAllQuests,
  energyRefill,
  ImprovementsApi, UnionLevels,
  upClickLvl, upEnergyLvl
} from "@/api/boost";
import {onMounted} from "vue";
import {storeToRefs} from "pinia";
import { ref } from 'vue'
import {event} from "vue-gtag";
import Button from "@/components/button/button.vue";
import {useGameStore} from "@/store/gameStore";
import ImprovementCard from "@/components/boost/ImprovementCard.vue";
import GridFour from "@/components/layouts/GridFour.vue";
import PageContainer from "@/components/layouts/Page.vue";
import QuestCard from "@/components/boost/QuestCard.vue";
import {useAppStore} from "@/store/application";
import {getAvailableBoosts} from "@/api/friends";
import {apiRetry} from "@/utils/utilities";
import {serviceUrl} from "@/utils/variables";

const appStore = useAppStore();
const profileStore = useProfileStore();
const {getProfile, getTgId} = storeToRefs(profileStore);
const gameStore = useGameStore();
const {getGame} = storeToRefs(gameStore);
const authStore = useUserStore();
const {getJwt} = storeToRefs(authStore);

const encodedDappUrl = encodeURIComponent(`${serviceUrl}/okx_verification?tgId=${getProfile.value.tgId}`);
const deepLink = "okx://wallet/dapp/url?dappUrl=" + encodedDappUrl;
const encodedUrl = "https://www.okx.com/download?deeplink=" + encodeURIComponent(deepLink);
const trustQuestUrl = `https://link.trustwallet.com/open_url?url=${serviceUrl}/trust_verification?tgId=${getProfile.value.tgId}`;

const questsLoader = ref<'loading'|'error'|'successful'>('loading')
const levelsLoader = ref<'loading'|'error'|'successful'>('loading')
const energyUpLoader = ref<boolean>(false)
const clicksUpLoader = ref<boolean>(false)
const autoClickerUpLoader = ref<boolean>(false)
const claimClickerLoader = ref<boolean>(false)
const refillLoader = ref<boolean>(false)

onMounted(() => {
  if(!getGame?.value.quests.loaded) checkQuestsStatuses()
  else questsLoader.value = 'successful'
  if(!getGame?.value.improvements.loaded) getLevel()
  else levelsLoader.value = 'successful'
  if (profileStore.getProfile.energyLevel) {
  }
})

const checkQuestsStatuses = async () => {
  questsLoader.value = 'loading'
  const res = await checkAllQuests()
  if(res){
    gameStore.setQuests(res.quests)
    questsLoader.value = 'successful'
  } else {
    questsLoader.value = 'error'
  }
}

const getAutoclicker = async () => {
  const boosts = await getAvailableBoosts()
  if(!boosts) return
  gameStore.setAutoClickerBalance(boosts.clicker.coins)
}
const getLevel = async () =>{
  levelsLoader.value = 'loading'
  const improvements:UnionLevels = await ImprovementsApi.getAllImprovements()
  if (!improvements) {
    levelsLoader.value = 'error'
    return
  }
  gameStore.setImprovements({
    loaded: true,
    autoClicker: improvements.autoClicker,
    maxEnergy: improvements.energy,
    pointsPerClick: improvements.clicks,
  })
  levelsLoader.value = 'successful'
}
const  doubleCheck = async (callback: Function) => {
  callback()
  setTimeout(() => {
    callback()
  }, 5000)
}

const restoreEnergy = async() => {
  try {
    refillLoader.value = true
    const res = await energyRefill()
    if(!res) {
      refillLoader.value = false
      return
    }
    profileStore.setEnergyRefill()
    refillLoader.value = false
  } catch (e) {
    refillLoader.value = false
    appStore.setError('Failed to refill energy')
    console.log(e)
  }
}
const upClick = async() => {
  try {
    clicksUpLoader.value = true
    const clickLvl = await upClickLvl()
    profileStore.setClickLevel(clickLvl.currentLevel)
    gameStore.setPointsPerClickImprovement(clickLvl)
    clicksUpLoader.value = false
  } catch (e) {
    clicksUpLoader.value = false
    appStore.setError('Failed to upgrade click level')
    console.log(e)
  }
}
const upEnergy = async () => {
  try {
    energyUpLoader.value = true
    const res = await upEnergyLvl()
    profileStore.setMaxEnergy(res.currentValue)
    profileStore.setEnergyLevel(res.currentLevel)
    gameStore.setEnergyImprovement(res)
    energyUpLoader.value = false
  } catch (e) {
    energyUpLoader.value = false
    appStore.setError('Failed to upgrade energy level')
    console.log(e)
  }
}
const upClicker = async () => {
  autoClickerUpLoader.value = true
  try {
    const res = getGame.value.improvements.autoClicker.currentLevel===0?
      await AutoClickerApi.buyClicker()
      : await AutoClickerApi.upgradeClicker()

    if(!res) {
      autoClickerUpLoader.value = false
      return
    }
    gameStore.setAutoClickerImprovement(res)
    autoClickerUpLoader.value = false
  } catch (e) {
    autoClickerUpLoader.value = false
    appStore.setError('Failed to upgrade auto clicker')
    console.log(e)
  }
}
const claimClicker = async () => {
  try {
    claimClickerLoader.value = true
    const res = await AutoClickerApi.claimClickerPoints()
    if (!res) {
      claimClickerLoader.value = false
      return
    }
    gameStore.setAutoClickerBalance(0)
    profileStore.setCoins(getProfile.value.coins + res.coins)
    claimClickerLoader.value = false
  } catch (e) {
    claimClickerLoader.value = false
    appStore.setError('Failed to claim autoclicker points')
    console.log(e)

  }
}

</script>


<template class="template">

    <PageContainer class="boostContainer" page-title="BOOST">

          <div class="questsTitle">FEATURES <span v-on:click="getAutoclicker">🔄</span></div>
          <Column>
              <Button
                v-if="getGame?.improvements.autoClicker.currentLevel>0&&getGame?.improvements.autoClicker.currentValue>1"
                :loader="claimClickerLoader"  v-on:click="claimClicker"
                :disabled="getGame?.autoClickerBalance===0">
                <GridFour
                  leftTop="🤖AUTOCLICKER"
                  leftBottom="It collected some for you"
                  :rightTop="'⛓ '+getGame?.autoClickerBalance+'/'+getGame?.improvements.autoClicker.currentValue"
                  rightBottom="CLAIM"
                />
                <div class="progressBar" style="width: 100%; margin-top: 5px"><div class="progressBarBar" :style="{width: getGame?.autoClickerBalance/getGame?.improvements.autoClicker.currentValue*100+'%'}"/></div>
              </Button>

              <Button :loader="refillLoader" v-on:click="restoreEnergy" :disabled="(getProfile.maxEnergy == getProfile.energy ||  getProfile.dailyEnergyRefill == 0)">
                <GridFour
                  leftTop="🔋 RESTORE ENERGY"
                  leftBottom="Restore your energy once in a day"
                  rightTop="daily bonus"
                  rightBottom="FREE"
                />
              </Button>

                <div class="questsTitle">IMPROVEMENTS <span v-on:click="getLevel">🔄</span></div>

                <Loader v-if="levelsLoader === 'loading'" message="Loading improvements" />
                <ErrorScreen v-else-if="levelsLoader === 'error'" title="Failed to load improvements" message="Try again alter" hide-reload-button />


                <ImprovementCard
                  v-if="levelsLoader === 'successful'"
                  title="🤖AUTOCLICKER"
                  subtitle="Increase points limit to "
                  :level="getGame?.improvements.autoClicker.currentLevel"
                  :nextLevel="getGame?.improvements.autoClicker.nextLevel"
                  :nextAmount="getGame?.improvements.autoClicker.nextValue"
                  :upgradeCost="getGame?.improvements.autoClicker.upgradeCost"
                  :loading="autoClickerUpLoader"
                  :maxed="!getGame?.improvements.autoClicker.next"
                  :handler="upClicker"
                />
                <ImprovementCard
                  v-if="levelsLoader === 'successful'"
                  title="⛓ BASED CLICKS"
                  subtitle="Increase points per click to "
                  :level="getGame?.improvements.pointsPerClick.currentLevel"
                  :nextLevel="getGame?.improvements.pointsPerClick.nextLevel"
                  :nextAmount="getGame?.improvements.pointsPerClick.nextValue"
                  :upgradeCost="getGame?.improvements.pointsPerClick.upgradeCost"
                  :loading="clicksUpLoader"
                  :maxed="!getGame?.improvements.pointsPerClick.next"
                  :handler="upClick"
                />
                <ImprovementCard
                  v-if="levelsLoader === 'successful'"
                  title="⚡️ENERGY"
                  subtitle="Increase energy limit to "
                  :level="getGame?.improvements.maxEnergy.currentLevel"
                  :nextLevel="getGame?.improvements.maxEnergy.nextLevel"
                  :nextAmount="getGame?.improvements.maxEnergy.nextValue"
                  :upgradeCost="getGame?.improvements.maxEnergy.upgradeCost"
                  :loading="energyUpLoader"
                  :maxed="!getGame?.improvements.maxEnergy.next"
                  :handler="upEnergy"
                />

              <div class="questsTitle">QUESTS<span v-on:click="checkQuestsStatuses">🔄</span></div>

              <Loader v-if="questsLoader === 'loading'" message="Loading quests" />
              <ErrorScreen v-else-if="questsLoader === 'error'" title="Failed to load quests" message="Try again alter" hide-reload-button />
              <Column v-if="getGame">

                <QuestCard
                  v-if="questsLoader === 'successful'"
                  custom-title
                  title="TRUST QUEST"
                  customTitleClass="trustQuestGradient"
                  customIcon="/trust.svg"
                  subtitle="Verify Trust Wallet"
                  :href="trustQuestUrl"
                  :completed="getGame?.quests?.trustWallet"
                  prize="10000"
                />

                <QuestCard
                  v-if="questsLoader === 'successful'"
                  custom-title
                  title="OKX QUEST"
                  subtitle="Verify OKX Wallet"
                  :href="encodedUrl"
                  :completed="getGame?.quests?.okx"
                  prize="10000"
                  customIcon="/okx.png"
                />

                <QuestCard
                  v-if="questsLoader === 'successful'"
                  title="📣 ONCHAIN NEWS"
                  subtitle="Join telegram channel"
                  href="https://t.me/onchainchain"
                  :completed="getGame?.quests?.tgChannel"
                  prize="1000"
                  :handler="() => doubleCheck(checkAllQuests)"
                />
                <QuestCard
                  v-if="questsLoader === 'successful'"
                  title="🐤 Join Onchain X"
                  subtitle="Follow Onchain on Twitter"
                  :href="`/api/redirect/twi?tgId=${getTgId}`"
                  :completed="getGame?.quests?.twitter"
                  prize="500"
                  :handler="() => doubleCheck(checkAllQuests)"
                />

                <QuestCard
                  v-if="questsLoader === 'successful'"
                  title="🐤 SPREAD THE WORD"
                  subtitle="Tweet and tag @onchaincoin"
                  :href="`/api/redirect/postw?tgId=${getTgId}`"
                  :completed="getGame?.quests?.postw"
                  prize="1500"
                  :handler="() => doubleCheck(checkAllQuests)"
                />
              </Column>



            </Column>
            <div class="ref" v-if="getProfile?.isAdmin">
                <RouterLink to="/boost2">
                    Boost
                </RouterLink>
            </div>

    </PageContainer>
</template>

<style>
.updateSubtitle {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.65);
    margin-top: 7px;
    margin-bottom: 7px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
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

.ref {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 20px;
    width: 50px;
    height: 50px;
    opacity: 0;
}

.max {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50px;
    margin-top: 30px;
    margin-left: -15px;

}

.maxEn {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50px;
    margin-top: 10px;
    margin-left: -15px;
}

.updateLoading {
    display: flex;
    justify-content: space-between;
    padding-left: 16px;
    padding-right: 16px;
    margin-bottom: 16px;
    background: rgba(255, 255, 255, 0.13);
    border: 1px solid #000;
    backdrop-filter: blur(18px);
    width: 100%;
    height: 74px;
    align-items: center;
    margin-top: 16px;
    opacity: 0.5;
    pointer-events: none;
}

.update {
    display: flex;
    justify-content: space-between;
    padding-left: 16px;
    padding-right: 16px;
    margin-bottom: 16px;
    background: rgba(255, 255, 255, 0.13);
    backdrop-filter: blur(18px);
    border: 1px solid #000;
    width: 100%;
    height: 74px;
    align-items: center;
    margin-top: 16px
}

.allBoosts {
    max-height: calc(100% - 100px);
    overflow-y: scroll;
}

.updateLock {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding-left: 16px;
    padding-right: 16px;
    margin-bottom: 16px;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(18px);
    color: rgba(255, 255, 255, 0.5);
    pointer-events: none;
    width: 100%;
    height: 92px;
    align-items: center;
    margin-top: 16px;
    /* opacity: 0; */
}

.updateLock2 {
    opacity: 0;
}

.updateSmall {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 74px;
    align-items: center;
}

.updatePoints {
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 7px;
    margin-bottom: 7px;

    img {
        transform: rotate(180deg);
        margin-left: 5px;
    }
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

.boostContainer {
    width: 100%;
    background-size: cover;
    background-position: center;
    color: white;
    overflow-y: scroll;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
}

.squadRowGen {
    color: rgba(255, 255, 255, 0.65)
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
.questLink {
    text-decoration: none;
}
.trustQuestGradient {
  background: #0000FF;
  background: linear-gradient(to right, #0000FF 0%, #0094FF 44%, #48FF91 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.okxQuestGradient {

}
.okxIcon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
  margin-left: 0px !important;
}
.trustIcon {
  width: 16px;
  height: 16px;

}
.questsTitle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  span {
    width: max-content;
  }
}
</style>



<!--:a-handler="(e:any)=>{-->
<!--if(trustClicked) {-->
<!--e.preventDefault();-->
<!--checkQuestsStatuses();-->
<!--} else {-->
<!--if(getGame?.quests.trustWallet){-->
<!--e.preventDefault()-->
<!--} else {-->
<!--event('trust_quest_click',{-->
<!--user_id: getProfile.tgId,-->
<!--username: getProfile.fullName-->
<!--})-->
<!--}-->
<!--}-->
<!--}"-->

<!--:a-handler="(e:any)=>{-->
<!--if(okxClicked) {-->
<!--e.preventDefault();-->
<!--checkQuestsStatuses();-->
<!--} else {-->
<!--if(getGame?.quests.okx){-->
<!--e.preventDefault()-->
<!--} else {-->
<!--event('okx_quest_click',{-->
<!--user_id: getProfile.tgId,-->
<!--username: getProfile.fullName-->
<!--})-->
<!--}-->
<!--}-->
<!--}"-->
