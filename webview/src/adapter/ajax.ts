import { AjaxConfig, AjaxSender, AjaxResponse, VsCode } from "./interface"
import axios from 'axios'

interface RequestCache {
    uuid: string
    request: AjaxConfig
    onSuccessDo: (data: any) => void
    onCatchDo: (error: any) => void
    startAt: number
}

export class AjaxRequest implements AjaxSender {
    private _pool: { [uuid: string]: RequestCache } = {}

    constructor(private vscode: VsCode | undefined) {
        if (vscode) {
            window.addEventListener('message', (event: any) => {
                const respond: any = event.data

                const request: RequestCache = this._pool[respond.uuid];

                if (!request) {
                    return console.error("接收到 IDE 的消息，但没有进行分发, 消息内容为：", event)
                }

                const duration = new Date().getTime() - request.startAt
                console.log(`[webview] ${respond.request.method} ${respond.request.url} ${respond.status} ${duration}ms [${respond.uuid}]`)

                delete this._pool[respond.uuid]

                if (respond.status >= 400) {
                    return request.onCatchDo(new Error(`status: ${respond.status}, data: ${respond.data}`))
                }

                request.onSuccessDo({
                    data: respond.data,
                    status: respond.status || 200,
                    statusText: respond.statusText || 'success',
                })
            });
        }
    }

    send<T>(config: AjaxConfig): Promise<AjaxResponse<T>> {
        if (this.vscode) {
            return this._sendRequestByVscode(config)
        } else {
            return axios(config)
        }
    }

    private _sendRequestByVscode<T>(config: AjaxConfig): Promise<AjaxResponse<T>> {
        return new Promise<AjaxResponse<T>>((resolve, reject) => {
            if (!this.vscode) {
                reject(new Error('ajax error - vscode is null!'))
            }
    
            try {
                let uuid: string = this._getUUID()
                // 将回调函数缓存起来，待 vscode 返回消息后，再触发，将结果返回给发送者
                this._pool[uuid] = {
                    uuid: uuid,
                    request: config,
                    onSuccessDo: resolve,
                    onCatchDo: reject,
                    startAt: new Date().getTime()
                };
                console.log(`[webview] ${config.method} ${config.url} [${uuid}]`)
                this.vscode && this.vscode.postMessage({uuid: uuid, request: config})
            } catch (error) {
                reject(error)
            }
        })
    }

    private _getUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      }
}
