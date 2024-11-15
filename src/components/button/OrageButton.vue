<template>
    <button @click="buttonHandler" class="button" :disabled="disabled || loader">
      <div class="oragneButton">
        <slot/>
      </div>
    </button>
</template>

<script lang="ts">
  import {ref} from "vue";
  import BlockContainer from "@/components/layouts/BlockContainer.vue";
  const touched = ref(false)
  export default {
    name: 'OrangeButton',
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
  text-decoration: none;
  cursor: pointer;
  width: 100%;
  border: 0;
  position: relative;
  font: 14px Poppins;
  font-style: normal;
  font-weight: 400;

  .oragneButton{
    padding: 18px;
    border: 1px solid;
    border-image: linear-gradient(90deg, rgba(0, 0, 0, .08), #ff9c12 50.08%, transparent) 1 !important;
  }
}

</style>

