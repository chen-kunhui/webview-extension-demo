import { createApp } from 'vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { Socket, SocketImpl } from 'simple-webview';

export function createVue(component: any, callback?: (vue: any) => void) {
    const socket: Socket = new SocketImpl();

    let app = createApp(component)
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component)
    }

    app.provide('$socket', socket)

    callback && callback(app)

    app.mount('#app');
}
