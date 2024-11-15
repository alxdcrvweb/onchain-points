// Utilities
import { defineStore } from 'pinia';

export const useAppStore = defineStore('application', {
    state: () => ({
        errorMsg: '',
        showError: false,
    }),
    actions: {
        setError(msg: string) {
            this.errorMsg = msg;
            this.showError = true;
            console.log('Error: ', msg);
            setTimeout(() => {
                this.showError = false;
                this.errorMsg = '';
            }, 5000);
        },
    },
    getters: {
        getErrorMsg: (state) => state.errorMsg,
        getShowError: (state) => state.showError,
    }
});
