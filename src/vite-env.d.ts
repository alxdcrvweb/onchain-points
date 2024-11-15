/// <reference types="vite/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}
declare module '@erfanmola/televue' {
    export = <any>{};
}

declare module '@jamescoyle/vue-icon' {
    export = <any>{};
}
