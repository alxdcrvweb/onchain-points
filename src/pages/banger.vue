<template>
    <banger />
</template>

<script lang="ts">
import { useUserStore } from '@/store/app';
import WebApp from '@twa-dev/sdk';
import { storeToRefs } from 'pinia';
import banger from '@/components/onchain-game/banger.vue'
export default {
    setup() {
        const userStore = useUserStore();
        const { getUser } = storeToRefs(userStore);
        return {
            user: getUser
        };
    },
    data() {
        return {};
    },
    methods: {
        navigate(path: string) {
            this.$router.push(path);
        },
        showAlert(text: string) {
            WebApp.showAlert(text);
        }
    },
    components: { banger }
};
</script>
