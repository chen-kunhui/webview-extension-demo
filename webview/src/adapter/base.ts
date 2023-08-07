import { createApp } from 'vue';
import { AjaxSender } from './interface';
import { AjaxRequest } from './ajax';

export function createVue(component: any, callback?: (vue: any) => void) {
    const vscode = (window as any).acquireVsCodeApi && (window as any).acquireVsCodeApi()
    const ajax: AjaxSender = new AjaxRequest(vscode);

    let app = createApp(component)
    app.provide('$ajax', ajax)

    callback && callback(app)

    app.mount('#app');
}
