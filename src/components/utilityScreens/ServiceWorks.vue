<template>
  <FullPageContainer>
    <div class="grid">
      <div/>
      <div class="sw-text">
        Chain Game is under maintenance, we'll be back as soon as possible
      </div>
      <div/>
      <img src="/service-works.png"/>
      <div/>
      <div class="sw-text sw-text2">
        Follow our channel to stay tuned
      </div>
      <a class="wide" href="https://t.me/onchainchain">
        <Button :onClick="() => {}">
          <div class="btn-t1">📣 onchain news</div>
          <div class="btn-t2">Join telegram channel</div>
        </Button>
      </a>
      <div/>
    </div>
  </FullPageContainer>
</template>

<script lang="ts">
import FullPageContainer from "@/components/layouts/FullPage.vue";
import Button from "@/components/button/button.vue";

export default {
  name: 'ServiceWorks',
  components: {Button, FullPageContainer},
  props: {
    left: {
      type: String,
      required: true
    },
    right: {
      type: String,
      required: true
    }
  }
}

</script>
<style lang="scss">
.grid {
  display: grid;
  place-items: center;
  gap: 8px;
  grid-template-rows: 1fr max-content 1fr max-content 1fr max-content max-content 0.5fr;
  height: 100%;
}
.wide {
  width: 100%;
  text-align: left;
}
.sw-text {
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
  letter-spacing: 0.7px;
  text-transform: uppercase;
  //color: rgba(255, 255, 255, 0.64);
  text-align: center;
}
.sw-text2 {
  }
.btn-t1 {
  font-size: 14px;
  font-weight: 400;
  text-transform: uppercase;
  color: white;
  text-align: left;
}
.btn-t2 {
  font-size: 12px;
  font-weight: 400;
  line-height: 18px; /* 142.857% */
  letter-spacing: 0.7px;
  color: rgba(255, 255, 255, 0.64);
  text-align: left;

}
</style>
