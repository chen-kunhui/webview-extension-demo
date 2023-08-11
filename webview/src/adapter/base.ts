import { createApp } from 'vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { AjaxSender } from './interface';
import { AjaxRequest } from './ajax';

export function createVue(component: any, callback?: (vue: any) => void) {
    const vscode = (window as any).acquireVsCodeApi && (window as any).acquireVsCodeApi()
    const ajax: AjaxSender = new AjaxRequest(vscode);

    let app = createApp(component)
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component)
    }

    app.provide('$ajax', ajax)

    callback && callback(app)

    app.mount('#app');
}
