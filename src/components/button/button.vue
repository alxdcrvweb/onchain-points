<template>
    <button @click="buttonHandler" class="button" :disabled="disabled || loader">
      <div class="buttonLoader" v-bind:class="{'buttonLoader__loading':loader}" />
      <BlockContainer :backgroundColor="touched||disabled||loader?'#111111':'black'">
        <div :class="disabled||loader?'disabledButton':'buttonBG'"
          v-bind:class="{'animated': touched}"
        >
          <div :class="reverseIcon?'buttonGridReverse':'buttonGrid'">
            <div class="slotContainer">
              <slot/>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="chevron-right">
                <path id="Vector 144" d="M6 4L10 8L6 12" stroke="white"/>
              </g>
            </svg>
          </div>
        </div>
      </BlockContainer>
    </button>
</template>

<script lang="ts">
  import {ref} from "vue";
  import BlockContainer from "@/components/layouts/BlockContainer.vue";
  const touched = ref(false)
  export default {
    name: 'Button',
    computed: {
    },
    components: {BlockContainer},
    props: {
      onClick: Function,
      reverseIcon: Boolean,
      disabled: Boolean,
      loader: Boolean
    },
    setup() {
      return {touched}
    },
    methods: {
      buttonHandler() {
        this.onClick && this.onClick()
        this.touched = true
        setTimeout(() => {
          this.touched = false
        }, 200)
      },

    }
  }


</script>
<style lang="scss">
.button {
  color: white;
  padding: 0px;
  text-decoration: none;
  cursor: pointer;
  width: 100%;
  border: 0;
  position: relative;

    .slotContainer {
      flex-grow: 3
    }
    .buttonGrid {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .buttonGridReverse {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-direction: row-reverse;
      svg {
        transform: rotate(180deg);
      }
    }
  }
  .disabledButton{
    opacity: 0.7;
    //color: #8c8c8c;
  }
  .animated {

  }
  .buttonLoader {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0px;
    z-index: 3;
    border: 1px solid;
    border-image: linear-gradient(90deg, hsla(0, 0%, 100%, 0) 1.88%, hsla(0, 0%, 100%, .4) 49.36%, hsla(0, 0%, 100%, 0) 96.52%) 1;
    display: none;

    &.buttonLoader__loading {
      display: block;
      animation: loaderLine 1s infinite;
    }
  }
  @keyframes loaderLine {
    0% {
      width: 0;
      left: 0;
      right: auto;
    }
    50% {
      width: 100%;
    }
    100% {
      width: 0;
      right: 0;
      left: auto;
    }
  }
</style>
