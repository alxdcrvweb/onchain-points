<template>
  <div v-if="show" class="errorNotificationContainer">
    <div class="content">
      {{ msg }}
    </div>
  </div>
</template>

<script lang="ts">
import {storeToRefs} from "pinia";
import {useAppStore} from "@/store/application";
import {ref, watch} from "vue";
export default {
  name: 'ErrorNotification',
  props: {
    message: {
      type: String,
      required: false
    },
  },
  setup() {


    const appStore = useAppStore()
    const {getErrorMsg,getShowError} = storeToRefs(appStore)
    const msg = ref('')
    const show = ref(false)

    watch(
      () => getShowError.value,
      (s) => {
        console.log('show error',s)
        show.value = s
      }
    )
    watch(
      () => getErrorMsg.value,
      (m) => {
          console.log('error msg',m)
          msg.value = m
        }
    )
    return {
      msg,
      show
    }
  },
}
</script>
<style lang="scss">
  .errorNotificationContainer{
    position: fixed;
    z-index: 9999999999999999;
    top: 10%;
    left: 16px;
    right: 16px;
    bottom: auto;
    text-align: center;
    height: max-content;
    color: white;
    background: linear-gradient(121.56deg, rgba(245, 2, 2, 0.51) 0%, rgba(204, 23, 23, 0) 12%, rgba(155, 6, 6, 0) 20%, rgba(201, 25, 25, 0.14) 48.5%, rgba(255, 255, 255, 0) 78%, rgba(245, 2, 2, 0) 88.5%, rgba(245, 2, 2, 0.47) 100%);
    padding: 2px;
    .content {
      background: black;
      padding: 8px;
    }
  }
</style>
