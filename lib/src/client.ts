import { Socket, JsonData, Response, Respond, SocketAdapter} from "./interface"
import { PUBLIC_CHANNEL_UUID  } from "./constant"
import { buildUUID  } from "./utils"

interface RequestCache {
    uuid: string
    url: string
    onSuccessDo: (data: any) => void
    onCatchDo: (error: any) => void
    startAt: number
}

export class SocketImpl implements Socket {
    private _pool: Map<string, RequestCache> = new Map()

    constructor(private socket: SocketAdapter) {
        this.socket.onmessage((respond: Response) => {
            let request: RequestCache | undefined
    
            if (respond.uuid === PUBLIC_CHANNEL_UUID) {
                request = this._pool.get(respond.url)
            } else {
                request = this._pool.get(respond.uuid)
                this._pool.delete(respond.uuid)
            }
    
            if (!request) {
                return console.error("接收到 IDE 的消息，但没有进行分发, 消息内容为：", respond)
            }
    
            const duration = new Date().getTime() - request.startAt
            console.log(`[webview] ${respond.url} ${respond.errorMsg ? respond.errorMsg : 'success'} ${duration}ms [${respond.uuid}]`)
    
    
            if (respond.errorMsg) {
                return request.onCatchDo(new Error(respond.data.message))
            }
    
            request.onSuccessDo(respond.data)
        })
    }

    send(url: string, params?: JsonData): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            try {
                let uuid: string = buildUUID()
                // 将回调函数缓存起来，待 vscode 返回消息后，再触发，将结果返回给发送者
                this._pool.set(uuid, {
                    uuid: uuid,
                    url: url,
                    onSuccessDo: resolve,
                    onCatchDo: reject,
                    startAt: new Date().getTime()
                })
                console.log(`[webview] ${url} [${uuid}]`)
                this.socket.send({ uuid, url, params: params || {} })
            } catch (error) {
                reject(error)
            }
        })
    }

    listen(channel: string, callback: Respond) {
        this._pool.set(channel, {
            uuid: PUBLIC_CHANNEL_UUID,
            url: channel,
            onSuccessDo: callback,
            onCatchDo: callback,
            startAt: new Date().getTime()
        })
    }
}
