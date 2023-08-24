import { createApp } from 'vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { Socket, SocketAdapter, SocketImpl, VSCodeSocket } from 'simple-webview';
import { MockSocket } from '@/mock/mockServer';

export function createVue(component: any, callback?: (vue: any) => void) {
    let adapter: SocketAdapter | null = null
    try {
        adapter = new VSCodeSocket()
    } catch (error) {
        // 这是一个用于在浏览器环境中测试使用的
        // 如果在非 vscode 环境，请自行实现 SocketAdapter 并替换 new MockSocket()
        adapter = new MockSocket()
    }
    const socket: Socket = new SocketImpl(adapter);

    let app = createApp(component)
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component)
    }

    app.provide('$socket', socket)

    callback && callback(app)

    app.mount('#app');
}
