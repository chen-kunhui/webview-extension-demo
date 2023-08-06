import { createApp } from 'vue';

export function createVue(component: any, callback?: (vue: any) => void) {
    let app = createApp(component)
    callback && callback(app)
    app.mount('#app');
}
