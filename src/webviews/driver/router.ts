import { HttpMethod, Request, Respond, Route, ViewServer } from "./interface";

export class RouteDispatcher {
    private urlMap: Map<string, Route> = new Map();
    constructor (urls: Route[]) {
        for (let u of urls) {
            this.urlMap.set(u.url, u);
        }
    }

    mount(webview: ViewServer) {
        webview.onDidReceiveMessage((req: {uuid: string, request: Request}) => {
            console.log(`[IDE] ${req.request.method} ${req.request.url} [${req.uuid}]`)

            let startAt = new Date()
            const respond: Respond = (status: number, data: any) => {
                let respondData: any = {
                    uuid: req.uuid,
                    request: req.request,
                    status: status,
                    statusText: `${status}`,
                    data: data
                }

                const duration = new Date().getTime() - startAt.getTime()
                console.log(`[IDE] ${req.request.method} ${req.request.url} ${status} ${duration}ms [${req.uuid}]`)

                webview.postMessage(respondData)
            }

            const route: Route | undefined = this.urlMap.get(req.request.url)
            if (!route) {
                console.error("接收到来自 webview 的请求，但没有可用的路由，请求信息：", req)
                return respond(404, 'Not found!')
            }

            let httpMethod: string = req.request.method || 'unknown'
            let allowMethod: string = route.method || HttpMethod.get
            if (httpMethod.trim().toLowerCase() !== allowMethod.trim().toLowerCase()) {
                console.error(`接收到来自 webview 的请求，但该路由处理器不接收 ${httpMethod} 类型的请求，请求信息：`, req)
                return respond(400, 'Disallowed request type!')
            }

            route.handle.call(webview, req.request, respond)
        })
    }
}

export function path(method: HttpMethod, url: string, handle: any): Route {
    return {method, url, handle}
}