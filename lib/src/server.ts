import { PUBLIC_CHANNEL_UUID } from "./constant";
import { JsonData, Route, ViewServer, Request, RouteHandle } from "./interface";

export class RouteDispatcher {
    private urlMap: Map<string, Route> = new Map();
    constructor (urls: Route[]) {
        for (let u of urls) {
            this.urlMap.set(u.url, u);
        }
    }

    mount(webview: ViewServer) {
        webview.onDidReceiveMessage((req: Request) => {
            let startAt = new Date()
            try {
                console.log(`[IDE] ${req.url} [${req.uuid}]`)
                const respond = (data: JsonData) => {
                    this._respond(webview, startAt.getTime(), req, data)
                }

                const send = (data: JsonData) => {
                    webview.postMessage({
                        uuid: PUBLIC_CHANNEL_UUID,
                        url: req.url,
                        data: data
                    })
                }

                const route: Route | undefined = this.urlMap.get(req.url)
                if (route) {
                    return route.handle.call(null, req.params, respond, send)
                }

                respond({message: 'url not found!'})
            } catch (error: any) {
                this._respond(webview, startAt.getTime(), req, {}, error)
            }
        })
    }

    private _respond(
        webview: ViewServer,
        startAt: number,
        req: Request,
        data: JsonData,
        error?: {message: string}
    ) {
        const duration = new Date().getTime() - startAt
        console.log(`[IDE] ${req.url} ${duration}ms [${req.uuid}]`)
        let baseRespondData: any = {
            uuid: req.uuid,
            url: req.url
        }
        if (error) {
            return webview.postMessage({
                ...baseRespondData,
                errorMsg: error.message,
                data: {message: error.message}
            })
        }

        webview.postMessage({
            ...baseRespondData,
            data: data
        })
    }
}

export function registerUrl(url: string, handle: RouteHandle): Route {
    return {url, handle}
}
