<script setup lang="ts">

import BlockContainer from "@/components/layouts/BlockContainer.vue";
import {numberWithCommas} from "../../utils/get";
import {onBeforeUnmount, onMounted, ref} from "vue";
import Button from "@/components/button/button.vue";
import OrangeButton from "@/components/button/OrageButton.vue";
import {useUserStore} from "@/store/app";
import {storeToRefs} from "pinia";
import {serviceUrl, serviceUrlSliced} from "@/utils/variables";
import {useProfileStore} from "@/store/profile";

const userStore = useUserStore()
const profileStore = useProfileStore()
const {getProfile, getClaimInfo} = storeToRefs(profileStore)
const {getJwt} = storeToRefs(userStore)
const tab = ref(0);
const timer = ref('0d 0h 0m 0s')
const timerInterval = ref<any>(null)
const timeIsOver = ref(false)
const copied = ref(false)

const encodedDappUrl = encodeURIComponent(`${serviceUrl}/registration?key=${getJwt.value}`);
const deepLink = "okx://wallet/dapp/url?dappUrl=" + encodedDappUrl;
const encodedUrl = "https://www.okx.com/download?deeplink=" + encodeURIComponent(deepLink);
const trustUrl = `https://link.trustwallet.com/open_url?url=${serviceUrl}/registration?key=${getJwt.value}`
const metamaskUrl = `https://metamask.app.link/dapp/${serviceUrlSliced}/registration?key=${getJwt.value}`

const encodedDappUrlChangeWallet = encodeURIComponent(`${serviceUrl}/changeWallet?key=${getJwt.value}&address=${getProfile?.value?.sigAddress}`);
const deepLinkChangeWallet = "okx://wallet/dapp/url?dappUrl=" + encodedDappUrlChangeWallet;
const encodedUrlChangeWallet = "https://www.okx.com/download?deeplink=" + encodeURIComponent(deepLinkChangeWallet);
const trustUrlChangeWallet = `https://link.trustwallet.com/open_url?url=${serviceUrl}/changeWallet?key=${getJwt.value}&address=${getProfile?.value?.sigAddress}`
const metamaskUrlChangeWallet = `https://metamask.app.link/dapp/${serviceUrlSliced}/changeWallet?key=${getJwt.value}&address=${getProfile?.value?.sigAddress}`

const copyDAppUrl = (ch?:'change') => {
  const url = ch?`${serviceUrl}/changeWallet?key=${getJwt.value}&address=${getProfile?.value?.sigAddress}`:`${serviceUrl}/registration?key=${getJwt.value}`
  navigator.clipboard.writeText(url)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
onMounted(() => {
  runTimer()
  timerInterval.value = setInterval(runTimer, 1000)
})
onBeforeUnmount(() => {
  timerInterval.value && clearInterval(timerInterval.value)
})

const runTimer = () => {
  const timerTo = new Date('2024-06-28T00:00:00').getTime()
  const now = new Date().getTime()
  const nowGmt0 = new Date(now + (new Date().getTimezoneOffset() * 60000)).getTime();
  const diff = timerTo - nowGmt0;

  if(diff < 0) {
    timerInterval.value && clearInterval(timerInterval.value)
    timer.value = '0d 0h 0m 0s'
    timeIsOver.value = true
    return
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  timer.value = `${days}d ${hours}h ${minutes}m ${seconds}s`
}

</script>

<template>
  <FullPageContainer>

    <div v-if="getClaimInfo.claimedCoins===0" class="claimPage">
      <div class="tabBlock">
        <div class="tab"/>
      </div>
      <div class="claimGuideTitle registered">This claim is over, stay tuned for what’s to come!</div>
      <a href="https://t.me/onchainchain" target="_blank">
        <OrangeButton>Onchain</OrangeButton>
      </a>
    </div>

<!--    <div v-else class="claimPage">-->
<!--      <div class="tabBlock">-->
<!--        <div class="tab" @click="tab=0"/>-->
<!--        <div class="tab" @click="tab=1" :style="{background:tab>=1?'white':'grey'}"/>-->
<!--        <div v-if="tab===2" class="tab" @click="tab=3"/>-->
<!--      </div>-->

<!--      <div v-if="tab===0">-->
<!--        <BlockContainer>-->
<!--          <div class="textGrey">Your tokens&nbsp;&nbsp;<span>Onchain</span> for {{getClaimInfo.sigAddress.slice(0,4)+'...'+getClaimInfo.sigAddress.slice(-4)}} wallet</div>-->
<!--          <div class="goldenNumbers">{{numberWithCommas(getClaimInfo?.claimedCoins)}}</div>-->
<!--        </BlockContainer>-->
<!--        <div style="height: 8px"/>-->
<!--        <BlockContainer>-->
<!--          <div class="textGrey">Time to the end of the <span>claim</span></div>-->
<!--          <div class="goldenNumbers">{{timer}}</div>-->
<!--        </BlockContainer>-->
<!--      </div>-->
<!--      <div v-else-if="tab===1">-->
<!--        <div class="claimGuideTitle">Guide to <span>claim</span></div>-->



<!--        <div class="claimGuidePaddings">-->
<!--          <BlockContainer>-->
<!--            <div class="claimStage cs1">-->
<!--              <div class="claimEmoji">⚡️</div>-->
<!--              <div class="claimNumber">1</div>-->
<!--              <div class="claimText">Download OKX wallet to your smartphone</div>-->
<!--            </div>-->
<!--          </BlockContainer>-->
<!--          <BlockContainer>-->
<!--            <div class="claimStage cs2">-->
<!--              <div class="claimEmoji">🔋</div>-->
<!--              <div class="claimNumber">2</div>-->
<!--              <div class="claimText">Add Onchain to your networks</div>-->
<!--            </div>-->
<!--          </BlockContainer>-->
<!--          <BlockContainer>-->
<!--            <div class="claimStage cs3">-->
<!--              <div class="claimEmoji">🪙</div>-->
<!--              <div class="claimNumber">3</div>-->
<!--              <div class="claimText">Bridge ETH for gas to Onchain chain</div>-->
<!--            </div>-->
<!--          </BlockContainer>-->
<!--          <BlockContainer>-->
<!--            <div class="claimStage cs4">-->
<!--              <div class="claimEmoji">🌐</div>-->
<!--              <div class="claimNumber">4</div>-->
<!--              <div class="claimText">Claim onchain on browser</div>-->
<!--            </div>-->
<!--          </BlockContainer>-->
<!--        </div>-->
<!--      </div>-->

<!--      <div/>-->

<!--      <OrangeButton v-if="tab===0" @click="tab++">VIEW CLAIM GUIDE</OrangeButton>-->
<!--      <a v-else-if="tab===1" :href="`https://airdrop.onchaincoin.io?toClaim=${getClaimInfo.toClaim}&tokens=${getClaimInfo.claimedCoins}&sigAddress=${getClaimInfo.sigAddress}&proofs=${JSON.stringify(getClaimInfo.proofs)}`" target="_blank">-->
<!--        <OrangeButton>CLAIM ON BROWSER</OrangeButton>-->
<!--      </a>-->

<!--    </div>-->
  </FullPageContainer>
</template>


<style lang="scss">
.claimPage {
  position: fixed;
  height: calc(100vh - 50px);
  width: 100vw;
  background: black;
  top: 20px;
  left: 0;
  border-radius: 30px 30px 0 0;
  display: grid;
  gap: 8px;
  font: 14px Poppins;
  font-style: normal;
  font-weight: 400;
  color: white;
  padding: 40px 24px;
  overflow: auto;
  grid-template-rows: repeat(2,max-content) 1fr max-content;
}
.textGrey {
  color: rgba(255, 255, 255, 0.64);
  span {
    color: white;
  }
}
.goldenNumbers {
  background: linear-gradient(90deg, #FFD600 0%, #A23100 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 24px;
  font-weight: 700;
  line-height: 36px;
  letter-spacing: 0.7px;
  font-style: italic;
}

.tabBlock{
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 50px;
  .tab {
    height: 3px;
    width: 32px;
    background: white;
  }
}

.claimGuideTitle{
  font-family: Poppins;
  font-size: 40px;
  font-weight: 700;
  line-height: 48px;
  font-style: italic;
  color: white;
  white-space: nowrap;
  margin-bottom: 24px;
  span {
    color: #FFD600;
  }
  &.registered{
    white-space: pre-wrap;
    font-size: 32px;
  }
  &.follow{
    font-size: 20px;
    font-weight: 400;
    line-height: 36px;
    font-style: normal;
    //color: rgba(255, 255, 255, 0.64);
    white-space: pre-wrap;
  }
}
.claimGuidePaddings{
  padding: 0 18px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.claimStage{
  display: grid;
  grid-template-columns: max-content max-content 1fr;
  gap: 8px;
  align-items: center;
  position: relative;
  .claimEmoji{
    font-size: 12px;
  }
  .claimNumber{
    font-size: 40px;
    font-weight: 700;
    line-height: 48px;
    font-style: italic;
    color: white;
    background: linear-gradient(94.22deg, rgba(255, 255, 255, 0.4) -1.07%, #FFFFFF 32.18%, rgba(255, 255, 255, 0.4) 104.41%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    width: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
  }
  .claimText{
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: white;
    letter-spacing: 0.05px;
    white-space: pre-wrap;
  }
  &.cs1::after{
    content: "";
    width: 8px;
    height: 104px;
    position: absolute;
    right: -24px;
    top: 50%;
    border: 1px solid #FFFFFF52;
    border-left-width: 0px;
  }
  &.cs2::after{
    content: "";
    width: 8px;
    height: 104px;
    position: absolute;
    left: -24px;
    top: 50%;
    border: 1px solid #FFFFFF52;
    border-right-width: 0px;
  }
  &.cs3::after{
    content: "";
    width: 8px;
    height: 104px;
    position: absolute;
    right: -24px;
    top: 50%;
    border: 1px solid #FFFFFF52;
    border-left-width: 0px;
  }

}
.later{
  background: rgba(255, 255, 255, 0.06);
  border: none;
  color: white;
  //font-size: 14px;
  //font-weight: 700;
  line-height: 24px;
  //font-style: italic;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 4px;
  width: max-content;
  margin: 14px auto 0;
}
.flex-center{
  display: flex;
  justify-content: center;
  gap: 8px;
}
.walletIcon{
  width: 22px;
  height: 22px;
  font-size: 16px;
  text-align: center;
}
.none-decoration{
  text-decoration: none;
  color: white;
}
.aligable{
  font-size: 20px;
  font-weight: 400;
  line-height: 36px;
  font-style: normal;
  //color: #FFD600;
  white-space: pre-wrap;
  margin-bottom: 24px;
}
</style>
