<script setup lang="ts">
import BlockContainer from "@/components/layouts/BlockContainer.vue";
import GridFour from "@/components/layouts/GridFour.vue";
import {ref} from "vue";
const locked = ref(false)
const lock = () => {
  locked.value = true
  setTimeout(() => {
    locked.value = false
  }, 200)
}

defineProps({
  title: String,
  customTitle: Boolean,
  customTitleClass: String,
  customIcon: String,
  subtitle: String,
  href: String,
  completed: Boolean,
  prize: String,
  handler: Function,
  aHandler: Function,
})
</script>
<template>
  <a class="questLink" :href="href" v-on:click="(e)=>{aHandler && aHandler(e)}" target="_blank">
  <Button
    :loader="locked"
    :on-click="()=>{
    handler&&handler()
    lock()
  }" :disabled="locked||completed" >
    <div v-if="completed" class="questCompleted">✔️ COMPLETE</div>
    <div v-else-if="locked" class="questCompleted">LOCKED</div>
    <GridFour
      :leftTop="!customTitle?title:''"
      :leftBottom="subtitle"
      rightTop="⛓ Prize"
      :rightBottom="prize"
    >
      <div v-if="customTitle" :class="`customTitle ${customTitleClass}`"><img class="customImage" v-if="customIcon" :src="customIcon">{{title}}</div>
    </GridFour>
  </Button>
  </a>
</template>


<style lang="scss">
.improvementCard {
  display: flex;
  justify-content: space-between;
  //padding: 16px;
  //margin: 16px 0;
  backdrop-filter: blur(10px) invert(5%);
  width: 100%;
  height: max-content;
  align-items: center;
  &.locked {
    filter: blur(1px);
    opacity: 0.7;
  }

}
.questLink {
  text-decoration: none;
  width: 100%;
}
.questCompleted {
  position: relative;
  text-align: left;
  width: 100%;
  font-size: 12px;
  margin-bottom: 5px;
  color: white;
}
.customImage {
  width: 16px;
  height: 16px;
  margin-right: 5px;
}
.customTitle {
  display: flex;
  align-items: center;
  color: white;
}

</style>
