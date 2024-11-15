<template>
  <div class="row">
    <div class="left">{{left}}</div>
    <div class="right">{{right}}<slot/></div>
  </div>
</template>

<script lang="ts">
import {anyTypeAnnotation} from "@babel/types";

export default {
  name: 'TwoColumns',
  props: ['left', 'right']
  //   {
  //   left: {
  //     type: String,
  //     required: true
  //   },
  //   right: {
  //     type: String | Object,
  //     required: true
  //   }
  // }
}

</script>
<style lang="scss">
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
  letter-spacing: 0.7px;
  text-transform: uppercase;
  .left {
    color: rgba(255, 255, 255, 0.64);

  }
  .right {
    color: #FFF;
  }
}
</style>
