import { Response, Request, SocketAdapter } from "./interface";

interface VsCode {
    postMessage: (message: Request) => void
}

export class VSCodeSocket implements SocketAdapter {
    private vscode: VsCode
    listener: any = null

    constructor() {
        this.vscode = (window as any).acquireVsCodeApi && (window as any).acquireVsCodeApi()
        if (!this.vscode) {
            throw Error('VSCodeSocket 仅支持在 vscode 插件的 webview 功能中使用')
        }

        window.addEventListener('message', (event: any) => {
            this.listener && this.listener(event.data)
        });
    }

    send(message: Request): any {
        this.vscode.postMessage(message)
    }

    onmessage(callback: (message: Response) => any) {
        this.listener = callback
    }
}
