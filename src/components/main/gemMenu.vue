<script setup lang="ts">
import Column from "@/components/layouts/Column.vue";

const {close} = defineProps({
    close: {
      type: Function,
      required: true
    },
  }
)
import {useProfileStore} from "@/store/profile";
import {onMounted, ref, watch} from "vue";
import Button from "@/components/button/button.vue";
import {inputDebounce} from "@/utils/utilities";
import {searchUsers, sendGem} from "@/api/friends";
import {useUserStore} from "@/store/app";
import {storeToRefs} from "pinia";
import BlockContainer from "@/components/layouts/BlockContainer.vue";
import TwoColumns from "@/components/layouts/TwoColumns.vue";
import {useAppStore} from "@/store/application";
const appStore = useAppStore();
const profileStore = useProfileStore();
const authStore = useUserStore()
const {getJwt} = storeToRefs(authStore)
const {getBoosts} = storeToRefs(profileStore)

const openGemMenu = ref(false);
const openSendFriend = ref(false);
const openSendFriendSuccessful = ref(false);
const openBoostSquad = ref(false);
const loader = ref(false);
const inputFocused = ref(false);
const friendsName = ref('');
const foundedUsers = ref<{ fullName:string, _id:number }[]>([]);
const chosenFriend = ref<{ fullName:string, _id:number }|null>(null);

onMounted(() => {
  openGemMenu.value = true;
});
const findFriends = async (e:any) => {
  friendsName.value = e.target.value;
  if(!e?.target?.value||e.target.value.length<3) return foundedUsers.value = [];
  const res = await searchUsers(e.target.value)
  foundedUsers.value = res.users;
};
const deb = inputDebounce(findFriends, 1000);


const send = async (type:'squad'|'friend') => {
  const res = await sendGem(type, chosenFriend.value?._id)
  if(res){
    console.log('getBoosts',getBoosts.value)
    profileStore.setRemainingGems('-')
    console.log('getBoosts',getBoosts.value)
    if(type==='squad'){
      openBoostSquad.value = true;
      openGemMenu.value = false;
    } else {
      openSendFriend.value = false;
      openSendFriendSuccessful.value = true;
    }
  } else {
    appStore.setError('Something went wrong')
  }
  loader.value = false;


};

</script>

<template>

  <div v-if="openGemMenu||openSendFriend||openSendFriendSuccessful||openBoostSquad" class="gemMenuContainer">
  <div v-if="openGemMenu" class="gemMenu">
    <div class="gemTitle">Congratulations!</div>
    <div class="gemMessage">
      The rarest gem is in your hands!
      <br/>
      Now make a decision!
    </div>
    <Column>
      <Button
        @click="send('squad')"
        style="text-align: left"
        :disabled="loader"
      >💪 BOOST YOUR SQUAD WITH 💎</Button>
      <Button
        @click="
        openGemMenu = false;
        openSendFriend = true;
      "
        style="text-align: left">🎁 GIFT TO FRIEND 💎</Button>
    </Column>
  </div>


  <div v-if="openBoostSquad" class="gemMenu">
    <div class="gemMenuEmoji">🔥</div>
    <div class="gemTitle">Wohoo!</div>
    <div class="gemMessage">
      You boosted your squad!
    </div>
    <Button
      @click="
        openBoostSquad = false;
        openGemMenu = false;
        openSendFriendSuccessful = false;
        openSendFriend = false;
        close()

      "
    >Continue</Button>
  </div>

    <div v-if="openSendFriend" :class="{'gemMenu':true, 'fs':inputFocused}" >
      <img src="/chevron-right.svg" class="chevron" @click="openSendFriend=false;openGemMenu=true"/>
      <div class="gemMenuEmoji">📝</div>
      <div class="gemTitle">Ok!</div>
      <div class="gemMessage">
        Write your friend's tg handle to Bot and we'll
        surprise them with a gem from you!
      </div>
      <form
        @submit="
            openSendFriend = false;
            openSendFriendSuccessful = true;
        "
      >
        <input
          type="text"
          id="friendsName"
          name="friendsName"
          :value="friendsName"
          placeholder="@friendName"
          v-on:input="(e)=>deb(e)"
          v-on:focus="inputFocused=true"
          v-on:blur="inputFocused=false"
        />
        <BlockContainer v-if="foundedUsers.length>0" class="foundedUsers">
            <div v-for="user in foundedUsers" :key="user._id" class="foundedUser" v-on:click="chosenFriend=user">
              <div :class="{'checkbox':true, 'checked':user._id===chosenFriend?._id}" />{{user.fullName}}
            </div>
        </BlockContainer>
        <Button
          @click="send('friend')" type="submit" :disabled="loader||!chosenFriend||!foundedUsers.includes(chosenFriend)" >Send</Button>
      </form>
    </div>

  <div v-if="openSendFriendSuccessful" class="gemMenu">
    <div class="gemMenuEmoji">🤜🤛</div>
    <div class="gemTitle">Bro!</div>
    <div class="gemMessage">
      You sent a gem to {{chosenFriend?.fullName||'your friend'}}!
    </div>
    <Button
      @click="
        openGemMenu = false;
        openSendFriend = false;
        openBoostSquad = false;
        openSendFriendSuccessful = false;
        close()
      "
    >Continue</Button>
  </div>
  </div>

</template>

<style lang="scss">
.gemContainer {
  position: fixed;
  top: auto;
  left: auto;
  right: auto;
  bottom: auto;
  width: max-content;
  height: max-content;
  transition: all 1s ease;
  z-index: 9999999999;
  transform: translate(-50%, -50%);
}
.gemEmoji {
  font-size: 30px;
}
@keyframes show {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

.gemMenuContainer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.5);
  z-index: 99999999;
  //display: flex;
  //justify-content: center;
  //align-items: center;
}
.gemMenu {
  position: fixed;
  top: auto;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: max-content;
  //min-height: 70vh;
  padding: 40px 20px 100px;
  background-color: black;
  border-radius: 30px 30px 0 0 ;
  border-top: 1px solid darkgrey;
  z-index: 9999999999;
  &.fs {
    height: 100vh;
  }
  .gemMenuEmoji{
    font-size: 60px;
    text-align: center;
    margin-bottom: 20px;
  }
  .gemTitle {
    font-size: 24px;
    font-weight: bold;
    color: white;
    text-align: center;
    margin-bottom: 20px;
  }
  .gemMessage {
    font-size: 16px;
    color: white;
    text-align: center;
    margin-bottom: 40px;
  }
  .chevron {
    transform: rotate(180deg);
    width: 30px;
    height: 30px;
  }
}

.foundedUsers {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  .foundedUser {
    padding: 10px;
    font-size: 14px;
    color: white;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    &:not(:last-child) {
      border-bottom: 1px solid #363636;
    }
  }
}
</style>
